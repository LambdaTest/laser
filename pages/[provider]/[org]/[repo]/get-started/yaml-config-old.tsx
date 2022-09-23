import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import _ from 'underscore';

import jsyaml from 'js-yaml';
// @ts-ignore
const CodeMirrorReact = dynamic(() => import('react-codemirror2').then((mod) => mod.Controlled), {
  ssr: false,
});

if (typeof navigator !== 'undefined') {
  require('codemirror/mode/yaml/yaml');

  require('codemirror/addon/lint/lint');
  require('codemirror/addon/lint/yaml-lint');

  require('codemirror/lib/codemirror.css');
  require('codemirror/theme/material.css');
  require('codemirror/addon/lint/lint.css');

  // @ts-ignore
  window.jsyaml = {
    loadAll: (code: any) => {
      return jsyaml.loadAll(code);
    },
  };
}

import { fetchBuilds, unmountBuilds } from 'redux/actions/buildAction';
import { fetchCommits, unmountCommits } from 'redux/actions/commitAction';

import useIsApiLoadComplete from 'hooks/useIsApiLoadComplete';

import { downloadText, copyText } from 'helpers/textHelpers';

import Image from 'components/Tags/Image';
import Layout from 'components/Layout';
import Text from 'components/Tags/Text';
import Secrets from 'components/Secrets';

const DEFAULT_YAML_CONFIG = `---
# THIS IS A SAMPLE ".tas.yml" CONFIGURATION FILE
#
# supported frameworks: mocha|jest|jasmine
framework: #mocha

preRun:
  # set of commands to run before running the tests
  # for eg \`yarn install\`, \`yarn build\`
  command:
    # change the command according to the package manager used.
    # For eg, npm ci, yarn install
    # - npm install

postMerge:
  # glob-pattern for identifying the test files
  pattern:
    # glob-patterns to discover tests to run in case of postMerge
    # - "./unit_test_folder_A/**/*.spec.ts"
    # - "./unit_test_folder_B/**/*.ts"
`;

const STEPS_GRID_CONFIG = [
  { header: 'Required', key: 'required' },
  { header: 'Type', key: 'type' },
];

const BASIC_STEPS_CONFIG = [
  {
    label: 'framework',
    description: (
      <div>
        Specify which testing <span className="tas__highlight-code">framework</span> you are using.
        Currently, we support these testing frameworks:{' '}
        <span className="tas__highlight-code">mocha</span>,{' '}
        <span className="tas__highlight-code">jest</span> and{' '}
        <span className="tas__highlight-code">jasmine</span>.
      </div>
    ),
    example: (
      <div className="tas__code__line">
        <div className="tas__code__line-number">1</div>
        <div className="tas__code__line-text">
          <span className="font-bold text-green-800">framework:</span>
          <span> jest</span>
        </div>
      </div>
    ),
    content: {
      required: 'Yes',
      type: 'String',
    },
    value: 'framework',
  },
  {
    description:
      'These are shell commands executed inside the root level of your git repository before running the tests. preRun commands are executed using non-login shells by default, so you must explicitly source any dotfiles as part of the command.',
    example: (
      <div className="tas__code mb-10">
        <div className="tas__code__line">
          <div className="tas__code__line-number">1</div>
          <div className="tas__code__line-text text-green-800 font-bold">preRun:</div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">2</div>
          <div className="tas__code__line-text ml-10 flex justify-between">
            <span>commands</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">3</div>
          <div className="tas__code__line-text ml-20 flex justify-between">
            <span>- npm ci</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">4</div>
          <div className="tas__code__line-text ml-20 flex justify-between">
            <span>- npm run lint</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">5</div>
          <div className="tas__code__line-text ml-10 flex justify-between">
            <span>#env:</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">6</div>
          <div className="tas__code__line-text ml-20 flex justify-between">
            <span>#NODE_ENV: development</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">7</div>
          <div className="tas__code__line-text ml-20 flex justify-between">
            <span>
              #AWS_KEY: $&#123;&#123; secrets.AWS_KEY &#125;&#125; # More details in Managing
              Secrets section
            </span>
          </div>
        </div>
      </div>
    ),
    content: {
      key: 'preRun',
      required: 'Yes',
      type: (
        <div>
          <div className="mb-5">Object</div>
          <ul className="list-disc pl-15">
            <li className="mb-5">
              <span className="tas__highlight-code">commands</span> - Required. Array of shell
              commands executed before running the tests, typically to set up the test execution
              environment.
            </li>
            <li className="mb-5">
              <span className="tas__highlight-code">env</span> - Optional. Array of k/v pairs to set
              env variables for the pre-run commands.
            </li>
          </ul>
        </div>
      ),
    },
    label: 'preRun',
    value: 'preRun',
  },
  {
    description:
      'This section contains the glob patterns for the test cases that you want to execute in the post-merge jobs, a test execution job that will be initiated every time a PR is merged into a branch.',
    example: (
      <div className="tas__code mb-10">
        <div className="tas__code__line">
          <div className="tas__code__line-number">1</div>
          <div className="tas__code__line-text text-green-800 font-bold">postMerge:</div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">2</div>
          <div className="tas__code__line-text ml-10 flex justify-between">
            <span>pattern:</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">6</div>
          <div className="tas__code__line-text ml-20 flex justify-between">
            <span>- "test/unit/**/*.js"</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">5</div>
          <div className="tas__code__line-text ml-10 flex justify-between">
            <span>#env:</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">6</div>
          <div className="tas__code__line-text ml-20 flex justify-between">
            <span>#NODE_ENV: development</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">7</div>
          <div className="tas__code__line-text ml-20 flex justify-between">
            <span>
              #AWS_KEY: $&#123;&#123; secrets.AWS_KEY &#125;&#125; # More details in Managing
              Secrets section
            </span>
          </div>
        </div>
      </div>
    ),
    content: {
      key: 'postMerge',
      required: 'Yes',
      type: (
        <div>
          <div className="mb-5">Object</div>
          <ul className="list-disc pl-15">
            <li className="mb-5">
              <span className="tas__highlight-code">pattern</span> - Required. Array of testfile
              glob(s) or relative testfile(s) that needs to be executed
            </li>
            <li className="mb-5">
              <span className="tas__highlight-code">env</span> - Optional. Array of k/v pairs to set
              env variables for the postMerge execution environment.
            </li>
          </ul>
        </div>
      ),
    },
    label: 'postMerge',
    value: 'postMerge',
  },
];

