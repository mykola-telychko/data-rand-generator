const http = require('http');
const urlMod = require('url');
const fs = require('fs');
const config = require('./config.json');
const path = require('path');
// const filePath = path.join(__dirname, 'json-store', 'ua_names.json');

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const params = new URLSearchParams(url.search);

    const numberType = params.get('number');
    const toFix = params.get('tofix') != 'rnd' ? parseInt(params.get('tofix')): params.get('tofix');
    const codeLen = parseInt(params.get('codelen'));
    const qty = parseInt(params.get('qty'));
    const typeRes = params.get('type');
    const people = params.get('people');

    const natStore = config.jsonStore;

    // console.log('config::', toFix, typeof toFix);

    const { pathname } = urlMod.parse(req.url);

    // console.log("\n");
    // console.log('params:::__', natStore);
    // pathname: '/api/generate',
    // search: '?number=integer&codelen=10&qty=2000',
    // const maxList = in config.json;
    // const maxNumbersJson = generateMaxNumbersJSON(1, 20);

    // try in function 
    if (pathname === '/favicon.ico') {
      const faviconPath = path.join(__dirname, 'favicon.ico');
      fs.readFile(faviconPath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end();
          return;
        }
        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        res.end(data);
      });
      return;
    }
if (pathname === "/info" || pathname == '/') {

      const infoHtml = `<!DOCTYPE html>
      <html>
      <head>
          <title>INFO</title>
          <style>
              table, th, td { border: 1px solid black; border-collapse: collapse; }
              th, td { padding: 15px; text-align: center; }
              .tittle { color: red; } a {font-family: monospace;}
          </style>
          <link rel="icon" href="favicon.ico" type="image/x-icon">
      </head>
      <body>
      <table>
          <h3>DRG / INFO</h3>
          <pre class="tittle">Numbers:</pre>
            <a target="_blank" href="http://${req.headers.host}/api/generate?number=integer&codelen=10&qty=20">http://${req.headers.host}/api/generate?number=integer&codelen=10&qty=20</a>
            <pre>http://${req.headers.host}/api/generate?number=integer&codelen=10&qty=20&type=passcodes</pre>
            <pre>http://${req.headers.host}/api/generate?number=float&tofix=4&codelen=3&qty=10</pre>
            <pre>http://${req.headers.host}/api/generate?number=float&tofix=rnd&codelen=3&qty=10</pre>
          <pre class="tittle">Info:</pre>
            <pre>http://${req.headers.host}/info</pre>
          <tr>
          <pre class="tittle">Lists:</pre>
            <a target="_blank" href="http://${req.headers.host}/api/list">http://${req.headers.host}/api/list</a>
            <pre></pre>
          <tr>
            <th>Code length</th><th>Values</th><th>Qty combinations</th>
          </tr>
          <tr><td>1</td><td>0-9</td><td>10</td></tr>
          <tr><td>2</td><td>00-99</td><td>100</td></tr>
          <tr><td>3</td><td>000-999</td><td>1000</td></tr>
          <tr><td>4</td><td>0000-9999</td><td>10000</td></tr>
          <tr><td>5</td><td>00000-99999</td><td>100000</td></tr>
          <tr><th>Params</th><td></td></tr>
          <tr><td></td><td>tofix=rnd</td><td>Random float numbers</td></tr>
          <tr><td></td><td>number</td><td>float/number</td></tr>
          <tr><td></td><td>codelen</td><td>code length (integer)</td></tr>
          <tr><td></td><td>qty </td><td>number of generated values</td></tr>
      </table>
      </body>
      </html>`;
      //  console.log("info___", infoHtml);
       res.writeHead(200, { 'Content-Type': 'text/html' });
       res.end(infoHtml);
       return;
} else 
if ( pathname == '/api/generate' || pathname == '/' ) {
 if ((!numberType || !codeLen || !qty) && 
              (pathname == '/info' || pathname == '/') ) {

                // favicon - start
                if (pathname === '/favicon.ico') {
                  const faviconPath = path.join(__dirname, 'favicon.ico');
                  fs.readFile(faviconPath, (err, data) => {
                    if (err) {
                      res.writeHead(404);
                      res.end();
                      return;
                    }
                    res.writeHead(200, { 'Content-Type': 'image/x-icon' });
                    res.end(data);
                  });
                  return;
                }
                // favicon - end 

                // ???
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
      const passCode = generateUniqueElArray(5, numberType, qty, 0, 'passcodes')
      const tpCode = generateUniqueElArray(10, numberType, qty, 0, 'default') // 10 for TaxPay code
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
      } else if (numberType === 'float') {
        res.setHeader('Content-Type', 'application/json');
        const numbers = generateUniqueElArray(codeLen, numberType, qty, toFix, 'float');
        // console.log('toFix::___', toFix, typeof toFix);
        res.end(JSON.stringify(numbers));
      } else {
          // may provoke error 
          res.setHeader('Content-Type', 'application/json');
          const numbers = generateUniqueElArray(codeLen, numberType, qty);
          //++// console.log(numbers.length, generateMaxNumbersJSON(codeLen));
          res.end(JSON.stringify(numbers));
      }
    
      // CONDITION
  }
