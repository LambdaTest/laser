import {
  INSIGHTS_FLAKY_TESTS_FETCH_GRAPH_DATA_STARTED,
  INSIGHTS_FLAKY_TESTS_FETCH_GRAPH_DATA_SUCCESS,
  INSIGHTS_FLAKY_TESTS_FETCH_LIST_DATA_STARTED,
  INSIGHTS_FLAKY_TESTS_FETCH_LIST_DATA_SUCCESS,
  INSIGHTS_FLAKY_TESTS_UNMOUNT,
} from '../actionTypeConstants/constants';

const INITIAL_STATE = {
  graphDataLoading: true,
  graphData: [],
  listDataLoading: true,
  listData: [],
  listMeta: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INSIGHTS_FLAKY_TESTS_FETCH_GRAPH_DATA_STARTED: {
      return { ...state, graphData: [], graphDataLoading: true };
    }

    case INSIGHTS_FLAKY_TESTS_FETCH_GRAPH_DATA_SUCCESS: {
      const { data } = action.payload;
      return {
        ...state,
        graphData: data,
        graphDataLoading: false,
      };
    }

    case INSIGHTS_FLAKY_TESTS_FETCH_LIST_DATA_STARTED: {
      const { firstPage } = action.payload;
      return {
        ...state,
        listDataLoading: true,
        listData: firstPage ? [] : state.listData,
      };
    }

    case INSIGHTS_FLAKY_TESTS_FETCH_LIST_DATA_SUCCESS: {
      const { firstPage, data, meta } = action.payload;

      let listData;

      if (firstPage) {
        listData = data;
      } else {
        listData = [...state.listData, ...data];
      }

      return {
        ...state,
        listData,
        listDataLoading: false,
        listMeta: meta,
      };
    }

    case INSIGHTS_FLAKY_TESTS_UNMOUNT: {
      return {
        ...state,
        ...INITIAL_STATE,
      };
    }

    default:
      return state;
  }
};
