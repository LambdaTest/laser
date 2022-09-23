import React, { useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import _ from 'underscore';

import { fetchTestsSuites, unmountTestsSuites } from 'redux/actions/testAction';
import { logAmplitude } from 'helpers/genericHelpers';

import Dropdown from 'components/Dropdown';
import Layout from 'components/Layout';
import Loader from 'components/Loader';
import NoData from 'components/Nodata';
import NoTest from 'components/Test/NoTest';
import SuiteList from 'components/TestSuite/SuiteList';
import TasTabs from 'components/TasTabs';
import Text from 'components/Tags/Text';

import FilterAuthorList from 'modules/Builds/components/FilterAuthorList';

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
import ReloadPage from 'components/ReloadPage';
import DebounceInput from 'components/DebounceInput';

const TestSuiteStatusTypes = {
  default: '',
  options: [
    { label: 'All Test Suites', value: '' },
    { label: 'Passed', value: 'passed' },
    { label: 'Failed', value: 'failed' },
    { label: 'Skipped', value: 'skipped' },
    { label: 'Blocklisted', value: 'blocklisted' },
  ],
};

const TestsSuites: NextPage = () => {
  const router = useRouter();
  const { repo, provider, org } = router.query;
  const testData = useSelector((state: any) => state.testData, _.isEqual);
  const {
    isTestsSuitesFetching,
    testsSuites,
    testsSuitesResMetaData,
  }: { testsSuites: any; isTestsSuitesFetching: any; testsSuitesResMetaData: any } = testData;

  const dispatch = useDispatch();
  const getMoreTestsSuites = () => {
    resetPositionOfList();
    setTimeout(() => {
      dispatch(
        fetchTestsSuites(
          repo,
          testsSuitesResMetaData.next_cursor ? testsSuitesResMetaData.next_cursor : '-1',
          params
        )
      );
    }, 300);
  };

  const [currentStatus, setCurrentStatus] = useState(TestSuiteStatusTypes.options[0].value);
  const [currentSearchString, setCurrentSearchString] = useState('');
  const [currentStatusType, setCurrentStatusType] = useState(TestSuiteStatusTypes.options[0]);
  const [currentAuthor, setCurrentAuthor]: any = useState({ label: 'All authors', value: '' });

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
      if (option.value === currentStatus) {
        return;
      }
      cancelAxiosRequest && cancelAxiosRequest();
      dispatch(unmountTestsSuites());
      setCurrentStatus(option.value ? option.value : '');
      setCurrentStatusType(option);
      logAmplitude('tas_filter_test_suite_list', { 'Test suite type': option.label });
    }
  };
  const getInputValue = (e: any) => {
    if (isTestsSuitesFetching) {
      cancelAxiosRequest && cancelAxiosRequest();
    }
    if (e.target.value?.length >= search_char_limit || e.target.value?.length === 0) {
      if (e.target.value === currentSearchString) {
        return;
      }
      dispatch(unmountTestsSuites());
      setCurrentSearchString(e.target.value);
      logAmplitude('tas_search_done_test_suite_list');
    }
  };
  const changeAuthor = (author: any) => {
    if (isTestsSuitesFetching) {
      cancelAxiosRequest && cancelAxiosRequest();
    }
    if (author?.value === currentAuthor?.value) {
      return;
    }
    dispatch(unmountTestsSuites());
    setCurrentAuthor(author);
    logAmplitude('tas_search_author_done_test_suite_list');
  };

  useEffect(() => {
    if (repo) {
      dispatch(fetchTestsSuites(repo, '', params));
    }
    return () => {
      dispatch(unmountTestsSuites());
      InfiniteLoaderRef?.current?.resetLoadMoreRowsCache();
    };
  }, [currentStatus, currentSearchString, currentAuthor, repo]);

  const filtersBarRef = useRef<any>();
  const windowScrollRef = useRef<any>();
  const InfiniteLoaderRef = useRef<any>();

  useEffect(() => {
    if (
      testsSuitesResMetaData &&
      testsSuitesResMetaData.next_cursor == '' &&
      !isTestsSuitesFetching
    ) {
      resetPositionOfList();
    }
  }, [testsSuitesResMetaData.next_cursor, isTestsSuitesFetching]);

  const resetPositionOfList = () => {
    cache.clearAll();
    if (windowScrollRef) {
      windowScrollRef.current.updatePosition();
    }
  };
  const isRowLoaded = ({ index }: any) => {
    return !!testsSuites[index];
  };

  const rowRenderer = ({ index, key, isVisible, parent, style }: any) => {
    return (
      <>
        {testsSuites && testsSuites[index] && testsSuites[index].id && (
          <CellMeasurer cache={cache} columnIndex={0} key={key} rowIndex={index} parent={parent}>
            {() => (
              <div style={style} key={testsSuites[index].id}>
                {!isVisible ? (
                  <Loader loader_for="test_suites" length={1} />
                ) : (
                  <SuiteList
                    git_provider={`${provider}`}
                    key={testsSuites[index] && testsSuites[index].id}
                    org={`${org}`}
                    repo={`${repo}`}
                    suite={testsSuites[index] && testsSuites[index]}
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
    defaultHeight: 63,
    fixedWidth: true,
  });

  return (
    <Layout title={`TAS: ${repo} / Test Suite`}>
      <TasTabs activeTab="test_suite" pagination={['Test Suite']} details_page={false} />
      <div className="p-20 max__center__container test-suites-list-container relative">
        <div className="sticky z-10 bg-gray-60 -mt-20 pt-20" style={{ top: '92px' }}>
          {(testsSuites.length !== 0 || isFilterMode()) && (
            <Text className="mb-15 flex justify-between relative" ref={filtersBarRef}>
              <div className="flex items-center">
                <div style={{ width: '200px' }}>
                  <DebounceInput
                    onChange={getInputValue}
                    search
                    className={`border-none `}
                    amplitude="tas_search_test_suite_list"
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
                  options={TestSuiteStatusTypes.options}
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
          {testsSuites && testsSuites.length > 0 && (
            <div className="bg-white rounded rounded-b-none border-b">
              <div className="flex -mx-0 w-full flex-wrap  py-12 items-center justify-between cursor-pointer text-size-12 font-medium tracking-wide text-tas-400">
                <div className="px-15" style={{ width: '27%' }}>
                  Test Suite Name
                </div>
                <div className="pr-15" style={{ width: '10%' }}>
                  # of Tests
                </div>
                <div className="pr-15" style={{ width: '10%' }}>
                  Ran
                </div>
                <div className="pr-15" style={{ width: '12%' }}>
                  Avg Duration
                </div>
                <div className="pr-15" style={{ width: '13%' }}>
                  Status History
                </div>
                <div className="pr-15" style={{ width: '12%' }}>
                  Latest Job
                </div>
                <div className="pr-15" style={{ width: '15%' }}>
                  Executed
                </div>
              </div>
            </div>
          )}
        </div>
        {isTestsSuitesFetching && testsSuites.length == 0 && (
          <Loader loader_for="test_suites" length={per_page_limit} />
        )}
        {testsSuites && testsSuites.length === 0 && !isTestsSuitesFetching && isFilterMode() && (
          <div className="mt-120">
            <NoData msg="No Tests Suites found!" />
          </div>
        )}
        {testsSuites && testsSuites.length === 0 && !isTestsSuitesFetching && !isFilterMode() && (
          <>
            <div className="flex justify-end mb-10">
              <div className="">
                <ReloadPage />
              </div>
            </div>
            <NoTest repo={`${repo}`} msg="No Tests Suites found in this project!" />
          </>
        )}
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          // @ts-ignore
          loadMoreRows={getMoreTestsSuites}
          rowCount={
            testsSuitesResMetaData.next_cursor ? testsSuites.length + 1 : testsSuites.length
          }
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
                        rowCount={
                          testsSuitesResMetaData.next_cursor
                            ? testsSuites.length + 1
                            : testsSuites.length
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
        {isTestsSuitesFetching && testsSuites.length !== 0 && (
          <Loader loader_for="test_suites" length={per_page_limit} />
        )}
      </div>
    </Layout>
  );
};

export default TestsSuites;
