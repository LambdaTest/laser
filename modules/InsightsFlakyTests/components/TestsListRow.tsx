import { CellMeasurer } from 'react-virtualized';
import Link from 'next/link';
import moment from 'moment';

import { getText } from 'helpers/genericHelpers';
import { roundOff } from 'helpers/mathHelpers';

import { FlakyTestStatusColors } from 'constants/StatusColors';
import { FlakyTestStatusLabels } from 'constants/StatusLabels';
import { FlakyTestStatusTypes } from 'constants/StatusTypes';
import { NULL_DATE_STRING, NULL_DATE_UTC_STRING } from 'constants/index';
import DateFormats from 'constants/DateFormats';

import EllipsisText from 'components/EllipsisText';
import Image from 'components/Tags/Image';
import Loader from 'components/Loader';
import TasLink from 'components/TasLink';
import Text from 'components/Tags/Text';
import TimeAgo from 'components/TimeAgo';
import Tooltip from 'components/Tooltip';

const formatTimestamp = (timestamp: string) => {
  if ((timestamp && timestamp === NULL_DATE_STRING) || timestamp === NULL_DATE_UTC_STRING) {
    return null;
  }

  const targetDate = moment(timestamp);
  const targetYear = targetDate.get('year');

  const todayYear = moment().get('year');

  return targetDate.format(
    targetYear === todayYear
      ? DateFormats.DISPLAY_WITH_TIME_WITHOUT_YEAR
      : DateFormats.DISPLAY_WITH_TIME
  );
};

const TestsListRow = ({
  cache,
  index,
  isVisible,
  org,
  parent,
  provider,
  repo,
  style,
  tests,
}: any) => {
  if (!tests?.[index]?.test_id) {
    return null;
  }

  const { status, test_id, test_name, test_suite_id, test_suite_name, execution_meta, flaky_rate } =
    tests[index];

  const {
    first_flake_commit_id,
    first_flake_time,
    jobs_count,
    last_flake_commit_id,
    last_flake_time,
  } = execution_meta;

  const firstFlakyTestTime = formatTimestamp(first_flake_time);
  const firstFlakyCommitId = first_flake_commit_id;

  const lastFlakyTestTime = formatTimestamp(last_flake_time);
  const lastFlakyCommitId = last_flake_commit_id;

  const flakyRate = flaky_rate && roundOff(flaky_rate, 2);

  const statusKey = (status || '').toUpperCase() as keyof typeof FlakyTestStatusTypes;
  const statusColor = FlakyTestStatusColors[statusKey];
  const statusLabel = FlakyTestStatusLabels[statusKey];

  return (
    <>
      {test_id && (
        <CellMeasurer cache={cache} columnIndex={0} key={test_id} rowIndex={index} parent={parent}>
          {() => (
            <div style={style}>
              {!isVisible ? (
                <Loader loader_for="build_tests" length={1} />
              ) : (
                <div className="tests__section__row border-b">
                  <Link href={`/${provider}/${org}/${repo}/tests/${test_id}`}>
                    <a data-amplitude="tas_open_test_details">
                      <div className="flex bg-white py-10 items-center list-hover  justify-between">
                        <div className="px-16" style={{ width: '40%' }}>
                          <Text className="flex items-center">
                            <Tooltip content={statusLabel} placement="right" offset={[0, 10]}>
                              <div
                                className="mmw6 h-inherit self-stretch rounded-lg mr-12 p-2"
                                style={{ background: statusColor }}
                                data-tip={statusLabel}
                                data-place="right"
                                data-offset={"{'top': 0, 'right': 0}"}
                              ></div>
                            </Tooltip>
                            <Text size="span" className="w-full">
                              <Tooltip content={test_name} placement="top" offset={[0, 5]}>
                                <span>
                                  {test_name ? (
                                    <EllipsisText copy dots length={35} text={test_name} />
                                  ) : (
                                    '-'
                                  )}
                                </span>
                              </Tooltip>
                              <Text size="span" className="flex">
                                <span className="flex justify-between w-full">
                                  <div className="inline-flex items-center">
                                    <Image
                                      className="mr-5"
                                      src="/assets/images/icon/circle-blue.svg"
                                      width="10"
                                    />
                                    <span className="text-tas-400 text-size-12">
                                      <TasLink
                                        id={test_suite_id}
                                        notrim
                                        path="tests-suites"
                                        text={
                                          <EllipsisText
                                            copy
                                            dots
                                            length={20}
                                            text={getText(test_suite_name) || 'N/A'}
                                          />
                                        }
                                      />
                                    </span>
                                  </div>
                                </span>
                              </Text>
                            </Text>
                          </Text>
                        </div>
                        <div className="pr-16 inline-flex items-center" style={{ width: '16%' }}>
                          <div className="items-center">
                            <span className="w-full leading-none inline-flex items-center">
                              {firstFlakyTestTime ? (
                                <div>
                                  <div className="text-size-14 mb-5">{firstFlakyTestTime}</div>
                                  <div className="text-tas-400 text-size-12 flex items-center">
                                    <img
                                      src="/assets/images/yellow-2.svg"
                                      alt=""
                                      width="16"
                                      className="mr-5"
                                    />
                                    <TasLink
                                      id={firstFlakyCommitId}
                                      notrim
                                      path="commits"
                                      text={
                                        <EllipsisText text={firstFlakyCommitId} copy length="7" />
                                      }
                                    />
                                  </div>
                                </div>
                              ) : (
                                '-'
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="pr-16 inline-flex items-center" style={{ width: '16%' }}>
                          <div className="items-center">
                            <span className="w-full leading-none inline-flex items-center">
                              {lastFlakyTestTime ? (
                                <div>
                                  <div className="text-size-14 mb-5">
                                    <TimeAgo date={last_flake_time} />
                                  </div>
                                  <div className="text-tas-400 text-size-12 flex items-center">
                                    <img
                                      src="/assets/images/yellow-2.svg"
                                      alt=""
                                      width="16"
                                      className="mr-5"
                                    />
                                    <TasLink
                                      id={lastFlakyCommitId}
                                      notrim
                                      path="commits"
                                      text={
                                        <EllipsisText text={lastFlakyCommitId} copy length="7" />
                                      }
                                    />
                                  </div>
                                </div>
                              ) : (
                                '-'
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="pr-16 inline-flex items-center" style={{ width: '14%' }}>
                          <div className="items-center">
                            <span className="w-full leading-none inline-flex items-center">
                              {jobs_count != null ? jobs_count : '-'}
                            </span>
                          </div>
                        </div>
                        <div className="pr-16 inline-flex items-center" style={{ width: '14%' }}>
                          <div className="inline-flex items-center">
                            <span className="w-full leading-none inline-flex items-center">
                              {flakyRate != null ? `${flakyRate}%` : '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CellMeasurer>
      )}
    </>
  );
};

export default TestsListRow;
