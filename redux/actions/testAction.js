import {
  FETCH_TESTS_STARTED,
  FETCH_TESTS_SUCCESS,
  TESTS_FETCHED_STATUS,
  UNMOUNT_TESTS,
  FETCH_TEST_DETAILS_STARTED,
  FETCH_TEST_DETAILS_SUCCESS,
  TEST_DETAILS_FETCHED_STATUS,
  FETCH_TEST_METRICS_STARTED,
  FETCH_TEST_METRICS_SUCCESS,
  TEST_METRICS_FETCHED_STATUS,
  FETCH_TEST_PASS_FAIL_STARTED,
  FETCH_TEST_PASS_FAIL_SUCCESS,
  TEST_PASS_FAIL_FETCHED_STATUS,
  FETCH_TESTS_SUITES_STARTED,
  FETCH_TESTS_SUITES_SUCCESS,
  TESTS_SUITES_FETCHED_STATUS,
  UNMOUNT_TESTS_SUITES,
  FETCH_SUITE_DETAILS_STARTED,
  FETCH_SUITE_DETAILS_SUCCESS,
  SUITE_DETAILS_FETCHED_STATUS,
  FETCH_SUITE_METRICS_STARTED,
  FETCH_SUITE_METRICS_SUCCESS,
  SUITE_METRICS_FETCHED_STATUS,
  FETCH_SUITE_PASS_FAIL_STARTED,
  FETCH_SUITE_PASS_FAIL_SUCCESS,
  SUITE_PASS_FAIL_FETCHED_STATUS,
  UNMOUNT_TESTS_DETAILS,
  UNMOUNT_TEST_SUITE_DETAILS,
  FETCH_CURRENT_TEST_STARTED,
  FETCH_CURRENT_TEST_SUCCESS,
  CURRENT_TEST_FETCHED_STATUS,
  FETCH_CURRENT_TEST_SUITE_STARTED,
  FETCH_CURRENT_TEST_SUITE_SUCCESS,
  CURRENT_TEST_SUITE_FETCHED_STATUS,
  UNMOUNT_TEST_PREVIOUS,
  UNMOUNT_TEST_SUITE_PREVIOUS
} from "../actionTypeConstants/constants";
import {httpGet, httpPost} from '../httpclient/index';
import {apiStatus, errorInterceptor, per_page_limit} from "../helper";
import { getCookieGitProvider, getCookieOrgName, getCookieTasRepoBranch } from "../../helpers/genericHelpers";


export const fetchTests = (repo,next="", params={}) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_TESTS_STARTED, {status: true}));
    let filterValue = !next ? true : false;
    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/test`,
      {
        branch: getCookieTasRepoBranch(),
        git_provider: getCookieGitProvider(),
        next_cursor: next !== '-1' ? next : '',
        org: getCookieOrgName(),
        per_page: per_page_limit,
        repo: repo,
        ...params
      }
    ).then(data => {
      dispatch(apiStatus(FETCH_TESTS_SUCCESS, {data: data, filter: filterValue}));
      dispatch(apiStatus(TESTS_FETCHED_STATUS, {status: true}));
      dispatch(apiStatus(FETCH_TESTS_STARTED, {status: false}));
    }).catch((error) => {
        dispatch(apiStatus(FETCH_TESTS_STARTED, {status: false}));
        dispatch(apiStatus(TESTS_FETCHED_STATUS, {status: false}));
        dispatch(apiStatus(FETCH_TESTS_SUCCESS, {data: {tests: [], response_metadata: {next_cursor: ''}}, filter: filterValue}));
        errorInterceptor(error)
    })
  };
};

export const unmountTests = () => {
  return (dispatch) => {
    dispatch(apiStatus(UNMOUNT_TESTS));
  };
};

export const unmountTestPrevious = () => {
  return (dispatch) => {
    dispatch(apiStatus(UNMOUNT_TEST_PREVIOUS));
  };
};

export const fetchTestDetails = (repo, testId, next="", start_date, end_date, limit=10,params) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_TEST_DETAILS_STARTED, {status: true, next:next}));
    let filterValue = !next ? true : false;
    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/test/${testId}`,
      {
        branch: getCookieTasRepoBranch(),
        end_date: end_date,
        git_provider: getCookieGitProvider(),
        next_cursor: next !== '-1' ? next : '',
        org:  getCookieOrgName(),
        per_page: per_page_limit,
        repo: repo,
        start_date: start_date,
        ...params
      }
    ).then(data => {
      dispatch(apiStatus(TEST_DETAILS_FETCHED_STATUS, {status: true}));
      dispatch(apiStatus(FETCH_TEST_DETAILS_STARTED, {status: false,next:next}));
      dispatch(apiStatus(FETCH_TEST_DETAILS_SUCCESS, {data: data, filter: filterValue}));
    }).catch((error) => {
        dispatch(apiStatus(FETCH_TEST_DETAILS_STARTED, {status: false,next:next}));
        dispatch(apiStatus(TEST_DETAILS_FETCHED_STATUS, {status: false}));
        dispatch(apiStatus(FETCH_TEST_DETAILS_SUCCESS, {data: {test_results: [], response_metadata: {next_cursor: ''}}, filter: filterValue}));
        errorInterceptor(error)
    })
  };
};


