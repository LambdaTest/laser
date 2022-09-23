import {
  FETCH_COMMITS_STARTED,
  FETCH_COMMITS_SUCCESS,
  COMMITS_FETCHED_STATUS,
  UNMOUNT_COMMITS,
  FETCH_COMMIT_BUILDS_STARTED,
  FETCH_COMMIT_BUILDS_SUCCESS,
  COMMIT_BUILDS_FETCHED_STATUS,
  FETCH_IMPACTED_TESTS_STARTED,
  FETCH_IMPACTED_TESTS_SUCCESS,
  IMPACTED_TESTS_FETCHED_STATUS,
  UNMOUNT_IMPACTED_TESTS,
  FETCH_CURRENT_COMMIT_STARTED,
  FETCH_CURRENT_COMMIT_SUCCESS,
  CURRENT_COMMIT_FETCHED_STATUS,
  FETCH_UNIMPACTED_TESTS_STARTED,
  FETCH_UNIMPACTED_TESTS_SUCCESS,
  UNIMPACTED_TESTS_FETCHED_STATUS,
  COMMIT_COVERAGE_STARTED,
  COMMIT_COVERAGE_SUCCESS,
  COMMIT_COVERAGE_FETCHED_STATUS,
  COMMIT_TRIGGER_REBUILD_STATUS,
  COMMIT_TRIGGER_REBUILD_STARTED,
  COMMIT_TRIGGER_REBUILD_SUCCESS,
} from '../actionTypeConstants/constants';
import {httpGet, httpPost} from '../httpclient/index';
import { toast } from "react-toastify";
import {apiStatus, errorInterceptor, per_page_limit} from "../helper";
import { getCookieGitProvider, getCookieOrgName, getCookieTasRepoBranch } from "../../helpers/genericHelpers";


export const fetchCommits = (repo,next="",params={}) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_COMMITS_STARTED, {status: true}));
    let filterValue = !next ? true : false;
    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/commit`,
      {
        repo: repo,
        org: getCookieOrgName(),
        git_provider: getCookieGitProvider(),
        branch: getCookieTasRepoBranch(),
        per_page: per_page_limit,
        next_cursor: next !== '-1' ? next : '',
        ...params
      }
    ).then(data => {
      dispatch(apiStatus(FETCH_COMMITS_SUCCESS, {data: data, filter: filterValue}));
      dispatch(apiStatus(COMMITS_FETCHED_STATUS, {status: true}));
      dispatch(apiStatus(FETCH_COMMITS_STARTED, {status: false}));
    }).catch((error) => {
        dispatch(apiStatus(FETCH_COMMITS_STARTED, {status: false}));
        dispatch(apiStatus(COMMITS_FETCHED_STATUS, {status: false}));
        dispatch(apiStatus(FETCH_COMMITS_SUCCESS, {data: {commits: [], response_metadata: {next_cursor: ''}}, filter: filterValue}));
        errorInterceptor(error)
    })
  };
};

export const unmountCommits = () => {
  return (dispatch) => {
    dispatch(apiStatus(UNMOUNT_COMMITS));
  };
};

export const triggerCommitRebuild = (repo, buildId) => {
  return (dispatch) => {
    dispatch(apiStatus(COMMIT_TRIGGER_REBUILD_STARTED, { status: true }));
    httpPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/build/rebuild`, {
      org: getCookieOrgName(),
      repo: repo,
      build_id: buildId
    })
      .then((data) => {
        dispatch(apiStatus(COMMIT_TRIGGER_REBUILD_STATUS, { status: true }));
        dispatch(apiStatus(COMMIT_TRIGGER_REBUILD_STARTED, { status: false }));
        dispatch(apiStatus(COMMIT_TRIGGER_REBUILD_SUCCESS, { data: data }));
      })
      .catch((error) => {
        dispatch(apiStatus(COMMIT_TRIGGER_REBUILD_STARTED, { status: false }));
        dispatch(apiStatus(COMMIT_TRIGGER_REBUILD_STATUS, { status: false }));
        errorInterceptor(error);
      });
  };
};

