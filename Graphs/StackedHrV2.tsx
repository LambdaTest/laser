import React, { useMemo } from 'react';
import Tooltip, { TooltipThemeVariant } from 'components/Tooltip';

import * as StatusTypes from 'constants/StatusTypes';
import * as StatusLabels from 'constants/StatusLabels';
import * as StatusColors from 'constants/StatusColors';

enum StackedHrType {
  BUILD = 'build',
  TEST = 'test',
  FLAKY_TEST = 'flaky_test',
}

interface TStatusData {
  color?: string;
  count: number;
  hideInLine?: boolean;
  type: string;
  width?: number;
}

interface TStackedHr {
  data: TStatusData[];
  footer?: any;
  height: number | string;
  tooltipProps: any;
  type: StackedHrType;
  width: number | string;
}

function getStatusLabel(type: string, status: string) {
  switch (type) {
    case StackedHrType.TEST:
      return StatusLabels.TestStatusLabels[
        status.toUpperCase() as keyof typeof StatusTypes.TestStatusTypes
      ];
    case StackedHrType.BUILD:
      return StatusLabels.BuildStatusLabels[
        status.toUpperCase() as keyof typeof StatusTypes.BuildStatusTypes
      ];
    case StackedHrType.FLAKY_TEST:
      return StatusLabels.FlakyTestStatusLabels[
        status.toUpperCase() as keyof typeof StatusTypes.FlakyTestStatusTypes
      ];
  }
}

function getStatusColor(type: string, status: string) {
  switch (type) {
    case StackedHrType.TEST:
      return StatusColors.TestStatusColors[
        status.toUpperCase() as keyof typeof StatusTypes.TestStatusTypes
      ];
    case StackedHrType.BUILD:
      return StatusColors.BuildStatusColors[
        status.toUpperCase() as keyof typeof StatusTypes.BuildStatusTypes
      ];
    case StackedHrType.FLAKY_TEST:
      return StatusColors.FlakyTestStatusColors[
        status.toUpperCase() as keyof typeof StatusTypes.FlakyTestStatusTypes
      ];
  }
}

function getStatusBgColor(type: string, status: string) {
  switch (type) {
    case StackedHrType.TEST:
      return StatusColors.TestStatusSecondaryColors[
        status.toUpperCase() as keyof typeof StatusColors.TestStatusSecondaryColors
      ];
    case StackedHrType.BUILD:
      return StatusColors.BuildStatusSecondaryColors[
        status.toUpperCase() as keyof typeof StatusColors.BuildStatusSecondaryColors
      ];
    case StackedHrType.FLAKY_TEST:
      return StatusColors.FlakyTestStatusSecondaryColors[
        status.toUpperCase() as keyof typeof StatusColors.FlakyTestStatusSecondaryColors
      ];
  }
}

const defaultWidth = 200;
const defaultHeight = 5;

const StatusColorOverrides: { [key: string]: string } = {
  // blocklisted: '#fff',
  passed: '#3C947F',
  quarantined: '#FFF',
  skipped: '#676D75',
};

const StatusBgOverrides: { [key: string]: string } = {
  // blocklisted: '#676D75',
  skipped: `repeating-linear-gradient(
    -45deg,
    #D8D8D8,
    rgba(255,255,255,.49) 3px,
    #D8D8D8 3px
  )`,
};

const TooltipContent = ({
  data,
  dataType,
  label,
  width = 260,
}: {
  data: TStatusData[];
  dataType: StackedHrType;
  label: any;
  width?: any;
}) => {
  return (
    <div>
      <h3 className="px-15 py-10 block text-size-14 text-black border-b">{label}</h3>
      <div className="flex flex-wrap p-15 pb-5" style={{ width }}>
        {data.map((statusData: any, index: number) => (
          <div
            className={`flex w-6/12 items-center text-size-12 mb-10 ${
              index % 2 === 0 ? 'pr-10' : 'pl-10'
            }`}
            key={statusData.type}
          >
            <span
              className="inline-flex items-center px-8 h-16 rounded-full mr-8 mmw40 justify-center leading-none"
              style={{
                background:
                  StatusBgOverrides[statusData.type] || getStatusBgColor(dataType, statusData.type),
                color:
                  StatusColorOverrides[statusData.type] ||
                  getStatusColor(dataType, statusData.type),
              }}
            >
              {statusData.count || 0}
            </span>
            <span>{getStatusLabel(dataType, statusData.type)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StackedHr = ({ data, type, width, height, tooltipProps, footer }: TStackedHr) => {
  const totalStatusesToShow = useMemo(() => {
    return data.reduce((acc: number, statusData: TStatusData) => {
      if (statusData.hideInLine) {
        return acc;
      } else {
        return acc + (statusData.count || 0);
      }
    }, 0);
  }, data);

  const statusListWidth = useMemo(() => {
    return data.map((statusData: TStatusData) => {
      if (statusData.hideInLine) {
        return statusData;
      } else {
        return {
          ...statusData,
          width: ((statusData.count || 0) / totalStatusesToShow) * 100,
        };
      }
    });
  }, data);

  if (totalStatusesToShow === 0) {
    return (
      <div
        className="inline-flex overflow-hidden rounded-full"
        style={{
          height: height ? height : defaultHeight,
          width: width ? width : defaultWidth,
        }}
      >
        <div className="w-full bg-gray-150"></div>
      </div>
    );
  }

  return (
    <div>
      <Tooltip
        appendTo={() => document.body}
        content={<TooltipContent dataType={type} data={data} {...tooltipProps} />}
        interactive
        maxWidth="none"
        placement="bottom-start"
        theme={TooltipThemeVariant.LIGHT}
      >
        <div className="relative cursor-pointer leading-none">
          <div
            className="inline-flex overflow-hidden rounded-full"
            style={{
              height: height ? height : defaultHeight,
              width: width ? width : defaultWidth,
            }}
          >
            {statusListWidth.map((statusData: TStatusData) =>
              statusData.hideInLine ? null : (
                <div
                  key={statusData.type}
                  style={{
                    background: getStatusColor(type, statusData.type),
                    width: `${statusData.width}%`,
                  }}
                ></div>
              )
            )}
          </div>
        </div>
      </Tooltip>
      {footer && (
        <div className="flex items-center text-tas-400 text-size-12 whitespace-no-wrap">
          {footer.map((statusData: TStatusData) => (
            <div key={statusData.type} className="mr-20">
              <span
                className="inline-block h-8 w-8 rounded-full mr-4"
                style={{
                  background: statusData.color || getStatusColor(type, statusData.type),
                }}
              ></span>
              <span>{statusData.count || 0}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { StackedHrType };

export default StackedHr;
