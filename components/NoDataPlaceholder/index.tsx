const NoDataPlaceholder = ({ height = '200px', message = 'Currently there is not data available.' }: { height?: string, message?: string }) => {
  return (
    <div
      style={{
        height,
      }}
      className="flex items-center justify-center"
    >
      <div
        className="flex items-center p-10 m-auto rounded"
      >
        <img src="/assets/images/passfail.svg" className="mr-15" />
        <span className="text-gray-500 text-size-14" dangerouslySetInnerHTML={{ __html: message }} />
      </div>
    </div>
  );
};

export default NoDataPlaceholder;