const ADVANCED_STEPS_CONFIG = [
  {
    label: 'blocklist',
    description: (
      <div>
        There can be some test cases that you don't want to execute. Here you can add the list of
        tests, test suites or files that you want to blocklist (ignore) during execution. The input
        for this parameter is of the format{' '}
        <span className="tas__highlight-code">
          "&lt;file&gt;##&lt;suite-name&gt;##&lt;test-name&gt;"
        </span>
      </div>
    ),
    example: (
      <div className="tas__code mb-10">
        <div className="tas__code__line">
          <div className="tas__code__line-number">1</div>
          <div className="tas__code__line-text text-green-800 font-bold">blocklist:</div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">2</div>
          <div className="tas__code__line-text ml-10 flex justify-between text-tas-400">
            # blocklist test file.
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">3</div>
          <div className="tas__code__line-text ml-10 flex justify-between">
            - "test/unit/adapters/http.js"
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">4</div>
          <div className="tas__code__line-text ml-10 flex justify-between text-tas-400">
            # blocklist test suite.
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">5</div>
          <div className="tas__code__line-text ml-10 flex justify-between">
            - "test/unit/adapters/http.js##supports http with nodejs"
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">6</div>
          <div className="tas__code__line-text ml-10 flex justify-between text-tas-400">
            # blocklist test-case.
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">7</div>
          <div className="tas__code__line-text ml-10 flex justify-between">
            - "test/unit/adapters/http.js##supports http with nodejs##should support sockets"
          </div>
        </div>
      </div>
    ),
    content: {
      key: 'blocklist',
      required: 'No',
      type: 'Array<String>',
    },
    value: 'blocklist',
  },
  {
    description:
      'This section contains the glob patterns for the test cases that you want to execute in the pre-merge jobs, a test execution job that will be initiated every time a PR is raised.',
    example: (
      <div className="tas__code mb-10">
        <div className="tas__code__line">
          <div className="tas__code__line-number">1</div>
          <div className="tas__code__line-text text-green-800 font-bold">preMerge:</div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">2</div>
          <div className="tas__code__line-text ml-10 flex justify-between">
            <span>pattern:</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">6</div>
          <div className="tas__code__line-text ml-20 flex justify-between">
            <span>- "test/unit/**/*.js"</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">3</div>
          <div className="tas__code__line-text ml-10 flex justify-between">
            <span>#env:</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">4</div>
          <div className="tas__code__line-text ml-20 flex justify-between">
            <span>#NODE_ENV: test</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">5</div>
          <div className="tas__code__line-text ml-20 flex justify-between">
            <span>#AWS_KEY: $&#123;&#123; secrets.AWS_KEY &#125;&#125;</span>
          </div>
        </div>
      </div>
    ),
    content: {
      key: 'preMerge',
      required: 'No',
      type: (
        <div>
          <div className="mb-5">Object</div>
          <ul className="list-disc pl-15">
            <li className="mb-5">
              <span className="tas__highlight-code">pattern</span> - Required. Array of testfile
              glob(s) or relative testfile(s) that needs to be executed
            </li>
            <li className="mb-5">
              <span className="tas__highlight-code">env</span> - Optional. Array of k/v pairs to set
              env variables for the preMerge execution environment
            </li>
          </ul>
        </div>
      ),
    },
    label: 'preMerge',
    value: 'preMerge',
  },
  {
    description:
      'These are shell commands executed inside the root level of your git repository after running the tests. postRun commands are executed using non-login shells by default, so you must explicitly source any dotfiles as part of the command.',
    example: (
      <div className="tas__code mb-10">
        <div className="tas__code__line">
          <div className="tas__code__line-number">1</div>
          <div className="tas__code__line-text text-green-800 font-bold">postRun:</div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">2</div>
          <div className="tas__code__line-text ml-10 flex justify-between">
            <span>commands</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">3</div>
          <div className="tas__code__line-text ml-20 flex justify-between">
            <span>- npm run clean</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">4</div>
          <div className="tas__code__line-text ml-20 flex justify-between">
            <span>- node --version</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">5</div>
          <div className="tas__code__line-text ml-10 flex justify-between">
            <span>#env:</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">6</div>
          <div className="tas__code__line-text ml-20 flex justify-between">
            <span>#NODE_ENV: development</span>
          </div>
        </div>
        <div className="tas__code__line">
          <div className="tas__code__line-number">7</div>
          <div className="tas__code__line-text ml-20 flex justify-between">
            <span>#AWS_KEY: $&#123;&#123; secrets.AWS_KEY &#125;&#125;</span>
          </div>
        </div>
      </div>
    ),
    content: {
      key: 'postRun',
      required: 'No',
      type: (
        <div>
          <div className="mb-5">Object</div>
          <ul className="list-disc pl-15">
            <li className="mb-5">
              <span className="tas__highlight-code">commands</span> - Required. Array of shell
              commands executed after running the tests, typically to cleanup the test execution
              environment.
            </li>
            <li className="mb-5">
              <span className="tas__highlight-code">env</span> - Optional. Array of k/v pairs to set
              env variables for the post-run commands.
            </li>
          </ul>
        </div>
      ),
    },
    label: 'postRun',
    value: 'postRun',
  },
  {
    label: 'configFile',
    description:
      'You might need to add a framework specific configuraiton file in some cases. The relative path for the configuration file like your custom mocharc, jest.config, spec/support/jasmine.json etc will need to be mentioned here.',
    example: (
      <div className="tas__code__line">
        <div className="tas__code__line-number">1</div>
        <div className="tas__code__line-text">
          <span className="font-bold text-green-800">configFile:</span>
          <span> test/jest.config.json</span>
        </div>
      </div>
    ),
    content: {
      key: 'configFile',
      required: 'No',
      type: 'String',
    },
    value: 'configFile',
  },
  {
    description:
      'TAS uses the Latest node LTS version as default. You can provide the semantic version of nodejs required for your project here.',
    example: (
      <div className="tas__code mb-10">
        <div className="tas__code__line">
          <div className="tas__code__line-number">1</div>
          <div className="tas__code__line-text">
            <span className="text-green-800 font-bold">nodeVersion:</span>
            <span> 14.17.2</span>
          </div>
        </div>
      </div>
    ),
    content: {
      key: 'nodeVersion',
      required: 'No. Default latest node LTS version.',
      type: (
        <div>
          <a className=" text-blue-400 " href="https://semver.org/" target="_blank">
            SemVer
          </a>
        </div>
      ),
    },
    label: 'nodeVersion',
    value: 'nodeVersion',
  },
  {
    description:
      'You can configure whether to run test-cases smartly i.e. only run affected/impacted tests.',
    example: (
      <div className="tas__code mb-10">
        <div className="tas__code__line">
          <div className="tas__code__line-number">1</div>
          <div className="tas__code__line-text">
            <span className="text-green-800 font-bold">smartRun:</span>
            <span> false</span>
          </div>
        </div>
      </div>
    ),
    content: {
      key: 'smartRun',
      required: 'No. Default true.',
      type: 'Boolean',
    },
    label: 'smartRun',
    value: 'smartRun',
  },
  {
    description: (
      <div>
        If your project requires a higher configuration to run, you can set the machine
        configuration on which the tests should run using this parameter. Acceptable values:{' '}
        <span className="tas__highlight-code">xsmall</span>,{' '}
        <span className="tas__highlight-code">small</span>,{' '}
        <span className="tas__highlight-code">medium</span>,{' '}
        <span className="tas__highlight-code">large</span>
      </div>
    ),
    example: (
      <div className="tas__code mb-10">
        <div className="tas__code__line">
          <div className="tas__code__line-number">1</div>
          <div className="tas__code__line-text">
            <span className="text-green-800 font-bold">tier:</span>
            <span> small</span>
          </div>
        </div>
      </div>
    ),
    content: {
      key: 'tier',
      required: 'No. Default small.',
      type: 'String',
    },
    label: 'tier',
    value: 'tier',
  },
  {
    description:
      'You can define the number of containers in which the tests must be split into for parallel execution.',
    example: (
      <div className="tas__code mb-10">
        <div className="tas__code__line">
          <div className="tas__code__line-number">1</div>
          <div className="tas__code__line-text">
            <span className="text-green-800 font-bold">parallelism:</span>
            <span> 2</span>
          </div>
        </div>
      </div>
    ),
    content: {
      key: 'parallelism',
      required: 'No.',
      type: 'Integer',
    },
    label: 'parallelism',
    value: 'parallelism',
  },
  {
    label: 'containerImage',
    description:
      'The containerImage field is intended to be used in order to provide a custom docker image for test execution. This field will not work if you are on the TAS-Cloud mode. Configure this parameter only if you are Self Hosting TAS.',
    example: (
      <div className="tas__code__line">
        <div className="tas__code__line-number">1</div>
        <div className="tas__code__line-text">
          <span className="font-bold text-green-800">containerImage:</span>
          <span> lambdatest/nucleus:latest</span>
        </div>
      </div>
    ),
    content: {
      key: 'containerImage',
      required: 'No',
      type: 'String',
    },
    value: 'containerImage',
  },
  {
    description: (
      <div>
        The version field is intended to be used in order to issue warnings for deprecation or
        breaking changes on the platfrom level.
      </div>
    ),
    example: (
      <div className="tas__code mb-10">
        <div className="tas__code__line">
          <div className="tas__code__line-number">1</div>
          <div className="tas__code__line-text">
            <span className="text-green-800 font-bold">version:</span>
            <span> 1.0.0</span>
          </div>
        </div>
      </div>
    ),
    content: {
      key: 'version',
      required: 'No.',
      type: (
        <div>
          <a className="text-blue-400" href="https://semver.org/" target="_blank">
            SemVer
          </a>
        </div>
      ),
    },
    label: 'version',
    value: 'version',
  },
  {
    description: (
      <div className="px-20">
        <div className="text-size-14 font-bold mb-10">Mocha</div>
        <div className="text-size-14">
          Follow these steps to use a custom configuration file in mocha framework.
        </div>
        <ol className="text-size-14 py-10 pl-15 list-decimal">
          <li>
            <div>Create a mocha configuration file in the repository.</div>
            <div>
              <span className="tas__highlight-code">mocharc.yml</span>
            </div>
            <div className="tas__code my-10">
              <div className="tas__code__line">
                <div className="tas__code__line-number">1</div>
                <div className="tas__code__line-text text-green-800 font-bold">require:</div>
              </div>
              <div className="tas__code__line">
                <div className="tas__code__line-number">2</div>
                <div className="tas__code__line-text ml-10 flex justify-between">
                  - ts-node/register
                </div>
              </div>
              <div className="tas__code__line">
                <div className="tas__code__line-number">3</div>
                <div className="tas__code__line-text ml-10 flex justify-between">
                  - jsdom-global/register
                </div>
              </div>
            </div>
          </li>
          <li>
            <div>
              Add <span className="font-medium">configFile</span> parameter in the yml file.
            </div>
            <div>
              <span className="tas__highlight-code">.tas.yml</span>
            </div>
            <div className="tas__code my-10">
              <div className="tas__code__line">
                <div className="tas__code__line-number">1</div>
                <div className="tas__code__line-text ml-10 flex justify-between">...</div>
              </div>
              <div className="tas__code__line">
                <div className="tas__code__line-number">1</div>
                <div className="tas__code__line-text ">
                  <span className="tas__code__line-text text-green-800 font-bold">configFile:</span>
                  mocharc.yml
                </div>
              </div>
              <div className="tas__code__line">
                <div className="tas__code__line-number">1</div>
                <div className="tas__code__line-text ml-10 flex justify-between">...</div>
              </div>
            </div>
          </li>
        </ol>
      </div>
    ),
    label: 'Framework Specific Configurations (optional)',
    value: 'frameword_confik',
  },
];

