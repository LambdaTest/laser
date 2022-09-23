import { getEnumKeyName } from '../../../helpers/enumHelpers';

import { TestStatusColors } from '../../../constants/StatusColors';
import { TestStatusLabels } from '../../../constants/StatusLabels';
import { TestStatusTypes } from '../../../constants/StatusTypes';

const TestStatusToShow = [
  TestStatusTypes.QUARANTINED,
  TestStatusTypes.BLOCKLISTED,
  TestStatusTypes.SKIPPED,
  TestStatusTypes.FAILED,
  TestStatusTypes.PASSED,
];

export default function getTestsByCommitChartConfig(data: any[]) {
  if (!data.length) {
    return;
  }

  const categories = data.map((el) => el.commit_id);

  const seriesMap = data.reduce((acc, el) => {
    TestStatusToShow.map((statusType: TestStatusTypes) => {
      if (!acc[statusType]) {
        acc[statusType] = {
          _type: statusType,
          barWidth: 15,
          data: [],
          name: TestStatusLabels[
            getEnumKeyName(statusType, TestStatusTypes) as keyof typeof TestStatusLabels
          ],
          roundCap: true,
          stack: 'total',
          type: 'bar',
        };
      }

      acc[statusType].data.push(el.execution_meta ? el.execution_meta[statusType] : null);
    });
    return acc;
  }, {});
  const seriesData = Object.values(seriesMap);

  // @todo: @ankushj - make utility function
  const color = TestStatusToShow.map(
    (status) =>
      TestStatusColors[getEnumKeyName(status, TestStatusTypes) as keyof typeof TestStatusColors]
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

      const { name: commitId } = reversedParams[0];
      const dataItem = data[categories.indexOf(commitId)];
      const formattedTitle = `#${commitId.slice(0, 7)}...`;
      const formattedValue = dataItem?.execution_meta?.[TestStatusTypes.IMPACTED];

      return `
        <div class="text-tas-500 py-10">
          <div class="border-b px-15 pb-10">
            <div class="text-size-12">${formattedTitle}</div>
            <div class="text-size-10 text-tas-400 leading-tight">
              ${formattedValue} Tests Executed
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
    xAxisInterval: 0,
    xAxisLabelFormatter: (value: string) =>
      value !== '__EMPTY__' ? `#${value?.slice?.(0, 4)}...` : '',
  };
}
