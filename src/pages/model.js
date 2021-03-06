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
  getGameId,
  getHistoryGameId,
} from '../utils';
import contracts from '../../build/contracts/BinaryOption.json';

let contract = null;
const gameId = getGameId();

// 合约地址
const contractAddress = 'TMk2vEjKDyTbQMf3C5xYQn5Mhf74K4zPvh';

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
    balance: 0,

    myGame: getHistoryGameId().map((item) => ({ gameId: item })),
    loading: true,
    accountData: {},

    price: {
      today: {
        bitcoin: 0,
      },
      yesterday: {
        bitcoin: 0,
      }
    },
  },
  subscriptions: {
    steup({ dispatch, history }) {
      window.addEventListener('load', function() {

        let tries = 0;

        const tronWebState = {};

        const timer = setInterval(() => {

          if (tries >= 10) {

            clearInterval(timer);

            if (!window.tronWeb) {
              const HttpProvider = TronWeb.providers.HttpProvider;
              const fullNode = new HttpProvider('https://api.trongrid.io');
              const solidityNode = new HttpProvider('https://api.trongrid.io');
              const eventServer = 'https://api.trongrid.io';

              window.tronWeb = new TronWeb(
                fullNode,
                solidityNode,
                eventServer
              );

              return notification.warning({
                message: '温馨提示',
                description: '没有检测到您的钱包数据，请安装 TronLink 或 TronPay 登陆后刷新页面尝试！',
              });
            }

            if (!window.tronWeb.ready) {
              return notification.warning({
                message: '温馨提示',
                description: '发现您 tronWeb 没有准备好，请尝试登陆您的钱包地址再尝试！',
              });
            }

            dispatch({ type: 'updateLoading', payload: false });
          }

          if (!window.tronWeb) {
            tries++;
          }

          // 判断 tronWeb
          if (window.tronWeb && window.tronWeb.ready) {
            const gameIds = getHistoryGameId() || [];
            dispatch({ type: 'getContract' });
            (gameIds || []).forEach((item) => {
              dispatch({ type: 'getBetterPlay', payload: item });
              dispatch({ type: 'getBetterInvested', payload: item });
              dispatch({ type: 'getResult', payload: item });
            });
            clearInterval(timer);
            dispatch({ type: 'getPrice' });
          }

        }, 100);
      })
    },
  },
  effects: {
    *getPrice(_, { call, put }) {
      const res = yield call(getBitcoinAmount);
      yield put({ type: 'updatePrice', payload: res });
    },
    *getContract(_, { call, put }) {
      contract = yield window.tronWeb.contract(contracts.abi, contractAddress);
      if (contract) {
        yield put({ type: 'getContractData' });
      }
    },
    *getAccountData(_, { put }) {
      const address = tronWeb.defaultAddress.base58;
      const res = yield tronWeb.trx.getBalance(address);
      const balance = +tronWeb.fromSun(res);
      yield put({ type: 'updateAccountData', payload: { address, balance }});
    },
    * getContractData(_, { put }) {
      yield put({ type: 'getAccountData' });
      yield put({ type: 'updateLoading', payload: false });
      yield put({ type: 'getUpPoolAmount' });
      yield put({ type: 'getDownPoolAmount' });
      yield put({ type: 'getUpBettersCount' });
      yield put({ type: 'getDownBettersCount' });
      yield put({ type: 'getBalance' });
      yield put({ type: 'getBetterPlay', payload: gameId });
      yield put({ type: 'getBetterInvested', payload: gameId });
      yield put({ type: 'getResult', payload: gameId });
    },
    *getUpPoolAmount(_, { put }) {
      const res = yield contract.getUpAmount(gameId).call();
      if (res) {
        yield put({ type: 'updateUpAmount', payload: window.tronWeb.fromSun(res) });
      }
    },
    *getDownPoolAmount(_, { put }) {
      const res = yield contract.getDownAmount(gameId).call();
      if (res) {
        yield put({ type: 'updateDownAmount', payload: window.tronWeb.fromSun(res) });
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
    *getBalance(_, { put }) {
      const address = window.tronWeb.defaultAddress.base58;
      const res = yield contract.getBalance(address).call();
      if (res) {
        console.log('获取玩家的余额', res, +window.tronWeb.fromSun(res._balance));
        yield put({ type: 'updateBalance', payload: +window.tronWeb.fromSun(res._balance) });
      }
    },
    *getBetterPlay({ payload }, { put }) {
      const address = window.tronWeb.defaultAddress.base58;
      const res = yield contract.getBetterPlay(payload, address).call();
      if (res) {
        yield put({ type: 'updateMyGame', payload: { gameId: payload, date: payload, type: res._result.toNumber() } });
      }
    },
    *getBetterInvested({ payload }, { put }) {
      const address = window.tronWeb.defaultAddress.base58;
      const res = yield contract.getBetterInvested(payload, address).call();
      if (res) {
        yield put({ type: 'updateMyGame', payload: { gameId: payload,  money: +window.tronWeb.fromSun(res._result) } });
      }
    },
    *getResult({ payload }, { put }) {
      const res = yield contract.getResult(payload).call();
      if (res) {
        yield put({ type: 'updateMyGame', payload: { gameId: payload, result: res.toNumber() } });
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
        notification.error({
          message:'下注失败！',
          description: '请重新尝试！',
        });
        yield put({ type: 'updateLoading', payload: false });
      }
    },
    *playerWithdraw(_, { put }){
      const res = yield contract.playerWithdraw().send({
        callValue: 0,
        shouldPollResponse: true,
      });
      if (res) {
        notification.success({
          message:'提现成功！'
        });
        yield put({ type: 'getContractData' });
      } else {
        console.log(res);
        notification.error({
          message:'提现失败！',
          description: '请联系客服或开发者！',
        });
        yield put({ type: 'updateLoading', payload: false });
      }
    }
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
    },
    updateMyGame(state, action) {
      const myGameBack = [].concat(state.myGame);
      for (var i = 0; i < myGameBack.length; i++) {
        if (myGameBack[i].gameId === action.payload.gameId) {
          Object.assign(myGameBack[i], action.payload);
        }
      }
      return {
        ...state,
        myGame: myGameBack,
      };
    },
    updateBalance(state, action) {
      return {
        ...state,
        balance: action.payload,
      };
    },
    updateAccountData(state, action) {
      return {
        ...state,
        accountData: action.payload,
      }
    },
    updatePrice(state, action) {
      return {
        ...state,
        price: action.payload,
      };
    }
  },
};
