import { takeLatest, select, call, put } from 'redux-saga/effects';
import fetch from 'isomorphic-fetch';
import {  INCREASE_ITEM_QUANTITY, DECREASE_ITEM_QUANTITY,setItemQuantityFetchStatus, decreaseItemQuantity, FETCHING, FETCHED } from '../actions';
import { currentUserSelector } from '../selectors';

export function* handleIncreasedItemQuantity ({id}) {
  yield put(setItemQuantityFetchStatus(FETCHING));
  const user = yield select(currentUserSelector);
  const response = yield call(fetch, `http://localhost:8081/cart/add/${user.get('id')}/${id}`);

  if(response.status !== 200) {
    yield put(decreaseItemQuantity(id, true));
    alert("Sorry, item in store not enough")
  }

  yield put(setItemQuantityFetchStatus(FETCHED));
}

export function* handleDecreasedItemQuantity ({id, local}) {
  if (local) return;
  yield put(setItemQuantityFetchStatus(FETCHING));
  const user = yield select(currentUserSelector);
  const response = yield call(fetch, `http://localhost:8081/cart/remove/${user.get('id')}/${id}`);

  if(response.status !== 200) {
    alert("Sorry, item in store not enough", response)
  }

  yield put(setItemQuantityFetchStatus(FETCHED));
}

export function* itemQuantitySaga () {
  yield [
    takeLatest(DECREASE_ITEM_QUANTITY, handleDecreasedItemQuantity),
    takeLatest(INCREASE_ITEM_QUANTITY, handleIncreasedItemQuantity)
  ]
}