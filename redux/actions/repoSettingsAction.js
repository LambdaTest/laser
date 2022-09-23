import { httpDelete, httpGet, httpPost, httpPut } from '../httpclient/index';
import { apiStatus, errorInterceptor, per_page_limit } from '../helper';
import {
  getCookieGitProvider,
  getCookieOrgName,
  getCookieTasRepoBranch,
} from '../../helpers/genericHelpers';

import {
  REPO_SETTINGS_ADD_FTM_CONFIG_STARTED,
  REPO_SETTINGS_ADD_FTM_CONFIG_SUCCESS,
  REPO_SETTINGS_ADD_POSTMERGE_CONFIG_STARTED,
  REPO_SETTINGS_ADD_POSTMERGE_CONFIG_SUCCESS,
  REPO_SETTINGS_FETCH_BRANCHES_LIST_STARTED,
  REPO_SETTINGS_FETCH_BRANCHES_LIST_SUCCESS,
  REPO_SETTINGS_FETCH_BRANCHES_PREONBOARDING_LIST_STARTED,
  REPO_SETTINGS_FETCH_BRANCHES_PREONBOARDING_LIST_SUCCESS,
  REPO_SETTINGS_FETCH_FTM_CONFIG_LIST_STARTED,
  REPO_SETTINGS_FETCH_FTM_CONFIG_LIST_SUCCESS,
  REPO_SETTINGS_FETCH_POSTMERGE_CONFIG_LIST_STARTED,
  REPO_SETTINGS_FETCH_POSTMERGE_CONFIG_LIST_SUCCESS,
  REPO_SETTINGS_UNMOUNT,
  REPO_SETTINGS_UPDATE_FTM_CONFIG_STARTED,
  REPO_SETTINGS_UPDATE_FTM_CONFIG_SUCCESS,
  REPO_SETTINGS_UPDATE_POSTMERGE_CONFIG_STARTED,
  REPO_SETTINGS_UPDATE_POSTMERGE_CONFIG_SUCCESS,
  REPO_SETTINGS_DELINK_REPO_STARTED,
  REPO_SETTINGS_DELINK_REPO_SUCCESS,
  SETTINGS_VALIDATE_YAML_CONFIG_STARTED,
  SETTINGS_VALIDATE_YAML_CONFIG_SUCCESS,
} from '../actionTypeConstants/constants';