export const fetchMetrics = ({ repo, task_id, exec_id, build_id }) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_TEST_METRICS_STARTED, {status: true}));
    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/test/metrics`, {
      branch: getCookieTasRepoBranch(),
      build_id: build_id,
      exec_id: exec_id,
      git_provider: getCookieGitProvider(),
      org: getCookieOrgName(),
      repo: repo,
      task_id: task_id,
    })
      .then((data) => {
        dispatch(apiStatus(TEST_METRICS_FETCHED_STATUS, { status: true }));
        dispatch(apiStatus(FETCH_TEST_METRICS_STARTED, { status: false }));
        dispatch(apiStatus(FETCH_TEST_METRICS_SUCCESS, { data: data }));
      })
      .catch((error) => {
        dispatch(apiStatus(FETCH_TEST_METRICS_STARTED, { status: false }));
        dispatch(apiStatus(TEST_METRICS_FETCHED_STATUS, { status: false }));
        errorInterceptor(error);
      });
  };
};

export const fetchPassFailGraph = (repo, testId, type, start_date, end_date) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_TEST_PASS_FAIL_STARTED, {status: true}));
    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/test/${testId}/graphs/status-data`,
      {
        branch: getCookieTasRepoBranch(),
        end_date: end_date,
        git_provider: getCookieGitProvider(),
        org:  getCookieOrgName(),
        repo: repo,
        start_date: start_date,
        type: type,
      }
    ).then(data => {
      dispatch(apiStatus(TEST_PASS_FAIL_FETCHED_STATUS, {status: true}));
      dispatch(apiStatus(FETCH_TEST_PASS_FAIL_STARTED, {status: false}));
      dispatch(apiStatus(FETCH_TEST_PASS_FAIL_SUCCESS, {data: data}));
    }).catch((error) => {
        dispatch(apiStatus(FETCH_TEST_PASS_FAIL_STARTED, {status: false}));
        dispatch(apiStatus(TEST_PASS_FAIL_FETCHED_STATUS, {status: false}));
        errorInterceptor(error)
    })
  };
};

export const fetchCurrentTest = (repo, testId) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_CURRENT_TEST_STARTED, {status: true}));
    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/test/${testId}/aggregate`,
      {
        branch: getCookieTasRepoBranch(),
        git_provider: getCookieGitProvider(),
        org:  getCookieOrgName(),
        repo: repo,
      }
    ).then(data => {
      dispatch(apiStatus(CURRENT_TEST_FETCHED_STATUS, {status: true}));
      dispatch(apiStatus(FETCH_CURRENT_TEST_STARTED, {status: false}));
      dispatch(apiStatus(FETCH_CURRENT_TEST_SUCCESS, {data: data.tests && data.tests.length > 0 && data.tests[0]}));
    }).catch((error) => {
        dispatch(apiStatus(FETCH_CURRENT_TEST_STARTED, {status: false}));
        dispatch(apiStatus(CURRENT_TEST_FETCHED_STATUS, {status: false}));
        errorInterceptor(error)
    })
  };
};


export const fetchCurrentTestSuite = (repo, suiteId) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_CURRENT_TEST_SUITE_STARTED, {status: true}));
    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/suite/${suiteId}/aggregate`,
      {
        branch: getCookieTasRepoBranch(),
        git_provider: getCookieGitProvider(),
        org:  getCookieOrgName(),
        repo: repo,
      }
    ).then(data => {
      dispatch(apiStatus(CURRENT_TEST_SUITE_FETCHED_STATUS, {status: true}));
      dispatch(apiStatus(FETCH_CURRENT_TEST_SUITE_STARTED, {status: false}));
      dispatch(apiStatus(FETCH_CURRENT_TEST_SUITE_SUCCESS, {data: data.test_suites && data.test_suites.length > 0 && data.test_suites[0]}));
    }).catch((error) => {
        dispatch(apiStatus(FETCH_CURRENT_TEST_SUITE_STARTED, {status: false}));
        dispatch(apiStatus(CURRENT_TEST_SUITE_FETCHED_STATUS, {status: false}));
        errorInterceptor(error)
    })
  };
};


