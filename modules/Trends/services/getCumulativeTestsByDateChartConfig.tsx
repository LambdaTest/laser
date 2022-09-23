import moment from 'moment';

import { getEnumKeyName } from '../../../helpers/enumHelpers';

import { TestStatusColors } from '../../../constants/StatusColors';
import { TestStatusLabels } from '../../../constants/StatusLabels';
import { TestStatusTypes } from '../../../constants/StatusTypes';
import DateFormats from '../../../constants/DateFormats';

const TestStatusToShow = [
  TestStatusTypes.TOTAL,
  TestStatusTypes.IMPACTED,
  TestStatusTypes.BLOCKLISTED,
  TestStatusTypes.QUARANTINED,
];

export default function getCumulativeTestsByDateChartConfig(data: any[]) {
  if (!data.length) {
    return;
  }

  const categories = data.map((el) => el.commit_id);
  const seriesMap = data.reduce((acc, el) => {
    TestStatusToShow.map((statusType: TestStatusTypes) => {
      if (!acc[statusType]) {
        acc[statusType] = {
          name: TestStatusLabels[
            getEnumKeyName(statusType, TestStatusTypes) as keyof typeof TestStatusLabels
          ],
          data: [],
          _type: statusType,
        };
      }

      acc[statusType].data.push(el.execution_meta[statusType]);
    });
    return acc;
  }, {});
  const seriesData = Object.values(seriesMap);

  const color = TestStatusToShow.map(
    (status) =>
      TestStatusColors[getEnumKeyName(status, TestStatusTypes) as keyof typeof TestStatusColors]
  );

  return {
    boundaryGap: false,
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

      const { name: commitId } = params[0];
      const dataItem = data[categories.indexOf(commitId)];
      const formattedTitle = `#${commitId?.slice?.(0, 7)}...`;
      const formattedDate = moment(dataItem.created_at).format(DateFormats.DISPLAY_WITH_TIME);

      return `
        <div class="text-tas-500 py-10">
          <div class="border-b px-15 pb-10">
            <div class="text-size-12">${formattedTitle}</div>
            <div class="text-size-10 text-tas-400 leading-tight">
              ${formattedDate}
            </div>
          </div>
          <ul class="tooltip__body px-15 pt-10">
            ${params
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
    xAxisLabelFormatter: (value: string) => `#${value?.slice?.(0, 4)}...`,
  };
}
