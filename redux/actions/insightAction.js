import {
  FETCH_INSIGHTS_STARTED,
  FETCH_INSIGHTS_SUCCESS,
  INSIGHTS_FETCHED_STATUS,
  UNMOUNT_INSIGHTS,
} from '../actionTypeConstants/constants';
import { httpGet, httpPost } from '../httpclient/index';
import { toast } from 'react-toastify';
import { apiStatus, errorInterceptor } from '../helper';
import {
  getCookieGitProvider,
  getCookieOrgName,
  getCookieTasRepoBranch,
} from '../../helpers/genericHelpers';

const InsightsDataURLForType = {
  default: '/analytics/graphs/status-data',
  job: '/analytics/graphs/jobs/status-data',
};

export const fetchInsights = (
  repo,
  start_date,
  end_date,
  next = '',
  FE_filter = false,
  searchText = '',
  jobType = '',
  variant = 'default'
) => {
  return (dispatch) => {
    dispatch(apiStatus(FETCH_INSIGHTS_STARTED, { status: true }));
    httpGet(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${InsightsDataURLForType[variant || 'default']}`,
      {
        branch: getCookieTasRepoBranch(),
        end_date: end_date,
        git_provider: getCookieGitProvider(),
        next_cursor: next,
        org: getCookieOrgName(),
        per_page: 100,
        repo: repo,
        start_date: start_date,
        tag: jobType,
        text: searchText,
      }
    )
      .then((data) => {
        let _data = data;
        _data.FE_filter = FE_filter;
        dispatch(apiStatus(INSIGHTS_FETCHED_STATUS, { status: true }));
        dispatch(apiStatus(FETCH_INSIGHTS_STARTED, { status: false }));
        dispatch(apiStatus(FETCH_INSIGHTS_SUCCESS, { data: _data }));
      })
      .catch((error) => {
        dispatch(
          apiStatus(FETCH_INSIGHTS_SUCCESS, {
            data: { tests: null, response_metadata: { next_cursor: '' }, FE_filter: FE_filter },
          })
        );
        dispatch(apiStatus(FETCH_INSIGHTS_STARTED, { status: false }));
        dispatch(apiStatus(INSIGHTS_FETCHED_STATUS, { status: false }));
        errorInterceptor(error);
      });
  };
};

export const unmountInsights = () => {
  return (dispatch) => {
    dispatch(apiStatus(UNMOUNT_INSIGHTS));
  };
};
