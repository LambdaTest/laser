import React, { useMemo } from 'react';

import _ from 'underscore';
import moment from 'moment';

import { getText } from 'helpers/genericHelpers';

import DateFormats from 'constants/DateFormats';

import BadgeV2 from 'components/BadgeV2';
import BuildLink from 'components/Build/Link';
import Duration from 'components/Duration';
import EllipsisText from 'components/EllipsisText';
import Image from 'components/Tags/Image';
import SummarySection from 'components/SummarySection';
import TasLink from 'components/TasLink';
import TimeAgo from 'components/TimeAgo';

import StackedHrV2, { StackedHrType } from 'Graphs/StackedHrV2';

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

const TestSuiteSummary = ({ testSuite }: any) => {
  const formattedFinishedDate = useMemo(() => {
    return moment(testSuite?.execution_details?.created_at).format(DateFormats.DISPLAY_WITH_TIME);
  }, [testSuite?.execution_details?.created_at]);

  return (
    <SummarySection
      list={[
        {
          content: <BadgeV2 status={testSuite.execution_details?.status} />,
          label: 'Status',
        },
        {
          content: (
            <div className="inline-flex items-baseline">
              {testSuite.total_tests || testSuite.total_tests == 0 ? testSuite.total_tests : '-'}
            </div>
          ),
          label: '# of tests',
        },
        {
          content: (
            <div className="inline-flex items-baseline">
              <span className="flex  mr-7">{testSuite.execution_meta?.total_executions}</span>
              <span className="text-tas-400 flex text-size-12">
                {testSuite.execution_meta?.total_executions > 1 ? 'times' : 'time'}
              </span>
            </div>
          ),
          label: 'Ran',
        },
        {
          content:
            testSuite.execution_meta?.avg_test_suite_duration >= 0 ? (
              <Duration value={testSuite.execution_meta?.avg_test_suite_duration} />
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
                    count: testSuite.execution_meta?.tests_suite_passed,
                    type: 'passed',
                  },
                  {
                    count: testSuite.execution_meta?.tests_suite_failed,
                    type: 'failed',
                  },
                  {
                    count: testSuite.execution_meta?.tests_suite_skipped,
                    type: 'skipped',
                  },
                  {
                    count: testSuite.execution_meta?.tests_suite_blocklisted,
                    type: 'blocklisted',
                  },
                ]}
                type={StackedHrType.TEST}
                tooltipProps={{
                  label: 'Test Suite Runs',
                }}
                footer={[
                  {
                    count: testSuite.execution_meta?.tests_suite_passed,
                    type: 'passed',
                  },
                  {
                    count: testSuite.execution_meta?.tests_suite_failed,
                    type: 'failed',
                  },
                  {
                    count:
                      +testSuite.execution_meta?.tests_suite_skipped +
                      +testSuite.execution_meta?.tests_suite_blocklisted,
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
              id={testSuite.latest_build?.id}
              link
              type={testSuite.latest_build?.build_tag}
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
                <TasLink id={testSuite.execution_details?.commit_id} path="commits" />
              </span>
            </div>
          ),
          label: 'Commit',
        },
        {
          content: testSuite.execution_details?.created_at ? (
            <div className="whitespace-no-wrap">
              <TimeAgo date={testSuite.execution_details?.created_at} hideTitle />
            </div>
          ) : (
            '-'
          ),
          label: 'Executed',
          tooltip: `On ${formattedFinishedDate || '-'}`,
        },
        {
          content: (
            <div className="flex justify-between items-start w-full">
              <div>
                <img alt="" className="inline mr-7" src="/assets/images/icon-blue.svg" width="15" />
                <EllipsisText
                  copy
                  dots
                  length="150"
                  text={getText(testSuite.name) ? getText(testSuite.name) : testSuite.id}
                />
              </div>
              <div className="inline-flex items-center text-tas-400 text-size-12">
                <img alt="" className="inline mr-7" src="/assets/images/code-file.svg" width="15" />
                <EllipsisText copy length="200" text={getSuiteFileName(testSuite.name)} />
              </div>
            </div>
          ),
          styles: {
            gridColumnEnd: '-1',
            gridColumnStart: '1',
          },
        },
      ]}
      className="pb-0"
    />
  );
};

export default TestSuiteSummary;
