import { useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';

import { NULL_DATE_STRING } from 'constants/index';
import { TaskStatusLabels } from 'constants/StatusLabels';
import { TaskStatusTypes } from 'constants/StatusTypes';
import DateFormats from 'constants/DateFormats';

import { getDateDifference } from 'helpers/dateHelpers';
import { getEnumKeyName } from 'helpers/enumHelpers';
import { statusFound } from 'redux/helper';

import Duration from 'components/Duration';
import Image from 'components/Tags/Image';
import Info from 'components/Info';
import Tooltip from 'components/Tooltip';

interface BuildTasksListProps {
  hasMoreData: boolean;
  isLoading: boolean;
  list: { discoveryTasks: any[]; executionTasks: any[]; ftmTasks: any[] };
  loadMore: () => void;
  onSelect: (item: any) => void;
  selected: any;
  styles: any;
  isCollapsible: boolean;
}

const TaskTypeToLabelPrefix = {
  discover: 'Discovery Task',
  execute: 'Test Execution',
  flaky: 'FTM Task',
} as any;

const TaskTypeToLabelSuffix = {
  discover: <Info type="discovery" className="ml-3" />,
} as any;

const DEFAULT_STATUS_ICON = '/assets/images/mask-gray.svg';
const IconStatusMap = {
  // [TaskStatusTypes.ABORTED]: '/assets/images/icon/icon-Status-Aborted-Round.svg',
  [TaskStatusTypes.ERROR]: '/assets/images/icon/icon-Status-Error-Round.svg',
  [TaskStatusTypes.FAILED]: '/assets/images/icon/icon-Status-Failed-Round.svg',
  [TaskStatusTypes.INITIATING]: '/assets/images/icon/icon-Status-Initiating-Round.svg',
  [TaskStatusTypes.PASSED]: '/assets/images/icon/icon-Status-Passed-Round.svg',
  [TaskStatusTypes.RUNNING]: <div className="loader loader-base-blue">Loading...</div>,
};

const getTaskDuration = (task: any) =>
  task ? getDateDifference(task.start_time, task.end_time) : null;

// Task Prefix by type + Task Submodule Label + Task Index in that submodule group
const parseTasksTitle = (list: any[]) => {
  const processedList: any[] = [];

  const groupedList: any[] = list
    .map((task) => ({
      ...task,
      taskTitle: task.label
        ? TaskTypeToLabelPrefix[task.type] + ` - ${task.label}`
        : TaskTypeToLabelPrefix[task.type],
    }))
    .reduce((acc, task) => {
      acc[task.taskTitle] = acc[task.taskTitle] || [];
      acc[task.taskTitle].push(task);
      return acc;
    }, {});

  Object.values(groupedList).forEach((groupItem: any[]) => {
    if (groupItem.length === 1) {
      processedList.push(groupItem[0]);
    } else {
      groupItem.forEach((task, index) => {
        processedList.push({
          ...task,
          taskTitle: `${task.taskTitle} - Task ${index + 1}`,
        });
      });
    }
  });

  return processedList;
};

const ItemRow = ({ el, selected, onSelect }: any) => {
  const status = el.status as TaskStatusTypes;
  const icon = IconStatusMap[status] || DEFAULT_STATUS_ICON;
  return (
    <li
      className={`p-8 cursor-pointer flex border-b ${el.status} ${
        selected.task_id == el.task_id ? 'bg-blue-100' : ''
      }`}
      key={el.task_id}
      onClick={() => onSelect(el)}
    >
      <div className="flex items-baseline mt-4 w-14 flex-shrink-0 overflow-hidden">
        <Tooltip
          content={
            TaskStatusLabels[
              getEnumKeyName(status, TaskStatusTypes) as keyof typeof TaskStatusLabels
            ] || status
          }
          placement="right"
        >
          {typeof icon === 'string' ? (
            <div>
              <Image
                alt={status}
                className={`w-full status_icon_img ${status}`}
                src={icon as string}
              />
            </div>
          ) : (
            icon
          )}
        </Tooltip>
      </div>
      <div className="flex-1 ml-8 text-size-14">
        <div className="flex mr-4 text-black items-center">
          {el.taskTitle} {TaskTypeToLabelSuffix[el.type]}
        </div>
        {!statusFound(status) && el.start_time !== NULL_DATE_STRING && (
          <div className="flex justify-between text-size-12 text-tas-400 mt-4">
            <div className="text-ellipsis">
              {moment(el.start_time).format(DateFormats.DISPLAY_WITH_TIME)}
            </div>
            {
              // @ts-ignore
              getTaskDuration(el) >= 0 && (
                <div className="flex justify-between items-center">
                  <img src="/assets/images/timer.svg" className="mr-4" width="10" />{' '}
                  <span className="text-ellipsis">
                    <Duration value={getTaskDuration(el)} />
                  </span>
                </div>
              )
            }
          </div>
        )}
      </div>
    </li>
  );
};

const BuildTasksList = ({
  hasMoreData,
  isLoading,
  list,
  loadMore,
  onSelect,
  selected,
  styles,
  isCollapsible,
}: BuildTasksListProps) => {
  const [isOpen, setIsOpen] = useState(isCollapsible ? false : true);

  const tasks = useMemo(() => {
    const discoveryTasks = parseTasksTitle(list.discoveryTasks);
    const executionTasks = parseTasksTitle(list.executionTasks);
    const ftmTasks = parseTasksTitle(list.ftmTasks);

    return isOpen ? [...discoveryTasks, ...executionTasks, ...ftmTasks] : ftmTasks;
  }, [list.discoveryTasks.length, list.executionTasks.length, list.ftmTasks.length, isOpen]);

  const toggleOpen = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <div
      className="bg-white radius-3 flex-col width-240 flex-shrink-0 sticky mt-16 mb-16"
      style={styles}
    >
      <div
        className={`border-b px-16 py-12 text-size-14 flex items-center justify-between ${
          isCollapsible ? 'cursor-pointer' : ''
        }`}
        onClick={isCollapsible ? toggleOpen : () => {}}
      >
        <span className="">Tasks</span>
        {isCollapsible && (
          <span className={`inline-flex w-8 items-center ml-8 ${isOpen ? '' : 'tas-rotate-270'}`}>
            <img className="w-full" src="/assets/images/arrow_down_gray.svg" alt="..." width="10" />
          </span>
        )}
      </div>
      <ul
        className="lt-scroll lt-scroll-no-border designed-scroll flex-1 designed-scroll-commit-list"
        style={{
          maxHeight: `calc(100% - 46px)`,
        }}
      >
        <InfiniteScroll
          getScrollParent={() => document.querySelector('.designed-scroll-commit-list')}
          hasMore={hasMoreData && !isLoading}
          initialLoad
          loader={<div className="loader"></div>}
          loadMore={hasMoreData && !isLoading ? loadMore : () => {}}
          pageStart={0}
          threshold={50}
          useWindow={false}
        >
          {tasks.map((el: any, index: number) => (
            <ItemRow
              el={el}
              key={el.task_id}
              index={index}
              selected={selected}
              onSelect={onSelect}
            />
          ))}
        </InfiniteScroll>
      </ul>
    </div>
  );
};

export default BuildTasksList;
