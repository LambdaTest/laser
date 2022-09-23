import { httpGet } from '../httpclient/index';
import { apiStatus, errorInterceptor } from '../helper';
import { getCookieGitProvider, getCookieOrgName, getCookieTasRepoBranch } from '../../helpers/genericHelpers';

import {
  TRENDS_FETCH_BUILDS_BY_DATE_STARTED,
  TRENDS_FETCH_BUILDS_BY_DATE_SUCCESS,
  TRENDS_FETCH_TESTS_BY_COMMIT_STARTED,
  TRENDS_FETCH_TESTS_BY_COMMIT_SUCCESS,
  TRENDS_FETCH_CUMULATIVE_TESTS_BY_DATE_STARTED,
  TRENDS_FETCH_CUMULATIVE_TESTS_BY_DATE_SUCCESS,
  TRENDS_FETCH_ANALYTICS_TABLE_DATA_BY_TYPE_STARTED,
  TRENDS_FETCH_ANALYTICS_TABLE_DATA_BY_TYPE_SUCCESS,
  TRENDS_UNMOUNT,
} from '../actionTypeConstants/constants';

export const fetchBuildsByDate = ({ repo, start_date, end_date }) => {
  return (dispatch) => {
    dispatch(apiStatus(TRENDS_FETCH_BUILDS_BY_DATE_STARTED, { status: true }));

    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/graphs/status-data/build`, {
      repo: repo,
      org: getCookieOrgName(),
      git_provider: getCookieGitProvider(),
      branch: getCookieTasRepoBranch(),
      start_date: start_date,
      end_date: end_date,
    })
      .then((data) => {
        dispatch(
          apiStatus(TRENDS_FETCH_BUILDS_BY_DATE_SUCCESS, {
            data: data.builds,
            params: {
              start_date,
              end_date,
            },
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(TRENDS_FETCH_BUILDS_BY_DATE_SUCCESS, {
            data: [],
          })
        );
        errorInterceptor(error);
      });
  };
};

export const fetchTestsByCommit = ({ repo, perPage }) => {
  return (dispatch) => {
    dispatch(apiStatus(TRENDS_FETCH_TESTS_BY_COMMIT_STARTED, { status: true }));

    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/graphs/status-data/commit`, {
      repo: repo,
      org: getCookieOrgName(),
      git_provider: getCookieGitProvider(),
      branch: getCookieTasRepoBranch(),
      per_page: perPage,
    })
      .then((data) => {
        dispatch(
          apiStatus(TRENDS_FETCH_TESTS_BY_COMMIT_SUCCESS, {
            data: data.commits,
            params: {
              per_page: perPage,
            },
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(TRENDS_FETCH_TESTS_BY_COMMIT_SUCCESS, {
            data: [],
          })
        );
        errorInterceptor(error);
      });
  };
};

export const fetchCumulativeTestsByDate = ({ repo, start_date, end_date }) => {
  return (dispatch) => {
    dispatch(apiStatus(TRENDS_FETCH_CUMULATIVE_TESTS_BY_DATE_STARTED, { status: true }));

    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/graphs/status-data/commits/tests-data`,
      {
        repo: repo,
        org: getCookieOrgName(),
        git_provider: getCookieGitProvider(),
        branch: getCookieTasRepoBranch(),
        start_date: start_date,
        end_date: end_date,
      }
    )
      .then((data) => {
        dispatch(
          apiStatus(TRENDS_FETCH_CUMULATIVE_TESTS_BY_DATE_SUCCESS, {
            data: data.test_data,
            params: {
              start_date,
              end_date,
            },
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(TRENDS_FETCH_CUMULATIVE_TESTS_BY_DATE_SUCCESS, {
            data: [],
          })
        );
        errorInterceptor(error);
      });
  };
};

const TrendsAnalyticsTableUrlByType = {
  slowest_tests: 'commit/slowest',
  failing_tests: 'commit/failed',
  failed_builds: 'build/failed',
};

const TrendsAnalyticsTableDataKeyByType = {
  slowest_tests: 'tests',
  failing_tests: 'tests',
  failed_builds: 'builds',
};

export const fetchAnalyticsTableDataByType = ({ repo, start_date, end_date, per_page, type }) => {
  return (dispatch) => {
    dispatch(apiStatus(TRENDS_FETCH_ANALYTICS_TABLE_DATA_BY_TYPE_STARTED, { status: true }));

    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/graphs/status-data/${TrendsAnalyticsTableUrlByType[type]}`,
      {
        repo: repo,
        org: getCookieOrgName(),
        git_provider: getCookieGitProvider(),
        branch: getCookieTasRepoBranch(),
        per_page,
        start_date,
        end_date,
      }
    )
      .then((data) => {
        dispatch(
          apiStatus(TRENDS_FETCH_ANALYTICS_TABLE_DATA_BY_TYPE_SUCCESS, {
            data: data[TrendsAnalyticsTableDataKeyByType[type]],
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(TRENDS_FETCH_ANALYTICS_TABLE_DATA_BY_TYPE_SUCCESS, {
            data: [],
          })
        );
        errorInterceptor(error);
      });
  };
};

export const unmountTrends = () => {
  return (dispatch) => {
    dispatch(apiStatus(TRENDS_UNMOUNT));
  };
};
