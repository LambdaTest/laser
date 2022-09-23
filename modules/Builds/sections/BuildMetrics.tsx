import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useRouter } from 'next/router';

import _ from 'underscore';

import { fetchMetrics } from 'redux/actions/buildAction';

import { statusFound } from 'redux/helper';
import { convertBytesToGigabyte } from 'helpers/genericHelpers';

import BuildLineChart from '../components/BuildLineChart';
import InsightsPlaceholder from 'components/InsightsPlaceholder';

export default function BuildMetrics({
  currentBuild,
  currentBuildTask,
  buildAndTaskFetching,
  styles,
}: any) {
  const router = useRouter();
  const { buildid, repo } = router.query;

  const [isFull, setIsFull] = useState(false);

  const dispatch = useDispatch();
  const state: any = useSelector((state) => state, _.isEqual);
  const {
    isMetricsFetching,
    metrics: data,
  }: {
    isMetricsFetching: boolean;
    metrics: any;
  } = state?.buildData;

  const isRunComplete = !statusFound(currentBuildTask?.status);

  const loading = useMemo(() => {
    if (buildAndTaskFetching) {
      return true;
    }
    if (currentBuildTask && statusFound(currentBuildTask?.status)) {
      return true;
    }
    if (!currentBuildTask && statusFound(currentBuild?.status)) {
      return true;
    }
    if (!currentBuildTask) {
      return false;
    }
    return isMetricsFetching;
  }, [currentBuildTask?.status, currentBuild?.status, isMetricsFetching, buildAndTaskFetching]);

  const getMetricsData = (taskId: any) => {
    dispatch(fetchMetrics({ buildid, repo, taskId }));
  };

  useEffect(() => {
    if (currentBuildTask) {
      getMetricsData(currentBuildTask.task_id);
    }
  }, [currentBuildTask]);

  if (!isRunComplete && data?.length === 0) {
    return (
      <>
      <div className="h-32 bg-info-yellow text-size-14 px-16 radius-3 w-full flex items-center text-yellow-800">
        <span className="text-ellipsis opacity-50">Your metrics data will appear here once the job is complete.</span>
      </div>
      <div className='bg-white p-15'>
      <div className={`flex w-full`}>
        <div className={'w-6/12'}>
          <InsightsPlaceholder size={InsightsPlaceholder.SizeVariant.MEDIUM} />
        </div>
        <div className={'w-6/12 pl-8'}>
          <InsightsPlaceholder size={InsightsPlaceholder.SizeVariant.MEDIUM} />
        </div>
      </div>
      </div>
      </>
    );
  }

  const handleGraphLayoutChange = (isFullLayout = false) => {
    return () => {
      if (isFull !== isFullLayout) {
        setIsFull(isFullLayout);
      }
    };
  };

  const layoutClass = isFull ? 'flex-col' : 'flex-row';

  return (
    <div
      className="flex w-full flex-col radius-3 bg-white overflow-hidden relative"
      style={{ minHeight: styles.minHeight }}
    >
      <LayoutControl isFull={isFull} handleGraphLayoutChange={handleGraphLayoutChange} />
      <div className={`flex w-full ${layoutClass}`}>
        <div className={isFull ? 'w-full' : 'w-6/12'}>
          <BuildLineChart
            data={data}
            loading={loading}
            title="Memory"
            unit="GB"
            valueFormatter={convertBytesToGigabyte}
            valueKey="memory"
          />
        </div>
        <div className={isFull ? 'w-full' : 'w-6/12 pl-8'}>
          <BuildLineChart data={data} loading={loading} title="CPU" unit="%" valueKey="cpu" />
        </div>
      </div>
    </div>
  );
}

const LayoutControl = ({ isFull, handleGraphLayoutChange }: any) => {
  const horizontalActive = isFull ? '' : 'bg-gray-125';
  const verticalActive = isFull ? 'bg-gray-125' : '';

  return (
    <div className="flex items-center justify-around  mt-24 mr-30 border border-gray-125 w-58 h-32 rounded absolute right-0 z-1">
      <div
        className={`w-24 h-24 flex items-center justify-center  cursor-pointer  rounded ${horizontalActive} hover:bg-gray-125`}
        onClick={handleGraphLayoutChange(false)}
      >
        <div className="build-metrics-vertical-layout" />
      </div>
      <div
        className={`w-24 flex items-center justify-center h-24  cursor-pointer rounded ${verticalActive} hover:bg-gray-125`}
        onClick={handleGraphLayoutChange(true)}
      >
        <div className="build-metrics-horizontal-layout" />
      </div>
    </div>
  );
};
