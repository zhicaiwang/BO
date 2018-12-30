const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider('http://127.0.0.1:8090');    //Your local TVM URL
const solidityNode = new HttpProvider('http://127.0.0.1:8091');
const eventServer = 'http://127.0.0.1:8092';
const privateKey = '534d83b2445502499adc1e2dc409ad6fbadafcbaacfaeb769b409b17a3e9a47a';

//var bigInt = require("big-integer");

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    privateKey
);

async function changestate(){

  // let contractAddress = 'TFGYQqaP8twAGngFwAXZf1ML6LUrNY1KmC';   //Your address
  // let contract = await tronWeb.contract().at(contractAddress);
  // let resultPost = await contract.postMessage("TRON to the Future").send();
  // let resultGet = await contract.getMessage().call();
  // console.log('resultGet: ', resultGet);

  let contractAddress = 'TMFTUYpBJw9rh6CnUzKd3b7Tvi1BUes42z';   //Your address
  let contract = await tronWeb.contract().at(contractAddress);
  //let resultPost = await contract.addGame(1, 1545279337000, 1545298337000).send();
  let resultGet = await contract.getContractBalance().call();
  //var q = new bigInt(resultGet, 16);
  //console.log(resultGet.toString());

  console.log('resultGet: ', resultGet);
}

changestate()
