import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import _ from 'underscore';
import moment from 'moment';

import { fetchAnalyticsTableDataByType } from '../../../redux/actions/trendsAction';
import getAnalyticsTableConfig from '../services/getAnalyticsTableConfig';

import AnalyticsTabsToShow from '../constants/AnalyticsTabsToShow';
import DateFormats from '../../../constants/DateFormats';

import Grid, { IColumnConfig } from '../../../components/Grid';
import InlineToggleSelect from '../../../components/InlineToggleSelect';
import { cancelAxiosRequest } from 'redux/httpclient';

const DurationOptions = {
  default: 10,
  label: 'Last:',
  options: [
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

const PageSizeOptions = {
  default: 3,
  label: 'Top:',
  options: [
    {
      key: 3,
      label: '3',
    },
    {
      key: 5,
      label: '5',
    },
    {
      key: 10,
      label: '10',
    },
  ],
};

const TabOptions = {
  default: AnalyticsTabsToShow.SLOWEST_TESTS,
  options: [
    {
      key: AnalyticsTabsToShow.SLOWEST_TESTS,
      label: 'Slowest Tests',
    },
    {
      key: AnalyticsTabsToShow.FAILING_TESTS,
      label: 'Failing Tests',
    },
    {
      key: AnalyticsTabsToShow.FAILED_BUILDS,
      label: 'Failed Jobs',
    },
  ],
};

const AnalyticsTable = () => {
  const router = useRouter();
  const { repo } = router.query;

  const dispatch = useDispatch();
  const { trendsData }: any = useSelector((state) => state, _.isEqual);
  const { analyticsTabData, analyticsTabDataLoading } = trendsData;

  const [analyticsTab, setAnalyticsTab] = useState(TabOptions.default);
  const [dataDuration, setDataDuration] = useState(DurationOptions.default);
  const [pageSize, setPageSize] = useState(PageSizeOptions.default);
  const [gridConfig, setGridConfig] = useState<IColumnConfig[]>([]);

  function fetchAnalayticsTabData({
    duration,
    pageSize,
    repo,
    type,
  }: {
    duration: number;
    pageSize: number;
    repo: string;
    type: string;
  }) {
    const startDate = moment().subtract(duration, 'days').format(DateFormats.DATE_TIME);
    const endDate = moment().format(DateFormats.DATE_TIME);

    dispatch(
      fetchAnalyticsTableDataByType({
        end_date: endDate,
        per_page: pageSize,
        repo,
        start_date: startDate,
        type,
      })
    );
  }

  useEffect(() => {
    if (repo) {
      fetchAnalayticsTabData({
        duration: dataDuration,
        pageSize,
        repo: repo as string,
        type: analyticsTab,
      });
    }
  }, [repo, dataDuration, pageSize, analyticsTab]);

  useEffect(() => {
    if (analyticsTabDataLoading) {
      const gridConfig = getAnalyticsTableConfig(analyticsTab, String(repo));
      setGridConfig(gridConfig);
    }
  }, [analyticsTabDataLoading, analyticsTab]);

  const handleTabClick = (key: any) => {
    cancelAxiosRequest && cancelAxiosRequest();
    setAnalyticsTab(key);
  };

  return (
    <div>
      <div className="flex justify-between border-b-thick">
        <div className="flex flex-1">
          {TabOptions.options.map((el) => (
            <div
              className={`cursor-pointer px-15 py-12 inline-block text-size-14 ${
                analyticsTab === el.key ? ' text-tas-500 border-b border-black' : 'text-tas-400'
              }`}
              key={el.key}
              onClick={() => handleTabClick(el.key)}
            >
              {el.label}
            </div>
          ))}
        </div>
        <div className="flex items-center mr-10">
          <InlineToggleSelect
            className="mr-20"
            label={DurationOptions.label}
            onChange={setDataDuration}
            options={DurationOptions.options}
            selected={dataDuration}
          />
          <InlineToggleSelect
            label={PageSizeOptions.label}
            onChange={setPageSize}
            options={PageSizeOptions.options}
            selected={pageSize}
          />
        </div>
      </div>
      <div>
        <div className="min-height-200 relative" id="analytics-table">
          <Grid
            columnConfig={gridConfig}
            data={analyticsTabData}
            isLoading={analyticsTabDataLoading}
            noDataText="No data present for selected duration."
            placeholderVariant={Grid.PlaceholderVariant.COMPACT}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTable;
