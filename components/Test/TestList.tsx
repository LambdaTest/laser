import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import _ from 'underscore';
import dynamic from 'next/dynamic';

import { fetchTestDetails } from '../../redux/actions/testAction';
import { getText, lastDates } from '../../helpers/genericHelpers';
import { NULL_DATE_STRING } from '../../constants';

const Duration = dynamic(() => import('../Duration'));
const EllipsisText = dynamic(() => import('../EllipsisText'));
const TasLink = dynamic(() => import('../TasLink'));
const Transition = dynamic(() => import('../Transition'));
const VerticalLine = dynamic(() => import('../../Graphs/VerticalLine'));

import BuildLink from '../Build/Link';
import Image from '../Tags/Image';
import Row from '../Tags/Row';
import StackedHrV2, { StackedHrType } from 'Graphs/StackedHrV2';
import TestListDetails from './TestListDetails';
import Text from '../Tags/Text';
import TimeAgo from '../TimeAgo';
import Tooltip from '../Tooltip';
import Link from 'next/link';

import IconFlakyTest from 'components/Icons/FlakyTest';
import IconQuarantineTest from 'components/Icons/QuarantineTest';

const TestList = ({ repo, test, git_provider, org }: any) => {
  const [openCard, setOpenCard] = useState(false);
  const [currentTestId, setCurrentTestId] = useState('');
  const testData = useSelector((state: any) => state.testData, _.isEqual);
  const { testDetails, isTestDetailsFetching }: { testDetails: any; isTestDetailsFetching: any } =
    testData;

  const dispatch = useDispatch();
  // @ts-ignore
  const getTestDetails = (testId: any) => {
    setCurrentTestId(testId);
    setOpenCard(!openCard);
    if (!openCard || testId !== currentTestId) {
      dispatch(
        fetchTestDetails(repo, testId, '', lastDates(30).start_date, lastDates(30).end_date)
      );
    }
    // @ts-ignore
    const item = document.querySelector('.arrow__down__true');
    if (item) {
      // @ts-ignore
      item.click();
    }
  };

  const isBuildPresent = !!test?.execution_details?.build_id;
  const testSuiteName = test?.test_suite_name && getText(test.test_suite_name);

  return (
    <>
      {test && test.id && (
        <div
          className={`bg-white border-b ${currentTestId === test.id && openCard && 'shadow-md'} ${
            !isBuildPresent ? 'pointer-events-none cursor-not-allowed' : ''
          }`}
        >
          <Link href={`/${git_provider}/${org}/${repo}/tests/${test.id}`}>
            <a
              data-amplitude="tas_open_test_details"
              className={`${isBuildPresent && isTestDetailsFetching ? 'cursor_wait' : ''}
                ${isBuildPresent && !isTestDetailsFetching ? 'cursor-pointer' : ''}
                ${!isBuildPresent ? 'cursor-not-allowed' : ''}`}
            >
              <Row
                className={`
                w-full flex flex-wrap  py-12 items-center list-hover justify-between

              `}
                gutter="0"
              >
                <div className="inline-flex items-center px-15" style={{ width: '30%' }}>
                  <Text className="inline-flex items-center w-full">
                    <VerticalLine
                      className="mmw6 h-inherit self-stretch rounded-lg mr-12"
                      type={isBuildPresent ? test.execution_details?.status : 'Never Executed'}
                    />
                    <Text size="span" className={`w-full`}>
                      <span className="inline-flex items-center">
                        {test.name ? <EllipsisText dots length={25} text={test.name} copy /> : '-'}
                        <IconFlakyTest data={test} className="mr-5" />
                        <IconQuarantineTest data={test} />
                      </span>
                      <Text size="span" className="flex flex-1">
                        <Image
                          src="/assets/images/icon/circle-blue.svg"
                          width="10"
                          className="mr-5"
                        />
                        <span className="flex-1 flex w-full items-baseline text-size-12 text-tas-500">
                          <span className="opacity-40">
                            {isBuildPresent ? (
                              <TasLink
                                id={test.test_suite_id}
                                notrim
                                path="tests-suites"
                                text={
                                  <EllipsisText
                                    copy
                                    dots
                                    length={20}
                                    text={testSuiteName || 'N/A'}
                                  />
                                }
                              />
                            ) : (
                              <EllipsisText dots length={20} text={testSuiteName || 'N/A'} />
                            )}
                          </span>
                          {!isBuildPresent && (
                            <span className="inline-flex bg-gray-300 rounded-md px-5 text-size-10 text-tas-400">
                              Never Executed
                            </span>
                          )}
                        </span>
                      </Text>
                    </Text>
                  </Text>
                </div>
                <div className="inline-flex items-center pr-15" style={{ width: '11%' }}>
                  {isBuildPresent ? (
                    <Text className="inline-flex items-baseline">
                      <Text size="span" className="flex mr-7 font-medium">
                        {test.execution_meta?.total_tests_executed}
                      </Text>
                      <Text size="span" className="flex text-size-12 text-tas-400">
                        {test.execution_meta?.total_tests_executed > 1 ? 'times' : 'time'}
                      </Text>
                    </Text>
                  ) : (
                    <Text className="inline-flex items-baseline">-</Text>
                  )}
                </div>
                <div className="inline-flex items-center pr-15" style={{ width: '11%' }}>
                  <Text>
                    {isBuildPresent ? (
                      <Duration value={test.execution_meta?.avg_test_duration} />
                    ) : (
                      '-'
                    )}
                  </Text>
                </div>
                <div className="inline-flex items-center pr-15" style={{ width: '11%' }}>
                  <StackedHrV2
                    height={6}
                    width={100}
                    data={[
                      {
                        count: test.execution_meta?.tests_passed,
                        type: 'passed',
                      },
                      {
                        count: test.execution_meta?.tests_failed,
                        type: 'failed',
                      },
                      {
                        count: test.execution_meta?.tests_skipped,
                        type: 'skipped',
                      },
                      {
                        count: test.execution_meta?.tests_blocklisted,
                        type: 'blocklisted',
                      },
                      {
                        count: test.execution_meta?.tests_quarantined,
                        type: 'quarantined',
                      },
                    ]}
                    type={StackedHrType.TEST}
                    tooltipProps={{
                      label: 'Test Runs',
                    }}
                  />
                </div>
                <div className="inline-flex items-center pr-15" style={{ width: '12%' }}>
                  <Text className="inline-flex items-center">
                    <Text className="flex width-100 leading-none">
                      <BuildLink
                        id={test.execution_details?.build_id}
                        link
                        type={test.execution_details?.build_tag}
                      />
                    </Text>
                  </Text>
                </div>
                <div className="inline-flex items-center pr-15" style={{ width: '10%' }}>
                  <Text>{isBuildPresent ? <Transition transition={test.transition} /> : '-'}</Text>
                </div>
                <div
                  className="inline-flex items-center pr-15 text-ellipsis"
                  style={{ flex: '1 1 0%', width: '15%' }}
                >
                  <Text className="inline-flex items-center">
                    <Text size="span" className="flex items-center tracking-wider">
                      <img src="/assets/images/user-gray.svg" alt="" className="mr-15 h-16" />
                      <div className="leading-tight" style={{ maxWidth: '150px' }}>
                        <Tooltip
                          content={
                            test.execution_details?.commit_author
                              ? test.execution_details?.commit_author
                              : '-'
                          }
                          placement="left"
                        >
                          <div className="text-ellipsis">
                            {test.execution_details?.commit_author
                              ? test.execution_details?.commit_author
                              : '-'}
                          </div>
                        </Tooltip>
                        <span className="text-tas-400 text-size-12">
                          {test.execution_details?.created_at &&
                          test.execution_details?.created_at !== NULL_DATE_STRING ? (
                            <TimeAgo date={test.execution_details?.created_at} />
                          ) : (
                            '-'
                          )}{' '}
                        </span>
                      </div>
                    </Text>
                  </Text>
                </div>
                {/* <div className="px-10 inline-flex items-center"> */}
                {/* <span onClick={(e) => { e.stopPropagation(); e.preventDefault(); if(!test.execution_meta?.total_tests_executed) return; getTestDetails(test.id) }} className={`cursor-pointer rounded bg-gray-150 inline-block arrow__down__icon  ${(currentTestId === test.id && openCard) ? 'arrow__down__true' : 'arrow__down__false'}`}><img src="/assets/images/arrow_down_gray.svg" alt="..." width="8" /></span> */}
                {/* </div> */}
              </Row>
            </a>
          </Link>

          {testDetails && currentTestId === test.id && openCard && (
            <TestListDetails
              currentTestId={currentTestId}
              git_provider={git_provider}
              isTestDetailsFetching={isTestDetailsFetching}
              org={org}
              repo={repo}
              testDetails={testDetails}
              testId={test.id}
            />
          )}
        </div>
      )}
    </>
  );
};

export default TestList;
