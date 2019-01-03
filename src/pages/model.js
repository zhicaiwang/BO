import TronWeb from 'tronweb';
import {
  Modal,
  Spin,
  message,
  notification,
} from 'antd';
import {
  getBitcoinAmount,
} from './server';
import {
  getGameId
} from '../utils';
import contracts from '../../build/contracts/BinaryOption.json';

let contract = null;
const gameId = getGameId();

// 合约地址
const contractAddress = 'TUY6vd4SWnqLwnxP48P7YbhZ7f3fEhNwx7';

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

    loading: true,
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
      yield put({ type: 'updateLoading', payload: false });
      yield put({ type: 'getUpPoolAmount' });
      yield put({ type: 'getDownPoolAmount' });
      yield put({ type: 'getUpBettersCount' });
      yield put({ type: 'getDownBettersCount' });
    },
    *getUpPoolAmount(_, { put }) {
      const res = yield contract.getUpAmount(gameId).call();
      if (res) {
        yield put({ type: 'updateUpAmount', payload: tronWeb.fromSun(res) });
      }
    },
    *getDownPoolAmount(_, { put }) {
      const res = yield contract.getDownAmount(gameId).call();
      if (res) {
        yield put({ type: 'updateDownAmount', payload: tronWeb.fromSun(res) });
      }
    },
    *getUpBettersCount(_, { put }) {
      const res = yield contract.getUpBettersCount(gameId).call();
      if (res) {
        yield put({ type: 'updateUpBettersCount', payload: res.toNumber() });
      }
    },
    *getDownBettersCount(_, { put }) {
      const res = yield contract.getDownBettersCount(gameId).call();
      if (res) {
        yield put({ type: 'updateDownBettersCount', payload: res.toNumber() });
      }
    },
    *betGame({ payload }, { call, put }) {
      const { type, amount } = payload;
      Modal.confirm({
        title: '温馨提示',
        content: (
          <div>
            <Spin /> 正在等待合约节点确认事务，请稍后..
          </div>
        ),
        onOk: () => {}
      });
      const res = yield contract.betGame(gameId, type).send({
        callValue: amount,
        shouldPollResponse: true,
      });
      if (res) {
        notification.success({
          message:'投注成功！'
        });
        console.log('下注成功，txId：', res);
        yield put({ type: 'getContractData' });
      } else {
        console.log(res);
        yield put({ type: 'updateLoading', payload: false });
      }
    },
  },
  reducers: {
    updateUpAmount(state, action) {
      return {
        ...state,
        upPoolAmount: +action.payload,
      };
    },
    updateDownAmount(state, action) {
      return {
        ...state,
        downPoolAmount: +action.payload,
      };
    },
    updateUpBettersCount(state, action) {
      return {
        ...state,
        upBettersCount: +action.payload,
      };
    },
    updateDownBettersCount(state, action) {
      return {
        ...state,
        downBettersCount: +action.payload,
      };
    },
    updateLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      }
    }
  },
};
