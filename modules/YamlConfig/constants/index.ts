import { IStep, IStepValue } from "../interface";

export const STEPS_DEFAULT_VALUES: { [key: string]: IStepValue | IStepValue[] } = {
  commit: { value: false },
  copy: { value: false },
  framework: {},
  language: { value: 'javascript' },
  postMergePatterns: [{ value: '' }],
  preRunCommands: [{ value: '' }],
};

export const STEPS_CONFIG: IStep[] = [
  {
    key: 'language',
    label: 'Select your language',
    type: 'button_select',
    options: [
      { key: 'javascript', label: 'Javascript' },
      { key: 'typescript', label: 'Typescript' },
    ],
  },
  {
    key: 'framework',
    label: 'Tell us the testing framework you are using',
    options: [
      { key: 'jasmine', label: 'Jasmine' },
      { key: 'jest', label: 'Jest' },
      { key: 'mocha', label: 'Mocha' },
    ],
    type: 'select',
  },
  {
    description: "For instance 'yarn install', 'yarn build', etc.",
    key: 'preRunCommands',
    label: 'What set of commands should we run before running your tests?',
    options: [
      { key: 'npm install', label: 'npm install' },
      { key: 'yarn install', label: 'yarn install' },
      { key: 'npm ci', label: 'npm ci' },
      { key: 'yarn build', label: 'yarn build' },
      { key: 'custom', label: 'Custom' },
    ],
    type: 'multi_select',
  },
  {
    key: 'postMergePatterns',
    label: 'Enter the glob patterns (path) of the tests that you want to execute.',
    type: 'multi_text',
  },
  {
    key: 'copy',
    type: 'copy_component',
  },
  {
    key: 'commit',
    type: 'commit_component',
  },
];

export const PostmergePatternsMap = {
  javascript: {
    jasmine: '**/*spec.js',
    jest: '**/__tests__/*test.js',
    mocha: 'test/**/*.js',
  },
  typescript: {
    jasmine: '**/*.spec.ts',
    jest: '**/__tests__/*test.ts',
    mocha: 'test/**/*.ts',
  },
};
