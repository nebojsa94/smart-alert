import {
  CONTRACT_ID_SUCCESS,
  CONTRACT_ID_REQUEST,
  CONTRACT_ID_ERROR,
} from './actionTypes';
import { apiUrl, testApi } from '../constants/env';

export const getContractIdRequest = () => ({
  type: CONTRACT_ID_REQUEST,
});

export const getContractIdSuccess = (contractId, contractAddress, abi) => ({
  type: CONTRACT_ID_SUCCESS,
  payload: {
    contractId,
    contractAddress,
    abi
  },
});

export const getContractIdError = error => ({
  type: CONTRACT_ID_ERROR,
  payload: {
    error,
  },
});

const addContractToLS = (address, abi, id) => {
  let contracts = JSON.parse(localStorage.getItem('contracts') || '[]');
  if (contracts.filter(contract => contract.id === id).length > 0) return;
  contracts.push({ address, abi, id });
  localStorage.setItem('contracts', JSON.stringify(contracts));
};


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
      dispatch(getContractIdSuccess(contract._id, contractAddress, JSON.parse(abi)));
      addContractToLS(contractAddress, abi, contract._id)
    });
};