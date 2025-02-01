const http = require('http');
const urlMod = require('url');
const fs = require('fs');
// const jsonfile = require('jsonfile');
const config = require('./config.json');


const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const params = new URLSearchParams(url.search);

    const numberType = params.get('number');
    const codeLen = parseInt(params.get('codelen'));
    const qty = parseInt(params.get('qty'));
    const typeRes = params.get('type');
    const people = params.get('people');

    const natStore = config.jsonStore;
    // console.log('config::', natStore, typeof natStore);


    const { pathname } = urlMod.parse(req.url);

    // console.log("\n");
    // console.log('params:::__', natStore);
    // pathname: '/api/generate',
    // search: '?number=integer&codelen=10&qty=2000',
    // const maxList = in config.json;
    // const maxNumbersJson = generateMaxNumbersJSON(1, 20);

if ( pathname == '/api/generate' || pathname == '/' ) {
  if (pathname === "/info" || pathname == '/') {
    const infoHtml = `<!DOCTYPE html>
    <html>
    <head>
        <title>INFO</title>
        <style>
            table, th, td { border: 1px solid black; border-collapse: collapse; }
            th, td { padding: 15px; text-align: center; }
        </style>
    </head>
    <body>
    <table>
        <pre>Example:</pre>
          <pre>http://${req.headers.host}/api/generate?number=integer&codelen=10&qty=20</pre>
          <pre>http://${req.headers.host}/api/generate?number=integer&codelen=10&qty=20&type=passcodes</pre>
        <pre>Info:</pre>
          <pre>http://${req.headers.host}/info</pre>
        <tr>
        <pre>Lists:</pre>
          <pre>http://${req.headers.host}/api/list</pre>
      <tr>
          <th>Code length</th><th>Max value</th>
        </tr>
        <tr><td>1</td><td>9</td></tr><tr><td>2</td><td>99</td></tr>
        <tr><td>3</td><td>999</td></tr><tr><td>4</td><td>9999</td></tr>
        <tr><td>5</td><td>99999</td></tr>
        <tr><th>Params</th><td></td></tr>
        <tr><td>number </td><td>float/number</td></tr>
        <tr><td>codelen </td><td>code length (integer)</td></tr>
        <tr><td>qty </td><td>number of generated values</td></tr>
    </table>
    </body>
    </html>`;
    //  console.log("info___", infoHtml);
     res.writeHead(200, { 'Content-Type': 'text/html' });
     res.end(infoHtml);
     return;
  } else  if ((!numberType || !codeLen || !qty) && 
              (pathname == '/info' && pathname == '/') ) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing required parameters' }));
                return;
  } else if (typeRes == 'passcodes') {

      // console.log("passcodes else____", typeRes);
      if (!numberType || !codeLen || !qty || !typeRes) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing required parameters [numberType, codelen, qty, typeRes]' }));
        return;
      }
      res.setHeader('Content-Type', 'application/json');
      const passCode = generateUniqueElArray(codeLen, numberType, qty, 'passcodes')
      const tpCode = generateUniqueElArray(10, numberType, qty, 'default') // 10 for TaxPay code
      // const indexAdd = generateNum(5, numberType, qty) // 10 for TaxPay code

      res.end(JSON.stringify({"idpas": passCode, "tpcode": tpCode}));

  } else {
      // CONDITION 
      // console.log("last else____");
      if (numberType !== 'float' && numberType !== 'integer') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid number type. Allowed values: float, integer',
                                example: `http://${req.headers.host}/api/generate?number=integer&codelen=10&qty=20` }));
        return;
      }
      res.setHeader('Content-Type', 'application/json');
      const numbers = generateUniqueElArray(codeLen, numberType, qty);
      //++// console.log(numbers.length, generateMaxNumbersJSON(codeLen));
      res.end(JSON.stringify(numbers));
      // CONDITION

      // if (pathname === '/') {
      //   fs.readFile('index.html', 'utf8', (err, data) => {
      //     if (err) {
      //       res.writeHead(500, { 'Content-Type': 'text/plain' });
      //       res.end('Internal Server Error');
      //       console.error('Error reading index.html:', err);
      //     } 
      //   });
      // } 
  }
} else if ( pathname == '/api/list' ) {

  // if ( people == 'ua' && !typeRes ) {
  // findKeyInArrayOfObjects(array, key, returnVal = false)
  if ( findKeyInArrayOfObjects(natStore, people) && !typeRes ) {

        const bigJSONnat = findKeyInArrayOfObjects(natStore, people, true);
        // console.error('ua:', bigJSONnat);

        // fs.readFile(`./json-store/${bigJSONnat}` , 'utf8', (err, data) => {
        // fs.readFile("./json-store/" + bigJSONnat , 'utf8', (err, data) => {
        fs.readFile("./json-store/ua_names.json" , 'utf8', (err, data) => {

            if (err) {
                // console.error('Помилка читання файлу:', err);
                if (err.code === 'ENOENT') {
                  res.statusCode = 404; 
                  res.end('File not found');
                } else {
                  res.statusCode = 500; 
                  res.end('Server error');
                }
                return;
            }
        
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
        });

  } else if ( people == 'ua' && typeRes == 'all' ) {
  // } else if ( people inclides ['ua', 'pl'] && typeRes == 'all' ) {

        fs.readFile('./json-store/ua_names.json', 'utf8', (err, data) => {
          if (err) {
              if (err.code === 'ENOENT') {
                res.statusCode = 404; 
                res.end('Файл не знайдено');
              } else {
                res.statusCode = 500; 
                res.end('Помилка сервера');
              }
              return;
          }
          let {names, lastnames} = JSON.parse(data);
          // let list = combinator(names, lastnames);
          // console.error('all файлу:', list, typeof list);


          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          // res.end( JSON.stringify({"list": list}));
          res.end(data);
      });
  } else {

      const infoHtml = `<!DOCTYPE html>
      <html>
      <head>
          <title>LIST</title>
          <style>
              table, th, td { border: 1px solid black; border-collapse: collapse; }
              th, td { padding: 15px; text-align: center; }
          </style>
      </head>
      <body>
      <table>
          <h3> LISTS </h3>
          <pre>Example:</pre>
            <pre>http://${req.headers.host}/api/generate?number=integer&codelen=10&qty=20</pre>
            <pre>http://${req.headers.host}/api/generate?number=integer&codelen=10&qty=20&type=passcodes</pre>
          <pre>Info:</pre>
            <pre>http://${req.headers.host}/info</pre>
          <tr>
          <pre>Lists:</pre>
            <pre>http://${req.headers.host}/api/list</pre>
          <tr>
          <pre>Lists:</pre>
            <pre>http://${req.headers.host}/api/list?people=ua</pre>
            <pre>http://${req.headers.host}/api/list?people=pl</pre>
          <tr>

            <th>Country</th><th>Code</th>
          </tr>
            <tr><td>Ukraine</td><td>UA</td></tr>
            <tr><td>Belarus</td><td>BY</td></tr>
            <tr><td>Poland</td><td>PL</td></tr>
            <tr><td>Czech Republic</td><td>CZ</td></tr>
            <tr><td>Slovakia</td><td>SK</td></tr>
            <tr><th>Items</th><td></td></tr>
            <tr><td> </td><td>MALE NAME</td></tr>
            <tr><td> </td><td>FEMALE NAME</td></tr>
            <tr><td> </td><td>LASTNAME</td></tr>
      </table>
      </body>
      </html>`;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(infoHtml);
      return;
  }
}





});


