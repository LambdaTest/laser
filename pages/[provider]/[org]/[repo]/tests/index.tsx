import React, { useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import _ from 'underscore';

import { logAmplitude } from 'helpers/genericHelpers';
import { fetchTests, unmountTests } from 'redux/actions/testAction';

import Dropdown from 'components/Dropdown';
import Layout from 'components/Layout';
import Loader from 'components/Loader';
import NoData from 'components/Nodata';
import NoTest from 'components/Test/NoTest';
import TasTabs from 'components/TasTabs';
import TestList from 'components/Test/TestList';
import Text from 'components/Tags/Text';

import FilterAuthorList from 'modules/Builds/components/FilterAuthorList';

import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
  WindowScroller
} from 'react-virtualized';
import { per_page_limit, search_char_limit } from 'redux/helper'
import { cancelAxiosRequest } from 'redux/httpclient';
import ReloadPage from 'components/ReloadPage';
import DebounceInput from 'components/DebounceInput';
import Info from 'components/Info';

const TestStatusTypes = {
  default: '',
  options: [
    { label: 'All Tests', value: '' },
    { label: 'Passed', value: 'passed' },
    { label: 'Failed', value: 'failed' },
    { label: 'Skipped', value: 'skipped' },
    { label: 'Blocklisted', value: 'blocklisted' },
    { label: 'Quarantined', value: 'quarantined' },
  ],
};

