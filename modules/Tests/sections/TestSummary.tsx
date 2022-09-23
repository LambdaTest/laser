import React, { useMemo } from 'react';

import _ from 'underscore';
import moment from 'moment';

import { getText } from 'helpers/genericHelpers';

import DateFormats from 'constants/DateFormats';
import { NULL_DATE_STRING } from 'constants/index';

import BadgeV2 from 'components/BadgeV2';
import BuildLink from 'components/Build/Link';
import Duration from 'components/Duration';
import EllipsisText from 'components/EllipsisText';
import IconFlakyTest from 'components/Icons/FlakyTest';
import IconQuarantineTest from 'components/Icons/QuarantineTest';
import Image from 'components/Tags/Image';
import Info from 'components/Info';
import SummarySection from 'components/SummarySection';
import TasLink from 'components/TasLink';
import TimeAgo from 'components/TimeAgo';
import Transition from 'components/Transition';

import StackedHrV2, { StackedHrType } from 'Graphs/StackedHrV2';

const TestSummary = ({ test }: any) => {
  const formattedFinishedDate = useMemo(() => {
    return moment(test?.execution_details?.created_at).format(DateFormats.DISPLAY_WITH_TIME);
  }, [test?.execution_details?.created_at]);

  return (
    <SummarySection
      list={[
        {
          content: <BadgeV2 status={test.execution_details?.status} />,
          label: 'Status',
        },
        {
          content: (
            <div className="inline-flex items-baseline">
              <span className="flex mr-7">{test.execution_meta?.total_tests_executed}</span>
              <span className="text-size-12 text-tas-400 flex">
                {test.execution_meta?.total_tests_executed > 1 ? 'times' : 'time'}
              </span>
            </div>
          ),
          label: 'Executed',
        },
        {
          content:
            test.execution_meta?.avg_test_duration >= 0 ? (
              <Duration value={test.execution_meta?.avg_test_duration} />
            ) : (
              '-'
            ),
          label: 'Avg Duration',
        },
        {
          content: (
            <div className="inline-flex flex-col">
              <StackedHrV2
                height={6}
                width={113}
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
                footer={[
                  {
                    count: test.execution_meta?.tests_passed,
                    type: 'passed',
                  },
                  {
                    count: test.execution_meta?.tests_failed,
                    type: 'failed',
                  },
                  {
                    count:
                      +test.execution_meta?.tests_skipped +
                      +test.execution_meta?.tests_blocklisted +
                      +test.execution_meta?.tests_quarantined,
                    type: 'rest',
                    color: '#cbd5e0',
                  },
                ]}
              />
            </div>
          ),
          label: 'Status History',
        },
        {
          content: (
            <BuildLink
              id={test.execution_details?.build_id}
              link
              type={test.execution_details?.build_tag}
            />
          ),
          label: 'Latest Job',
        },
        {
          content: (
            <div className="inline-flex items-center">
              <Image alt="" className="inline mr-7" src="/assets/images/yellow-2.svg" width="16" />{' '}
              <span>
                {' '}
                <TasLink id={test.execution_details?.commit_id} path="commits" />
              </span>
            </div>
          ),
          label: 'Commit',
        },
        {
          content: test.transition ? (
            <div className="flex h-24 items-center">
              <Transition hideTooltip transition={test.transition} />
            </div>
          ) : (
            '-'
          ),
          // @ts-ignore
          label: (
            <span className="inline-flex items-center">
              Transition <Info type="transition" className="ml-3" />
            </span>
          ),
          tooltip: test.transition
            ? `${
                test.transition.test_previous_status
                  ? `${test.transition.test_previous_status} to ${test.transition.test_current_status}`
                  : `${test.transition.test_current_status} in first run`
              }`
            : '',
        },
        {
          content: (
            <div className="flex items-center whitespace-no-wrap">
              <Image src="/assets/images/user-gray.svg" alt="" width="12" className="inline mr-7" />
              <div className="flex items-baseline">
                <div className="-mr-12">
                  {test.execution_details?.commit_author ? (
                    <EllipsisText dots length="15" text={test.execution_details?.commit_author} />
                  ) : (
                    '-'
                  )}
                </div>
                {test.execution_details?.created_at &&
                test.execution_details?.created_at !== NULL_DATE_STRING ? (
                  <div className="text-tas-400 text-size-12">
                    <TimeAgo date={test.execution_details?.created_at} hideTitle />
                  </div>
                ) : (
                  '-'
                )}
              </div>
            </div>
          ),
          label: 'Contributor',
          tooltip: `By ${test.execution_details?.commit_author + ' on '} ${formattedFinishedDate}`,
        },
        {
          content: (
            <div className="flex justify-between items-end w-full">
              <div>
                <div className='flex items-center'>
                  <EllipsisText copy dots length="150" text={test.name} />
                  <IconFlakyTest data={test} className="mr-5" />
                  <IconQuarantineTest data={test} />
                </div>
                <div className="flex items-center justify-between mt-3 text-tas-400 text-size-12">
                  <span>
                    <img
                      alt=""
                      className="inline mr-7"
                      src="/assets/images/icon-blue.svg"
                      width="15"
                    />
                    <TasLink
                      id={test.test_suite_id}
                      notrim
                      path="tests-suites"
                      text={getText(test.test_suite_name)}
                    />
                  </span>
                </div>
              </div>
              <div className="inline-flex items-center text-tas-400 text-size-12">
                <img alt="" className="inline mr-7" src="/assets/images/code-file.svg" width="15" />
                <EllipsisText
                  copy
                  length="200"
                  text={test.test_locator.split('##')[0] && test.test_locator.split('##')[0]}
                />
              </div>
            </div>
          ),
          styles: {
            gridColumnEnd: '-1',
            gridColumnStart: '1',
          },
        },
      ]}
    />
  );
};

export default TestSummary;
