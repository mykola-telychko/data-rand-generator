const http = require('http');
const urlMod = require('url');

// --- post-srvr.js
const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const params = new URLSearchParams(url.search);

    const numberType = params.get('number');
    const numLen = parseInt(params.get('numlen'));
    const qty = parseInt(params.get('qty'));

    const { pathname } = urlMod.parse(req.url);
    // console.log("\n");
    // console.log('params:::__', pathname, typeof pathname);
    // pathname: '/api/generate',
    // search: '?number=integer&numlen=10&qty=2000',

    // if (pathname === '/') {
    //   fs.readFile('index.html', 'utf8', (err, data) => {
    //     if (err) {
    //       res.writeHead(500, { 'Content-Type': 'text/plain' });
    //       res.end('Internal Server Error');
    //       console.error('Error reading index.html:', err);
    //     } 
    //   });
    // } 

    const maxList = {1:"9", 2:"99","3":"999", 4:"9999",
                     5:[99999, 89990], 6:"999999", 7:"9999999",
                     "8":"99999999","9":"999999999","10":"9999999999",
                     "11":"99999999999","12":"999999999999","13":"9999999999999",
                     "14":"99999999999999","15":"999999999999999","16":"9999999999999999",
                     "17":"99999999999999999","18":"999999999999999999",
                     "19":"9999999999999999999","20":"99999999999999999999"};
    // const maxNumbersJson = generateMaxNumbersJSON(1, 20);


    if (pathname === "/info" || pathname == '/') {
      const infoHtml = `<!DOCTYPE html>
      <html>
      <head>
          <title>INFO</title>
          <style>
              table, th, td {
                  border: 1px solid black; border-collapse: collapse;
              }
              th, td { padding: 15px; text-align: center; }
          </style>
      </head>
      <body>
      <table>
          <tr>
            <th>Code length</th><th>Max value</th>
          </tr>
          <tr><td>1</td><td>9</td></tr>
          <tr><td>2</td><td>99</td></tr>
          <tr><td>3</td><td>999</td></tr>
          <tr><td>4</td><td>9999</td></tr>
          <tr><td>5</td><td>99999</td></tr>
          <tr><th>Params</th><td></td></tr>
          <tr><td>number </td><td>float/number</td></tr>
          <tr><td>numlen </td><td>code length (integer)</td></tr>
          <tr><td>qty </td><td>number of generated values</td></tr>
      </table>
          <pre>Example:</pre>
          <pre>http://${req.headers.host}/api/generate?number=integer&numlen=10&qty=20</pre>
          <pre>Info:</pre>
          <pre>http://${req.headers.host}/info</pre>
      </body>
      </html>`;

      // <th>Qty num in code</th><th>Max number</th>
      //  console.log("info___", infoHtml);
       res.writeHead(200, { 'Content-Type': 'text/html' });
       res.end(infoHtml);
       return;
   } else  if ((!numberType || !numLen || !qty) && (pathname == '/info' && pathname == '/') ) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing required parameters' }));
    return;
  } else {
      // CONDITION 
      // console.log("last else____");
      if (numberType !== 'float' && numberType !== 'integer') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid number type. Allowed values: float, integer',
                                 example: `http://${req.headers.host}/api/generate?number=integer&numlen=10&qty=20` }));
        return;
      }
      res.setHeader('Content-Type', 'application/json');
      const numbers = generateUniqueElArray(numLen, numberType, qty);
      // const numbers  = generateUniqueElArray(maxList[qty], numberType, qty);
      // generateMaxNumbersJSON(numLen)
      console.log(numbers.length, generateMaxNumbersJSON(numLen));
      // res.end(error);
      res.end(JSON.stringify(numbers));
      // CONDITION
  }

});


function generateMaxNumbersJSON(start, end) {
  const result = {};
  for (let i = start; i <= end; i++) {
    result[i] = '9'.repeat(i);
  }
  return JSON.stringify(result);
}

function generateUniqueElArray(numLen, numType, count) {
    const uniqueNames = new Set();
    while ( uniqueNames.size < count ) {
      const num = generateNumber(numLen, numType);
      uniqueNames.add(num);
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

// http://localhost:3001/api/generate?number=integer&numlen=10&qty=2000000
const port = 3001;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// add to assistant-js (from kivi)
// fns generateRandomName or .. pass to args
// const uniqueCodes = generateUniqueCodes(numberOfCodes);
// function generateUnique(count) {
//   const MAX_CODES = 100000; // Maximum unique 5-digit numbers (00000 - 99999)
//   if (count > MAX_CODES) {
//     throw new Error(`Cannot generate more than ${MAX_CODES} unique 5-digit codes.`);
//   }
//   const codes = new Set();
//   while (codes.size < count) {
//     const code = Math.floor(10000 + Math.random() * 90000); // Ensures 5-digit numbers
//     codes.add(code);
//   }
//   return codes;
// }