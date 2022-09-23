import { toast } from 'react-toastify';

import { apiStatus, errorInterceptor, per_page_limit } from '../helper';
import {
  getCookieGitProvider,
  getCookieOrgName,
  getCookieTasRepoBranch,
} from '../../helpers/genericHelpers';
import { httpGet, httpPost } from '../httpclient';

import {
  BUILD_COMMIT_FETCHED_STATUS,
  BUILD_COMMIT_TESTS_FETCHED_STATUS,
  BUILD_DETAILS_FETCHED_STATUS,
  BUILD_METRICS_FETCHED_STATUS,
  BUILDS_FETCHED_STATUS,
  CURRENT_BUILD_FETCHED_STATUS,
  FETCH_BUILD_COMMIT_STARTED,
  FETCH_BUILD_COMMIT_SUCCESS,
  FETCH_BUILD_COMMIT_TESTS_STARTED,
  FETCH_BUILD_COMMIT_TESTS_SUCCESS,
  FETCH_BUILD_DETAILS_STARTED,
  FETCH_BUILD_DETAILS_SUCCESS,
  FETCH_BUILD_LOGS_BLOB_URL_STARTED,
  FETCH_BUILD_LOGS_BLOB_URL_SUCCESS,
  FETCH_BUILD_METRICS_STARTED,
  FETCH_BUILD_METRICS_SUCCESS,
  FETCH_BUILD_TASKS_STARTED,
  FETCH_BUILD_TASKS_SUCCESS,
  FETCH_BUILDS_STARTED,
  FETCH_BUILDS_SUCCESS,
  FETCH_CURRENT_BUILD_STARTED,
  FETCH_CURRENT_BUILD_SUCCESS,
  FETCH_FLAKY_BUILD_DETAILS_STARTED,
  FETCH_FLAKY_BUILD_DETAILS_SUCCESS,
  FETCH_TIME_SAVED_STARTED,
  FETCH_TIME_SAVED_SUCCESS,
  FLAKY_BUILD_DETAILS_FETCHED_STATUS,
  RESET_BUILD_COMMIT_TESTS,
  TIME_SAVED_FETCHED_STATUS,
  UNMOUNT_BUILD_LOGS,
  UNMOUNT_BUILD_TESTS,
  UNMOUNT_BUILDS,
  UNMOUNT_FLAKY_BUILD_DETAILS,
  UNMOUNT_METRICS_FETCHED,
} from '../actionTypeConstants/constants';

export const fetchBuilds = (repo, next = '', params = {}) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_BUILDS_STARTED, { status: true }));
    let filterValue = !next ? true : false;
    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/build`, {
      branch: getCookieTasRepoBranch(),
      git_provider: getCookieGitProvider(),
      next_cursor: next !== '-1' ? next : '',
      org: getCookieOrgName(),
      per_page: per_page_limit,
      repo: repo,
      ...params,
    })
      .then((data) => {
        dispatch(apiStatus(FETCH_BUILDS_STARTED, { status: false }));
        dispatch(apiStatus(FETCH_BUILDS_SUCCESS, { data: data, filter: filterValue }));
        dispatch(apiStatus(BUILDS_FETCHED_STATUS, { status: true }));
      })
      .catch((error) => {
        dispatch(apiStatus(FETCH_BUILDS_STARTED, { status: false }));
        dispatch(apiStatus(BUILDS_FETCHED_STATUS, { status: true }));
        dispatch(
          apiStatus(FETCH_BUILDS_SUCCESS, {
            data: { builds: [], response_metadata: { next_cursor: '' } },
            filter: filterValue,
          })
        );
        errorInterceptor(error);
      });
  };
};
export const unmountBuilds = () => {
  return (dispatch) => {
    dispatch(apiStatus(UNMOUNT_BUILDS));
  };
};

export const fetchBuildDetails = (repo, buildId, next = '', limit = 10) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_BUILD_DETAILS_STARTED, { status: true, next: next }));
    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/build/${buildId}`, {
      branch: getCookieTasRepoBranch(),
      git_provider: getCookieGitProvider(),
      next_cursor: next,
      org: getCookieOrgName(),
      per_page: limit,
      repo: repo,
    })
      .then((data) => {
        dispatch(apiStatus(BUILD_DETAILS_FETCHED_STATUS, { status: true }));
        dispatch(apiStatus(FETCH_BUILD_DETAILS_STARTED, { status: false, next: next }));
        dispatch(apiStatus(FETCH_BUILD_DETAILS_SUCCESS, { data: data }));
      })
      .catch((error) => {
        dispatch(apiStatus(FETCH_BUILD_DETAILS_STARTED, { status: false, next: next }));
        dispatch(apiStatus(BUILD_DETAILS_FETCHED_STATUS, { status: false }));
        errorInterceptor(error);
      });
  };
};