// } else if (  pathname == '/api/write' ) {
} else if ( checkSubstring(pathname, '/api/write') ) {
  // http://localhost:3001/api/write?key=%22asdasdfsfD%22
  // http://localhost:3001/api/read
        // console.error('api/write:', params);
        console.error('api/write:', params.get('key'));

        const content = params.get('key');
        // const content = 'Some content!';
        // if content already exists stop update
        fs.writeFile('txt.txt', content, err => {
          if (err) {
            console.error(err);
          } else {
            // file written successfully
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end('file written successfully' + content);
          }
        });

} else if ( pathname == '/api/read' ) {

        console.error('api/read:');
        fs.readFile('txt.txt', 'utf8', (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            console.error('Error reading index.html:', err);
          } 
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(data);
        });
     

} else if ( pathname == '/api/list' ) {

  if ( findKeyInArrayOfObjects(natStore, people, false, false) && !typeRes ) {
  
        // console.error('limit:', typeRes);

        const bigJSONnat = findKeyInArrayOfObjects(natStore, people, true);
        const filePath = path.join(__dirname, 'json-store', bigJSONnat);

        // fs.readFile(`./json-store/${bigJSONnat}` , 'utf8', (err, data) => {
        fs.readFile(filePath, 'utf8', (err, data) => {

            if (err) {
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

  } else if ( findKeyInArrayOfObjects(natStore, people, false) && typeRes == 'all' ) {
                // && findKeyInArrayOfObjects(natStore, 'all', false)
        // const bigJSONnat = findKeyInArrayOfObjects(natStore, people, true);
        const all = findKeyInArrayOfObjects(natStore, people, true, true);
        // console.error('ALL:', all, path);
        console.error('ALL:', all, findKeyInArrayOfObjects(natStore, 'all', false));
        const filePath = path.join(__dirname, 'json-store', all);


        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
              if (err.code === 'ENOENT') {
                res.statusCode = 404; 
                res.end('----');
              } else {
                res.statusCode = 500; 
                res.end('Server error; ALL');
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
          <title> LIST</title>
          <style>
              table, th, td { border: 1px solid black; border-collapse: collapse; }
              th, td { padding: 15px; text-align: center; }
              .tittle { color: red; } a {font-family: monospace;} span {font-family: monospace;}
          </style>
          <link rel="icon" href="favicon.ico" type="image/x-icon">
      </head>
      <body>
      <table>
          <h3>DRG / LISTS</h3>
          <pre class="tittle">Numbers:</pre>
            <a target="_blank" href="http://${req.headers.host}/api/generate?number=integer&codelen=10&qty=20">http://${req.headers.host}/api/generate?number=integer&codelen=10&qty=20</a>
            <pre>http://${req.headers.host}/api/generate?number=integer&codelen=10&qty=20&type=passcodes</pre>
            <pre>http://${req.headers.host}/api/generate?number=float&tofix=4&codelen=3&qty=10</pre>
            <pre>http://${req.headers.host}/api/generate?number=float&tofix=rnd&codelen=3&qty=10</pre>

          <pre class="tittle">Info:</pre>
            <a target="_blank" href="http://${req.headers.host}/info">http://${req.headers.host}/info</a>
              <span> or http://${req.headers.host}</span>
            <pre></pre>
          <tr>
          <pre class="tittle">Lists:</pre>
            <pre>http://${req.headers.host}/api/list</pre>
            <pre>http://${req.headers.host}/api/list?people=ua</pre>
            <pre>http://${req.headers.host}/api/list?people=pl</pre>
          <tr>
            <th>Country</th><th>Code</th><th>Max</th>
          </tr>
            <tr><td>Ukraine</td><td>UA</td><td>13871920</td></tr>
            <tr><td>Belarus</td><td>BY</td><td>174960</td></tr>
            <tr><td>Poland</td><td>PL</td><td>819945</td> </tr>
            <tr><td>Czech Republic</td><td>CZ</td><td>662728</td></tr>
            <tr><td>Slovakia</td><td>SK</td><td>1145400</td></tr>
            <tr><td>Bulgaria</td><td>BG</td></tr>
            <tr><td>Croatia</td><td>CR</td><td>2642432</td></tr>
            <tr><td>Bosnia and Herzegovina</td><td>BH</td></tr>
            <tr><td>Montenegro</td><td>MG</td></tr>
            <tr><td>North Macedonia</td><td>MC</td></tr>
            <tr><td>Serbia</td><td>SR</td><td>1056417</td></tr>
            <tr><td>Slovenia</td><td>SV</td><td>54520</td></tr>
            <tr><td>TOTAL</td><td></td><td>20428322</td></tr>

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

// add to assistant-js (from kivi)
function generateUniqueElArray(codeLen, numType, count, tfix = 2, type = 'default') {
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
          // console.log('passcodes', generateRandomString(), num);

          uniqueNum.add(generateRandomString() + num); // pass code 
        }
        return Array.from(uniqueNum);
    } else if ( numType === 'float' ) {
        let uniqueNames ;
        // console.log('float::__', tfix);
        uniqueNames = new Set();
        while ( uniqueNames.size < count ) {
          const num = generateNumber(codeLen, numType, tfix);
          uniqueNames.add(num);
        }
        return Array.from(uniqueNames);
    }
}

function generateNumber(intLen, numType, tofix) {
    if (numType === 'float') {
     
        // console.log('generateNumber::',
        // res, res.toFixed(tofix), tofix, typeof tofix);

        // console.log('rnd::', tofix);
        if ( tofix === 'rnd' ) {
          const min = Math.pow(10, randomIndex(generateSequences(intLen)) - 1); 
          const max = Math.pow(10, randomIndex(generateSequences(intLen))) - 1; 
          res = Math.random() * (max - min) + min;
          const randomDecimalPlaces = Math.floor(Math.random() * 6); 
          return res.toFixed(randomDecimalPlaces);
        } else {
          const min = Math.pow(10, intLen - 1); 
          const max = Math.pow(10, intLen) - 1; 
          res = Math.random() * (max - min) + min;
          return res.toFixed(tofix); 
        }
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
// function combinator(arr1, arr2) {
//   let res = []; let tpIndex = 0;
//   for(let i = 0; i < arr1.length; i++){
//       for(let k = 0; k < arr2.length; k++){
//           res.push(`${arr1[i].trim()} ${arr2[k].trim()}`);
//           tpIndex++;
//       }
//   }
//   return res;
// }

// AST-JS
function findKeyInArrayOfObjects(array, key, returnVal = false, all = false) {

  const foundObject = array.find(obj => Object.keys(obj).includes(key));
  // console.log('foundObject::', foundObject, array, key);
  // console.log('foundObject::', foundObject, key, all);

  if (all) {
    if (foundObject['all']) {
      return returnVal ? foundObject['all'] : true;
    } else {
      return false;
    }
  } else {
    if (foundObject) {
      return returnVal ? foundObject[key] : true;
    } else {
      return false;
    }
  }
   

  
}
// AST-JS
function generateSequences(int) {
  let nu = 3;
  let arr = [];
  // console.log(arr);
  for ( let i = 0; i < nu + 1; i++ ) { arr.push(i); }
  return arr;
}
// AST-JS
const randomIndex = (arr) => { return Math.floor(Math.random() * arr.length);}
// assistant js
function checkSubstring(mainString, subString) {
  return mainString.includes(subString);
}

function getMaxLenNum(){
    let arr = [];
    let codLen = 3;
    // 3 = 999 / 1000 = 000->999
    for (let i = 0; i < 1000; i++) {
      let paddedNumber = String(i).padStart(codLen, '0');
      arr.push(paddedNumber);
    }

    // console.log(arr);
    // from  https://github.com/mykola-telychko/assistant-js
    const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);
    console.log(shuffleArray(arr)); 

    return shuffleArray(arr)
}


const port = 3001;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});