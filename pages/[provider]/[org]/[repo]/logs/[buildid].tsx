import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';

import _ from 'underscore';
import debounce from 'lodash.debounce';
import { areEqual, FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import Tooltip from 'react-simple-tooltip';

import usePrevious from 'hooks/usePrevious';

import { fetchCurrentBuild, fetchBuildTasks, unmountBuildLogs } from 'redux/actions/buildAction';

import { TaskStatusTypes } from 'constants/StatusTypes';
import { TaskStatusLabels } from 'constants/StatusLabels';

import { clipText } from 'helpers/genericHelpers';
import { getDateDifference } from 'helpers/dateHelpers';
import { getEnumKeyName } from 'helpers/enumHelpers';
import { statusFound } from 'redux/helper';

import BadgeV2 from 'components/BadgeV2';
import BuildLink from 'components/Build/Link';
import Duration from 'components/Duration';
import EllipsisText from 'components/EllipsisText';
import Image from 'components/Tags/Image';
import Layout from 'components/Layout';
import TimeAgo from 'components/TimeAgo';

const LogStream = dynamic(() => import('modules/Logs/sections/LogStream'), {
  ssr: false,
});

const DEFAULT_STATUS_ICON = '/assets/images/mask-gray.svg';
const IconStatusMap = {
  // [TaskStatusTypes.ABORTED]: '/assets/images/icon_error.svg',
  [TaskStatusTypes.ERROR]: '/assets/images/icon_error.svg',
  [TaskStatusTypes.FAILED]: '/assets/images/icon_error.svg',
  [TaskStatusTypes.INITIATING]: DEFAULT_STATUS_ICON,
  [TaskStatusTypes.PASSED]: '/assets/images/icon_green.svg',
  [TaskStatusTypes.RUNNING]: DEFAULT_STATUS_ICON,
};

const HEADER_HEIGHT_SPACING = 255;
const ROW_HEIGHT = 70;
const LOADED = 2;

let itemStatusMap: { [key: number]: number } = {};
const isItemLoaded = (index: number) => !!itemStatusMap[index];

const setItemLoadedStatusForRecentlyLoadedPage = (list: any[]) => {
  for (let index = list.length && list.length - 11; index < list.length; index++) {
    itemStatusMap[index] = LOADED;
  }
};

const TaskTypeToLabel = {
  discover: 'Discovery',
  execute: 'Execution',
} as any;

const ItemRow = (props: any) => {
  const { data, index, style, setActiveTask, activeTask, getTaskDuration } = props || {};
  let label;
  const dataItem = data[index];
  if (itemStatusMap[index] === LOADED && dataItem) {
    const status = dataItem.status as TaskStatusTypes;
    label = (
      <div
        className={`pl-10 py-10 cursor-pointer border-gray-150 flex ${
          activeTask?.task_id === dataItem.task_id ? 'bg-gray-100' : ''
        } rounded whitespace-no-wrap`}
        key={dataItem.task_id}
        onClick={() => setActiveTask(dataItem)}
      >
        <div className="w-14 flex-shrink-0">
          <Tooltip
            className="react_simple_tooltip react_simple_tooltip-text_normal"
            content={
              TaskStatusLabels[
                getEnumKeyName(status, TaskStatusTypes) as keyof typeof TaskStatusLabels
              ] || status
            }
            placement="right"
          >
            <Image
              alt={status}
              className="w-full"
              src={IconStatusMap[status] || DEFAULT_STATUS_ICON}
            />
          </Tooltip>
        </div>
        <div className="flex-1 ml-5">
          <div className="text-size-14 flex text-black mb-10">
            <span className="flex mr-4 text-tas-400">{index + 1}. </span>
            <span className="flex mr-4 text-tas-400">{TaskTypeToLabel[dataItem.type]} Task: </span>
            <EllipsisText dots length={5} text={dataItem.task_id} copy />
          </div>
          <div className="flex text-size-12 justify-between text-tas-400 pr-10">
            <div>
              took <Duration value={getTaskDuration(dataItem)} />
            </div>
            <div>
              <TimeAgo date={dataItem.created_at} />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    label = (
      <div className="w-full px-15">
        <div className="placeholder-content"></div>
      </div>
    );
  }
  return (
    <div className="ListItem" style={style}>
      {label}
    </div>
  );
};

const LogsPage: NextPage = () => {
  const router = useRouter();
  const { buildid, org, provider, repo }: any = router.query;

  const dispatch = useDispatch();
  const state = useSelector((state) => state, _.isEqual);
  const { buildData }: any = state;
  const {
    buildTasks,
    buildTasksMetadata,
    currentBuild,
    isBuildTasksFetching,
    isCurrentBuildFetching,
  } = buildData;

  const prevIsBuildTasksFetching = usePrevious(isBuildTasksFetching);

  const [activeTask, setActiveTask] = useState<any>(null);

  const filteredTasks = buildTasks;

  const buildDuration =
    currentBuild &&
    !statusFound(currentBuild.status, true /** includeFailed */, true /** includeError */)
      ? getDateDifference(currentBuild.start_time, currentBuild.end_time)
      : null;

  const getTaskDuration = (task: any) =>
    task ? getDateDifference(task.start_time, task.end_time) : null;

  const fetchTasksList = (cursor = '') => {
    dispatch(fetchBuildTasks(repo, buildid, cursor));
  };

  const fetchNextPageTasksList = useCallback(
    debounce(() => {
      fetchTasksList(buildTasksMetadata?.next_cursor);
    }, 500),
    [buildTasksMetadata?.next_cursor]
  );

  useEffect(() => {
    return fetchNextPageTasksList.cancel;
  }, [buildTasksMetadata?.next_cursor]);

  useEffect(() => {
    if (repo) {
      dispatch(fetchCurrentBuild(repo, buildid));
      fetchTasksList();
    }
  }, [repo]);

  useEffect(() => {
    buildTasks?.[0] && !activeTask && setActiveTask(buildTasks[0]);
  }, [buildTasks, activeTask]);

  useEffect(() => {
    return () => {
      dispatch(unmountBuildLogs());
      itemStatusMap = {};
    };
  }, []);

  /**
   * @description
   * - This code is used to set item loading status for recently fetched page, when loading completes
   * - Not doing it in useEffect because want it before the list is rendered
   */
  if (prevIsBuildTasksFetching && !isBuildTasksFetching) {
    setItemLoadedStatusForRecentlyLoadedPage(buildTasks);
  }

  return (
    <Layout title={`TAS: ${repo} / Logs / ${clipText(buildid)}`}>
      <div className="flex flex-col h-full p-20 pb-0">
        <div className="mb-20">
          <Link href={`/${provider}/${org}/${repo}/jobs/${buildid}`}>
            <a>
              <Image
                className="mr-3 h-24 inline-block cursor-pointer"
                src="/assets/images/icon/arrow_left_box.svg"
              />{' '}
              <span className="text-size-14 text-black mb-3">Back to Job</span>
            </a>
          </Link>
        </div>

        <div className="w-full">
          {!isCurrentBuildFetching && currentBuild?.status ? (
            <div className="mb-20 bg-white p-15 pt-20 flex flex-wrap rounded-md text-size-14">
              <div className="inline-flex w-full justify-between items-center">
                <div className="inline-flex items-center">
                  <BadgeV2 status={currentBuild.status} remark={currentBuild?.tasks?.[0]?.remark} />
                  <span className="rounded transition inline-flex items-center ml-10 text-size-14">
                    <BuildLink type={currentBuild.build_tag} id={currentBuild.id} />
                  </span>
                  <span className="flex mr-7 text-tas-400">
                    {buildDuration && (
                      <span>
                        took <Duration value={buildDuration} /> to complete
                      </span>
                    )}
                  </span>
                </div>
                <div className="inline-flex w-2/12 justify-end tracking-wide">
                  <span className="text-tas-400">
                    Executed <TimeAgo date={currentBuild.created_at} />
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-20 bg-white p-15 pt-20 flex flex-wrap rounded-md text-size-14 justify-between">
              <div className="flex w-10/12">
                <div className="w-1/12 pr-15">
                  <div className="placeholder-content"></div>
                </div>
                <div className="w-1/12 pr-15">
                  <div className="placeholder-content"></div>
                </div>
                <div className="w-2/12 pr-15">
                  <div className="placeholder-content"></div>
                </div>
              </div>
              <div className="flex w-2/12">
                <div className="w-full">
                  <div className="placeholder-content"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 pb-20 flex">
          <div className="width-240">
            <div className="bg-white rounded-md overflow-hidden h-full">
              <div className="p-20 text-size-16 text-black">Tasks</div>
              <div className="px-10 pb-10">
                <div className="w-full overflow-hidden">
                  {filteredTasks.length ? (
                    <InfiniteLoader
                      loadMoreItems={fetchNextPageTasksList}
                      isItemLoaded={isItemLoaded}
                      itemCount={
                        buildTasksMetadata?.next_cursor
                          ? filteredTasks?.length + 1
                          : filteredTasks?.length
                      }
                    >
                      {({ onItemsRendered, ref }) => (
                        <List
                          className="List designed-scroll"
                          height={window.innerHeight - HEADER_HEIGHT_SPACING}
                          itemCount={
                            buildTasksMetadata?.next_cursor
                              ? filteredTasks?.length + 1
                              : filteredTasks?.length
                          }
                          itemSize={ROW_HEIGHT}
                          onItemsRendered={onItemsRendered}
                          ref={ref}
                          width={`100%`}
                        >
                          {React.memo(
                            (props: any) => (
                              <ItemRow
                                {...props}
                                data={filteredTasks}
                                setActiveTask={setActiveTask}
                                activeTask={activeTask}
                                getTaskDuration={getTaskDuration}
                              />
                            ),
                            areEqual
                          )}
                        </List>
                      )}
                    </InfiniteLoader>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="ml-20 flex-1">
            {statusFound(currentBuild.status) && (
              <div className="px-30 bg-white mb-15 flex flex-col py-15 rounded-md overflow-hidden h-full">
                <div className="text-size-18 tracking-wider">Job Running...</div>
                <div className="mt-5 opacity-40 text-size-14 tracking-wide">
                  Your job logs will appear here once the job is complete.
                </div>
              </div>
            )}
            <div className="bg-white rounded-md p-10">
              <LogStream
                repo={repo}
                buildId={buildid}
                task={activeTask}
                buildStatus={currentBuild.status}
                styles={{ minHeight: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LogsPage;
