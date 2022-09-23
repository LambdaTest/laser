import React, { useMemo, useState } from 'react';

import _ from 'underscore';
import moment from 'moment';

import { getCommitMsg } from 'helpers/genericHelpers';
import { statusFound } from 'redux/helper';

import DateFormats from 'constants/DateFormats';
import { NULL_DATE_STRING } from 'constants/index';

import BadgeV2 from 'components/BadgeV2';
import BuildLink from 'components/Build/Link';
import Dropdown from 'components/Dropdown';
import Duration from 'components/Duration';
import EllipsisText from 'components/EllipsisText';
import GitDiff from 'components/GitDiff';
import Image from 'components/Tags/Image';
import SummarySection from 'components/SummarySection';
import TimeAgo from 'components/TimeAgo';

import StackedHrV2, { StackedHrType } from 'Graphs/StackedHrV2';

const getPercentage = (partialValue: number, totalValue: number) => {
  if (partialValue === 0 && totalValue === 0) {
    return 0;
  } else {
    return parseFloat(`${((100 * partialValue) / totalValue).toFixed(2)}`);
  }
};

const CommitSummary = ({
  commit,
  commitBuilds,
  currentBuildId,
  isRebuildInProgress,
  isTimeSavedFetching,
  latestBuildId,
  setCurrentBuildId,
  showFlakyView,
  statusMessage,
  timeSaved,
  triggerRebuild,
}: any) => {
  const [commitDescription, setCommitDescription] = useState(false);
  const toggleDescription = () => {
    setCommitDescription(!commitDescription);
  };

  const formattedFinishedDate = useMemo(() => {
    return moment(commit.latest_build?.created_at).format(DateFormats.DISPLAY_WITH_TIME);
  }, [commit.latest_build?.created_at]);

  const diffUrl = commit.commit_diff_url;
  const commitMessage = getCommitMsg(commit.message);

  const totalUnimpactedTests = timeSaved.total_tests - timeSaved.total_impacted_tests;

  return (
    <SummarySection
      list={[
        {
          content: (
            <span>
              <BadgeV2 status={commit?.latest_build?.status} />
            </span>
          ),
          label: 'Status',
          styles: {
            flexGrow: '0',
            marginBottom: '20px',
            minWidth: '120px',
          },
        },
        {
          content: (
            <div className="whitespace-no-wrap inline-flex">
              <img src="/assets/images/yellow-2.svg" alt="" width="16" className="inline mr-4" />
              <span>
                <EllipsisText text={commit.commit_id} copy length="7" />
              </span>
              <span className="inline-block mr-18">
                <GitDiff diffUrl={diffUrl} />
              </span>
              <EllipsisText text={commitMessage.name} copy length="50" dots />
              {commitMessage.description && (
                <span
                  className="border rounded cursor-pointer inline-flex items-center justify-center text-center bg-gray-100 w-30"
                  onClick={toggleDescription}
                  style={{ height: '20px' }}
                >
                  <span className="leading-none dot_expand">...</span>
                </span>
              )}
            </div>
          ),
          label: 'Commit',
          styles: {
            flexGrow: '0',
            marginBottom: '20px',
          },
        },
        {
          content: !statusFound(commit.latest_build?.status) ? (
            <div className="inline-flex items-center">
              <span className="leading-none mr-1">+</span> {commit.tests_added}
            </div>
          ) : (
            '-'
          ),
          label: 'Tests added',
          styles: {
            flexGrow: '0',
            marginBottom: '20px',
          },
        },
        {
          content: (
            <div className="inline-flex flex-col">
              <StackedHrV2
                height={6}
                width={113}
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
                footer={
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
                          count:
                            +commit.flaky_execution_meta?.tests_skipped +
                            +commit.flaky_execution_meta?.tests_blocklisted,
                          type: 'rest',
                          color: '#cbd5e0',
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
                          count:
                            +commit.execution_meta?.tests_skipped +
                            +commit.execution_meta?.tests_blocklisted +
                            +commit.execution_meta?.tests_quarantined,
                          type: 'rest',
                          color: '#cbd5e0',
                        },
                      ]
                }
              />
            </div>
          ),
          label: 'Tests Executed',
          styles: {
            flexGrow: '0',
            marginBottom: '20px',
          },
        },
        {
          content:
            !statusFound(commit.latest_build?.status) &&
            commit.task_meta?.avg_task_duration >= 0 ? (
              <span className="whitespace-no-wrap">
                <Duration value={commit.task_meta?.avg_task_duration} />
              </span>
            ) : (
              '-'
            ),
          label: 'Duration',
          styles: {
            flexGrow: '0',
            marginBottom: '20px',
          },
        },
        {
          content: (
            <div className="flex items-center whitespace-no-wrap">
              <Image src="/assets/images/user-gray.svg" alt="" width="12" className="inline mr-7" />
              <div className="flex items-baseline">
                <div className="-mr-12">
                  {commit.author?.Name ? (
                    <EllipsisText dots length="15" text={commit.author?.Name} />
                  ) : (
                    '-'
                  )}
                </div>
                {commit.latest_build?.created_at &&
                commit.latest_build?.created_at !== NULL_DATE_STRING ? (
                  <div className="text-tas-400 text-size-12">
                    <TimeAgo date={commit.latest_build?.created_at} hideTitle />
                  </div>
                ) : (
                  '-'
                )}
              </div>
            </div>
          ),
          label: 'Contributor',
          styles: {
            flexGrow: '0',
            marginBottom: '20px',
          },
          tooltip: `By ${commit.author?.Name + ' on '} ${formattedFinishedDate}`,
        },
        {
          content:
            timeSaved && totalUnimpactedTests && totalUnimpactedTests < timeSaved.total_tests ? (
              <div className="whitespace-no-wrap">
                <span>{totalUnimpactedTests}</span>
                <span className="text-size-12 text-green-400 ml-5">
                  (
                  {getPercentage(
                    totalUnimpactedTests,
                    timeSaved.total_tests ? +timeSaved.total_tests : 0
                  )}
                  %)
                </span>
              </div>
            ) : (
              ''
            ),
          label: 'Tests Skipped',
          loading: isTimeSavedFetching,
          styles: {
            flexGrow: 0,
            marginBottom: '20px',
          },
        },
        {
          content:
            timeSaved && timeSaved.time_saved_percent > 0 && timeSaved.time_saved_percent < 100 ? (
              <div className="whitespace-no-wrap">
                <Duration
                  value={timeSaved.time_taken_all_tests_ms - timeSaved.time_taken_impacted_tests_ms}
                />
                <span className="text-size-12 text-green-400 ml-5">
                  ({timeSaved.time_saved_percent ? (+timeSaved.time_saved_percent).toFixed(2) : 0}
                  %)
                </span>
              </div>
            ) : (
              ''
            ),
          label: 'Time Saved',
          loading: isTimeSavedFetching,
          styles: {
            flexGrow: '0',
            marginBottom: '20px',
          },
        },
        {
          content: commitMessage.description && commitDescription && (
            <div className="text-tas-400 text-size-12">{commitMessage.description}</div>
          ),
          label: '',
          styles: {
            minWidth: '100%',
            marginBottom: '20px',
            flexGrow: '0',
          },
        },
      ]}
      className="pb-0"
      footer={
        <div>
          {statusMessage ? (
            <div className="h-32 bg-warning text-size-14 px-8 mb-8 -mt-12 radius-3 w-full flex items-center">
              <span className="text-ellipsis">{statusMessage}</span>
            </div>
          ) : null}
          <div className="flex h-full items-end justify-between flex-1">
            <div className="flex-1 flex items-center">
              {commitBuilds &&
                commitBuilds.length > 0 &&
                commitBuilds
                  .sort((buildA: any, buildB: any) => buildB.build_num - buildA.build_num)
                  .slice(0, 3)
                  .map((build: any) => (
                    <span
                      className={`inline-flex mr-20 py-8 text-size-12 items-center cursor-pointer commit__latest__badge ${
                        build.id === currentBuildId
                          ? 'text-blue-400 border-b border-blue-400 '
                          : 'text-tas-400'
                      }`}
                      key={build.id}
                      onClick={() => setCurrentBuildId(build.id)}
                    >
                      <BuildLink id={build?.id} type={build?.build_tag} />
                      {latestBuildId.current === build.id && commitBuilds.length > 1 && (
                        <span className="text-size-8 bg-indigo-100 text-indigo-800 -ml-10">
                          LATEST
                        </span>
                      )}
                    </span>
                  ))}
              {commitBuilds && commitBuilds.length > 3 && (
                <Dropdown
                  labelKey="id"
                  onClick={(_value) => setCurrentBuildId(_value)}
                  options={commitBuilds.slice(3)}
                  optionRenderer={(option: any) => (
                    <div
                      className={`text-tas-400 text-size-12 block px-8 py-5 cursor-pointer text-ellipsis rounded ${
                        option.id === currentBuildId ? 'active' : ''
                      }`}
                    >
                      <BuildLink id={option?.id} type={option?.build_tag} />
                    </div>
                  )}
                  prefix={<span className="text-tas-400">Job ID: </span>}
                  selectedOption={currentBuildId}
                  toggleStyles={{ width: '100px', height: '32px', background: 'white' }}
                  valueKey="id"
                  toggleRenderer={() => (
                    <div
                      className={`text-size-12 block px-8 cursor-pointer rounded text-blue-400 border-purple bg-purple-350`}
                    >
                      +{commitBuilds.length - 3} more
                    </div>
                  )}
                />
              )}
            </div>
            <div>
              <button
                className={`border px-10 h-32 rounded text-size-12 transition bg-black text-white border-black w-full items-center justify-center hidden ${
                  isRebuildInProgress ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                } mb-8`}
                onClick={isRebuildInProgress ? () => {} : () => triggerRebuild()}
              >
                Rebuild{isRebuildInProgress && <div className="loader ml-10">Loading...</div>}
              </button>
            </div>
          </div>
        </div>
      }
      gridStyle={{
        display: 'flex',
        gap: '0 40px',
        flexWrap: 'wrap',
        flexShrink: '0',
      }}
    />
  );
};

export default CommitSummary;
