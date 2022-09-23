import React, { useMemo } from 'react';

import LinePlaceholer from 'components/LinePlaceholder';
import ScatterChart from 'components/ECharts/ScatterChart';
import InsightsPlaceholder from 'components/InsightsPlaceholder';

import getPassFailGraphConfig from '../services/getPassFailGraphConfig';
import { roundOff } from 'helpers/mathHelpers';

import { TestStatusTypes } from 'constants/StatusTypes';


const PassFailGraph = ({
  data,
  dateRange,
  loading = true,
  testsToShow = [
    TestStatusTypes.PASSED,
    TestStatusTypes.FAILED,
    TestStatusTypes.SKIPPED,
    TestStatusTypes.BLOCKLISTED,
    TestStatusTypes.QUARANTINED,
  ],
  title,
  unit,
}: {
  data: any[];
  dateRange: { start_date: string; end_date: string };
  loading: boolean;
  testsToShow?: TestStatusTypes[];
  title: string;
  unit: string;
}) => {
  const chartConfig = getPassFailGraphConfig({
    data,
    dateRange,
    testsToShow,
    unit,
  });

  const passRatio = useMemo(() => {
    if (!data) {
      return null;
    }

    const totalTests = data.length;
    const passedTests = data.filter(
      (dataPoint) => 'tests_' + dataPoint.status === TestStatusTypes.PASSED
    ).length;

    const passRate = (passedTests * 100) / totalTests;

    return roundOff(passRate, 2);
  }, [data]);

  let contentDom = null;
  if (loading) {
    contentDom = (
      <div className="pt-15">
        <InsightsPlaceholder size={InsightsPlaceholder.SizeVariant.MEDIUM} />
      </div>
    );
  } else if (!data.length || !chartConfig) {
    contentDom = <LinePlaceholer />;
  } else
    contentDom = (
      <div className="pl-10" style={{ height: 335 }}>
        <ScatterChart height="100%" width={'100%'} {...chartConfig} />
      </div>
    );

  return (
    <div className="bg-white rounded-md overflow-hidden">
      <div className="px-30 pt-15 flex justify-between items-end">
        <div>
          {title} <span className="text-tas-400 text-size-12">{unit ? `(${unit})` : ''}</span>
        </div>
        <div className="text-right pr-40">
          <div className="text-size-12 text-gray-500">Success Rate</div>
          <div className="text-size-16">{passRatio ? `${passRatio}%` : '-'}</div>
        </div>
      </div>
      <div className="px-45 pb-30">{contentDom}</div>
    </div>
  );
};

export default PassFailGraph;
