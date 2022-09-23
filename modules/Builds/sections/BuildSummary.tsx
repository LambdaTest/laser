import React, { useMemo } from 'react';

import _ from 'underscore';
import moment from 'moment';

import DateFormats from 'constants/DateFormats';

import { getDateDifference } from 'helpers/dateHelpers';
import { statusFound } from 'redux/helper';

import BadgeV2 from 'components/BadgeV2';
import BuildLink from 'components/Build/Link';
import Duration from 'components/Duration';
import IconSmartSelection from 'components/Icons/SmartSelection';
import SummarySection from 'components/SummarySection';
import TasLink from 'components/TasLink';
import Text from 'components/Tags/Text';
import TimeAgo from 'components/TimeAgo';

import StackedHrV2, { StackedHrType } from 'Graphs/StackedHrV2';
import getSmartSelectionMessage from '../services/getSmartSelectionMessage';

const getPercentage = (partialValue: number, totalValue: number, toFixed=2) => {
  if (partialValue === 0 && totalValue === 0) {
    return 0;
  } else {
    return parseFloat(`${((100 * partialValue) / totalValue).toFixed(toFixed)}`);
  }
};

const BuildSummary = ({ build, isTimeSavedFetching, statusMessage, timeSaved }: any) => {
  const formattedFinishedDate = useMemo(() => {
    return moment(build.created_at).format(DateFormats.DISPLAY_WITH_TIME);
  }, [build.created_at]);

  const buildDuration = getDateDifference(build?.start_time, build?.end_time);

  const areTotalTestsExecuted =
    build?.execution_meta?.total_tests === build?.execution_meta?.total_tests_executed;
  const smartSelectionEnabled = build?.status !== 'error' && !areTotalTestsExecuted;

  const totalUnimpactedTests = timeSaved.total_tests - timeSaved.total_impacted_tests;

  return (
    <SummarySection
      list={[
        {
          content: (
            <span>
              <BadgeV2 status={build.status} />
            </span>
          ),
          label: 'Status',
        },
        {
          content: <BuildLink type={build.build_tag} id={build.id} />,
          label: 'Job ID',
        },
        {
          content:
            !statusFound(build.status, false, false) && buildDuration >= 0 ? (
              <Duration value={buildDuration} />
            ) : (
              '-'
            ),
          label: 'Duration',
        },
        {
          content: (
            <div className="flex items-center">
              {statusFound(build.status) ? (
                '-'
              ) : (
                <>
                  <Text className="mr-5" size="span">
                    <IconSmartSelection variant={!smartSelectionEnabled ? 'inactive' : 'active'} />
                  </Text>
                  <Text className="text-size-16 flex items-baseline leading-none" size="span">
                    {`${build.execution_meta?.total_tests_executed}`}
                    <span className="text-size-12 text-tas-400">
                      /{build.execution_meta?.total_tests}
                    </span>
                  </Text>
                </>
              )}
            </div>
          ),
          label: 'Impacted Tests',
          tooltip: getSmartSelectionMessage({
            impacted: build.execution_meta?.total_tests_executed,
            smartSelectionEnabled,
            status: build?.status,
            total: build.execution_meta?.total_tests,
          }),
        },
        {
          content: (
            <div className="inline-flex flex-col">
              <StackedHrV2
                height={6}
                width={113}
                data={[
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
                ]}
                type={StackedHrType.TEST}
                tooltipProps={{
                  label: (
                    <div className="flex justify-between">
                      <span>Test Runs</span>
                      <span className="">
                        {build?.execution_meta?.total_tests_executed}
                        <span className="text-tas-400 text-size-10">
                          /{build?.execution_meta?.total_tests}
                        </span>
                      </span>
                    </div>
                  ),
                }}
                footer={[
                  {
                    count: build.execution_meta?.tests_passed,
                    type: 'passed',
                  },
                  {
                    count: build.execution_meta?.tests_failed,
                    type: 'failed',
                  },
                  {
                    count:
                      +build.execution_meta?.tests_skipped +
                      +build.execution_meta?.tests_blocklisted +
                      +build.execution_meta?.tests_quarantined,
                    type: 'rest',
                    color: '#cbd5e0',
                  },
                ]}
              />
            </div>
          ),
          label: 'Test Results',
        },
        {
          content: (
            <span className="inline-flex items-center">
              <button className="py-3  rounded transition   inline-flex items-center">
                <img src="/assets/images/yellow-2.svg" alt="" width="16" className="inline mr-7" />{' '}
                <span>
                  <TasLink id={build.commit_id} path="commits" />
                </span>
              </button>
              {build.total_commits > 1 && (
                <span className="plus__commit__badge text-size-12 px-5  leading-none inline-flex items-center">
                  +{build.total_commits - 1} more
                </span>
              )}
            </span>
          ),
          label: 'Commit ID',
        },
        {
          content: (
            <div className="whitespace-no-wrap">
              <TimeAgo date={build.created_at} hideTitle />
            </div>
          ),
          label: 'Executed',
          tooltip: `On ${formattedFinishedDate || '-'}`,
        },
        {
          content:
            timeSaved && totalUnimpactedTests && totalUnimpactedTests < timeSaved.total_tests ? (
              <div>
                <span>{timeSaved.total_tests - timeSaved.total_impacted_tests}</span>
                <span className="text-size-12 text-green-400 ml-5">
                  (
                  {getPercentage(
                    totalUnimpactedTests,
                    timeSaved.total_tests ? +timeSaved.total_tests : 0, 0
                  )}
                  %)
                </span>
              </div>
            ) : (
              ''
            ),
          label: 'Tests Skipped',
          loading:
            isTimeSavedFetching &&
            !statusFound(build.status, false, true) &&
            build.execution_meta?.total_tests_executed > 0,
        },
        {
          content:
            timeSaved && timeSaved.time_saved_percent > 0 && timeSaved.time_saved_percent < 100 ? (
              <div>
                <Duration
                  value={timeSaved.time_taken_all_tests_ms - timeSaved.time_taken_impacted_tests_ms}
                />
                <span className="text-size-12 text-green-400 ml-5">
                  ({timeSaved.time_saved_percent ? (+timeSaved.time_saved_percent).toFixed(0) : 0}
                  %)
                </span>
              </div>
            ) : (
              ''
            ),
          label: 'Time Saved',
          loading:
            isTimeSavedFetching &&
            !statusFound(build.status, false, true) &&
            build.execution_meta?.total_tests_executed > 0,
        },
      ]}
      footer={
        statusMessage ? (
          <div className="h-32 bg-warning text-size-14 px-8 my-8 radius-3 w-full flex items-center">
            <span className="text-ellipsis">{statusMessage}</span>
          </div>
        ) : null
      }
    />
  );
};

export default BuildSummary;
