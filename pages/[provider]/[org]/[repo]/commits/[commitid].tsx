import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

import _ from 'underscore';
import debounce from 'lodash.debounce';
import InfiniteScroll from 'react-infinite-scroller';

import {
  // fetchCommitCoverage,
  fetchCommitBuilds,
  fetchCurrentCommit,
  fetchImpactedTests,
  fetchUnImpactedTests,
  triggerCommitRebuild,
  unmountImpactedTests,
} from 'redux/actions/commitAction';
import { fetchTimeSaved, unmountBuildTests } from 'redux/actions/buildAction';

import { clipText, getText } from 'helpers/genericHelpers';
import { statusFound } from 'redux/helper';

import CardDataLoader from 'components/CardDataLoader';
import Duration from 'components/Duration';
import Dropdown from 'components/Dropdown';
import EllipsisText from 'components/EllipsisText';
import Layout from 'components/Layout';
import Loader from 'components/Loader';
import NoData from 'components/Nodata';
import TasLink from 'components/TasLink';
import TasTabs from 'components/TasTabs';
import Text from 'components/Tags/Text';
import TimeAgo from 'components/TimeAgo';

import CommitSummary from 'modules/Commits/sections/CommitSummary';

import VerticalLine from 'Graphs/VerticalLine';

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
import FlakyTestsInsights from 'modules/Builds/sections/FlakyTestsInsights';
import Tooltip from 'components/Tooltip';
import DebounceInput from 'components/DebounceInput';

const TestStatusTypes = {
  default: '',
  options: [
    {
      label: 'All Tests',
      value: '',
      data_key: (executionMeta: any) => {
        if (!executionMeta) return '';

        return (
          executionMeta['tests_passed'] +
          executionMeta['tests_failed'] +
          executionMeta['tests_skipped'] +
          executionMeta['tests_blocklisted'] +
          executionMeta['tests_quarantined']
        );
      },
    },
    { label: 'Passed', value: 'passed', data_key: 'tests_passed' },
    { label: 'Failed', value: 'failed', data_key: 'tests_failed' },
    { label: 'Skipped', value: 'skipped', data_key: 'tests_skipped' },
    { label: 'Blocklisted', value: 'blocklisted', data_key: 'tests_blocklisted' },
    { label: 'Quarantined', value: 'quarantined', data_key: 'tests_quarantined' },
  ],
};

