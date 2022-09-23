import { 
    FETCH_ORGS_STARTED, 
    FETCH_ORGS_SUCCESS, 
    ORGS_FETCHED_STATUS
  } from "../actionTypeConstants/constants";
  import {httpGet, httpPost} from '../httpclient/index';
  import { toast } from "react-toastify";
  import {apiStatus, errorInterceptor} from "../helper";
  
  
  export const fetchOrgs = (repo,next="") => {
    return (dispatch) => {
      dispatch(apiStatus(FETCH_ORGS_STARTED, {status: true}));
      httpGet(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/org/sync`).then(data => {
        dispatch(apiStatus(FETCH_ORGS_SUCCESS, {data: data}));
        dispatch(apiStatus(ORGS_FETCHED_STATUS, {status: true}));
        dispatch(apiStatus(FETCH_ORGS_STARTED, {status: false}));
      }).catch((error) => {
          dispatch(apiStatus(FETCH_ORGS_STARTED, {status: false}));
          dispatch(apiStatus(ORGS_FETCHED_STATUS, {status: false}));
          errorInterceptor(error)
      })
    };
  };
  
