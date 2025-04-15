/**
 * Description : ChromeSetup.ts - 📌 Android 기반의 Chrome 브라우저 초기 셋업 자동화 유틸리티
 * Author : Shiwoo Min
 * Date : 2024-04-14
 */
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import { execSync } from 'child_process';
import type { Browser } from 'webdriverio';
import type winston from 'winston';
import { PortUtils } from '@common/utils/network/PortUtils';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import fetch from 'node-fetch';
import unzipper from 'unzipper';
import { Readable } from 'stream';

export class ChromeSetup {
  // winston 로깅 인스턴스
  private readonly logger: winston.Logger;
  // 현재 테스트 중인 POC 키
  private readonly poc: string;
  // Appium WebDriverIO 드라이버 인스턴스 (NativeView 제어용)
  private readonly driver: Browser;
  // WebView <-> NativeView 컨텍스트 전환 함수
  private readonly switchContext: (view: string) => Promise<void>;
  // 실제 디바이스의 UDID (ADB/Safari 디버깅 등에서 사용됨)
  private readonly udid: string;

  constructor(driver: Browser, switchContext: (view: string) => Promise<void>, udid: string) {
    this.driver = driver;
    this.switchContext = switchContext;
    this.udid = udid;
    this.poc = POCEnv.getType();
    this.logger = Logger.getLogger(this.poc.toUpperCase()) as winston.Logger;
  }
  // 크롬 자동 다운로드
  private getPlatformFolder(): string {
    const platform = os.platform();
    const arch = os.arch();

    if (platform === 'darwin') {
      return arch === 'arm64' ? 'mac-arm64' : 'mac-x64';
    }
    if (platform === 'linux') {
      return 'linux64';
    }
    if (platform === 'win32') {
      return 'win32';
    }

    throw new Error(`[Chromedriver] 지원되지 않는 플랫폼: ${platform} / ${arch}`);
  }

  /**
   * 디바이스의 크롬 버전 호환성 확인 밒 맞는 Chromedriver 자동 다운로드 처리
   */
  public async syncChromedriver(): Promise<void> {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    try {
      const versionCmd = `adb -s ${this.udid} shell dumpsys package com.android.chrome | grep versionName`;
      const result = execSync(versionCmd, { encoding: 'utf-8' });
      const matched = result.match(/versionName=([\d.]+)/);
      const chromeVersion = matched?.[1] ?? '';

      if (!chromeVersion) {
        this.logger.warn('[Chromedriver] Chrome 버전 탐지 실패');
        return;
      }
      // Chrome 버전에서 major 버전만 추출
      const majorVersion = parseInt(chromeVersion.split('.')[0], 10);
      this.logger.info(`[Chromedriver] Chrome 버전: ${chromeVersion} -> major: ${majorVersion}`);

      const platformFolder = this.getPlatformFolder();

      // 자동으로 가장 가까운 버전의 다운로드 URL 찾기
      const { version: resolvedVersion, url: chromedriverUrl } =
        await this.resolveChromedriverUrl(majorVersion, platformFolder);

      const downloadPath = path.resolve(os.tmpdir(), `chromedriver_${resolvedVersion}.zip`);
      const extractDir = path.resolve(os.tmpdir(), `chromedriver_${resolvedVersion}`);

      const possiblePaths = [
        path.join(extractDir, 'chromedriver'),
        path.join(extractDir, 'chromedriver.exe'),
        path.join(extractDir, platformFolder, 'chromedriver'),
        path.join(extractDir, platformFolder, 'chromedriver.exe'),
        path.join(extractDir, `chromedriver-${platformFolder}`, 'chromedriver'),
        path.join(extractDir, `chromedriver-${platformFolder}`, 'chromedriver.exe'),
      ];
      const existingDriverPath = possiblePaths.find(p => fs.existsSync(p));
      if (existingDriverPath) {
        this.logger.info(`[Chromedriver] 이미 설치된 chromedriver 사용: ${existingDriverPath}`);
        process.env.CHROMEDRIVER_PATH = existingDriverPath;
        return;
      }

      this.logger.info(`[Chromedriver] 다운로드 중: ${chromedriverUrl}`);
      const response = await fetch(chromedriverUrl);
      if (!response.ok || !response.body) {
        throw new Error(`다운로드 실패 또는 본문 없음: ${response.statusText}`);
      }

      this.logger.info('[Chromedriver] 스트림 다운로드 시작');
      await pipeline(
        response.body as NodeJS.ReadableStream,
        fs.createWriteStream(downloadPath)
      );

      this.logger.info('[Chromedriver] 압축 해제 준비');
      await fs.promises.mkdir(extractDir, { recursive: true });

      await fs
        .createReadStream(downloadPath)
        .pipe(unzipper.Extract({ path: extractDir }))
        .promise();
      this.logger.info('[Chromedriver] 압축 해제 완료');

      const extractedDriverPath = possiblePaths.find(p => fs.existsSync(p));
      if (!extractedDriverPath) {
        throw new Error(`[Chromedriver] 실행 파일을 찾을 수 없습니다. 경로: ${extractDir}`);
      }

      fs.chmodSync(extractedDriverPath, 0o755);
      process.env.CHROMEDRIVER_PATH = extractedDriverPath;
      this.logger.info(`[Chromedriver] 실행 권한 부여 및 등록 완료: ${extractedDriverPath}`);
    } catch (e) {
      const errorMessage =
        e instanceof Error
          ? `${e.name}: ${e.message}\n${e.stack}`
          : `Non-Error object: ${JSON.stringify(e)}`;

      this.logger.error('[Chromedriver] 자동 다운로드 실패:', errorMessage);
      console.error('[Chromedriver][DEBUG] Full error object:', e);
    }
  }