export const fetchTestsSuites = (repo,next="", params={}) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_TESTS_SUITES_STARTED, {status: true}));
    let filterValue = !next ? true : false;
    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/suite`,
      {
        branch: getCookieTasRepoBranch(),
        git_provider: getCookieGitProvider(),
        next_cursor: next !== '-1' ? next : '',
        org: getCookieOrgName(),
        per_page: per_page_limit,
        repo: repo,
        ...params
      }
    ).then(data => {
      dispatch(apiStatus(TESTS_SUITES_FETCHED_STATUS, {status: true}));
      dispatch(apiStatus(FETCH_TESTS_SUITES_STARTED, {status: false}));
      dispatch(apiStatus(FETCH_TESTS_SUITES_SUCCESS, {data: data, filter: filterValue}));
    }).catch((error) => {
        dispatch(apiStatus(FETCH_TESTS_SUITES_STARTED, {status: false}));
        dispatch(apiStatus(TESTS_SUITES_FETCHED_STATUS, {status: false}));
        dispatch(apiStatus(FETCH_TESTS_SUITES_SUCCESS, {data: {test_suites: [], response_metadata: {next_cursor: ''}}, filter: filterValue}));
        errorInterceptor(error)
    })
  };
};

export const unmountTestsSuites = () => {
  return (dispatch) => {
    dispatch(apiStatus(UNMOUNT_TESTS_SUITES));
  };
};


export const unmountTestSuitePrevious = () => {
  return (dispatch) => {
    dispatch(apiStatus(UNMOUNT_TEST_SUITE_PREVIOUS));
  };
};

export const fetchSuiteDetails = (repo, suiteId, next="", start_date, end_date, limit=10, params) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_SUITE_DETAILS_STARTED, {status: true, next:next}));
    let filterValue = !next ? true : false;
    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/suite/${suiteId}`,
      {
        branch: getCookieTasRepoBranch(),
        end_date: end_date,
        git_provider: getCookieGitProvider(),
        next_cursor: next !== '-1' ? next : '',
        org:  getCookieOrgName(),
        per_page: per_page_limit,
        repo: repo,
        start_date: start_date,
        ...params
      }
    ).then(data => {
      dispatch(apiStatus(SUITE_DETAILS_FETCHED_STATUS, {status: true}));
      dispatch(apiStatus(FETCH_SUITE_DETAILS_STARTED, {status: false, next:next}));
      dispatch(apiStatus(FETCH_SUITE_DETAILS_SUCCESS, {data: data, filter: filterValue}));
    }).catch((error) => {
        dispatch(apiStatus(FETCH_SUITE_DETAILS_STARTED, {status: false, next:next}));
        dispatch(apiStatus(SUITE_DETAILS_FETCHED_STATUS, {status: false}));
        dispatch(apiStatus(FETCH_SUITE_DETAILS_SUCCESS, {data: {test_suite_results: [], response_metadata: {next_cursor: ''}}, filter: filterValue}));
        errorInterceptor(error)
    })
  };
};


export const fetchSuiteMetrics = ({ repo, task_id, exec_id, build_id }) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_SUITE_METRICS_STARTED, { status: true }));
    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/suite/metrics`, {
      branch: getCookieTasRepoBranch(),
      build_id: build_id,
      exec_id: exec_id,
      git_provider: getCookieGitProvider(),
      org: getCookieOrgName(),
      repo: repo,
      task_id: task_id,
    })
      .then((data) => {
        dispatch(apiStatus(SUITE_METRICS_FETCHED_STATUS, { status: true }));
        dispatch(apiStatus(FETCH_SUITE_METRICS_STARTED, { status: false }));
        dispatch(apiStatus(FETCH_SUITE_METRICS_SUCCESS, { data: data }));
      })
      .catch((error) => {
        dispatch(apiStatus(FETCH_SUITE_METRICS_STARTED, { status: false }));
        dispatch(apiStatus(SUITE_METRICS_FETCHED_STATUS, { status: false }));
        errorInterceptor(error);
      });
  };
};

export const fetchSuitePassFailGraph = (repo, suiteId, type, start_date, end_date) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_SUITE_PASS_FAIL_STARTED, {status: true}));
    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/suite/${suiteId}/graphs/status-data`,
      {
        branch: getCookieTasRepoBranch(),
        end_date: end_date,
        git_provider: getCookieGitProvider(),
        org:  getCookieOrgName(),
        repo: repo,
        start_date: start_date,
        type: type,
      }
    ).then(data => {
      dispatch(apiStatus(FETCH_SUITE_PASS_FAIL_SUCCESS, {data: data}));
      dispatch(apiStatus(SUITE_PASS_FAIL_FETCHED_STATUS, {status: true}));
      dispatch(apiStatus(FETCH_SUITE_PASS_FAIL_STARTED, {status: false}));
    }).catch((error) => {
        dispatch(apiStatus(FETCH_SUITE_PASS_FAIL_STARTED, {status: false}));
        dispatch(apiStatus(SUITE_PASS_FAIL_FETCHED_STATUS, {status: false}));
        errorInterceptor(error)
    })
  };
};

export const unmountTestsDetails = () => {
  return (dispatch) => {
    dispatch(apiStatus(UNMOUNT_TESTS_DETAILS));
  };
};
export const unmountTestSuiteDetails = () => {
  return (dispatch) => {
    dispatch(apiStatus(UNMOUNT_TEST_SUITE_DETAILS));
  };
};