export const fetchBranchesList = ({ repo }) => {
  return (dispatch) => {
    dispatch(apiStatus(REPO_SETTINGS_FETCH_BRANCHES_LIST_STARTED, { status: true }));

    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/repo/branch`, {
      git_provider: getCookieGitProvider(),
      org: getCookieOrgName(),
      repo: repo,
    })
      .then((data) => {
        dispatch(
          apiStatus(REPO_SETTINGS_FETCH_BRANCHES_LIST_SUCCESS, {
            data: data.branches || [],
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(REPO_SETTINGS_FETCH_BRANCHES_LIST_SUCCESS, {
            data: [],
          })
        );
        errorInterceptor(error);
      });
  };
};

export const fetchBranchesListOnPreboarding = ({ repo, next = '' }) => {
  return (dispatch) => {
    dispatch(apiStatus(REPO_SETTINGS_FETCH_BRANCHES_PREONBOARDING_LIST_STARTED, { status: true }));

    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/repo/user-branches`, {
      git_provider: getCookieGitProvider(),
      org: getCookieOrgName(),
      repo: repo,
      per_page: per_page_limit,
      next_cursor: next,
    })
      .then((data) => {
        dispatch(
          apiStatus(REPO_SETTINGS_FETCH_BRANCHES_PREONBOARDING_LIST_SUCCESS, {
            data: data.branches || [],
            meta: {
              current: next,
              next: data.response_metadata.next_cursor,
            },
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(REPO_SETTINGS_FETCH_BRANCHES_PREONBOARDING_LIST_SUCCESS, {
            data: [],
            meta: { current: next },
          })
        );
        errorInterceptor(error);
      });
  };
};

export const fetchValidateYamlConfig = ({ config }) => {
  return (dispatch) => {
    dispatch(apiStatus(SETTINGS_VALIDATE_YAML_CONFIG_STARTED, { status: true }));

    httpPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/yaml-config/validate`, config)
      .then((data) => {
        dispatch(
          apiStatus(SETTINGS_VALIDATE_YAML_CONFIG_SUCCESS, {
            data: data.message,
            error: data.error,
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(SETTINGS_VALIDATE_YAML_CONFIG_SUCCESS, {
            data: '',
            error: 'Could not validate the config. Please try again later.',
          })
        );
        errorInterceptor(error);
      });
  };
};

export const resetValidateYamlConfig = () => {
  return (dispatch) => {
    dispatch(
      apiStatus(SETTINGS_VALIDATE_YAML_CONFIG_SUCCESS, {
        data: '',
        error: '',
      })
    );
  };
};

export const fetchPostmergeConfigList = ({ repo }) => {
  return (dispatch) => {
    dispatch(apiStatus(REPO_SETTINGS_FETCH_POSTMERGE_CONFIG_LIST_STARTED, { status: true }));

    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/postmergeconfig/list`, {
      git_provider: getCookieGitProvider(),
      org: getCookieOrgName(),
      repo: repo,
    })
      .then((data) => {
        dispatch(
          apiStatus(REPO_SETTINGS_FETCH_POSTMERGE_CONFIG_LIST_SUCCESS, {
            data: data,
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(REPO_SETTINGS_FETCH_POSTMERGE_CONFIG_LIST_SUCCESS, {
            data: [],
          })
        );
        errorInterceptor(error);
      });
  };
};

export const addPostmergeConfig = (configData) => {
  return (dispatch) => {
    dispatch(apiStatus(REPO_SETTINGS_ADD_POSTMERGE_CONFIG_STARTED, { status: true }));

    httpPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/postmergeconfig`, configData)
      .then((data) => {
        dispatch(apiStatus(REPO_SETTINGS_ADD_POSTMERGE_CONFIG_SUCCESS));
      })
      .catch((error) => {
        dispatch(apiStatus(REPO_SETTINGS_ADD_POSTMERGE_CONFIG_SUCCESS));
        errorInterceptor(error);
      });
  };
};

export const updatePostmergeConfig = (configData) => {
  return (dispatch) => {
    dispatch(
      apiStatus(REPO_SETTINGS_UPDATE_POSTMERGE_CONFIG_STARTED, { status: true, params: configData })
    );

    httpPut(`${process.env.NEXT_PUBLIC_API_BASE_URL}/postmergeconfig`, configData)
      .then((data) => {
        dispatch(
          apiStatus(REPO_SETTINGS_UPDATE_POSTMERGE_CONFIG_SUCCESS, {
            params: configData,
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(REPO_SETTINGS_UPDATE_POSTMERGE_CONFIG_SUCCESS, {
            params: configData,
          })
        );
        errorInterceptor(error);
      });
  };
};

export const delinkRepo = ({ repo }) => {
  return (dispatch) => {
    dispatch(apiStatus(REPO_SETTINGS_DELINK_REPO_STARTED, { status: true }));

    httpDelete(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/repo/deactivate?git_provider=${getCookieGitProvider()}&org=${getCookieOrgName()}&repo=${repo}`
    )
      .then((data) => {
        dispatch(apiStatus(REPO_SETTINGS_DELINK_REPO_SUCCESS));
      })
      .catch((error) => {
        dispatch(apiStatus(REPO_SETTINGS_DELINK_REPO_SUCCESS));
        errorInterceptor(error);
      });
  };
};

export const fetchFTMConfigList = ({ repo }) => {
  return (dispatch) => {
    dispatch(apiStatus(REPO_SETTINGS_FETCH_FTM_CONFIG_LIST_STARTED, { status: true }));

    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/flakyconfig`, {
      git_provider: getCookieGitProvider(),
      org: getCookieOrgName(),
      repo: repo,
    })
      .then((data) => {
        dispatch(
          apiStatus(REPO_SETTINGS_FETCH_FTM_CONFIG_LIST_SUCCESS, {
            data: data,
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(REPO_SETTINGS_FETCH_FTM_CONFIG_LIST_SUCCESS, {
            data: [],
          })
        );
        errorInterceptor(error);
      });
  };
};

export const addFTMConfig = (configData) => {
  return (dispatch) => {
    dispatch(apiStatus(REPO_SETTINGS_ADD_FTM_CONFIG_STARTED, { status: true }));

    httpPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/flakyconfig`, configData)
      .then((data) => {
        dispatch(apiStatus(REPO_SETTINGS_ADD_FTM_CONFIG_SUCCESS));
      })
      .catch((error) => {
        dispatch(apiStatus(REPO_SETTINGS_ADD_FTM_CONFIG_SUCCESS));
        errorInterceptor(error);
      });
  };
};

export const updateFTMConfig = (configData) => {
  return (dispatch) => {
    dispatch(
      apiStatus(REPO_SETTINGS_UPDATE_FTM_CONFIG_STARTED, { status: true, params: configData })
    );

    httpPut(`${process.env.NEXT_PUBLIC_API_BASE_URL}/flakyconfig`, configData)
      .then((data) => {
        dispatch(
          apiStatus(REPO_SETTINGS_UPDATE_FTM_CONFIG_SUCCESS, {
            params: configData,
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(REPO_SETTINGS_UPDATE_FTM_CONFIG_SUCCESS, {
            params: configData,
          })
        );
        errorInterceptor(error);
      });
  };
};

export const unmountRepoSettings = () => {
  return (dispatch) => {
    dispatch(apiStatus(REPO_SETTINGS_UNMOUNT));
  };
};
