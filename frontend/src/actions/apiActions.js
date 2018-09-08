import { ACTIVE_TRIGGERS_FETCHED } from './actionTypes';

export const triggerTypes = {
  'WITHDRAW_CALLED': 'Withdraw function called'
};

export const parseAlert = (alert) => {
  return {
    ...alert,
    name: triggerTypes[alert.type],
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