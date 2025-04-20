/**
 * Description : VideoAnalyzer.ts - 📌 측정 결과를 Google Sheets에 업데이트하는 클래스
 * Author : Shiwoo Min
 * Date : 2025-04-18
 */
import { Logger } from '@common/logger/customLogger.js';
import { POCEnv } from '@common/utils/env/POCEnv.js';
import fs from 'fs';
import cv2 from 'opencv4nodejs';
import path from 'path';
import type winston from 'winston';

export class VideoAnalyzer {
  private videoPath: string;
  private spinnerImagePath: string;
  private outputFolder: string;
  private fps: number;
  private frameInterval: number;
  private threshold: number;

  constructor(
    videoPath: string,
    spinnerImagePath: string,
    outputFolder: string,
    threshold = 0.9,
    intervalSec = 0.05,
  ) {
    this.videoPath = videoPath;
    this.spinnerImagePath = spinnerImagePath;
    this.outputFolder = outputFolder;
    this.threshold = threshold;

    const cap = new cv2.VideoCapture(videoPath);
    this.fps = cap.get(cv2.CAP_PROP_FPS);
    this.frameInterval = Math.max(Math.floor(this.fps * intervalSec), 1);

    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }
  }

  /**
   * 영상에서 일정 간격으로 프레임을 찾아 내려쓰는 메서드
   */
  private extractFrames(): string[] {
    const cap = new cv2.VideoCapture(this.videoPath);
    const frameFiles: string[] = [];
    let frameCount = 0;

    while (true) {
      const frame = cap.read();
      if (frame.empty) break;

      if (frameCount % this.frameInterval === 0) {
        const filename = path.join(
          this.outputFolder,
          `frame_${(frameCount / this.fps).toFixed(2)}.jpg`,
        );
        cv2.imwrite(filename, frame);
        frameFiles.push(filename);
      }

      frameCount++;
    }

    cap.release();
    return frameFiles;
  }

  /**
   * 프레임에서 지정한 스피너 이미지가 포함되어 있는지 검사
   */
  private detectSpinner(framePath: string, spinnerTemplate: cv2.Mat): boolean {
    const frame = cv2.imread(framePath);
    if (frame.empty) return false;

    const result = frame.matchTemplate(spinnerTemplate, cv2.TM_CCOEFF_NORMED);
    const minMax = result.minMaxLoc();
    return minMax.maxVal > this.threshold;
  }

  /**
   * 영상의 프레임들을 검사하여 스피너 검사 결과 목록을 반환
   */
  public analyzeSpinner(): string | null {
    const spinnerTemplate = cv2.imread(this.spinnerImagePath);
    const frames = this.extractFrames();

    for (const framePath of frames) {
      if (this.detectSpinner(framePath, spinnerTemplate)) {
        console.log(`✅ Spinner detected at: ${framePath}`);
        return framePath;
      }
    }

    console.log('❌ No spinner detected.');
    return null;
  }
}
