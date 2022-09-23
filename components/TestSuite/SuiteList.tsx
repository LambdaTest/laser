import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import _ from 'underscore';

import { fetchSuiteDetails } from '../../redux/actions/testAction';
import { getText, lastDates } from '../../helpers/genericHelpers';

const Duration = dynamic(() => import('../Duration'));
const TasLink = dynamic(() => import('../TasLink'));
const VerticalLine = dynamic(() => import('../../Graphs/VerticalLine'));

import BuildLink from '../Build/Link';
import EllipsisText from '../EllipsisText';
import Image from '../Tags/Image';
import Row from '../Tags/Row';
import StackedHrV2, { StackedHrType } from 'Graphs/StackedHrV2';
import Text from '../Tags/Text';
import TimeAgo from '../TimeAgo';

const SuiteList = ({ repo, suite, git_provider, org }: any) => {
  const testData = useSelector((state: any) => state.testData, _.isEqual);
  const [openCard, setOpenCard] = useState(false);
  const [currentSuiteId, setCurrentSuiteId] = useState('');
  const {
    suiteDetails,
    isSuiteDetailsFetching,
  }: { suiteDetails: any; isSuiteDetailsFetching: any } = testData;
  const dispatch = useDispatch();
  // @ts-ignore
  const getSuiteDetails = (suiteId: any) => {
    setCurrentSuiteId(suiteId);
    setOpenCard(!openCard);
    if (!openCard || suiteId !== currentSuiteId) {
      dispatch(
        fetchSuiteDetails(repo, suiteId, '', lastDates(30).start_date, lastDates(30).end_date)
      );
    }
    // @ts-ignore
    let item = document.querySelector('.arrow__down__true');
    if (item) {
      // @ts-ignore
      item.click();
    }
  };
  const getSuiteFileName = (str: any, splitBy = '(') => {
    if (str) {
      try {
        let arr = str.split(splitBy);
        if (arr && arr.length >= 2) {
          let str2 = arr[arr.length - 1];
          let arr2 = str2.split(')');
          return arr2[0];
        }
      } catch (err) {
        return str;
      }
    }
  };
  return (
    <>
      {suite && suite.id && (
        <div
          className={`bg-white border-b ${currentSuiteId === suite.id && openCard && 'shadow-md'}`}
        >
          <Link href={`/${git_provider}/${org}/${repo}/tests-suites/${suite.id}`}>
            <a data-amplitude="tas_open_test_suite_details">
              <Row
                className={`w-full flex flex-wrap  py-12 items-center  list-hover  justify-between ${
                  isSuiteDetailsFetching ? 'cursor_wait' : ''
                }`}
                gutter="0"
              >
                <div className="inline-flex items-center px-15" style={{ width: '27%' }}>
                  <Text className="inline-flex items-center">
                    <VerticalLine
                      className="mmw6 mh36 self-stretch  rounded-lg mr-15"
                      type={suite.execution_details?.status}
                    />
                    <div className="flex flex-wrap">
                      <Text size="span" className="flex">
                        <Image
                          className="mr-5"
                          src="/assets/images/icon/circle-blue.svg"
                          width="10"
                        />
                        <EllipsisText text={getText(suite.name) ? getText(suite.name) : 'N/A'} length="25" dots copy />
                      </Text>
                      <span className="rounded transition flex items-center w-full text-size-12 text-tas-400">
                        <img
                          alt=""
                          className="inline mr-7"
                          src="/assets/images/code-file.svg"
                          width="10"
                        />
                        <EllipsisText text={getSuiteFileName(suite.name)} length="30" copy dots />
                      </span>
                    </div>
                  </Text>
                </div>
                <div className="inline-flex items-center pr-15" style={{ width: '10%' }}>
                  <Text className="inline-flex items-center leading-none">
                    <Text size="span" className="flex mr-7 leading-none">
                      {suite.total_tests || suite.total_tests == 0 ? suite.total_tests : '-'}
                    </Text>
                    {/* <Text size="span" className="text-black opacity-60 flex text-size-13 karla">test cases</Text> */}
                  </Text>
                </div>
                <div className="inline-flex items-center pr-15" style={{ width: '10%' }}>
                  <Text className="inline-flex items-center leading-none">
                    <Text size="span" className="flex mr-7 leading-none">
                      {suite.execution_meta?.total_executions ||
                      suite.execution_meta?.total_executions == 0
                        ? suite.execution_meta?.total_executions
                        : '-'}
                    </Text>
                    <Text size="span" className="flex text-size-12 text-tas-400">
                      {suite.execution_meta?.total_executions > 1 ? 'times' : 'time'}
                    </Text>
                  </Text>
                </div>
                <div className="inline-flex items-center pr-15" style={{ width: '12%' }}>
                  <Text className="">
                    {suite.execution_meta?.avg_test_suite_duration ||
                    suite.execution_meta?.avg_test_suite_duration == 0 ? (
                      <Duration value={suite.execution_meta?.avg_test_suite_duration} />
                    ) : (
                      '- ms'
                    )}
                  </Text>
                </div>
                <div className="inline-flex items-center pr-15" style={{ width: '13%' }}>
                  <StackedHrV2
                    height={6}
                    width={100}
                    data={[
                      {
                        count: suite.execution_meta?.tests_suite_passed,
                        type: 'passed',
                      },
                      {
                        count: suite.execution_meta?.tests_suite_failed,
                        type: 'failed',
                      },
                      {
                        count: suite.execution_meta?.tests_suite_skipped,
                        type: 'skipped',
                      },
                      {
                        count: suite.execution_meta?.tests_suite_blocklisted,
                        type: 'blocklisted',
                      },
                    ]}
                    type={StackedHrType.TEST}
                    tooltipProps={{
                      label: 'Test Suite Runs',
                    }}
                  />
                </div>
                <div className="inline-flex items-center pr-15" style={{ width: '12%' }}>
                  <Text className="inline-flex items-center">
                    <Text size="span" className="flex width-50">
                      <BuildLink
                        id={suite.latest_build?.id}
                        link
                        type={suite.latest_build?.build_tag}
                      />
                    </Text>
                  </Text>
                </div>
                <div className="inline-flex items-center pr-15" style={{ width: '15%' }}>
                  <Text className="flex items-center">
                    <Text size="span" className="flex tracking-wider">
                      {suite.execution_details?.created_at ? (
                        <TimeAgo date={suite.execution_details?.created_at} />
                      ) : (
                        '-'
                      )}
                    </Text>
                  </Text>
                </div>
                {/* <div className="px-15 inline-flex items-center"> */}
                {/* <span onClick={(e) => {e.stopPropagation();e.preventDefault(); if(!suite.total_tests) return;  getSuiteDetails(suite.id);}}  className={`cursor-pointer rounded bg-gray-150 inline-block arrow__down__icon  ${(currentSuiteId === suite.id && openCard) ? 'arrow__down__true' : 'arrow__down__false' }`}><img src="/assets/images/arrow_down_gray.svg" alt="..." width="8" /></span> */}
                {/* </div> */}
              </Row>
            </a>
          </Link>
          {currentSuiteId === suite.id && openCard && (
            <>
              <div className="w-12/12 w-full p-30">
                {suiteDetails && suiteDetails.length > 0 ? (
                  <>
                    <div className="flex py-10 items-center font-medium justify-between">
                      <div className="px-15 w-3/12 pl-0">
                        <span className="flex text-size-12 text-tas-400">Runs</span>
                      </div>
                      <div className="px-15 w-3/12">
                        <span className="flex text-size-12 text-tas-400">Jobs</span>
                      </div>
                      <div className="px-15 w-3/12">
                        <span className="flex text-size-12 text-tas-400">Commit</span>
                      </div>
                      {/* <div className="px-15 w-3/12">
                            <span className="flex text-size-12 text-tas-400">Transition</span>
                        </div> */}
                    </div>
                    {suiteDetails.map((el: any, index: number) => (
                      <div
                        className={`flex bg-white py-10 items-center border border-gray-300 justify-between ${
                          index + 1 === suiteDetails.length ? '' : 'border-b-0'
                        }`}
                        key={el.id}
                      >
                        <div className="px-15 w-3/12 inline-flex items-center">
                          <div className="inline-flex items-center">
                            <VerticalLine
                              className="mmw5 h-24 self-stretch rounded-lg mr-17"
                              type={el.status}
                            />
                            <span className="">
                              <Duration value={el.duration} />
                            </span>
                          </div>
                        </div>
                        <div className="px-15 w-3/12 inline-flex items-center">
                          <span className="flex items-center">
                            <BuildLink id={el.build_id} link type={el.build_tag} />
                          </span>
                        </div>
                        <div className="px-15 w-3/12 inline-flex items-center">
                          <div className="inline-flex items-center">
                            <span className="flex items-center">
                              <img src="/assets/images/yellow-2.svg" alt="" className="mr-7 h-12" />
                              <TasLink id={el.commit_id} path="commits" />
                            </span>
                          </div>
                        </div>
                        {/* <div className="px-15 w-3/12">
                               <Image src="/assets/images/graph6.png" alt="" className="mr-5 h-16 mt-3 ml-30" />
                           </div> */}
                      </div>
                    ))}
                    <div className="flex  py-7 pb-5 items-center">
                      <div className="inline-flex items-center">
                        <Link href={`/${git_provider}/${org}/${repo}/tests-suites/${suite.id}`}>
                          <a>
                            <Text size="span">See all</Text>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <span>{!isSuiteDetailsFetching && 'No data found.'}</span>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SuiteList;
