import {
  REPO_SETTINGS_ADD_FTM_CONFIG_STARTED,
  REPO_SETTINGS_ADD_FTM_CONFIG_SUCCESS,
  REPO_SETTINGS_ADD_POSTMERGE_CONFIG_STARTED,
  REPO_SETTINGS_ADD_POSTMERGE_CONFIG_SUCCESS,
  REPO_SETTINGS_FETCH_BRANCHES_LIST_STARTED,
  REPO_SETTINGS_FETCH_BRANCHES_LIST_SUCCESS,
  REPO_SETTINGS_FETCH_BRANCHES_PREONBOARDING_LIST_STARTED,
  REPO_SETTINGS_FETCH_BRANCHES_PREONBOARDING_LIST_SUCCESS,
  REPO_SETTINGS_FETCH_FTM_CONFIG_LIST_STARTED,
  REPO_SETTINGS_FETCH_FTM_CONFIG_LIST_SUCCESS,
  REPO_SETTINGS_FETCH_POSTMERGE_CONFIG_LIST_STARTED,
  REPO_SETTINGS_FETCH_POSTMERGE_CONFIG_LIST_SUCCESS,
  REPO_SETTINGS_UNMOUNT,
  REPO_SETTINGS_UPDATE_FTM_CONFIG_STARTED,
  REPO_SETTINGS_UPDATE_FTM_CONFIG_SUCCESS,
  REPO_SETTINGS_UPDATE_POSTMERGE_CONFIG_STARTED,
  REPO_SETTINGS_UPDATE_POSTMERGE_CONFIG_SUCCESS,
  REPO_SETTINGS_DELINK_REPO_STARTED,
  REPO_SETTINGS_DELINK_REPO_SUCCESS,
  SETTINGS_VALIDATE_YAML_CONFIG_STARTED,
  SETTINGS_VALIDATE_YAML_CONFIG_SUCCESS,
} from '../actionTypeConstants/constants';

const initialState = {
  activeFTMConfigList: [],
  activePostmergeConfigList: [],
  branches: [],
  ftmConfigList: [],
  inactiveFTMConfigList: [],
  inactivePostmergeConfigList: [],
  isBranchesLoading: true,
  isDelinkRepoLoading: false,
  isFTMConfigAddLoading: false,
  isFTMConfigLoading: true,
  isFTMConfigUpdateLoading: false,
  isPostmergeConfigAddLoading: false,
  isPostmergeConfigLoading: true,
  isPostmergeConfigUpdateLoading: false,
  isPreBranchesLoading: false,
  isYamlConfigValid: false,
  isYamlConfigValidLoading: false,
  postmergeConfigList: [],
  preBranches: [{ label: 'All Branches', value: '*' }],
  preBranchesNextCursor: '',
  yamlConfigValidityMessage: '',
};

function groupByStatus(list) {
  return list.reduce(
    (acc, strategy) => {
      if (strategy.is_active) {
        acc.active.push(strategy);
      } else {
        acc.inactive.push(strategy);
      }
      return acc;
    },
    { active: [], inactive: [] }
  );
}

