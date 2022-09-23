import dynamic from 'next/dynamic';

import { echarts } from '../Base';
const BaseChart = dynamic(() => import('../Base'), { ssr: false });

const getDefaultChartOption = ({
  categories,
  color,
  series,
  tooltipFormatter,
  xAxisLabelFormatter,
  yAxisLabelFormatter,
}: any) => ({
  animation: false,
  color: color,
  grid: {
    bottom: 40,
    containLabel: true,
    left: 20,
    right: 20,
  },
  legend: {
    show: true,
    bottom: 0,
    left: 30,
    itemHeight: 10,
    itemWidth: 10,
    itemGap: 30,
    icon: 'roundRect',
  },
  series: series,
  tooltip: {
    borderWidth: 0,
    borderRadius: 5,
    confine: true,
    extraCssText: 'box-shadow: 0px 0px 65px rgba(186, 190, 206, 0.3);',
    formatter: tooltipFormatter,
    padding: 0,
    show: true,
    trigger: 'axis',
  },
  xAxis: {
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: true,
      rotate: 0,
      color: '#727390',
      fontSize: '10px',
      fontFamily: 'SF Pro Display Regular',
      fontWeight: 400,
      formatter: xAxisLabelFormatter,
    },
    boundaryGap: false,
    data: categories,
    splitLine: {
      show: true,
    },
    splitNumber: 5,
    type: 'category',
    tooltip: {
      enabled: false,
    },
    triggerEvent: true,
  },
  yAxis: {
    axisLabel: {
      color: '#727390',
      fontFamily: 'SF Pro Display Regular',
      fontSize: '10px',
      fontWeight: 400,
      formatter: yAxisLabelFormatter,
      show: true,
    },
    min: 0,
    splitNumber: 5,
    type: 'value',
  },
});

function formatSeriesForAreaChart(options: any) {
  options.series = options.series.map((item: any, index: number) => ({
    ...item,
    type: 'line',
    symbol: 'none',
    smooth: true,
    lineStyle: {
      color: options.color[index],
      width: 1,
      // type: 'dashed',
      opacity: 0.6,
    },
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
  }));
  return options;
}

export default function AreaChart({
  categories,
  color,
  height = 300,
  options = {},
  series,
  tooltipFormatter,
  width = 700,
  xAxisLabelFormatter,
  yAxisLabelFormatter,
  ...rest
}: {
  categories: any[];
  color: any[];
  height: any;
  options?: any;
  series: any[];
  tooltipFormatter?: Function;
  width: any;
  xAxisLabelFormatter?: Function;
  yAxisLabelFormatter?: Function;
  [key: string]: any;
}) {
  if (!series || !series.length) {
    return <div className="placeholder-content" style={{ height, width }}></div>;
  }

  let chartOption = getDefaultChartOption({
    categories,
    color,
    series,
    tooltipFormatter,
    xAxisLabelFormatter,
    yAxisLabelFormatter,
  });

  chartOption = formatSeriesForAreaChart(chartOption);

  const mergeOptions = { ...chartOption, ...options };
  return <BaseChart height={height} options={mergeOptions} width={width} {...rest} />;
}
