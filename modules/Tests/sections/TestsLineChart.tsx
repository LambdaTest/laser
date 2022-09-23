import React, { useRef, useState } from 'react';

import LinePlaceholer from 'components/LinePlaceholder';
import LineChart from 'components/ECharts/LineChart';
import InsightsPlaceholder from 'components/InsightsPlaceholder';

import getBuildLineChartConfig from '../../Builds/services/getBuildLineChartConfig';
import Dropdown from 'components/Dropdown';

const ChartViewOptions = [
  { label: 'Average', value: false },
  { label: 'Absolute', value: true },
];

const TestsLineChart = ({
  data,
  loading = true,
  title,
  unit,
  valueFormatter = (val) => val,
  valueKey,
}: {
  data: any[];
  valueKey: string;
  loading: boolean;
  title: string;
  unit: string;
  valueFormatter?: (a: any) => any;
}) => {
  const wrapperRef = useRef<any>();
  const [showAbsolute, setShowAbsolute] = useState(ChartViewOptions[0]);

  const chartConfig = getBuildLineChartConfig({
    data,
    title,
    unit,
    valueFormatter,
    valueKey,
    showAbsolute: showAbsolute.value,
  });

  let contentDom = null;
  if (loading) {
    contentDom = (
      <div className="pt-15">
        <InsightsPlaceholder size={InsightsPlaceholder.SizeVariant.MEDIUM} />
      </div>
    );
  } else if (!data.length) {
    contentDom = <LinePlaceholer />;
  } else
    contentDom = (
      <div style={{ height: 335 }}>
        <LineChart height="100%" width={'100%'} {...chartConfig} />
      </div>
    );

  return (
    <div className="bg-white rounded-md overflow-hidden relative" ref={wrapperRef}>
      <div className="px-30 pt-15 flex items-center">
        {title} <span className="text-tas-400 text-size-12">{unit ? `(${unit})` : ''}</span>{' '}
        <div className="flex ml-8">
          <Dropdown
            forcePosition
            getPopupContainer={() => wrapperRef.current}
            onClick={(_value, option: any) => setShowAbsolute(option)}
            options={ChartViewOptions}
            selectedOption={showAbsolute}
            toggleStyles={{
              height: '24px',
              background: '#fff',
            }}
            labelKey="label"
            valueKey="value"
          />
        </div>
      </div>
      <div className="px-45 pb-15">{contentDom}</div>
    </div>
  );
};

export default TestsLineChart;
