const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

async function readAndCombineFiles(filePaths) {
  try {
    const fileData = await Promise.all(
      filePaths.map(async (filePath) => {
        const data = await fs.readFile(filePath, 'utf-8');
        return data.trim().replace(/\t/g, '').split('\n'); 
      })
    );
    const outputFilePath = 'ua_names.json'; 
    const outputFilePath1 = 'ua_allcomb.json'; 

    let list = combinator(fileData[0], fileData[1]);
    // let half = chunkArray(list, 5000000)
        const jsonData = {
            "qtyNames": fileData[0].length,
            "qtyLastNames": fileData[1].length,
            "names": uniqueElArray(fileData[0]), 
            "lastnames": uniqueElArray(fileData[1]),
        };
        // console.log("JSON file created successfully!", jsonData);
        console.log("JSON file created successfully!", list.length);

    // await fs.writeFile(outputFilePath, JSON.stringify(jsonData, null, 2)); 
    await fs.writeFile(outputFilePath1, JSON.stringify({"qty": list.length, "list": list}, null, 2)); 

  } catch (err) {
    console.error("Error processing files:", err);
  }
}

async function handleFile(inputFile, outputFile1, outputFile2) {

  try {
    const data = await fs.readFile(inputFile, 'utf8');
    const parsedData = JSON.parse(data);
    let arr1 = uniqueElArray(parsedData.names);
    let arr2 = uniqueElArray(parsedData.lastnames);

    // const [postcodeData, tpcodesData] = await Promise.all([
    //   fetchPostCode(),
    //   fetchCodesPassAndTP(),
    // ]);
    // const { idpas, tpcode } = tpcodesData;
    // console.log( tpcodesData, "\n", postcodeData);


    const jsonOutput1 = { "qty": half[0].length, "people": half[0] }; 

    console.log( 'jsonOutput combine', "\n",  list);

    // for ( let i = 0; i < half.length; i++ ) {
    //   await fs.writeFile(outputFile1, JSON.stringify(jsonOutput1, null, 2)); 
    //   await fs.writeFile(outputFile2, JSON.stringify(jsonOutput2, null, 2)); 
    // }
  } catch (err) {
    console.error('Error processing file:', err);
  }
}

// Example usage:
const filePaths = [
  './all-names-ua.txt', 
  './lastname-ua.txt'
];
// const filePaths = [
//   './names-sksvcz.txt', 
//   './surename-sksvcz.txt',
//   './addresses.txt',
//   './cities.txt'
// ];

function uniqueElArray(arr) {
    const uniqueArray = [];
    const seenValues = {};
  
    for (const value of arr) {
      if (!seenValues[value]) {
        uniqueArray.push(value);
        seenValues[value] = true;
      }
    }
    return uniqueArray;
}

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
readAndCombineFiles(filePaths);
// handleFile('ua_names.json');

// from https://github.com/mykola-telychko/assistant-js/blob/main/fn-array.js
const chunkArray = (arr, size) => 
  arr.reduce(
    (acc, _, i) => (
      i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc), []
  );