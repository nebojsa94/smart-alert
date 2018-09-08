import {
  CONTRACT_ID_SUCCESS,
  CONTRACT_ID_REQUEST,
  CONTRACT_ID_ERROR,
} from './actionTypes';
import { apiUrl, testApi } from '../constants/env';

export const getContractIdRequest = () => ({
  type: CONTRACT_ID_REQUEST,
});

export const getContractIdSuccess = (contractId) => ({
  type: CONTRACT_ID_SUCCESS,
  payload: {
    contractId,
  },
});

export const getContractIdError = error => ({
  type: CONTRACT_ID_ERROR,
  payload: {
    error,
  },
});

export const getContractId = (name, address, abi, network) => (dispatch, getState) => {
  dispatch(getContractIdRequest());

  return fetch(testApi)
    .then(res => res.json())
    .then(json => {
      console.log(json);
    });
};