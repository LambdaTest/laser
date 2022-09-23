import { IStepValue } from '../interface';

export default function getYamlConfigParsedData({
  framework,
  postMergePatterns,
  preRunCommands,
}: {
  framework: IStepValue;
  postMergePatterns: IStepValue[];
  preRunCommands: IStepValue[];
}) {
  const LINE_SPERATOR = '\n    ';
  const ARRAY_IDENTIFIER = '- ';

  const preRun = preRunCommands
    ?.map((cmd: any) => (cmd?.value !== 'custom' ? cmd?.value : cmd?.customValue))
    .filter((cmd: any) => cmd);

  const preRunFormatted = preRun.length
    ? ARRAY_IDENTIFIER + preRun.join(`${LINE_SPERATOR}${ARRAY_IDENTIFIER}`)
    : '';

  const postMerge = postMergePatterns
    ?.map((pattern: any) => (pattern?.value ? `"${pattern?.value}"` : ''))
    .filter((pattern: any) => pattern);
  const postMergeFormatted = postMerge.length
    ? ARRAY_IDENTIFIER + postMerge.join(`${LINE_SPERATOR}${ARRAY_IDENTIFIER}`)
    : '';

  return `---
# THIS IS A SAMPLE ".tas.yml" CONFIGURATION FILE
# FIRSTLY - You need to specify which testing framework you are using. Currently supported JS frameworks are : mocha, jest and jasmine.
framework: ${
    (framework?.value !== 'custom' ? framework?.value : framework?.customValue) || ''
  } # mocha # framework should be as per your project

preRun:
  # SECONDLY - You need to set the preRun commands. These are shell commands executed inside the root level of your git repository before running the tests. preRun commands are executed using non-login shells by default, so you must explicitly source any dotfiles as part of the command.
  command:
    ${
      preRunFormatted ||
      `# - npm install
    # - yarn install
    # - npm ci
    # - yarn build`
    }

postMerge:
  # THIRDLY - You need to set postMerge patterns.
  # These would be the glob patterns for the test cases that you want to execute in the post-merge jobs. A postMerge test execution job is initiated whenever a PR is merged into a branch.
  pattern:
    # glob-patterns to discover tests to run in case of postMerge
    ${
      postMergeFormatted ||
      `# - "./unit_test_folder_A/**/*.spec.ts"
    # - "./unit_test_folder_B/**/*.ts"`
    }
`;
}
