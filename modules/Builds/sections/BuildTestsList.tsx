import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { cancelAxiosRequest } from 'redux/httpclient';

import _ from 'underscore';
import {
  AutoSizer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
  WindowScroller,
} from 'react-virtualized';

import { fetchBuildCommitTests, resetBuildCommitTests } from 'redux/actions/buildAction';

import { per_page_limit, search_char_limit, statusFound } from 'redux/helper';
import { TaskStatusTypes } from 'constants/StatusTypes';

import Loader from 'components/Loader';
import NoData from 'components/Nodata';
import Dropdown from 'components/Dropdown';

import BuildTestsListRow from '../components/BuildTestsListRow';
import Info from 'components/Info';
import DebounceInput from 'components/DebounceInput';

const TestStatusOptions = [
  { label: 'All Tests', value: '', data_key: 'total_tests_executed' },
  { label: 'Passed', value: 'passed', data_key: 'tests_passed' },
  { label: 'Failed', value: 'failed', data_key: 'tests_failed' },
  { label: 'Skipped', value: 'skipped', data_key: 'tests_skipped' },
  { label: 'Blocklisted', value: 'blocklisted', data_key: 'tests_blocklisted' },
  { label: 'Quarantined', value: 'quarantined', data_key: 'tests_quarantined' },
  // { label: 'Aborted', value: 'aborted' },
];

