import { httpGet } from '../httpclient/index';
import { apiStatus, errorInterceptor, per_page_limit } from '../helper';
import {
  getCookieGitProvider,
  getCookieOrgName,
  getCookieTasRepoBranch,
} from '../../helpers/genericHelpers';

import {
  INSIGHTS_FLAKY_TESTS_FETCH_GRAPH_DATA_STARTED,
  INSIGHTS_FLAKY_TESTS_FETCH_GRAPH_DATA_SUCCESS,
  INSIGHTS_FLAKY_TESTS_FETCH_LIST_DATA_STARTED,
  INSIGHTS_FLAKY_TESTS_FETCH_LIST_DATA_SUCCESS,
  INSIGHTS_FLAKY_TESTS_UNMOUNT,
} from '../actionTypeConstants/constants';

export const fetchGraphDataByDate = ({ end_date, org, provider, repo, start_date }) => {
  return (dispatch) => {
    dispatch(apiStatus(INSIGHTS_FLAKY_TESTS_FETCH_GRAPH_DATA_STARTED));

    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/graphs/status-data/builds/flaky-tests`,
      {
        branch: getCookieTasRepoBranch(),
        end_date: end_date,
        git_provider: provider,
        org: org,
        repo: repo,
        start_date: start_date,
      }
    )
      .then((data) => {
        dispatch(
          apiStatus(INSIGHTS_FLAKY_TESTS_FETCH_GRAPH_DATA_SUCCESS, {
            data: data.flakytests_data,
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(INSIGHTS_FLAKY_TESTS_FETCH_GRAPH_DATA_SUCCESS, {
            data: [],
          })
        );
        errorInterceptor(error);
      });
  };
};

export const fetchTestsByDate = ({ org, provider, repo, start_date, end_date, next = '' }) => {
  return (dispatch) => {
    const firstPage = !next ? true : false;
    dispatch(apiStatus(INSIGHTS_FLAKY_TESTS_FETCH_LIST_DATA_STARTED, { firstPage }));

    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/status-data/list-flaky-tests`, {
      branch: getCookieTasRepoBranch(),
      end_date: end_date,
      git_provider: provider,
      org,
      per_page: per_page_limit,
      repo: repo,
      start_date: start_date,
      next_cursor: next,
    })
      .then((data) => {
        dispatch(
          apiStatus(INSIGHTS_FLAKY_TESTS_FETCH_LIST_DATA_SUCCESS, {
            data: data.flakytests_data,
            meta: data?.response_metadata?.next_cursor,
            firstPage,
          })
        );
      })
      .catch((error) => {
        dispatch(
          apiStatus(INSIGHTS_FLAKY_TESTS_FETCH_LIST_DATA_SUCCESS, {
            data: [],
            meta: '',
            firstPage,
          })
        );
        errorInterceptor(error);
      });
  };
};

export const unmountInsightsFlakyTests = () => {
  return (dispatch) => {
    dispatch(apiStatus(INSIGHTS_FLAKY_TESTS_UNMOUNT));
  };
};
