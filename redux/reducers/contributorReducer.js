import {
  CONTRIBUTORS_FETCHED_STATUS,
  FETCH_CONTRIBUTORS_STARTED,
  FETCH_CONTRIBUTORS_SUCCESS,
  UNMOUNT_CONTRIBUTORS,
} from '../actionTypeConstants/constants';

const initialState = {
  contributors: [],
  isContributorsFetched: false,
  isContributorsFetching: true,
  resMetaData: {},
};
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONTRIBUTORS_STARTED: {
      const { freshPage, status } = action.payload;
      return {
        ...state,
        isContributorsFetching: status,
        contributors: freshPage ? [] : state.contributors,
      };
    }
    case FETCH_CONTRIBUTORS_SUCCESS: {
      let { contributors, resMetaData } = state;
      const { freshPage, data } = action.payload;

      if (freshPage) {
        contributors = data.authors;
      } else {
        contributors = [...contributors, ...data.authors];
      }
      let uniqueArr = [...new Map(contributors.map((el) => [el['author']['Name'], el])).values()];
      resMetaData = data.response_metadata;
      return {
        ...state,
        contributors: uniqueArr,
        resMetaData: resMetaData,
      };
    }
    case CONTRIBUTORS_FETCHED_STATUS:
      return { ...state, isContributorsFetched: action.payload.status };
    case UNMOUNT_CONTRIBUTORS:
      return { ...state, contributors: [], resMetaData: {} };
    default:
      return state;
  }
};
