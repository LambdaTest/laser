import { IStepValue } from '../interface';

function isValuePresent(config: IStepValue) {
  if (!config.value) {
    return false;
  } else if (config.value === 'custom' && !config.customValue) {
    return false;
  }

  return true;
}

export function validateConfig(configState: { [key: string]: IStepValue | IStepValue[] }) {
  for (const configKey in configState) {
    const config = configState[configKey];
    let configToCheck: any = config;
    if (Array.isArray(config)) {
      if (config.length === 0) {
        return false;
      }
      configToCheck = config[0];
    }
    if (!isValuePresent(configToCheck)) {
      return false;
    }
  }

  return true;
}
