const net = require('net');
const url = require('url');

function customCurl(urlString, verbose = false) {
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

        if (verbose) {
            // Print the request headers if verbose is enabled
            console.log(`> ${requestString.trim()}`);
        }

        // Send the HTTP request to the server
        socket.write(requestString);
    });

    // Variables to store response data
    let responseData = '';
    let headersPrinted = false;

    // Handle data received from the server
    socket.on('data', (data) => {
        // Append the data to the response
        responseData += data.toString();

        // Check if headers are received
        if (!headersPrinted && responseData.includes('\r\n\r\n')) {
            // Headers are received, print them if verbose is enabled
            if (verbose) {
                const [responseHeaders, responseBody] = responseData.split('\r\n\r\n');
                console.log(`< ${responseHeaders.trim()}`);
                console.log(responseBody);
            } else {
                console.log(responseData);
            }

            // Mark headers as printed
            headersPrinted = true;

            // Close the socket connection after receiving the response
            socket.end();
        }
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

// Read the URL and optional verbose flag from the command line arguments
const args = process.argv.slice(2);
const urlToParseIndex = args.findIndex(arg => !arg.startsWith('-')); // Find the first argument not starting with '-'
const urlToParse = urlToParseIndex !== -1 ? args[urlToParseIndex] : null;
const verboseFlagIndex = args.indexOf('-v') !== -1 || args.indexOf('--verbose') !== -1;

if (!urlToParse) {
    console.error('Please provide a URL.');
    process.exit(1);
}

// Run the customCurl function with the provided URL and verbose flag
customCurl(urlToParse, verboseFlagIndex);
