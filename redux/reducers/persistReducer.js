import {
  PERSIST_CURRENT_ORG,
  PERSIST_ORGS,
  PERSIST_USER_INFO,
} from '../actionTypeConstants/constants';

const initialState = {};
export default (state = initialState, action) => {
  switch (action.type) {
    case PERSIST_CURRENT_ORG:
      return { ...state, currentOrg: action.payload.data };
    case PERSIST_ORGS:
      return { ...state, orgs: action.payload.data };
    case PERSIST_USER_INFO:
      return { ...state, userInfo: action.payload.data };
    default:
      return state;
  }
};
