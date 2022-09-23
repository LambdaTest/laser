import React, { useEffect, useRef, useState, useReducer } from 'react';
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

import { fetchValidateYamlConfig, resetValidateYamlConfig } from 'redux/actions/repoSettingsAction';
import { fetchBuilds, unmountBuilds } from 'redux/actions/buildAction';
import { fetchCommits, unmountCommits } from 'redux/actions/commitAction';

import useIsApiLoadComplete from 'hooks/useIsApiLoadComplete';

import { downloadText, copyText } from 'helpers/textHelpers';

import Image from 'components/Tags/Image';
import Layout from 'components/Layout';
import Secrets from 'components/Secrets';
import Text from 'components/Tags/Text';

import ButtonSelect from 'modules/YamlConfig/components/ButtonSelect';
import MultiSelectField from 'modules/YamlConfig/components/MultiSelectField';
import MultiTextField from 'modules/YamlConfig/components/MultiTextField';
import SelectField from 'modules/YamlConfig/components/SelectField';

import { validateConfig } from 'modules/YamlConfig/utils/validateConfig';
import getCurrentActiveConfig from 'modules/YamlConfig/utils/getCurrentConfig';
import getYamlConfigParsedData from 'modules/YamlConfig/utils/parseYamlConfig';

import { IStepValue } from 'modules/YamlConfig/interface';

import {
  PostmergePatternsMap,
  STEPS_CONFIG,
  STEPS_DEFAULT_VALUES,
} from 'modules/YamlConfig/constants';
import { logAmplitude } from 'helpers/genericHelpers';