const CollapsibleList = ({ config, defaultActiveStep = -1, id, onAfterChange }: any) => {
  const [activeStep, setActiveStep] = useState(defaultActiveStep);
  const onActiveStepChange = (step: string, toggle: boolean = true) => {
    const targetStep = activeStep === step && toggle ? null : step;
    setActiveStep(targetStep);
    if (targetStep) {
      setTimeout(() => {
        document
          .querySelector(`#step_${id}_${targetStep}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 10);
    }
    onAfterChange?.();
  };

  return (
    <ul>
      {config.map((step: any) => (
        <li id={`step_${id}_${step.key}`}>
          <div onClick={() => onActiveStepChange(step.key)}>
            {step.getHeader({ isActive: activeStep === step.key })}
          </div>
          {activeStep === step.key && <div>{step.getContent()}</div>}
        </li>
      ))}
    </ul>
  );
};

const ParametersCollapsibleList = ({ config, defaultActiveStep }: any) => {
  const listConfig = config.map((step: any) => ({
    key: step.value,
    getHeader: ({ isActive }: { isActive: boolean }) => (
      <div
        className={`flex items-center justify-between py-5 cursor-pointer ${
          isActive ? 'bg-gray-60' : 'hover:bg-gray-100'
        } rounded-md rounded-b-none`}
      >
        <div className="inline-flex items-center ml-5">
          <span
            className={`cursor-pointer rounded inline-block arrow__down__icon  arrow__down__${isActive}`}
          >
            <img src="/assets/images/arrow_down_gray.svg" alt="..." width="8" />
          </span>
          <div className={`pl-10`}>{step.label}</div>
        </div>
      </div>
    ),
    getContent: () => (
      <div className="bg-gray-100 w-full p-10 pl-20">
        {step.description && <div className="mb-10">{step.description}</div>}
        {step.example && <div className="mb-10">{step.example}</div>}

        {step.content && (
          <ul className="border border-b-none">
            {STEPS_GRID_CONFIG.map((row) => (
              <li key={row.key} className="flex border-b pl-10  text-size-14">
                <div className="w-120 font-bold text-tas-400 py-10 border-r">{row.header}</div>
                <div className="flex-1 pl-10 pr-10 py-10 bg-white overflow-hidden">
                  {step.content[row.key]}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    ),
  }));
  return (
    <CollapsibleList
      id="basic_parameters"
      config={listConfig}
      defaultActiveStep={defaultActiveStep}
    />
  );
};

const DEFAULT_ROOT_STEP = 'basic_config';
const StepsCollapsibleList = ({ runnerType }: { runnerType: string }) => {
  return (
    <CollapsibleList
      id="basic_parameters"
      config={[
        {
          key: 'basic_config',
          getHeader: ({ isActive }: { isActive: boolean }) => (
            <div className={`border-b py-10 px-20 cursor-pointer justify-between flex`}>
              <span className="text-size-15">Basic Configuration Parameters</span>
              <span
                className={`cursor-pointer rounded inline-block arrow__down__icon  ${
                  isActive ? 'arrow__down__true' : 'arrow__down__false'
                }`}
              >
                <img src="/assets/images/arrow_down_gray.svg" alt="..." width="8" />
              </span>
            </div>
          ),
          getContent: () => (
            <div className="border-b text-size-14 p-10">
              <ParametersCollapsibleList
                config={BASIC_STEPS_CONFIG}
                defaultActiveStep={BASIC_STEPS_CONFIG[0].value}
              />
            </div>
          ),
        },
        {
          key: 'advanced_config',
          getHeader: ({ isActive }: { isActive: boolean }) => (
            <div className={`border-b py-10 px-20 cursor-pointer justify-between flex`}>
              <span className="text-size-15">Advanced Parameters (Optional)</span>
              <span
                className={`cursor-pointer rounded inline-block arrow__down__icon  ${
                  isActive ? 'arrow__down__true' : 'arrow__down__false'
                }`}
              >
                <img src="/assets/images/arrow_down_gray.svg" alt="..." width="8" />
              </span>
            </div>
          ),
          getContent: () => (
            <div className="border-b text-size-14 p-10">
              <ParametersCollapsibleList config={ADVANCED_STEPS_CONFIG} />
            </div>
          ),
        },
        {
          key: 'managing_secrets',
          getHeader: ({ isActive }: { isActive: boolean }) => (
            <div className={`border-b py-10 px-20 cursor-pointer justify-between flex`}>
              <span className="text-size-15">Managing Secrets (Optional)</span>
              <span
                className={`cursor-pointer rounded inline-block arrow__down__icon  ${
                  isActive ? 'arrow__down__true' : 'arrow__down__false'
                }`}
              >
                <img src="/assets/images/arrow_down_gray.svg" alt="..." width="8" />
              </span>
            </div>
          ),
          getContent: () => (
            <div className="border-b text-size-14">
              {runnerType === 'self-hosted' ? (
                <div className="p-20">
                  In case of TAS Self Hosted mode, you need to define your secrets in the synapse
                  configuration file.{' '}
                  <a
                    className="text-blue-400"
                    href={`${process.env.NEXT_PUBLIC_DOC_HOST}/tas-self-hosted-configuration#reposecrets`}
                    target="_blank"
                  >
                    See more details
                  </a>
                </div>
              ) : (
                <Secrets yml_page={true} />
              )}
            </div>
          ),
        },
      ]}
      defaultActiveStep={DEFAULT_ROOT_STEP}
    />
  );
};