export default function repoSettingsReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REPO_SETTINGS_FETCH_BRANCHES_LIST_STARTED: {
      return {
        ...state,
        isBranchesLoading: true,
      };
    }

    case REPO_SETTINGS_FETCH_BRANCHES_LIST_SUCCESS: {
      return {
        ...state,
        branches: [{ label: 'All Branches', value: '*' }].concat(
          payload.data.map((branch) => ({ label: branch, value: branch }))
        ),
        isBranchesLoading: false,
      };
    }

    case REPO_SETTINGS_FETCH_BRANCHES_PREONBOARDING_LIST_STARTED: {
      return {
        ...state,
        isPreBranchesLoading: true,
      };
    }

    case REPO_SETTINGS_FETCH_BRANCHES_PREONBOARDING_LIST_SUCCESS: {
      const {
        data,
        meta: { current, next },
      } = payload;

      const formattedBranches = payload.data.map((branch) => ({ label: branch, value: branch }));
      let preBranches = [...state.preBranches, ...formattedBranches];
      preBranches = [...new Map(preBranches.map((item) => [item.value, item])).values()];

      return {
        ...state,
        preBranches,
        preBranchesNextCursor: next,
        isPreBranchesLoading: false,
      };
    }

    case REPO_SETTINGS_FETCH_POSTMERGE_CONFIG_LIST_STARTED: {
      return {
        ...state,
        isPostmergeConfigLoading: true,
      };
    }

    case REPO_SETTINGS_FETCH_POSTMERGE_CONFIG_LIST_SUCCESS: {
      const { active, inactive } = groupByStatus(payload.data);

      return {
        ...state,
        activePostmergeConfigList: active,
        inactivePostmergeConfigList: inactive,
        isPostmergeConfigLoading: false,
        postmergeConfigList: payload.data,
      };
    }

    case REPO_SETTINGS_ADD_POSTMERGE_CONFIG_STARTED: {
      return {
        ...state,
        isPostmergeConfigAddLoading: true,
      };
    }

    case REPO_SETTINGS_ADD_POSTMERGE_CONFIG_SUCCESS: {
      return {
        ...state,
        isPostmergeConfigAddLoading: false,
      };
    }

    case REPO_SETTINGS_DELINK_REPO_STARTED: {
      return {
        ...state,
        isDelinkRepoLoading: true,
      };
    }

    case REPO_SETTINGS_DELINK_REPO_SUCCESS: {
      return {
        ...state,
        isDelinkRepoLoading: false,
      };
    }

    case REPO_SETTINGS_UPDATE_POSTMERGE_CONFIG_STARTED: {
      const { id } = payload.params;
      const postmergeConfigList = state.postmergeConfigList.map((strategy) => ({
        ...strategy,
        loading: strategy.id === id,
      }));

      const { active, inactive } = groupByStatus(postmergeConfigList);

      return {
        ...state,
        activePostmergeConfigList: active,
        inactivePostmergeConfigList: inactive,
        isPostmergeConfigUpdateLoading: true,
        postmergeConfigList,
      };
    }

    case REPO_SETTINGS_UPDATE_POSTMERGE_CONFIG_SUCCESS: {
      return {
        ...state,
        isPostmergeConfigUpdateLoading: false,
      };
    }

    case REPO_SETTINGS_FETCH_FTM_CONFIG_LIST_STARTED: {
      return {
        ...state,
        isFTMConfigLoading: true,
      };
    }

    case REPO_SETTINGS_FETCH_FTM_CONFIG_LIST_SUCCESS: {
      const { active, inactive } = groupByStatus(payload.data);

      return {
        ...state,
        activeFTMConfigList: active,
        inactiveFTMConfigList: inactive,
        isFTMConfigLoading: false,
        ftmConfigList: payload.data,
      };
    }

    case SETTINGS_VALIDATE_YAML_CONFIG_STARTED: {
      return {
        ...state,
        isYamlConfigValid: false,
        isYamlConfigValidLoading: true,
        yamlConfigValidityMessage: '',
      };
    }

    case SETTINGS_VALIDATE_YAML_CONFIG_SUCCESS: {
      const { data, error } = payload;
      console.log(payload);
      return {
        ...state,
        isYamlConfigValid: data === 'Valid',
        isYamlConfigValidLoading: false,
        yamlConfigValidityMessage: error,
      };
    }

    case REPO_SETTINGS_ADD_FTM_CONFIG_STARTED: {
      return {
        ...state,
        isFTMConfigAddLoading: true,
      };
    }

    case REPO_SETTINGS_ADD_FTM_CONFIG_SUCCESS: {
      return {
        ...state,
        isFTMConfigAddLoading: false,
      };
    }

    case REPO_SETTINGS_UPDATE_FTM_CONFIG_STARTED: {
      const { id } = payload.params;
      const ftmConfigList = state.ftmConfigList.map((strategy) => ({
        ...strategy,
        loading: strategy.id === id,
      }));

      const { active, inactive } = groupByStatus(ftmConfigList);

      return {
        ...state,
        activeFTMConfigList: active,
        inactiveFTMConfigList: inactive,
        isFTMConfigUpdateLoading: true,
        ftmConfigList,
      };
    }

    case REPO_SETTINGS_UPDATE_FTM_CONFIG_SUCCESS: {
      return {
        ...state,
        isFTMConfigUpdateLoading: false,
      };
    }

    case REPO_SETTINGS_UNMOUNT: {
      return {
        ...state,
        ...initialState,
      };
    }

    default:
      return state;
  }
}