const Tests: NextPage = () => {
  const router = useRouter();
  const { repo, provider, org } = router.query;
  const testData = useSelector((state: any) => state.testData, _.isEqual);
  const {
    tests,
    isTestsFetching,
    resMetaData,
  }: { tests: any; isTestsFetching: any; resMetaData: any } = testData;

  const dispatch = useDispatch();
  const getMoreTests = () => {
    resetPositionOfList();
    setTimeout(() => {
      dispatch(fetchTests(repo, resMetaData.next_cursor ? resMetaData.next_cursor : '-1', params));
    }, 300);
  };

  const [currentStatus, setCurrentStatus] = useState(TestStatusTypes.options[0].value);
  const [currentSearchString, setCurrentSearchString] = useState('');
  const [currentStatusType, setCurrentStatusType] = useState({ label: 'All Tests', value: '' });
  const [currentAuthor, setCurrentAuthor]: any = useState(TestStatusTypes.options[0]);

  let params = {
    text: currentSearchString,
    status: currentStatus,
    author: currentAuthor?.value || undefined,
  };

  const isFilterMode = () => {
    // @ts-ignore
    return Object.keys(params).some((k) => params[k] !== '');
  };

  const changeStatus = (option: any) => {
    if (option) {
      if(option.value === currentStatus) {
        return;
      }
      cancelAxiosRequest && cancelAxiosRequest();
      dispatch(unmountTests());
      setCurrentStatus(option.value ? option.value : '');
      setCurrentStatusType(option);
      logAmplitude('tas_filter_test_list', { 'Test type': option.label });
    }
  };
  const getInputValue = (e: any) => {
    if(isTestsFetching) {
      cancelAxiosRequest && cancelAxiosRequest();
    }
    if ((e.target.value?.length >= search_char_limit || e.target.value?.length === 0)) {
      if(e.target.value === currentSearchString) {
        return;
      }
      dispatch(unmountTests());
      setCurrentSearchString(e.target.value);
      logAmplitude('tas_search_done_test_list');
    }
  };
  const changeAuthor = (author: any) => {
    if (isTestsFetching) {
      cancelAxiosRequest && cancelAxiosRequest();
    }
    if (author?.value === currentAuthor?.value) {
      return;
    }
    dispatch(unmountTests());
    setCurrentAuthor(author);
    logAmplitude('tas_search_author_done_test_list');
  };

  useEffect(() => {
    if (repo) {
      dispatch(fetchTests(repo, '', params));
    }
    return () => {
      dispatch(unmountTests());
      InfiniteLoaderRef?.current?.resetLoadMoreRowsCache();
    };
  }, [currentStatus, currentSearchString, currentAuthor, repo]);


  const filtersBarRef = useRef<any>();
  const windowScrollRef = useRef<any>()
  const InfiniteLoaderRef = useRef<any>();

  useEffect(() => {
    if(resMetaData && resMetaData.next_cursor == '' && !isTestsFetching) {
        resetPositionOfList();
    }
  }, [resMetaData.next_cursor, isTestsFetching])

  const resetPositionOfList = () => {
    cache.clearAll();
    if(windowScrollRef) {windowScrollRef.current.updatePosition();}
  }
  const isRowLoaded = ({ index }: any) => {
    return !!tests[index];
  };

  const rowRenderer = ({ index, key, isVisible, parent, style }: any) => {
    return (
      <>
        {tests && tests[index] && tests[index].id && (
          <CellMeasurer cache={cache} columnIndex={0} key={key} rowIndex={index} parent={parent}>
            {() => (
               <div style={style} key={tests[index].id}>
                {!isVisible ? <Loader loader_for="tests" length={1} /> :
                    <TestList
                      git_provider={`${provider}`}
                      key={tests[index] && tests[index].id}
                      org={`${org}`}
                      repo={`${repo}`}
                      test={tests[index] && tests[index]}
                    />
                }
              </div>
            )}
          </CellMeasurer>
        )}
      </>
    );
  };


  const cache = new CellMeasurerCache({
    defaultHeight: 70,
    fixedWidth: true,
  });


  const isFilterModeActive = isFilterMode();
  const noDataFound = tests && tests.length === 0 && !isTestsFetching && isFilterModeActive;

  return (
    <Layout title={`TAS: ${repo} / Tests`}>
      <TasTabs activeTab="tests" pagination={['Tests']} details_page={false} />
      <div className="p-20 max__center__container test-list-container relative">
        <div className="sticky z-10 bg-gray-60 -mt-20 pt-20" style={{ top: '92px' }}>
          {(tests.length !== 0 || isFilterModeActive) && (
            <Text className="mb-15 flex justify-between relative" ref={filtersBarRef}>
              <div className="flex items-center">
                <div style={{ width: '200px' }}>
                  <DebounceInput
                    onChange={getInputValue}
                    search
                    className={`border-none `}
                    amplitude="tas_search_test_list"
                    value={params.text}
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
                  options={TestStatusTypes.options}
                  selectedOption={currentStatusType}
                  toggleStyles={{
                    height: '32px',
                    background: '#fff',
                    width: '120px',
                  }}
                  labelKey="label"
                  valueKey="value"
                />
                <div className="ml-8">
                  <ReloadPage />
                </div>
              </div>
            </Text>
          )}
          {tests && tests.length > 0 && (
            <div className="bg-white rounded rounded-b-none border-b">
              <div className="mr-5">
                <div className="flex -mx-0 w-full flex-wrap  py-12 items-center justify-between text-size-12 font-medium text-tas-400">
                  <div className="px-15 " style={{ width: '30%' }}>
                    Test Details
                  </div>
                  <div className="pr-15" style={{ width: '11%' }}>
                    Executed{' '}
                  </div>
                  <div className="pr-15" style={{ width: '11%' }}>
                    Avg Duration{' '}
                  </div>
                  <div className="pr-15" style={{ width: '11%' }}>
                    Status History{' '}
                  </div>
                  <div className="pr-15" style={{ width: '12%' }}>
                    Latest Job{' '}
                  </div>
                  <div className="pr-15" style={{ width: '10%' }}>
                    {' '}
                    <span className="inline-flex items-center">
                      Transition <Info type="transition" className="ml-3" />
                    </span>{' '}
                  </div>
                  <div className="pr-15" style={{ width: '15%' }}>
                    Contributor
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {noDataFound && (
          <div className="mt-120">
            <NoData msg="No tests found!" />
          </div>
        )}
        {tests && tests.length === 0 && !isTestsFetching && !isFilterModeActive && (
          <>
            <div className="flex justify-end mb-10">
              <ReloadPage />
            </div>
            <NoTest repo={`${repo}`} msg="Seems like no tests have been run yet" />
          </>
        )}
        {isTestsFetching && tests.length == 0 && (
          <Loader loader_for="tests" length={per_page_limit} />
        )}
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          // @ts-ignore
          loadMoreRows={getMoreTests}
          rowCount={resMetaData.next_cursor ? tests.length + 1 : tests.length}
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
                        rowCount={resMetaData.next_cursor ? tests.length + 1 : tests.length}
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
        {isTestsFetching && tests.length !== 0 && (
          <Loader loader_for="tests" length={per_page_limit} />
        )}
      </div>
    </Layout>
  );
};

export default Tests;
