import React, { useEffect, useState, useRef } from 'react';
import { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';

import _ from 'underscore';
import moment from 'moment';

import {
  fetchCurrentTestSuite,
  fetchSuiteDetails,
  fetchSuiteMetrics,
  fetchSuitePassFailGraph,
  unmountTestSuiteDetails,
  unmountTestSuitePrevious,
} from 'redux/actions/testAction';
import { convertBytesToGigabyte } from 'helpers/genericHelpers';

import BuildLink from 'components/Build/Link';
import CardDataLoader from 'components/CardDataLoader';
import DebounceInput from 'components/DebounceInput';
import Duration from 'components/Duration';
import Dropdown from 'components/Dropdown';
import Image from 'components/Tags/Image';
import Layout from 'components/Layout';
import Loader from 'components/Loader';
import NoData from 'components/Nodata';
import PeriodFilter, { TRange } from 'components/PeriodRangeFilter';
import Row from 'components/Tags/Row';
import TasLink from 'components/TasLink';
import TasTabs from 'components/TasTabs';
import Text from 'components/Tags/Text';
import TimeAgo from 'components/TimeAgo';
import VerticalLine from 'Graphs/VerticalLine';

import DateFormats from 'constants/DateFormats';
import { TestStatusTypes } from 'constants/StatusTypes';

import TestsLineChart from 'modules/Tests/sections/TestsLineChart';
import PassFailGraph from 'modules/Tests/sections/PassFailGraph';
import TestSuiteSummary from 'modules/TestSuites/sections/TestSuiteSummary';

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

const TestSuiteStatusTypes = {
  default: '',
  options: [
    { label: 'Total Executions', value: '', data_key: 'total_executions' },
    { label: 'Passed', value: 'passed', data_key: 'tests_suite_passed' },
    { label: 'Failed', value: 'failed', data_key: 'tests_suite_failed' },
    { label: 'Skipped', value: 'skipped', data_key: 'tests_suite_skipped' },
    { label: 'Blocklisted', value: 'blocklisted', data_key: 'tests_suite_blocklisted' },
  ],
};

const TestSuiteDetails: NextPage = () => {
  const router = useRouter();
  const { testsuiteid } = router.query;
  const { repo, provider, org } = router.query;

  const state = useSelector((state) => state, _.isEqual);
  const [openCard, setOpenCard] = useState(false);
  const [currentExecId, setCurrentExecId] = useState('');

  const [periodRange, setPeriodRange] = useState<TRange>(() => [
    moment().subtract(1, 'month').format(DateFormats.DATE_TIME),
    moment().format(DateFormats.DATE_TIME),
  ]);

  const { testData }: any = state;
  const {
    isSuiteDetailsFetching,
    suiteDetails,
    suiteDetailsResMetaData,
  }: { suiteDetails: any; suiteDetailsResMetaData: any; isSuiteDetailsFetching: any } = testData;
  const {
    isSuiteMetricsFetched,
    isSuiteMetricsFetching,
    suiteMetrics,
  }: { suiteMetrics: any; isSuiteMetricsFetching: any; isSuiteMetricsFetched: any } = testData;

  const {
    isSuitePassFailFetching,
    suitePassFails,
  }: { suitePassFails: any; isSuitePassFailFetching: any } = testData;
  const {
    currentTestSuite,
    isCurrentTestSuiteFetching,
  }: { currentTestSuite: any; isCurrentTestSuiteFetching: any } = testData;

  // @ts-ignore
  const executionMeta = currentTestSuite?.execution_meta || {};

  const filtersBarRef = useRef<any>();
  const metricsScrollTimeoutRef = useRef<any>();
  const windowScrollRef = useRef<any>();
  const InfiniteLoaderRef = useRef<any>();

  const dispatch = useDispatch();

  const getSuiteDetails = () => {
    dispatch(
      fetchSuiteDetails(repo, testsuiteid, '', periodRange[0], periodRange[1], undefined, params)
    );
  };
  const getMetricsData = (el: any) => {
    const { id, build_id, task_id } = el;
    setCurrentExecId(id);
    if (currentExecId === id) {
      setOpenCard(!openCard);
    } else {
      setOpenCard(true);
    }
    if (!openCard || id !== currentExecId) {
      dispatch(fetchSuiteMetrics({ repo, task_id, exec_id: id, build_id }));

      clearTimeout(metricsScrollTimeoutRef.current);
      metricsScrollTimeoutRef.current = setTimeout(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }, 100);
    }
  };
  const getPassFailGraphData = () => {
    dispatch(fetchSuitePassFailGraph(repo, testsuiteid, '', periodRange[0], periodRange[1]));
  };
  const fetchGraphByType = (period: TRange) => {
    if (period && period.length > 0) {
      setPeriodRange(period);
      dispatch(unmountTestSuitePrevious());
      dispatch(fetchSuitePassFailGraph(repo, testsuiteid, '', period[0], period[1]));
      dispatch(fetchSuiteDetails(repo, testsuiteid, '', period[0], period[1], undefined, params));
    }
  };
  const getMoreSuiteDetails = () => {
    resetPositionOfList();
    setTimeout(() => {
      dispatch(
        fetchSuiteDetails(
          repo,
          testsuiteid,
          suiteDetailsResMetaData.next_cursor ? suiteDetailsResMetaData.next_cursor : '-1',
          periodRange[0],
          periodRange[1],
          undefined,
          params
        )
      );
    }, 300);
  };
  const getCurrentTestSuite = () => {
    dispatch(fetchCurrentTestSuite(repo, testsuiteid));
  };

  useEffect(() => {
    if (repo) {
      getPassFailGraphData();
      getCurrentTestSuite();
    }
    return () => {
      dispatch(unmountTestSuiteDetails());
    };
  }, [repo]);

  useEffect(() => {
    if (isSuiteMetricsFetched && !isSuiteMetricsFetching && suiteMetrics.length === 0) {
      setOpenCard(false);
    }
    if (isSuiteMetricsFetched && !isSuiteMetricsFetching && suiteMetrics.length > 0) {
      setOpenCard(true);
    }
  }, [isSuiteMetricsFetched]);
  useEffect(() => {
    let target = document.getElementById(currentExecId);
    let target_id = document.getElementById('designed-scroll');
    if (target_id && openCard) {
      target_id.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
    if (target && openCard) {
      target.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentExecId, openCard]);

  const [currentStatus, setCurrentStatus] = useState(TestSuiteStatusTypes.options[0].value);
  const [currentSearchString, setCurrentSearchString] = useState('');
  const [currentStatusType, setCurrentStatusType] = useState(TestSuiteStatusTypes.options[0]);

  let params = { id: currentSearchString, status: currentStatus };

  const isFilterMode = () => {
    // @ts-ignore
    return Object.keys(params).some((k) => params[k] !== '');
  };

  const changeStatus = (option: any) => {
    if (option) {
      if (option.value === currentStatus) {
        return;
      }
      cancelAxiosRequest && cancelAxiosRequest();
      dispatch(unmountTestSuitePrevious());
      setCurrentStatus(option.value ? option.value : '');
      setCurrentStatusType(option);
    }
  };
  const getInputValue = (e: any) => {
    if (isSuiteDetailsFetching) {
      cancelAxiosRequest && cancelAxiosRequest();
    }
    if (e.target.value?.length >= search_char_limit || e.target.value?.length === 0) {
      if (e.target.value === currentSearchString) {
        return;
      }
      dispatch(unmountTestSuitePrevious());
      setCurrentSearchString(e.target.value);
    }
  };

  useEffect(() => {
    if (repo) {
      getSuiteDetails();
    }
    return () => {
      InfiniteLoaderRef?.current?.resetLoadMoreRowsCache();
    };
  }, [repo, currentStatus, currentSearchString]);

  useEffect(() => {
    if (suiteDetailsResMetaData && suiteDetailsResMetaData.next_cursor == '') {
      resetPositionOfList();
    }
  }, [suiteDetailsResMetaData.next_cursor]);

  const resetPositionOfList = () => {
    cache.clearAll();
    if (windowScrollRef && windowScrollRef.current) {
      windowScrollRef.current.updatePosition();
    }
  };

  const isRowLoaded = ({ index }: any) => {
    return !!suiteDetails[index];
  };
  const rowRenderer = ({ index, key, isVisible, parent, style }: any) => {
    const isRowSelected = currentExecId === suiteDetails?.[index]?.id && openCard;
    return (
      <>
        {suiteDetails && suiteDetails[index] && suiteDetails[index].id && (
          <CellMeasurer cache={cache} columnIndex={0} key={key} rowIndex={index} parent={parent}>
            {() => (
              <div style={style} key={suiteDetails[index].id}>
                {!isVisible ? (
                  <Loader loader_for="test_suite_details" length={1} />
                ) : (
                  <div className="border-b">
                    <Row
                      className={`flex flex-wrap bg-white ${
                        isRowSelected ? 'active' : ''
                      } py-10 items-center  list-hover justify-between`}
                      gutter="0"
                      key={suiteDetails[index].id}
                    >
                      <div className="inline-flex items-center px-15" style={{ width: '22%' }}>
                        <Text className="inline-flex items-center">
                          <Text className=""></Text>
                          <VerticalLine
                            className="mmw6 h-44 self-stretch  rounded-lg mr-20"
                            type={suiteDetails[index].status}
                          />
                          <Text size="span">
                            <Duration value={suiteDetails[index].duration} />
                          </Text>
                        </Text>
                      </div>
                      <div className="inline-flex items-center pr-15" style={{ width: '22%' }}>
                        <Text className="inline-flex items-center">
                          <Text size="span" className=" flex items-center">
                            <Image src="/assets/images/yellow-2.svg" alt="" className="mr-7 h-12" />
                            <TasLink id={suiteDetails[index].commit_id} path="commits" />
                          </Text>
                        </Text>
                      </div>
                      <div className="inline-flex items-center pr-15" style={{ width: '22%' }}>
                        <Text className="inline-flex items-center">
                          <Text size="span" className="  flex ">
                            <BuildLink
                              id={suiteDetails[index]?.build_id}
                              link
                              type={suiteDetails[index]?.build_tag}
                            />
                          </Text>
                        </Text>
                      </div>
                      <div className="inline-flex items-center pr-15" style={{ width: '22%' }}>
                        <Text className="inline-flex items-center">
                          <TimeAgo date={suiteDetails[index].created_at} />
                        </Text>
                      </div>
                      <div className="inline-flex items-center pr-15" style={{ width: '12%' }}>
                        {suiteDetails[index].duration ? (
                          <>
                            {isRowSelected ? (
                              <>
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => getMetricsData(suiteDetails[index])}
                                    className="text-gray-900 py-10 px-0 ml-25 text-size-14 border-b border-black inline-block uppercase tracking-wider"
                                  >
                                    Metrics
                                  </button>
                                </div>
                              </>
                            ) : (
                              <Text className="flex justify-end">
                                <button
                                  onClick={() => getMetricsData(suiteDetails[index])}
                                  className="border py-3 px-10 rounded text-size-14 transition bg-white text-gray-600 border-gray-600 inline-flex items-center w-85 text-center justify-center"
                                >
                                  Metrics
                                </button>
                              </Text>
                            )}
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                      {isRowSelected && (
                        <>
                          <div
                            className="w-12/12 w-full p-30 flex"
                            id={`${suiteDetails[index].id}`}
                          >
                            <div className="w-6/12 px-15 pr-10">
                              <TestsLineChart
                                data={suiteMetrics}
                                loading={isSuiteMetricsFetching}
                                title="Memory"
                                unit="GB"
                                valueFormatter={convertBytesToGigabyte}
                                valueKey="memory"
                              />
                            </div>
                            <div className="w-6/12 px-15">
                              <TestsLineChart
                                data={suiteMetrics}
                                loading={isSuiteMetricsFetching}
                                title="CPU"
                                unit="%"
                                valueKey="cpu"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </Row>
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
    <Layout title={`TAS: ${repo} / Tests / ${currentTestSuite.name}`}>
      <TasTabs
        activeTab="test_suite"
        pagination={[
          <Link href={`/${provider}/${org}/${repo}/tests-suites/`}>
            <a>Test Suite</a>
          </Link>,
          currentTestSuite.name,
        ]}
      />
      <div className="max__center__container test-suite-details-container relative">
        {isCurrentTestSuiteFetching && (
          <Text className="bg-white p-20 pt-30 flex flex-wrap  rounded-md">
            <CardDataLoader />{' '}
          </Text>
        )}
        {currentTestSuite.id && <TestSuiteSummary testSuite={currentTestSuite} />}

        <div className="p-16 pt-0">
          <div className="pb-16 pt-16 flex flex-wrap justify-end">
            <PeriodFilter
              onChange={fetchGraphByType}
              label="Showing data for - "
              value={periodRange}
            />
            {/* <button className="border py-0 px-10 rounded text-size-20 transition bg-black text-white border-black inline-flex items-center">+</button>
                <button className="py-5 px-8 rounded text-size-14 transition bg-white text-gray-600  inline-flex items-center mr-5">Add Graph</button> */}
          </div>
          <PassFailGraph
            data={suitePassFails}
            dateRange={{ start_date: periodRange[0], end_date: periodRange[1] }}
            loading={isSuitePassFailFetching}
            testsToShow={[
              TestStatusTypes.PASSED,
              TestStatusTypes.FAILED,
              TestStatusTypes.SKIPPED,
              TestStatusTypes.BLOCKLISTED,
            ]}
            title="Test Suite Results"
            unit="ms"
          />
          <div className="sticky z-10 bg-gray-60 pt-20" style={{ top: '85px' }}>
            <div className="tests__section__header relative">
              {(suiteDetails.length !== 0 || isFilterMode()) && (
                <div
                  className="flex justify-between items-center bg-white p-8 pl-15  rounded-md mb-10 relative"
                  ref={filtersBarRef}
                >
                  <div className="flex items-center">Test Suite Execution History</div>
                  <div className="flex text-size-14">
                    <div className="mr-20">
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
                            {/* <div>{executionMeta[option.data_key]}</div> */}
                          </div>
                        )}
                        options={TestSuiteStatusTypes.options}
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
                    <div style={{ width: '200px' }}>
                      <DebounceInput
                        onChange={getInputValue}
                        search
                        className={`text-size-14`}
                        value={params.id}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {suiteDetails && suiteDetails.length > 0 && (
              <div className="bg-white rounded rounded-b-none border-b">
                <div className="flex -mx-0 w-full  py-12 items-center justify-between text-size-12 font-medium text-tas-400">
                  <div className="w-3/12 px-15" style={{ width: '22%' }}>
                    Avg Duration
                  </div>
                  <div className="w-2/12 pr-15" style={{ width: '22%' }}>
                    Commit ID
                  </div>
                  <div className="w-3/12 pr-15" style={{ width: '22%' }}>
                    Latest Job
                  </div>
                  <div className="w-2/12 pr-15" style={{ width: '22%' }}>
                    Executed
                  </div>
                  <div className="w-2/12 pr-15" style={{ width: '12%' }}></div>
                </div>
              </div>
            )}
          </div>
          <div className="">
            {isSuiteDetailsFetching && suiteDetails.length == 0 && (
              <Loader loader_for="test_suite_details" length={per_page_limit} />
            )}
            {!isSuiteDetailsFetching && suiteDetails.length == 0 && !isFilterMode() && (
              <NoData msg={`No test suites found for given period!`} />
            )}
            {!isSuiteDetailsFetching && suiteDetails.length == 0 && isFilterMode() && (
              <NoData msg={`No test suites found!`} />
            )}
            {suiteDetails && suiteDetails.length > 0 && (
              <InfiniteLoader
                isRowLoaded={isRowLoaded}
                // @ts-ignore
                loadMoreRows={getMoreSuiteDetails}
                rowCount={
                  suiteDetailsResMetaData.next_cursor
                    ? suiteDetails.length + 1
                    : suiteDetails.length
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
                                suiteDetailsResMetaData.next_cursor
                                  ? suiteDetails.length + 1
                                  : suiteDetails.length
                              }
                              rowHeight={cache.rowHeight}
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
            )}
            {isSuiteDetailsFetching && suiteDetails.length !== 0 && (
              <Loader loader_for="test_suite_details" length={per_page_limit} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TestSuiteDetails;
