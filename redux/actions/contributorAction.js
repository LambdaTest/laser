import {
    FETCH_CONTRIBUTORS_STARTED,
    FETCH_CONTRIBUTORS_SUCCESS,
    CONTRIBUTORS_FETCHED_STATUS,
    UNMOUNT_CONTRIBUTORS
  } from "../actionTypeConstants/constants";
  import {httpGet, httpPost} from '../httpclient/index';
  import { toast } from "react-toastify";
  import {apiStatus, errorInterceptor} from "../helper";
import { getCookieGitProvider, getCookieOrgName, getCookieTasRepoBranch } from "../../helpers/genericHelpers";


  export const fetchContributors = (repo,next="", params) => {
    return (dispatch) => {
      const freshPage = !next ? true : false;
      dispatch(apiStatus(FETCH_CONTRIBUTORS_STARTED, { status: true, freshPage: freshPage }));
      httpGet(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contributor`,
        {
          repo: repo,
          org: getCookieOrgName(),
          git_provider: getCookieGitProvider(),
          branch: getCookieTasRepoBranch(),
          per_page: 100,
          next_cursor: next,
          ...params
        }
      ).then(data => {
        dispatch(apiStatus(FETCH_CONTRIBUTORS_SUCCESS, { data: data, freshPage: freshPage }));
        dispatch(apiStatus(CONTRIBUTORS_FETCHED_STATUS, {status: true}));
        dispatch(apiStatus(FETCH_CONTRIBUTORS_STARTED, {status: false}));
      }).catch((error) => {
          dispatch(
            apiStatus(FETCH_CONTRIBUTORS_SUCCESS, {
              data: { authors: [], response_metadata: { next_cursor: '' } },
              freshPage: freshPage,
            })
          );
          dispatch(apiStatus(FETCH_CONTRIBUTORS_STARTED, {status: false}));
          dispatch(apiStatus(CONTRIBUTORS_FETCHED_STATUS, {status: false}));
          errorInterceptor(error)
      })
    };
  };

  export const unmountContributors = () => {
    return (dispatch) => {
      dispatch(apiStatus(UNMOUNT_CONTRIBUTORS));
    };
  };