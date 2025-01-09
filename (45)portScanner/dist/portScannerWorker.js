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
const worker_threads_1 = require("worker_threads");
const net = __importStar(require("net"));
const { host, startPort, endPort, timeout } = worker_threads_1.workerData;
const checkPort = (port) => {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(timeout);
        socket.on('connect', () => {
            worker_threads_1.parentPort?.postMessage({ portOpen: true, port });
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
const scanPorts = async (startPort, endPort) => {
    for (let port = startPort; port <= endPort; port++) {
        await checkPort(port);
    }
};
scanPorts(startPort, endPort).then(() => {
    worker_threads_1.parentPort?.close();
}).catch((err) => {
    console.error(`Error in worker: ${err}`);
    worker_threads_1.parentPort?.close();
});
