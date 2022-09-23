import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import _ from 'underscore';

const EllipsisText = dynamic(() => import('../EllipsisText'));
const VerticalLine = dynamic(() => import('../../Graphs/VerticalLine'));

import BuildLink from '../Build/Link';
import StackedHrV2, { StackedHrType } from 'Graphs/StackedHrV2';
import Text from '../Tags/Text';
import TimeAgo from '../TimeAgo';
import Tooltip from '../Tooltip';

import { getCommitMsg } from 'helpers/genericHelpers';

const CommitList = ({ repo, commit, git_provider, org }: any) => {
  const isBuildPresent = !!commit?.latest_build?.id;
  const showFlakyView = commit?.latest_build?.build_tag === 'flaky';
  const totalBuildsExecuted = commit?.task_meta?.total_builds_executed;

  return (
    <>
      {commit && commit.commit_id && (
        <Link
          href={
            isBuildPresent ? `/${git_provider}/${org}/${repo}/commits/${commit.commit_id}` : '#'
          }
        >
          <a
            className={`border-b block ${!isBuildPresent ? 'cursor-not-allowed' : ''}`}
            data-amplitude="tas_open_commit_details"
          >
            <div className="flex bg-white  py-12 items-center  list-hover justify-between">
              <div className="px-15 inline-flex items-center" style={{ width: '37%' }}>
                <div className="inline-flex items-center">
                  <VerticalLine
                    className="mmw6 h-inherit self-stretch  rounded-lg mr-17"
                    type={
                      isBuildPresent
                        ? commit.latest_build?.status
                        : 'NO_JOB_COMMIT'
                    }
                    remark={commit.latest_build?.remark}
                  />
                  <span>
                    <EllipsisText dots length={35} text={getCommitMsg(commit.message).name} copy />
                    <span className="text-tas-400 text-size-12 flex">
                      <img src="/assets/images/yellow-2.svg" alt="" width="16" className="mr-5" />{' '}
                      <span>
                        <EllipsisText text={commit.commit_id} copy length="7" />
                        {!isBuildPresent && (
                          <span className="inline-flex bg-gray-300 rounded-md px-5 text-size-10">
                            No job initiated for this commit
                          </span>
                        )}
                      </span>
                    </span>
                  </span>
                </div>
              </div>
              <div className="pr-15 inline-flex items-center" style={{ width: '12%' }}>
                <div className="inline-flex flex-wrap items-center">
                  <span className="w-full flex mr-7 leading-none">{`${
                    !isBuildPresent ||
                    commit.latest_build?.status == 'running' ||
                    commit.latest_build?.status == 'initiating'
                      ? '-'
                      : '+' + commit.tests_added
                  }`}</span>
                </div>
              </div>
              <div className="pr-15 inline-flex items-center" style={{ width: '15%' }}>
                <Text className="inline-flex flex-col">
                  {commit.execution_meta && (
                    <>
                      {commit.latest_build?.status == 'running' ||
                      commit.latest_build?.status == 'initiating' ? (
                        <div
                          className="inline-flex overflow-hidden rounded-full"
                          style={{ width: '100px', height: '6px' }}
                        >
                          <div className="w-full bg-gray-150"></div>
                        </div>
                      ) : (
                        <StackedHrV2
                          height={6}
                          width={100}
                          data={
                            showFlakyView
                              ? [
                                  {
                                    count:
                                      commit.flaky_execution_meta?.impacted_tests -
                                      commit.flaky_execution_meta?.flaky_tests -
                                      commit.flaky_execution_meta?.tests_skipped -
                                      commit.flaky_execution_meta?.tests_blocklisted,
                                    type: 'nonflaky',
                                  },
                                  {
                                    count: commit.flaky_execution_meta?.flaky_tests,
                                    type: 'flaky',
                                  },
                                  {
                                    count: commit.flaky_execution_meta?.tests_skipped,
                                    type: 'skipped',
                                  },
                                  {
                                    count: commit.flaky_execution_meta?.tests_blocklisted,
                                    type: 'blocklisted',
                                  },
                                ]
                              : [
                                  {
                                    count: commit.execution_meta?.tests_passed,
                                    type: 'passed',
                                  },
                                  {
                                    count: commit.execution_meta?.tests_failed,
                                    type: 'failed',
                                  },
                                  {
                                    count: commit.execution_meta?.tests_skipped,
                                    type: 'skipped',
                                  },
                                  {
                                    count: commit.execution_meta?.tests_blocklisted,
                                    type: 'blocklisted',
                                  },
                                  {
                                    count: commit.execution_meta?.tests_quarantined,
                                    type: 'quarantined',
                                  },
                                ]
                          }
                          type={showFlakyView ? StackedHrType.FLAKY_TEST : StackedHrType.TEST}
                          tooltipProps={{
                            label: 'Test Runs',
                          }}
                        />
                      )}
                    </>
                  )}
                </Text>
              </div>
              <div className="pr-15 inline-flex items-center" style={{ width: '18%' }}>
                <div className="inline-flex items-center">
                  <span className="flex">
                    <BuildLink
                      id={commit.latest_build?.id}
                      link
                      type={commit.latest_build?.build_tag}
                      suffix={
                        totalBuildsExecuted > 1 ? (
                          <span className="plus__build__badge text-size-10 ml-4 px-5 leading-none inline-flex items-center">
                            +{totalBuildsExecuted - 1} more
                          </span>
                        ) : null
                      }
                    />
                  </span>
                </div>
              </div>
              <div
                className="pr-15 inline-flex items-center text-ellipsis"
                style={{ width: '18%' }}
              >
                <div className="inline-flex items-center overflow-hidden">
                  <img src="/assets/images/user-gray.svg" alt="" className="mr-10 h-16" />
                  <div className="text-ellipsis">
                    <Tooltip content={commit.author?.Name ? commit.author?.Name : ''}>
                      <span className="text-ellipsis">
                        {' '}
                        {commit.author?.Name ? commit.author?.Name : '-'}
                      </span>
                    </Tooltip>
                    <div>
                      <span className="text-tas-400 flex text-size-12">
                        {commit?.author?.Date ? <TimeAgo date={commit.author.Date} /> : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </Link>
      )}
    </>
  );
};

export default CommitList;
