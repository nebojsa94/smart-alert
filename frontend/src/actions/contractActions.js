import {
  CONTRACT_ID_SUCCESS,
  CONTRACT_ID_REQUEST,
  CONTRACT_ID_ERROR,
} from './actionTypes';
import { apiUrl, testApi } from '../constants/env';

export const getContractIdRequest = () => ({
  type: CONTRACT_ID_REQUEST,
});

export const getContractIdSuccess = (contractId, contractAddress) => ({
  type: CONTRACT_ID_SUCCESS,
  payload: {
    contractId,
    contractAddress,
  },
});

export const getContractIdError = error => ({
  type: CONTRACT_ID_ERROR,
  payload: {
    error,
  },
});

export const getContractId = (name, contractAddress, abi, network) => (dispatch, getState) => {
  dispatch(getContractIdRequest());

  return fetch(testApi + '/api/contract', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "name": "Demo", // Add this to form?
      "address": contractAddress,
      abi,
      network,
    })
  })
    .then(res => res.json())
    .then(contract => {
      console.log(contract);
      // dispatch contract.Name too?
      dispatch(getContractIdSuccess(contract._id, contractAddress));
    });
};