function yamlConfigReducer(
  state = STEPS_DEFAULT_VALUES,
  action: { type: string; payload: IStepValue | IStepValue[] }
): { [key: string]: IStepValue | IStepValue[] } {
  const activeIndex = STEPS_CONFIG.findIndex((step) => step.key === action.type);

  let newConfigState: any = {
    ...state,
    [action.type]: action.payload,
  };

  newConfigState = STEPS_CONFIG.reduce((acc, step, index) => {
    if (index > activeIndex) {
      acc[step.key] = STEPS_DEFAULT_VALUES[step.key];
    }

    return acc;
  }, newConfigState);

  const language = newConfigState?.language?.value || '';
  const framework = newConfigState?.framework?.value || '';

  if (action.type === 'preRunCommands' && language !== 'custom' && framework !== 'custom') {
    newConfigState['postMergePatterns'] = [
      {
        // @ts-ignore
        value: PostmergePatternsMap[language][framework],
      },
    ];
  }

  return newConfigState;
}

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

  const repoSettingsData = useSelector((state: any) => state.repoSettingsData, _.isEqual);
  const { isYamlConfigValid, isYamlConfigValidLoading, yamlConfigValidityMessage }: any =
    repoSettingsData;
  const isYamlConfigValidLoadingComplete = useIsApiLoadComplete(isYamlConfigValidLoading);

  const [apiCount, setApiCount] = useState(-1);
  const [buildFetchingOnclick, setBuildFetchingOnclick] = useState(false);
  const [toggleSecrets, setToggleSecrets] = useState(false);
  const [toggleAutoPRFlow, setToggleAutoPRFlow] = useState(false);
  const [toggleSteps, setToggleSteps] = useState(false);

  const lastBuildFetchedAt = useRef(0);
  const wrapperRef = useRef(null);

  const [yamlContentState, dispatchYamlContentState] = useReducer(
    yamlConfigReducer,
    STEPS_DEFAULT_VALUES,
    (state) => state
  );
  function resetCommitFound() {
    if (noCommitsFound) {
      setNoCommitFound(false);
    }
  }
  function dispatchYaml(action: { type: string; payload: any }) {
    resetCommitFound();
    dispatch(resetValidateYamlConfig());
    dispatchYamlContentState(action);
    logAmplitude(`tas_onboarding_${action?.type}`, { 'On Boarding': action?.payload?.value });
  }

  const yamlContent = getYamlConfigParsedData(yamlContentState as any);
  const isConfigValid = validateConfig(yamlContentState);
  const [currentActiveIndex, _currentActiveKey] = getCurrentActiveConfig(yamlContentState);
  const [noCommitsFound, setNoCommitFound] = useState(false);

  const [codeBlockActiveAction, setCodeBlockActiveAction] = useState('');
  const onCodeBlockActionClick = (actionType: string) => {
    switch (actionType) {
      case 'COPY_CONFIG':
        copyText(yamlContent);
        break;

      case 'DOWNLOAD_CONFIG':
        downloadText('_.tas.yml', yamlContent);
        break;

      default:
        break;
    }

    setCodeBlockActiveAction(actionType);
  };

  useEffect(() => {
    setCodeBlockActiveAction('');
  }, [yamlContent]);

  const validateYamlConfig = () => {
    dispatch(fetchValidateYamlConfig({ config: yamlContent }));
  };

  const getBuilds = (click = false, checkValidity = false) => {
    if (repo) {
      if (click) {
        setBuildFetchingOnclick(true);
        if (checkValidity && !isYamlConfigValid) {
          validateYamlConfig();
          return;
        }
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
    if (isYamlConfigValidLoadingComplete) {
      if (isYamlConfigValid) {
        getBuilds();
      } else {
        setBuildFetchingOnclick(false);
      }
    }
  }, [isYamlConfigValidLoadingComplete, isYamlConfigValid]);

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
        dispatchYaml({
          type: 'commit',
          payload: { value: false },
        });
        setApiCount(0);
        setBuildFetchingOnclick(false);
        setNoCommitFound(true);
      }
    }
  }, [commitsListLoadComplete, buildFetchingOnclick]);

  useEffect(() => {
    return () => {
      dispatch(unmountBuilds());
      dispatch(unmountCommits());
    };
  }, []);

  useEffect(() => {
    let el = document.querySelector('.admin-wrapper-leftsection');
    if (el) {
      if (toggleAutoPRFlow) {
        el.classList.add('is-blurred');
      } else {
        el.classList.remove('is-blurred');
      }
    }
  }, [toggleAutoPRFlow]);

  return (
    <Layout title={`TAS: ${repo} > Get Started > Post Merge Settings > YAML Configuration`}>
      <div className={`flex h-full flex-col ${toggleAutoPRFlow ? 'is-blurred' : ''}`}>
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
              className="bg-white rounded-md h-full designed-scroll-v2 flex flex-col tas-yaml-step-container-v2 text-size-14"
              style={{ height: 'calc(100vh - 80px)' }}
            >
              <div className="px-16 py-12 border-b">
                <div className="text-size-16">Setup your project</div>
                <div className="text-tas-400">
                  Complete the steps below to start testing your project on TAS.
                </div>
              </div>
              <div
                className="flex-1 overflow-y-scroll designed-scroll-v2 relative"
                ref={wrapperRef}
              >
                <ul className="tas-yaml-step-content px-16 pt-20">
                  {STEPS_CONFIG.map((configElement: any, index: number) => {
                    const isDisabled = index > currentActiveIndex;
                    const isFilled = index < currentActiveIndex;
                    const currentValue: any = yamlContentState[configElement.key];
                    const isLastStep = index === STEPS_CONFIG.length - 1;
                    const showError = isLastStep && (yamlConfigValidityMessage || noCommitsFound);

                    return (
                      <div
                        className={`
                          flex tas-yaml-step-item pb-16
                          ${!showError && isFilled ? 'filled' : ''}
                          ${showError ? 'error' : ''}
                        `}
                        key={configElement.key}
                      >
                        <div className="flex items-center justify-center tas-yaml-step-bullet">
                          <Image src="/assets/images/icon/icon-Check-White.svg" width="7" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-1 w-full flex-wrap">
                            <div className="flex-1">
                              {configElement.label && (
                                <div
                                  className="flex-shrink-0"
                                  dangerouslySetInnerHTML={{ __html: configElement.label }}
                                ></div>
                              )}
                              {configElement.description && (
                                <div
                                  className="text-size-12 text-tas-400"
                                  dangerouslySetInnerHTML={{ __html: configElement.description }}
                                ></div>
                              )}
                            </div>
                            {configElement.type === 'button_select' && (
                              <ButtonSelect
                                disabled={isDisabled}
                                key={configElement.key}
                                onChange={(payload: IStepValue) =>
                                  dispatchYaml({ type: configElement.key, payload })
                                }
                                options={configElement.options}
                                selected={currentValue}
                              />
                            )}
                            {configElement.type === 'select' && (
                              <SelectField
                                disabled={isDisabled}
                                key={configElement.key}
                                mountRef={wrapperRef}
                                onChange={(payload: IStepValue) =>
                                  dispatchYaml({ type: configElement.key, payload })
                                }
                                options={configElement.options}
                                selected={currentValue}
                              />
                            )}
                            {configElement.type === 'multi_text' && (
                              <MultiTextField
                                disabled={isDisabled}
                                key={configElement.key}
                                onChange={(payload: IStepValue) => {
                                  dispatchYaml({ type: configElement.key, payload });
                                }}
                                selected={currentValue}
                              />
                            )}
                            {configElement.type === 'multi_select' && (
                              <MultiSelectField
                                disabled={isDisabled}
                                key={configElement.key}
                                mountRef={wrapperRef}
                                onChange={(payload: IStepValue) => {
                                  dispatchYaml({ type: configElement.key, payload });
                                }}
                                options={configElement.options}
                                selected={currentValue}
                              />
                            )}
                            {configElement.type === 'copy_component' && (
                              <div className="w-full">
                                <div>
                                  Create a <span className="tas__highlight-code">.tas.yml</span>{' '}
                                  file at the root of your project. <br />
                                  Copy the configurations from here and paste in the{' '}
                                  <span className="tas__highlight-code">.tas.yml</span> file and
                                  push the changes.
                                </div>
                                <div className="flex items-center mt-8">
                                  <button
                                    className={`tas-custom-focus radius-3 inline-flex justify-center items-center mr-10 cursor-pointer text-size-12 px-16 h-28 ${
                                      isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                                    } ${
                                      codeBlockActiveAction !== 'COPY_CONFIG'
                                        ? 'border hover:bg-gray-100'
                                        : 'border-purple'
                                    }`}
                                    onClick={() => {
                                      if (isDisabled) {
                                        return;
                                      }
                                      dispatchYaml({
                                        type: configElement.key,
                                        payload: { value: true },
                                      });
                                      onCodeBlockActionClick('COPY_CONFIG');
                                    }}
                                  >
                                    <Image
                                      src={`/assets/images/icon/${
                                        codeBlockActiveAction === 'COPY_CONFIG'
                                          ? 'green-check'
                                          : 'copy-paste'
                                      }.svg`}
                                      width="9"
                                    />
                                    <span className="ml-4">
                                      {codeBlockActiveAction === 'COPY_CONFIG' ? 'Copied' : 'Copy'}
                                    </span>
                                  </button>
                                  <a
                                    className={`text-blue-400 text-size-12`}
                                    href="javascript:void(0);"
                                    onClick={() => setToggleSteps(true)}
                                    data-amplitude="tas_onboarding_see_the_steps"
                                  >
                                    See the steps
                                  </a>
                                </div>
                              </div>
                            )}
                            {configElement.type === 'commit_component' && (
                              <>
                                <div
                                  className={`flex w-full items-center ${
                                    isDisabled ? '' : 'cursor-pointer'
                                  }`}
                                  onClick={() => {
                                    if (isDisabled) {
                                      return;
                                    }
                                    dispatchYaml({
                                      type: configElement.key,
                                      payload: { value: !currentValue?.value },
                                    });
                                  }}
                                >
                                  <div
                                    className={`flex items-center justify-center width-18 height-18 radius-3 border-gray-400 mr-8
                                    ${
                                      !showError && currentValue?.value ? 'bg-purple-250' : 'border'
                                    }
                                    ${isDisabled ? 'cursor-not-allowed' : ' cursor-pointer'}`}
                                  >
                                    <Image
                                      src="/assets/images/icon/icon-Check-White.svg"
                                      width="10"
                                    />
                                  </div>
                                  <div>
                                    I have made the commit and pushed the changes to my repo.
                                  </div>
                                </div>
                                {showError && (
                                  <div className="mt-8 flex items-start justify-start">
                                    <Image
                                      className="mt-4"
                                      src="/assets/images/icon-Error-Exclamation.svg"
                                    />
                                    {yamlConfigValidityMessage ? (
                                      <div className="ml-4">{yamlConfigValidityMessage}</div>
                                    ) : (
                                      <div className="ml-4">
                                        We could not find any{' '}
                                        <span className="tas__highlight-code">.tas.yml</span> at
                                        root level of your repo. Make sure you have placed it
                                        correctly and pushed the changes to your repo, and then
                                        retry.
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </ul>
                <div className="tas-yaml-step-action px-12 mb-10 ml-30 pl-4">
                  <button
                    className={`border width-100 h-32 font-bold tracking-wider radius-3 transition inline-flex items-center text-center justify-center overflow-hidden ${
                      !isConfigValid
                        ? 'bg-gray-60 cursor-not-allowed text-gray-400'
                        : 'text-white bg-black border-black'
                    } ${buildFetchingOnclick ? 'cursor-not-allowed' : ''}`}
                    onClick={
                      !isConfigValid || buildFetchingOnclick
                        ? () => {}
                        : () => {
                            getBuilds(true, true);
                            logAmplitude('tas_onboarding_lets_go');
                          }
                    }
                  >
                    {buildFetchingOnclick ? <div className="loader">Loading...</div> : 'Lets Go'}
                  </button>
                </div>
              </div>
              <div className="tas-yaml-step-footer pl-20 pr-20 h-36 flex items-center text-size-12 justify-between">
                <div className="text-tas-400 flex">
                  <div
                    className="text-blue-400 mr-4 cursor-pointer"
                    onClick={() => {
                      setToggleAutoPRFlow(true);
                      resetCommitFound();
                    }}
                    data-amplitude="tas_onboarding_already_have_tas_yaml"
                  >
                    Already have a <span className="tas__highlight-code">.tas.yml</span>?
                  </div>
                </div>
                <div className="flex">
                  <div className="text-tas-400 mr-4 ml-30">
                    Resources:{' '}
                    <a
                      className="text-blue-400"
                      href={`${process.env.NEXT_PUBLIC_DOC_HOST}/tas-tutorial-cloud-demo/`}
                      target="_blank"
                      onClick={() => {
                        logAmplitude('tas_onboarding_resource', { Type: 'Video Tutorials' });
                      }}
                    >
                      Video Tutorials
                    </a>{' '}
                    |{' '}
                    <a
                      className="text-blue-400"
                      href={`${process.env.NEXT_PUBLIC_DOC_HOST}/tas-configuring-tas-yml/`}
                      target="_blank"
                      onClick={() => {
                        logAmplitude('tas_onboarding_resource', {
                          Type: 'All configuration parameters',
                        });
                      }}
                    >
                      All configuration parameters
                    </a>{' '}
                    |{' '}
                    {runnerType === 'self-hosted' ? (
                      <a
                        className="text-blue-400"
                        href={`${process.env.NEXT_PUBLIC_DOC_HOST}/tas-self-hosted-configuration#reposecrets`}
                        target="_blank"
                        onClick={() => {
                          logAmplitude('tas_onboarding_resource', { Type: 'Manage secrets' });
                        }}
                      >
                        Manage secrets
                      </a>
                    ) : (
                      <a
                        className="text-blue-400"
                        href="javascript:void(0)"
                        onClick={() => {
                          setToggleSecrets(true);
                          logAmplitude('tas_onboarding_resource', { Type: 'Manage secrets' });
                        }}
                      >
                        Manage secrets
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-6/12 pl-15">
            <div className="bg-white rounded-md h-full flex flex-col text-size-14 ">
              <div className="px-16 py-12 border-b">
                <div className="text-size-16">Generated TAS configuration file</div>
                <div className="text-tas-400">
                  Once you have configured this file, it needs to be placed at the root directory of
                  your project.
                </div>
              </div>
              <div className="flex-1 copy__code__block relative  p-15 pr-10">
                <div className="absolute z-10 right-0 top-0 mr-20 mt-20  hidden">
                  <div
                    className="w-24 h-24 rounded bg-gray-60 inline-flex justify-center items-center mr-10 cursor-pointer opacity-50 hover:opacity-100"
                    onClick={() => onCodeBlockActionClick('COPY_CONFIG')}
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
                    onClick={() => onCodeBlockActionClick('DOWNLOAD_CONFIG')}
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
                    height: 'calc(100vh - 180px)',
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
                      gutters: ['CodeMirror-lint-markers'],
                      indentWithTabs: false,
                      lineNumbers: true,
                      lineWrapping: true,
                      lint: {
                        highlightLines: true,
                      },
                      mode: 'text/x-yaml',
                      theme: 'material',
                      readOnly: 'nocursor',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {toggleSecrets && (
        <div className="modal__wrapper modal__wrapper modal__wrapper__opacity z-10">
          <div className="modal__overlay"></div>
          <div className="modal__dialog" style={{ maxWidth: '600px' }}>
            <div className="bg-white mx-auto rounded">
              <Text className="p-16 text-black flex justify-end">
                <span
                  className="w-24 h-24 radius-3 flex items-center justify-center cursor-pointer"
                  onClick={() => setToggleSecrets(false)}
                >
                  <Image src="/assets/images/icon/cross.svg" />
                </span>
              </Text>
              <Text className="text-size-14 text-black flex justify-between flex-wrap px-8 pb-16">
                <span className="text-size-20 px-20">Managing Secrets</span>
                <Secrets yml_page={true} />
              </Text>
            </div>
          </div>
        </div>
      )}
      {toggleAutoPRFlow && (
        <div className="modal__wrapper modal__wrapper modal__wrapper__opacity z-10">
          <div className="modal__overlay"></div>
          <div className="modal__dialog" style={{ maxWidth: '600px' }}>
            <div className="bg-white mx-auto rounded">
              <div className="flex justify-between items-center border-b pb-15  px-36 pt-15 pr-20">
                <div className="text-size-18 ">How do you have a .tas.yml already?</div>
                <span
                  className="mt-5 w-24 h-24 radius-3 flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    resetCommitFound();
                    setToggleAutoPRFlow(false);
                  }}
                  data-amplitude="tas_onboarding_tas_yaml_popup_close"
                >
                  <Image className="w-14 h-14" src="/assets/images/icon/cross.svg" />
                </span>
              </div>
              <Text className="text-size-14 px-36">
                <div className="flex items-center justify-between mt-36">
                  <div className="w-56 h-56 bg-yellow-500 radius-8 flex-shrink-0 mr-24 flex items-center justify-center">
                    <img src="/assets/images/icon/tutorial.svg" height="22px" />
                  </div>
                  <div>
                    <div className="text-size-18 text-blue-900 ls-18">Following a TAS tutorial</div>
                    <div className="text-size-14 text-black leading-height-18 ls-44">
                      Please make sure that after forking the sample repo, you make some dummy
                      changes in the readme and commit those to your project.
                    </div>
                  </div>
                </div>
                <div className="mt-36 mb-8 flex items-center justify-between">
                  <div className="flex items-center justify-center w-56 h-56 bg-green-10 radius-8 flex-shrink-0 mr-24">
                    <img src="/assets/images/icon/file.svg" height="22px" />
                  </div>
                  <div>
                    <div className="text-size-18 text-blue-900 ls-18">
                      Received a PR introducing TAS
                    </div>
                    <div className="text-size-14 text-black leading-height-18 ls-44">
                      Please make sure that you have merged the received PR at this point before you
                      proceed further.
                    </div>
                  </div>
                </div>
                {noCommitsFound && (
                  <div className="flex items-start justify-start mb-15 mt-12">
                    <img className="mt-4" src="/assets/images/icon-Error-Exclamation.svg" />
                    <div className="ml-4">
                      We could not find any <span className="tas__highlight-code">.tas.yml</span> at
                      root level of your repo. Make sure you have placed it correctly and pushed the
                      changes to your repo, and then retry.
                    </div>
                  </div>
                )}
              </Text>
              <div className="flex justify-between items-center p-20 pl-36 pr-24">
                <Text className="text-size-14 flex justify-between flex-wrap ls-44 text-gray-70">
                  A commit is required to initiate a job on TAS. Make sure you have made a commit
                  &amp; pushed the changes to your project.
                </Text>
                <div className="pr-15">
                  <button
                    className={`border width-100 h-36 tracking-wider radius-3 transition inline-flex items-center text-center justify-center overflow-hidden text-white bg-black text-size-14 border-black ${
                      buildFetchingOnclick ? 'cursor-not-allowed' : ''
                    }`}
                    onClick={buildFetchingOnclick ? () => {} : () => getBuilds(true, false)}
                    data-amplitude="tas_onboarding_tas_yaml_popup_understood"
                  >
                    {buildFetchingOnclick ? <div className="loader">Loading...</div> : 'Understood'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className={`modal__wrapper modal__wrapper modal__wrapper__opacity z-10 ${
          toggleSteps ? '' : 'hidden-important'
        }`}
      >
        <div className="modal__overlay"></div>
        <div className="modal__dialog" style={{ maxWidth: '950px' }}>
          <div className="bg-white mx-auto rounded">
            <Text className="p-16 text-black flex justify-between">
              <span className="text-size-16">Steps for setting up project</span>
              <span
                className="w-24 h-24 radius-3 flex items-center justify-center cursor-pointer"
                onClick={() => setToggleSteps(false)}
              >
                <img src="/assets/images/icon/cross.svg" width={10} />
              </span>
            </Text>
            <hr />
            <Text className="text-size-14 text-black flex justify-between flex-wrap p-16">
              <img src="/assets/files/yaml-config.gif" style={{ width: '100%' }} />
            </Text>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default YamlConfig;
