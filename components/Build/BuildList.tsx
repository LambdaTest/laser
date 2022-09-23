import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import _ from 'underscore';

import { fetchBuildDetails } from '../../redux/actions/buildAction';
import { getDateDifference } from '../../helpers/dateHelpers';
import { getCommitMsg, getText } from '../../helpers/genericHelpers';
import { statusFound } from '../../redux/helper';

const Duration = dynamic(() => import('../Duration'));
const EllipsisText = dynamic(() => import('../EllipsisText'));
const TasLink = dynamic(() => import('../TasLink'));
const VerticalLine = dynamic(() => import('../../Graphs/VerticalLine'));

import BuildLink from './Link';
import IconSmartSelection from '../Icons/SmartSelection';
import Image from '../Tags/Image';
import Row from '../Tags/Row';
import StackedHrV2, { StackedHrType } from 'Graphs/StackedHrV2';
import Text from '../Tags/Text';
import TimeAgo from '../TimeAgo';
import Tooltip from '../Tooltip';

import getSmartSelectionMessage from 'modules/Builds/services/getSmartSelectionMessage';

const BuildList = ({ repo, build, git_provider, org }: any) => {
  const [openCard, setOpenCard] = useState(false);
  const [currentBuildId, setCurrentBuildId] = useState('');
  const buildData = useSelector((state: any) => state.buildData);
  const {
    buildDetails,
    isBuildDetailsFetching,
  }: { buildDetails: any; isBuildDetailsFetching: any } = buildData;

  const dispatch = useDispatch();
  // @ts-ignore
  const getBuildDetails = (buildId: any) => {
    setCurrentBuildId(buildId);
    setOpenCard(!openCard);
    if (!openCard || buildId !== currentBuildId) {
      dispatch(fetchBuildDetails(repo, buildId));
    }
    // @ts-ignore
    const item = document.querySelector('.arrow__down__true');
    if (item) {
      // @ts-ignore
      item.click();
    }
  };

  const buildDuration = getDateDifference(build?.start_time, build?.end_time);
  const totalTests = build?.execution_meta?.total_tests;
  const showFlakyView = build?.build_tag === 'flaky';
  const impactedTests = showFlakyView
    ? build?.flaky_execution_meta?.impacted_tests
    : build?.execution_meta?.total_tests_executed;
  const areTotalTestsExecuted = totalTests === impactedTests;
  const smartSelectionEnabled = build?.status !== 'error' && !areTotalTestsExecuted;

  return (
    <>
      {build && build.id && (
        <div
          className={`bg-white border-b ${currentBuildId === build.id && openCard && 'shadow-md'}`}
        >
          <Link href={`/${git_provider}/${org}/${repo}/jobs/${build.id}`}>
            <a data-amplitude="tas_open_build_details">
              <Row
                className={`w-full flex flex-wrap  py-12 items-center  list-hover justify-between -mr-5 ${
                  isBuildDetailsFetching ? 'cursor_wait' : ''
                }`}
                gutter="0"
              >
                <div className="inline-flex items-center px-15" style={{ width: '16%' }}>
                  <Text className="inline-flex items-center">
                    <VerticalLine
                      className="mmw6 h-36 self-stretch  rounded-lg mr-12"
                      type={build.status}
                      remark={build.remark}
                    />
                    <BuildLink type={build.build_tag} id={build.id} />
                  </Text>
                </div>
                <div className="inline-flex items-center pr-15" style={{ width: '14%' }}>
                  <Text className="inline-flex items-center">
                    {statusFound(build.status, false, false) ? (
                      '-'
                    ) : (
                      <>{buildDuration >= 0 ? <Duration value={buildDuration} /> : '-'}</>
                    )}
                  </Text>
                </div>
                <div className="inline-flex items-center pr-15" style={{ width: '14%' }}>
                  {statusFound(build.status) ? (
                    ''
                  ) : (
                    <Text className="mr-5" size="span">
                      <Tooltip
                        animation="fade"
                        content={getSmartSelectionMessage({
                          impacted: impactedTests,
                          smartSelectionEnabled,
                          status: build?.status,
                          total: totalTests,
                        })}
                        delay={[100, 0]}
                        hideOnClick={false}
                        placement="right"
                      >
                        <div>
                          <IconSmartSelection
                            variant={!smartSelectionEnabled ? 'inactive' : 'active'}
                          />
                        </div>
                      </Tooltip>
                    </Text>
                  )}
                  <Text className="text-size-16 flex items-baseline leading-none" size="span">
                    {statusFound(build.status, false, false) ? (
                      '-'
                    ) : (
                      <>
                        {impactedTests}
                        <span className="text-size-12 text-tas-400">/{totalTests}</span>
                      </>
                    )}
                  </Text>
                </div>
                <div className="inline-flex items-center pr-15" style={{ width: '13%' }}>
                  <StackedHrV2
                    height={6}
                    width={113}
                    data={
                      showFlakyView
                        ? [
                            {
                              count:
                                build?.flaky_execution_meta?.impacted_tests -
                                build?.flaky_execution_meta?.flaky_tests -
                                build?.flaky_execution_meta?.tests_skipped -
                                build?.flaky_execution_meta?.tests_blocklisted,
                              type: 'nonflaky',
                            },
                            {
                              count: build?.flaky_execution_meta?.flaky_tests,
                              type: 'flaky',
                            },
                            {
                              count: build?.flaky_execution_meta?.tests_skipped,
                              type: 'skipped',
                            },
                            {
                              count: build?.flaky_execution_meta?.tests_blocklisted,
                              type: 'blocklisted',
                            },
                          ]
                        : [
                            {
                              count: build.execution_meta?.tests_passed,
                              type: 'passed',
                            },
                            {
                              count: build.execution_meta?.tests_failed,
                              type: 'failed',
                            },
                            {
                              count: build.execution_meta?.tests_skipped,
                              type: 'skipped',
                            },
                            {
                              count: build.execution_meta?.tests_blocklisted,
                              type: 'blocklisted',
                            },
                            {
                              count: build.execution_meta?.tests_quarantined,
                              type: 'quarantined',
                            },
                            // {
                            //   count: build.execution_meta?.tests_unimpacted,
                            //   hideInLine: true,
                            //   type: 'unimpacted',
                            // },
                          ]
                    }
                    type={showFlakyView ? StackedHrType.FLAKY_TEST : StackedHrType.TEST}
                    tooltipProps={{
                      label: (
                        <div className="flex justify-between">
                          <span>Test Runs</span>
                          <span className="">
                            {impactedTests}
                            <span className="text-tas-400 text-size-10">/{totalTests}</span>
                          </span>
                        </div>
                      ),
                    }}
                  />
                </div>
                <div className="inline-flex items-center pr-15" style={{ width: '26%' }}>
                  <Image src="/assets/images/yellow-2.svg" className="mr-10 h-11" />
                  <Text className="inline-flex items-center flex-wrap">
                    <Text size="span" className="flex items-center w-full mb-2">
                      <TasLink id={build.commit_id} path="commits" />
                      {build.total_commits > 1 && (
                        <span className="plus__commit__badge text-size-12 px-5 leading-none inline-flex items-center">
                          +{build.total_commits - 1} more
                        </span>
                      )}
                    </Text>
                    <Text size="span" className="text-tas-400 flex text-size-12 w-full">
                      <EllipsisText
                        copy
                        dots
                        length={32}
                        text={getCommitMsg(build.commit_message).name}
                      />
                    </Text>
                  </Text>
                </div>
                <div className="inline-flex items-center pr-15" style={{ width: '17%' }}>
                  <Text size="span" className=" tracking-wider">
                    <TimeAgo date={build.created_at} />
                  </Text>
                </div>
                {/* <div className="px-15 inline-flex items-center"> */}
                {/* <span className="w-24 h-24 hidden" onClick={() => { getBuildDetails(build.id) }}></span> */}
                {/* <span onClick={(e) => { e.stopPropagation(); e.preventDefault();  getBuildDetails(build.id) }} className={`cursor-pointer rounded bg-gray-150 inline-block arrow__down__icon  ${(currentBuildId === build.id && openCard) ? 'arrow__down__true' : 'arrow__down__false'}`}><img src="/assets/images/arrow_down_gray.svg" alt="..." width="8" /></span> */}
                {/* </div> */}
              </Row>
            </a>
          </Link>
          {currentBuildId === build.id && openCard && (
            <>
              <div className="w-12/12 w-full p-30">
                {buildDetails && buildDetails.length > 0 && (
                  <div className="flex py-10 items-center text-size-12 font-medium text-tas-400 justify-between">
                    <div className="px-15 w-6/12 pl-0">
                      <span className="flex">Test</span>
                    </div>
                    <div className="px-15 w-2/12">
                      <span className="flex">Duration</span>
                    </div>
                    <div className="px-15 w-4/12">
                      <span className="flex">Test Suite</span>
                    </div>
                    {/* <div className="px-15 w-2/12">
                                        <span className="flex">Transition</span>
                                    </div> */}
                  </div>
                )}
                {buildDetails &&
                  buildDetails.length > 0 &&
                  buildDetails.map((el: any, index: number) => (
                    <div
                      className={`flex bg-white py-10 items-center border border-gray-300  justify-between ${
                        index + 1 === buildDetails.length ? '' : 'border-b-0'
                      }`}
                      key={el}
                    >
                      <div className="px-15 w-6/12 inline-flex items-center">
                        <div className="inline-flex items-center">
                          <VerticalLine
                            className="mmw5 h-24 self-stretch rounded-lg mr-17"
                            type={el.execution_details?.status}
                          />
                          <Text className=""></Text>
                          <span className="">
                            <TasLink text={el.name} id={el.id} notrim path="tests" />
                          </span>
                        </div>
                      </div>
                      <div className="px-15 w-2/12">
                        <span className="flex items-center">
                          <Duration value={el.execution_details?.duration} />
                        </span>
                      </div>
                      <div className="px-15 w-4/12 inline-flex items-center">
                        <div className="inline-flex items-center">
                          <span className="flex">
                            <img
                              alt=""
                              className="mr-5"
                              src="/assets/images/icon-blue.svg"
                              width="12"
                            />
                            <TasLink
                              id={el.suite?.id}
                              notrim
                              path="tests-suites"
                              text={getText(el.suite?.name)}
                            />
                          </span>
                        </div>
                      </div>
                      {/* <div className="px-15 w-2/12">
                                                <span className="text-gray-600 flex text-size-14"><img src="/assets/images/graph6.png" alt="" className="mr-5 h-16 mt-3 ml-30" /></span>
                                            </div> */}
                    </div>
                  ))}
                {buildDetails && buildDetails.length > 0 && (
                  <div className="flex  py-7 pb-5 items-center">
                    <div className="inline-flex items-center">
                      <Link href={`/${git_provider}/${org}/${repo}/jobs/${build.id}`}>
                        <a>
                          <Text size="span" className="text-tas-400">
                            See all
                          </Text>
                        </a>
                      </Link>
                    </div>
                  </div>
                )}
                {buildDetails && buildDetails.length == 0 && !isBuildDetailsFetching && (
                  <span>No tests were executed.</span>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default BuildList;
