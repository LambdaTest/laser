import TasLink from '../../../components/TasLink'

const CommitCellRenderer = ({ value }: { value: string; }) => {
  return (
    <div className="flex items-center">
      {value ? (
        <>
          <img src="/assets/images/yellow-2.svg" className="mr-8 h-10" />
          <TasLink id={value} path='commits' text={value} textLength={7} />
        </>
      ) : (
        '-'
      )}
    </div>
  );
};

export default CommitCellRenderer;