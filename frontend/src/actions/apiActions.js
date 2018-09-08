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