  private async resolveChromedriverUrl(
    majorVersion: number,
    platformFolder: string
  ): Promise<{ version: string; url: string }> {
    const versionListUrl =
      'https://googlechromelabs.github.io/chrome-for-testing/known-good-versions-with-downloads.json';

    try {
      this.logger.info(`[Chromedriver] 버전 목록 JSON 요청: ${versionListUrl}`);
      const response = await fetch(versionListUrl);

      if (!response.ok) {
        throw new Error(`버전 목록 요청 실패 (HTTP ${response.status})`);
      }

      const rawText = await response.text();
      this.logger.info('[Chromedriver] JSON 응답 일부:', rawText.slice(0, 300)); // 일부만 로그

      let data: {
        versions: {
          version: string;
          downloads: {
            chromedriver: { platform: string; url: string }[];
          };
        }[];
      };

      try {
        data = JSON.parse(rawText);
      } catch (jsonErr) {
        throw new Error(`JSON 파싱 실패: ${(jsonErr as Error).message}`);
      }

      const matched = data.versions
        .filter(v => v.version.startsWith(`${majorVersion}.`))
        .sort((a, b) => b.version.localeCompare(a.version))[0];

      if (!matched) {
        throw new Error(
          `[Chromedriver] ${majorVersion}대 버전에 해당하는 chromedriver를 찾을 수 없습니다.`
        );
      }

      const download = matched.downloads.chromedriver.find(
        d => d.platform === platformFolder
      );
      if (!download) {
        throw new Error(
          `[Chromedriver] '${platformFolder}' 플랫폼 용 chromedriver가 존재하지 않습니다.`
        );
      }

      this.logger.info(
        `[Chromedriver] 자동 매칭된 버전: ${matched.version}, 다운로드 URL: ${download.url}`
      );
      return { version: matched.version, url: download.url };
    } catch (e) {
      const msg =
        e instanceof Error ? `${e.name}: ${e.message}\n${e.stack}` : String(e);
      this.logger.error(`[Chromedriver] 버전 정보 조회 실패: ${msg}`);
      throw e;
    }
  }

