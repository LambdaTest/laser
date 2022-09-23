import {
  SETTINGS_FETCH_ORG_CREDITS_STARTED,
  SETTINGS_FETCH_ORG_CREDITS_SUCCESS,
  SETTINGS_FETCH_USER_USAGE_STARTED,
  SETTINGS_FETCH_USER_USAGE_SUCCESS,
  SETTINGS_FETCH_SYNAPSE_COUNT_STARTED,
  SETTINGS_FETCH_SYNAPSE_COUNT_SUCCESS,
  SETTINGS_UNMOUNT,
} from '../actionTypeConstants/constants';

const initialState = {
  creditsByOrgData: [],
  areCreditsByOrgLoading: true,
  creditsByOrgMetadata: {},
  userUsageDetails: null,
  areUserUsageDetailsLoading: true,
  synapseCountData: {},
  synapseCountDataLoading: true,
};

export default function settingsReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SETTINGS_FETCH_USER_USAGE_STARTED: {
      return {
        ...state,
        userUsageDetails: null,
        areUserUsageDetailsLoading: true,
      };
    }

    case SETTINGS_FETCH_USER_USAGE_SUCCESS: {
      return {
        ...state,
        userUsageDetails: payload.data,
        areUserUsageDetailsLoading: false,
      };
    }

    case SETTINGS_FETCH_ORG_CREDITS_STARTED: {
      const { nextCursor } = payload.params;

      const isFirstPageFetch = !nextCursor;

      return {
        ...state,
        ...(isFirstPageFetch
          ? {
              creditsByOrgData: [],
              creditsByOrgMetadata: {},
            }
          : {}),
        areCreditsByOrgLoading: true,
      };
    }

    case SETTINGS_FETCH_ORG_CREDITS_SUCCESS: {
      const { data, response_metadata } = payload.data;
      const { nextCursor } = payload.params;

      const isFirstPageFetch = !nextCursor;
      const creditsByOrgData = isFirstPageFetch ? data : [...state.creditsByOrgData, ...data];

      return {
        ...state,
        creditsByOrgData,
        areCreditsByOrgLoading: false,
        creditsByOrgMetadata: response_metadata,
      };
    }

    case SETTINGS_FETCH_SYNAPSE_COUNT_STARTED: {
      return {
        ...state,
        synapseCountDataLoading: true,
      };
    }

    case SETTINGS_FETCH_SYNAPSE_COUNT_SUCCESS: {
      return {
        ...state,
        synapseCountData: payload.data,
        synapseCountDataLoading: false,
      };
    }

    case SETTINGS_UNMOUNT: {
      return {
        ...state,
        ...initialState,
      };
    }

    default:
      return state;
  }
}
