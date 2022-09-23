import React, { useEffect, useState, useRef } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

import _ from 'underscore';

import moment from 'moment';

import {
  fetchCurrentTest,
  fetchMetrics,
  fetchPassFailGraph,
  fetchTestDetails,
  unmountTestPrevious,
  unmountTestsDetails,
} from 'redux/actions/testAction';
import { convertBytesToGigabyte } from 'helpers/genericHelpers';
import DateFormats from 'constants/DateFormats';

import VerticalLine from 'Graphs/VerticalLine';

import BuildLink from 'components/Build/Link';
import CardDataLoader from 'components/CardDataLoader';
import Duration from 'components/Duration';
import EllipsisText from 'components/EllipsisText';
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

import TestsLineChart from 'modules/Tests/sections/TestsLineChart';
import PassFailGraph from 'modules/Tests/sections/PassFailGraph';

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
import TestSummary from 'modules/Tests/sections/TestSummary';
import DebounceInput from 'components/DebounceInput';
import Dropdown from 'components/Dropdown';

const TestStatusTypes = {
  default: '',
  options: [
    { label: 'Total Executions', value: '', data_key: 'total_tests_executed' },
    { label: 'Passed', value: 'passed', data_key: 'tests_passed' },
    { label: 'Failed', value: 'failed', data_key: 'tests_failed' },
    { label: 'Skipped', value: 'skipped', data_key: 'tests_skipped' },
    { label: 'Blocklisted', value: 'blocklisted', data_key: 'tests_blocklisted' },
    { label: 'Quarantined', value: 'quarantined', data_key: 'tests_quarantined' },
  ],
};