const YamlConfig: NextPage = () => {
  const router = useRouter();
  const { repo, provider, org } = router.query;

  const dispatch = useDispatch();
  const buildData = useSelector((state: any) => state.buildData, _.isEqual);
  const { builds, isBuildsFetched }: { builds: any; isBuildsFetched: boolean } = buildData;

  const commitData = useSelector((state: any) => state.commitData, _.isEqual);
  const { commits, isCommitsFetching } = commitData;
  const commitsListLoadComplete = useIsApiLoadComplete(isCommitsFetching);

  const persistData = useSelector((state: any) => state.persistData, _.isEqual);
  const { currentOrg }: any = persistData;
  const runnerType = currentOrg?.runner_type;

  const [apiCount, setApiCount] = useState(-1);
  const [buildFetchingOnclick, setBuildFetchingOnclick] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleModalApi, setToggleModalApi] = useState(false);

  const lastBuildFetchedAt = useRef(0);

  const [yamlContent, setYamlContent] = useState(DEFAULT_YAML_CONFIG);

  const [activeStep, setActiveStep] = useState(1);

  const [codeBlockActiveAction, setCodeBlockActiveAction] = useState('');
  const onCodeBlockActionClick = (actionType: string) => {
    switch (actionType) {
      case 'copy':
        copyText(yamlContent);
        break;

      case 'download':
        downloadText('_.tas.yml', yamlContent);
        break;

      default:
        break;
    }

    setCodeBlockActiveAction(actionType);
    setTimeout(() => {
      setCodeBlockActiveAction('');
    }, 1000);
  };

  const handleToggle = () => {
    setToggleModal(!toggleModal);
    if (toggleModalApi) {
      setToggleModalApi(false);
      setApiCount(0);
      setBuildFetchingOnclick(false);
    }
  };

  const getBuilds = (click = false) => {
    if (repo) {
      if (click) {
        setBuildFetchingOnclick(true);
      }
      setApiCount((apiCount) => apiCount + 1);
      dispatch(unmountBuilds());
      dispatch(fetchBuilds(repo));
      lastBuildFetchedAt.current = Date.now();
    }
  };

  const getCommits = () => {
    if (repo) {
      dispatch(unmountCommits());
      dispatch(fetchCommits(repo));
    }
  };

  useEffect(() => {
    if (repo) {
      getBuilds();
    }
  }, [repo]);

  useEffect(() => {
    if (isBuildsFetched && repo) {
      if (builds.length > 0) {
        router.push(`/${provider}/${org}/${repo}/jobs`);
      } else {
        getCommits();
      }
    }
  }, [builds.length, isBuildsFetched]);

  useEffect(() => {
    if (commitsListLoadComplete && repo) {
      if (commits.length > 0) {
        router.push(`/${provider}/${org}/${repo}/commits`);
      }
    }
  }, [commitsListLoadComplete, commits.length, repo]);

  useEffect(() => {
    if (commitsListLoadComplete && buildFetchingOnclick && !commits.length) {
      if (apiCount < 3) {
        const differenceInLastCall = Date.now() - lastBuildFetchedAt.current;
        const timeDifferenceRequired = (apiCount + 1) * 1000;
        const timeRemaing = Math.max(0, timeDifferenceRequired - differenceInLastCall);

        setTimeout(() => {
          getBuilds();
        }, timeRemaing);
      } else {
        setApiCount(0);
        setToggleModal(true);
        setToggleModalApi(true);
        setBuildFetchingOnclick(false);
      }
    }
  }, [commitsListLoadComplete, buildFetchingOnclick]);

  useEffect(() => {
    return () => {
      dispatch(unmountBuilds());
      dispatch(unmountCommits());
    };
  }, []);

  return (
    <Layout title={`TAS: ${repo} > Get Started > Post Merge Settings > YAML Configuration`}>
      <div className="flex h-full flex-col">
        <div className="bg-white p-15 text-size-10 text-tas-400 flex items-center">
          <span className="mt-3">{repo}</span>
          <span className="mx-5 mt-3"> &gt;</span>
          <span className="mt-3">Get Started</span>
          <span className="mx-5 mt-3"> &gt;</span>
          <span className="mt-3">Post Merge Settings</span>
          <span className="mx-5 mt-3"> &gt;</span>
          <span className="mt-3 text-black">YAML Configuration</span>
        </div>
        <div className="flex flex-1 p-15">
          <div className="w-6/12">
            <div
              className="bg-white rounded-md h-full designed-scroll-v2 flex flex-col tas-yaml-step-container"
              style={{ height: 'calc(100vh - 80px)' }}
            >
              <div className="text-size-14 flex overflow-hidden">
                <div
                  className={`tas-step-header tas-step-header-arrow flex-1 text-center flex items-center cursor-pointer py-10 pl-20 ${
                    activeStep === 1 ? 'active' : ''
                  } ${activeStep >= 1 ? 'cursor-pointer' : ''} `}
                  onClick={() => setActiveStep(1)}
                >
                  {activeStep <= 1 && (
                    <span
                      className={`text-size-14 w-28 h-28 rounded-full flex-shrink-0 mr-10 flex items-center justify-center tas-header-icon ${
                        activeStep === 1 ? 'active' : ''
                      }`}
                    >
                      1
                    </span>
                  )}
                  {activeStep > 1 && (
                    <span
                      className={`text-size-14 w-28 h-28 rounded-full flex-shrink-0 mr-10 flex items-center justify-center bg-green-100`}
                    >
                      <Image src="/assets/images/icon/green-check.svg" alt="" width="14" />
                    </span>
                  )}
                  <span className={`tas-header-text ${activeStep >= 1 ? 'active' : ''}`}>
                    Preparing the configuration file
                  </span>
                </div>
                <div
                  className={`tas-step-header flex-1 text-center flex items-center py-10 pl-20 ${
                    activeStep === 2 ? 'active' : ''
                  } ${activeStep >= 2 ? 'cursor-pointer' : ''}`}
                  onClick={activeStep > 2 ? () => setActiveStep(2) : () => {}}
                >
                  <span
                    className={`text-size-14 w-28 h-28 rounded-full flex-shrink-0 mr-10 flex items-center justify-center tas-header-icon ${
                      activeStep === 2 ? 'active' : ''
                    }`}
                  >
                    2
                  </span>
                  <span className={`tas-header-text ${activeStep >= 2 ? 'active' : ''}`}>
                    Adding the file to your project
                  </span>
                </div>
              </div>
              <div className="tas-yaml-step-content flex-1 overflow-y-scroll designed-scroll-v2">
                {activeStep === 1 && (
                  <div>
                    <div className="text-size-14 p-20 border-b leading-height-26">
                      This configuration file contains steps that are required for executing your
                      tests on the TAS platform. You can begin with our sample configuration file
                      and edit it as per the requirements of your repo. The configuration parameters
                      are given below.
                    </div>

                    <StepsCollapsibleList runnerType={runnerType} />
                  </div>
                )}
                {activeStep === 2 && (
                  <div className="p-20">
                    <ol className="list-decimal text-size-14 pl-15 leading-height-26">
                      <li>Once you have prepared the configuration file.</li>
                      <li>
                        Create a new file as <span className="tas__highlight-code">.tas.yml</span>{' '}
                        at the <b> root level of your repository </b>.
                      </li>
                      <li>
                        Copy the settings from here and paste them in the{' '}
                        <span className="tas__highlight-code">.tas.yml</span> file you just created.
                      </li>
                      <li>Commit and push the changes to your repo.</li>
                    </ol>
                  </div>
                )}
              </div>
              <div className="tas-yaml-step-footer text-right p-10">
                {activeStep === 1 && (
                  <button
                    className="border w-135 h-38 font-bold tracking-wider rounded text-size-14 transition bg-black text-white border-black inline-flex items-center text-center justify-center"
                    onClick={() => setActiveStep(2)}
                  >
                    Next
                  </button>
                )}
                {activeStep === 2 && (
                  <button
                    className="border w-135 h-38 font-bold tracking-wider rounded text-size-14 transition bg-black text-white border-black inline-flex items-center text-center justify-center"
                    onClick={buildFetchingOnclick ? () => {} : () => getBuilds(true)}
                  >
                    {buildFetchingOnclick ? (
                      <div className="loader loader-base-yellow">Loading...</div>
                    ) : (
                      'Start Testing'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="w-6/12 pl-15">
            <div className="bg-white rounded-md h-full flex flex-col p-15 pr-10">
              <div className="text-size-14 flex-1 copy__code__block relative">
                <div className="absolute z-10 right-0 top-0 flex mr-20 mt-20">
                  <div
                    className="w-24 h-24 rounded bg-gray-60 inline-flex justify-center items-center mr-10 cursor-pointer opacity-50 hover:opacity-100"
                    onClick={() => onCodeBlockActionClick('copy')}
                    title="Copy"
                  >
                    <Image
                      src={`/assets/images/icon/${
                        codeBlockActiveAction === 'copy' ? 'green-check' : 'copy-paste'
                      }.svg`}
                      width="9"
                    />
                  </div>
                  <div
                    className="w-24 h-24 rounded bg-gray-60 inline-flex justify-center items-center cursor-pointer opacity-50 hover:opacity-100"
                    onClick={() => onCodeBlockActionClick('download')}
                    title="Download"
                  >
                    <Image
                      src={`/assets/images/icon/${
                        codeBlockActiveAction === 'download' ? 'green-check' : 'download'
                      }.svg`}
                      width="9"
                    />
                  </div>
                </div>
                <div
                  style={{
                    height: 'calc(100vh - 110px)',
                    flex: '1',
                    overflow: 'hidden',
                    overflowY: 'scroll',
                  }}
                  className="designed-scroll"
                >
                  <CodeMirrorReact
                    // @ts-ignore
                    value={yamlContent}
                    options={{
                      mode: 'text/x-yaml',
                      theme: 'material',
                      lineNumbers: true,
                      lineWrapping: true,
                      indentWithTabs: false,
                      lint: {
                        highlightLines: true,
                      },
                      gutters: ['CodeMirror-lint-markers'],
                    }}
                    onBeforeChange={(_editor: any, _data: any, value: any) => {
                      setYamlContent(value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {toggleModal && (
        <div className="modal__wrapper modal__wrapper modal__wrapper__opacity z-10">
          <div className="modal__overlay"></div>
          <div className="modal__dialog" style={{ maxWidth: '500px' }}>
            <div className="bg-white mx-auto rounded">
              <Text className="pt-20 pb-5 px-10 text-size-20 text-black flex justify-between">
                <span></span>
                <Image
                  className="mr-18 cursor-pointer"
                  onClick={handleToggle}
                  src="/assets/images/icon/cross.svg"
                />
              </Text>
              <Text className="pt-20 pb-5 px-20 text-size-20 text-black flex justify-between flex-wrap">
                <span>
                  {toggleModalApi
                    ? 'Seems like you skipped the configuration steps!'
                    : 'Have you added a .tas.yml file?'}
                </span>
                <Text className="text-size-14 mt-10 mb-10 leading-height-26 text-gray-700">
                  {toggleModalApi ? (
                    <>
                      {' '}
                      We have not been able to detect any commit yet. Please make sure to follow the
                      instructions given below.
                    </>
                  ) : (
                    <>
                      If you've already added{' '}
                      <code className="rounded bg-blue-200 text-size-12 p-1 text-black">
                        .tas.yml
                      </code>{' '}
                      to your default branch <br />
                      you're ready to start testing your project.{' '}
                    </>
                  )}
                </Text>
              </Text>
              <hr />
              <Text className="pt-20 pb-5 px-20 text-size-20 text-black mb-15">
                <span>How to add a .tas.yml file:</span>
                <ol className="list-decimal text-size-14 pl-15 pt-10 leading-height-26">
                  <li>Once you have prepared the configuration file.</li>
                  <li>
                    Create a new file as <span className="tas__highlight-code">.tas.yml</span> at
                    the <b> root level of your repository </b>.
                  </li>
                  <li>
                    Copy the settings from here and paste them in the{' '}
                    <span className="tas__highlight-code">.tas.yml</span> file you just created.
                  </li>
                  <li>Commit and push the changes to your repo.</li>
                </ol>
              </Text>
              <hr />
              <div className="pt-20 pb-15 px-20 text-size-20 text-black flex justify-end">
                <button
                  className="border py-3 px-10 rounded text-size-14 transition bg-white text-gray-600 border-gray-600 inline-flex items-center h-38  text-center justify-center mr-12"
                  onClick={() => downloadText('_.tas.yml', yamlContent)}
                >
                  Download .tas.yml
                </button>
                <button
                  className="border py-3 w-135 font-bold tracking-wider h-38 rounded text-size-14 transition bg-black text-white border-black inline-flex items-center mr-5  text-center justify-center"
                  onClick={buildFetchingOnclick ? () => {} : () => getBuilds(true)}
                >
                  {buildFetchingOnclick ? (
                    <div className="loader loader-base-yellow">Loading...</div>
                  ) : (
                    'Start Testing'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default YamlConfig;