function generateMaxNumbersJSON(start, end) {
  const result = {};
  for (let i = start; i <= end; i++) {
    result[i] = '9'.repeat(i);
  }
  return JSON.stringify(result);
}

// add to assistant-js (from kivi)
function generateUniqueElArray(codeLen, numType, count, type = 'default') {
    // let uniqueNames ;
    if ( type === 'default' ) {
        let uniqueNames ;
        uniqueNames = new Set();
        while ( uniqueNames.size < count ) {
          const num = generateNumber(codeLen, numType);
          uniqueNames.add(num);
        }
        return Array.from(uniqueNames);

    } else if ( type === 'passcodes' ) {
        let uniqueNum = new Set();
        while ( uniqueNum.size < count ) {
          const num = generateNumber(codeLen, numType);
          uniqueNum.add(generateRandomString() + num); // pass code 
        }
        // console.log('passcodes', generateRandomString(), num);
        return Array.from(uniqueNum);
    }  
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
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
};
function combinator(arr1, arr2) {
  let res = []; let tpIndex = 0;
  for(let i = 0; i < arr1.length; i++){
      for(let k = 0; k < arr2.length; k++){
          res.push(`${arr1[i].trim()} ${arr2[k].trim()}`);
          tpIndex++;
      }
  }
  return res;
}

function findKeyInArrayOfObjects(array, key, returnVal = false) {
  const foundObject = array.find(obj => Object.keys(obj).includes(key));

  if (foundObject) {
    return returnVal ? foundObject[key] : true;
  } else {
    return false;
  }
}

// http://localhost:3001/api/list?people=ua 
// http://localhost:3001/api/list?people=ua&type=all
// http://localhost:3001/api/generate?number=integer&codelen=10&qty=2000000
// https://data-rand-generator.vercel.app/api/generate?number=integer&codelen=10&qty=20
// http://localhost:3001/api/generate?number=integer&codelen=10&qty=20&type=passcodes
const port = 3001;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});