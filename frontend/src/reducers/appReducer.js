import {
  CONTRACT_ID_ERROR,
  CONTRACT_ID_REQUEST,
  CONTRACT_ID_SUCCESS
} from '../actions/actionTypes';

const INITIAL_STATE = {
  isFetchingContract: false,
  contractId: '',
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {

    case CONTRACT_ID_SUCCESS: {
      return {
        ...state,
        contractId: payload.contractId,
      };
    }

    default:
      return state;
  }
};