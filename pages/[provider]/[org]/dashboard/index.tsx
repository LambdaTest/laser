import React, { useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';

import _ from 'underscore';

import useIsApiLoadComplete from 'hooks/useIsApiLoadComplete';

import { fetchBuilds, unmountBuilds } from 'redux/actions/buildAction';
import { fetchCommits, unmountCommits } from 'redux/actions/commitAction';
import { fetchPostmergeConfigList, unmountRepoSettings } from 'redux/actions/repoSettingsAction';
import { fetchActiveRepos, unmountActiveRepos } from 'redux/actions/repoAction';

import Col from 'components/Tags/Col';
import Layout from 'components/Layout';
import Loader from 'components/Loader';
import NoData from 'components/Nodata';
import Row from 'components/Tags/Row';
import Text from 'components/Tags/Text';

import ActiveRepoList from 'components/ActiveRepoList';

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
import ActiveSynapses from 'components/ActiveSynapses';
import Tooltip from 'components/Tooltip';
import NoTest from 'components/Test/NoTest';
import ReloadPage from 'components/ReloadPage';

import DebounceInput from 'components/DebounceInput';

const DashboardPage: NextPage = () => {
  const router = useRouter();
  const { repo, org } = router.query;

  const windowScrollRef = useRef<any>();

  const repoData = useSelector((state: any) => state.repoData, _.isEqual);
  const { activeRepos }: any = repoData;
  const { isActiveReposFetching }: any = repoData;
  const { activeResMetaData }: any = repoData;

  const persistData = useSelector((state: any) => state.persistData, _.isEqual);
  const { currentOrg }: any = persistData;

  const settingsData = useSelector((state: any) => state.settingsData, _.isEqual);
  const { synapseCountDataLoading, synapseCountData } = settingsData;

  const isSynapseMode =
    currentOrg && currentOrg.name === org && currentOrg.runner_type === 'self-hosted';
  const synapseConfigLoading = isSynapseMode && synapseCountDataLoading;
  const needSynapseConfig =
    isSynapseMode && !synapseCountDataLoading && synapseCountData.connected == 0;

  const buildData = useSelector((state: any) => state.buildData, _.isEqual);
  const { builds, isBuildsFetched }: { builds: any; isBuildsFetched: any } = buildData;

  const commitData = useSelector((state: any) => state.commitData, _.isEqual);
  const { commits, isCommitsFetching } = commitData;
  const commitsListLoadComplete = useIsApiLoadComplete(isCommitsFetching);

  const repoSettingsData = useSelector((state: any) => state.repoSettingsData, _.isEqual);
  const { isPostmergeConfigLoading, postmergeConfigList } = repoSettingsData;
  const postmergeConfigListLoadComplete = useIsApiLoadComplete(isPostmergeConfigLoading);

  const dispatch = useDispatch();

  const [currentRepo, setCurrentRepo] = useState<any>(null);

  const getMoreActiveRepos = () => {
    resetPositionOfList();
    setTimeout(() => {
      dispatch(
        fetchActiveRepos(
          activeResMetaData.next_cursor ? activeResMetaData.next_cursor : '-1',
          params
        )
      );
    }, 300);
  };

  const [currentSearchString, setCurrentSearchString] = useState('');
  let params = { text: currentSearchString };
  const isFilterMode = () => {
    // @ts-ignore
    return Object.keys(params).some((k) => params[k] !== '');
  };
  const getInputValue = (e: any) => {
    if(isActiveReposFetching) {
      cancelAxiosRequest && cancelAxiosRequest();
    }
    if (
      (e.target.value?.length >= search_char_limit || e.target.value?.length === 0)
    ) {
      if (e.target.value === currentSearchString) {
        return;
      }
      setCurrentSearchString(e.target.value);
      dispatch(unmountActiveRepos());
    }
  };
  useEffect(() => {
    dispatch(fetchActiveRepos('', params));
    return () => {
      dispatch(unmountActiveRepos());
    };
  }, [currentSearchString]);

  const getBuilds = (repo: any) => {
    if (repo) {
      cancelAxiosRequest && cancelAxiosRequest();
      setCurrentRepo(repo);
      dispatch(fetchBuilds(repo.name));
    }
  };

  const getCommits = (repo: any) => {
    if (repo) {
      dispatch(fetchCommits(repo.name));
    }
  };

  const getPostmergeConfigList = (repo: any) => {
    if (repo) {
      dispatch(fetchPostmergeConfigList({ repo: repo.name }));
    }
  };

  useEffect(() => {
    if (isBuildsFetched && currentRepo) {
      if (builds.length > 0 && currentRepo) {
        router.push(`/${currentOrg?.git_provider}/${currentOrg?.name}/${currentRepo?.name}/jobs`);
      } else {
        getCommits(currentRepo);
      }
    }
  }, [builds.length, currentRepo, isBuildsFetched]);

  useEffect(() => {
    if (commitsListLoadComplete && currentRepo) {
      if (commits.length > 0) {
        router.push(
          `/${currentOrg?.git_provider}/${currentOrg?.name}/${currentRepo?.name}/commits`
        );
      } else {
        getPostmergeConfigList(currentRepo);
      }
    }
  }, [commitsListLoadComplete, commits.length, currentRepo]);

  useEffect(() => {
    if (postmergeConfigListLoadComplete && currentRepo) {
      if (postmergeConfigList.length > 0) {
        router.push(
          `/${currentOrg?.git_provider}/${currentOrg?.name}/${currentRepo?.name}/get-started/yaml-config`
        );
      } else {
        router.push(
          `/${currentOrg?.git_provider}/${currentOrg?.name}/${currentRepo?.name}/get-started`
        );
      }
    }
  }, [postmergeConfigListLoadComplete, postmergeConfigList.length]);

  useEffect(() => {
    return () => {
      dispatch(unmountActiveRepos());
      dispatch(unmountBuilds());
      dispatch(unmountRepoSettings());
      dispatch(unmountCommits());
    };
  }, []);

  const loaderLength = () => {
    if (window) {
      return Math.round((window.innerHeight - 115) / 67);
    }
  };

  useEffect(() => {
    if (activeResMetaData && activeResMetaData.next_cursor == '' && !isActiveReposFetching) {
      resetPositionOfList();
    }
  }, [activeResMetaData.next_cursor, isActiveReposFetching]);

  const resetPositionOfList = () => {
    cache.clearAll();
    if (windowScrollRef) {
      windowScrollRef.current.updatePosition();
    }
  };
  const isRowLoaded = ({ index }: any) => {
    return !!activeRepos[index];
  };

  const rowRenderer = ({ index, key, isVisible, isScrolling, parent, style }: any) => {
    return (
      <>
        {activeRepos && activeRepos[index] && activeRepos[index].id && (
          <CellMeasurer cache={cache} columnIndex={0} key={key} rowIndex={index} parent={parent}>
            {() => (
              <div style={style} key={activeRepos[index].id}>
                {!isVisible ? (
                  <Loader loader_for="dashboard" length={1} />
                ) : (
                  <ActiveRepoList
                    // git_provider={currentOrg?.git_provider}
                    // org={currentOrg?.name}
                    isActive={activeRepos[index].id === currentRepo?.id}
                    onClick={currentRepo ? () => {} : getBuilds}
                    repo={activeRepos[index]}
                    key={activeRepos[index]?.id}
                    isScrolling={isScrolling}
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
    defaultHeight: 30,
    fixedWidth: true,
  });

  return (
    <Layout title="TAS: Home">
      <div className="p-20 max__center__container">
        <div className="sticky top-0 z-10 bg-gray-60 -mt-20 pt-20">
          <Row className="mb-20">
            <Col size="2">
            <DebounceInput
              onChange={getInputValue}
              search
              className={`border-none `}
            />
            </Col>
            <Col size="2" className="pl-0">
              {needSynapseConfig ? (
                <Tooltip content="Configure Synapse before importing new project" placement="right">
                  <span className="block width-110">
                    <Link href={`/${currentOrg?.git_provider}/${currentOrg?.name}/synapse-config`}>
                      <a
                        className={`cursor-pointer border px-15 h-32 rounded text-size-14 transition bg-black text-white border-black tracking-widest font-bold flex items-center justify-center width-110`}
                      >
                        + NEW
                      </a>
                    </Link>
                  </span>
                </Tooltip>
              ) : (
                <>
                {activeRepos &&
            activeRepos.length > 0 &&
            !isActiveReposFetching && <Link href={`/${currentOrg?.git_provider}/${currentOrg?.name}/repositories`}>
                  <a
                    className={`cursor-pointer border px-15 h-32 rounded text-size-14 transition bg-black text-white border-black tracking-widest font-bold flex items-center justify-center width-110 ${
                      synapseConfigLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    + NEW{' '}
                    {synapseConfigLoading && <span className="inline-block loader ml-8"></span>}
                  </a>
                </Link>}
                </>
              )}
            </Col>
            <Col size="8">
              <div className="flex justify-end">
                <ActiveSynapses />
                {activeRepos && activeRepos.length > 0 && <div className="flex justify-end mb-10">
                  <div className="ml-8">
                    <ReloadPage />
                  </div>
                </div>}
              </div>
            </Col>
          </Row>
          {activeRepos && activeRepos.length > 0 && (
            <div className=" bg-tas-100 rounded rounded-b-none border-b">
              <div className="mr-5">
                <div className="flex -mx-0 w-full  py-12 items-center justify-between text-tas-400 text-size-12 font-medium tracking-wide">
                  <div className="w-2/12 px-15">Project</div>
                  <div className="w-1/12 px-15">Total Tests</div>
                  <div className="w-1/12 px-15">Total Jobs</div>
                  <div className="w-2/12 px-15 pl-50">Avg. Job Duration</div>
                  <div className="w-2/12 px-15">Job History</div>
                  <div className="w-2/12 px-15">Activity</div>
                  <div className="w-2/12 px-15">Last Executed</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Text>
          {activeRepos && activeRepos.length === 0 && !isActiveReposFetching && isFilterMode() && (
            <NoData msg="No results found!" />
          )}
          {activeRepos &&
            activeRepos.length === 0 &&
            !isActiveReposFetching &&
            !isFilterMode() &&
            needSynapseConfig && (
              <NoTest
                footerContent={
                  <div className="flex justify-center flex-col text-center">
                    <Link href={`/${currentOrg?.git_provider}/${currentOrg?.name}/synapse-config`}>
                      <a className="mt-10 mb-20 border px-20 py-10 rounded text-size-14 transition bg-black text-white border-black tracking-widest ">
                        Configure Synapse
                      </a>
                    </Link>
                  </div>
                }
                msg={`Seems like you have not configured your synapse after selecting the self hosted mode. `}
                repo={`${repo}`}
              />
            )}
          {activeRepos &&
            activeRepos.length === 0 &&
            !isActiveReposFetching &&
            !isFilterMode() &&
            !needSynapseConfig && (
              <NoTest
                style={{height: '88vh'}}
                footerContent={
                  <div className="flex justify-center flex-col text-center">
                    <Link href={`/${currentOrg?.git_provider}/${currentOrg?.name}/repositories`}>
                      <a className="mt-10 mb-20 border px-20 py-10 rounded text-size-14 transition bg-black text-white border-black tracking-widest ">
                        Setup a New Project
                      </a>
                    </Link>
                  </div>
                }
                msg={`Seems like you have not setup any project with TAS.`}
                repo={`${repo}`}
              />
            )}
          {isActiveReposFetching && activeRepos.length == 0 && (
            <Loader loader_for="dashboard" length={loaderLength()} />
          )}

          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            // @ts-ignore
            loadMoreRows={getMoreActiveRepos}
            rowCount={activeResMetaData.next_cursor ? activeRepos.length + 1 : activeRepos.length}
            minimumBatchSize={per_page_limit}
            threshold={per_page_limit + per_page_limit / 2}
          >
            {({ onRowsRendered, registerChild }: any) => (
              <div className="flex flex__parent">
                <WindowScroller ref={windowScrollRef}>
                  {({ height, isScrolling, scrollTop }) => (
                    <AutoSizer disableHeight>
                      {({ width }) => (
                        <List
                          ref={registerChild}
                          className="List"
                          autoHeight
                          height={height}
                          width={width}
                          onRowsRendered={onRowsRendered}
                          rowCount={
                            activeResMetaData.next_cursor
                              ? activeRepos.length + 1
                              : activeRepos.length
                          }
                          rowHeight={68}
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
          {isActiveReposFetching && activeRepos.length !== 0 && (
            <Loader loader_for="dashboard" length={per_page_limit} />
          )}
        </Text>
      </div>
    </Layout>
  );
};

export default DashboardPage;
