const http = require('http');

// http://localhost:3000/api/generate?number=integer&numlen=7&qty=7700000&type=idpass
const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const params = new URLSearchParams(url.search);

    const numberType = params.get('number');
    const numLen = parseInt(params.get('numlen'));
    const qty = parseInt(params.get('qty'));
    const typeRes = params.get('type');

    if (!numberType || !numLen || !qty || !typeRes) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing required parameters [numberType, numLen, qty, typeRes]' }));
        return;
    }

    if (numberType !== 'float' && numberType !== 'integer') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid number type. Allowed values: float, integer' }));
        return;
    }
    res.setHeader('Content-Type', 'application/json');

    const numbers = generateUniqueElArray(numLen, numberType, qty)
    res.end(JSON.stringify(numbers));
});

// add to assistant-js (from kivi)
// fns generateRandomName or .. pass to args
function generateUniqueElArray(numLen, numType, count) {
    const uniqueNames = new Set();

    while (uniqueNames.size < count) {
      const name = generateNumber(numLen, numType);
      uniqueNames.add(generateRandomString() + name);
    }
    return Array.from(uniqueNames);
}

function generateNumber(intLen, numType) {
  if (numType === 'float') {
    const min = Math.pow(10, intLen - 1); 
    const max = Math.pow(10, intLen) - 1; 
    return Math.random() * (max - min) + min; 
  } else if (numType === 'integer') {
    const min = Math.pow(10, intLen - 1); 
    const max = Math.pow(10, intLen) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

const generateRandomString = (length = 2) => {
    // const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    // (length = 2, 'upper') / (length = 2, 'mix') / (length = 2, 'string') / (length = 2, 'int')
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
};


const port = 3000;
server.listen(port, () => {
  console.log(`Server idpass on port ${port}`);
});