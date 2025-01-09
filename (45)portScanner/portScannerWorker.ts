import { parentPort, workerData } from 'worker_threads';
import * as net from 'net';

const { host, startPort, endPort, timeout } = workerData;

const checkPort = (port: number) => {
  return new Promise<void>((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);

    socket.on('connect', () => {
      parentPort?.postMessage({ portOpen: true, port });
      socket.end();
      resolve();
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve();
    });

    socket.on('error', () => {
      socket.destroy();
      resolve();
    });

    socket.connect(port, host);
  });
};

const scanPorts = async (startPort: number, endPort: number) => {
  for (let port = startPort; port <= endPort; port++) {
    await checkPort(port);
  }
};

scanPorts(startPort, endPort).then(() => {
  parentPort?.close();
}).catch((err) => {
  console.error(`Error in worker: ${err}`);
  parentPort?.close();
});
