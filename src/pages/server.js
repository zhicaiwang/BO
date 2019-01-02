import TronWeb from 'tronweb';
import { getGameId } from '../utils';
import axios from 'axios';

import contracts from '../../build/contracts/BinaryOption.json';

let contract = null;
const gameId = getGameId();
