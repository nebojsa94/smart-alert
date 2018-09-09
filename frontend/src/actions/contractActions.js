import {
  CONTRACT_DATA_SUCCESS,
  CONTRACT_DATA_REQUEST,
  CONTRACT_DATA_ERROR,
  ADD_CONTRACT_REQUEST,
  ADD_CONTRACT_SUCCESS,
  ADD_CONTRACT_ERROR,
  NEW_ALERTS,
} from './actionTypes';
import { apiUrl, testApi } from '../constants/env';
import { addTriggerSuccess } from './apiActions';

export const getContractDataRequest = () => ({
  type: CONTRACT_DATA_REQUEST,
});

export const getContractDataSuccess = (contractName, contractAddress, abi) => ({
  type: CONTRACT_DATA_SUCCESS,
  payload: {
    contractName,
    contractAddress,
    abi
  },
});

export const getContractDataError = error => ({
  type: CONTRACT_DATA_ERROR,
  payload: {
    error,
  },
});

export const getContractData = (address) => (dispatch) => {
  getContractDataRequest();
  return fetch(`${testApi}/api/contract/${address}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  })
    .then(res => res.json())
    .then(response => {
      console.log(response);
      dispatch(getContractDataSuccess(response.name, response.address, response.abi));
    });
};

export const addContractRequest = () => ({
  type: ADD_CONTRACT_REQUEST,
});
export const addContractError = (error) => ({
  type: ADD_CONTRACT_ERROR,
  payload: { error }
});

export const addContractSuccess = (contractId, contractAddress) => ({
  type: ADD_CONTRACT_SUCCESS,
  payload: {
    contractId,
    contractAddress,
  },
});

const addContractToLS = (name, address, abi, id) => {
  let contracts = JSON.parse(localStorage.getItem('contracts') || '[]');
  contracts = contracts.filter(contract => contract.address !== address);
  contracts.push({ name, address, abi, id });
  localStorage.setItem('contracts', JSON.stringify(contracts));
};

export const addContract = (name, contractAddress, abi, network, blockNumber) => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch(addContractRequest());
    fetch(testApi + '/api/contract', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: contractAddress,
        name,
        abi,
        network,
        blockNumber,
      })
    })
      .then(res => res.json())
      .then(contract => {
        console.log(contract);
        dispatch(addContractSuccess());
        addContractToLS(name, contractAddress, abi, contract._id);
        resolve(contract);
      })
      .catch((err) => {
        dispatch(addContractError(err.message));
        reject(err.message);
      });
  });
