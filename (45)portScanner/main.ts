import { PortScanner } from "./portScanner";
const args = process.argv.slice(2);

// Check if there are enough arguments

console.log("args", args);

//if (args.length !== 4 || args[0] !== '-host' || args[2] !== '-port') {
if (args[0] !== "-host") {
  console.log("Usage: ts-node PortScanner.ts -host <hostname> -port <port>");
}
// else if(args.length !== 2 || args[0] !== '-host'){

// }
else {
  if (args[2] !== "-port") {
    /////vanillaScan()
    const host = args[1] as string;
    const vanilaScanner = new PortScanner(host, null);
    vanilaScanner.vanillaScan(host);
  } else {
    const host = args[1];
    const port = parseInt(args[3], 10);
    console.log(`Scanning host: ${host} port: ${port}`);

    const portScanner = new PortScanner(host, port);
    portScanner.scanPort(port);
  }
}
