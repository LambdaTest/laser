import { 
    FETCH_INSIGHTS_STARTED, 
    FETCH_INSIGHTS_SUCCESS, 
    INSIGHTS_FETCHED_STATUS,
    UNMOUNT_INSIGHTS
  } from "../actionTypeConstants/constants";

const initialState = {
    isInsightsFetching: true,
    isInsightsFetched: false,
    insights: [],
    resMetaData: {}
}
export default (state=initialState, action) => {
    switch (action.type) {
      case FETCH_INSIGHTS_STARTED:
          return { ...state, isInsightsFetching: action.payload.status };
      case FETCH_INSIGHTS_SUCCESS: {
          let { insights, resMetaData } = state;
          // insights = [...insights, ...action.payload.data.tests];
          // let uniqueArr = [...new Map(insights.map(el =>
          //   [el["id"], el])).values()]
          // insights = action.payload.data.tests;
          let uniqueArr = [];
          if(action.payload.data.FE_filter) {
            uniqueArr = action.payload.data.tests;
          } else {
            insights = [...insights, ...action.payload.data.tests];
            uniqueArr = [...new Map(insights.map(el =>
              [el["id"], el])).values()]
          }
          resMetaData = action.payload.data.response_metadata;
          return {
            ...state,
            insights: uniqueArr,
            resMetaData: resMetaData
          };
        }
      case INSIGHTS_FETCHED_STATUS:
          return { ...state, isInsightsFetched: action.payload.status };
      case UNMOUNT_INSIGHTS:
        return { ...state, insights: [], resMetaData: {} ,isInsightsFetching: true, isInsightsFetched: false };
      default:
          return state
    }

}