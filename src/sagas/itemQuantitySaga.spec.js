import { takeLatest, select, call, put } from 'redux-saga/effects';
import fetch from 'isomorphic-fetch';
import { fromJS } from 'immutable';

import { cloneableGenerator } from "redux-saga/utils";
import {  INCREASE_ITEM_QUANTITY, DECREASE_ITEM_QUANTITY,setItemQuantityFetchStatus, decreaseItemQuantity, FETCHING, FETCHED } from '../actions';
import { currentUserSelector } from '../selectors';
import { itemQuantitySaga, handleIncreasedItemQuantity, handleDecreasedItemQuantity } from './itemQuantitySaga';

describe("itemQuantitySaga Test:", () => {
  let item;
  let user;

  beforeEach(() => {
    item = {id: 'seyi'};
    user = fromJS({id: 'keye'});
  });

  describe("handle increase item quantity", () => {
    let genObj;

    beforeEach(() => {
      genObj = handleIncreasedItemQuantity(item);
      expect(genObj.next().value).toEqual(put(setItemQuantityFetchStatus(FETCHING)));
      expect(genObj.next().value).toEqual(select(currentUserSelector));
      expect(genObj.next(user).value).toEqual(call(fetch, `http://localhost:8081/cart/add/keye/seyi`))
    });

      it("increased item quantity successfully", () => {
        expect(genObj.next({status: 200}).value).toEqual(put(setItemQuantityFetchStatus(FETCHED)));
      });
      it("increased item quantity unsuccessfully", () => {
        expect(genObj.next({status: 500}).value).toEqual(put(decreaseItemQuantity(item.id, true)));
        expect(genObj.next().value).toEqual(put(setItemQuantityFetchStatus(FETCHED)));
      });
    });

  describe("handle decrease item quantity", () => {
    let genObj;

    beforeEach(() => {
      genObj = handleDecreasedItemQuantity(item);
      expect(genObj.next().value).toEqual(put(setItemQuantityFetchStatus(FETCHING)));
      expect(genObj.next().value).toEqual(select(currentUserSelector));
      expect(genObj.next(user).value).toEqual(call(fetch, 'http://localhost:8081/cart/remove/keye/seyi'));
    });

    it("decreased item successful", () => {
      expect(genObj.next({status: 200}).value).toEqual()
    });

    it("decreased item unsuccessful", () => {});
  });

  let genObj = cloneableGenerator(itemQuantitySaga)();
  expect(genObj.next().value).toEqual(
    [
    takeLatest(DECREASE_ITEM_QUANTITY, handleDecreasedItemQuantity),
    takeLatest(INCREASE_ITEM_QUANTITY, handleIncreasedItemQuantity)
  ]);
});
