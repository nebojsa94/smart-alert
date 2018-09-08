import { ACTIVE_TRIGGERS_FETCHED } from './actionTypes';

export const triggerTypeMap = {
  'WITHDRAW_CALLED': 'Withdraw function called'
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
    name: 'Withdrawal form non authorized address',
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
    type: 'CONTRACT_CALLING',
    name: 'Contracts calling my contract',
    description: 'Other contracts calling methods on your contract.',
    danger: 'orange',
  },
  {
    type: 'INVALID_CONTRACT_METHOD',
    name: 'Invalid methods being called',
    description: 'Contract is being called with methods that does not exist',
    danger: 'red'
  },
  {
    type: 'BLOCK_FILLING',
    name: 'Block filling',
    description: 'A user executed a large amount of transactions / filling blocks in order to block others.',
    danger: 'orange',
  },
  {
    type : 'HIGH_GAS_PRICE',
    name : 'High gas price',
    description : 'If gas price is 50% higher alert',
    danger : 'yellow',
  },
  {
    type : 'VALIDATE_IPFS',
    name : 'IPFS validation',
    description : 'When expecting a IPFS hash validates if file exists at location and with expected size',
    danger : 'orange',
  },
  {
    type : 'HIGH_GAS_PRICE',
    name : 'High gas price',
    description : 'If gas price is 50% higher alert',
    danger : 'yellow',
  },
  {
    type : 'INPUT CRITERIA',
    name : 'Input criteria',
    description : 'Is triggered where the contract input is not in the defined regex form',
    danger : 'yellow',
  },
];

export const parseAlert = (alert) => {
  return {
    ...alert,
    name: triggerTypeMap[alert.type],
  }
};

export const fetchTriggers = (id) => async (dispatch) =>  {
  await new Promise((res) => setTimeout(res, 1000)); // TODO replace w API call
  const triggers =  [
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
  })
};