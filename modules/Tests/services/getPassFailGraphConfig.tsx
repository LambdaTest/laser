import moment from 'moment';

import { getEnumKeyName } from 'helpers/enumHelpers';

import DateFormats from 'constants/DateFormats';
import { TestStatusColors } from 'constants/StatusColors';
import { TestStatusLabels } from 'constants/StatusLabels';
import { TestStatusTypes } from 'constants/StatusTypes';

const echartsDateFormats = {
  year: `{bold|{yyyy}}`,
  month: `{dd} {MMM} {yyyy}`,
  day: `{dd} {MMM} {yyyy}`,
  hour: `{dd} {MMM} {yyyy} {HH}:{ss}`,
  minute: `{dd} {MMM} {yyyy} {HH}:{ss}`,
  none: `{dd} {MMM} {yyyy} {HH}:{ss}:{SSS}`,
};

function getColorsFromTypes(statusTypes: TestStatusTypes[]) {
  return statusTypes.map(
    (status) =>
      TestStatusColors[getEnumKeyName(status, TestStatusTypes) as keyof typeof TestStatusColors] + "dd"
  );
}

export default function getPassFailGraphConfig({
  data,
  dateRange,
  testsToShow,
  unit,
}: {
  data: any[];
  dateRange: { start_date: string; end_date: string };
  testsToShow: TestStatusTypes[];
  unit?: string;
}) {
  const categories = data.map((el) => el.created_at);
  const seriesMap = testsToShow.reduce((acc: any, statusType: TestStatusTypes) => {
    const typeWithoutPrefix = statusType.replace('tests_', '');
    const name =
      TestStatusLabels[
        getEnumKeyName(statusType, TestStatusTypes) as keyof typeof TestStatusLabels
      ];

    acc[typeWithoutPrefix] = {
      _type: statusType,
      data: [],
      name,
      // stack: 'total',
      symbolSize: 10,
      type: 'scatter',
    };
    return acc;
  }, {});

  data.map((el) => {
    seriesMap[el.status]?.data.push([el.created_at, el.duration]);
  });
  const seriesData = Object.values(seriesMap);
  const hasData = seriesData.some((el: any) => el?.data.length);

  if (!hasData) {
    return null;
  }

  const color = getColorsFromTypes(testsToShow);

  return {
    categories,
    color,
    series: seriesData,
    tooltipFormatter: (params: any) => {
      const { seriesName: status, value } = params;
      const [date, duration] = value;
      const formattedDate = moment(date).format(DateFormats.DISPLAY_WITH_TIME);
      const formattedValue = duration + ' ' + unit;

      return `
        <div class="p-5 rounded-md">
          <ul class="tooltip__body px-8">
            <li class="tooltip__item flex justify-between items-center">
              <div class="tooltip__item-value text-tas-500 capitalize font-bold">${status}</div>
            </li>
            <li class="tooltip__item flex justify-between items-center text-size-12">
              <div class="tooltip__item-value text-tas-500">Duration: <span class="">${formattedValue}</span></div>
            </li>
          </ul>
          <div class="tooltip__head text-size-12 text-tas-400 px-8 text-ellipsis">${formattedDate}</div>
        </div>
      `;
    },
    xAxis: {
      min: dateRange.start_date,
      max: dateRange.end_date,
    },
    xAxisLabelFormatter: echartsDateFormats,
  };
}
