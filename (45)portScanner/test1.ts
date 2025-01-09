// index.ts

import * as readline from "readline";
import * as net from "net";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "ccscan> ",
});

rl.prompt();

rl.on("line", (line) => {
  const args = line.trim().split(" ");

  let host = "";
  let timeout = 200; // Default timeout in milliseconds
  let concurrency = 100; // Default number of concurrent scans

  args.forEach((arg) => {
    if (arg.startsWith("-host=")) {
      host = arg.split("=")[1];
    } else if (arg.startsWith("-timeout=")) {
      timeout = parseInt(arg.split("=")[1], 10);
    } else if (arg.startsWith("-concurrency=")) {
      concurrency = parseInt(arg.split("=")[1], 10);
    }
  });

  if (!host) {
    console.error(
      "Usage: ccscan -host=<host> [-timeout=<ms>] [-concurrency=<number>]"
    );
    rl.prompt();
    return;
  }

  console.log(
    `Scanning host: ${host} with timeout: ${timeout}ms and concurrency: ${concurrency}`
  );

  const maxPort = 65535;
  let openPorts: number[] = [];
  let currentPort = 1;
  let activeScans = 0;

  const checkPort = (port: number) => {
    return new Promise<void>((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(timeout);

      socket.on("connect", () => {
        console.log(`Port: ${port} is open`);
        openPorts.push(port);
        socket.end();
        resolve();
      });

      socket.on("timeout", () => {
        socket.destroy();
        resolve();
      });

      socket.on("error", () => {
        socket.destroy();
        resolve();
      });

      socket.connect(port, host);
    });
  };

  const runScan = () => {
    while (activeScans < concurrency && currentPort <= maxPort) {
      activeScans++;
      checkPort(currentPort).then(() => {
        activeScans--;
        if (currentPort <= maxPort) {
          runScan();
        } else if (activeScans === 0) {
          const endTime = process.hrtime(startTime);
          const elapsedTimeInMs = endTime[0] * 1000 + endTime[1] / 1000000;
          console.log(`Scan complete. Open ports: ${openPorts.join(", ")}`);
          console.log(`Elapsed time: ${elapsedTimeInMs.toFixed(2)} ms`);
          rl.prompt();
        }
      });
      currentPort++;
    }
  };

  const startTime = process.hrtime(); // Start the timer
  runScan();
});

rl.on("close", () => {
  console.log("Exiting...");
  process.exit(0);
});
