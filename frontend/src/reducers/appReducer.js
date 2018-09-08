import {
  CONTRACT_ID_ERROR,
  CONTRACT_ID_REQUEST,
  CONTRACT_ID_SUCCESS,
  ACTIVE_TRIGGERS_FETCHED,
  STATISTICS_SUCCESS,
  TRIGGER_ADD_SUCCESS,
} from '../actions/actionTypes';

const INITIAL_STATE = {
  isFetchingContract: false,
  contractIdError: '',
  contractId: null,
  contractAddress: '',
  // TODO REMOVE
  contractAbi: [{"constant":false,"inputs":[{"name":"_number","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}],
  activeTriggers: [],
  statistics: null,
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {

    case CONTRACT_ID_REQUEST: {
      return {
        ...state,
        isFetchingContract: true,
      };
    }

    case CONTRACT_ID_SUCCESS: {
      return {
        ...state,
        contractId: payload.contractId,
        contractAddress: payload.contractAddress,
        contractAbi: payload.abi,
        isFetchingContract: false,
      };
    }

    case CONTRACT_ID_ERROR: {
      return {
        ...state,
        contractIdError: payload.error,
        isFetchingContract: false,
      };
    }

    case ACTIVE_TRIGGERS_FETCHED: {
      return {
        ...state,
        activeTriggers: payload.triggers,
      };
    }

    case TRIGGER_ADD_SUCCESS: {
      return {
        ...state,
        activeTriggers: [
          ...state.activeTriggers,
          payload.trigger,
        ]
      };
    }

    case STATISTICS_SUCCESS: {
      return {
        ...state,
        statistics: payload.statistics,
      };
    }

    default:
      return state;
  }
};