import dynamic from 'next/dynamic';
const BaseChart = dynamic(() => import('../Base'), { ssr: false });

const getDefaultChartOption = ({
  categories,
  color,
  series,
  tooltipFormatter,
  xAxisLabelFormatter,
  yAxisLabelFormatter,
  ...rest
}: any) => ({
  animation: false,
  color: color,
  grid: {
    bottom: 20,
    containLabel: true,
    left: 20,
    right: 20,
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
    axisLine: {
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
      hideOverlap: true,
      ...(rest['xAxisLabel'] || {}),
    },
    boundaryGap: true,
    data: categories,
    splitLine: {
      show: true,
    },
    splitNumber: 5,
    type: 'category',
    tooltip: {
      enabled: false,
    },
    ...(rest['xAxis'] || {}),
  },
  yAxis: {
    axisLabel: {
      color: '#727390',
      fontFamily: 'SF Pro Display Regular',
      fontSize: '10px',
      fontWeight: 400,
      show: true,
      ...(rest['yAxisLabel'] || {}),
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    min: 0,
    splitNumber: 5,
    type: 'value',
    ...(rest['yAxis'] || {}),
  },
});

export default function LineChart({
  categories,
  color,
  height = 300,
  options = {},
  series,
  tooltipFormatter,
  width = 700,
  ...rest
}: {
  categories: any[];
  color: any[];
  height: any;
  options?: any;
  series: any[];
  tooltipFormatter?: Function;
  width: any;
  xAxis?: any;
  [key: string]: any;
}) {
  const chartOption = getDefaultChartOption({
    categories,
    color,
    series,
    tooltipFormatter,
    ...rest
  });

  const mergeOptions = { ...chartOption, ...options };
  return <BaseChart height={height} options={mergeOptions} width={width} {...rest} />;
}
