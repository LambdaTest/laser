import { IStepValue } from '../interface';
import { STEPS_CONFIG } from '../constants';
import { validateConfig } from './validateConfig';

export default function getCurrentActiveConfig(configState: {
  [key: string]: IStepValue | IStepValue[];
}) {
  const steps = STEPS_CONFIG.map((step) => step.key);

  const activeIndex = steps.findIndex((step) => {
    return !validateConfig({ [step]: configState[step] });
  });

  return [activeIndex < 0 ? steps.length : activeIndex, steps[activeIndex]];
}