export const fetchCommitBuilds = (repo,commitId, next="") => {
  return (dispatch) => {
    const fresh = !next ? true : false;
    dispatch(apiStatus(FETCH_COMMIT_BUILDS_STARTED, { status: true, fresh }));
    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/commit/${commitId}/build`,
      {
        repo: repo,
        org: getCookieOrgName(),
        git_provider: getCookieGitProvider(),
        branch: getCookieTasRepoBranch(),
        per_page: per_page_limit,
        next_cursor: next
      }
    ).then(data => {
      dispatch(apiStatus(COMMIT_BUILDS_FETCHED_STATUS, {status: true}));
      dispatch(apiStatus(FETCH_COMMIT_BUILDS_STARTED, { status: false, fresh }));
      dispatch(apiStatus(FETCH_COMMIT_BUILDS_SUCCESS, {data: data, fresh}));
    }).catch((error) => {
        dispatch(apiStatus(FETCH_COMMIT_BUILDS_STARTED, { status: false, fresh }));
        dispatch(apiStatus(COMMIT_BUILDS_FETCHED_STATUS, {status: false}));
        errorInterceptor(error)
    })
  };
};


export const fetchImpactedTests = (repo,commitId, buildId, next="", limit=10, params) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_IMPACTED_TESTS_STARTED, {status: true, next: next}));
    let filterValue = !next ? true : false;
    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/commit/${commitId}/build/${buildId}/impacted-tests`,
      {
        repo: repo,
        org: getCookieOrgName(),
        git_provider: getCookieGitProvider(),
        branch: getCookieTasRepoBranch(),
        per_page: per_page_limit,
        next_cursor: next !== '-1' ? next : '',
        ...params
      }
    ).then(data => {
      dispatch(apiStatus(FETCH_IMPACTED_TESTS_STARTED, {status: false, next: next}));
      dispatch(apiStatus(FETCH_IMPACTED_TESTS_SUCCESS, {data: data, filter: filterValue}));
      dispatch(apiStatus(IMPACTED_TESTS_FETCHED_STATUS, {status: true}));
    }).catch((error) => {
        dispatch(apiStatus(FETCH_IMPACTED_TESTS_STARTED, {status: false, next: next}));
        dispatch(apiStatus(IMPACTED_TESTS_FETCHED_STATUS, {status: false}));
        dispatch(apiStatus(FETCH_IMPACTED_TESTS_SUCCESS, {data: {impacted_tests: [], response_metadata: {next_cursor: ''}}, filter: filterValue}));
        errorInterceptor(error)
    })
  };
};
export const fetchUnImpactedTests = (repo,commitId, buildId, next="", limit=10, params) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_UNIMPACTED_TESTS_STARTED, {status: true, next: next}));
    let filterValue = !next ? true : false;
    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/commit/${commitId}/build/${buildId}/unimpacted-tests`,
      {
        repo: repo,
        org: getCookieOrgName(),
        git_provider: getCookieGitProvider(),
        branch: getCookieTasRepoBranch(),
        per_page: per_page_limit,
        next_cursor: next !== '-1' ? next : '',
        ...params
      }
    ).then(data => {
      dispatch(apiStatus(FETCH_UNIMPACTED_TESTS_STARTED, {status: false, next: next}));
      dispatch(apiStatus(FETCH_UNIMPACTED_TESTS_SUCCESS, {data: data, filter: filterValue}));
      dispatch(apiStatus(UNIMPACTED_TESTS_FETCHED_STATUS, {status: true}));
    }).catch((error) => {
        dispatch(apiStatus(FETCH_UNIMPACTED_TESTS_STARTED, {status: false, next: next}));
        dispatch(apiStatus(UNIMPACTED_TESTS_FETCHED_STATUS, {status: false}));
         dispatch(apiStatus(FETCH_UNIMPACTED_TESTS_SUCCESS, {data: {unimpacted_tests: [], response_metadata: {next_cursor: ''}}, filter: filterValue}));
        errorInterceptor(error)
    })
  };
};

export const unmountImpactedTests = () => {
  return (dispatch) => {
    dispatch(apiStatus(UNMOUNT_IMPACTED_TESTS));
  };
};

export const fetchCurrentCommit = (repo, commitId, currentBuildId) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_CURRENT_COMMIT_STARTED, {status: true}));
    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/commit/${commitId}/aggregate`,
      {
        repo: repo,
        org:  getCookieOrgName(),
        git_provider: getCookieGitProvider(),
        branch: getCookieTasRepoBranch(),
        buildID: currentBuildId
      }
    ).then(data => {
      dispatch(apiStatus(CURRENT_COMMIT_FETCHED_STATUS, {status: true}));
      dispatch(apiStatus(FETCH_CURRENT_COMMIT_STARTED, {status: false}));
      dispatch(apiStatus(FETCH_CURRENT_COMMIT_SUCCESS, {data: data.commits && data.commits.length > 0 && data.commits[0]}));
    }).catch((error) => {
        dispatch(apiStatus(FETCH_CURRENT_COMMIT_STARTED, {status: false}));
        dispatch(apiStatus(CURRENT_COMMIT_FETCHED_STATUS, {status: false}));
        errorInterceptor(error)
    })
  };
};

export const fetchCommitCoverage = (repo, commitId) => {
  return (dispatch) => {
    dispatch(apiStatus(COMMIT_COVERAGE_STARTED, {status: true}));
    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/coverage/info/${commitId}`,
      {
        repo: repo,
        org:  getCookieOrgName(),
        git_provider: getCookieGitProvider(),
        // branch: getCookieTasRepoBranch()
      }
    ).then(data => {
      dispatch(apiStatus(COMMIT_COVERAGE_FETCHED_STATUS, {status: true}));
      dispatch(apiStatus(COMMIT_COVERAGE_STARTED, {status: false}));
      dispatch(apiStatus(COMMIT_COVERAGE_SUCCESS, {data: data}));
    }).catch((error) => {
        dispatch(apiStatus(COMMIT_COVERAGE_STARTED, {status: false}));
        dispatch(apiStatus(COMMIT_COVERAGE_FETCHED_STATUS, {status: false}));
        errorInterceptor(error)
    })
  };
};