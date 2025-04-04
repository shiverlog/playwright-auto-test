/**
 * Description : portUtils.ts - 📌 사용 가능한 포트를 비동기로 세팅 유틸
 * Author : Shiwoo Min
 * Date : 2024-04-04
 */
import * as net from 'net';

/**
 * 지정된 범위 내에서 사용 가능한 포트를 찾아 반환
 * @param startPort - 시작 포트 번호 (기본값: 4723)
 * @param maxPort - 최대 포트 번호 (기본값: 4800)
 */
export async function getAvailablePort(startPort = 4723, maxPort = 4800): Promise<number> {
  // 개별 포트가 사용 가능한지 확인
  function checkPort(port: number): Promise<boolean> {
    return new Promise(resolve => {
      const server = net
        .createServer()
        .once('error', () => resolve(false))
        .once('listening', () => {
          server.close();
          resolve(true);
        })
        .listen(port);
    });
  }

  for (let port = startPort; port <= maxPort; port++) {
    const isAvailable = await checkPort(port);
    if (isAvailable) return port;
  }

  throw new Error('사용 가능한 포트를 찾을 수 없습니다.');
}
