import Tooltip from '../Tooltip';
import Image from '../Tags/Image';

import * as StatusColors from 'constants/StatusColors';
import * as StatusTypes from 'constants/StatusTypes';
import * as StatusLabels from 'constants/StatusLabels';

enum BadgeType {
  BUILD = 'build',
  TASK = 'task',
  TEST = 'test',
}

function getTooltipText(status: string, remark?: string) {
  if (status === 'ERROR' && remark) {
    return remark;
  }
  return null;
}

function getBadgeText(status: string) {
  return (
    StatusLabels.TestStatusLabels[
      status?.toUpperCase() as keyof typeof StatusTypes.TestStatusTypes
    ] ||
    StatusLabels.BuildStatusLabels[
      status?.toUpperCase() as keyof typeof StatusTypes.BuildStatusTypes
    ] ||
    StatusLabels.TaskStatusLabels[status?.toUpperCase() as keyof typeof StatusTypes.TaskStatusTypes]
  );
}

function getBadgeColor(status: string) {
  return (
    StatusColors.TestStatusSecondaryColors[status as keyof typeof StatusTypes.TestStatusTypes] ||
    StatusColors.BuildStatusSecondaryColors[status as keyof typeof StatusTypes.BuildStatusTypes] ||
    '#D7D7D7'
  );
}

function getBadgeTextColor(status: string) {
  if (status === 'PASSED') {
    return '#3C947F';
  }
  else if (status === 'QUARANTINED') {
    return '#FFF';
  }

  return (
    StatusColors.TestStatusColors[status as keyof typeof StatusTypes.TestStatusTypes] ||
    StatusColors.BuildStatusColors[status as keyof typeof StatusTypes.BuildStatusTypes] ||
    '#1f1f1f'
  );
}

function showLoader(status: string) {
  return status === 'RUNNING';
}

const BadgeIconMap = {
  // ABORTED: '/assets/images/icon/icon-Status-Aborted.svg',
  BLOCKLISTED: '/assets/images/icon/icon-Status-Blocklisted.svg',
  ERROR: '/assets/images/icon/icon-Status-Error.svg',
  FAILED: '/assets/images/icon/icon-Status-Failed.svg',
  INITIATING: '/assets/images/icon/icon-Status-Initiating.svg',
  PASSED: '/assets/images/icon/icon-Status-Passed.svg',
  QUARANTINED: '/assets/images/icon/icon-Status-Quarantined.svg',
  // RUNNING: SHOW BLUE LOADER,
  SKIPPED: '/assets/images/icon/icon-Status-Skipped.svg',
  UNIMPACTED: '/assets/images/icon/icon-Status-Unimpacted.svg',
} as any;

const Badge = ({ status, remark }: { status: string; remark?: string }) => {
  const statusKeyName = status?.toUpperCase();

  const tooltipText = getTooltipText(statusKeyName, remark);
  const badgeLabel = getBadgeText(statusKeyName) || status;
  const badgeColor = getBadgeColor(statusKeyName);
  const badgeTextColor = getBadgeTextColor(statusKeyName);
  const badgeIcon = BadgeIconMap[statusKeyName] || '/assets/images/mask-gray.svg';
  const isLoading = showLoader(statusKeyName);

  const buttonDom = (
    <button
      className={`border-0 py-0 outline-none border-none focus:outline-none h-24 px-8 radius-3 text-size-14 transition inline-flex items-center overflow-hidden`}
      style={{ background: badgeColor, color: badgeTextColor }}
    >
      {!isLoading && typeof badgeIcon === 'string' && (
        <Image src={badgeIcon} alt="" width="20" className="mr-8 inline" />
      )}
      {!isLoading && typeof badgeIcon !== 'string' && badgeIcon}
      {isLoading && <div className="loader mr-10 loader-base-blue">Loading...</div>}
      <span>{badgeLabel || 'N/A'}</span>
    </button>
  );

  if (tooltipText) {
    return (
      <Tooltip content={tooltipText} placement="right">
        {buttonDom}
      </Tooltip>
    );
  }
  return buttonDom;
};

export { BadgeType };
export default Badge;
