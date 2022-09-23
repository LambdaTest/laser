import TasLink from '../../../components/TasLink';
import Dropdown from '../../../components/Dropdown';

const BuildCellRenderer = ({ value }: { value: any[] }) => {
  if (!value) {
    return <div className="flex items-center text-blue-400 text-size-14">-</div>;
  }

  const [firstBuild, ...restBuilds] = value.map((build) => build.build_id);

  const toggleRenderer = () => (
    <div className="text-size-12 text-blue-400 bg-blue-100 px-5 rounded cursor-pointer">
      +{restBuilds.length} More
    </div>
  );

  const optionRenderer = (buildId: any) => (
    <div className="text-tas-400 text-size-12 block px-8 py-5 text-ellipsis rounded">
      <TasLink id={buildId} path="jobs" text={buildId} textLength={7} />
    </div>
  );

  return (
    <div className="flex items-center text-blue-400 text-size-14">
      <TasLink id={firstBuild} path="jobs" text={firstBuild} textLength={7} />
      {restBuilds.length ? (
        <Dropdown
          dropdownStyles={{ minWidth: '120px' }}
          getPopupContainer={() => document.querySelector('#analytics-table') as HTMLElement}
          optionRenderer={optionRenderer}
          options={restBuilds}
          toggleRenderer={toggleRenderer}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default BuildCellRenderer;
