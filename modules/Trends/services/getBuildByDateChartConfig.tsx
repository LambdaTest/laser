import moment from 'moment';

import { getEnumKeyName } from 'helpers/enumHelpers';

import { BuildStatusColors } from 'constants/StatusColors';
import { BuildStatusLabels } from 'constants/StatusLabels';
import { BuildStatusTypes } from 'constants/StatusTypes';
import DateFormats from 'constants/DateFormats';

const BuildStatusToShow = [
  BuildStatusTypes.FAILED,
  BuildStatusTypes.ERROR,
  // BuildStatusTypes.ABORTED,
  BuildStatusTypes.RUNNING,
  BuildStatusTypes.INITIATING,
  BuildStatusTypes.PASSED,
];

export default function getBuildByDateChartConfig(data: any[]) {
  if (!data.length) {
    return;
  }

  const categories = data.map((el) => el.created_at);
  const seriesMap = data.reduce((acc, el) => {
    BuildStatusToShow.map((statusType: BuildStatusTypes) => {
      if (!acc[statusType]) {
        acc[statusType] = {
          _type: statusType,
          barWidth: 15,
          data: [],
          name: BuildStatusLabels[
            getEnumKeyName(statusType, BuildStatusTypes) as keyof typeof BuildStatusLabels
          ],
          roundCap: true,
          stack: 'total',
          type: 'bar',
        };
      }

      acc[statusType].data.push(
        el.build_execution_status ? el.build_execution_status[statusType] : null
      );
    });
    return acc;
  }, {});
  const seriesData = Object.values(seriesMap);

  const color = BuildStatusToShow.map(
    (status) =>
      BuildStatusColors[getEnumKeyName(status, BuildStatusTypes) as keyof typeof BuildStatusColors]
  );

  return {
    categories,
    color,
    series: seriesData,
    tooltipFormatter: (params: any) => {
      const hasData = params.some(
        (param: any) => param.value !== null && param.value !== undefined
      );

      if (!hasData) {
        return;
      }

      const reversedParams = [...params].reverse();

      const { name: date } = reversedParams[0];
      const dataItem = data[categories.indexOf(date)];
      const formattedDate = moment(date).format(DateFormats.DISPLAY);
      const formattedValue = dataItem?.build_execution_status?.[BuildStatusTypes.TOTAL] || '-';

      return `
        <div class="text-tas-500 py-10">
          <div class="border-b px-15 pb-10">
            <div class="text-size-12">${formattedDate}</div>
            <div class="text-size-10 text-tas-400 leading-tight">
              ${formattedValue} Jobs Executed
            </div>
          </div>
          <ul class="tooltip__body px-15 pt-10">
            ${reversedParams
              .map(
                ({ seriesName, value, color }: any) => `
              <li class="tooltip__item flex justify-between items-center text-size-10">
                <div class="tooltip__item-label flex items-center">
                  <div class="radius-2 w-8 h-8 mr-8" style="background: ${color}"></div>
                  <div class="text-ellipsis mmw60">${seriesName}</div>
                </div>
                <div class="tooltip__item-value w-40 text-ellipsis text-right">${value}</div>
              </li>
            `
              )
              .join('')}
          </ul>
        </div>
      `;
    },
    xAxisLabelFormatter: (value: string) => moment(value).format(DateFormats.DISPLAY_WITHOUT_YEAR),
  };
}