export const fetchFlakyBuildDetails = (repo, buildId, taskId, next = '', params) => {
  return (dispatch) => {
    let filterValue = !next ? true : false;
    dispatch(apiStatus(FETCH_FLAKY_BUILD_DETAILS_STARTED, { status: true, next: next }));
    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/flakybuild/${buildId}`, {
      branch: getCookieTasRepoBranch(),
      git_provider: getCookieGitProvider(),
      next_cursor: next,
      org: getCookieOrgName(),
      per_page: 100,
      repo: repo,
      taskID: taskId,
      ...params,
    })
      .then((data) => {
        dispatch(apiStatus(FLAKY_BUILD_DETAILS_FETCHED_STATUS, { status: true }));
        dispatch(apiStatus(FETCH_FLAKY_BUILD_DETAILS_STARTED, { status: false, next: next }));
        dispatch(apiStatus(FETCH_FLAKY_BUILD_DETAILS_SUCCESS, { data: data, next: next }));
      })
      .catch((error) => {
        dispatch(apiStatus(FETCH_FLAKY_BUILD_DETAILS_STARTED, { status: false, next: next }));
        dispatch(apiStatus(FLAKY_BUILD_DETAILS_FETCHED_STATUS, { status: false }));
        errorInterceptor(error);
      });
  };
};

export const fetchMetrics = ({ buildid, repo, taskId }) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_BUILD_METRICS_STARTED, { status: true }));
    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/build/${buildid}/metrics/${taskId}`, {
      branch: getCookieTasRepoBranch(),
      git_provider: getCookieGitProvider(),
      org: getCookieOrgName(),
      repo: repo,
    })
      .then((data) => {
        dispatch(apiStatus(BUILD_METRICS_FETCHED_STATUS, { status: true }));
        dispatch(apiStatus(FETCH_BUILD_METRICS_STARTED, { status: false }));
        dispatch(apiStatus(FETCH_BUILD_METRICS_SUCCESS, { data: data }));
      })
      .catch((error) => {
        dispatch(apiStatus(FETCH_BUILD_METRICS_STARTED, { status: false }));
        dispatch(apiStatus(BUILD_METRICS_FETCHED_STATUS, { status: false }));
        errorInterceptor(error);
      });
  };
};

export const unmountBuildTests = () => {
  return (dispatch) => {
    dispatch(apiStatus(UNMOUNT_BUILD_TESTS));
  };
};

export const unmountBuildMetrics = () => {
  return (dispatch) => {
    dispatch(apiStatus(UNMOUNT_METRICS_FETCHED));
  };
};

export const fetchCurrentBuild = (repo, buildId) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_CURRENT_BUILD_STARTED, { status: true }));
    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/build/${buildId}/aggregate`, {
      branch: getCookieTasRepoBranch(),
      git_provider: getCookieGitProvider(),
      org: getCookieOrgName(),
      repo: repo,
    })
      .then((data) => {
        dispatch(apiStatus(CURRENT_BUILD_FETCHED_STATUS, { status: true }));
        dispatch(apiStatus(FETCH_CURRENT_BUILD_STARTED, { status: false }));
        dispatch(
          apiStatus(FETCH_CURRENT_BUILD_SUCCESS, {
            data: data.builds && data.builds.length > 0 && data.builds[0],
          })
        );
      })
      .catch((error) => {
        dispatch(apiStatus(FETCH_CURRENT_BUILD_STARTED, { status: false }));
        dispatch(apiStatus(CURRENT_BUILD_FETCHED_STATUS, { status: false }));
        errorInterceptor(error);
      });
  };
};

export const fetchTimeSaved = (repo, buildId, commitId) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_TIME_SAVED_STARTED, { status: true }));
    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/build/${buildId}/time-saved-impacted`, {
      branch: getCookieTasRepoBranch(),
      git_provider: getCookieGitProvider(),
      org: getCookieOrgName(),
      repo: repo,
      sha: commitId,
    })
      .then((data) => {
        dispatch(apiStatus(TIME_SAVED_FETCHED_STATUS, { status: true }));
        dispatch(apiStatus(FETCH_TIME_SAVED_STARTED, { status: false }));
        dispatch(apiStatus(FETCH_TIME_SAVED_SUCCESS, { data: data }));
      })
      .catch((error) => {
        dispatch(apiStatus(FETCH_TIME_SAVED_STARTED, { status: false }));
        dispatch(apiStatus(TIME_SAVED_FETCHED_STATUS, { status: false }));
        errorInterceptor(error);
      });
  };
};

