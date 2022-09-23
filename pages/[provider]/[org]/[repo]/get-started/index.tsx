import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import _ from 'underscore';

import {
  // addFTMConfig,
  addPostmergeConfig,
  fetchBranchesListOnPreboarding,
  fetchPostmergeConfigList,
  unmountRepoSettings,
} from 'redux/actions/repoSettingsAction';

import useIsApiLoadComplete from 'hooks/useIsApiLoadComplete';

import Layout from 'components/Layout';
import Dropdown from 'components/Dropdown';
import { logAmplitude } from 'helpers/genericHelpers';

import DropdownAsync from 'components/DropdownAsync';

const PostmergeThresholdValues = [
  {
    label: '1 commit',
    value: '1',
  },
  {
    label: '2 commits',
    value: '2',
  },
  {
    label: '3 commits',
    value: '3',
  },
  {
    label: '4 commits',
    value: '4',
  },
];

const PostMergeConfig: NextPage = () => {
  const router = useRouter();
  const { org, provider, repo } = router.query;

  const dispatch = useDispatch();
  const { repoSettingsData }: any = useSelector((state) => state, _.isEqual);
  const {
    isPostmergeConfigLoading,
    isPostmergeConfigAddLoading,
    postmergeConfigList,
    preBranches,
    preBranchesNextCursor,
    isPreBranchesLoading,
  } = repoSettingsData;

  const sectionRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [activeStrategy, setActiveStrategy]: any = useState({
    branch: { label: 'All Branches', value: '*' },
    threshold: PostmergeThresholdValues[0],
  });

  const configAddComplete = useIsApiLoadComplete(isPostmergeConfigAddLoading);

  const isPageLoading = !!(
    isPostmergeConfigLoading ||
    isPostmergeConfigAddLoading ||
    postmergeConfigList.length
  );

  const branchName = activeStrategy?.branch?.value;

  // @todo: regex to check if branch name is valid
  const isBranchNameValid = /^\S+$/.test(branchName);

  const onChange = (field: string, value: any) => {
    if (field === 'branch') {
      logAmplitude('tas_onboarding_post_merge_config', { 'Button clicked': 'All branch' });
    }
    if (field === 'threshold') {
      logAmplitude('tas_onboarding_post_merge_dropdown', { 'Selected value': `${value.value}` });
    }
    setActiveStrategy((activeStrategy: any) => ({
      ...activeStrategy,
      [field]: value,
    }));
  };

  const onAddStrategy = (strategy: any) => {
    const formattedStrategy = {
      ...strategy,
      branch: branchName,
      is_active: true,
      org,
      repo,
      strategy_name: 'after_n_commits',
      threshold: strategy.threshold.value,
    };
    dispatch(addPostmergeConfig(formattedStrategy));
  };

  const fetchBranches = () => {
    dispatch(fetchBranchesListOnPreboarding({ repo, next: preBranchesNextCursor }));
  };

  useEffect(() => {
    if (repo) {
      fetchBranches();
      dispatch(fetchPostmergeConfigList({ repo }));
    }
  }, [repo]);

  useEffect(() => {
    if (postmergeConfigList.length) {
      router.push(`/${provider}/${org}/${repo}/get-started/yaml-config`);
    }
  }, [postmergeConfigList]);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, [mounted]);

  useEffect(() => {
    if (configAddComplete) {
      router.push(`/${provider}/${org}/${repo}/get-started/yaml-config`);
    }
  }, [configAddComplete]);

  useEffect(() => {
    return () => {
      dispatch(unmountRepoSettings());
    };
  }, []);

  return (
    <Layout title={`TAS: ${repo} > Get Started > Post Merge Settings`}>
      <div className="flex height-100vh flex-col">
        <div className="bg-white p-15 text-size-10 text-tas-400 flex items-center">
          <span className="mt-3">{repo}</span>
          <span className="mx-5 mt-3"> &gt;</span>
          <span className="mt-3">Get Started</span>
          <span className="mx-5 mt-3"> &gt;</span>
          <span className="mt-3 text-black">Post Merge Settings</span>
        </div>
        <div className="flex flex-1 p-15 items-center justify-center" ref={sectionRef}>
          <div>
            <div className="bg-white rounded-md mb-20 shadow-md width-600">
              <div className="border-b flex justify-center py-20 px-20">
                <div className="text-size-18 text-center">Configure your post-merge pipeline</div>
              </div>
              <div className="p-40 py-20 pb-0">
                <div className="flex w-full items-center text-size-14 mb-10">
                  <div className="flex-1 pr-10">Activate post-merge on</div>
                  <div className="flex width-260">
                    <div className="w-full">
                      {mounted && (
                        <div className="text-ellipsis items-center justify-center flex-1">
                          <DropdownAsync
                            disabled={isPageLoading || isPreBranchesLoading}
                            getData={fetchBranches}
                            hasMoreData={preBranchesNextCursor}
                            loading={isPreBranchesLoading}
                            onClick={(_value, option) => onChange('branch', option)}
                            options={preBranches}
                            prefix={
                              <img src="/assets/images/icon/branch.svg" alt="..." width="10" />
                            }
                            selectedOption={activeStrategy.branch}
                            toggleStyles={{
                              background: '#F2F4FE',
                              borderColor: '#667eea',
                              fontSize: 14,
                              height: '32px',
                              minWidth: '100%',
                            }}
                            showSearch
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center text-size-14 mb-15">
                  <div className="flex-1 pr-10">Initiate a post-merge job for every</div>
                  <div className="flex width-260">
                    <div className="w-full">
                      {mounted && (
                        <div className="text-ellipsis items-center justify-center flex-1">
                          <Dropdown
                            disabled={isPageLoading}
                            onClick={(_value, option) => onChange('threshold', option)}
                            options={PostmergeThresholdValues}
                            selectedOption={activeStrategy.threshold}
                            toggleStyles={{
                              background: '#F2F4FE',
                              borderColor: '#667eea',
                              fontSize: 14,
                              height: '32px',
                              minWidth: '100%',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-size-12 text-purple-400 text-center h-24">
                  {activeStrategy?.threshold?.value && activeStrategy?.threshold?.value !== '1' ? (
                    <>
                      <span className="font-bold whitespace-no-wrap">Note:</span>&nbsp;
                      <span>
                        A minimum of {activeStrategy.threshold.value} commits will be required to
                        initiate a job.
                      </span>
                    </>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="flex p-20 pt-10">
                <div className="text-size-12 text-center w-full text-tas-400 tracking-wider">
                  We recommend to use the default settings. <br />
                  You can change this later inside project settings.
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-20">
                <button
                  className={`border px-30 h-32 rounded text-size-14 transition bg-black text-white border-black inline-flex items-center text-center justify-center overflow-hidden ${
                    isPageLoading || !isBranchNameValid ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => onAddStrategy(activeStrategy)}
                  disabled={isPageLoading || !isBranchNameValid}
                >
                  <span>Next</span>
                  {isPageLoading && <div className="loader ml-10">Loading...</div>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostMergeConfig;
