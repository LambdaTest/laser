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
  } from "../actionTypeConstants/constants";

const initialState = {
    isCommitsFetching: true,
    isCommitsFetched: false,
    commits: [],
    resMetaData: {},
    isCommitBuildsFetching: true,
    isCommitBuildsFetched: false,
    commitBuilds: [],
    commitBuildResMetaData: {},
    isImpactedTestsFetching: true,
    isImpactedTestsFetched: false,
    impactedTests: [],
    impactedTestResMetaData: {},
    isCurrentCommitFetching: true,
    isCurrentCommitFetched: false,
    currentCommit: {},
    isUnImpactedTestsFetching: true,
    isUnImpactedTestsFetched: false,
    unImpactedTests: [],
    unImpactedTestResMetaData: {},
    isCommitCoverageFetching: true,
    isCommitCoverageFetched: false,
    commitCoverage: {},
    isCommitRebuildInProgress: false
}
export default (state=initialState, action) => {
    switch (action.type) {
      case FETCH_COMMITS_STARTED:
          return { ...state, isCommitsFetching: action.payload.status };
      case FETCH_COMMITS_SUCCESS: {
          let { commits, resMetaData } = state;
          let uniqueArr = []
          if (action.payload.filter) {
              uniqueArr = action.payload.data.commits ? action.payload.data.commits : [];
          } else {
              commits = [...commits, ...(action.payload.data.commits ? action.payload.data.commits : [])];
              uniqueArr = [...new Map(commits.map(el =>
              [el["commit_id"], el])).values()]
          }
          resMetaData = action.payload.data.response_metadata;
          return {
            ...state,
            commits: uniqueArr,
            resMetaData: resMetaData,
            isCommitsFetched: action.payload.filter
          };
        }
      case COMMITS_FETCHED_STATUS:
          return { ...state, isCommitsFetched: action.payload.status };
      case COMMIT_TRIGGER_REBUILD_STARTED:
          return { ...state, isCommitRebuildInProgress: action.payload.status };
      case UNMOUNT_COMMITS:
        return {
          ...state,
          commits: [],
          resMetaData: {},
          isCommitsFetched: false,
          isCommitRebuildInProgress: false,
        };
      case FETCH_CURRENT_COMMIT_STARTED:
        return { ...state, isCurrentCommitFetching: action.payload.status };
      case FETCH_CURRENT_COMMIT_SUCCESS: {
          return {
            ...state,
            currentCommit: action.payload.data
          };
        }
      case CURRENT_COMMIT_FETCHED_STATUS:
          return { ...state, isCurrentCommitFetched: action.payload.status };
      case FETCH_COMMIT_BUILDS_STARTED:
          return {
            ...state,
            isCommitBuildsFetching: action.payload.status,
            commitBuilds: action.payload.fresh ? [] : state.commitBuilds,
            commitBuildResMetaData: action.payload.fresh ? {} : state.commitBuildResMetaData,
          };
      case FETCH_COMMIT_BUILDS_SUCCESS: {
          let { commitBuilds, commitBuildResMetaData } = state;
          commitBuilds = [...commitBuilds, ...action.payload.data.builds];
          let uniqueArr = [...new Map(commitBuilds.map(el =>
            [el["id"], el])).values()]
          commitBuildResMetaData = action.payload.data.response_metadata;
          return {
            ...state,
            commitBuilds: uniqueArr,
            commitBuildResMetaData: commitBuildResMetaData
          };
        }
      case COMMIT_BUILDS_FETCHED_STATUS:
          return { ...state, isCommitBuildsFetched: action.payload.status };
      case FETCH_IMPACTED_TESTS_STARTED: {
        const { status, next } = action.payload;
        return {
          ...state,
          ...(next ? {} : { impactedTests: [], impactedTestResMetaData: {} }),
          isImpactedTestsFetching: status,
          isUnImpactedTestsFetched: false,
          isUnImpactedTestsFetching: true,
          unImpactedTestResMetaData: {},
          unImpactedTests: [],
        };
      }
      case FETCH_IMPACTED_TESTS_SUCCESS: {
          let { impactedTests, impactedTestResMetaData } = state;
          let uniqueArr = []
          if (action.payload.filter) {
            uniqueArr = action.payload.data.impacted_tests ? action.payload.data.impacted_tests : [];
          } else {
            impactedTests = [...impactedTests, ...(action.payload.data.impacted_tests ? action.payload.data.impacted_tests : [])];
            uniqueArr = [...new Map(impactedTests.map(el =>
            [el["test_id"], el])).values()]
          }
          impactedTestResMetaData = action.payload.data.response_metadata;
          return {
            ...state,
            impactedTests: uniqueArr,
            impactedTestResMetaData: impactedTestResMetaData
          };
        }
      case IMPACTED_TESTS_FETCHED_STATUS:
          return { ...state, isImpactedTestsFetched: action.payload.status };
      case UNMOUNT_IMPACTED_TESTS:
        return { ...state, impactedTests: [], impactedTestResMetaData: {}, currentCommit: {}, isCurrentCommitFetching: true };
      case FETCH_UNIMPACTED_TESTS_STARTED: {
        const { status, next } = action.payload;
        return {
          ...state,
          ...(next ? {} : { unImpactedTests: [], unImpactedTestResMetaData: {} }),
          impactedTestResMetaData: {},
          impactedTests: [],
          isImpactedTestsFetched: false,
          isImpactedTestsFetching: true,
          isUnImpactedTestsFetching: status,
        };
      }
      case FETCH_UNIMPACTED_TESTS_SUCCESS: {
          let { unImpactedTests, unImpactedTestResMetaData } = state;
          let uniqueArr = []
          if (action.payload.filter) {
            uniqueArr = action.payload.data.unimpacted_tests ? action.payload.data.unimpacted_tests : [];
          } else {
            unImpactedTests = [...unImpactedTests, ...(action.payload.data.unimpacted_tests ? action.payload.data.unimpacted_tests : [])];
            uniqueArr = [...new Map(unImpactedTests.map(el =>
            [el["id"], el])).values()]
          }
          unImpactedTestResMetaData = action.payload.data.response_metadata;
          return {
            ...state,
            unImpactedTests: uniqueArr,
            unImpactedTestResMetaData: unImpactedTestResMetaData
          };
        }
      case UNIMPACTED_TESTS_FETCHED_STATUS:
          return { ...state, isUnImpactedTestsFetched: action.payload.status };
      case COMMIT_COVERAGE_STARTED:
        return { ...state, isCommitCoverageFetching: action.payload.status };
      case COMMIT_COVERAGE_SUCCESS: {
          return {
            ...state,
            commitCoverage: action.payload.data
          };
        }
      case COMMIT_COVERAGE_FETCHED_STATUS:
          return { ...state, isCommitCoverageFetched: action.payload.status };
      default:
          return state
    }

}