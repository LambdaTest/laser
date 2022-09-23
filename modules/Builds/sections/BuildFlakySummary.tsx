import React, { useMemo } from 'react';

import _ from 'underscore';
import moment from 'moment';

import DateFormats from 'constants/DateFormats';

import { getDateDifference } from 'helpers/dateHelpers';
import { statusFound } from 'redux/helper';
import { roundOff } from 'helpers/mathHelpers';

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

const BuildFlakySummary = ({ build }: any) => {
  const formattedFinishedDate = useMemo(() => {
    return moment(build.created_at).format(DateFormats.DISPLAY_WITH_TIME);
  }, [build.created_at]);

  const buildDuration = getDateDifference(build?.start_time, build?.end_time);

  const totalTests = build?.execution_meta?.total_tests;
  const {
    impacted_tests: impactedTests,
    flaky_tests: flakyTests,
    overall_flakiness: overallFlakiness,
  } = build?.flaky_execution_meta || {};

  const areTotalTestsExecuted = totalTests === impactedTests;
  const smartSelectionEnabled = build?.status !== 'error' && !areTotalTestsExecuted;

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
          tooltip: build.remark && build.status === 'failed' ? build.remark : null,
        },
        {
          content: <BuildLink type={build.build_tag} id={build.id} />,
          label: 'Job ID',
        },
        {
          content:
            statusFound(build.status, false, false) || buildDuration < 0 ? (
              '-'
            ) : (
              <Duration value={buildDuration} />
            ),
          label: 'Duration',
        },
        {
          content: (
            <div className="flex items-center">
              {statusFound(build.status, false, false) ? (
                ''
              ) : (
                <Text className="mr-5" size="span">
                  <IconSmartSelection variant={!smartSelectionEnabled ? 'inactive' : 'active'} />
                </Text>
              )}
              <Text className="text-size-16 flex items-baseline leading-none" size="span">
                {statusFound(build.status, false, false) ? (
                  '-'
                ) : (
                  <>
                    {`${impactedTests}`}
                    <span className="text-size-12 text-tas-400">/{totalTests}</span>
                  </>
                )}
              </Text>
            </div>
          ),
          label: 'Impacted Tests',
          tooltip: getSmartSelectionMessage({
            impacted: impactedTests,
            smartSelectionEnabled: smartSelectionEnabled,
            status: build?.status,
            total: totalTests,
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
                ]}
                type={StackedHrType.FLAKY_TEST}
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
                    count:
                      +build?.flaky_execution_meta?.tests_skipped +
                      +build?.flaky_execution_meta?.tests_blocklisted,
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
          tooltip: formattedFinishedDate,
        },
        {
          content: impactedTests ? (
            <div>
              <span>{flakyTests}</span>
              <span className="text-size-12 text-tas-400">/{impactedTests}</span>
              <span className="text-size-12 text-green-400 ml-5">
                {/* ({getPercentage(flakyTests, impactedTests ? +impactedTests : 0)} */}(
                {roundOff(overallFlakiness, 2)}
                %)
              </span>
            </div>
          ) : (
            '-'
          ),
          label: 'Overall Flakiness',
        },
      ]}
    />
  );
};

export default BuildFlakySummary;
