import { take, all, call, put } from 'redux-saga/effects';
import fetch from 'isomorphic-fetch';
import { SET_CART_ITEMS, SET_CURRENT_USER, SET_ITEM_DETAILS, setItemPrice } from '../actions';

export function* fetchItemPrice(id, currency) {
  const response = yield call(fetch, `http://localhost:8081/prices/${currency}/${id}`);
  const data = yield response.json();
  const price = data[0].price;
  yield put(setItemPrice(id, price));
}

export function* itemPriceSaga () {
  const [ { user }, { items } ] = yield all([
    take(SET_CURRENT_USER),
    take(SET_CART_ITEMS)
  ]);
  yield items.map(item => call(fetchItemPrice, item.id, user.country))
}