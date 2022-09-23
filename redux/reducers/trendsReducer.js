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

import { getDaysBetweenDates } from '../../helpers/dateHelpers';
import { fillEmptyDataByDate } from '../../helpers/dataHelpers';

const initialState = {
  buildsByDate: [],
  buildsByDateAvg: null,
  buildsByDateLoading: true,
  testsByCommit: [],
  testsByCommitAvg: null,
  testsByCommitLoading: true,
  cumulativeTestsByDate: [],
  cumulativeTestsByDateLoading: true,
  analyticsTabData: [],
  analyticsTabDataLoading: true,
};

export default function trendsReducer(state = initialState, action) {
  switch (action.type) {
    case TRENDS_FETCH_BUILDS_BY_DATE_STARTED: {
      return { ...state, buildsByDate: [], buildsByDateAvg: null, buildsByDateLoading: true };
    }

    case TRENDS_FETCH_BUILDS_BY_DATE_SUCCESS: {
      const { data, params } = action.payload;

      if (!data.length) {
        return {
          ...state,
          buildsByDate: [],
          buildsByDateAvg: null,
          buildsByDateLoading: false,
        };
      }

      const { start_date, end_date } = params;

      const filledData = fillEmptyDataByDate({
        data,
        formatGroupKey: (groupKey) => groupKey.split('T')[0],
        getDefaultData: (dataItem) => ({
          created_at: dataItem,
        }),
        groupKeyPath: ['created_at'],
        rangeData: getDaysBetweenDates({ startDate: start_date, endDate: end_date }),
      });

      const dataAvg =
        filledData.reduce((acc, el) => {
          return acc + (el?.build_execution_status?.total_builds_executed ?? 0);
        }, 0) / filledData.length;

      return {
        ...state,
        buildsByDate: filledData,
        buildsByDateAvg: dataAvg,
        buildsByDateLoading: false,
      };
    }

    case TRENDS_FETCH_TESTS_BY_COMMIT_STARTED: {
      return { ...state, testsByCommit: [], testsByCommitAvg: null, testsByCommitLoading: true };
    }

    case TRENDS_FETCH_TESTS_BY_COMMIT_SUCCESS: {
      const { data, params } = action.payload;

      if (!data.length) {
        return {
          ...state,
          testsByCommit: [],
          testsByCommitAvg: null,
          testsByCommitLoading: false,
        };
      }

      const { per_page } = params;

      const itemsToFill = Math.abs(per_page - data.length);
      // - data reversed because tests are coming with latest tests first
      // - and we need to fill from the end as per UX
      const filledData = [
        ...data.reverse(),
        ...new Array(itemsToFill).fill({ commit_id: '__EMPTY__' }),
      ];

      const dataAvg =
        filledData.reduce((acc, el) => {
          return acc + (el?.execution_meta?.total_tests_executed ?? 0);
        }, 0) / filledData.length;

      return {
        ...state,
        testsByCommit: filledData,
        testsByCommitAvg: dataAvg,
        testsByCommitLoading: false,
      };
    }

    case TRENDS_FETCH_CUMULATIVE_TESTS_BY_DATE_STARTED: {
      return { ...state, cumulativeTestsByDate: [], cumulativeTestsByDateLoading: true };
    }

    case TRENDS_FETCH_CUMULATIVE_TESTS_BY_DATE_SUCCESS: {
      const data = action.payload.data.sort(
        (a, b) => new Date(a.created_at).valueOf() - new Date(b.created_at).valueOf()
      );

      return {
        ...state,
        cumulativeTestsByDate: data,
        cumulativeTestsByDateLoading: false,
      };
    }

    case TRENDS_FETCH_ANALYTICS_TABLE_DATA_BY_TYPE_STARTED: {
      return { ...state, analyticsTabData: [], analyticsTabDataLoading: true };
    }

    case TRENDS_FETCH_ANALYTICS_TABLE_DATA_BY_TYPE_SUCCESS: {
      const data = action.payload.data;

      return {
        ...state,
        analyticsTabData: data,
        analyticsTabDataLoading: false,
      };
    }

    case TRENDS_UNMOUNT: {
      return {
        ...state,
        ...initialState,
      };
    }

    default:
      return state;
  }
}
