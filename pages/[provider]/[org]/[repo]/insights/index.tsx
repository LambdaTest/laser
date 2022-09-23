import React, { useCallback, useEffect, useRef, useState } from 'react';
import _ from 'underscore';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
import debounce from 'lodash.debounce';

import Col from 'components/Tags/Col';
import Dropdown from 'components/Dropdown';
import InlineToggleSelect from 'components/InlineToggleSelect';
import InsightsLeftMenu from 'components/InsightsLeftMenu';
import InsightsPlaceholder from 'components/InsightsPlaceholder';
import Layout from 'components/Layout';
import Row from 'components/Tags/Row';
import TasLink from 'components/TasLink';
import TasTabs from 'components/TasTabs';
import Tooltip, { TooltipThemeVariant } from 'components/Tooltip';
import TooltipCard from './tooltip-card';

import { fetchInsights, unmountInsights } from 'redux/actions/insightAction';

import { getDaysBetweenDates } from 'helpers/dateHelpers';
import { logAmplitude } from 'helpers/genericHelpers';
import { TestStatusColors } from 'constants/StatusColors';

const GraphViewTypes = {
  COMMIT: 'commit',
  DATE: 'date',
  JOB: 'job',
};

const GraphViewConfig = {
  default: GraphViewTypes.JOB,
  options: [
    {
      label: 'Test Cases vs Jobs',
      value: GraphViewTypes.JOB,
    },
    {
      label: 'Test Cases vs Commits',
      value: GraphViewTypes.COMMIT,
    },
    {
      label: 'Test Cases vs Dates',
      value: GraphViewTypes.DATE,
    },
  ],
};

const JobTypeConfig = {
  default: '',
  options: [
    {
      label: 'All Jobs',
      value: '',
    },
    {
      label: 'Premerge Jobs',
      value: 'premerge',
    },
    {
      label: 'Postmerge Jobs',
      value: 'postmerge',
    },
  ],
};

const DEFAULT_COMMIT_SECTION_PADDING = 30;

const DEFAULT_TEST_NAME_TEXT = 250;

const DEFAULT_COMMIT_BLOCK_SIZE = 50;

const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

const DurationOptions = {
  label: 'Last:',
  default: 10,
  options: [
    {
      key: 10,
      label: '10 days',
    },
    {
      key: 30,
      label: '30 days',
    },
    {
      key: 60,
      label: '60 days',
    },
  ],
};

