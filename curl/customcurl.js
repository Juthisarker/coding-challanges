const http = require('http');
const readline = require('readline');

class SimpleCurlClone {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    sendRequest(method, endpoint, data = null) {
        const url = `${this.baseUrl}`;

        const options = {
            method: method.toUpperCase(),
            headers: {
                'User-Agent': 'SimpleCurlClone/1.0',
                'Content-Type': 'application/json', // Adjust content type as needed
            },
        };

        console.log("url",url);
        return new Promise((resolve, reject) => {
            const req = http.request(url, options, (res) => {
                let responseData = '';

                res.on('data', (chunk) => {
                    responseData += chunk;
                });

                res.on('end', () => {
                    const response = {
                        status: res.statusCode,
                        headers: res.headers,
                        data: responseData,
                    };
                    resolve(response);
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (data) {
                req.write(JSON.stringify(data));
            }

            req.end();
        });
    }

    printResponse(response) {
        console.log(`Status Code: ${response.status}`);
        console.log('Headers:');
        Object.entries(response.headers).forEach(([key, value]) => {
            console.log(`  ${key}: ${value}`);
        });
        console.log('Body:');
        console.log(response.data);
    }
}

// Process command-line arguments
// const [, , baseUrl] = process.argv;

// if (!baseUrl) {
//     console.error('Usage: node simpleCurlCloneHttp.js <baseUrl>');
//     process.exit(1);
// }

let baseUrl;
const curlClone = new SimpleCurlClone(baseUrl);
// Set up readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt user for curl command input
rl.question('Enter curl command: ', (curlCommand) => {
    // Extract endpoint from the curl command using regex or other methods

    console.log("curlCommand",curlCommand);
    // const endpointMatch = curlCommand.match(/curl\s+([^ ]+)/);
  //  const endpoint = endpointMatch ? endpointMatch[1] : '';
//   const endpoint = endpointMatch[1];
   const args = curlCommand.split(' ');
   const urlToParseIndex = args.findIndex(arg => !arg.startsWith('-'));
   const urlToParse = urlToParseIndex !== -1 ? args[urlToParseIndex] : null;
   const verboseFlagIndex = args.indexOf('-v') !== -1 || args.indexOf('--verbose') !== -1;

    console.log(" urlToParse", urlToParse );
    const data = null; // For methods like POST and PUT, you can pass data as an object

    curlClone.sendRequest('GET', endpoint, data)
        .then((response) => {
            curlClone.printResponse(response);
            rl.close();
        })
        .catch((error) => {
            console.error(`Error: ${error.message}`);
            rl.close();
        });
});

console.log(" greate now   this.baseUrl", baseUrl );






