import React from 'react';

import Txt from 'components/Txt';
import Avatar from 'components/Avatar';

type TooltipCardType = {
  authorName: string;
  branchName: string;
  buildId: string;
  commitId: string;
  endedAt: string;
  isPassed: boolean;
  suitName: string;
};

const PASSED = '/assets/images/icon/icon-Status-Passed.svg';
const FAILED = '/assets/images/icon/icon-Status-Failed.svg';
const BRANCH = '/assets/images/icon/branch.svg';
const COMMIT = '/assets/images/icon/commit.svg';
const SUITE = '/assets/images/icon/suite.svg';

const TooltipCard = (props: TooltipCardType) => {
  const {
    authorName = '',
    branchName = '',
    buildId = '',
    commitId = '',
    endedAt = '',
    isPassed = false,
    suitName = '',
  } = props;
  const status = isPassed ? 'Passed' : 'Failed';

  return (
    <div className="p-20 min-w-280 min-h-172">
      <div className="flex min-w-[280px] items-center justify-between">
        <Txt size={16} text={buildId} />
        <Status isPassed={isPassed} status={status} />
      </div>
      <Txt className="mt-4" color={Txt.Color.SECONDARY} icon={SUITE} size={12} text={suitName} />
      <Txt className="mt-4" color={Txt.Color.SECONDARY} icon={COMMIT} size={12} text={commitId} />
      <Txt className="mt-4" color={Txt.Color.SECONDARY} icon={BRANCH} size={12} text={branchName} />
      <div className="flex items-center justify-start mt-20">
        <Avatar fixedColor={true} name={authorName} />
        <div className="ml-8">
          <Txt size={14} text={authorName} />
          <Txt className="mt-4" color={Txt.Color.SECONDARY} size={12} text={endedAt} />
        </div>
      </div>
    </div>
  );
};

const Status = ({ status, isPassed }: any) => {
  const img = isPassed ? PASSED : FAILED;
  const color = isPassed ? 'bg-green-600' : 'bg-red-700';

  return (
    <div
      className={`flex items-center justify-between h-24 w-100 p-8 box-border rounded-md ${color}`}
    >
      <Txt color={Txt.Color.WHITE} text={status} />
      <img src={img} height="16" width="20" />
    </div>
  );
};

export default React.memo(TooltipCard);
