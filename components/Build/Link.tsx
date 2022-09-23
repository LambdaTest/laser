import EllipsisText from '../EllipsisText';
import TasLink from '../TasLink';
import Tooltip from '../Tooltip';

enum LinkType {
  FTM = 'flaky',
  POSTMERGE = 'postmerge',
  PREMERGE = 'premerge',
}

const LinkTypeLabel = {
  [LinkType.POSTMERGE]: 'POST',
  [LinkType.PREMERGE]: 'PRE',
  [LinkType.FTM]: 'FTM',
};

const LinkTypeTooltip = {
  [LinkType.POSTMERGE]:
    'This is a Post-merge job. A job that is executed after a PR is merged into a branch.',
  [LinkType.PREMERGE]: 'This is a Pre-merge job. A job that is executed whenever a PR is raised.',
  [LinkType.FTM]:
    'This is a FTM job. FTM (Flaky Test Management) jobs help you identify flaky test cases in your codebase.',
};

const BuildTypeTag = ({ type }: { type: LinkType }) => {
  if (!type) {
    return null;
  }
  return (
    <Tooltip content={LinkTypeTooltip[type]} placement="bottom-start" delay={[800, 0]}>
      <span className="text-tas-400 bg-gray-160 rounded text-size-10 px-5 leading-normal inline-flex ml-4 h-16 items-center">
        {LinkTypeLabel[type]}
      </span>
    </Tooltip>
  );
};

const BuildLink = ({
  id,
  link,
  suffix,
  type,
}: {
  id: string;
  link?: boolean;
  suffix?: any;
  type: LinkType;
}) => {
  if (!id) {
    return <span className="inline-flex items-center">-</span>;
  }

  const buildTypeTag = <BuildTypeTag type={type} />;
  const suffixElement = (
    <span className="inline-flex items-center">
      {buildTypeTag}
      {!!suffix ? suffix : ''}
    </span>
  );

  if (link) {
    return (
      <span className="inline-flex items-center">
        <TasLink ellipsisProps={{ suffixElement: suffixElement }} id={id} path="jobs" />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center">
      #<EllipsisText copy suffixElement={suffixElement} text={id} />
    </span>
  );
};

export default BuildLink;
