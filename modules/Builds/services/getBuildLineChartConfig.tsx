import _ from 'underscore';
import moment from 'moment';

import DateFormats from 'constants/DateFormats';
import { TIME_IN_MS, TIME_LABEL } from 'constants/Duration';

import { getGranularity } from 'helpers/dateHelpers';

function roundOff(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

function getTimeDifference(
  data: { record_time: string; [_key: string]: any }[]
): [number, any, any] {
  if (data.length === 0) return [0, undefined, undefined];

  const first = new Date(data[0].record_time).getTime();
  const last = new Date(data[data.length - 1].record_time).getTime();
  return [last - first, first, last];
}

function getXAxisMaximum(data: any[]) {
  if (data.length > 1) {
    return data[data.length - 1][0];
  }
  return 1;
}

function getXAxisMinimum(data: any[]) {
  if (data.length > 1) {
    return data[0][0];
  }
  return -1;
}

export default function getBuildLineChartConfig({
  data,
  title,
  unit,
  valueFormatter,
  valueKey,
  showAbsolute,
}: {
  data: any[];
  title: string;
  unit?: string;
  valueFormatter: Function;
  valueKey: string;
  showAbsolute: boolean;
}) {
  const [timeDifference, first] = getTimeDifference(data);
  const granularity = showAbsolute ? 'MILLISECOND' : getGranularity(timeDifference);

  const seriesMap = data
    // timestamp to milliseconds
    .map((build) => ({
      ...build,
      record_time: new Date(build.record_time).getTime(),
    }))
    // sort ascending on time
    .sort(function (buildPrev, buildNext) {
      return buildPrev.record_time - buildNext.record_time;
    })
    // set relative time w.r.t first time entry
    // convert to granularity unit
    .map((el) => [Math.round((el.record_time - first) / TIME_IN_MS[granularity]), el[valueKey]])
    // group data based on new granular value
    // Ex. 1100 and 1122 ms will be grouped together when granularity is more than ms i.e. sec, min, hr.
    .reduce((acc: any, data) => {
      const key = data[0];
      const value = data[1];

      if (!acc[key]) {
        acc[key] = [key, value, 1];
      } else {
        acc[key] = [key, acc[key][1] + value, acc[key][2] + 1];
      }

      return acc;
    }, {});

  const seriesData = Object.values(seriesMap).map((series: any) => {
    const totalValue = series[1] / series[2];
    return [series[0], valueFormatter ? valueFormatter(totalValue) : totalValue];
  });

  return {
    categories: [],
    color: ['#5FC8AF'],
    series: [
      {
        data: seriesData,
        name: title,
        type: 'line',
        ...(seriesData.length > 200
          ? {
              symbol: 'none',
              symbolSize: 0,
              large: true,
            }
          : {}),
      },
    ],
    tooltipFormatter: (params: any) => {
      const { value } = params[0];
      const formattedDate = moment(value[0] + first).format(DateFormats.DISPLAY_WITH_TIME);
      const formattedValue = value[1] != null ? `${roundOff(value[1])} ${unit}` : '-';

      return `
        <div class="p-5 rounded-md">
          <ul class="tooltip__body px-8">
            <li class="tooltip__item flex justify-between items-center">
              <div class="tooltip__item-value text-tas-500">${title}: <span class="font-bold">${formattedValue}</span></div>
            </li>
          </ul>
          <div class="tooltip__head text-size-12 text-tas-400 px-8 text-ellipsis">${formattedDate}</div>
        </div>
      `;
    },
    xAxis: {
      max: getXAxisMaximum(seriesData),
      min: getXAxisMinimum(seriesData),
      type: 'value',
    },
    xAxisLabel: {
      formatter: (value: number) => {
        if (value < 0) {
          return '';
        }

        const labelGetter = TIME_LABEL[granularity];
        if (typeof labelGetter === 'function') {
          return labelGetter?.(value);
        } else {
          return value + labelGetter;
        }
      },
    },
    yAxis: {},
    yAxisLabel: {
      formatter: (value: number) => roundOff(value),
    },
  };
}
