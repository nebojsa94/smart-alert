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

export const getContractDataSuccess = (contractAddress, abi) => ({
  type: CONTRACT_DATA_SUCCESS,
  payload: {
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
      dispatch(getContractDataSuccess(response.address, response.abi));
    });
};

export const addContractRequest = () => ({
  type: ADD_CONTRACT_REQUEST,
});

export const addContractSuccess = (contractId, contractAddress) => ({
  type: ADD_CONTRACT_SUCCESS,
  payload: {
    contractId,
    contractAddress,
  },
});

const addContractToLS = (address, abi, id) => {
  let contracts = JSON.parse(localStorage.getItem('contracts') || '[]');
  contracts = contracts.filter(contract => contract.address !== address);
  contracts.push({ address, abi, id });
  localStorage.setItem('contracts', JSON.stringify(contracts));
};

export const addContract = (name, contractAddress, abi, network) => (dispatch, getState) => {
  dispatch(addContractRequest());

  return fetch(testApi + '/api/contract', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'name': 'Demo', // Add this to form?
      'address': contractAddress,
      abi,
      network,
    })
  })
    .then(res => res.json())
    .then(contract => {
      console.log(contract);
      // dispatch contract.Name too?
      dispatch(addContractSuccess());
      addContractToLS(contractAddress, abi, contract._id);
    });
};

export const newAlerts = (alerts) => ({
  type: NEW_ALERTS,
  payload: { alerts },
});

export const pollAlerts = (address) => (dispatch) => {
  fetch(testApi + '/api/contract/' + address + '/poll')
    .then(res => res.json())
    .then(alerts => {
      console.log(alerts);
      dispatch(newAlerts(alerts));
    });
};