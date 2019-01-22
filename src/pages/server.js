import { get } from '../utils/fetch';

export async function getBitcoinAmount() {
  return get('/price.json');
}
