import { httpGet, httpPut } from '../httpclient/index';
import { apiStatus, errorInterceptor } from '../helper';
import {
  getCookieOrgName,
  getCookieTasRepoBranch,
  getCookieGitProvider,
} from '../../helpers/genericHelpers';

import {
  SETTINGS_FETCH_ORG_CREDITS_STARTED,
  SETTINGS_FETCH_ORG_CREDITS_SUCCESS,
  SETTINGS_FETCH_USER_USAGE_STARTED,
  SETTINGS_FETCH_USER_USAGE_SUCCESS,
  SETTINGS_FETCH_SYNAPSE_COUNT_STARTED,
  SETTINGS_FETCH_SYNAPSE_COUNT_SUCCESS,
  SETTINGS_SET_USER_ACTIVE_STARTED,
  SETTINGS_SET_USER_ACTIVE_SUCCESS,
  SETTINGS_UNMOUNT,
} from '../actionTypeConstants/constants';

export const fetchUserUsageDetails = () => {
  return (dispatch) => {
    dispatch(apiStatus(SETTINGS_FETCH_USER_USAGE_STARTED, { status: true }));

    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/user/usage`, {
      org: getCookieOrgName(),
    })
      .then((data) => {
        dispatch(
          apiStatus(SETTINGS_FETCH_USER_USAGE_SUCCESS, {
            data: data.User_Usages[0],
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(SETTINGS_FETCH_USER_USAGE_SUCCESS, {
            data: null,
          })
        );
        if (error?.response?.status === 500) {
          console.log('Error 500');
        } else {
          errorInterceptor(error);
        }
      });
  };
};

export const setUserActiveState = ({ org, provider }) => {
  return (dispatch) => {
    dispatch(apiStatus(SETTINGS_SET_USER_ACTIVE_STARTED, { status: true }));

    httpPut(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/user/active?org=${org}&git_provider=${provider}`
    )
      .then((data) => {
        dispatch(
          apiStatus(SETTINGS_SET_USER_ACTIVE_SUCCESS, {
            data,
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(SETTINGS_SET_USER_ACTIVE_SUCCESS, {
            data: null,
          })
        );
      });
  };
};

export const fetchCreditsUsageByOrgsDetails = ({ endDate, nextCursor = null, startDate }) => {
  return (dispatch) => {
    dispatch(
      apiStatus(SETTINGS_FETCH_ORG_CREDITS_STARTED, {
        status: true,
        params: {
          nextCursor,
        },
      })
    );
    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/credits/org`, {
      end_date: endDate,
      next_cursor: nextCursor,
      org: getCookieOrgName(),
      per_page: 10,
      start_date: startDate,
    })
      .then((data) => {
        dispatch(
          apiStatus(SETTINGS_FETCH_ORG_CREDITS_SUCCESS, {
            data: data,
            params: {
              endDate,
              nextCursor,
              startDate,
            },
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(SETTINGS_FETCH_ORG_CREDITS_SUCCESS, {
            data: { data: [], response_metadata: { next_cursor: '' } },
            params: {
              endDate,
              nextCursor,
              startDate,
            },
          })
        );
        errorInterceptor(error);
      });
  };
};

export const fetchSynapseCount = ({ org, git_provider }) => {
  return (dispatch) => {
    dispatch(
      apiStatus(SETTINGS_FETCH_SYNAPSE_COUNT_STARTED, {
        status: true,
      })
    );
    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/org/synapse/count`, {
      org,
      git_provider,
    })
      .then((data) => {
        dispatch(
          apiStatus(SETTINGS_FETCH_SYNAPSE_COUNT_SUCCESS, {
            data: data,
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(SETTINGS_FETCH_SYNAPSE_COUNT_SUCCESS, {
            data: {},
          })
        );
        errorInterceptor(error);
      });
  };
};

export const unmountSettings = () => {
  return (dispatch) => {
    dispatch(apiStatus(SETTINGS_UNMOUNT));
  };
};
