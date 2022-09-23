import {
  FETCH_REPOS_STARTED,
  FETCH_REPOS_SUCCESS,
  REPOS_FETCHED_STATUS,
  UNMOUNT_REPOS,
  ENABLE_REPO_STARTED,
  REPO_ENABLED_STATUS,
  ENABLE_REPO_SUCCESS,
  FETCH_ACTIVE_REPOS_STARTED,
  FETCH_ACTIVE_REPOS_SUCCESS,
  ACTIVE_REPOS_FETCHED_STATUS,
  UNMOUNT_ACTIVE_REPOS,
  IMPORT_CUSTOM_REPO_STARTED,
  IMPORT_CUSTOM_REPO_SUCCESS,
  IMPORT_CUSTOM_REPO_STATUS
} from "../actionTypeConstants/constants";
import {httpGet, httpPost} from '../httpclient/index';
import { toast } from "react-toastify";
import {apiStatus, errorInterceptor, per_page_limit} from "../helper";
import { getCookieOrgName } from "../../helpers/genericHelpers";


  export const fetchRepos = (next="") => {
    return (dispatch) => {
      dispatch(apiStatus(FETCH_REPOS_STARTED, {status: true}));
      httpGet(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/repo`,
        {
          per_page: 400,
          next_cursor: next,
          org: getCookieOrgName()
        }
      ).then(data => {
        dispatch(apiStatus(FETCH_REPOS_SUCCESS, {data: data}));
        if(data.repositories && data.repositories.length !== 0) {
          dispatch(apiStatus(REPOS_FETCHED_STATUS, {status: true}));
          dispatch(apiStatus(FETCH_REPOS_STARTED, {status: false}));
        } else {
          dispatch(apiStatus(FETCH_REPOS_STARTED, {status: false}));
        }
      }).catch((error) => {
          dispatch(apiStatus(FETCH_REPOS_STARTED, {status: false}));
          dispatch(apiStatus(REPOS_FETCHED_STATUS, {status: false}));
          errorInterceptor(error)
      })
    };
  };

  export const unmountRepos = () => {
    return (dispatch) => {
      dispatch(apiStatus(UNMOUNT_REPOS));
    };
  };


  export const enableRepo = (payload) => {
    return (dispatch) => {
      dispatch(apiStatus(ENABLE_REPO_STARTED, {status: true, link: payload.link}));
      httpPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/repo`, payload).then(data => {
        toast.success(`Repo imported successfully.`)
        dispatch(apiStatus(ENABLE_REPO_SUCCESS, {data: payload.link}));
        dispatch(apiStatus(REPO_ENABLED_STATUS, {status: true}));
        dispatch(apiStatus(ENABLE_REPO_STARTED, {status: false, link: payload.link}));
      }).catch((error) => {
          dispatch(apiStatus(ENABLE_REPO_STARTED, {status: false, link: payload.link}));
          dispatch(apiStatus(REPO_ENABLED_STATUS, {status: false}));
          errorInterceptor(error)
      })
    };
  };


  export const fetchActiveRepos = (next="", params) => {
    return (dispatch) => {
      dispatch(apiStatus(FETCH_ACTIVE_REPOS_STARTED, {status: true}));
      let filterValue = !next ? true : false;
      httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/repo/active`,
        {
          per_page: per_page_limit,
          next_cursor: next !== '-1' ? next : '',
          org: getCookieOrgName(),
          ...params
        }
      ).then(data => {
        dispatch(apiStatus(FETCH_ACTIVE_REPOS_SUCCESS, {data: data, filter: filterValue}));
        dispatch(apiStatus(ACTIVE_REPOS_FETCHED_STATUS, {status: true}));
        dispatch(apiStatus(FETCH_ACTIVE_REPOS_STARTED, {status: false}));
      }).catch((error) => {
          dispatch(apiStatus(FETCH_ACTIVE_REPOS_STARTED, {status: false}));
          dispatch(apiStatus(ACTIVE_REPOS_FETCHED_STATUS, {status: false}));
          errorInterceptor(error)
      })
    };
  };

  export const unmountActiveRepos = () => {
    return (dispatch) => {
      dispatch(apiStatus(UNMOUNT_ACTIVE_REPOS));
    };
  };

  export const importCustomRepo = (payload) => {
    return (dispatch) => {
      dispatch(apiStatus(IMPORT_CUSTOM_REPO_STARTED, {status: true}));
      httpPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/repo/custom`, payload)
      .then(data => {
        dispatch(apiStatus(IMPORT_CUSTOM_REPO_SUCCESS, {data: data}));
        dispatch(apiStatus(IMPORT_CUSTOM_REPO_STATUS, {status: true}));
        dispatch(apiStatus(IMPORT_CUSTOM_REPO_STARTED, {status: false}));
      }).catch((error) => {
          dispatch(apiStatus(IMPORT_CUSTOM_REPO_STARTED, {status: false}));
          dispatch(apiStatus(IMPORT_CUSTOM_REPO_STATUS, {status: false}));
          errorInterceptor(error)
      })
    };
  };