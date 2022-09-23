const LoadingItems = new Array(20).fill(0);

const LoaderTable = ({ styles }: any) => {
  return (
    <div className="p-16 pb-0">
      <div
        className="radius-3 border designed-scroll lt-scroll scrolling-auto relative"
        style={styles}
      >
        <div className="border-b flex text-tas-400 w-full sticky top-0 left-0 z-10 bg-white">
          <div className="flex-1 text-size-12 p-8 border-r border-gray-125">Test Cases</div>
          <div className="width-110 text-size-12 p-8">Flake Rate</div>
        </div>
        <div>
          {LoadingItems.map((_row, index) => (
            <div className="flex items-center bg-white border-b" key={index}>
              <div className="flex-1 text-size-12 px-8 py-10 border-r border-gray-125">
                <div className="w-4/12">
                  <div className="placeholder-content" style={{ height: '10px' }}></div>
                </div>
              </div>
              <div className="width-110 text-size-12 p-8 border-r border-gray-125">
                <div className="w-4/12">
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

export default LoaderTable;
