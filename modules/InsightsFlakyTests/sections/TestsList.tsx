import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import _ from 'underscore';
import {
  AutoSizer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
  WindowScroller,
} from 'react-virtualized';

import { per_page_limit } from 'redux/helper';

import { fetchTestsByDate } from 'redux/actions/insightsFlakyTests';

import { TRange } from 'components/PeriodRangeFilter';
import NoData from 'components/Nodata';

import LoadingTable from '../components/LoadingTable';
import TestsListRow from '../components/TestsListRow';

interface TProps {
  periodRange: TRange;
}

function TestsList({ periodRange }: TProps) {
  const router = useRouter();
  const { repo, provider, org } = router.query;

  const dispatch = useDispatch();
  const insightsState = useSelector((state: any) => state?.insightsFlakyTestsData);

  const { listData, listDataLoading, listMeta } = insightsState;

  const windowScrollRef = useRef<any>();
  const InfiniteLoaderRef = useRef<any>();

  const cache = new CellMeasurerCache({
    defaultHeight: 30,
    fixedWidth: true,
  });

  const resetPositionOfList = () => {
    cache.clearAll();
    if (windowScrollRef) {
      windowScrollRef.current?.updatePosition();
    }
  };

  const isRowLoaded = ({ index }: any) => {
    return !!listData[index];
  };

  const getFlakyTests = (next = '') => {
    dispatch(
      fetchTestsByDate({
        end_date: periodRange?.[1],
        org,
        provider,
        repo,
        start_date: periodRange?.[0],
        next: next,
      })
    );
  };

  useEffect(() => {
    if (listMeta == '' && !listDataLoading) {
      resetPositionOfList();
    }
  }, [listMeta, listDataLoading]);

  useEffect(() => {
    if (repo) {
      getFlakyTests();
    }
    return () => {
      InfiniteLoaderRef?.current?.resetLoadMoreRowsCache();
    };
  }, [periodRange, repo]);

  if (!listDataLoading && listData.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col bg-white mt-8">
        <NoData msg="No flaky tests found!" />
      </div>
    );
  }

  if (listDataLoading && listData.length === 0) {
    return (
      <div>
        <LoadingTable rowCount={per_page_limit} />
      </div>
    );
  }

  return (
    <>
      <div className="sticky z-10 bg-gray-60 pt-8" style={{ top: 92 }}>
        <div className="w-full flex justify-between items-center bg-white border-b text-size-10 text-tas-400 font-medium tests__section__row h-32">
          <div className="px-16" style={{ width: '40%' }}>
            <span className="w-full leading-none inline-flex items-center">FLAKY TESTS</span>
          </div>
          <div className="pr-16" style={{ width: '16%' }}>
            <span className="w-full leading-none inline-flex items-center">FIRST FLAKED</span>
          </div>
          <div className="pr-16" style={{ width: '16%' }}>
            <span className="w-full leading-none inline-flex items-center">LAST FLAKED</span>
          </div>
          <div className="pr-16" style={{ width: '14%' }}>
            <span className="w-full leading-none inline-flex items-center">OCCURENCIES</span>
          </div>
          <div className="pr-16" style={{ width: '14%' }}>
            <span className="w-full leading-none inline-flex items-center">FLAKE RATE</span>
          </div>
        </div>
      </div>
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        // @ts-ignore
        loadMoreRows={() => getFlakyTests(listMeta)}
        rowCount={listMeta ? listData.length + 1 : listData.length}
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
                      rowCount={listMeta ? listData.length + 1 : listData.length}
                      rowHeight={65}
                      rowRenderer={(props) => {
                        return (
                          <TestsListRow
                            cache={cache}
                            org={org}
                            provider={provider}
                            repo={repo}
                            tests={listData}
                            // totalTime={testsTotalTime}
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
    </>
  );
}

export default TestsList;
