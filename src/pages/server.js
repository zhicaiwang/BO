import TronWeb from 'tronweb';

import contracts from '../../build/contracts/BinaryOption.json';

if (!window.tronWeb) {
  const HttpProvider = TronWeb.providers.HttpProvider;
  const fullNode = new HttpProvider('https://api.trongrid.io');
  const solidityNode = new HttpProvider('https://api.trongrid.io');
  const eventServer = 'https://api.trongrid.io/';

  const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
  );

  window.tronWeb = tronWeb;
}

// 获取合约
export function getContractServer(contractAddress) {
  return tronWeb.contract(contracts.abi, contractAddress);
}

// 获取看涨金额
export function getUpAmountServer({ contract, params }) {
  return contract.getUpAmount(params);
}
