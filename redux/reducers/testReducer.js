import {
    FETCH_TESTS_STARTED,
    FETCH_TESTS_SUCCESS,
    TESTS_FETCHED_STATUS,
    FETCH_TEST_DETAILS_STARTED,
    FETCH_TEST_DETAILS_SUCCESS,
    TEST_DETAILS_FETCHED_STATUS,
    UNMOUNT_TESTS,
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

const initialState = {
    isTestsFetching: true,
    isTestsFetched: false,
    tests: [],
    resMetaData: {},
    isTestDetailsFetching: false,
    isTestDetailsFetched: false,
    testDetails: [],
    testDetailsResMetaData: {},
    isTestsSuitesFetching: true,
    isTestsSuitesFetched: false,
    isMetricsFetching: true,
    isMetricsFetched: true,
    metrics: [],
    isPassFailFetching: true,
    isPassFailFetched: false,
    passFails: [],
    testsSuites: [],
    testsSuitesResMetaData: {},
    isSuiteDetailsFetching: false,
    isSuiteDetailsFetched: false,
    suiteDetails: [],
    suiteDetailsResMetaData: {},
    isSuiteMetricsFetching: true,
    isSuiteMetricsFetched: true,
    suiteMetrics: [],
    isSuitePassFailFetching: true,
    isSuitePassFailFetched: false,
    suitePassFails: [],
    isCurrentTestFetching: true,
    isCurrentTestFetched: false,
    currentTest: {},
    isCurrentTestSuiteFetching: true,
    isCurrentTestSuiteFetched: false,
    currentTestSuite: {},
}
export default (state=initialState, action) => {
    switch (action.type) {
      case FETCH_TESTS_STARTED:
          return { ...state, isTestsFetching: action.payload.status };
      case FETCH_TESTS_SUCCESS: {
          let { tests, resMetaData } = state;
          let uniqueArr = []
          if (action.payload.filter) {
            uniqueArr = action.payload.data.tests ? action.payload.data.tests : [];
          } else {
            tests = [...tests, ...(action.payload.data.tests ? action.payload.data.tests : [])];
            uniqueArr = [...new Map(tests.map(el =>
            [el["id"], el])).values()]
          }
          resMetaData = action.payload.data.response_metadata;
          return {
            ...state,
            tests: uniqueArr,
            resMetaData: resMetaData,
            isTestsFetched: action.payload.filter
          };
        }
      case TESTS_FETCHED_STATUS:
          return { ...state, isTestsFetched: action.payload.status };
      case UNMOUNT_TESTS:
          return { ...state, tests: [], resMetaData: {}, isTestsFetching: true, isTestsFetched: false, };
      case FETCH_CURRENT_TEST_STARTED:
          return { ...state, isCurrentTestFetching: action.payload.status };
      case FETCH_CURRENT_TEST_SUCCESS: {
          return {
            ...state,
            currentTest: action.payload.data
          };
        }
      case CURRENT_TEST_FETCHED_STATUS:
          return { ...state, isCurrentTestFetched: action.payload.status };
      case FETCH_TEST_DETAILS_STARTED: {
        let {testDetails, testDetailsResMetaData} = state;
        let condition = action.payload.next && action.payload.next.length > 0 ? true : false;
        return { ...state, isTestDetailsFetching: action.payload.status, testDetails: condition ? [...testDetails] : [] , testDetailsResMetaData: condition ? {...testDetailsResMetaData} : {}};
      }
      case FETCH_TEST_DETAILS_SUCCESS: {
          let { testDetails, testDetailsResMetaData } = state;
          let uniqueArr = []
          if (action.payload.filter) {
            uniqueArr = action.payload.data.test_results ? action.payload.data.test_results : [];
          } else {
            testDetails = [...testDetails, ...(action.payload.data.test_results ? action.payload.data.test_results : [])];
            uniqueArr = [...new Map(testDetails.map(el =>
            [el["id"], el])).values()]
          }
          testDetailsResMetaData = action.payload.data.response_metadata;

          return {
            ...state,
            testDetails: uniqueArr,
            testDetailsResMetaData: testDetailsResMetaData
          };
        }
      case TEST_DETAILS_FETCHED_STATUS:
          return { ...state, isTestDetailsFetched: action.payload.status };
      case UNMOUNT_TESTS_DETAILS:
        return { ...state, testDetails: [], testDetailsResMetaData: {}, currentTest: {}, isCurrentTestFetching: true  };
      case UNMOUNT_TEST_PREVIOUS:
        return { ...state, testDetails: [], testDetailsResMetaData: {}, isTestDetailsFetching: false, isTestDetailsFetched: false,   };
      case FETCH_TEST_METRICS_STARTED:
        return { ...state, isMetricsFetching: action.payload.status, metrics: [] };
      case FETCH_TEST_METRICS_SUCCESS: {
          return {
            ...state,
            metrics: action.payload.data
          };
        }
      case TEST_METRICS_FETCHED_STATUS:
          return { ...state, isMetricsFetched: action.payload.status };
      case FETCH_TEST_PASS_FAIL_STARTED:
        return { ...state, isPassFailFetching: action.payload.status, passFails: [] };
      case FETCH_TEST_PASS_FAIL_SUCCESS: {
          return {
            ...state,
            passFails: action.payload.data
          };
        }
      case TEST_PASS_FAIL_FETCHED_STATUS:
          return { ...state, isPassFailFetched: action.payload.status };
      case FETCH_TESTS_SUITES_STARTED:
          return { ...state, isTestsSuitesFetching: action.payload.status };
      case FETCH_TESTS_SUITES_SUCCESS: {
          let { testsSuites, testsSuitesResMetaData } = state;
          let uniqueArr = []
          if (action.payload.filter) {
            uniqueArr = action.payload.data.test_suites ? action.payload.data.test_suites : [];
          } else {
            testsSuites = [...testsSuites, ...(action.payload.data.test_suites ? action.payload.data.test_suites : [])];
            uniqueArr = [...new Map(testsSuites.map(el =>
            [el["id"], el])).values()]
          }
          testsSuitesResMetaData = action.payload.data.response_metadata;
          return {
            ...state,
            testsSuites: uniqueArr,
            testsSuitesResMetaData: testsSuitesResMetaData,
            isTestsSuitesFetched: action.payload.filter
          };
        }
      case TESTS_SUITES_FETCHED_STATUS:
          return { ...state, isTestsSuitesFetched: action.payload.status };
      case UNMOUNT_TESTS_SUITES:
          return { ...state, testsSuites: [], testsSuitesResMetaData: {} ,isTestsSuitesFetched: false };
      case FETCH_CURRENT_TEST_SUITE_STARTED:
          return { ...state, isCurrentTestSuiteFetching: action.payload.status };
      case FETCH_CURRENT_TEST_SUITE_SUCCESS: {
          return {
            ...state,
            currentTestSuite: action.payload.data
          };
        }
      case CURRENT_TEST_SUITE_FETCHED_STATUS:
          return { ...state, isCurrentTestSuiteFetched: action.payload.status };
      case FETCH_SUITE_DETAILS_STARTED: {
        let {suiteDetails, suiteDetailsResMetaData} = state;
        let condition = action.payload.next && action.payload.next.length > 0 ? true : false;
        return { ...state, isSuiteDetailsFetching: action.payload.status, suiteDetails: condition ? [...suiteDetails] : [] , suiteDetailsResMetaData: condition ? {...suiteDetailsResMetaData} : {}  };
      }
      case FETCH_SUITE_DETAILS_SUCCESS: {
          let { suiteDetails, suiteDetailsResMetaData } = state;
          let uniqueArr = []
          if (action.payload.filter) {
            uniqueArr = action.payload.data.test_suite_results ? action.payload.data.test_suite_results : [];
          } else {
            suiteDetails = [...suiteDetails, ...(action.payload.data.test_suite_results ? action.payload.data.test_suite_results : [])];
            uniqueArr = [...new Map(suiteDetails.map(el =>
            [el["id"], el])).values()]
          }
          suiteDetailsResMetaData = action.payload.data.response_metadata;
          return {
            ...state,
            suiteDetails: uniqueArr,
            suiteDetailsResMetaData: suiteDetailsResMetaData
          };
        }
      case SUITE_DETAILS_FETCHED_STATUS:
          return { ...state, isSuiteDetailsFetched: action.payload.status };
      case UNMOUNT_TEST_SUITE_DETAILS:
        return { ...state, suiteDetails: [], suiteDetailsResMetaData: {}, currentTestSuite: {}, isCurrentTestSuiteFetching: true };
      case UNMOUNT_TEST_SUITE_PREVIOUS:
        return { ...state, suiteDetails: [], suiteDetailsResMetaData: {}, isSuiteDetailsFetching: false, isSuiteDetailsFetched: false,};
      case FETCH_SUITE_METRICS_STARTED:
        return { ...state, isSuiteMetricsFetching: action.payload.status, suiteMetrics: [] };
      case FETCH_SUITE_METRICS_SUCCESS: {
          return {
            ...state,
            suiteMetrics: action.payload.data
          };
        }
      case SUITE_METRICS_FETCHED_STATUS:
          return { ...state, isSuiteMetricsFetched: action.payload.status };
      case FETCH_SUITE_PASS_FAIL_STARTED:
        return { ...state, isSuitePassFailFetching: action.payload.status };
      case FETCH_SUITE_PASS_FAIL_SUCCESS: {
          return {
            ...state,
            suitePassFails: action.payload.data
          };
        }
      case SUITE_PASS_FAIL_FETCHED_STATUS:
          return { ...state, isSuitePassFailFetched: action.payload.status };
      default:
          return state
    }

}