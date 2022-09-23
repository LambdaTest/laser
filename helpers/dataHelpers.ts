import { get } from "underscore";

export function fillEmptyDataByDate({
  data,
  formatGroupKey,
  getDefaultData,
  groupKeyPath,
  rangeData,
}: {
  data: any[];
  formatGroupKey?: (dataItem: any) => string;
  groupKeyPath: string[];
  getDefaultData: (formattedGroupKey: string) => any;
  rangeData: any[];
}) {
  const groupedData = data.reduce((acc, dataItem: any) => {
    const groupKey = get(dataItem, groupKeyPath);
    const formattedGroupKey = formatGroupKey?.(groupKey) ?? groupKey;
    acc[formattedGroupKey] = dataItem;
    return acc;
  }, {});

  const filledData = rangeData.map((groupKey) => {
    const formattedGroupKey = formatGroupKey?.(groupKey) ?? groupKey;
    return groupedData[formattedGroupKey] ?? getDefaultData(groupKey);
  });

  return filledData;
}
