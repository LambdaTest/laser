import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';

import _ from 'underscore';
import {
  getAuthToken,
  getCookieTasRepoBranch,
  logAmplitude,
  pluralize,
} from 'helpers/genericHelpers';

import { fetchBuilds, unmountBuilds } from 'redux/actions/buildAction';
import { fetchCommits, unmountCommits } from 'redux/actions/commitAction';
import { fetchPostmergeConfigList, unmountRepoSettings } from 'redux/actions/repoSettingsAction';

import useIsApiLoadComplete from 'hooks/useIsApiLoadComplete';

import BuildList from 'components/Build/BuildList';
import Dropdown from 'components/Dropdown';
import Layout from 'components/Layout';
import Loader from 'components/Loader';
import NoData from 'components/Nodata';
import NoTest from 'components/Test/NoTest';
import TasTabs from 'components/TasTabs';
import Text from 'components/Tags/Text';
import InlineToggleSelect from 'components/InlineToggleSelect';

import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
  WindowScroller,
} from 'react-virtualized';
import { per_page_limit, search_char_limit } from 'redux/helper';
import { cancelAxiosRequest } from 'redux/httpclient';
import ReloadPage from 'components/ReloadPage';
import DebounceInput from 'components/DebounceInput';
import FilterAuthorList from 'modules/Builds/components/FilterAuthorList';

const JobTypeConfig = {
  default: '',
  options: [
    {
      label: 'All Jobs',
      key: '',
    },
    {
      label: 'Pre Merge',
      key: 'premerge',
    },
    {
      label: 'Post Merge',
      key: 'postmerge',
    },
  ],
};

const JobStatusTypes = {
  default: '',
  options: [
    { label: 'All Jobs', value: '' },
    { label: 'Passed', value: 'passed' },
    { label: 'Failed', value: 'failed' },
    { label: 'TAS Error', value: 'error' },
  ],
};

