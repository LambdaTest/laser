import React, { useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import _ from 'underscore';

import { fetchCommits, unmountCommits } from 'redux/actions/commitAction';
import { logAmplitude } from 'helpers/genericHelpers';

import CommitList from 'components/CommitList';
import Dropdown from 'components/Dropdown';
import Layout from 'components/Layout';
import Loader from 'components/Loader';
import NoData from 'components/Nodata';
import NoTest from 'components/Test/NoTest';
import TasTabs from 'components/TasTabs';
import Text from 'components/Tags/Text';

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

import FilterAuthorList from 'modules/Builds/components/FilterAuthorList';

const CommitStatusTypes = {
  default: '',
  options: [
    { label: 'All Commits', value: '' },
    { label: 'Passed', value: 'passed' },
    { label: 'Failed', value: 'failed' },
    { label: 'Skipped', value: 'skipped' },
    { label: 'TAS Error', value: 'error' },
  ],
};

const Commits: NextPage = () => {
  const router = useRouter();
  const { repo, provider, org } = router.query;
  const commitData = useSelector((state: any) => state.commitData, _.isEqual);
  // const [openCard, setOpenCard] = useState(false);
  // const [currentCommitId, setCurrentCommitId] = useState("");
  // const {commitData}:any = state;
  const {
    commits,
    isCommitsFetching,
    resMetaData,
  }: { commits: any; isCommitsFetching: any; resMetaData: any } = commitData;

  const dispatch = useDispatch();
  const getMoreCommits = () => {
    resetPositionOfList();
    setTimeout(() => {
      dispatch(fetchCommits(repo, resMetaData.next_cursor ? resMetaData.next_cursor : '-1', params));
    }, 300);
  };

  const [currentStatus, setCurrentStatus] = useState(CommitStatusTypes.options[0].value);
  const [currentSearchString, setCurrentSearchString] = useState('');
  const [currentStatusType, setCurrentStatusType] = useState(CommitStatusTypes.options[0]);
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
      dispatch(unmountCommits());
      setCurrentStatus(option.value ? option.value : '');
      setCurrentStatusType(option);
      logAmplitude('tas_filter_commit_list', { 'Commit type': option.label });
    }
  };
  const getInputValue = (e: any) => {
    if(isCommitsFetching) {
      cancelAxiosRequest && cancelAxiosRequest();
    }
    if ((e.target.value?.length >= search_char_limit || e.target.value?.length === 0)) {
      if(e.target.value === currentSearchString) {
        return;
      }
      dispatch(unmountCommits());
      setCurrentSearchString(e.target.value);
      logAmplitude('tas_search_done_commit_list');
    }
  };
  const changeAuthor = (author: any) => {
    if (isCommitsFetching) {
      cancelAxiosRequest && cancelAxiosRequest();
    }
    if (author?.value === currentAuthor?.value) {
      return;
    }
    dispatch(unmountCommits());
    setCurrentAuthor(author);
    logAmplitude('tas_search_author_done_commit_list');
  };

  useEffect(() => {
    if (repo) {
      dispatch(fetchCommits(repo, '', params));
    }
    return () => {
      dispatch(unmountCommits());
      InfiniteLoaderRef?.current?.resetLoadMoreRowsCache();
    };
  }, [currentStatus, currentSearchString, currentAuthor, repo]);

  const filtersBarRef = useRef<any>();
  const windowScrollRef = useRef<any>()
  const InfiniteLoaderRef = useRef<any>();

  useEffect(() => {
    if(resMetaData && resMetaData.next_cursor == '' && !isCommitsFetching) {
        resetPositionOfList();
    }
  }, [resMetaData.next_cursor, isCommitsFetching])

  const resetPositionOfList = () => {
    cache.clearAll();
    if(windowScrollRef) {windowScrollRef.current.updatePosition();}
  }
  const isRowLoaded = ({ index }: any) => {
    return !!commits[index];
  };

  const rowRenderer = ({ index, key, isVisible, parent, style }: any) => {
    return (
      <>
        {commits && commits[index] && commits[index].commit_id && (
          <CellMeasurer cache={cache} columnIndex={0} key={key} rowIndex={index} parent={parent}>
            {() => (
               <div style={style} key={commits[index].commit_id}>
                {!isVisible ? <Loader loader_for="commits" length={1} /> :
                    <CommitList
                      repo={`${repo}`}
                      git_provider={`${provider}`}
                      org={`${org}`}
                      commit={commits[index] && commits[index]}
                      key={commits[index] && commits[index].commit_id}
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
    defaultHeight: 63,
    fixedWidth: true,
  });

  return (
    <Layout title={`TAS: ${repo} / Commits`}>
      <TasTabs activeTab="commits" details_page={false} pagination={['Commits']} />
      <div className="p-20 max__center__container commits-list-container relative">
        <div className="sticky z-10 bg-gray-60 -mt-20 pt-20" style={{top: '92px'}}>
        {(commits.length !== 0 || isFilterMode()) && (
          <Text className="mb-15 flex justify-between relative" ref={filtersBarRef}>
            <div className="flex items-center">
              <div style={{ width: '200px' }}>
                <DebounceInput
                    onChange={getInputValue}
                    search
                    className={`border-none `}
                    amplitude="tas_search_commit_list"
                    value={params.text}
                  />
              </div>
            </div>
            <div className='flex items-center'>
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
                  options={CommitStatusTypes.options}
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
        {commits && commits.length > 0 && (
          <div className="bg-white rounded rounded-b-none border-b">
            <div className="flex -mx-0 w-full  py-12 items-center justify-between text-size-12 font-medium text-tas-400">
              <div className="px-15" style={{width: "37%"}}>Commit Details</div>
              <div className="pr-15" style={{width: "12%"}}>Tests added</div>
              <div className="pr-15" style={{width: "15%"}}>Tests Executed</div>
              <div className="pr-15" style={{width: "18%"}}>Latest Job</div>
              <div className="pr-15" style={{width: "18%"}}>Contributor</div>
            </div>
          </div>
        )}
        </div>
        {commits && commits.length === 0 && !isCommitsFetching && isFilterMode() && (
          <div className="mt-120"><NoData msg="No commits found!" /></div>
        )}
        {commits && commits.length === 0 && !isCommitsFetching && !isFilterMode() && (
          <NoTest msg="No commits yet." repo={`${repo}`} />
        )}
        {isCommitsFetching && commits.length == 0 && <Loader  loader_for="commits" length={per_page_limit} />}
        <InfiniteLoader
            isRowLoaded={isRowLoaded}
            // @ts-ignore
            loadMoreRows={getMoreCommits}
            rowCount={
            resMetaData.next_cursor
                ? commits.length + 1
                : commits.length
            }
            minimumBatchSize={per_page_limit}
            threshold={per_page_limit+per_page_limit/2}
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
                            rowCount={resMetaData.next_cursor
                            ? commits.length + 1
                            : commits.length}
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
        {
          isCommitsFetching && commits.length !== 0 && <Loader loader_for="commits" length={per_page_limit} />
        }
      </div>
    </Layout>
  );
};

export default Commits;
