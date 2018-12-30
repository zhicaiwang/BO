import TronWeb from 'tronweb';
import {
  getContractServer,
  getUpAmountServer,
} from './server';
import {
  getGameId
} from '../utils';

// 合约地址
const contractAddress = 'TBWg8WjqCBaAcdmJkQg7J1qUgenhEVYqhf';

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
      history.listen(location => {
        if (location.pathname === '/') {
          dispatch({ type: 'getContract' });
        }
      });
    },
  },
  effects: {
    *getContract(_, { call, put }) {
      const contractData = yield call(getContractServer, contractAddress);
      if (contractData) {
        yield put({ type: 'setContract', payload: contractData });
        yield put({ type: 'getUpAmount' });
      }
    },
    *getUpAmount(_, { call, put, select }) {
      const { contract, gameId } = yield select((state) => (state.home));
      const res = contract.getUpAmount(gameId).call();
      // const res = yield call(getUpAmountServer, { contract, gameId});
      console.log(res);
    }
  },
  reducers: {
    // 设置合约
    setContract(state, action) {
      return {
        ...state,
        contract: action.payload,
      };
    },
  },
};
