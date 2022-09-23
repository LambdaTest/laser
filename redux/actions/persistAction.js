import {
  PERSIST_CURRENT_ORG,
  PERSIST_ORGS,
  PERSIST_USER_INFO,
} from '../actionTypeConstants/constants';
import { apiStatus } from '../helper';

export const persistCurrentOrg = (org) => {
  return (dispatch) => {
    dispatch(apiStatus(PERSIST_CURRENT_ORG, { data: org }));
  };
};
export const persistOrgs = (data) => {
  return (dispatch) => {
    dispatch(apiStatus(PERSIST_ORGS, { data: data }));
  };
};
export const persistUserInfo = (data) => {
  return (dispatch) => {
    dispatch(apiStatus(PERSIST_USER_INFO, { data: data }));
  };
};
