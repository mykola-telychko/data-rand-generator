const http = require('http');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const params = new URLSearchParams(url.search);

  const numberType = params.get('number');
  const numLen = parseInt(params.get('numlen'));
  const qty = parseInt(params.get('qty'));

  if (!numberType || !numLen || !qty) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing required parameters' }));
    return;
  }

  if (numberType !== 'float' && numberType !== 'integer') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid number type. Allowed values: float, integer' }));
    return;
  }

  res.setHeader('Content-Type', 'application/json');


  // const numbers = [];
  // for (let i = 0; i < qty; i++) {
  //   numbers.push(generateNumber());
  // }
  const numbers = generateUniqueElArray(numLen, numberType, qty)

  res.end(JSON.stringify(numbers));
});

// add to assistant-js (from kivi)
// fns generateRandomName or .. pass to args
function generateUniqueElArray(numLen, numType, count) {
    const uniqueNames = new Set();

    while (uniqueNames.size < count) {
      const name = generateNumber(numLen, numType);
      uniqueNames.add(name);
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


const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});