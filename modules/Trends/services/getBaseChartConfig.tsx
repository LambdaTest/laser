enum CategoriesCountRange {
  SMALL = 30,
  MEDIUM = 60,
}

function getBarWidth(categoriesCount: number) {
  if (categoriesCount <= CategoriesCountRange.SMALL) {
    return '30%'
  }
  else if (categoriesCount <= CategoriesCountRange.MEDIUM) {
    return '60%'
  }
  else {
    return '90%'
  }
}

export default function getBaseChartConfig({
  categories,
  series,
  tooltipXFormatter,
  tooltipYFormatter,
  type,
  xLabel,
  xLabelFormatter,
  yLabel,
  yLabelFormatter,
  ...restOptions
}: {
  categories: any[],
  series: any[]
  tooltipXFormatter?: Function,
  tooltipYFormatter?: Function,
  type?: string,
  xLabel?: string,
  xLabelFormatter?: Function,
  yLabel?: string,
  yLabelFormatter?: Function,
  [otherKey: string]: any;
}) {
  return {
    series,
    options: {
      plotOptions: {
        bar: {
          columnWidth: getBarWidth(categories.length),
          borderRadius: [5],
        },
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        x: {
          formatter: tooltipXFormatter,
        },
        y: {
          formatter: tooltipYFormatter,
        },
        custom: function ({ dataPointIndex, w: {
          config
        } }: { dataPointIndex: number, w: { config: any, globals: any } }) {
          const { colors, series, tooltip } = config;

          const categoryRaw = categories[dataPointIndex]
          const categoryLabel = tooltip?.x?.formatter?.(categoryRaw) ?? categoryRaw;

          const seriesData = series
            .map((seriesItem: any) => ({ label: seriesItem.name, value: seriesItem.data[dataPointIndex] }))
            .filter((seriesItem: { label: string, value: string }) => seriesItem.value != null);

          if (!seriesData.length) {
            return ''
          }

          return `
            <div class="apexcharts__tooltip-custom__container p-4">
              <div class="tooltip__head text-size-12 border-b border-gray-125 bg-gray-150 p-5 px-8 text-ellipsis">${categoryLabel}</div>
              <ul class="tooltip__body p-5 px-8">
                ${seriesData.map((seriesItem: { label: string, value: string }, index: number) => `
                  <li class="tooltip__item flex justify-between items-center">
                    <div class="tooltip__item-label flex items-center">
                      <div class="rounded w-8 h-8 mr-8" style="background: ${colors[index]}"></div>
                      <div class="text-size-13 text-tas-400 text-ellipsis mmw60">${seriesItem.label}</div>
                    </div>
                    <div class="tooltip__item-value w-40 text-ellipsis text-tas-500 text-right">${seriesItem.value}</div>
                  </li>
                `).join('')}
              </ul>
            </div>
          `
        }
      },
      xaxis: {
        categories,
        type,
        tooltip: {
          enabled: false,
        },
        labels: {
          show: true,
          offsetY: -5,
          rotate: 0,
          formatter: xLabelFormatter,
          style: {
            colors: '#727390',
            fontSize: '8px',
            fontFamily: 'SF Pro Display Regular',
            fontWeight: 400,
          }
        },
        title: {
          text: xLabel,
          offsetY: -10,
          style: {
            colors: '#727390',
            fontSize: '8px',
            fontFamily: 'SF Pro Display Regular',
            fontWeight: 400,
          },
        },
        axisTicks: {
          show: false
        },
      },
      yaxis: {
        tickAmount: 5,
        labels: {
          show: true,
          formatter: yLabelFormatter,
          style: {
            colors: '#727390',
            fontSize: '8px',
            fontFamily: 'SF Pro Display Regular',
            fontWeight: 400,
          },
        },
        title: {
          text: yLabel,
          style: {
            colors: '#727390',
            fontSize: '8px',
            fontFamily: 'SF Pro Display Regular',
            fontWeight: 400,
          },
        },
      },
      ...restOptions
    }
  }
}