const http = require("http");
const url = require("url");

// Function to generate a random string
const generateRandomString = (length = 10) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
};

// Function to generate a random num
const generateRandomNumber = () => Math.floor(Math.random() * 1000);

// Function to generate a random timestamp
const generateRandomUnix = () => Math.floor(Date.now() / 1000 - Math.random() * 315360000); // Random timestamp in the past 10 years

// Function to generate an object based on query parameters
const generateObject = (query) => {
  const result = {};
  for (const [key, type] of Object.entries(query)) {
    if (key === "qty") continue; // Skip 'qty' as it's used for the array size
    if (type === "string") {
      result[key] = generateRandomString();
    } else if (type === "number") {
      result[key] = generateRandomNumber();
    } else if (type === "unix") {
      result[key] = generateRandomUnix();
    } else {
      result[key] = null; // Handle unknown types
    }
  }
  return result;
};

// Create the server
const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url.startsWith("/api/generate")) {
    const queryObject = url.parse(req.url, true).query;

    // Parse quantity
    const qty = parseInt(queryObject.qty, 10) || 1;
    delete queryObject.qty; // Remove qty to focus on object generation

    // Generate array of objects
    const response = Array.from({ length: qty }, () => generateObject(queryObject));

    // Send JSON response
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } else {
    // Handle unsupported routes
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
