import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import _ from 'underscore';

import { fetchTestsByCommit } from 'redux/actions/trendsAction';

import getTestsByCommitChartConfig from '../services/getTestsByCommitChartConfig';

import BarChart from 'components/ECharts/BarChart';
import NoDataPlaceholder from 'components/NoDataPlaceholder';
import LoadingState from './GraphPlaceholder';

const DATA_ITEMS_RANGE = 30;

const TestsByCommitChart = () => {
  const router = useRouter();
  const { repo, provider, org } = router.query;

  const dispatch = useDispatch();
  const { trendsData }: any = useSelector((state) => state, _.isEqual);
  const { testsByCommit, testsByCommitAvg, testsByCommitLoading } = trendsData;

  const [chartConfig, setChartConfig] = useState<any>();

  const [chartInstance, setChartInstance] = useState<any>();

  const fetchTestsByCommitData = (repo: string) => {
    dispatch(fetchTestsByCommit({ repo, perPage: DATA_ITEMS_RANGE }));
  };

  useEffect(() => {
    if (repo) {
      fetchTestsByCommitData(String(repo));
    }
  }, [repo]);

  useEffect(() => {
    if (testsByCommit) {
      setChartConfig(getTestsByCommitChartConfig(testsByCommit));
    }
  }, [testsByCommit]);

  useEffect(() => {
    const clickHandler = function ({
      componentType,
      name,
      value,
    }: {
      componentType: string;
      name: string;
      value: string;
    }) {
      const commitId = (componentType === 'series' && name) || (componentType === 'xAxis' && value);
      if (commitId) {
        router.push(`/${provider}/${org}/${repo}/commits/${commitId}`);
      }
    };
    chartInstance?.on('click', clickHandler);
    return function () {
      chartInstance?.off('click', clickHandler);
    };
  }, [chartInstance]);

  if (testsByCommitLoading) {
    return <LoadingState variant={LoadingState.Variant.COMMIT_CHART} />;
  }

  return (
    <div>
      <div className="flex justify-between px-15">
        <div className="pl-15">
          <div className="text-size-16">Tests Executed</div>
          <div className="text-size-12 text-gray-500">
            (Showing the total number of tests executed over the last 30 commits)
          </div>
        </div>
        <div className="pl-15 text-right">
          <div className="text-size-12 text-gray-500">Average</div>
          <div className="text-size-16">
            {testsByCommitAvg?.toFixed(2) ?? '-'} <span className="text-gray-500">/commit</span>
          </div>
        </div>
      </div>
      <div style={{ height: 230 }} className="px-10">
        {testsByCommit.length ? (
          <BarChart height="100%" width="100%" {...chartConfig} onChartReady={setChartInstance} />
        ) : (
          <NoDataPlaceholder height="100%" />
        )}
      </div>
    </div>
  );
};

export default TestsByCommitChart;
