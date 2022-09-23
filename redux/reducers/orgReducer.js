import { 
  FETCH_ORGS_STARTED, 
  FETCH_ORGS_SUCCESS, 
  ORGS_FETCHED_STATUS
  } from "../actionTypeConstants/constants";

const initialState = {
    isOrgsFetching: true,
    isOrgsFetched: false,
    orgs: [],
}
export default (state=initialState, action) => {
    switch (action.type) {
      case FETCH_ORGS_STARTED:
          return { ...state, isOrgsFetching: action.payload.status };
      case FETCH_ORGS_SUCCESS: {
          return {
            ...state,
            orgs: action.payload.data,
          };
        }
      case ORGS_FETCHED_STATUS:
          return { ...state, isOrgsFetched: action.payload.status };
      default:
          return state
    }

}