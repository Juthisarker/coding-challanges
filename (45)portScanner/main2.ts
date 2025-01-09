import * as readline from "readline";
import * as net from "net";
import { PortScanner } from "./portScanner";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "ccscan> ",
});

rl.prompt();

rl.on("line", (line) => {
  const args = line.trim().split(" ");

  //   const host = args[0].split("=")[1];
  //   const port = parseInt(args[1].split("=")[1], 10);

  //   if (args.length !== 2 || !args[0].startsWith('-host=') || !args[1].startsWith('-port=')) {
  //     console.error('Usage: ccscan -host=<host> -port=<port>');
  //     rl.prompt();
  //     return;
  //   }

  console.log("arggss", args);
  console.log("args[0]", args[0]);
  console.log("args[", args[0].startsWith("-host="));

  if (!args[0].startsWith("-host=")) {
    console.error("Usage: ccscan -host=<host> -port=<port>");
    rl.prompt();
    return;
  } else {
    if (args[0]?.startsWith("-host=") && !args[1]?.startsWith("-port=")) {
      console.log("where you go", args[1]);

      const host = args[0].split("=")[1];
      //   const port = parseInt(args[1].split("=")[1], 10);
      const vanilaScanner = new PortScanner(host, null);
      vanilaScanner.vanillaScan(host);
    } else {
      const host = args[0].split("=")[1];
      const port = parseInt(args[1].split("=")[1], 10);
      console.log(`Scanning host: ${host} port: ${port}`);

      const portScanner = new PortScanner(host, port);
      portScanner.scanPort(port);
      rl.prompt();
    }
  }

  //   if (!host || isNaN(port)) {
  //     console.error('Error: Invalid host or port.');
  //     rl.prompt();
  //     return;
  //   }

  //   console.log(`Scanning host: ${host} port: ${port}`);

  //   const socket = new net.Socket();

  //   socket.setTimeout(1000); // 1 second timeout

  //   socket.on('connect', () => {
  //     console.log(`Port ${port} is open`);
  //     socket.end();
  //     rl.prompt();
  //   });

  //   socket.on('timeout', () => {
  //     console.log(`Port ${port} is closed`);
  //     socket.destroy();
  //     rl.prompt();
  //   });

  //   socket.on('error', (err) => {
  //     console.error(`Error connecting to port ${port}: ${err.message}`);
  //     rl.prompt();
  //   });

  //   socket.connect(port, host);
});

rl.on("close", () => {
  console.log("Exiting...");
  process.exit(0);
});
