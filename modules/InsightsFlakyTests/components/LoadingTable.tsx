export default function LoadingTable({ rowCount }: { rowCount: number }) {
  const rows = [];

  for (let i = 0; i < rowCount; i++) {
    rows.push(
      <div className="w-full flex justify-between items-center bg-white border-t p-16" key={i}>
        <div className="" style={{ width: '40%' }}>
          <div className="w-8/12 mb-8">
            <div className="placeholder-content placeholder-content-10"></div>
          </div>
          <div className="w-4/12">
            <div className="placeholder-content placeholder-content-10"></div>
          </div>
        </div>
        <div className="pr-16" style={{ width: '16%' }}>
          <div className="w-8/12 mb-8">
            <div className="placeholder-content placeholder-content-10"></div>
          </div>
          <div className="w-4/12">
            <div className="placeholder-content placeholder-content-10"></div>
          </div>
        </div>
        <div className="pr-16" style={{ width: '16%' }}>
          <div className="w-8/12 mb-8">
            <div className="placeholder-content placeholder-content-10"></div>
          </div>
          <div className="w-4/12">
            <div className="placeholder-content placeholder-content-10"></div>
          </div>
        </div>
        <div className="pr-16" style={{ width: '14%' }}>
          <div className="w-4/12">
            <div className="placeholder-content placeholder-content-10"></div>
          </div>
        </div>
        <div className="" style={{ width: '14%' }}>
          <div className="w-4/12">
            <div className="placeholder-content placeholder-content-10"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sticky z-10 bg-gray-60 pt-8" style={{ top: 92 }}>
        <div className="w-full flex justify-between items-center bg-white border-b h-32 px-16">
          <div className="" style={{ width: '40%' }}>
            <div className="w-4/12">
              <div className="placeholder-content placeholder-content-10"></div>
            </div>
          </div>
          <div className="pr-16" style={{ width: '16%' }}>
            <div className="w-8/12">
              <div className="placeholder-content placeholder-content-10"></div>
            </div>
          </div>
          <div className="pr-16" style={{ width: '16%' }}>
            <div className="w-8/12">
              <div className="placeholder-content placeholder-content-10"></div>
            </div>
          </div>
          <div className="pr-16" style={{ width: '14%' }}>
            <div className="w-8/12">
              <div className="placeholder-content placeholder-content-10"></div>
            </div>
          </div>
          <div style={{ width: '14%' }}>
            <div className="w-8/12">
              <div className="placeholder-content placeholder-content-10"></div>
            </div>
          </div>
        </div>
      </div>
      <div>{rows}</div>
    </>
  );
}
