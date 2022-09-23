import dynamic from 'next/dynamic';

const BaseChart = dynamic(() => import('../Base'), { ssr: false });

const getDefaultChartOption = ({
  categories,
  color,
  series,
  tooltipFormatter,
  xAxis,
  xAxisLabelFormatter,
  yAxis,
  yAxisLabelFormatter,
}: any) => ({
  animation: false,
  color: color,
  grid: {
    bottom: 40,
    containLabel: true,
    left: 20,
    right: 40,
  },
  legend: {
    bottom: 0,
    icon: 'roundRect',
    itemGap: 30,
    itemHeight: 10,
    itemWidth: 10,
    left: 30,
    show: true,
  },
  series: series,
  tooltip: {
    borderRadius: 5,
    borderWidth: 0,
    confine: true,
    extraCssText: 'box-shadow: 0px 0px 65px rgba(186, 190, 206, 0.3);',
    formatter: tooltipFormatter,
    padding: 0,
    show: true,
  },
  xAxis: {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#727390',
      fontFamily: 'SF Pro Display Regular',
      fontSize: '10px',
      fontWeight: 400,
      formatter: xAxisLabelFormatter,
      hideOverlap: true,
      rich: {
        bold: {
          fontWeight: 'bold',
          padding: [-2, 0, 0, 0],
        },
      },
      rotate: 0,
      show: true,
    },
    boundaryGap: ['80%', '20%'],
    data: categories,
    splitLine: {
      show: true,
    },
    splitArea: {
      interval: 'auto',
    },
    type: 'time',
    ...xAxis,
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
    boundaryGap: ['80%', '20%'],
    ...yAxis,
  },
});

export default function ScatterChart({
  categories,
  color = ['#70cba6'],
  height = 300,
  options = {},
  series,
  tooltipFormatter,
  width = 700,
  xAxis,
  xAxisLabelFormatter,
  yAxis,
  yAxisLabelFormatter,
  ...rest
}: {
  categories: any[];
  color: any[];
  height: any;
  options?: any;
  series: any[];
  tooltipFormatter?: any;
  width: any;
  xAxis?: any;
  xAxisLabelFormatter?: any;
  yAxis?: any;
  yAxisLabelFormatter?: any;
  [key: string]: any;
}) {
  if (!series || !series.length) {
    return <div className="placeholder-content" style={{ height, width }}></div>;
  }

  const chartOption = getDefaultChartOption({
    categories,
    color,
    series,
    tooltipFormatter,
    xAxis,
    xAxisLabelFormatter,
    yAxis,
    yAxisLabelFormatter,
  });

  const mergeOptions = { ...chartOption, ...options };
  return <BaseChart height={height} options={mergeOptions} width={width} {...rest} />;
}
