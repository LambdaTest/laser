import { combineReducers } from "redux";

import buildReducer from "./buildReducer";
import commitReducer from "./commitReducer";
import contributorReducer from "./contributorReducer";
import insightReducer from "./insightReducer";
import insightsFlakyTestsReducer from './insightsFlakyTestsReducer';
import orgReducer from "./orgReducer";
import persistReducer from "./persistReducer";
import repoReducer from "./repoReducer";
import settingsReducer from "./settingsReducer";
import testReducer from "./testReducer";
import trendsReducer from "./trendsReducer";
import repoSettingsReducer from './repoSettingsReducer'

const rootReducer = combineReducers({
  buildData: buildReducer,
  commitData: commitReducer,
  contributorData: contributorReducer,
  insightData: insightReducer,
  insightsFlakyTestsData: insightsFlakyTestsReducer,
  orgData: orgReducer,
  persistData: persistReducer,
  repoData: repoReducer,
  settingsData: settingsReducer,
  testData: testReducer,
  trendsData: trendsReducer,
  repoSettingsData: repoSettingsReducer,
});

export default (state, action) =>
  rootReducer(action.type === 'CLEAR_AUTH_DATA' ? undefined : state, action);