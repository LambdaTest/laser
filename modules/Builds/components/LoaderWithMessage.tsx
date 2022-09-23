const LoaderWithMessage = ({ message }: { message: string }) => {
  return (
    <div style={{ height: 'calc(100vh - 262px)' }}>
      <div className="h-32 bg-info-yellow text-size-14 px-16 radius-3 w-full flex items-center text-yellow-800">
        <span className="text-ellipsis opacity-50">{message}</span>
      </div>
      <div className="bg-white overflow-hidden">
        <div className="m-8 p-24 bg-tas-100 radius-3">
          {[1, 2, 3, 4, 5].map((el) => (
            <div key={el} className="mb-30">
              <div className="w-6/12">
                <div className="w-6/12 pb-8">
                  <div className="placeholder-content" style={{ height: '10px' }}></div>
                </div>
                <div className="w-full">
                  <div className="placeholder-content" style={{ height: '10px' }}></div>
                </div>
                <div className="w-3/12 pb-8 mt-10">
                  <div className="placeholder-content" style={{ height: '10px' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoaderWithMessage;