const Analytics: NextPage = () => {
  const containerElRef = useRef(null);
  const scrollElRef = useRef(null);
  const router = useRouter();
  const { repo } = router.query;
  const state = useSelector((state) => state, _.isEqual);
  const { insightData }: any = state;
  const {
    insights,
    isInsightsFetching,
    resMetaData,
  }: {
    insights: any;
    isInsightsFetching: any;
    resMetaData: any;
  } = insightData;
  const dispatch = useDispatch();

  const [graphViewType, setGraphViewType] = useState(GraphViewConfig.default);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // Select '1M' as default option.
  const [selectedDays, setSelectedDays] = useState(DurationOptions.default);
  const [searchText, setSearchText] = useState('');
  const [jobType, setJobType] = useState(JobTypeConfig.default);
  const [updateScrollPosition, setUpdateScrollPosition] = useState(false);
  const [isFetchingMoreInsights, setIsFetchingMoreInsights] = useState(false);
  const [performSearch, setPerformSearch] = useState(false);

  const [allDataList, setAllDataList] = useState([] as any);
  const [scrollElWidth, setScrollElWidth] = useState('');

  const isDateEqual = (date1: any, date2: any) => {
    let _date1 = new Date(date1);
    let _date2 = new Date(date2);

    let __date1 = new Date(_date1.getFullYear(), _date1.getMonth(), _date1.getDate());
    let __date2 = new Date(_date2.getFullYear(), _date2.getMonth(), _date2.getDate());

    return +__date1 === +__date2;
  };

  // @ts-ignore
  const getDaysInMonth = (month, year) =>
    new Array(31)
      .fill('')
      .map((_, i) => new Date(year, month - 1, i + 1))
      .filter((v) => v.getMonth() === month - 1);

  const fetchInsightsData = (
    filter = false,
    startDate = '',
    endDate = '',
    searchText = '',
    _jobType: string | null = null
  ) => {
    if (startDate && endDate) {
      setUpdateScrollPosition(true);
      setIsFetchingMoreInsights(false);
      dispatch(
        fetchInsights(
          repo,
          startDate,
          endDate,
          '',
          filter,
          searchText,
          _jobType === null ? jobType : _jobType,
          graphViewType === GraphViewTypes.JOB ? 'job' : ''
        )
      );
    }
  };

  const getMoreInsights = () => {
    setUpdateScrollPosition(false);
    setIsFetchingMoreInsights(true);
    dispatch(
      fetchInsights(
        repo,
        startDate,
        endDate,
        resMetaData.next_cursor,
        false,
        searchText,
        jobType,
        graphViewType === GraphViewTypes.JOB ? 'job' : ''
      )
    );
  };

  useEffect(() => {
    return () => {
      dispatch(unmountInsights());
    };
  }, [repo]);

  useEffect(() => {
    if (updateScrollPosition) {
      const row = document.getElementsByClassName('lt-insights-row-container');
      if (row && row.length > 0) {
        // Get the first test row and find the last block with status.
        const insightsRow = row[0];
        const els = insightsRow.getElementsByClassName('lt-insights-status-block');
        const totalEls = els.length;
        if (els && totalEls > 0) {
          const lastEl = els[totalEls - 1];
          lastEl.scrollIntoView({ inline: 'center', block: 'start' });
          const scrollContainerEl: any = scrollElRef && scrollElRef.current;
          if (scrollContainerEl) {
            // Make sure the first data row is visible to the user.
            scrollContainerEl.scrollTop = 0;
          }
        }
      }
    }
  });

  const getUniqueDate = (date: any, data: any) => {
    data.sort(function (x: any, y: any) {
      return y.created_at - x.created_at;
    });
    data.map((el: any) => {
      let _date = new Date(el.created_at * 1000);
      el.created_at_date = `${_date.getFullYear()},${_date.getMonth()}, ${_date.getDate()}`;
    });
    data.map((el: any) => {
      el.introduced_at = data[data.length - 1].created_at;
    });
    const uniqueArray = data.filter(
      (v: any, i: any, a: any) =>
        a.findIndex((t: any) => t.created_at_date === v.created_at_date) === i
    );
    uniqueArray.sort(function (x: any, y: any) {
      return x.created_at - y.created_at;
    });
    const arr = uniqueArray.filter((el: any) => {
      if (isDateEqual(date, new Date(el.created_at * 1000))) {
        return el;
      }
    });
    return arr.length > 0 && arr[0];
  };

  const isPastDate = (dateToShow: any, introducedAtDate: any) => {
    return moment(dateToShow).isBefore(moment(introducedAtDate));
  };

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [insights, graphViewType]);

  useEffect(() => {
    if (repo) {
      setSelectedDays(selectedDays);
      getInsightsByDate(selectedDays);
      setSearchText('');
      setScrollElWidth('');
      setPerformSearch(false);
      setJobType('');
    }
  }, [graphViewType, repo]);

  const getInsightsByGroup = (insights: any, groupId: string) => {
    const uniqueData = new Set();
    const dataList = Array();
    insights &&
      insights.length > 0 &&
      insights.forEach((insight: any) => {
        const testStatus = insight.test_status;
        testStatus.forEach((status: any) => {
          const currentCommitId = status[groupId];
          if (!uniqueData.has(currentCommitId)) {
            dataList.push({
              id: currentCommitId,
              createdAt: status.created_at * 1000,
            });
            uniqueData.add(currentCommitId);
          }
        });
      });
    dataList.sort(function (firstValue: any, secondValue: any) {
      return firstValue.createdAt - secondValue.createdAt;
    });
    const parentContainer = containerElRef && containerElRef.current;
    let maxDataListToShow = 30;
    if (parentContainer) {
      const availableWidth =
        parentContainer['offsetWidth'] - DEFAULT_TEST_NAME_TEXT - DEFAULT_COMMIT_SECTION_PADDING;
      maxDataListToShow = Math.floor(availableWidth / DEFAULT_COMMIT_BLOCK_SIZE);
    }
    if (dataList.length < maxDataListToShow) {
      const emptyArray = Array(maxDataListToShow - dataList.length).fill('');
      setAllDataList([...dataList, ...emptyArray]);
      // Only set incase there are any dataList present.
      if (dataList.length) {
        setScrollElWidth('fit-content');
      }
    } else {
      setAllDataList(dataList);
      setScrollElWidth('');
    }
  };

  const getInsightInfoByDate = (
    matchingCommit: any,
    insight: any,
    isLastDataRow: boolean,
    status: string,
    title: string,
    oldStatus: string,
    renderOldTooltip: boolean
  ) => {
    const colorKey = status.toUpperCase() as keyof typeof TestStatusColors;
    if (renderOldTooltip) {
      return (
        <div
          data-tip={oldStatus}
          className={`lt-insights-status-block w-50 h-30 border-r border-gray-125
                                                        ${isLastDataRow ? '' : 'border-b'}
                                                        `}
          style={{
            background: TestStatusColors[colorKey],
          }}
        ></div>
      );
    }
    return (
      <Tooltip
        content={
          <TooltipCard
            authorName={matchingCommit.author_name}
            branchName={matchingCommit?.branch || '--'}
            buildId={title}
            commitId={matchingCommit?.commit_id || '--'}
            isPassed={status.toUpperCase() === 'PASSED'}
            suitName={insight?.test_suite_name || '--'}
            endedAt={`${moment(matchingCommit.created_at * 1000).fromNow(true)} ago`}
          />
        }
        delay={200}
        interactive={true}
        theme={TooltipThemeVariant.LIGHT}
      >
        <div
          className={`lt-insights-status-block w-50 h-30 border-r border-gray-125
                                                        ${isLastDataRow ? '' : 'border-b'}
                                                        `}
          style={{
            background: TestStatusColors[colorKey],
          }}
        ></div>
      </Tooltip>
    );
  };

  const getInsightInfoByGroup = (
    dataId: any,
    insight: any,
    dataCreatedAt: any,
    isLastDataRow: boolean,
    groupId: string,
    isGraphTypeCommit = false,
    renderOldToolTip = false
  ) => {
    if (!dataId) {
      return (
        <div
          className={`w-50 h-30 bg-gray-50 border-r border-gray-125 ${
            isLastDataRow ? '' : 'border-b'
          }`}
          data-tip={''}
        />
      );
    }
    const testStatus = insight.test_status;
    const testIntroducedAt = insight.introduced_at;
    const matchingCommit = testStatus.find((testStatusData: any) => {
      return testStatusData[groupId] === dataId;
    });
    const commitStatus = matchingCommit && matchingCommit.status;
    if (commitStatus) {
      const statusKey = commitStatus.toUpperCase() as keyof typeof TestStatusColors;
      let buildId = matchingCommit?.build_id.substr(0, 6);
      if (isGraphTypeCommit) {
        buildId = matchingCommit?.commit_id.substr(0, 6);
      }
      if (renderOldToolTip) {
        return (
          <div
            data-tip={commitStatus}
            className={`lt-insights-status-block w-50 h-30 border-r border-gray-125 ${
              isLastDataRow ? '' : 'border-b'
            } `}
            style={{ background: TestStatusColors[statusKey] || 'transparent' }}
          ></div>
        );
      }
      return (
        <Tooltip
          content={
            <TooltipCard
              authorName={matchingCommit.author_name}
              branchName={matchingCommit?.branch || '--'}
              buildId={`#${buildId}`}
              commitId={matchingCommit?.commit_id || '--'}
              isPassed={commitStatus.toUpperCase() === 'PASSED'}
              suitName={insight?.test_suite_name || '--'}
              endedAt={`${moment(matchingCommit.created_at * 1000).fromNow(true)} ago`}
            />
          }
          delay={200}
          interactive={true}
          theme={TooltipThemeVariant.LIGHT}
        >
          <div
            className={`lt-insights-status-block w-50 h-30 border-r border-gray-125 ${
              isLastDataRow ? '' : 'border-b'
            } `}
            style={{ background: TestStatusColors[statusKey] || 'transparent' }}
          ></div>
        </Tooltip>
      );
    } else {
      return (
        <div
          className={`w-50 h-30 bg-gray-50 border-r border-gray-125 ${
            isLastDataRow ? '' : 'border-b'
          }`}
          data-tip={`${
            isPastDate(dataCreatedAt, testIntroducedAt) ? 'Not Introduced' : 'Unimpacted'
          }`}
        ></div>
      );
    }
  };

  const renderHeader = function () {
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);
    const startDateToShow = startMoment.format('DD/MM/YYYY');
    const endDateToShow = endMoment.format('DD/MM/YYYY');
    return (
      <div className="border-r border-t border-b border-black border-opacity-10 bg-gray-100 flex text-gray-500">
        <div className="karla lt-insight-column text-size-12 py-7 px-8 border-r border-gray-125 lt-sticky-text">{`Showing: ${startDateToShow} to ${endDateToShow} `}</div>
        {graphViewType === GraphViewTypes.JOB && (
          <div className="w-9/12 flex">
            {allDataList.map((data: any, index: number) => (
              <span
                data-tip={data.id}
                key={index}
                className="lt-insights-column text-size-12 inline-flex w-50 py-7 px-8 border-r border-gray-125"
              >
                {data && data.id && (
                  <TasLink id={data.id} notrim text={`${data.id.substr(0, 4)}..`} path="jobs" />
                )}
              </span>
            ))}
          </div>
        )}
        {graphViewType === GraphViewTypes.COMMIT && (
          <div className="w-9/12 flex">
            {allDataList.map((data: any, index: number) => (
              <span
                data-tip={data.id}
                key={index}
                className="lt-insights-column text-size-12 inline-flex w-50 py-7 px-8 border-r border-gray-125"
              >
                {data && data.id && (
                  <TasLink id={data.id} notrim text={`${data.id.substr(0, 4)}..`} path="commits" />
                )}
              </span>
            ))}
          </div>
        )}
        {graphViewType === GraphViewTypes.DATE && (
          <div className="w-9/12 flex">
            {getDaysBetweenDates({ startDate, endDate }).map((date: any, index: number) => (
              <span
                key={index}
                className="lt-insights-column justify-center text-size-12 text-gray-500 inline-flex w-50 py-7 px-8 border-r border-b border-gray-125"
              >
                {moment(date).format('DD/MM')}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (graphViewType === GraphViewTypes.JOB) {
      getInsightsByGroup(insights, 'build_id');
    } else {
      getInsightsByGroup(insights, 'commit_id');
    }
    setTimeout(() => {
      ReactTooltip.rebuild();
    }, 500);
  }, [insights]);

  const getInsightsByDate = function (numberOfDays = 0) {
    const oldDate = moment().subtract(numberOfDays, 'days').format(DATE_FORMAT);
    const currentDate = moment().format(DATE_FORMAT);
    setStartDate(oldDate);
    setEndDate(currentDate);
    setSelectedDays(numberOfDays);
    setSearchText('');
    setPerformSearch(false);
    if (graphViewType !== GraphViewTypes.JOB && repo) {
      setJobType('');
      fetchInsightsData(true, oldDate, currentDate, '', '');
    }
    if (graphViewType === GraphViewTypes.JOB && repo) {
      fetchInsightsData(true, oldDate, currentDate, '', jobType);
    }
  };

  const renderDateBlock = function () {
    return (
      <InlineToggleSelect
        label={DurationOptions.label}
        onChange={getInsightsByDate}
        options={DurationOptions.options}
        selected={selectedDays}
      />
    );
  };

  const updateSearchText = function (event: any) {
    const searchText = event.target.value;
    setSearchText(searchText);
    setPerformSearch(true);
  };

  const handleSearchInsights = function () {
    if (repo && performSearch) {
      fetchInsightsData(true, startDate, endDate, searchText);
      logAmplitude('tas_search_done_insight_overview');
    }
  };

  const debouncedSearch = useCallback(debounce(handleSearchInsights, 500), [searchText]);

  useEffect(() => {
    debouncedSearch();

    // Cancel the debounce on useEffect cleanup.
    return debouncedSearch.cancel;
  }, [searchText]);

  return (
    <Layout title="Insights: Overview">
      <TasTabs activeTab="analytics" pagination={['Insights', 'Overview']} details_page={false} />
      <div className="p-20 max__center__container">
        <Row className="flex-wrap">
          <Col size="2">
            <InsightsLeftMenu />
          </Col>
          <Col size="10">
            <div className="mb-15 flex flex-wrap justify-between">
              <div className="flex">
                <input
                  className="px-10 py-10 text-size-14 h-32 block search__icon mr-10 lt-insights-search"
                  placeholder="Search tests here"
                  onChange={updateSearchText}
                  value={searchText}
                  type="text"
                  data-amplitude="tas_search_insight_overview"
                />
                <Dropdown
                  onClick={(_value, option: any) => {
                    setGraphViewType(_value);
                    logAmplitude('tas_filter_insight_overview', { 'View type': option.label });
                  }}
                  options={GraphViewConfig.options}
                  selectedOption={graphViewType}
                  toggleStyles={{
                    minWidth: '190px',
                    height: '32px',
                    background: 'white',
                  }}
                  dropdownStyles={{ zIndex: 111 }}
                />
                {graphViewType === GraphViewTypes.JOB && (
                  <div className="ml-8">
                    <Dropdown
                      onClick={(_value, option: any) => {
                        setJobType(_value);
                        fetchInsightsData(true, startDate, endDate, searchText, _value);
                        logAmplitude('tas_filter_insight_overview', {
                          'View Job type': option.label,
                        });
                      }}
                      options={JobTypeConfig.options}
                      selectedOption={jobType}
                      toggleStyles={{ minWidth: '130px', height: '32px', background: 'white' }}
                      dropdownStyles={{ zIndex: 111 }}
                    />
                  </div>
                )}
              </div>
              <div className="flex">{renderDateBlock()}</div>
            </div>
            <div className="lt-insights-container" ref={containerElRef}>
              {isInsightsFetching && !isFetchingMoreInsights ? (
                <div className="bg-white py-20 px-15 mb-10 ">
                  <InsightsPlaceholder />
                </div>
              ) : (
                <>
                  <div className="bg-white py-20 px-15 w-full">
                    <div className="date__parent__box designed-scroll">
                      <div
                        className={`${
                          !insights && !isInsightsFetching ? 'lt-scroll-no-border' : ''
                        } lt-scroll`}
                        ref={scrollElRef}
                        style={{
                          width:
                            graphViewType === GraphViewTypes.COMMIT ||
                            graphViewType === GraphViewTypes.JOB
                              ? scrollElWidth
                              : '',
                        }}
                      >
                        <InfiniteScroll
                          pageStart={0}
                          loadMore={
                            resMetaData.next_cursor &&
                            resMetaData.next_cursor !== '' &&
                            !isInsightsFetching
                              ? getMoreInsights
                              : () => {}
                          }
                          hasMore={
                            resMetaData.next_cursor &&
                            resMetaData.next_cursor !== '' &&
                            !isInsightsFetching
                              ? true
                              : false
                          }
                          initialLoad={false}
                          useWindow={false}
                          getScrollParent={() => document.querySelector('.lt-scroll')}
                          threshold={400}
                        >
                          {insights && insights.length > 0 && (
                            <div className="flex date__box items-baseline"> {renderHeader()}</div>
                          )}
                          {insights &&
                            insights.length > 0 &&
                            insights.map((el: any, parentIndex: number) => (
                              <div
                                className="flex items-center object-cover border-gray-125 lt-insights-row-container"
                                key={el.id}
                                data-index={el.id}
                              >
                                <span
                                  className={`${
                                    parentIndex === insights.length - 1 ? '' : 'border-b'
                                  } text-size-12 lt-insight-column  text-gray-625  block text-left px-8 lt-sticky-text h-30`}
                                >
                                  <TasLink
                                    addDots={true}
                                    text={el.name}
                                    id={el.id}
                                    path="tests"
                                    textLength={30}
                                  />
                                </span>
                                {graphViewType === GraphViewTypes.COMMIT && (
                                  <div className="w-9/12 flex">
                                    {allDataList.map((data: any, index: number) => (
                                      <div key={`insight-${data.id}-${index}`}>
                                        {getInsightInfoByGroup(
                                          data.id,
                                          el,
                                          data.createdAt,
                                          parentIndex === insights.length - 1,
                                          'commit_id',
                                          true,
                                          true
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {graphViewType === GraphViewTypes.JOB && (
                                  <div className="w-9/12 flex">
                                    {allDataList.map((data: any, index: number) => (
                                      <div key={`insight-${data.id}-${index}`}>
                                        {getInsightInfoByGroup(
                                          data.id,
                                          el,
                                          data.createdAt,
                                          parentIndex === insights.length - 1,
                                          'build_id',
                                          false,
                                          true
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {graphViewType === GraphViewTypes.DATE && (
                                  <div className="flex w-9/12">
                                    {el.test_status &&
                                      el.test_status.length > 0 &&
                                      getDaysBetweenDates({ startDate, endDate }).map(
                                        (date: any, index: any) => {
                                          const data = getUniqueDate(date, el.test_status);
                                          const status = data?.status;
                                          const capitalizedStatus =
                                            status?.toUpperCase() as keyof typeof TestStatusColors;

                                          return (
                                            <span
                                              key={`${index}${el.id}`}
                                              data-index={`${index}${el.id}`}
                                            >
                                              {data ? (
                                                getInsightInfoByDate(
                                                  data,
                                                  el,
                                                  parentIndex === insights.length - 1,
                                                  capitalizedStatus,
                                                  moment(date).format('DD/MM'),
                                                  status,
                                                  true
                                                )
                                              ) : (
                                                <div
                                                  className={`w-50 h-30 bg-gray-50 border-r border-gray-125 ${
                                                    parentIndex === insights.length - 1
                                                      ? ''
                                                      : 'border-b'
                                                  }`}
                                                  data-index={`${index}${el.id}`}
                                                  data-tip={`${
                                                    isPastDate(date, el.introduced_at)
                                                      ? 'Not Introduced'
                                                      : 'Unimpacted'
                                                  }`}
                                                  key={`${index}${el.id}`}
                                                ></div>
                                              )}
                                            </span>
                                          );
                                        }
                                      )}
                                  </div>
                                )}
                              </div>
                            ))}
                          {!insights && !isInsightsFetching && (
                            <div
                              style={{
                                height: '440px',
                              }}
                              className="flex items-center justify-center"
                            >
                              <div
                                className="flex items-center passFailPlaceholder_info"
                                style={{
                                  margin: 'auto',
                                  width: '220px',
                                  background: '#ffffffb0',
                                  padding: '10px',
                                  borderRadius: '4px',
                                }}
                              >
                                <img src="/assets/images/passfail.svg" className="mr-15" />
                                <span className="text-gray-500 text-size-14">
                                  Currently there is no <br />
                                  data available
                                </span>
                              </div>
                            </div>
                          )}
                        </InfiniteScroll>
                      </div>
                    </div>
                  </div>
                  <ReactTooltip />
                  {isInsightsFetching && (
                    <div className="text-center w-full relative loading__insights__more">
                      <span className="inline-block">
                        <div className="loader"></div>
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Analytics;