export const fetchBuildCommits = (repo, buildId, next = '', limit = 10) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_BUILD_COMMIT_STARTED, { status: true }));
    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/commit/build/${buildId}`, {
      branch: getCookieTasRepoBranch(),
      git_provider: getCookieGitProvider(),
      next_cursor: next,
      org: getCookieOrgName(),
      per_page: per_page_limit,
      repo: repo,
    })
      .then((data) => {
        dispatch(apiStatus(FETCH_BUILD_COMMIT_SUCCESS, { data: data }));
        dispatch(apiStatus(BUILD_COMMIT_FETCHED_STATUS, { status: true }));
        dispatch(apiStatus(FETCH_BUILD_COMMIT_STARTED, { status: false }));
      })
      .catch((error) => {
        dispatch(apiStatus(FETCH_BUILD_COMMIT_STARTED, { status: false }));
        dispatch(apiStatus(BUILD_COMMIT_FETCHED_STATUS, { status: false }));
        errorInterceptor(error);
      });
  };
};

export const fetchBuildCommitTests = ({
  buildId,
  commitId,
  limit = 10,
  next = '',
  repo,
  status = '',
  taskId,
  text = '',
}) => {
  return (dispatch) => {
    /** @todo add support for taskId */
    dispatch(apiStatus(FETCH_BUILD_COMMIT_TESTS_STARTED, { status: true }));
    let filterValue = !next ? true : false;

    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/commit/${commitId}/build/${buildId}/impacted-tests`, {
      branch: getCookieTasRepoBranch(),
      git_provider: getCookieGitProvider(),
      next_cursor: next !== '-1' ? next : '',
      org: getCookieOrgName(),
      per_page: per_page_limit,
      repo: repo,
      status,
      task_id: taskId,
      text,
    })
      .then((data) => {
        dispatch(apiStatus(FETCH_BUILD_COMMIT_TESTS_SUCCESS, { data: data, filter: filterValue }));
        dispatch(apiStatus(BUILD_COMMIT_TESTS_FETCHED_STATUS, { status: true }));
        dispatch(apiStatus(FETCH_BUILD_COMMIT_TESTS_STARTED, { status: false }));
      })
      .catch((error) => {
        dispatch(
          apiStatus(FETCH_BUILD_COMMIT_TESTS_SUCCESS, {
            data: { impacted_tests: [], response_metadata: { next_cursor: '' }, total_time: -1 },
            filter: filterValue,
          })
        );
        dispatch(apiStatus(BUILD_COMMIT_TESTS_FETCHED_STATUS, { status: true }));
        dispatch(apiStatus(FETCH_BUILD_COMMIT_TESTS_STARTED, { status: false }));
        errorInterceptor(error);
      });
  };
};

export const resetBuildCommitTests = () => {
  return (dispatch) => {
    dispatch(apiStatus(RESET_BUILD_COMMIT_TESTS));
  };
};

export const fetchBuildTasks = (repo, buildId, nextCursor = '') => {
  return (dispatch) => {
    dispatch(
      apiStatus(FETCH_BUILD_TASKS_STARTED, {
        status: true,
        params: {
          nextCursor,
        },
      })
    );
    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/build/tasks`, {
      branch: getCookieTasRepoBranch(),
      build_id: buildId,
      git_provider: getCookieGitProvider(),
      next_cursor: nextCursor,
      org: getCookieOrgName(),
      per_page: per_page_limit,
      repo: repo,
    })
      .then((data) => {
        dispatch(
          apiStatus(FETCH_BUILD_TASKS_SUCCESS, {
            data: data.tasks,
            metadata: data.response_metadata,
            params: {
              nextCursor,
            },
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(FETCH_BUILD_TASKS_SUCCESS, {
            data: [],
            metadata: { next_cursor: '' },
            params: {
              nextCursor,
            },
          })
        );
        errorInterceptor(error);
      });
  };
};

export const fetchBuildLogsBlobUrl = (repo, buildId, taskId, logsTag) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_BUILD_LOGS_BLOB_URL_STARTED));
    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/build/${buildId}/logs`, {
      branch: getCookieTasRepoBranch(),
      git_provider: getCookieGitProvider(),
      logs_tag: logsTag,
      org: getCookieOrgName(),
      repo: repo,
      task_id: taskId,
    })
      .then((data) => {
        dispatch(
          apiStatus(FETCH_BUILD_LOGS_BLOB_URL_SUCCESS, {
            data: data.path,
            params: { taskId, logsTag },
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(FETCH_BUILD_LOGS_BLOB_URL_SUCCESS, {
            data: '',
            params: { taskId, logsTag },
          })
        );
        errorInterceptor(error);
      });
  };
};

export const unmountFlakyBuildDetails = () => {
  return (dispatch) => {
    dispatch(apiStatus(UNMOUNT_FLAKY_BUILD_DETAILS));
  };
};

export const unmountBuildLogs = () => {
  return (dispatch) => {
    dispatch(apiStatus(UNMOUNT_BUILD_LOGS));
  };
};