const Builds: NextPage = () => {
  const router = useRouter();
  const { repo, provider, org } = router.query;

  const persistData = useSelector((state: any) => state.persistData);
  const { currentOrg }: any = persistData;

  const buildData = useSelector((state: any) => state.buildData);
  const {
    builds,
    isBuildsFetching,
    resMetaData,
    isBuildsFetched,
    filterBuilds,
  }: {
    builds: any;
    isBuildsFetching: any;
    resMetaData: any;
    isBuildsFetched: any;
    filterBuilds: any;
  } = buildData;

  const commitData = useSelector((state: any) => state.commitData, _.isEqual);
  const { commits, isCommitsFetching } = commitData;
  const commitsListLoadComplete = useIsApiLoadComplete(isCommitsFetching);

  const repoSettingsData = useSelector((state: any) => state.repoSettingsData, _.isEqual);
  const { isPostmergeConfigLoading, postmergeConfigList } = repoSettingsData;
  const postmergeConfigListLoadComplete = useIsApiLoadComplete(isPostmergeConfigLoading);

  const dispatch = useDispatch();
  const getMoreBuilds = () => {
    resetPositionOfList();
    setTimeout(() => {
      dispatch(fetchBuilds(repo, resMetaData.next_cursor ? resMetaData.next_cursor : '-1', params));
    }, 300);
  };

  const [currentStatus, setCurrentStatus] = useState(JobStatusTypes.options[0].value);
  const [currentJobType, setCurrentJobType] = useState(JobTypeConfig.default);
  const [currentAuthor, setCurrentAuthor]: any = useState({ label: 'All authors', value: '' });
  const [currentSearchString, setCurrentSearchString] = useState('');
  const [currentStatusType, setCurrentStatusType] = useState(JobStatusTypes.options[0]);

  let params = {
    id: currentSearchString,
    status: currentStatus,
    tag: currentJobType || undefined,
    author: currentAuthor?.value || undefined,
  };

  const BASE_URL = `/${currentOrg?.git_provider}/${currentOrg?.name}/${repo}`;

  const isFilterMode = () => {
    // @ts-ignore
    return Object.keys(params).some((k) => params[k] !== '');
  };
  const isFilterModeActive = isFilterMode();

  const getCommits = (repo: any) => {
    if (repo) {
      dispatch(fetchCommits(repo));
    }
  };

  const getPostmergeConfigList = (repo: any) => {
    if (repo) {
      dispatch(fetchPostmergeConfigList({ repo }));
    }
  };

  const changeJobType = (value: string) => {
    if (value === currentJobType) {
      return;
    }
    cancelAxiosRequest && cancelAxiosRequest();
    dispatch(unmountBuilds());
    setCurrentJobType(value);
    logAmplitude('tas_filter_job_type_build_list', { 'Job Type': value });
  };

  const changeStatus = (option: any) => {
    if (option) {
      if (option.value === currentStatus) {
        return;
      }
      cancelAxiosRequest && cancelAxiosRequest();
      dispatch(unmountBuilds());
      setCurrentStatus(option.value ? option.value : '');
      setCurrentStatusType(option);
      logAmplitude('tas_filter_build_list', { 'Job type': option.label });
    }
  };
  const getInputValue = (e: any) => {
    if (isBuildsFetching) {
      cancelAxiosRequest && cancelAxiosRequest();
    }
    if (e.target.value?.length >= search_char_limit || e.target.value?.length === 0) {
      if (e.target.value === currentSearchString) {
        return;
      }
      dispatch(unmountBuilds());
      setCurrentSearchString(e.target.value);
      logAmplitude('tas_search_done_build_list');
    }
  };
  const changeAuthor = (author: any) => {
    if (isBuildsFetching) {
      cancelAxiosRequest && cancelAxiosRequest();
    }
    if (author?.value === currentAuthor?.value) {
      return;
    }
    dispatch(unmountBuilds());
    setCurrentAuthor(author);
    logAmplitude('tas_search_author_done_build_list');
  };
  useEffect(() => {
    if (repo) {
      dispatch(fetchBuilds(repo, '', params));
    }
    return () => {
      dispatch(unmountBuilds());
      InfiniteLoaderRef?.current?.resetLoadMoreRowsCache();
    };
  }, [currentStatus, currentSearchString, currentAuthor, currentJobType, repo]);

  useEffect(() => {
    if (
      builds.length === 0 &&
      isBuildsFetched &&
      !isFilterModeActive &&
      getAuthToken() &&
      currentOrg.name === org
    ) {
      getCommits(repo);
    }
  }, [builds.length, isBuildsFetched, isFilterModeActive, currentOrg, org]);

  useEffect(() => {
    if (commitsListLoadComplete) {
      getPostmergeConfigList(repo);
    }
  }, [commitsListLoadComplete, commits.length, repo]);

  useEffect(() => {
    if (postmergeConfigListLoadComplete) {
      if (!postmergeConfigList.length) {
        router.push(`${BASE_URL}/get-started`);
      } else if (!commits.length) {
        router.push(`${BASE_URL}/get-started/yaml-config`);
      }
    }
  }, [postmergeConfigListLoadComplete, postmergeConfigList.length, commits.length, repo]);

  useEffect(() => {
    return () => {
      dispatch(unmountBuilds());
      dispatch(unmountRepoSettings());
      dispatch(unmountCommits());
    };
  }, []);

  const noDataFound = builds && builds.length === 0 && !isBuildsFetching && filterBuilds;

  const noBuildTriggeredYet = noDataFound && !isFilterModeActive;
  const [pendingCommitsForBuildToRun, postMergeThreshold, postMergeAdded, postMergeBranch] =
    useMemo(() => {
      if (commits.length && postmergeConfigList.length) {
        const branch = getCookieTasRepoBranch() || '*';
        const postMergeConfig = postmergeConfigList
          .filter(
            (config: any) =>
              (branch === '*' || config.branch === '*' || config.branch === branch) &&
              config.is_active
          )
          .sort((configA: any, configB: any) => configA.threshold - configB.threshold)[0];

        // no postmerge for selected branch
        if (!postMergeConfig) {
          return [-1, -1, -1];
        }

        const postMergeThreshold = Number(postMergeConfig.threshold);
        const postMergeAdded = postMergeConfig.is_active ? 1 : 0;

        const postMergeBranch = postMergeConfig.branch;

        return [
          postMergeThreshold - commits.length,
          postMergeThreshold,
          postMergeAdded,
          postMergeBranch === '*' ? 'All Branches' : postMergeBranch,
        ];
      }
      return [null, null];
    }, [commits, postmergeConfigList]);

  const showLoader =
    (builds.length === 0 && isBuildsFetching) ||
    (noBuildTriggeredYet &&
      currentOrg?.name === org &&
      (isCommitsFetching || isPostmergeConfigLoading));

  const filtersBarRef = useRef<any>();
  const windowScrollRef = useRef<any>();
  const InfiniteLoaderRef = useRef<any>();

  useEffect(() => {
    if (resMetaData && resMetaData.next_cursor == '' && !isBuildsFetching) {
      resetPositionOfList();
    }
  }, [resMetaData.next_cursor, isBuildsFetching]);

  const resetPositionOfList = () => {
    cache.clearAll();
    if (windowScrollRef) {
      windowScrollRef.current.updatePosition();
    }
  };
  const isRowLoaded = ({ index }: any) => {
    return !!builds[index];
  };

  const rowRenderer = ({ index, key, isVisible, parent, style }: any) => {
    return (
      <>
        {builds && builds[index] && builds[index].id && (
          <CellMeasurer cache={cache} columnIndex={0} key={key} rowIndex={index} parent={parent}>
            {() => (
              <div style={style} key={builds[index].id}>
                {!isVisible ? (
                  <Loader loader_for="jobs" length={1} />
                ) : (
                  <BuildList
                    repo={`${repo}`}
                    git_provider={`${provider}`}
                    org={`${org}`}
                    build={builds[index] && builds[index]}
                    key={builds[index] && builds[index].id}
                  />
                )}
              </div>
            )}
          </CellMeasurer>
        )}
      </>
    );
  };

  const cache = new CellMeasurerCache({
    defaultHeight: 63,
    fixedWidth: true,
  });

  return (
    <Layout title={`TAS: ${repo} / Jobs`}>
      <TasTabs activeTab="jobs" pagination={['Jobs']} fetching={false} details_page={false} />
      <div className="p-20 max__center__container build-list-container relative">
       { builds && builds.length === 1 && (builds[0].status === 'initiated' || builds[0].status === 'queued' ||  builds[0].status === 'running') && <div className="bg-blue-200 border border-blue-300 text-gray-860 p-15 rounded text-size-14 mb-20 relative justify-between flex items-center">
          <span className="inline-block">
            <b className='text-black font-bold'>Congratulations!</b> You have successfully initiated your first job. You job is currently <b className='text-black font-bold'>{builds[0].status}</b>. You will see the <b className='text-black font-bold'>test cases etc</b> once the job finishes.
          </span>
        </div>}
        <div className="sticky z-10 bg-gray-60 -mt-20 pt-20" style={{ top: '92px' }}>
          {(builds.length !== 0 || isFilterModeActive) && (
            <Text className="mb-15 flex justify-between relative" ref={filtersBarRef}>
              <div className="flex items-center">
                <div style={{ width: '200px' }}>
                  <DebounceInput
                    onChange={getInputValue}
                    search
                    className={`border-none `}
                    amplitude="tas_search_build_list"
                    value={params.id}
                    placeholder="Search by ID"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-8">
                  <FilterAuthorList
                    currentAuthor={currentAuthor}
                    repo={repo}
                    setCurrentAuthor={changeAuthor}
                  />
                </div>
                <Dropdown
                  forcePosition
                  getPopupContainer={() => filtersBarRef.current}
                  onClick={(_value, option: any) => changeStatus(option)}
                  options={JobStatusTypes.options}
                  selectedOption={currentStatusType}
                  toggleStyles={{
                    height: '32px',
                    background: '#fff',
                    width: '120px',
                  }}
                  labelKey="label"
                  valueKey="value"
                />
                <InlineToggleSelect
                  label={''}
                  onChange={changeJobType}
                  options={JobTypeConfig.options}
                  selected={currentJobType}
                  itemClassName="h-26 inline-flex items-center"
                />
                <div className="ml-8">
                  <ReloadPage />
                </div>
              </div>
            </Text>
          )}
          {builds && builds.length > 0 && (
            <div className="bg-white rounded rounded-b-none border-b">
              <div className="flex -mx-0 w-full flex-wrap  py-12 items-center justify-between font-medium text-size-12 text-tas-400">
                <div className="px-15" style={{ width: '16%' }}>
                  Job Id
                </div>
                <div className="pr-15" style={{ width: '14%' }}>
                  Duration
                </div>
                <div className="pr-15" style={{ width: '14%' }}>
                  Impacted Tests
                </div>
                <div className="pr-15" style={{ width: '13%' }}>
                  Test Results
                </div>
                <div className="pr-15" style={{ width: '26%' }}>
                  Commit Details
                </div>
                <div className="pr-15" style={{ width: '17%' }}>
                  Executed
                </div>
              </div>
            </div>
          )}
        </div>
        {noDataFound && isFilterModeActive && (
          <div className="mt-120">
            <NoData msg="No jobs found!" />
          </div>
        )}
        {!showLoader && noBuildTriggeredYet ? (
          <>
            {postMergeAdded == -1 || postMergeAdded == 0 ? (
              <>
                <NoTest
                  footerContent={
                    <div className="flex justify-center flex-col text-center">
                      <Link href={`${BASE_URL}/settings/advanced-settings/`}>
                        <a className="mt-10 mb-20 border px-20 py-10 rounded text-size-14 transition bg-black text-white border-black tracking-widest ">
                          Go to Settings
                        </a>
                      </Link>
                    </div>
                  }
                  msg={`You don't have any post-merge strategy for selected branch. <br />Please add one in settings.`}
                  repo={`${repo}`}
                />
              </>
            ) : (
              <>
                {postMergeAdded == 1 &&
                pendingCommitsForBuildToRun &&
                pendingCommitsForBuildToRun > 0 ? (
                  <>
                    <NoTest
                      footerContent={
                        <div className="flex justify-center flex-col text-center">
                          <Link href={`${BASE_URL}/commits/`}>
                            <a className="mt-10 mb-20 border px-20 py-10 rounded text-size-14 transition bg-black text-white border-black tracking-widest ">
                              Go to Commits
                            </a>
                          </Link>
                          <Link href={`${BASE_URL}/settings/advanced-settings/`}>
                            <a className="text-black text-size-12">View my post-merge strategy</a>
                          </Link>
                        </div>
                      }
                      msg={`
                          Your post-merge job strategy is set to: After every
                          ${pluralize(
                            postMergeThreshold,
                            'commit',
                            'commits'
                          )} on ${postMergeBranch}
                          <br />
                          Make ${pluralize(
                            pendingCommitsForBuildToRun,
                            'more commit',
                            'more commits'
                          )} to initiate a job.
                        `}
                      repo={`${repo}`}
                    />
                  </>
                ) : (
                  <NoTest
                    repo={`${repo}`}
                    msg={`No jobs found for ${getCookieTasRepoBranch()} branch.`}
                  />
                )}
              </>
            )}
          </>
        ) : null}

        {showLoader && <Loader loader_for="jobs" length={per_page_limit} />}
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          // @ts-ignore
          loadMoreRows={getMoreBuilds}
          rowCount={resMetaData.next_cursor ? builds.length + 1 : builds.length}
          minimumBatchSize={per_page_limit}
          threshold={per_page_limit + per_page_limit / 2}
          ref={InfiniteLoaderRef}
        >
          {({ onRowsRendered, registerChild }: any) => (
            <div className="flex flex__parent">
              <WindowScroller ref={windowScrollRef}>
                {({ height, isScrolling, scrollTop }: any) => (
                  <AutoSizer disableHeight>
                    {({ width }: any) => (
                      <List
                        ref={registerChild}
                        className="List"
                        autoHeight
                        height={height}
                        width={width}
                        onRowsRendered={onRowsRendered}
                        rowCount={resMetaData.next_cursor ? builds.length + 1 : builds.length}
                        rowHeight={63}
                        rowRenderer={rowRenderer}
                        scrollTop={scrollTop}
                        isScrolling={isScrolling}
                      />
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
            </div>
          )}
        </InfiniteLoader>
        {isBuildsFetching && builds.length !== 0 && (
          <Loader loader_for="jobs" length={per_page_limit} />
        )}
      </div>
    </Layout>
  );
};

export default Builds;
