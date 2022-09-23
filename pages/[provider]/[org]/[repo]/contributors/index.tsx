import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { cancelAxiosRequest } from 'redux/httpclient';

import { fetchContributors, unmountContributors } from 'redux/actions/contributorAction';
import { logAmplitude } from 'helpers/genericHelpers';

import BuildLink from 'components/Build/Link';
import Col from 'components/Tags/Col';
import InsightsLeftMenu from 'components/InsightsLeftMenu';
import Layout from 'components/Layout';
import Loader from 'components/Loader';
import NoData from 'components/Nodata';
import NoTest from 'components/Test/NoTest';
import Row from 'components/Tags/Row';
import StackedHrV2, { StackedHrType } from 'Graphs/StackedHrV2';
import TasTabs from 'components/TasTabs';
import Text from 'components/Tags/Text';
import TimeAgo from 'components/TimeAgo';
import Tooltip from 'components/Tooltip';
import DebounceInput from 'components/DebounceInput';

const Contributors: NextPage = () => {
  const router = useRouter();
  const { repo } = router.query;
  const state = useSelector((state) => state);
  const { contributorData }: any = state;
  const {
    contributors,
    isContributorsFetching,
  }: { contributors: any; isContributorsFetching: any } = contributorData;
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState('');

  const getInputValue = (e: any) => {
    const { value } = e.target;
    if (isContributorsFetching) {
        cancelAxiosRequest && cancelAxiosRequest();
    }
    if (value === searchText) {
        return;
      }

      fetchData(value);
      setSearchText(value);
      logAmplitude('tas_search_done_insight_contributors');
  };

  const fetchData = (author = '') => {
    if (repo) {
      dispatch(fetchContributors(repo, '', { author }));
    }
  };

  useEffect(() => {
    if (repo) {
      fetchData();
    }
    return () => {
      dispatch(unmountContributors());
    };
  }, [repo]);

  return (
    <Layout title={`TAS: ${repo} / Contributors`}>
      <TasTabs
        activeTab="analytics"
        pagination={['Insights', 'Contributors']}
        details_page={false}
      />
      <div className="p-20 max__center__container">
        <Row>
          <Col size="2">
            <InsightsLeftMenu />
          </Col>
          <Col size="10">
            <div className="">
              {contributors && (searchText || contributors.length > 0) && (
                <div className="mb-15 width-200">
                  <DebounceInput
                    onChange={getInputValue}
                    search
                    className={`border-none `}
                    amplitude="tas_search_insight_contributors"
                    value={searchText}
                  />
                </div>
              )}

              {!searchText &&
                contributors &&
                contributors.length === 0 &&
                !isContributorsFetching && <NoTest msg="No contributors yet." repo={`${repo}`} />}
              {searchText &&
                contributors &&
                contributors.length === 0 &&
                !isContributorsFetching && <NoData msg="No results found." />}

              {contributors && contributors.length > 0 && (
                <div className="bg-white rounded rounded-b-none border-b">
                  <div className="flex -mx-0 w-full flex-wrap  py-12 items-center justify-between text-size-12 font-medium  text-tas-400">
                    <div className="w-3/12 px-15 ">Contributor</div>
                    <div className="w-2/12 px-15">
                      <div>Tests Added</div>
                    </div>
                    <div className="w-undefined/12 px-15">
                      <div className="width-100">Status History</div>
                    </div>
                    <div className="w-2/12 px-15">
                      <div className="width-100">Latest Job</div>
                    </div>
                    <div className="px-10 w-3/12">
                      <div>Contributor Since</div>
                    </div>
                  </div>
                </div>
              )}
              {isContributorsFetching && contributors.length == 0 && <Loader />}
              {contributors &&
                contributors.length > 0 &&
                contributors.map((contributor: any) => (
                  <div className="border-b" key={contributor?.author?.Name}>
                    <div className="flex bg-white py-12 items-center list-hover justify-between">
                      <div className="px-15 w-3/12 inline-flex items-center overflow-hidden">
                        <img src="/assets/images/user-gray.svg" alt="" className="mr-10 h-16" />{' '}
                        {contributor?.author?.Name ? (
                          <Tooltip
                            content={contributor?.author?.Name}
                            placement="top"
                            offset={[0, 5]}
                          >
                            <span className="block text-ellipsis">{contributor?.author?.Name}</span>
                          </Tooltip>
                        ) : (
                          '-'
                        )}
                      </div>
                      <div className="px-15  w-2/12  inline-flex items-center">
                        <Text className="inline-flex items-center">
                          <Text size="span" className="flex mr-7">
                            {contributor?.execution_meta?.total_tests_executed ?? '-'}
                          </Text>
                        </Text>
                      </div>
                      <div className="px-15  inline-flex items-center">
                        {contributor?.execution_meta?.total_tests_executed === 0 ? (
                          <div
                            className="inline-flex overflow-hidden rounded-full"
                            style={{ width: '100px', height: '6px' }}
                          >
                            <div className="w-full bg-gray-150"></div>
                          </div>
                        ) : (
                          <div className="inline-flex width-100">
                            <StackedHrV2
                              height={6}
                              width={100}
                              data={[
                                {
                                  count: contributor.execution_meta?.tests_passed,
                                  type: 'passed',
                                },
                                {
                                  count: contributor.execution_meta?.tests_failed,
                                  type: 'failed',
                                },
                                {
                                  count: contributor.execution_meta?.tests_skipped,
                                  type: 'skipped',
                                },
                                {
                                  count: contributor.execution_meta?.tests_blocklisted,
                                  type: 'blocklisted',
                                },
                                {
                                  count: contributor.execution_meta?.tests_quarantined,
                                  type: 'quarantined',
                                },
                              ]}
                              type={StackedHrType.TEST}
                              tooltipProps={{
                                label: 'Test Runs',
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="px-15  w-2/12 pl-20  inline-flex items-center">
                        <Text className="inline-flex items-center">
                          <Text size="span" className="flex">
                            <BuildLink
                              id={contributor.build_id}
                              link
                              type={contributor.build_tag}
                            />
                          </Text>
                        </Text>
                      </div>
                      <div className="px-15  w-3/12  inline-flex items-center">
                        <div className="flex flex-col">
                          <span className="flex">
                            <span className="contributor_timeago">
                              <TimeAgo date={contributor.author.Date} />
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Contributors;
