import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import debounce from 'lodash.debounce';

import _ from 'underscore';

import useIsApiLoadComplete from 'hooks/useIsApiLoadComplete';

import { fetchBuilds, unmountBuilds } from 'redux/actions/buildAction';
import { fetchCommits, unmountCommits } from 'redux/actions/commitAction';
import { fetchPostmergeConfigList, unmountRepoSettings } from 'redux/actions/repoSettingsAction';
import { fetchRepos, enableRepo, unmountRepos } from 'redux/actions/repoAction';

import Image from 'components/Tags/Image';
import Layout from 'components/Layout';
import Loader from 'components/Loader';
import Text from 'components/Tags/Text';
import ReloadPage from 'components/ReloadPage';
import { fetchSynapseCount } from 'redux/actions/settingsAction';

import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
  WindowScroller,
} from 'react-virtualized';
import { search_char_limit } from 'redux/helper';
import NoData from 'components/Nodata';
import DebounceInput from 'components/DebounceInput';
import Link from 'next/link';

const per_page_limit = 400;
const RELOAD_DEBOUNCE_DELAY = 200;

const Repositories: NextPage = () => {
  const router = useRouter();
  const { provider, org } = router.query;

  const dispatch = useDispatch();

  const repoData = useSelector((state: any) => state.repoData, _.isEqual);
  const { repos: mainrepos, isReposFetching, resMetaData }: any = repoData;

  const buildData = useSelector((state: any) => state.buildData, _.isEqual);
  const { builds, isBuildsFetched }: { builds: any; isBuildsFetched: any } = buildData;

  const commitData = useSelector((state: any) => state.commitData, _.isEqual);
  const { commits, isCommitsFetching } = commitData;
  const commitsListLoadComplete = useIsApiLoadComplete(isCommitsFetching);

  const repoSettingsData = useSelector((state: any) => state.repoSettingsData, _.isEqual);
  const { isPostmergeConfigLoading, postmergeConfigList } = repoSettingsData;
  const postmergeConfigListLoadComplete = useIsApiLoadComplete(isPostmergeConfigLoading);

  const persistData = useSelector((state: any) => state.persistData, _.isEqual);
  const { currentOrg }: any = persistData;

  const settingsData = useSelector((state: any) => state.settingsData, _.isEqual);
  const { synapseCountDataLoading, synapseCountData } = settingsData;
  const isSynapseMode =
    provider &&
    org &&
    currentOrg &&
    currentOrg.name === org &&
    currentOrg.runner_type === 'self-hosted';
  const needSynapseConfig =
    isSynapseMode && !synapseCountDataLoading && synapseCountData.connected == 0;

  const [currentRepo, setCurrentRepo] = useState('');

  const [buildFetchingOnclick, setBuildFetchingOnclick] = useState(false);

  const [activeRepo, setActiveRepo] = useState<any>(null);
  const isLoadingEnableRepo = !activeRepo?.active;
  const repoEnableComplete = useIsApiLoadComplete(isLoadingEnableRepo);

  useEffect(() => {
    if (repoEnableComplete) {
      getBuilds(activeRepo.name);
    }
  }, [repoEnableComplete]);

  const getMoreRepos = () => {
    resetPositionOfList();
    // setTimeout(() => {
    //   dispatch(fetchRepos(resMetaData.next_cursor));
    // }, 300);
  };

  const handleEnableRepo = (repo: any) => {
    const data = {
      name: repo.name,
      namespace: repo.namespace,
      link: repo.link,
    };

    setActiveRepo(repo);
    dispatch(enableRepo(data));
  };

  const getBuilds = (repo: any) => {
    if (repo) {
      setBuildFetchingOnclick(true);
      setCurrentRepo(repo);
      dispatch(fetchBuilds(repo));
    }
  };

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

  const getSynapseList = async () => {
    dispatch(
      fetchSynapseCount({
        org: currentOrg?.name,
        git_provider: currentOrg?.git_provider,
      })
    );
  };

  useEffect(() => {
    if (isSynapseMode) {
      getSynapseList();
    }
  }, [isSynapseMode]);

  useEffect(() => {
    if (needSynapseConfig) {
      router.push(`/${currentOrg?.git_provider}/${currentOrg?.name}/synapse-config`);
    }
  }, [needSynapseConfig]);

  useEffect(() => {
    if (isBuildsFetched && currentRepo) {
      if (builds.length > 0) {
        router.push(`/${currentOrg?.git_provider}/${currentOrg?.name}/${currentRepo}/jobs`);
      } else {
        getCommits(currentRepo);
      }
    }
  }, [builds.length, currentRepo, isBuildsFetched]);

  useEffect(() => {
    if (commitsListLoadComplete) {
      if (commits.length > 0) {
        router.push(`/${currentOrg?.git_provider}/${currentOrg?.name}/${currentRepo}/commits`);
      } else {
        getPostmergeConfigList(currentRepo);
      }
    }
  }, [commitsListLoadComplete, commits.length, currentRepo]);

  useEffect(() => {
    if (postmergeConfigListLoadComplete) {
      if (postmergeConfigList.length > 0) {
        router.push(
          `/${currentOrg?.git_provider}/${currentOrg?.name}/${currentRepo}/get-started/yaml-config`
        );
      } else {
        router.push(`/${currentOrg?.git_provider}/${currentOrg?.name}/${currentRepo}/get-started`);
      }
    }
  }, [postmergeConfigListLoadComplete, postmergeConfigList.length]);

  useEffect(() => {
    dispatch(fetchRepos());
    dispatch(unmountBuilds());
    return () => {
      dispatch(unmountBuilds());
      dispatch(unmountRepos());
      dispatch(unmountRepoSettings());
      dispatch(unmountCommits());
    };
  }, []);

  const windowScrollRef = useRef<any>();
  const InfiniteLoaderRef = useRef<any>();

  useEffect(() => {
    if (resMetaData && resMetaData.next_cursor == '' && !isReposFetching) {
      resetPositionOfList();
    }
    if (repos.length === 0) {
      resetPositionOfList();
    }
    if (resMetaData && resMetaData.next_cursor) {
      resetPositionOfList();
      dispatch(fetchRepos(resMetaData.next_cursor));
    }
  }, [resMetaData.next_cursor, isReposFetching]);

  const resetPositionOfList = () => {
    cache.clearAll();
    if (windowScrollRef) {
      windowScrollRef.current.updatePosition();
    }
  };
  const isRowLoaded = ({ index }: any) => {
    return !!repos[index];
  };

  const handleRowClick = (e: MouseEvent, repo: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (buildFetchingOnclick) {
      return;
    }
    if (repo.active) {
      getBuilds(repo.name);
    } else if (!repo.isRepoEnabling) {
      handleEnableRepo(repo);
    }
  };

  const handleReload = useCallback(
    debounce(() => {
      dispatch(fetchRepos());
    }, RELOAD_DEBOUNCE_DELAY),
    []
  );

  const rowRenderer = ({ index, key, isVisible, parent, style }: any) => {
    return (
      <>
        {repos && repos[index] && repos[index].http_url && (
          <CellMeasurer cache={cache} columnIndex={0} key={key} rowIndex={index} parent={parent}>
            {() => (
              <div style={style} key={repos[index].http_url}>
                {!isVisible ? (
                  <Loader loader_for="repositories" length={1} />
                ) : (
                  <div className="border-b" onClick={(e: any) => handleRowClick(e, repos[index])}>
                    <div
                      className={`flex bg-white py-8 h-50 items-center list-hover justify-between border-b cursor-pointer text-size-14`}
                      key={repos[index].link}
                    >
                      <div style={{ flex: '1' }} className="px-15">
                        <Text className="inline-flex items-center">
                          <Text size="span" className="mr-10">
                            {repos[index].name}
                          </Text>
                          <a
                            href={repos[index].link}
                            target="_blank"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Image src="/assets/images/icon/repo-arrow.svg" alt="" />
                          </a>
                        </Text>
                      </div>
                      <div style={{ width: '163px' }} className="px-15">
                        <Text className="flex items-center">
                          {repos[index].active && (
                            <button
                              onClick={() => {}}
                              className={`border flex items-center justify-center  px-10 rounded text-size-14 transition h-32 w-113 bg-black text-white border-black
                              ${
                                buildFetchingOnclick && currentRepo == repos[index].name
                                  ? `cursor-not-allowed`
                                  : ``
                              }
                            `}
                            >
                              {buildFetchingOnclick && currentRepo == repos[index].name ? (
                                <div className="loader"></div>
                              ) : (
                                'Go to Project'
                              )}
                            </button>
                          )}
                          {!repos[index].active && !repos[index].isRepoEnabling && (
                            <button
                              onClick={() => {}}
                              className={`border border-gray-400 text-gray-700 h-32 px-10 rounded bg-white text-size-14 transition w-113 ${
                                repos[index].permissions.admin
                                  ? ' hover:bg-black hover:text-white hover:border-black '
                                  : 'cursor-not-allowed pointer-events-none bg-gray-100 opacity-80'
                              }`}
                            >
                              Setup project
                            </button>
                          )}
                          {repos[index].isRepoEnabling && (
                            <button
                              onClick={() => {}}
                              className={`border flex items-center justify-center  px-10 rounded text-size-14 transition h-32 w-113 bg-gray-100 text-tas-400 cursor-not-allowed`}
                            >
                              Please wait...
                            </button>
                          )}
                        </Text>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CellMeasurer>
        )}
      </>
    );
  };

  const cache = new CellMeasurerCache({
    defaultHeight: 51,
    fixedWidth: true,
  });

  const [showNotification, setShownotification] = useState(true);
  const hideNotification = () => {
    setShownotification(false);
  };

  /*
this is temporary search for repositories page done on FE only. will be handled from backend later.

Later mainrepos will be removed and repos will be used.

*/

  const [repos, setRepos] = useState(mainrepos);
  const [currentSearchString, setCurrentSearchString] = useState('');

  const isFilterMode = () => {
    if (currentSearchString) {
      return true;
    } else {
      return false;
    }
  };

  const getInputValue = (e: any) => {
    if (e.target.value?.length >= search_char_limit || e.target.value?.length === 0) {
      if (e.target.value === currentSearchString) {
        return;
      }
      setCurrentSearchString(e.target.value);
    }
  };
  useEffect(() => {
    if (currentSearchString === '') {
      setRepos(mainrepos);
    }
    if (currentSearchString) {
      let filterrepos: any = [];
      mainrepos.forEach((repo: any) => {
        if (repo.name.toLowerCase().includes(currentSearchString.toLowerCase())) {
          filterrepos.push(repo);
        }
      });
      setRepos(filterrepos);
    }
  }, [currentSearchString, mainrepos.length]);

  /* temporary search code ends */

  return (
    <Layout title="TAS: Repositories List">
      <div className="sticky top-0 z-10 bg-gray-60">
        <Text className="py-20 px-20 flex items-center text-tas-400 text-size-12 bg-white shadow-sm">
          <Text className="mr-10">{currentOrg?.name}</Text>
          <img src="/assets/images/icon/right_arrow.svg" className="inline-block" />
          <Text
            size="span"
            className="inline-flex items-center justify-center capitalize ml-10 text-black"
          >
            {currentOrg && (
              <>
                <Image
                  src={`/assets/images/icon/${currentOrg?.git_provider}.svg`}
                  width="15"
                  className="mr-4"
                />
                {currentOrg?.git_provider} Repositories{' '}
              </>
            )}
          </Text>
        </Text>
        <div className="p-20 pb-0">
          {showNotification && repos && repos.length > 0 && (
            <div className="bg-blue-200 border border-blue-300 text-gray-860 p-15 rounded text-size-14 mb-20 relative justify-between flex items-center">
              <span className="inline-block " style={{ paddingRight: '30px' }}>
                Currently out of the box we provide support for unit tests for JavaScript and
                TypeScript projects only . The supported testing frameworks include Jest, Mocha &
                Jasmine. Importing a project that uses any other programming language or testing
                framework is not recommended.{' '}
                <span className="inline-block font-bold text-black">
                  If you don’t have any JS or TS projects, just fork our sample repos for{' '}
                  <a
                    className="font-bold underline"
                    href="https://github.com/LambdaTest/jest-demos"
                    title="https://github.com/LambdaTest/jest-demos"
                    target="_blank"
                  >
                    Jest
                  </a>
                  ,{' '}
                  <a
                    className="font-bold underline"
                    href="https://github.com/LambdaTest/mocha-demos"
                    title="https://github.com/LambdaTest/mocha-demos"
                    target="_blank"
                  >
                    Mocha
                  </a>{' '}
                  or{' '}
                  <a
                    className="font-bold underline"
                    href="https://github.com/LambdaTest/jasmine-node-js-example"
                    title="https://github.com/LambdaTest/jasmine-node-js-example"
                    target="_blank"
                  >
                    Jasmine
                  </a>{' '}
                  and follow these{' '}
                  <a
                    className="font-bold underline"
                    href="https://www.lambdatest.com/support/docs/tas-tutorial-cloud-demo"
                    target="_blank"
                  >
                    tutorial steps
                  </a>
                  .
                </span>
              </span>

              <span className="inline-block cursor-pointer" onClick={hideNotification}>
                <Image src="/assets/images/icon/cross-black.svg" />
              </span>
            </div>
          )}

          {((repos && repos.length > 0) || isFilterMode()) && (
            <div className="flex justify-between items-center mb-20">
              <div style={{ width: '200px' }}>
                <DebounceInput
                  onChange={getInputValue}
                  search
                  className={`border-none `}
                  amplitude="tas_search_test_list"
                  value={currentSearchString}
                />
              </div>
              {currentOrg?.git_provider == 'github' && (
                <div className="flex items-center gap-12">
                  <a
                    href={`https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/new`}
                    target="_blank"
                    className="text-tas-400 text-size-14 mr-10"
                  >
                    Can’t find your repo?
                  </a>
                  <ReloadPage onClick={handleReload} />
                </div>
              )}
            </div>
          )}

          {repos && repos.length > 0 && (
            <div className="bg-white rounded rounded-b-none border-b">
              <div className="flex -mx-0 w-full  py-12 items-center justify-between text-tas-400 text-size-12 font-medium tracking-wide">
                <div style={{ flex: '1' }} className="px-15">
                  Project Name
                </div>
                <div style={{ width: '163px' }} className="px-15">
                  Action
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center p-20 pt-0">
        <div className="w-full">
          {repos && repos.length === 0 && !isReposFetching && !isFilterMode() && (
            <Text
              className="p-20 bg-white rounded flex items-center justify-center flex-col py-80"
              style={{ height: '88vh' }}
            >
              <Image height="236" src="/assets/images/notests.png" width="386" />
              <Text size="h4" className="text-size-36 text-black mb-2 mt-40">
                Hey There!
              </Text>
              <Text size="h5" className="text-size-20 text-gray-700">
                There is no repository found in your account.
              </Text>
              <Text size="h5" className="text-size-20 text-gray-700 mt-10 mb-20">
                Integration of repos must be performed by an organization owner
              </Text>
              {currentOrg && currentOrg.git_provider && currentOrg.git_provider == 'github' && (
                <Link
                  href={`https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/new`}
                >
                  <a target="_blank">
                    <Text className="cursor-pointer text-size-16 text-blue-600">
                      Check Permissions
                    </Text>
                  </a>
                </Link>
              )}
            </Text>
          )}
          {repos && repos.length === 0 && !isReposFetching && isFilterMode() && (
            <div className="mt-120">
              <NoData msg="No repositories found!" />
            </div>
          )}

          {isReposFetching && (
            <div className="bg-white  rounded">
              <Loader loader_for="repositories" length={per_page_limit} />
            </div>
          )}
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            // @ts-ignore
            loadMoreRows={getMoreRepos}
            rowCount={resMetaData.next_cursor ? repos.length + 1 : repos.length}
            minimumBatchSize={per_page_limit}
            threshold={per_page_limit + per_page_limit / 2}
            ref={InfiniteLoaderRef}
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
                          rowCount={resMetaData.next_cursor ? repos.length + 1 : repos.length}
                          rowHeight={51}
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
          {/* {
            isReposFetching && repos.length !== 0 &&
            <div className="bg-white  rounded"> <Loader loader_for="repositories" length={per_page_limit} />
            </div>
          } */}
        </div>
      </div>
    </Layout>
  );
};

export default Repositories;