  /**
   * 공통 순서로 Chrome 초기 설정 처리
   */
  async handleChromeSetup(options: { skipWebViewSwitch?: boolean } = {}): Promise<void> {
    const { skipWebViewSwitch = false } = options;
    await this.bringToFrontIfNotVisible();
    await this.switchContext('NATIVE_APP');
    await this.driver.setTimeout({ implicit: 2000 });

    const stepIds = [
      // 로그인 화면에서 계속하기
      'com.android.chrome:id/signin_fre_continue_button',
      // 나의 정보 확인
      'com.android.chrome:id/button_primary',
      // 사용자 알림 확인
      'com.android.chrome:id/ack_button',
      // 예
      'com.android.chrome:id/positive_button',
      // 아니오
      'com.android.chrome:id/negative_button',
      // 권한 허용 버튼
      'com.android.permissioncontroller:id/permission_allow_button',
    ];

  for (const id of stepIds) {
        try {
          const el = await this.driver.$(`id=${id}`);
          if (await el.isDisplayed()) {
            await el.click();
            this.logger.info(`[ChromeSetup] 클릭됨: ${id}`);
          }
        } catch {}
      }

  if (!skipWebViewSwitch) {
      await this.switchContext('NATIVE_APP');
      const contexts = await this.driver.getContexts();
      const contextStrings = contexts.map(c => typeof c === 'string' ? c : c.id ?? '');
      const webviewContext = contextStrings.find(id => id.includes('WEBVIEW'));
      if (webviewContext) {
        await this.switchContext(webviewContext);
        this.logger.info(`[ChromeAccess] WebView 컨텍스트 전환 완료: ${webviewContext}`);
      }
    }
  }

  /**
   * Chrome 앱 데이터 초기화 (ADB shell pm clear)
   */
  clearChromeAppData(): void {
    const packageName = 'com.android.chrome';
    try {
      const result = execSync(`adb -s ${this.udid} shell pm clear ${packageName}`, {
        encoding: 'utf-8',
      });

      if (!result.includes('Success')) {
        this.logger.warn(`[ADB] Chrome clear 실패: ${result}`);
        throw new Error(`Chrome 데이터 초기화 실패`);
      }

      this.logger.info('[ADB] Chrome 앱 데이터 초기화 완료');
    } catch (e) {
      this.logger.error('[ADB] Chrome 데이터 초기화 중 예외:', e);
    }
  }

  /**
   * ADB 포트 포워딩: 사용 가능한 포트 → WebView 디버깅 포트로 연결 (자동 할당)
   */
  public async forwardWebViewPort(): Promise<number> {
    const localPort = await new PortUtils().getAvailablePort();
    const forwardCmd = `adb -s ${this.udid} forward tcp:${localPort} localabstract:chrome_devtools_remote`;
    try {
      execSync(forwardCmd);
      this.logger.info(`[ChromeAccess] WebView 디버깅 포트 포워딩 완료: ${forwardCmd}`);
      return localPort;
    } catch (e) {
      this.logger.error(`[ChromeAccess] 포트 포워딩 실패: ${e}`);
      throw e;
    }
  }

  /**
   * Chrome 앱이 포그라운드에 없을 경우 강제로 앞으로 가져오기
   */
  async bringToFrontIfNotVisible(): Promise<void> {
    try {
      const currentPackage = await this.driver.getCurrentPackage?.();
      if (currentPackage !== 'com.android.chrome') {
        this.logger.info(`[ChromeAccess] 현재 앱 (${currentPackage}) -> Chrome 강제 전환`);
        await this.driver.activateApp('com.android.chrome');
        await this.driver.pause(2000);
      } else {
        this.logger.info(`[ChromeAccess] Chrome이 이미 포그라운드에 있음`);
      }
    } catch (e) {
      this.logger.error('[ChromeAccess] 포그라운드 앱 전환 실패:', e);
    }
  }
}
