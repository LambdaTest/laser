import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import _ from 'underscore';
import InfiniteScroll from 'react-infinite-scroller';
import { areEqual } from 'react-window';
import { cancelAxiosRequest } from 'redux/httpclient';
import ReactTooltip from 'react-tooltip';

import { roundOff } from 'helpers/mathHelpers';
import { search_char_limit, statusFound } from 'redux/helper';

import { fetchFlakyBuildDetails, unmountFlakyBuildDetails } from 'redux/actions/buildAction';

import { TestStatusColors } from 'constants/StatusColors';
import { FlakyTestStatusLabels, TestStatusLabels } from 'constants/StatusLabels';
import { FlakyTestStatusTypes } from 'constants/StatusTypes';

import DebounceInput from 'components/DebounceInput';
import Dropdown from 'components/Dropdown';
import EllipsisText from 'components/EllipsisText';
import Image from 'components/Tags/Image';
import LoaderTable from '../components/LoaderTable';
import NoData from 'components/Nodata';
import TasLink from 'components/TasLink';

const StatusOptions = [
  { label: 'All Tests', value: '', data_key: 'impacted_tests' },
  { label: 'Flaky', value: 'flaky', data_key: 'flaky_tests' },
  {
    label: 'Stable',
    value: 'nonflaky',
    countGetter: (meta: any) => {
      console.log(meta);
      if (meta) {
        const nonFlakyTests =
          (meta.impacted_tests || 0) -
          (meta.flaky_tests || 0) -
          (meta.tests_skipped || 0) -
          (meta.tests_blocklisted || 0);

        return nonFlakyTests;
      }
      return 0;
    },
  },
  { label: 'Blocklisted', value: 'blocklisted', data_key: 'tests_blocklisted' },
  { label: 'Skipped', value: 'skipped', data_key: 'tests_skipped' },
];

const TestResultToColor = {
  passed: TestStatusColors.PASSED,
  failed: TestStatusColors.FAILED,
  blocklisted: TestStatusColors.BLOCKLISTED,
  skipped: TestStatusColors.SKIPPED,
  quarantined: TestStatusColors.QUARANTINED,
  notrun: TestStatusColors.UNIMPACTED,
} as any;

const TestResultToLabel = {
  passed: TestStatusLabels.PASSED,
  failed: TestStatusLabels.FAILED,
  blocklisted: TestStatusLabels.BLOCKLISTED,
  skipped: TestStatusLabels.SKIPPED,
  quarantined: TestStatusLabels.QUARANTINED,
  notrun: 'Not Run',
} as any;

function getSeverity(flakyRate: number) {
  if (!flakyRate) {
    return null;
  }
  if (flakyRate < 0.3) {
    return 'minor';
  }
  if (flakyRate < 0.6) {
    return 'moderate';
  }
  if (flakyRate < 0.9) {
    return 'major';
  }
  return 'severe';
}

const severityIconMap = {
  major: '/assets/images/icon/icon-Severity-v2-Major.svg',
  minor: '/assets/images/icon/icon-Severity-v2-Minor.svg',
  moderate: '/assets/images/icon/icon-Severity-v2-Moderate.svg',
  none: '/assets/images/icon/icon-Severity-v2-None.svg',
  severe: '/assets/images/icon/icon-Severity-v2-Severe.svg',
};

const statusIconMap = {
  [FlakyTestStatusTypes.FLAKY]: '/assets/images/icon/icon-Snow.svg',
  [FlakyTestStatusTypes.BLOCKLISTED]: '/assets/images/icon/icon-Status-Blocklisted.svg',
  [FlakyTestStatusTypes.NONFLAKY]: '/assets/images/icon/icon-Status-Passed.svg',
  [FlakyTestStatusTypes.SKIPPED]: '/assets/images/icon/icon-Status-Skipped.svg',
};

function getNoDataText({
  insightsDataLength,
  isRunComplete,
  loading,
  noTestsExecuted,
  showFilters,
}: any) {
  if (!isRunComplete || loading) {
    return '';
  }

  if (showFilters && !insightsDataLength) {
    return 'No tests found for selected filters!';
  }
  if (!showFilters && noTestsExecuted) {
    return 'No tests were impacted in this job!';
  }
  if (!showFilters && !noTestsExecuted) {
    return 'No tests data found for this job!';
  }
}

function getMessageText({ isRunComplete }: any) {
  if (!isRunComplete) {
    return ['Your impacted tests will appear here once the job is complete.', 'INFO'];
  }

  return [null, null];
}

