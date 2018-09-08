import {
  CONTRACT_DATA_ERROR,
  CONTRACT_DATA_REQUEST,
  CONTRACT_DATA_SUCCESS,
  ACTIVE_TRIGGERS_FETCHED,
  STATISTICS_SUCCESS,
  TRIGGER_ADD_SUCCESS,
} from '../actions/actionTypes';

const INITIAL_STATE = {
  isFetchingContract: false,
  contractIdError: '',
  contractId: null,
  contractAddress: '',
  contractAbi: [],
  activeTriggers: [],
  statistics: null,
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {

    case CONTRACT_DATA_REQUEST: {
      return {
        ...state,
        isFetchingContract: true,
      };
    }

    case CONTRACT_DATA_SUCCESS: {
      return {
        ...state,
        contractAddress: payload.contractAddress,
        contractAbi: payload.abi,
        isFetchingContract: false,
      };
    }

    case CONTRACT_DATA_ERROR: {
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