import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'underscore';

import { LazyLog } from 'react-lazylog';

import { statusFound } from 'redux/helper';
import { fetchBuildLogsBlobUrl } from 'redux/actions/buildAction';

import NoDataPlaceholder from 'components/NoDataPlaceholder';
import NoData from 'components/Nodata';
import LoaderWithMessage from 'modules/Builds/components/LoaderWithMessage';

const DiscoveryTaskSteps = [
  {
    label: 'PreRun',
    value: 'prerun',
  },
];

const ExecutionTaskSteps = [
  {
    label: 'Execution',
    value: 'execution',
  },
  {
    label: 'PostRun',
    value: 'postrun',
  },
];

const FTMTaskSteps = [
  {
    label: 'Execution',
    value: 'execution',
  },
];

const LogStream = ({
  buildId,
  buildStatus,
  repo,
  styles,
  task,
}: {
  buildId: string;
  buildStatus: string;
  repo: string;
  styles: any;
  task: any;
}) => {
  const isLoading = task ? statusFound(task.status) : statusFound(buildStatus);
  const isDisabled = isLoading || !buildId || !task;
  const taskSteps =
    task?.type === 'discover'
      ? DiscoveryTaskSteps
      : task?.type === 'flaky'
      ? FTMTaskSteps
      : ExecutionTaskSteps;

  const [activeStep, setActiveStep] = useState(taskSteps[0].value);
  const [fileLoadError, setFileLoadError] = useState(null);

  const dispatch = useDispatch();
  const state = useSelector((state) => state, _.isEqual);
  const { buildData }: any = state;
  const { buildLogsBlobUrl }: any = buildData;

  const activeStepDataUrl = buildLogsBlobUrl?.[task?.task_id]?.[activeStep];

  const changeStep = (step: string) => {
    setFileLoadError(null);
    setActiveStep(step);
  };

  useEffect(() => {
    if (!activeStepDataUrl && activeStep && !isDisabled) {
      dispatch(fetchBuildLogsBlobUrl(repo, buildId, task.task_id, activeStep));
    }
  }, [repo, buildId, task, activeStep, activeStepDataUrl, isDisabled]);

  useEffect(() => {
    changeStep(taskSteps[0].value);
  }, [task]);

  if (isDisabled && isLoading) {
    return <LoaderWithMessage message="Your logs will appear here once the job is complete." />;
  }

  return (
    <div className="flex flex-col bg-white" style={{ minHeight: styles.minHeight }}>
      {!isDisabled && repo && (
        <ul className="radius-3 overflow-hidden h-full flex flex-1 flex-col p-8">
          {taskSteps.map((step) => (
            <li
              key={step.value}
              className={`border flex flex-col ${activeStep === step.value ? 'flex-1' : ''}`}
            >
              <div
                className={`flex items-center justify-between px-10 py-5 cursor-pointer ${
                  activeStep === step.value ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-300'
                }`}
                onClick={() => changeStep(step.value === activeStep ? '' : step.value)}
              >
                <div className="inline-flex items-center">
                  <span
                    className={`cursor-pointer rounded inline-block arrow__down__icon  arrow__down__${
                      step.value === activeStep
                    }`}
                  >
                    <img src="/assets/images/arrow_down_gray.svg" alt="..." width="8" />
                  </span>
                  <div
                    className={`text-size-12 text-black ml-15 ${
                      step.value === activeStep ? 'opacity-60' : 'opacity-40'
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
              </div>
              {activeStep === step.value && (
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

export default LogStream;
