import * as net from "net";

interface IPortScanner {
  port: number | null;
  // status: string;
  scanPort(port: number | null): void;
  vanillaScan(host: string): void;
}

export class PortScanner implements IPortScanner {
  host;
  port;
  //  status;

  constructor(host: string, port: number | null) {
    this.host = host;
    this.port = port;
  }

  //    scanPort(port: number): void {
  //     const socket = new net.Socket();
  //     socket.setTimeout(1000);

  //     socket.on('connect', () => {
  //       console.log(`Port ${this.port} is open`);
  //       socket.destroy();
  //     });

  //     socket.on('timeout', () => {
  //       console.log(`Port ${this.port} is closed`);
  //       socket.destroy();
  //     });

  //     socket.on('error', (err) => {
  //       console.log(`Error on port ${this.port}: ${err.message}`);
  //       socket.destroy();
  //     });

  //     socket.connect(this.port, this.host);

  //   }

  scanPort(port: number): Promise<void> {
    return new Promise((resolve) => {
      const socket = new net.Socket();

      socket.setTimeout(1000);

      socket.on("connect", () => {
        console.log("helloo is it connedted");

        console.log(`Port ${port} is open`);
        socket.destroy();
        resolve();
      });

      socket.on("timeout", () => {
        // Port is considered closed if connection times out
        console.log(`Port ${port} is closed`);
        socket.destroy();
        resolve();
      });

      socket.on("error", () => {
        // Ignore errors for now
        socket.destroy();
        resolve();
      });

      // Connect to the specified host and port
      socket.connect(port, this.host);
    });
  }

  public async vanillaScan(host: string): Promise<void> {
    const minPort = 1;
    const maxPort = 65535;

    console.log(`vanila Scanning host: ${this.host}`);

    const scanPromises: Promise<void>[] = [];

    for (let port = minPort; port <= maxPort; port++) {
      const scanPromise = this.scanPort(port);
      scanPromises.push(scanPromise);
    }

    // Wait for all scans to finish
    await Promise.all(scanPromises);
  }
}