const CommitDetails: NextPage = () => {
  const router = useRouter();
  const { commitid } = router.query;
  const { repo, provider, org } = router.query;

  const [currentBuildId, setCurrentBuildId] = useState('');
  const [impactedTab, setImpactedTab] = useState(true);
  // const [commitCoverageJsonData, setCommitCoverageJsonData] = useState<any>({});
  // const [coverageText, setCoverageText] = useState<any>("");

  const state = useSelector((state) => state, _.isEqual);
  const { commitData, buildData }: any = state;
  const {
    commitBuilds,
    impactedTests,
    isImpactedTestsFetching,
    impactedTestResMetaData,
    isCommitRebuildInProgress,
  }: {
    commitBuilds: any;
    impactedTests: any;
    isImpactedTestsFetching: any;
    impactedTestResMetaData: any;
    isCommitRebuildInProgress: boolean;
  } = commitData;
  const {
    currentCommit,
    isCurrentCommitFetching,
  }: { currentCommit: any; isCurrentCommitFetching: any } = commitData;

  // const {commitCoverage,isCommitCoverageFetching}: {commitCoverage:any,isCommitCoverageFetching:any} = commitData;

  const {
    unImpactedTests,
    isUnImpactedTestsFetching,
    unImpactedTestResMetaData,
  }: { unImpactedTests: any; isUnImpactedTestsFetching: any; unImpactedTestResMetaData: any } =
    commitData;

  const { time_saved, isTimeSavedFetching }: { time_saved: any; isTimeSavedFetching: any } =
    buildData;
  const hasTimeSavedData = !statusFound(currentCommit.latest_build?.status, false, true);
  const isLoadingTimeSavedData = isTimeSavedFetching && hasTimeSavedData;

  const statusMessage =
    currentCommit?.latest_build?.remark &&
    (currentCommit?.latest_build?.status === 'failed' ||
      currentCommit?.latest_build?.status === 'error')
      ? currentCommit?.latest_build?.remark
      : null;

  const executionMeta = currentCommit?.execution_meta || {};

  const latestBuildId = useRef();

  const toggleImpactedTab = () => {
    setImpactedTab(!impactedTab);
    setCurrentStatus(TestStatusTypes.options[0].value);
    setCurrentSearchString('');
    setCurrentStatusType(TestStatusTypes.options[0]);
  };
  const dispatch = useDispatch();
  const getCommitBuilds = () => {
    dispatch(fetchCommitBuilds(repo, commitid));
  };

  const getImpactedTests = (cursor?: string) => {
    dispatch(
      fetchImpactedTests(repo, commitid, currentBuildId, cursor ? cursor : '', undefined, params)
    );
  };

  const triggerRebuild = () => {
    dispatch(triggerCommitRebuild(repo, currentBuildId));
  };

  const getMoreImpactedTests = useCallback(
    debounce(() => {
      resetPositionOfList();
      const cursor = impactedTestResMetaData.next_cursor
        ? impactedTestResMetaData.next_cursor
        : '-1';
      getImpactedTests(cursor);
    }, 500),
    [impactedTestResMetaData.next_cursor]
  );

  useEffect(() => {
    return getMoreImpactedTests.cancel;
  }, [impactedTestResMetaData.next_cursor]);

  const getUnImpactedTests = (cursor?: string) => {
    dispatch(
      fetchUnImpactedTests(repo, commitid, currentBuildId, cursor ? cursor : '', undefined, params)
    );
  };

  const getMoreUnImpactedTests = useCallback(
    debounce(() => {
      const cursor = unImpactedTestResMetaData.next_cursor
        ? unImpactedTestResMetaData.next_cursor
        : '-1';
      getUnImpactedTests(cursor);
    }, 500),
    [unImpactedTestResMetaData.next_cursor]
  );

  useEffect(() => {
    return getMoreUnImpactedTests.cancel;
  }, [unImpactedTestResMetaData.next_cursor]);

  const changeCurrentBuildId = (buildId: string) => {
    const cancelPreviousRequest = !!currentBuild;
    changeStatus({ value: '' }, cancelPreviousRequest);
    getInputValue({ target: { value: '' } }, cancelPreviousRequest);
    setCurrentBuildId(buildId);
  };

  const getCurrentCommit = () => {
    dispatch(fetchCurrentCommit(repo, commitid, currentBuildId));
  };
  const getTimeSaved = (buildId: string) => {
    dispatch(fetchTimeSaved(repo, buildId, currentCommit.commit_id));
  };
  useEffect(() => {
    if (repo) {
      getCommitBuilds();
      getCurrentCommit();
    }
  }, [repo]);
  useEffect(() => {
    if (repo && currentBuildId && currentBuildId !== currentCommit.latest_build?.id) {
      getCurrentCommit();
    }
  }, [repo, currentBuildId, currentCommit.latest_build?.id]);
  useEffect(() => {
    return () => {
      dispatch(unmountImpactedTests());
      dispatch(unmountBuildTests());
    };
  }, []);
  useEffect(() => {
    if (!latestBuildId.current) {
      latestBuildId.current = currentCommit.latest_build?.id;
    }
    changeCurrentBuildId(currentCommit.latest_build?.id);
  }, [currentCommit.commit_id]);

  useEffect(() => {
    if (repo && currentCommit.commit_id && currentCommit.latest_build?.id) {
      if (hasTimeSavedData) {
        getTimeSaved(currentCommit.latest_build?.id);
      }
    }
  }, [currentCommit.commit_id, currentCommit.latest_build?.id]);

  const [currentStatus, setCurrentStatus] = useState(TestStatusTypes.options[0].value);
  const [currentSearchString, setCurrentSearchString] = useState('');
  const [currentStatusType, setCurrentStatusType] = useState(TestStatusTypes.options[0]);

  let params = { text: currentSearchString, status: currentStatus };

  const currentBuild = commitBuilds.find((build: any) => build.id === currentBuildId);

  const showFlakyView = currentBuild?.build_tag === 'flaky';

  const isFilterMode = () => {
    // @ts-ignore
    return Object.keys(params).some((k) => params[k] !== '');
  };

  const changeStatus = (option: any, cancelPreviousRequest: boolean = true) => {
    if (option) {
      if (option.value === currentStatus) {
        return;
      }
      if (isImpactedTestsFetching || isUnImpactedTestsFetching) {
        cancelPreviousRequest && cancelAxiosRequest && cancelAxiosRequest();
      }
      setCurrentStatus(option.value ? option.value : '');
      setCurrentStatusType(option);
    }
  };
  const getInputValue = (e: any, cancelPreviousRequest: boolean) => {
    if (isImpactedTestsFetching || isUnImpactedTestsFetching) {
      cancelPreviousRequest && cancelAxiosRequest && cancelAxiosRequest();
    }
    if (e.target.value?.length >= search_char_limit || e.target.value?.length === 0) {
      if (e.target.value === currentSearchString) {
        return;
      }
      setCurrentSearchString(e.target.value);
    }
  };

  useEffect(() => {
    if (currentBuild) {
      if (impactedTab && !showFlakyView) {
        getImpactedTests();
      } else if (!impactedTab) {
        getUnImpactedTests();
      }
    }
    return () => {
      InfiniteLoaderRef?.current?.resetLoadMoreRowsCache();
    };
  }, [currentBuildId, impactedTab, repo, currentStatus, currentSearchString]);

  const filtersBarRef = useRef<any>();
  const windowScrollRef = useRef<any>();
  const InfiniteLoaderRef = useRef<any>();

  useEffect(() => {
    if (impactedTestResMetaData && impactedTestResMetaData.next_cursor == '') {
      resetPositionOfList();
    }
  }, [impactedTestResMetaData.next_cursor]);

  const resetPositionOfList = () => {
    cache.clearAll();
    if (windowScrollRef && windowScrollRef.current) {
      windowScrollRef.current.updatePosition();
    }
  };

  const getStatusCount = (option: any) => {
    return typeof option.data_key === 'function'
      ? option.data_key(executionMeta)
      : executionMeta?.[option.data_key];
  };

  const isRowLoaded = ({ index }: any) => {
    return !!impactedTests[index];
  };

  const rowRenderer = ({ index, key, isVisible, parent, style }: any) => {
    return (
      <>
        {impactedTests && impactedTests[index] && impactedTests[index].test_id && (
          <CellMeasurer cache={cache} columnIndex={0} key={key} rowIndex={index} parent={parent}>
            {() => (
              <div style={style} key={impactedTests[index].test_id}>
                {!isVisible ? (
                  <Loader loader_for="impacted_tests" length={1} />
                ) : (
                  <div className="border-b">
                    <div
                      className="flex bg-white py-12 items-center list-hover justify-between"
                      key={impactedTests[index].test_id}
                    >
                      <div className="px-15  w-6/12 inline-flex items-center">
                        <div className="inline-flex items-center">
                          <VerticalLine
                            className="mmw6 h-inherit self-stretch rounded-lg mr-12"
                            type={impactedTests[index].status}
                          />
                          <span>
                            <TasLink
                              text={
                                <EllipsisText
                                  text={
                                    impactedTests[index].test_name
                                      ? impactedTests[index].test_name
                                      : '-'
                                  }
                                  length={70}
                                  dots
                                  copy
                                />
                              }
                              id={impactedTests[index].test_id}
                              notrim
                              path="tests"
                            />{' '}
                            <span className="flex">
                              <img
                                src="/assets/images/icon-blue.svg"
                                alt=""
                                width="12"
                                className="mr-5"
                              />
                              <span className="text-tas-400  text-size-12">
                                <TasLink
                                  id={impactedTests[index].test_suite_id}
                                  notrim
                                  path="tests-suites"
                                  text={
                                    <EllipsisText
                                      copy
                                      dots
                                      length={70}
                                      text={
                                        getText(impactedTests[index].test_suite_name)
                                          ? getText(impactedTests[index].test_suite_name)
                                          : 'N/A'
                                      }
                                    />
                                  }
                                />
                              </span>
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="px-15 w-3/12  inline-flex items-center">
                        <div className="inline-flex items-center">
                          <span className="flex  mr-2">
                            {impactedTests[index].duration >= 0 ? (
                              <Duration value={impactedTests[index].duration} />
                            ) : (
                              '-'
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="px-15 w-3/12  inline-flex items-center overflow-hidden">
                        <img src="/assets/images/user-gray.svg" alt="" className="mr-10 h-16" />
                        <div className="overflow-hidden">
                          {impactedTests[index].commit_author ? (
                            <Tooltip
                              content={impactedTests[index].commit_author}
                              placement="top"
                              offset={[0, 5]}
                            >
                              <div className="text-ellipsis">
                                {impactedTests[index].commit_author}
                              </div>
                            </Tooltip>
                          ) : (
                            '-'
                          )}
                          <div className="text-tas-400 text-size-12">
                            {impactedTests[index].created_at ? (
                              <TimeAgo date={impactedTests[index].created_at} />
                            ) : (
                              '-'
                            )}
                          </div>
                        </div>
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
    defaultHeight: 30,
    fixedWidth: true,
  });

  return (
    <Layout title={`TAS: ${repo} / Commits / ${clipText(currentCommit.commit_id)}`}>
      <TasTabs
        activeTab="commits"
        pagination={[
          <Link href={`/${provider}/${org}/${repo}/commits/`}>
            <a>Commits</a>
          </Link>,
          clipText(currentCommit.commit_id),
        ]}
      />
      <div className="max__center__container">
        {(isCurrentCommitFetching || !currentCommit.commit_id) && (
          <div className=" bg-white p-15 pt-20 flex flex-wrap  rounded-md">
            <CardDataLoader />
          </div>
        )}
        {!isCurrentCommitFetching && currentCommit.commit_id && (
          <CommitSummary
            commit={currentCommit}
            commitBuilds={commitBuilds}
            currentBuildId={currentBuildId}
            latestBuildId={latestBuildId}
            isRebuildInProgress={isCommitRebuildInProgress}
            isTimeSavedFetching={isLoadingTimeSavedData}
            setCurrentBuildId={changeCurrentBuildId}
            showFlakyView={showFlakyView}
            statusMessage={statusMessage}
            timeSaved={time_saved}
            triggerRebuild={triggerRebuild}
          />
        )}

        <div className="p-16 pt-0">
          <div className="commit_details_sec relative">
            <div className="sticky z-10 bg-gray-60 " style={{ top: '85px' }}>
              <div className="pt-10 -mx-15 mr-0">
                <div className="border-b">
                  <div
                    className={`py-12 px-15 inline-block cursor-pointer ${
                      impactedTab
                        ? 'border-b border-black text-tas-500  pointer-events-none'
                        : 'text-tas-400'
                    }`}
                    onClick={toggleImpactedTab}
                  >
                    Impacted Tests{' '}
                    {isLoadingTimeSavedData && <div className="loader inline-block ml-5"></div>}
                    {!isLoadingTimeSavedData && !isNaN(time_saved?.total_impacted_tests) && (
                      <span className="badge_gray ml-2">{time_saved?.total_impacted_tests}</span>
                    )}
                  </div>
                  <div
                    className={`py-12 px-15 inline-block cursor-pointer ${
                      !impactedTab
                        ? 'border-b border-black text-tas-500 pointer-events-none'
                        : 'text-tas-400'
                    }`}
                    onClick={toggleImpactedTab}
                  >
                    Unimpacted Tests{' '}
                    {isLoadingTimeSavedData && <div className="loader inline-block ml-5"></div>}
                    {!isLoadingTimeSavedData &&
                      !isNaN(time_saved?.total_tests - time_saved?.total_impacted_tests) && (
                        <span className="badge_gray ml-2">
                          {time_saved?.total_tests - time_saved?.total_impacted_tests}
                        </span>
                      )}
                  </div>
                </div>
              </div>
              {!showFlakyView &&
                !statusFound(currentBuild?.status) &&
                (impactedTests.length !== 0 || isFilterMode()) && (
                  <Text className="mt-15 mb-15 flex justify-between relative" ref={filtersBarRef}>
                    <div style={{ width: '200px' }}>
                      <DebounceInput
                        onChange={getInputValue}
                        search
                        className={`border-none `}
                        value={params.text}
                      />
                    </div>
                    <div>
                      <Dropdown
                        forcePosition
                        getPopupContainer={() => filtersBarRef.current}
                        onClick={(_value, option: any) => changeStatus(option)}
                        optionRenderer={(option: any) => (
                          <div
                            className={`flex items-center justify-between text-tas-400 text-size-12 px-8 py-5 cursor-pointer text-ellipsis rounded ${
                              currentStatus === option.value ? 'active' : ''
                            }`}
                          >
                            <div>{option.label}</div>
                            <div>{getStatusCount(option)}</div>
                          </div>
                        )}
                        options={TestStatusTypes.options}
                        selectedOption={currentStatusType}
                        toggleStyles={{
                          height: '32px',
                          background: '#fff',
                          width: '140px',
                        }}
                        labelKey="label"
                        valueKey="value"
                      />
                    </div>
                  </Text>
                )}
              {!showFlakyView &&
                !statusFound(currentBuild?.status) &&
                impactedTests &&
                impactedTests.length > 0 && (
                  <div className="mt-15 bg-white rounded rounded-b-none border-b">
                    <div className="flex -mx-0 w-full  py-12 items-center justify-between  text-tas-400 text-size-12 font-medium">
                      <div className="w-6/12 px-15">Test Details</div>
                      <div className="w-3/12 px-15">
                        <div>Duration</div>
                      </div>
                      <div className="w-3/12 px-15">Contributor</div>
                    </div>
                  </div>
                )}
            </div>
            {!showFlakyView && impactedTab ? (
              <>
                <div
                  className={
                    !showFlakyView && impactedTests && impactedTests.length > 0 ? '' : 'mt-15'
                  }
                >
                  {isImpactedTestsFetching &&
                    impactedTests.length == 0 &&
                    impactedTab &&
                    !statusFound(currentBuild?.status) && (
                      <Loader loader_for="impacted_tests" length={per_page_limit} />
                    )}
                  {!!impactedTests.length && !statusFound(currentBuild?.status) && (
                    <>
                      <InfiniteLoader
                        isRowLoaded={isRowLoaded}
                        // @ts-ignore
                        loadMoreRows={getMoreImpactedTests}
                        rowCount={
                          impactedTestResMetaData.next_cursor
                            ? impactedTests.length + 1
                            : impactedTests.length
                        }
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
                                      rowCount={
                                        impactedTestResMetaData.next_cursor
                                          ? impactedTests.length + 1
                                          : impactedTests.length
                                      }
                                      rowHeight={70}
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
                    </>
                  )}
                </div>
                <div className="mt-15 ">
                  {statusFound(currentBuild?.status) ? (
                    <div className="px-20  mb-15 flex items-center justify-center flex-col py-80">
                      <img src="/assets/images/chemical_funnel.svg" width="200" />
                      <p className="mt-20 opacity-40">
                        Please wait. Your commits are currently under processing.
                      </p>
                    </div>
                  ) : (
                    <>
                      {impactedTests &&
                        impactedTests.length === 0 &&
                        !isImpactedTestsFetching &&
                        !isFilterMode() && (
                          <NoData
                            msg={
                              statusFound(currentBuild?.status)
                                ? 'Please wait. Your commits are currently under processing.'
                                : 'No Test Cases were impacted in this Commit'
                            }
                          />
                        )}
                      {impactedTests &&
                        impactedTests.length === 0 &&
                        !isImpactedTestsFetching &&
                        isFilterMode() && <NoData msg="No test cases found!" />}
                    </>
                  )}
                </div>
              </>
            ) : (
              ''
            )}
            {showFlakyView && impactedTab && (
              <div className="pt-16">
                <FlakyTestsInsights
                  job={currentBuild}
                  maxHeight="calc(100vh - 270px)"
                  // minHeight="calc(100vh - 270px)"
                  repo={repo}
                  styles={{ minHeight: 'calc(100vh - 251px)', top: `151px` }}
                  listStyles={{
                    maxHeight: 'calc(100vh - 270px)',
                    minHeight: 'auto',
                  }}
                />
              </div>
            )}
            {!impactedTab ? (
              <>
                <div className="mt-15 ">
                  {statusFound(currentBuild?.status) ? (
                    <div className="px-20  mb-15 flex items-center justify-center flex-col py-80">
                      <img src="/assets/images/chemical_funnel.svg" width="200" />
                      <p className="mt-20 opacity-40">
                        Please wait. Your commits are currently under processing.
                      </p>
                    </div>
                  ) : (
                    <>
                      {unImpactedTests &&
                        unImpactedTests.length === 0 &&
                        !isUnImpactedTestsFetching && (
                          <div className="px-20  mb-15 flex items-center justify-center flex-col py-80">
                            <img src="/assets/images/chemical_funnel.svg" width="200" />
                            <p className="mt-20 opacity-40">No un-impacted test cases found.</p>
                          </div>
                        )}
                    </>
                  )}
                </div>
                <div className="mt-15 ">
                  {isUnImpactedTestsFetching &&
                    unImpactedTests.length == 0 &&
                    !impactedTab &&
                    !statusFound(currentBuild?.status) && (
                      <Loader loader_for="impacted_tests" length={per_page_limit} />
                    )}
                  {unImpactedTests.length > 0 && !statusFound(currentBuild?.status) && (
                    <div className="mt-15 bg-white rounded rounded-b-none border-b">
                      <div className="flex -mx-0 w-full  py-12 items-center justify-between  text-tas-400 text-size-12 font-medium">
                        <div className="w-12/12 px-15">Test Details</div>
                      </div>
                    </div>
                  )}
                  {!!unImpactedTests.length && !statusFound(currentBuild?.status) && (
                    <InfiniteScroll
                      pageStart={0}
                      loadMore={
                        unImpactedTestResMetaData.next_cursor &&
                        unImpactedTestResMetaData.next_cursor !== '' &&
                        !isUnImpactedTestsFetching
                          ? getMoreUnImpactedTests
                          : () => {}
                      }
                      hasMore={
                        unImpactedTestResMetaData.next_cursor &&
                        unImpactedTestResMetaData.next_cursor !== '' &&
                        !isUnImpactedTestsFetching
                          ? true
                          : false
                      }
                      initialLoad={true}
                      loader={<Loader key={Math.ceil(unImpactedTests.length / 10)} />}
                      useWindow={true}
                      threshold={500}
                    >
                      {unImpactedTests &&
                        unImpactedTests.length > 0 &&
                        unImpactedTests.map((test: any) => (
                          <div key={test.id} className="border-b">
                            <div
                              className="flex bg-white py-12 items-center  list-hover justify-between"
                              key={test.id}
                            >
                              <div className="px-15  w-7/12">
                                <div className="inline-flex items-center">
                                  <span>
                                    <TasLink
                                      text={
                                        <EllipsisText text={test.name} length={150} dots copy />
                                      }
                                      id={test.id}
                                      notrim
                                      path="tests"
                                    />{' '}
                                    <span className="flex">
                                      <img
                                        src="/assets/images/icon-blue.svg"
                                        alt=""
                                        width="12"
                                        className="mr-5"
                                      />{' '}
                                      <span className="text-tas-400 text-size-12">
                                        <TasLink
                                          text={test.test_suite_name}
                                          id={test.test_suite_id}
                                          notrim
                                          path="tests-suites"
                                        />
                                      </span>
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </InfiniteScroll>
                  )}
                </div>
              </>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CommitDetails;
