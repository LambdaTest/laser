import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import _ from 'underscore';
import moment from 'moment';

import DateFormats from 'constants/DateFormats';

import { fetchBuildsByDate } from 'redux/actions/trendsAction';

import getBuildByDateChartConfig from '../services/getBuildByDateChartConfig';

import BarChart from 'components/ECharts/BarChart';
import InlineToggleSelect from 'components/InlineToggleSelect';
import NoDataPlaceholder from 'components/NoDataPlaceholder';
import LoadingState from './GraphPlaceholder';

const BuildByDateDurationOptions = {
  label: 'Last:',
  default: 30,
  options: [
    {
      key: 30,
      label: '30 days',
    },
    {
      key: 60,
      label: '60 days',
    },
  ],
};

const BuildByDateChart = () => {
  const router = useRouter();
  const { repo } = router.query;

  const dispatch = useDispatch();
  const { trendsData }: any = useSelector((state) => state, _.isEqual);
  const { buildsByDate, buildsByDateAvg, buildsByDateLoading } = trendsData;

  const [dataDuration, setDataDuration] = useState(BuildByDateDurationOptions.default);
  const [chartConfig, setChartConfig] = useState<any>();

  const fetchBuildsByDateData = (repo: string, duration: number) => {
    const startDate = moment().subtract(duration, 'days').format(DateFormats.DATE_TIME);
    const endDate = moment().format(DateFormats.DATE_TIME);

    dispatch(fetchBuildsByDate({ repo, start_date: startDate, end_date: endDate }));
  };

  useEffect(() => {
    if (repo) {
      fetchBuildsByDateData(repo as string, dataDuration);
    }
  }, [repo, dataDuration]);

  useEffect(() => {
    if (buildsByDate) {
      setChartConfig(getBuildByDateChartConfig(buildsByDate));
    }
  }, [buildsByDate]);

  if (buildsByDateLoading) {
    return <LoadingState />;
  }
  return (
    <div>
      <div className="flex justify-between px-15">
        <div className="pl-15">
          <div className="text-size-16">Job Frequency</div>
          <div className="text-size-12 text-gray-500">
            (Showing the total number of jobs in the last {dataDuration} days)
          </div>
        </div>
        <div className="flex">
          <div className="pr-40 text-right">
            <div className="text-size-12 text-gray-500">Average</div>
            <div className="text-size-16">
              {buildsByDateAvg?.toFixed(2) ?? '-'} <span className="text-gray-500">/day</span>
            </div>
          </div>
          <InlineToggleSelect
            label={BuildByDateDurationOptions.label}
            onChange={setDataDuration}
            options={BuildByDateDurationOptions.options}
            selected={dataDuration}
          />
        </div>
      </div>
      <div style={{ height: 230 }} className="px-10">
        {buildsByDate && buildsByDate.length ? (
          <BarChart height="100%" width="100%" {...chartConfig} />
        ) : (
          <NoDataPlaceholder height="100%" />
        )}
      </div>
    </div>
  );
};

export default BuildByDateChart;
