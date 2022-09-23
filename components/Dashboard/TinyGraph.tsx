import React, { useMemo } from 'react';
import SparkLineChart from '../ECharts/SparkLineChart';

const getChartConfig = (data: any[]) => {
  return {
    color: ['#6772e5'],
    categories: data.map((_val, index) => String(index)),
    series: [
      {
        type: 'line',
        data: data,
        symbolSize: 0,
      },
    ],
  };
};

const TinyGraph = ({ data = [], height, width }: { id: any; data: any[], height: number, width: number }) => {
  const chartConfig = useMemo(() => getChartConfig(data), [data]);
  return <SparkLineChart height={height} width={width} {...chartConfig} />;
};

export default React.memo(TinyGraph, (prevProps, nextProps) => {
  if (prevProps.id !== nextProps.id) {
    return true;
  }
  return false;
});
