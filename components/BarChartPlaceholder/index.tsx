import { useMemo } from 'react';

const defaultProps = {
  fullBarHeight: false,
  groupItemsCount: 1,
  groupsCount: 40,
  rowHeight: 48,
  rowsCount: 4,
  loading: true,
  message: 'Currently there is not data available.',
};

export default function BarChartPlaceholder({
  fullBarHeight,
  groupItemsCount,
  groupsCount,
  loading,
  rowHeight,
  rowsCount,
  message,
}: any = defaultProps) {
  const yAxis = useMemo(() => Array(rowsCount || 1).fill(0), [rowsCount || 1]);

  // initiate random group heights
  const xAxisGroups = useMemo(
    () => Array.from(Array(groupsCount || 1)).map(() => Math.random() * 60 + 40),
    [groupsCount]
  );

  // initiate random group item heights
  const xAxisGroupItems = useMemo(
    () => Array.from(Array(groupItemsCount || 1)).map(() => Math.random() * 60 + 20),
    [groupItemsCount]
  );

  return (
    <div className="p-16 pt-30">
      <div className="flex">
        <div
          className="flex flex-col justify-between w-24"
          style={{ height: rowHeight * rowsCount }}
        >
          {yAxis.map((_label, index) => (
            <div
              key={index}
              className="placeholder-content placeholder-content-no-animation"
              style={{ width: 8, height: 8 }}
            ></div>
          ))}
          <div
            className="placeholder-content placeholder-content-no-animation"
            style={{ width: 8, height: 8 }}
          ></div>
        </div>
        <div className="flex flex-col w-full border-b relative">
          {yAxis.map((_label, index) => (
            <div key={index} className="border border-b-0" style={{ height: rowHeight }}></div>
          ))}
          <div className="absolute top-0 left-0 w-full h-full flex items-end justify-around pl-20">
            {xAxisGroups.map((groupHeight, index) => (
              <div
                key={index}
                style={{ height: `${groupHeight}%` }}
                className="flex w-full justify-around items-end pr-16"
              >
                {xAxisGroupItems.map((itemHeight, index) => (
                  <div
                    key={index}
                    className={`placeholder-content ${
                      loading ? '' : 'placeholder-content-no-animation'
                    }`}
                    style={{ width: 8, height: `${fullBarHeight ? 100 : itemHeight}%` }}
                  ></div>
                ))}
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-items-center pl-20">
            {!loading && (
              <div className="flex items-center p-10 m-auto rounded bg-white">
                <img src="/assets/images/icon/icon-No-Data.svg" className="mr-15" width={24} />
                <span
                  className="text-gray-500 text-size-14"
                  dangerouslySetInnerHTML={{ __html: message }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="w-24"></div>
        <div className="flex justify-around items-center w-full h-24">
          {xAxisGroups.map((_, index) => (
            <div
              key={index}
              className="placeholder-content placeholder-content-no-animation"
              style={{ width: `${(100 * 0.6) / groupsCount}%`, height: 8, maxWidth: '32px' }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

BarChartPlaceholder.defaultProps = defaultProps;
