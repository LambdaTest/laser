import {
  BUILD_COMMIT_FETCHED_STATUS,
  BUILD_COMMIT_TESTS_FETCHED_STATUS,
  FETCH_FLAKY_BUILD_DETAILS_STARTED,
  FETCH_FLAKY_BUILD_DETAILS_SUCCESS,
  FLAKY_BUILD_DETAILS_FETCHED_STATUS,
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
  FETCH_TIME_SAVED_STARTED,
  FETCH_TIME_SAVED_SUCCESS,
  RESET_BUILD_COMMIT_TESTS,
  TIME_SAVED_FETCHED_STATUS,
  UNMOUNT_BUILD_LOGS,
  UNMOUNT_BUILD_TESTS,
  UNMOUNT_BUILDS,
  UNMOUNT_FLAKY_BUILD_DETAILS,
  UNMOUNT_METRICS_FETCHED,
} from '../actionTypeConstants/constants';

const initialState = {
  buildCommits: {},
  buildCommitTests: {
    impacted_tests: [],
    response_metadata: {
      next_cursor: '',
    },
    total_time: -1,
  },
  buildDetails: [],
  buildDetailsResMetaData: {},
  buildLogsBlobUrl: {},
  builds: [],
  buildTasks: [],
  buildTasksMetadata: {},
  currentBuild: {},
  filterBuilds: false,
  flakyBuildDetails: [],
  flakyBuildDetailsResMetaData: {},
  isBuildCommitsFetched: false,
  isBuildCommitsFetching: true,
  isBuildCommitTestsFetched: false,
  isBuildCommitTestsFetching: true,
  isBuildDetailsFetched: false,
  isBuildDetailsFetching: false,
  isBuildLogsBlobUrlFetching: true,
  isBuildsFetched: false,
  isBuildsFetching: true,
  isBuildTasksFetching: true,
  isCurrentBuildFetched: false,
  isCurrentBuildFetching: true,
  isFlakyBuildDetailsFetched: false,
  isFlakyBuildDetailsFetching: true,
  isMetricsFetched: false,
  isMetricsFetching: true,
  isTimeSavedFetched: false,
  isTimeSavedFetching: true,
  metrics: [],
  resMetaData: {},
  time_saved: {},
};
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BUILDS_STARTED:
      return { ...state, isBuildsFetching: action.payload.status };
    case FETCH_BUILDS_SUCCESS: {
      let { builds, resMetaData } = state;
      let uniqueArr = [];
      if (action.payload.filter) {
        uniqueArr = action.payload.data.builds ? action.payload.data.builds : [];
      } else {
        builds = [...builds, ...(action.payload.data.builds ? action.payload.data.builds : [])];
        uniqueArr = [...new Map(builds.map((el) => [el['id'], el])).values()];
      }
      resMetaData = action.payload.data.response_metadata;
      return {
        ...state,
        builds: uniqueArr,
        filterBuilds: action.payload.filter,
        isBuildsFetched: action.payload.filter,
        resMetaData: resMetaData,
      };
    }
    case BUILDS_FETCHED_STATUS:
      return { ...state, isBuildsFetched: action.payload.status };
    case UNMOUNT_BUILDS:
      return {
        ...state,
        builds: [],
        filterBuilds: false,
        isBuildsFetched: false,
        isBuildsFetching: true,
        resMetaData: {},
      };
    case FETCH_CURRENT_BUILD_STARTED:
      return { ...state, isCurrentBuildFetching: action.payload.status };
    case FETCH_CURRENT_BUILD_SUCCESS: {
      return {
        ...state,
        currentBuild: action.payload.data,
      };
    }
    case CURRENT_BUILD_FETCHED_STATUS:
      return { ...state, isCurrentBuildFetched: action.payload.status };
    case FETCH_BUILD_COMMIT_STARTED:
      return { ...state, isBuildCommitsFetching: action.payload.status };
    case FETCH_BUILD_COMMIT_SUCCESS: {
      const { buildCommits } = state;
      const commits = [...(buildCommits.commits || []), ...action.payload.data.commits];
      const uniqueArr = [...new Map(commits.map((el) => [el['commit_id'], el])).values()];
      return {
        ...state,
        buildCommits: {
          ...action.payload.data,
          commits: uniqueArr,
        },
      };
    }
    case BUILD_COMMIT_FETCHED_STATUS:
      return { ...state, isBuildCommitsFetched: action.payload.status };
    case RESET_BUILD_COMMIT_TESTS: {
      return {
        ...state,
        isBuildCommitTestsFetching: true,
        buildCommitTests: {
          impacted_tests: [],
          response_metadata: {
            next_cursor: '',
          },
          total_time: -1,
        },
      };
    }
    case FETCH_BUILD_COMMIT_TESTS_STARTED:
      return { ...state, isBuildCommitTestsFetching: action.payload.status };
    case FETCH_BUILD_COMMIT_TESTS_SUCCESS: {
      const { buildCommitTests } = state;

      let uniqueArr = [];
      if (action.payload.filter) {
        uniqueArr = action.payload.data.impacted_tests ? action.payload.data.impacted_tests : [];
      } else {
        let tests = [
          ...buildCommitTests.impacted_tests,
          ...(action.payload.data.impacted_tests ? action.payload.data.impacted_tests : []),
        ];
        uniqueArr = [...new Map(tests.map((el) => [el['test_id'], el])).values()];
      }

      buildCommitTests.impacted_tests = uniqueArr;
      buildCommitTests.response_metadata = action.payload.data.response_metadata;
      buildCommitTests.total_time = action.payload.data.total_time;
      return {
        ...state,
        buildCommitTests: buildCommitTests,
      };
    }
    case BUILD_COMMIT_TESTS_FETCHED_STATUS:
      return { ...state, isBuildCommitTestsFetched: action.payload.status };
    case FETCH_BUILD_DETAILS_STARTED: {
      let { buildDetails, buildDetailsResMetaData } = state;
      let condition = action.payload.next && action.payload.next.length > 0 ? true : false;
      return {
        ...state,
        buildDetails: condition ? [...buildDetails] : [],
        buildDetailsResMetaData: condition ? { ...buildDetailsResMetaData } : {},
        isBuildDetailsFetching: action.payload.status,
      };
    }
    case FETCH_BUILD_DETAILS_SUCCESS: {
      let { buildDetails, buildDetailsResMetaData } = state;
      buildDetails = [...buildDetails, ...action.payload.data.tests];
      let uniqueArr = [...new Map(buildDetails.map((el) => [el['id'], el])).values()];
      buildDetailsResMetaData = action.payload.data.response_metadata;
      return {
        ...state,
        buildDetails: uniqueArr,
        buildDetailsResMetaData: buildDetailsResMetaData,
      };
    }
    case BUILD_DETAILS_FETCHED_STATUS:
      return { ...state, isBuildDetailsFetched: action.payload.status };
    case FETCH_FLAKY_BUILD_DETAILS_STARTED: {
      const { flakyBuildDetails, flakyBuildDetailsResMetaData } = state;
      const condition = action.payload.next && action.payload.next.length > 0 ? true : false;
      return {
        ...state,
        flakyBuildDetails: condition ? [...flakyBuildDetails] : [],
        flakyBuildDetailsResMetaData: condition ? { ...flakyBuildDetailsResMetaData } : {},
        isFlakyBuildDetailsFetching: action.payload.status,
      };
    }
    case FETCH_FLAKY_BUILD_DETAILS_SUCCESS: {
      const { flakyBuildDetails, flakyBuildDetailsResMetaData } = state;
      const { next, data } = action.payload;
      const { tests, response_metadata } = data;
      return {
        ...state,
        flakyBuildDetails: [...(next ? flakyBuildDetails : []), ...tests],
        flakyBuildDetailsResMetaData: response_metadata,
      };
    }
    case FLAKY_BUILD_DETAILS_FETCHED_STATUS:
      return { ...state, isFlakyBuildDetailsFetched: action.payload.status };
    case UNMOUNT_FLAKY_BUILD_DETAILS:
      return {
        ...state,
        flakyBuildDetails: [],
        flakyBuildDetailsResMetaData: {},
        isFlakyBuildDetailsFetched: false,
        isFlakyBuildDetailsFetching: true,
      };
    case UNMOUNT_BUILD_TESTS:
      return {
        ...state,
        buildCommits: {},
        buildCommitTests: {
          impacted_tests: [],
          response_metadata: {
            next_cursor: '',
          },
          total_time: -1,
        },
        buildDetails: [],
        buildDetailsResMetaData: {},
        buildTasks: [],
        buildTasksMetadata: {},
        currentBuild: {},
        flakyBuildDetails: [],
        flakyBuildDetailsResMetaData: {},
        isBuildCommitsFetched: false,
        isBuildCommitsFetching: true,
        isBuildTasksFetching: true,
        isCurrentBuildFetching: true,
        isFlakyBuildDetailsFetched: false,
        isFlakyBuildDetailsFetching: true,
        time_saved: {},
      };
    case FETCH_BUILD_TASKS_STARTED: {
      const { nextCursor } = action.payload.params;
      const isFirstPageFetch = !nextCursor;
      return {
        ...state,
        ...(isFirstPageFetch
          ? {
              buildTasks: [],
              buildTasksMetadata: {},
            }
          : {}),
        isBuildTasksFetching: true,
      };
    }
    case FETCH_BUILD_TASKS_SUCCESS: {
      const { data, metadata, params } = action.payload;
      const { nextCursor } = params;

      const isFirstPageFetch = !nextCursor;
      const buildTasks = isFirstPageFetch ? data : [...state.buildTasks, ...data];

      return {
        ...state,
        isBuildTasksFetching: false,
        buildTasks: buildTasks,
        buildTasksMetadata: metadata,
      };
    }
    case FETCH_BUILD_LOGS_BLOB_URL_STARTED: {
      return {
        ...state,
        isBuildLogsBlobUrlFetching: true,
      };
    }
    case FETCH_BUILD_LOGS_BLOB_URL_SUCCESS: {
      const {
        data,
        params: { taskId, logsTag },
      } = action.payload;

      return {
        ...state,
        buildLogsBlobUrl: {
          ...state.buildLogsBlobUrl,
          [taskId]: {
            ...(state.buildLogsBlobUrl?.[taskId] || {}),
            [logsTag]: data,
          },
        },
        isBuildLogsBlobUrlFetching: false,
      };
    }
    case UNMOUNT_BUILD_LOGS:
      return {
        ...state,
        buildLogsBlobUrl: [],
        buildTasks: [],
        buildTasksMetadata: {},
        currentBuild: {},
        isBuildLogsBlobUrlFetching: true,
        isBuildTasksFetching: true,
        isCurrentBuildFetching: true,
      };
    case FETCH_BUILD_METRICS_STARTED:
      return { ...state, isMetricsFetching: action.payload.status, metrics: [] };
    case FETCH_BUILD_METRICS_SUCCESS: {
      return {
        ...state,
        metrics: action.payload.data,
      };
    }
    case BUILD_METRICS_FETCHED_STATUS:
      return { ...state, isMetricsFetched: action.payload.status };
    case UNMOUNT_METRICS_FETCHED:
      return { ...state, isMetricsFetched: false, isMetricsFetching: true, metrics: [] };
    case FETCH_TIME_SAVED_STARTED:
      return { ...state, isTimeSavedFetching: action.payload.status };
    case FETCH_TIME_SAVED_SUCCESS: {
      return {
        ...state,
        time_saved: action.payload.data,
      };
    }
    case TIME_SAVED_FETCHED_STATUS:
      return { ...state, isTimeSavedFetched: action.payload.status };
    default:
      return state;
  }
};
