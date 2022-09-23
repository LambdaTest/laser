import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import _ from 'underscore';

import { fetchGraphDataByDate } from 'redux/actions/insightsFlakyTests';

import SummaryCard from '../components/SummaryCard';
import ChartPanel from '../components/ChartPanel';
import { TRange } from 'components/PeriodRangeFilter';

interface TProps {
  periodRange: TRange;
  setPeriodRange: (range: TRange) => void;
}

const SUMMARY_SIDEBAR_WIDTH = 140;

const SUMMARY_CARDS = [
  {
    key: 'overall_flakiness',
    label: 'Overall Flakiness',
  },
  {
    key: 'high_severity',
    label: 'High Severity',
    subLabel: 'Test Cases',
  },
  {
    key: 'medium_severity',
    label: 'Medium Severity',
    subLabel: 'Test Cases',
  },
  {
    key: 'low_severity',
    label: 'Low Severity',
    subLabel: 'Test Cases',
  },
];

function ChartWithSummary({ periodRange, setPeriodRange }: TProps) {
  const router = useRouter();
  const { repo, provider, org } = router.query;

  const dispatch = useDispatch();
  const insightsState = useSelector((state: any) => state?.insightsFlakyTestsData);

  const { graphData, graphDataLoading } = insightsState;

  const summaryData: any = useMemo(() => {
    return null;

    // if(graphDataLoading) {
    //   return {}
    // }
    // return {
    //   overall_flakiness: '9%',
    //   medium_severity: '20',
    //   high_severity: '40',
    //   low_severity: '20',
    // };
  }, [graphData]);

  const summarySidebarWidth = summaryData ? SUMMARY_SIDEBAR_WIDTH : 0;

  useEffect(() => {
    if (repo) {
      dispatch(
        fetchGraphDataByDate({
          end_date: periodRange?.[1],
          org,
          provider,
          repo,
          start_date: periodRange?.[0],
        })
      );
    }
    return () => {};
  }, [periodRange, repo]);

  return (
    <div className="flex items-stretch">
      <div className="w-full flex-1" style={{ maxWidth: `calc(100% - ${summarySidebarWidth}px)` }}>
        <ChartPanel
          periodRange={periodRange}
          setPeriodRange={setPeriodRange}
          chartData={graphData}
          loading={graphDataLoading}
        />
      </div>
      {summaryData && (
        <div className="flex flex-col ml-8" style={{ minWidth: `${summarySidebarWidth}px` }}>
          {SUMMARY_CARDS.map((card) => (
            <SummaryCard
              key={card.key}
              loading={graphDataLoading}
              subTitle={card.subLabel}
              title={card.label}
              value={summaryData[card.key]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ChartWithSummary;
