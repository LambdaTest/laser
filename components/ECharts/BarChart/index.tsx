import dynamic from 'next/dynamic';
const BaseChart = dynamic(() => import('../Base'), { ssr: false });

const getDefaultChartOption = ({
  categories,
  color,
  series,
  tooltipFormatter,
  xAxisInterval,
  xAxisLabelFormatter,
  yAxisLabelFormatter,
  ...rest
}: any) => ({
  animation: false,
  color: color,
  grid: {
    bottom: 40,
    containLabel: true,
    top: 20,
    left: 20,
    right: 20,
    ...(rest['grid'] || {}),
  },
  legend: {
    show: true,
    bottom: 0,
    left: 30,
    itemHeight: 10,
    itemWidth: 10,
    itemGap: 30,
    data: series.map((item: any) => item.name).reverse(),
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
    axisPointer: {
      type: 'shadow',
    },
  },
  xAxis: {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: true,
      rotate: 0,
      color: '#727390',
      fontSize: '8px',
      fontFamily: 'SF Pro Display Regular',
      fontWeight: 400,
      formatter: xAxisLabelFormatter,
      interval: xAxisInterval,
    },
    boundaryGap: true,
    data: categories,
    splitLine: {
      show: false,
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
      fontSize: '8px',
      fontWeight: 400,
      formatter: yAxisLabelFormatter,
      show: true,
    },
    min: 0,
    splitNumber: 5,
    type: 'value',
    ...(rest['yAxis'] || {}),
  },
});

function addBarBorderRadius(option: any) {
  for (let dataIndex = 0, moreValue = true; moreValue; dataIndex++) {
    moreValue = false;
    // Stack order is the same as series declaration order.
    for (let i = option.series.length - 1; i >= 0; i--) {
      const data = option.series[i].data;
      if (dataIndex < data.length) {
        moreValue = true;
        const val = data[dataIndex]?.value ?? data[dataIndex];
        if (val) {
          data[dataIndex] = {
            value: val,
            itemStyle: { barBorderRadius: [50, 50, 0, 0] },
          };
          break;
        }
      }
    }
  }
}
export default function BarChart({
  categories,
  color,
  height = 300,
  options = {},
  series,
  tooltipFormatter,
  width = 700,
  xAxisInterval,
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
  xAxisInterval?: number;
  xAxisLabelFormatter?: Function;
  yAxisLabelFormatter?: Function;
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
    xAxisInterval,
    xAxisLabelFormatter,
    yAxisLabelFormatter,
    ...rest
  });

  const mergeOptions = { ...chartOption, ...options };
  addBarBorderRadius(mergeOptions);

  return <BaseChart height={height} options={mergeOptions} width={width} {...rest} />;
}
