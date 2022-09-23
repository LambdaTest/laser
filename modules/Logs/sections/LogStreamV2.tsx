import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'underscore';

import { LazyLog } from 'react-lazylog';

import { statusFound } from 'redux/helper';
import { fetchBuildLogsBlobUrl } from 'redux/actions/buildAction';

import NoDataPlaceholder from 'components/NoDataPlaceholder';
import NoData from 'components/Nodata';
import LoaderWithMessage from 'modules/Builds/components/LoaderWithMessage';

const TaskTypeToLabel = {
  discover: 'Discovery',
  execute: 'Task',
  flaky: 'FTM Task',
} as any;

const DiscoveryTaskSteps = [
  {
    label: ' - PreRun',
    value: 'prerun',
  },
];

const ExecutionTaskSteps = [
  {
    label: ' - Test Execution',
    value: 'execution',
  },
  {
    label: ' - PostRun',
    value: 'postrun',
  },
];

const getTaskSteps = (type: string) =>
  type === 'discover' ? DiscoveryTaskSteps : ExecutionTaskSteps;

const LogItemRow = ({
  currentTask: _task,
  selectedTask: task,
  selectedStep: step,
  changeLog,
  fileLoadError,
  setFileLoadError,
  activeStepDataUrl,
  taskIndex,
}: any) => {
  const steps = getTaskSteps(_task?.type);
  return (
    <>
      {steps.map((_step) => {
        const stepLabel = `${TaskTypeToLabel[_task?.type] || ''} ${
          _task.type === 'execute' ? taskIndex + 1 : ''
        } ${_step.label}`;
        const isStepActive = step === _step.value && task?.task_id === _task.task_id;
        return (
          <li
            key={_step.value + '_' + _task.task_id}
            className={`border flex flex-col ${isStepActive ? 'flex-1' : ''}`}
          >
            <div
              className={`flex items-center justify-between px-10 py-5 cursor-pointer ${
                isStepActive ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-300'
              }`}
              onClick={() => (isStepActive ? changeLog(null, '') : changeLog(_task, _step.value))}
            >
              <div className="inline-flex items-center">
                <span
                  className={`cursor-pointer rounded inline-block arrow__down__icon  arrow__down__${isStepActive}`}
                >
                  <img src="/assets/images/arrow_down_gray.svg" alt="..." width="8" />
                </span>
                <div
                  className={`text-size-12 text-black ml-15 ${
                    isStepActive ? 'opacity-60' : 'opacity-40'
                  }`}
                >
                  {stepLabel}
                </div>
              </div>
            </div>
            {isStepActive && (
              <div className="bg-gray-100 flex flex-1">
                {!fileLoadError && !!activeStepDataUrl && (
                  <div className="w-full flex-1">
                    <LazyLog
                      caseInsensitive
                      className="tas-logs text-size-14 bg-gray-970"
                      // enableSearch
                      extraLines={1}
                      // formatPart={(part: string) => part?.trim?.()}
                      url={activeStepDataUrl}
                      onError={setFileLoadError}
                    />
                  </div>
                )}
                {!fileLoadError && !activeStepDataUrl && (
                  <div className="flex flex-1 h-full w-full flex-col">
                    <div className="w-full p-16 pb-0">
                      <div className="placeholder-content"></div>
                    </div>
                    <div className="w-full p-16 pb-0">
                      <div className="placeholder-content"></div>
                    </div>
                    <div className="w-full p-16 pb-0">
                      <div className="placeholder-content"></div>
                    </div>
                    <div className="w-full p-16 pb-0">
                      <div className="placeholder-content"></div>
                    </div>
                  </div>
                )}
                {!!fileLoadError && (
                  <div className="flex-1">
                    <NoDataPlaceholder height="100%" message="No logs found for selected task." />
                  </div>
                )}
              </div>
            )}
          </li>
        );
      })}
    </>
  );
};

const LogStreamV2 = ({
  buildId,
  buildStatus,
  list: { discoveryTasks, executionTasks },
  repo,
  styles,
  tasks,
}: {
  buildId: string;
  buildStatus: string;
  list: { discoveryTasks: any[]; executionTasks: any[]; ftmTasks: any[] };
  repo: string;
  styles: any;
  tasks: any[];
}) => {
  const [activeLog, setActiveLog] = useState<any>(null);
  const [task, step]: any = activeLog || [];

  const isLoading = task ? statusFound(task.status) : statusFound(buildStatus);
  const isDisabled = isLoading || !buildId || !tasks.length;

  const [fileLoadError, setFileLoadError] = useState(null);

  const dispatch = useDispatch();
  const state = useSelector((state) => state, _.isEqual);
  const { buildData }: any = state;
  const { buildLogsBlobUrl }: any = buildData;

  const activeStepDataUrl = buildLogsBlobUrl?.[task?.task_id]?.[step];

  const changeLog = (_task = task, _step: string) => {
    setFileLoadError(null);
    setActiveLog([_task, _step]);
  };

  useEffect(() => {
    if (!activeStepDataUrl && step && !isDisabled && task) {
      console.log(repo, buildId, task.task_id, step);
      dispatch(fetchBuildLogsBlobUrl(repo, buildId, task.task_id, step));
    }
  }, [repo, buildId, activeLog, activeStepDataUrl, isDisabled]);

  useEffect(() => {
    if (tasks.length && !task && !activeLog) {
      const steps = getTaskSteps(tasks[0]?.type);
      changeLog(tasks[0], steps[0].value);
    }
  }, [tasks.length, task, activeLog]);

  if (isDisabled && isLoading) {
    return <LoaderWithMessage message="Your logs will appear here once the job is complete." />;
  }

  return (
    <div className="flex flex-col bg-white" style={{ minHeight: styles.minHeight }}>
      {!isDisabled && repo && (
        <ul className="radius-3 overflow-hidden h-full flex flex-1 flex-col p-8">
          {discoveryTasks.map((_task, index) => (
            <LogItemRow
              key={_task.task_id}
              activeStepDataUrl={activeStepDataUrl}
              changeLog={changeLog}
              currentTask={_task}
              fileLoadError={fileLoadError}
              selectedStep={step}
              selectedTask={task}
              setFileLoadError={setFileLoadError}
              taskIndex={index}
            />
          ))}
          {executionTasks.map((_task, index) => (
            <LogItemRow
              key={_task.task_id}
              activeStepDataUrl={activeStepDataUrl}
              changeLog={changeLog}
              currentTask={_task}
              fileLoadError={fileLoadError}
              selectedStep={step}
              selectedTask={task}
              setFileLoadError={setFileLoadError}
              taskIndex={index}
            />
          ))}
        </ul>
      )}
      {isDisabled && !isLoading && (
        <div className="bg-white flex-1 h-full flex items-center justify-center">
          <NoData msg="No logs found for selected task!" />
        </div>
      )}
    </div>
  );
};

export default LogStreamV2;
