const readline = require('readline');
const http = require('http');
const net = require('net');
const url = require('url');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function handleUserInput(curlCommand){
    // console.log("curl command", curlCommand);
    // console.log("curl command",typeof curlCommand);
// const url = curlCommand.match(/curl\s+([^ ]+)/);
// console.log("url ", url);
const args = curlCommand.split(' ');
const curlParseIndex = args.findIndex(arg => !arg.startsWith('-'));
const curlToParse = curlParseIndex !== -1 ? args[curlParseIndex] : null;
const verboseFlagIndex = args.indexOf('-v') !== -1 || args.indexOf('--verbose') !== -1;
const urlToParse = args.pop();
//  console.log(" urlToParse", curlToParse );
//  console.log(" urlToParse", urlToParse );
sendRequest(urlToParse, verboseFlagIndex);
}


function sendRequest(urlString, verbose = false) {
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


// function sendRequest(requestUrl){
//     const parsedUrl = new URL(requestUrl);
//     const protocol = parsedUrl.protocol.replace(':', '');
//     const host = parsedUrl.hostname;
//     const port = parsedUrl.port || (protocol === 'https' ? 443 : 80);
//     const path = parsedUrl.pathname + parsedUrl.search;

//     console.log("");
//     // Construct the request headers
//     const requestHeaders = {
//         Host: host,
//         Accept: '*/*',
//     };

//     // Create the HTTP request options
//     const requestOptions = {
//         hostname: host,
//         port,
//         path,
//         method: 'GET',
//         headers: requestHeaders,
//     };

//     // Print connecting message
//     console.log(`connecting to ${host}`);

//     // Create the HTTP request
//     const req = http.request(requestOptions, (res) => {
//         // Print the request headers
//         console.log(`Sending request ${requestOptions.method} ${requestOptions.path} HTTP/1.1`);
//         for (const [key, value] of Object.entries(requestHeaders)) {
//             console.log(`${key}: ${value}`);
//         }

//         // Handle data chunks (optional)
//         res.on('data', (chunk) => {
//             // You can handle response data here if needed
//         });

//         // Handle the end of the response (optional)
//         res.on('end', () => {
//             // You can perform additional actions on the response end if needed
//         });
//     });

//     // Handle errors
//     req.on('error', (error) => {
//         console.error(`Error: ${error.message}`);
//     });

//     // End the request
//     req.end();
// }
    
function userPrompt(){
    rl.question('shell>', (input) => {
        const clearedInput = input.trim();
        handleUserInput(clearedInput);
      });
}

userPrompt();