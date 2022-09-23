import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import _ from 'underscore';
import moment from 'moment';

import DateFormats from 'constants/DateFormats';

import { fetchCumulativeTestsByDate } from 'redux/actions/trendsAction';

import getCumulativeTestsByDateChartConfig from '../services/getCumulativeTestsByDateChartConfig';

import AreaChart from 'components/ECharts/AreaChart';
import InlineToggleSelect from 'components/InlineToggleSelect';
import InsightsPlaceholder from 'components/InsightsPlaceholder';
import NoDataPlaceholder from 'components/NoDataPlaceholder';

const DurationOptions = {
  label: 'Last:',
  default: 7,
  options: [
    {
      key: 7,
      label: '7 days',
    },
    {
      key: 10,
      label: '10 days',
    },
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

const CumulativeTestsByDate = () => {
  const router = useRouter();
  const { repo, provider, org } = router.query;

  const dispatch = useDispatch();
  const { trendsData }: any = useSelector((state) => state, _.isEqual);
  const { cumulativeTestsByDate, cumulativeTestsByDateLoading } = trendsData;

  const [dataDuration, setDataDuration] = useState(DurationOptions.default);
  const [chartConfig, setChartConfig] = useState<any>(null);
  const [chartInstance, setChartInstance] = useState<any>();
  const [startDate, endDate] = useMemo(
    function () {
      const _startDate = moment().subtract(dataDuration, 'days');
      const _endDate = moment();

      return [
        {
          default: _startDate.format(DateFormats.DATE_TIME),
          display: _startDate.format(DateFormats.DISPLAY),
        },
        {
          default: _endDate.format(DateFormats.DATE_TIME),
          display: _endDate.format(DateFormats.DISPLAY),
        },
      ];
    },
    [dataDuration]
  );

  useEffect(() => {
    if (repo) {
      dispatch(
        fetchCumulativeTestsByDate({
          repo: repo as string,
          start_date: startDate.default,
          end_date: endDate.default,
        })
      );
    }
  }, [repo, startDate.default, endDate.default]);

  useEffect(() => {
    if (cumulativeTestsByDate) {
      setChartConfig(getCumulativeTestsByDateChartConfig(cumulativeTestsByDate));
    }
  }, [cumulativeTestsByDate]);

  useEffect(() => {
    const clickHandler = function ({
      componentType,
      value,
    }: {
      componentType: string;
      name: string;
      value: string;
    }) {
      const commitId = componentType === 'xAxis' && value;
      if (commitId) {
        router.push(`/${provider}/${org}/${repo}/commits/${commitId}`);
      }
    };
    chartInstance?.on('click', clickHandler);
    return function () {
      chartInstance?.off('click', clickHandler);
    };
  }, [chartInstance]);

  if (cumulativeTestsByDateLoading) {
    return <LoadingState />;
  }

  return (
    <div>
      <div className="flex justify-between px-15">
        <div className="pl-15">
          <div className="text-size-16">Cumulative Tests Report</div>
          <div className="text-size-12 text-gray-500">
            (Showing from {startDate.display} to {endDate.display})
          </div>
        </div>
        <InlineToggleSelect
          label={DurationOptions.label}
          onChange={setDataDuration}
          options={DurationOptions.options}
          selected={dataDuration}
        />
      </div>
      <div style={{ height: 350 }} className="pb-10 pl-10">
        {cumulativeTestsByDate && cumulativeTestsByDate.length ? (
          <AreaChart height="100%" width="100%" {...chartConfig} onChartReady={setChartInstance} />
        ) : (
          <NoDataPlaceholder height="100%" />
        )}
      </div>
    </div>
  );
};

export default CumulativeTestsByDate;

const LoadingState = () => {
  return (
    <div className="p-15 -mt-12">
      <div className="flex items-center justify-between">
        <div className="w-2/12">
          <InsightsPlaceholder
            className="w-5/12 mb-8"
            size={InsightsPlaceholder.SizeVariant.NANO}
          />
          <InsightsPlaceholder size={InsightsPlaceholder.SizeVariant.ATOM} />
        </div>
        <div className="w-2/12 relative">
          <div
            className="absolute bg-white w-6/12 h-24 z-10 rounded"
            style={{ top: '4px', left: '4px' }}
          ></div>
          <InsightsPlaceholder size={InsightsPlaceholder.SizeVariant.MID_SMALL} />
        </div>
      </div>
      <div className="flex items-start mt-40 ml-40">
        <div className="w-8 mr-16">
          {[...Array(6).keys()].map((_, i) => (
            <div key={i} className="h-24 mb-8 flex items-center">
              <InsightsPlaceholder className="w-8" size={InsightsPlaceholder.SizeVariant.ATOM} />
            </div>
          ))}
        </div>
        <div className="flex items-center w-11/12 justify-between">
          {[...Array(6).keys()].map((_, idx) => {
            return (
              <div key={`outer-${idx}`} className="w-10/12 mr-8">
                {[...Array(6).keys()].map((_, i) => (
                  <InsightsPlaceholder
                    className="mb-8"
                    key={i}
                    size={InsightsPlaceholder.SizeVariant.LITTLE_SMALL}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