const Header = ({ hasTestResultsData = true, testsCountArr = [] }) => {
  return (
    <div className="border-b flex text-tas-400 w-full sticky top-0 left-0 z-10">
      <div
        className={`sticky  ${
          hasTestResultsData ? '' : 'flex-1'
        } left-0 flex items-center bg-white`}
      >
        <div
          className={`width-400 text-size-12 p-8 border-r border-gray-125 ${
            hasTestResultsData ? '' : 'flex-1'
          }`}
        >
          Test Cases
        </div>
        <div className="width-110 text-size-12 p-8 border-r border-gray-125">Flake Rate</div>
      </div>
      {hasTestResultsData && testsCountArr?.length ? (
        <div className="flex flex-1 text-size-10 border-gray-125 bg-white">
          {testsCountArr?.map((_el, index) => (
            <div
              key={index}
              className="mw-20 flex-1 h-30 border-r border-gray-125 py-10 text-center"
            >
              {index + 1}
            </div>
          ))}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

const ItemRow = React.memo(({ hasTestResultsData = true, rowData, index }: any) => {
  const flakyRate = roundOff(rowData.flaky_rate, 2);
  const severity = getSeverity(flakyRate);
  const status = rowData.status || '';
  const statusKey = status.toUpperCase() as keyof typeof FlakyTestStatusTypes;
  const stableStatus = FlakyTestStatusLabels[statusKey];

  return (
    <div
      className="flex items-center object-cover border-gray-125 lt-insights-row-container"
      key={rowData.test_id || `${rowData.test_name}_${index}`}
      data-index={rowData.test_id || `${rowData.test_name}_${index}`}
    >
      <div className={`sticky ${hasTestResultsData ? '' : 'w-full'} left-0 bg-white`}>
        <div className="flex items-center">
          <div
            className={`border-b flex items-center text-size-14 width-400 text-left p-8 border-r border-gray-125 h-32 ${
              hasTestResultsData ? '' : 'flex-1'
            }`}
          >
            <div className="w-16 mr-8" data-tip={FlakyTestStatusLabels[statusKey]}>
              {stableStatus ? (
                <img
                  src={statusIconMap[status as FlakyTestStatusTypes]}
                  alt={statusKey}
                  width="16"
                />
              ) : (
                ' - '
              )}
            </div>
            <div data-tip={rowData.test_name} data-multiline={true}>
              <TasLink
                id={rowData.test_id}
                notrim
                path="tests"
                text={<EllipsisText copy dots length={45} text={rowData.test_name} />}
              />
            </div>
          </div>
          <div
            className={`border-b flex items-center text-size-14 width-110 text-left p-8 border-r border-gray-125 h-32`}
          >
            <div className="flex items-center" data-tip={severity}>
              <span className="mr-15">{severity ? flakyRate : '--'}</span>
              <img
                src={severityIconMap[severity || 'none']}
                alt={severity || 'none'}
                className=""
                width="20"
              />
            </div>
          </div>
        </div>
      </div>
      {hasTestResultsData ? (
        <div className="flex flex-1">
          {rowData.test_results?.map((test: any, index: number) => (
            <div
              data-tip={TestResultToLabel[test]}
              key={test + '_' + index}
              className={`mw-20 flex-1`}
            >
              <div
                className={`p-10 flex-1 h-32 border-r border-gray-125 border-b`}
                style={{ background: TestResultToColor[test] }}
              ></div>
            </div>
          ))}
        </div>
      ) : (
        ''
      )}
    </div>
  );
}, areEqual);

export default function FlakyTestsInsights({ job, listStyles, repo, styles, task }: any) {
  const dispatch = useDispatch();
  const state: any = useSelector((state) => state, _.isEqual);

  const {
    flakyBuildDetails: insightsData,
    flakyBuildDetailsResMetaData: insightsMetaData,
    isFlakyBuildDetailsFetching: loading,
  } = state?.buildData;

  const [status, setStatus] = useState(StatusOptions[0].value);
  const [search, setSearch] = useState('');

  const scrollElRef = useRef(null);

  const isRunComplete = !statusFound(job.status);
  const hasFilters = search || status;
  const showFilters = isRunComplete && (insightsData.length || hasFilters);

  const noTestsExecuted = isRunComplete && job?.execution_meta?.total_tests_executed === 0;
  const hasTestResultsData = !!insightsData?.[0]?.test_results;
  const executionMeta = task?.flaky_execution_meta || {};

  const noDataText = getNoDataText({
    insightsDataLength: insightsData?.length,
    isRunComplete,
    loading,
    noTestsExecuted,
    showFilters,
  });

  const [messageText, messageTextStatus] = getMessageText({ isRunComplete });

  const getInputValue = (e: any) => {
    if (loading) {
      cancelAxiosRequest && cancelAxiosRequest();
    }
    if (e.target.value?.length >= search_char_limit || e.target.value?.length === 0) {
      if (e.target.value === search) {
        return;
      }
      setSearch(e.target.value);
    }
  };

  const changeStatus = (value: any) => {
    if (value !== status) {
      cancelAxiosRequest && cancelAxiosRequest();
      setStatus(value || '');
    }
  };

  const getInsightsData = (...args: any) => {
    dispatch(fetchFlakyBuildDetails(repo, job.id, task.task_id, ...args));
  };

  const getInsightsDataWithParams = (cursor: string) => {
    const params = search || status ? { text: search, status: status } : null;
    getInsightsData(cursor, params);
  };

  const getMoreInsightsData = () => {
    getInsightsDataWithParams(insightsMetaData.next_cursor);
  };

  useEffect(() => {
    getInsightsDataWithParams('');

    setTimeout(() => {
      ReactTooltip.rebuild();
    }, 500);
  }, [search, status, job.id, task.task_id]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [insightsData]);

  useEffect(() => {
    return () => {
      dispatch(unmountFlakyBuildDetails());
    };
  }, []);

  return (
    <div className="flex flex-col w-full radius-3 bg-white" style={{ minHeight: styles.minHeight }}>
      {messageText && (
        <div className="p-16 pb-0">
          <div className="h-32 bg-warning text-size-14 px-8 radius-3 w-full flex items-center">
            {messageTextStatus === 'WARN' && (
              <Image className="mr-4" src="/assets/images/icon/icon-Warning-Lined.svg" width="18" />
            )}
            <span className="text-ellipsis text-warning">{messageText}</span>
          </div>
        </div>
      )}

      {!!showFilters && (
        <div className="sticky z-10 bg-white radius-3" style={{ top: styles.top }}>
          <div className="flex p-16 pb-0">
            <div className="" style={{ width: '200px' }}>
              <DebounceInput
                onChange={getInputValue}
                search
                className={`text-size-14 `}
                value={search}
              />
            </div>
            <div className="ml-16" style={{ width: '160px' }}>
              <Dropdown
                onClick={changeStatus}
                options={StatusOptions}
                optionRenderer={(option: any) => (
                  <div
                    className={`flex items-center justify-between text-tas-400 text-size-12 px-8 py-5 cursor-pointer text-ellipsis rounded ${
                      status === option.value ? 'active' : ''
                    }`}
                  >
                    <div>{option.label}</div>
                    <div>
                      {option.countGetter
                        ? option.countGetter(executionMeta)
                        : executionMeta[option.data_key]}
                    </div>
                  </div>
                )}
                selectedOption={status}
                toggleStyles={{
                  height: '32px',
                  background: '#fff',
                }}
                labelKey="label"
                valueKey="value"
              />
            </div>
          </div>
        </div>
      )}

      {(!isRunComplete || loading) && insightsData.length === 0 && (
        <LoaderTable
          styles={{
            gridTemplateRows: '32px 1fr',
            maxHeight: `calc(100vh - ${
              listStyles.maxHeight + (messageText ? 48 : 0) + (showFilters ? 0 : -48)
            }px)`,
            minHeight: listStyles.minHeight,
          }}
        />
      )}

      {noDataText && (
        <div className="bg-white flex-1 h-full pt-16">
          <NoData msg={noDataText} />
        </div>
      )}

      {insightsData.length > 0 && (
        <div className="flex-1 p-16 radius-3">
          <div
            className="radius-3 border designed-scroll lt-scroll scrolling-auto relative"
            ref={scrollElRef}
            style={{
              gridTemplateRows: '32px 1fr',
              maxHeight: `calc(100vh - ${listStyles.maxHeight + (messageText ? 48 : 0)}px)`,
              minHeight: listStyles.minHeight,
            }}
          >
            <Header
              testsCountArr={insightsData[0]?.test_results}
              hasTestResultsData={hasTestResultsData}
            />
            <InfiniteScroll
              getScrollParent={() => scrollElRef.current}
              hasMore={
                insightsMetaData.next_cursor && insightsMetaData.next_cursor !== '' && !loading
                  ? true
                  : false
              }
              loadMore={
                insightsMetaData.next_cursor && insightsMetaData.next_cursor !== '' && !loading
                  ? getMoreInsightsData
                  : () => {}
              }
              initialLoad={false}
              pageStart={0}
              threshold={200}
              useWindow={false}
            >
              {insightsData.map((data: any, index: number) => (
                <ItemRow
                  key={data.test_id || data.test_name + '_' + index}
                  hasTestResultsData={hasTestResultsData}
                  rowData={data}
                  index={index}
                />
              ))}
              {loading && (
                <div className="flex items-center w-full">
                  <div
                    className={`sticky ${
                      hasTestResultsData ? '' : 'flex-1'
                    } left-0 flex items-center bg-white z-10`}
                  >
                    <div className={`${hasTestResultsData ? 'width-440' : 'flex-1'} py-7 px-8`}>
                      <div className="w-4/12">
                        <div className="placeholder-content"></div>
                      </div>
                    </div>
                    <div className="width-110 py-7 px-8">
                      <div className="w-4/12">
                        <div className="placeholder-content"></div>
                      </div>
                    </div>
                    <div className="width-110 py-7 px-8">
                      <div className="w-4/12">
                        <div className="placeholder-content"></div>
                      </div>
                    </div>
                  </div>
                  {hasTestResultsData && (
                    <div className="flex-1 py-7 px-8">
                      <div className="w-4/12">
                        <div className="placeholder-content"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </InfiniteScroll>
          </div>
        </div>
      )}
      <ReactTooltip effect="solid" offset={{ top: -5, left: 0 }} />
    </div>
  );
}
