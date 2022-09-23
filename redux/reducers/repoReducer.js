import {
  ENABLE_REPO_STARTED,
  ENABLE_REPO_SUCCESS,
  FETCH_REPOS_STARTED,
  FETCH_REPOS_SUCCESS,
  UNMOUNT_REPOS,
  REPOS_FETCHED_STATUS,
  REPO_ENABLED_STATUS,
  FETCH_ACTIVE_REPOS_STARTED,
  FETCH_ACTIVE_REPOS_SUCCESS,
  ACTIVE_REPOS_FETCHED_STATUS,
  UNMOUNT_ACTIVE_REPOS,
  IMPORT_CUSTOM_REPO_STARTED,
  IMPORT_CUSTOM_REPO_SUCCESS,
  IMPORT_CUSTOM_REPO_STATUS
} from "../actionTypeConstants/constants";

const initialState = {
    isReposFetching: true,
    isReposFetched: false,
    repos: [],
    resMetaData: {},
    isRepoEnabling: true,
    isRepoEnabled: false,
    isActiveReposFetching: true,
    isActiveReposFetched: false,
    activeRepos: [],
    activeResMetaData: {},
    isImportRepoFetching: false,
    isImportRepoFetched: false,
    customImportRes: []
}
export default (state=initialState, action) => {
    switch (action.type) {
        case FETCH_REPOS_STARTED:
            return { ...state, isReposFetching: action.payload.status };
        case FETCH_REPOS_SUCCESS: {
            let { repos, resMetaData } = state;
            repos = [...repos, ...action.payload.data.repositories];
            let uniqueArr = [...new Map(repos.map(el =>
              [el["ssh_url"], el])).values()]
            resMetaData = action.payload.data.response_metadata;
            return {
              ...state,
              repos: uniqueArr,
              resMetaData: resMetaData
            };
          }
        case REPOS_FETCHED_STATUS:
            return { ...state, isReposFetched: action.payload.status };
        case UNMOUNT_REPOS:
          return { ...state, repos: [], resMetaData: {}  };
        case ENABLE_REPO_STARTED:
            let { repos } = state;
            let tempRepos = [...repos];
            let repoIndex = tempRepos.findIndex((el => el.link == action.payload.link));
            tempRepos[repoIndex].isRepoEnabling = action.payload.status
            return {
              ...state,
              repos: tempRepos,
              isRepoEnabling: action.payload.status
            };
        case ENABLE_REPO_SUCCESS: {
            let { repos } = state;
            let tempRepos = [...repos];
            let repoIndex = tempRepos.findIndex((el => el.link == action.payload.data));
            tempRepos[repoIndex].active = true
            return {
              ...state,
              repos: tempRepos
            };
          }
        case REPO_ENABLED_STATUS:
            return { ...state, isRepoEnabled: action.payload.status };
        case FETCH_ACTIVE_REPOS_STARTED:
            return { ...state, isActiveReposFetching: action.payload.status };
        case FETCH_ACTIVE_REPOS_SUCCESS: {
            let { activeRepos, activeResMetaData } = state;
            let uniqueArr = []
            if (action.payload.filter) {
              uniqueArr = action.payload.data.repositories ? action.payload.data.repositories : [];
            } else {
              activeRepos = [...activeRepos, ...(action.payload.data.repositories ? action.payload.data.repositories : [])];
              uniqueArr = [...new Map(activeRepos.map(el =>
              [el["name"], el])).values()]
            }
            activeResMetaData = action.payload.data.response_metadata;
            return {
              ...state,
              activeRepos: uniqueArr,
              activeResMetaData: activeResMetaData
            };
          }
        case ACTIVE_REPOS_FETCHED_STATUS:
            return { ...state, isActiveReposFetched: action.payload.status };
        case UNMOUNT_ACTIVE_REPOS:
          return { ...state, activeRepos: [], activeResMetaData: {}, isActiveReposFetching: true, isActiveReposFetched:false };
        case IMPORT_CUSTOM_REPO_STARTED:
          return { ...state, isImportRepoFetching: action.payload.status };
        case IMPORT_CUSTOM_REPO_SUCCESS: {
            return {
              ...state,
              customImportRes: action.payload.data
            };
          }
        case IMPORT_CUSTOM_REPO_STATUS:
            return { ...state, isImportRepoFetched: action.payload.status };
        default:
            return state
    }

}