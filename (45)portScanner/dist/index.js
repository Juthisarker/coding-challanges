"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const worker_threads_1 = require("worker_threads");
const path_1 = require("path");
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
        }
        else if (arg.startsWith("-timeout=")) {
            timeout = parseInt(arg.split("=")[1], 10);
        }
        else if (arg.startsWith("-concurrency=")) {
            concurrency = parseInt(arg.split("=")[1], 10);
        }
    });
    if (!host) {
        console.error("Usage: ccscan -host=<host> [-timeout=<ms>] [-concurrency=<number>]");
        rl.prompt();
        return;
    }
    console.log(`Scanning host: ${host} with timeout: ${timeout}ms and concurrency: ${concurrency}`);
    const maxPort = 65535;
    let openPorts = [];
    let currentPort = 1;
    const startTime = process.hrtime(); // Start the timer
    const workerPath = (0, path_1.resolve)(__dirname, "./portScannerWorker.js"); // Ensure correct path to the worker JavaScript file
    const runWorker = (startPort, endPort) => {
        return new Promise((resolve) => {
            const worker = new worker_threads_1.Worker(workerPath, {
                workerData: { host, startPort, endPort, timeout },
            });
            worker.on("message", (message) => {
                if (message.portOpen) {
                    openPorts.push(message.port);
                }
            });
            worker.on("error", (err) => {
                console.error(`Worker error: ${err}`);
            });
            worker.on("exit", (code) => {
                if (code !== 0) {
                    console.error(`Worker stopped with exit code ${code}`);
                }
                resolve();
            });
        });
    };
    const runScan = async () => {
        const batchSize = 1000; // Adjust batch size as needed
        while (currentPort <= maxPort) {
            let endPort = Math.min(currentPort + batchSize - 1, maxPort);
            await runWorker(currentPort, endPort);
            currentPort = endPort + 1;
        }
        const endTime = process.hrtime(startTime);
        const elapsedTimeInMs = endTime[0] * 1000 + endTime[1] / 1000000;
        console.log(`Scan complete. Open ports: ${openPorts.join(", ")}`);
        console.log(`Elapsed time: ${elapsedTimeInMs.toFixed(2)} ms`);
        rl.prompt();
    };
    runScan().catch((err) => {
        console.error(`Error during scan: ${err}`);
        rl.prompt();
    });
});
rl.on("close", () => {
    console.log("Exiting...");
    process.exit(0);
});