const TestDetails: NextPage = () => {
  const router = useRouter();
  const { testid } = router.query;
  const { repo, provider, org } = router.query;

  const state = useSelector((state: any) => state, _.isEqual);
  const { testData }: any = state;
  const {
    isTestDetailsFetching,
    testDetails,
    testDetailsResMetaData,
  }: { testDetails: any; testDetailsResMetaData: any; isTestDetailsFetching: any } = testData;
  const {
    isMetricsFetched,
    isMetricsFetching,
    metrics,
  }: { metrics: any; isMetricsFetching: any; isMetricsFetched: any } = testData;
  const { passFails, isPassFailFetching }: { passFails: any; isPassFailFetching: any } = testData;
  const { currentTest, isCurrentTestFetching }: { currentTest: any; isCurrentTestFetching: any } =
    testData;

  const [openCard, setOpenCard] = useState(false);
  const [currentExecId, setCurrentExecId] = useState('');

  const [periodRange, setPeriodRange] = useState<TRange>(() => [
    moment().subtract(1, 'month').format(DateFormats.DATE_TIME),
    moment().format(DateFormats.DATE_TIME),
  ]);
  // @ts-ignore
  const executionMeta = currentTest?.execution_meta || {};

  const filtersBarRef = useRef<any>();
  const metricsScrollTimeoutRef = useRef<any>();
  const windowScrollRef = useRef<any>();
  const InfiniteLoaderRef = useRef<any>();

  const dispatch = useDispatch();
  const getTestDetails = () => {
    dispatch(fetchTestDetails(repo, testid, '', periodRange[0], periodRange[1], undefined, params));
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
      dispatch(fetchMetrics({ repo, task_id, exec_id: id, build_id }));

      clearTimeout(metricsScrollTimeoutRef.current);
      metricsScrollTimeoutRef.current = setTimeout(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }, 100);
    }
  };
  const getPassFailGraphData = () => {
    dispatch(fetchPassFailGraph(repo, testid, '', periodRange[0], periodRange[1]));
  };
  const fetchGraphByType = (period: TRange) => {
    if (period && period.length > 0) {
      setPeriodRange(period);
      dispatch(unmountTestPrevious());
      dispatch(fetchPassFailGraph(repo, testid, '', period[0], period[1]));
      dispatch(fetchTestDetails(repo, testid, '', period[0], period[1], undefined, params));
    }
  };
  const getMoreTestDetails = () => {
    resetPositionOfList();
    setTimeout(() => {
      dispatch(
        fetchTestDetails(
          repo,
          testid,
          testDetailsResMetaData.next_cursor ? testDetailsResMetaData.next_cursor : '-1',
          periodRange[0],
          periodRange[1],
          undefined,
          params
        )
      );
    }, 300);
  };
  const getCurrentTest = () => {
    dispatch(fetchCurrentTest(repo, testid));
  };
  useEffect(() => {
    if (repo) {
      getPassFailGraphData();
      getCurrentTest();
    }
    return () => {
      dispatch(unmountTestsDetails());
    };
  }, [repo]);
  useEffect(() => {
    if (isMetricsFetched && metrics.length === 0) {
      setOpenCard(false);
    }
    if (isMetricsFetched && metrics.length > 0) {
      setOpenCard(true);
    }
  }, [isMetricsFetched]);
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

  const [currentStatus, setCurrentStatus] = useState(TestStatusTypes.options[0].value);
  const [currentSearchString, setCurrentSearchString] = useState('');
  const [currentStatusType, setCurrentStatusType] = useState(TestStatusTypes.options[0]);

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
      dispatch(unmountTestPrevious());
      setCurrentStatus(option.value ? option.value : '');
      setCurrentStatusType(option);
    }
  };
  const getInputValue = (e: any) => {
    if (isTestDetailsFetching) {
      cancelAxiosRequest && cancelAxiosRequest();
    }
    if (e.target.value?.length >= search_char_limit || e.target.value?.length === 0) {
      if (e.target.value === currentSearchString) {
        return;
      }
      dispatch(unmountTestPrevious());
      setCurrentSearchString(e.target.value);
    }
  };

  useEffect(() => {
    if (repo) {
      getTestDetails();
    }
    return () => {
      InfiniteLoaderRef?.current?.resetLoadMoreRowsCache();
    };
  }, [repo, currentStatus, currentSearchString]);

  useEffect(() => {
    if (testDetailsResMetaData && testDetailsResMetaData.next_cursor == '') {
      resetPositionOfList();
    }
  }, [testDetailsResMetaData.next_cursor]);

  const resetPositionOfList = () => {
    cache.clearAll();
    if (windowScrollRef && windowScrollRef.current) {
      windowScrollRef.current.updatePosition();
    }
  };

  const isRowLoaded = ({ index }: any) => {
    return !!testDetails[index];
  };

  const rowRenderer = ({ index, key, isVisible, parent, style }: any) => {
    const isRowSelected = currentExecId === testDetails?.[index]?.id && openCard;
    return (
      <>
        {testDetails && testDetails[index] && testDetails[index].id && (
          <CellMeasurer cache={cache} columnIndex={0} key={key} rowIndex={index} parent={parent}>
            {({ measure }) => (
              <div style={style} key={testDetails[index].id}>
                {!isVisible ? (
                  <Loader loader_for="test_details" length={1} />
                ) : (
                  <div className="border-b" onLoadStart={measure}>
                    <Row
                      className={`flex flex-wrap bg-white ${
                        isRowSelected ? 'active' : ''
                      } py-10 items-center  list-hover justify-between`}
                      gutter="0"
                    >
                      <div className="inline-flex items-center px-15" style={{ width: '22%' }}>
                        <Text className="inline-flex items-center">
                          <VerticalLine
                            className="mmw6 h-44 self-stretch rounded-lg mr-20"
                            type={testDetails[index].status}
                          />
                          <Text size="span">
                            <Duration value={testDetails[index].duration} />
                          </Text>
                        </Text>
                      </div>
                      <div className="inline-flex items-center pr-15" style={{ width: '22%' }}>
                        <Text className="inline-flex items-center">
                          <Text size="span" className="flex items-center">
                            <Image src="/assets/images/yellow-2.svg" alt="" className="mr-7 h-12" />
                            <TasLink id={testDetails[index].commit_id} path="commits" />
                          </Text>
                        </Text>
                      </div>
                      <div className="inline-flex items-center pr-15" style={{ width: '22%' }}>
                        <Text className="inline-flex items-center">
                          <Text size="span" className=" flex">
                            <BuildLink
                              id={testDetails[index].build_id}
                              link
                              type={testDetails[index].build_tag}
                            />
                          </Text>
                        </Text>
                      </div>
                      <div className="inline-flex items-center pr-15" style={{ width: '22%' }}>
                        <Text className="inline-flex items-center">
                          <TimeAgo date={testDetails[index].created_at} />
                        </Text>
                      </div>
                      <div className="inline-flex items-center pr-15" style={{ width: '12%' }}>
                        {testDetails[index].duration ? (
                          <>
                            {isRowSelected ? (
                              <>
                                <div className="flex justify-end">
                                  <button
                                    className="text-gray-900 py-10 px-0 ml-25 text-size-14 border-b border-black inline-block uppercase tracking-wider"
                                    onClick={() => getMetricsData(testDetails[index])}
                                  >
                                    Metrics
                                  </button>
                                </div>
                              </>
                            ) : (
                              <Text className="flex justify-end">
                                <button
                                  onClick={() => getMetricsData(testDetails[index])}
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
                          <div className="w-12/12 w-full p-30 flex" id={`${testDetails[index].id}`}>
                            <div className="w-6/12 px-15 pr-10">
                              <TestsLineChart
                                data={metrics}
                                loading={isMetricsFetching}
                                title="Memory"
                                unit="GB"
                                valueFormatter={convertBytesToGigabyte}
                                valueKey="memory"
                              />
                            </div>
                            <div className="w-6/12 px-15">
                              <TestsLineChart
                                data={metrics}
                                loading={isMetricsFetching}
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
    defaultHeight: 51,
    fixedWidth: true,
  });

  return (
    <Layout title={`TAS: ${repo} / Tests / ${currentTest.name}`}>
      <TasTabs
        activeTab="tests"
        pagination={[
          <Link href={`/${provider}/${org}/${repo}/tests/`}>
            <a>Tests</a>
          </Link>,
          <EllipsisText copy dots length="150" text={currentTest.name} />,
        ]}
      />
      <div className="max__center__container test__build__details relative">
        {isCurrentTestFetching && (
          <Text className="bg-white p-20 pt-30 flex flex-wrap">
            <CardDataLoader />
          </Text>
        )}
        {currentTest.id && <TestSummary test={currentTest} />}
        <div className="p-16 pt-0">
          <div className="">
            <div className="pb-16 pt-16 flex flex-wrap justify-end items-center">
              <PeriodFilter
                onChange={fetchGraphByType}
                label="Showing data for - "
                value={periodRange}
              />
              {/* <button className="border py-0 px-8 rounded h-32 text-size-18 transition bg-black text-white border-black inline-flex items-center">+</button>
                    <button className="py-5 px-8 rounded text-size-14 h-32 transition bg-white text-gray-600  inline-flex items-center">Add Graph</button> */}
            </div>
            <PassFailGraph
              data={passFails}
              dateRange={{ start_date: periodRange[0], end_date: periodRange[1] }}
              loading={isPassFailFetching}
              title="Test Results"
              unit="ms"
            />
          </div>
          <div className="sticky z-10 bg-gray-60 pt-20" style={{ top: '85px' }}>
            <div className="tests__section__header relative">
              {(testDetails.length !== 0 || isFilterMode()) && (
                <div
                  className="flex justify-between items-center bg-white p-8 pl-15 rounded-md mb-10 relative"
                  ref={filtersBarRef}
                >
                  <div className="flex items-center">Test Execution History</div>
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
                    <div style={{ width: '200px' }}>
                      <DebounceInput
                        onChange={getInputValue}
                        search
                        className={`text-size-14 `}
                        value={params.id}
                      />
                    </div>
                  </div>
                </div>
              )}
              {testDetails && testDetails.length > 0 && (
                <div className="bg-white rounded rounded-b-none border-b">
                  <div className="flex -mx-0 w-full  py-12 items-center justify-between  text-size-12 text-tas-400 font-medium">
                    <div className="px-15" style={{ width: '22%' }}>
                      Duration
                    </div>
                    <div className="pr-15" style={{ width: '22%' }}>
                      Commit ID
                    </div>
                    <div className="pr-15" style={{ width: '22%' }}>
                      Job ID
                    </div>
                    <div className="pr-15" style={{ width: '22%' }}>
                      Executed
                    </div>
                    <div className="pr-15" style={{ width: '12%' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {isTestDetailsFetching && testDetails.length == 0 && (
            <Loader loader_for="test_details" length={per_page_limit} />
          )}
          {!isTestDetailsFetching && testDetails.length == 0 && !isFilterMode() && (
            <NoData msg={`This test was not run in given period!`} />
          )}
          {!isTestDetailsFetching && testDetails.length == 0 && isFilterMode() && (
            <NoData msg={`No tests found!`} />
          )}
          {testDetails && testDetails.length > 0 && (
            <InfiniteLoader
              isRowLoaded={isRowLoaded}
              // @ts-ignore
              loadMoreRows={getMoreTestDetails}
              rowCount={
                testDetailsResMetaData.next_cursor ? testDetails.length + 1 : testDetails.length
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
                              testDetailsResMetaData.next_cursor
                                ? testDetails.length + 1
                                : testDetails.length
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
          {isTestDetailsFetching && testDetails.length !== 0 && (
            <Loader loader_for="test_details" length={per_page_limit} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TestDetails;
