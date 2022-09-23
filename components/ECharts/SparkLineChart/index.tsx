import dynamic from 'next/dynamic';

import { echarts } from '../Base';
const BaseChart = dynamic(() => import('../Base'), { ssr: false });

const getDefaultChartOption = ({ categories, color, series }: any) => ({
  animation: false,
  backgroundColor: 'transparent',
  color: color,
  grid: {
    bottom: 2,
    left: 2,
    right: 2,
    show: false,
    top: 2,
  },
  series: series,
  tooltip: {
    show: false,
  },
  xAxis: {
    boundaryGap: true,
    data: categories,
    show: false,
  },
  yAxis: {
    boundaryGap: true,
    show: false,
  },
});

function formatSeriesForAreaChart(options: any) {
  options.series = options.series.map((item: any, index: number) => ({
    ...item,
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: options.color[index],
        },
        {
          offset: 1,
          color: options.color[index] + '00',
        },
      ]),
    },
    lineStyle: {
      color: options.color[index],
      width: 2,
      // type: 'dashed',
      opacity: 0.6,
    },
    smooth: true,
    symbol: 'none',
    type: 'line',
  }));
  return options;
}

export default function SparkLineChart({
  categories,
  color,
  height = 300,
  options = {},
  series,
  width = 700,
  ...rest
}: {
  categories: any[];
  color: any[];
  height: any;
  options?: any;
  series: any[];
  width: any;
  [key: string]: any;
}) {
  let chartOption = getDefaultChartOption({
    categories,
    color,
    series,
  });

  chartOption = formatSeriesForAreaChart(chartOption);

  const mergeOptions = { ...chartOption, ...options };
  return <BaseChart height={height} options={mergeOptions} width={width} {...rest} />;
}
