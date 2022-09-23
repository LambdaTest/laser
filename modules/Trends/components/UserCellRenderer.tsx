import Tooltip from '../../../components/Tooltip';

const UserCellRenderer = ({
  showTooltip = false,
  value,
}: {
  showTooltip?: boolean;
  value: string;
}) => {
  return (
    <div className="flex items-center">
      <img src="/assets/images/user-gray.svg" alt="" className="mr-10 h-14" />
      {showTooltip && (
        <Tooltip content={value}>
          <div className="text-size-14 text-ellipsis">{value}</div>
        </Tooltip>
      )}
      {!showTooltip && <div className="text-size-14 text-ellipsis">{value}</div>}
    </div>
  );
};

export default UserCellRenderer;
