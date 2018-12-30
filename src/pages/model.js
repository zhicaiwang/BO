import TronWeb from 'tronweb';
import {
  message,
} from 'antd';
import {
  getContractServer,
  getUpAmountServer,
} from './server';
import {
  getGameId
} from '../utils';
import contracts from '../../build/contracts/BinaryOption.json';

let contract = null;
const gameId = getGameId();

// 合约地址
const contractAddress = 'TMFTUYpBJw9rh6CnUzKd3b7Tvi1BUes42z';

export default {
  namespace: 'home',
  state: {
    gameId: getGameId(),
    totalAmount: 0,
    upPoolAmount: 0,
    downPoolAmount: 0,
    upBettersCount: 0,
    downBettersCount: 0,
    result: 0,
    contract: null,
  },
  subscriptions: {
    steup({ dispatch, history }) {
      window.addEventListener('load', function() {
        if (typeof tronPay !== 'undefined') {
          tronWeb = tronPay.tronWeb || tronWeb
          if (tronWeb.isTronPay && tronWeb.ready) {
            dispatch({ type: 'getContract' });
          }
        } else {
          console.log('No tronWeb? You should install TronPay!')
        }
      })
    },
  },
  effects: {
    *getContract(_, { call, put }) {
      contract = yield tronWeb.contract(contracts.abi, contractAddress);
      if (contract) {
        yield put({ type: 'getContractData' });
      }
    },
    * getContractData(_, { put }) {
      const upAmount = yield contract.getUpAmount(gameId).call();
      const downAmount = yield contract.getDownAmount(gameId).call();
      const balance = yield contract.getContractBalance().call();
      console.log(upAmount);
      console.log(downAmount);
      console.log(balance);
    },
    *getUpAmount(_, { call, put, select }) {
      const res = yield contract.getUpAmount(gameId).call();
      console.log(res);
    },
    *betGame({ payload }, { call, put }) {
      const { type, amount } = payload;
      const res = yield contract.betGame(gameId, type).send({
        payable: false,
        feeLimit: 10000,
        callValue: amount,
      });
      if (res) {
        message.success('投注成功！');
        yield put({ type: 'getContractData' });
      }
    }
  },
  reducers: {

  },
};
