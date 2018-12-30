import TronWeb from 'tronweb';
import { getGameId } from '../utils';

import contracts from '../../build/contracts/BinaryOption.json';

let contract = null;
const gameId = getGameId();

// 获取合约
export function getContractServer(contractAddress) {
  contract = tronWeb.contract(contracts.abi, contractAddress);
  return contract;
}

// 获取看涨金额
export function getUpAmountServer() {
  return contract.getUpAmount(gameId).call();
}
