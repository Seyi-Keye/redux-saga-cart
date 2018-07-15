import { put, call, take, apply } from 'redux-saga/effects';
import fetch from 'isomorphic-fetch';
import { GET_CURRENT_USER_INFO, setCurrentUser } from '../actions';
import { currentUserSaga } from './currentUserSaga';

describe('CurrentUserSaga Test: ', () => {
  it("tests currentUserSaga Generator function", () => {
    const id = 'Seyi';
    const user = {name: 'Seyi Sromokeye'};
    const json = () => {};
    const response = {json};
    const genObj = currentUserSaga();

    expect(genObj.next().value).toEqual(take(GET_CURRENT_USER_INFO));
    expect(genObj.next({id}).value).toEqual(call(fetch, `http://localhost:8081/user/${id}`));
    expect(genObj.next(response).value).toEqual(apply(response, json));
    expect(genObj.next(user).value).toEqual(put(setCurrentUser(user)));
  });
});