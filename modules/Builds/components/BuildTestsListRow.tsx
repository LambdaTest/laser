import { CellMeasurer } from 'react-virtualized';

import { getText } from 'helpers/genericHelpers';

import Duration from 'components/Duration';
import EllipsisText from 'components/EllipsisText';
import Image from 'components/Tags/Image';
import Loader from 'components/Loader';
import TasLink from 'components/TasLink';
import Text from 'components/Tags/Text';
import Tooltip from 'components/Tooltip';
import Transition from 'components/Transition';
import VerticalLine from 'Graphs/VerticalLine';
import Link from 'next/link';


const getPercentage = (partialValue: number, totalValue: number, toFixed=2) => {
  if (partialValue === 0 && totalValue === 0) {
    return 0;
  } else {
    return parseFloat(`${((100 * partialValue) / totalValue).toFixed(toFixed)}`);
  }
};

const RowRenderer = ({
  cache,
  index,
  isVisible,
  org,
  parent,
  provider,
  repo,
  style,
  tests,
  totalTime,
}: any) => {
  return (
    <>
      {tests && tests[index] && tests[index].test_id && (
        <CellMeasurer
          cache={cache}
          columnIndex={0}
          key={tests[index].test_id}
          rowIndex={index}
          parent={parent}
        >
          {() => (
            <div style={style}>
              {!isVisible ? (
                <Loader loader_for="build_tests" length={1} />
              ) : (
                <div className="tests__section__row border-b">
                  <Link href={`/${provider}/${org}/${repo}/tests/${tests[index].test_id}`}>
                    <a data-amplitude="tas_open_test_details">
                      <div className="flex bg-white py-10 items-center list-hover  justify-between">
                        <div className="px-15 w-4/12" style={{ width: '29%' }}>
                          <Text className="flex items-center">
                            <VerticalLine
                              className="mmw6 h-inherit self-stretch rounded-lg mr-12"
                              type={tests[index].status}
                            />
                            <Text size="span" className="w-full">
                              <Tooltip
                                content={tests[index].test_name}
                                placement="top"
                                offset={[0, 5]}
                              >
                                <span>
                                  {tests[index].test_name ? <EllipsisText
                                    copy
                                    dots
                                    length={20}
                                    text={tests[index].test_name}
                                  /> : '-'}

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
                                        id={tests[index].test_suite_id}
                                        notrim
                                        path="tests-suites"
                                        text={
                                          <EllipsisText
                                            copy
                                            dots
                                            length={20}
                                            text={
                                              getText(tests[index].test_suite_name)
                                                ? getText(tests[index].test_suite_name)
                                                : 'N/A'
                                            }
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
                        <div className="pr-15 inline-flex items-center" style={{ width: '14%' }}>
                          <div className="items-center">
                            <span className="w-full leading-none inline-flex items-center">
                              <Transition transition={tests[index].transition} />
                            </span>
                          </div>
                        </div>
                        <div className="pr-15 inline-flex items-center" style={{ width: '14%' }}>
                          <div className="items-center">
                            <span className="w-full mr-7 leading-none">
                              {tests[index].duration >= 0 ? (
                                <Duration value={tests[index].duration} />
                              ) : (
                                '-'
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="pr-15 inline-flex items-center" style={{ width: '14%' }}>
                          <div className="items-center">
                            <span className="w-full leading-none inline-flex items-center">
                              {totalTime ? <>
                              {getPercentage(tests[index].duration, totalTime, 1) < 1 ? '< 1' : getPercentage(tests[index].duration, totalTime, 1)} %
                              </> : '-'}
                            </span>
                          </div>
                        </div>
                        <div className="pr-15 inline-flex items-center" style={{ width: '14%' }}>
                          <div className="inline-flex items-center overflow-hidden">
                            <img src="/assets/images/user-gray.svg" alt="" className="mr-10 h-16" />
                            {tests[index].commit_author ? (
                              <Tooltip
                                content={tests[index].commit_author}
                                placement="top"
                                offset={[0, 5]}
                              >
                                <span className="block text-ellipsis">
                                  {' '}
                                  {tests[index].commit_author}
                                </span>
                              </Tooltip>
                            ) : (
                              '-'
                            )}
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

export default RowRenderer;
