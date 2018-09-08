import {
  ACTIVE_TRIGGERS_FETCHED,
  STATISTICS_SUCCESS,
} from './actionTypes';
import { testApi } from '../constants/env';
import { getContractIdSuccess } from './contractActions';
import { parseDoughnutData, parseLineData } from '../services/utils';

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
    methods: parseDoughnutData(['Red', 'Blue', 'Yellow'],[30, 50, 100])
  };

  // return fetch(testApi + '/api/statistics')
  //   .then(res => res.json())
  //   .then(statistics => {
  //     console.log(statistics);
  // dispatch contract.Name too?
  dispatch(fetchStatisticsSuccess(mockData));
  // });
};