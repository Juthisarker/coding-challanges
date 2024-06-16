const net = require('net');
const url = require('url');

function customCurl(urlString) {
    const parsedUrl = new URL(urlString);

    // Extract protocol, host, port, and path
    const protocol = parsedUrl.protocol.replace(':', '');
    const host = parsedUrl.hostname;
    const port = parsedUrl.port || (protocol === 'https' ? 443 : 80);
    const path = parsedUrl.pathname + parsedUrl.search;

    // Construct the request headers
    const requestHeaders = {
        Host: host,
        Accept: '*/*',
        Connection: 'close', // Specify to close the connection after the request
    };

    // Create the HTTP request string
    const requestString = `GET ${path} HTTP/1.1\r\n` +
                          `Host: ${host}\r\n` +
                          `Accept: */*\r\n` +
                          `Connection: close\r\n\r\n`;

    // Create a TCP socket connection to the server
    const socket = net.createConnection({ host, port }, () => {
        // Print connecting message
        console.log(`connecting to ${host}`);

        // Send the HTTP request to the server
        socket.write(requestString);
    });

    // Handle data received from the server
    socket.on('data', (data) => {
        // Print the response from the server
        console.log(data.toString());

        // Close the socket connection after receiving the response
        socket.end();
    });

    // Handle socket connection errors
    socket.on('error', (error) => {
        console.error(`Error: ${error.message}`);
    });

    // Handle socket connection closure
    socket.on('end', () => {
        console.log('Connection closed');
    });
}

// Read the URL from the command line arguments
const args = process.argv.slice(2);
const urlToParse = args[0];

if (!urlToParse) {
    console.error('Please provide a URL.');
    process.exit(1);
}

// Run the customCurl function with the provided URL
customCurl(urlToParse);
