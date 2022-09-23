export default function getTestsByBuildChartConfig({ data }: { data: any[] }) {
  if (!data || !data.length) {
    return;
  }

  const { categories, series } = data.reduce(
    (acc, el) => {
      acc.categories.push(el.build_id);
      acc.series.push(el.execution_meta.flaky_tests);

      return acc;
    },
    { categories: [], series: [] }
  );

  return {
    categories,
    color: ['#F2A954'],
    grid: { bottom: 10, left: 10 },
    series: [
      {
        barWidth: 12,
        data: series,
        itemStyle: {
          borderColor: '#F2A954',
          borderWidth: 2,
        },
        roundCap: true,
        stack: 'total',
        type: 'bar',
      },
    ],
    tooltipFormatter: (params: any) => {
      const hasData = params.some(
        (param: any) => param.value !== null && param.value !== undefined
      );

      if (!hasData) {
        return;
      }

      const { name: jobId, value } = params[0];
      const formattedJobId = `#${jobId.slice(0, 7)}...`;

      return `
        <div class="p-5 rounded-md">
          <ul class="tooltip__body px-8">
            <li class="tooltip__item flex justify-between items-center">
              <div class="tooltip__item-value text-tas-500 font-bold">Flaky Tests: <span class="font-bold">${value}</span></div>
            </li>
            <li class="tooltip__item flex justify-between items-center text-size-12">
              <div class="tooltip__item-value text-tas-500">Job ID: <span class="">${formattedJobId}</span></div>
            </li>
          </ul>
        </div>
      `;

      return;
    },
    xAxisInterval: 0,
    xAxisLabelFormatter: (value: string) =>
      value !== '__EMPTY__' ? `#${value?.slice?.(0, 4)}...` : '',
    yAxis: {
      minInterval: 1,
    },
  };
}
