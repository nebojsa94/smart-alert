import {
  CONTRACT_ID_ERROR,
  CONTRACT_ID_REQUEST,
  CONTRACT_ID_SUCCESS,
  ACTIVE_TRIGGERS_FETCHED,
} from '../actions/actionTypes';

const INITIAL_STATE = {
  isFetchingContract: false,
  contractIdError: '',
  contractId: '',
  activeTriggers: [],
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
      }
    }

    default:
      return state;
  }
};