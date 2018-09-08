import {
  ACTIVE_TRIGGERS_FETCHED,
  STATISTICS_SUCCESS,
  TRIGGER_ADD_SUCCESS,
} from './actionTypes';
import { testApi } from '../constants/env';
import { getContractIdSuccess } from './contractActions';
import { parseDoughnutData, parseLineData } from '../services/utils';

export const triggerTypeMap = {
  'WITHDRAW_CALLED': 'Withdraw function called'
};

export const severity = {
  'red': 3,
  'orange': 2,
  'yellow': 1,
  'green': 0,
};

export const triggerTypes = [
  {
    type: 'WITHDRAW_CALLED',
    name: 'Withdraw function called',
    description: 'Withdraw function called.',
    danger: 'red',
  },
  {
    type: 'NON_AUTHORIZED_WITHDRAW',
    name: 'Withdrawal from non authorized address',
    description: 'Withdrawal called from non expected/authorized address',
    danger: 'red',
  },
  {
    type: 'HIGH_FAILED_TRANSACTIONS',
    name: 'High number of failed transactions on contract',
    description: 'High number of failed trascation on contract, possibile attack',
    danger: 'red',
  },
  {
    type: 'INVALID_CONTRACT_METHOD',
    name: 'Invalid methods being called',
    description: 'Contract is being called with methods that does not exist',
    danger: 'red'
  },
  {
    type: 'CONTRACT_CALLING',
    name: 'Contracts calling my contract',
    description: 'Other contracts calling methods on your contract.',
    danger: 'orange',
  },
  {
    type: 'BLOCK_FILLING',
    name: 'Block filling',
    description: 'A user executed a large amount of transactions / filling blocks in order to block others.',
    danger: 'orange',
  },
  {
    type: 'VALIDATE_IPFS',
    name: 'IPFS validation',
    description: 'When expecting a IPFS hash validates if file exists at location and with expected size',
    danger: 'orange',
  },
  {
    type: 'HIGH_GAS_PRICE',
    name: 'High gas price',
    description: 'If gas price is 50% higher alert',
    danger: 'yellow',
  },
  {
    type: 'INPUT CRITERIA',
    name: 'Input criteria',
    description: 'Is triggered where the contract input is not in the defined regex form',
    danger: 'yellow',
  },
  {
    type : 'METHODLESS_DEPOSIT',
    name : 'Deposit without method',
    description : 'Get notified when contract is topped up directly without method',
    danger : 'red',
  },
];

export const parseAlert = (alert) => {
  return {
    ...alert,
    name: triggerTypeMap[alert.type],
  };
};

export const fetchTriggers = (id) => async (dispatch) => {
  await new Promise((res) => setTimeout(res, 1000)); // TODO replace w API call
  const triggers = [
    {
      id: '1',
      type: 'WITHDRAW_CALLED',
      name: 'Withdraw function called',
      danger: 'red',
    },
    {
      id: '2',
      type: 'CONTRACT_CALLING',
      name: 'Contracts calling my contract',
      danger: 'orange',
    },
  ];
  dispatch({
    type: ACTIVE_TRIGGERS_FETCHED,
    payload: { triggers }
  });
};

export const fetchStatisticsSuccess = (statistics) => ({
  type: STATISTICS_SUCCESS,
  payload: { statistics }
});

export const fetchStatistics = () => (dispatch) => {

  const mockData = {
    transactions: parseLineData('Transactions', [65, 59, 80, 81, 56, 55, 40]),
    methods: parseDoughnutData(['Red', 'Blue', 'Yellow'], [30, 50, 100])
  };

  // return fetch(testApi + '/api/statistics')
  //   .then(res => res.json())
  //   .then(statistics => {
  //     console.log(statistics);
  // dispatch contract.Name too?
  dispatch(fetchStatisticsSuccess(mockData));
  // });
};

const addTriggerToLS = (inputs, trigger) => {
  let triggers = JSON.parse(localStorage.getItem('triggers') || '[]');
  triggers.push({
    inputs,
    trigger,
  });
  localStorage.setItem('triggers', JSON.stringify(triggers));
};

export const addTriggerSuccess = (trigger) => ({
  type: TRIGGER_ADD_SUCCESS,
  payload: {
    trigger,
  }
});

export const addTrigger = (inputs, outputs, trigger) => (dispatch, getState) => {
  const {
    app,
  } = getState();

  let parsedTrigger = {
    'contractAddress': app.contractAddress,
    'type': trigger.type,
    'name': trigger.name,
    'description': trigger.description,
    'level': severity[trigger.danger],
    'method': inputs.method,
    'inputUint': [...inputs.inputUint],
    'inputString': [...inputs.inputString],
    'outputUint': [...outputs.outputUint],
    'outputString': [...outputs.outputString],
  };

  return fetch(`${testApi}/api/contract/${app.contractAddress}/trigger`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(parsedTrigger)
  })
    .then(res => res.json())
    .then(response => {
      console.log(response);
      dispatch(addTriggerSuccess(parsedTrigger));
    });
};