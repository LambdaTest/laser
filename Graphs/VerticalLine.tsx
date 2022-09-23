import React from 'react';

import Text from '../components/Tags/Text';
import Tooltip from '../components/Tooltip';

import * as StatusColors from 'constants/StatusColors';
import * as StatusTypes from 'constants/StatusTypes';
import * as StatusLabels from 'constants/StatusLabels';

const WhiteListStatus = ['running', 'initiating'];

function getTooltipText(status: string, remark?: string) {
  if (status === 'FAILED' && remark) {
    return remark;
  }
  if (status === 'ERROR' && remark) {
    return remark;
  }
  if (status === 'NO_JOB_COMMIT') {
    return 'No job initiated for this commit';
  }
  return (
    StatusLabels.TestStatusLabels[status as keyof typeof StatusTypes.TestStatusTypes] ||
    StatusLabels.BuildStatusLabels[status as keyof typeof StatusTypes.BuildStatusTypes] ||
    StatusLabels.TaskStatusLabels[status as keyof typeof StatusTypes.TaskStatusTypes]
  );
}

const VerticalLine = ({
  className,
  remark,
  type,
}: {
  className?: string;
  remark?: string;
  type: string;
}) => {
  const statusKeyName = type.toUpperCase();
  const statusLabel = getTooltipText(statusKeyName, remark);
  const playAnimation = WhiteListStatus.includes(statusKeyName.toLowerCase());

  return (
    <Tooltip content={statusLabel} placement="right">
      <Text
        className={`${className} ${
          (!statusLabel || statusKeyName === 'NO_JOB_COMMIT') && 'border'
        } relative`}
        style={{
          background:
            StatusColors.TestStatusColors[
              statusKeyName as keyof typeof StatusTypes.TestStatusTypes
            ] ||
            StatusColors.BuildStatusColors[
              statusKeyName as keyof typeof StatusTypes.BuildStatusTypes
            ],
        }}
      >
        {playAnimation && <div className="vertical-line-sliding-block"></div>}
      </Text>
    </Tooltip>
  );
};
export default VerticalLine;
