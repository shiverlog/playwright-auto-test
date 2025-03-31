import * as net from 'net';

export async function getAvailablePort(startPort = 4723, maxPort = 4800): Promise<number> {
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
