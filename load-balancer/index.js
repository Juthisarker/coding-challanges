const http = require("http");
const axios = require("axios");

const servers = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
];
let currentIndex = 0;

function getNextServer() {
  currentIndex++;
  if (currentIndex >= servers.length) {
    currentIndex = 0;
  }

  return servers[currentIndex];
}

// Health check
async function healthCheck() {
  console.log("helllll");
  // Loop through servers and health check each one
  for (let i = 0; i < servers.length; i++) {
    try {
      const result = await axios.get(servers[i]);

      // If unhealthy, remove from servers list
      if (result.status !== 200) {
        servers.splice(i, 1);
        i--;
      }
    } catch (error) {
      console.error("Error occurred during health check:", error.message);
    }
    console.log("servers", servers);
  }
}

// Add servers back once they become available
setInterval(async () => {
  let serverAdded = false;
  for (let i = 0; i < servers.length; i++) {
    try {
      const result = await axios.get(servers[i]);
      if (result.status === 200 && !servers.includes(servers[i])) {
        servers.push(servers[i]);
        serverAdded = true;
      }
    } catch (error) {
      console.error("Error occurred while adding server back:", error.message);
    }
  }
  console.log("hoi ping");
  if (serverAdded) {
    console.log("Server added back to pool");
  }
}, 5000);

healthCheck();

const server = http.createServer(async (req, res) => {
  // const target = addresses[currentIndex];

  // console.log(
  //   `Received request for ${req.url}. Proxying request to: ${target}`
  // );

  console.log(`${req.method} request to ${req.url}`);

  // Get next backend server
  const server = getNextServer();
  ///////without using axios
  // const proxy = http.request(server, { method: req.method, headers: req.headers }, (proxyRes) => {
  //   res.writeHead(proxyRes.statusCode, proxyRes.headers);
  //   proxyRes.pipe(res, { end: true });
  // });

  // req.pipe(proxy, { end: true });

  // Forward request
  try {
    const result = await axios.get(server + req.url);
    res.writeHead(result.status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result.data));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Failed to connect to backend");
  }

  //  currentIndex = (currentIndex + 1) % addresses.length;
});

const PORT = 7000;
server.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
});