export default function BuildTestsList({
  buildAndTaskFetching,
  currentBuild,
  currentBuildTask,
  isCurrentBuildFetching,
  styles,
  timeSaved,
}: any) {
  const router = useRouter();
  const { buildid, repo, provider, org } = router.query;

  const dispatch = useDispatch();
  const state: any = useSelector((state) => state, _.isEqual);
  const { buildCommitTests, isBuildCommitTestsFetching } = state?.buildData;
  const { impacted_tests: tests, response_metadata: testsMetadata } = buildCommitTests;

  const testsTotalTime = timeSaved?.time_taken_impacted_tests_ms;

  const [currentStatus, setCurrentStatus] = useState(
    currentBuildTask?.status === TaskStatusTypes.FAILED
      ? TaskStatusTypes.FAILED
      : TestStatusOptions[0].value
  );
  const [currentSearch, setCurrentSearch] = useState('');

  const wrapperRef = useRef<any>();
  const windowScrollRef = useRef<any>();
  const InfiniteLoaderRef = useRef<any>();

  const cache = new CellMeasurerCache({
    defaultHeight: 30,
    fixedWidth: true,
  });

  const isRunComplete = !statusFound((currentBuildTask || currentBuild)?.status);
  const isFilterMode = currentSearch || currentStatus;
  const showFilters = !buildAndTaskFetching && (tests.length || isFilterMode);
  const executionMeta = currentBuildTask?.execution_meta || {};

  const resetPositionOfList = () => {
    cache.clearAll();
    if (windowScrollRef) {
      windowScrollRef.current?.updatePosition();
    }
  };

  const isRowLoaded = ({ index }: any) => {
    return !!tests[index];
  };

  const changeStatus = (value: any) => {
    if (value !== currentStatus) {
      cancelAxiosRequest && cancelAxiosRequest();
      setCurrentStatus(value || '');
    }
  };

  const changeSearch = (e: any) => {
    if (isBuildCommitTestsFetching) {
      cancelAxiosRequest && cancelAxiosRequest();
    }
    const text = e.target.value;
    if (text !== currentSearch && (text?.length >= search_char_limit || text?.length === 0)) {
      if (text === currentSearch) {
        return;
      }
      setCurrentSearch(text);
    }
  };

  const getBuildCommitTests = (nextPage: boolean) => {
    !nextPage && dispatch(resetBuildCommitTests());
    resetPositionOfList();

    setTimeout(() => {
      dispatch(
        fetchBuildCommitTests({
          buildId: buildid,
          commitId: currentBuild.commit_id,
          next: nextPage ? testsMetadata?.next_cursor : '',
          repo,
          status: currentStatus,
          taskId: currentBuildTask?.task_id,
          text: currentSearch,
        })
      );
    }, 300);
  };

  useEffect(() => {
    if (testsMetadata?.next_cursor == '' && !isBuildCommitTestsFetching) {
      resetPositionOfList();
    }
  }, [testsMetadata?.next_cursor, isBuildCommitTestsFetching]);

  useEffect(() => {
    if (currentBuild?.commit_id && repo) {
      getBuildCommitTests(false);
    }
    return () => {
      InfiniteLoaderRef?.current?.resetLoadMoreRowsCache();
    };
  }, [repo, currentStatus, currentSearch, currentBuild?.commit_id, currentBuildTask?.task_id]);

  if (!isRunComplete && tests?.length === 0) {
    return (
      <>
      <div className="h-32 bg-info-yellow text-size-14 px-16 radius-3 w-full flex items-center text-yellow-800">
        <span className="text-ellipsis opacity-50">Your impacted tests will appear here once the job is complete.</span>
      </div>
      <Loader loader_for="build_tests" length={per_page_limit} />
      </>
    );
  }

  return (
    <div className="flex flex-col" style={{ minHeight: styles.minHeight }}>
      {showFilters && (
        <div className="sticky z-10 bg-white" style={{ top: styles.top }} ref={wrapperRef}>
          <div className="flex p-16">
            <div className="" style={{ width: '200px' }}>
              <DebounceInput
                onChange={changeSearch}
                search
                className={`text-size-14`}
                value={currentSearch}
              />
            </div>
            <div className="ml-16" style={{ width: '160px' }}>
              <Dropdown
                forcePosition
                getPopupContainer={() => wrapperRef.current}
                onClick={changeStatus}
                optionRenderer={(option: any) => (
                  <div
                    className={`flex items-center justify-between text-tas-400 text-size-12 px-8 py-5 cursor-pointer text-ellipsis rounded ${
                      currentStatus === option.value ? 'active' : ''
                    }`}
                  >
                    <div>{option.label}</div>
                    <div>{executionMeta[option.data_key]}</div>
                  </div>
                )}
                options={TestStatusOptions}
                selectedOption={currentStatus}
                toggleStyles={{
                  height: '32px',
                  background: '#fff',
                }}
                labelKey="label"
                showClear
                valueKey="value"
              />
            </div>
          </div>
          {tests?.length > 0 && (
            <div className="w-full flex justify-between items-center bg-white pb-10 rounded-md rounded-b-none border-b text-size-12 text-tas-400 font-medium tests__section__row">
              <div className="px-15" style={{ width: '29%' }}>
                <span className="w-full leading-none inline-flex items-center">Test Details</span>
              </div>
              <div className="pr-15" style={{ width: '14%' }}>
                <span className="w-full leading-none inline-flex items-center">
                  <span className="inline-flex items-center">
                    Transition <Info type="transition" className="ml-3" />
                  </span>
                </span>
              </div>
              <div className="pr-15" style={{ width: '14%' }}>
                <span className="w-full leading-none inline-flex items-center">Duration</span>
              </div>
              <div className="pr-15" style={{ width: '14%' }}>
                <span className="w-full leading-none inline-flex items-center">Time Consumed</span>
              </div>
              <div className="pr-15" style={{ width: '14%' }}>
                <span className="w-full leading-none inline-flex items-center">Contributor</span>
              </div>
            </div>
          )}
        </div>
      )}

      {!buildAndTaskFetching &&
      !isBuildCommitTestsFetching &&
      tests?.length === 0 &&
      isFilterMode ? (
        <div className="bg-white flex-1 h-full">
          <NoData msg="No tests found for selected filters!" />
        </div>
      ) : (
        ''
      )}

      {!buildAndTaskFetching &&
      !isBuildCommitTestsFetching &&
      tests?.length === 0 &&
      !isFilterMode &&
      isRunComplete ? (
        <div className="flex items-center justify-center flex-col bg-white flex-1 h-full">
          <NoData msg="No tests were impacted in this commit!" />
        </div>
      ) : (
        ''
      )}

      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        // @ts-ignore
        loadMoreRows={() => getBuildCommitTests(true)}
        rowCount={testsMetadata?.next_cursor ? tests.length + 1 : tests.length}
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
                      rowCount={testsMetadata?.next_cursor ? tests.length + 1 : tests.length}
                      rowHeight={65}
                      rowRenderer={(props) => {
                        return (
                          <BuildTestsListRow
                            cache={cache}
                            org={org}
                            provider={provider}
                            repo={repo}
                            tests={tests}
                            totalTime={testsTotalTime}
                            {...props}
                          />
                        );
                      }}
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
      {(buildAndTaskFetching || isBuildCommitTestsFetching) && currentBuild?.id && (
        <div>
          <Loader loader_for="build_tests" length={per_page_limit} />
        </div>
      )}
      {!currentBuild?.id && !isCurrentBuildFetching && (
        <div className="flex items-center justify-center flex-col bg-white flex-1 h-full">
          <NoData msg="No data found!" />
        </div>
      )}
    </div>
  );
}
