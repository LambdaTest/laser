import React from 'react';
import InsightsPlaceholder from 'components/InsightsPlaceholder';
import BarChartPlaceholder from 'components/BarChartPlaceholder';

enum Variant {
  DATE_CHART = 0,
  COMMIT_CHART = 1,
}

const LoadingState = React.memo(({ variant = Variant.DATE_CHART }: any) => {
  const getRightSection = () => {
    if (variant === Variant.DATE_CHART) {
      return (
        <div className="w-2/12 relative">
          <div
            className="absolute bg-white w-6/12 h-24 z-10 rounded"
            style={{ top: '4px', left: '4px' }}
          ></div>
          <InsightsPlaceholder size={InsightsPlaceholder.SizeVariant.MID_SMALL} />
        </div>
      );
    }

    return (
      <div className="w-2/12 relative flex items-end">
        <InsightsPlaceholder className="w-6/12 mr-8" size={InsightsPlaceholder.SizeVariant.ATOM} />
        <InsightsPlaceholder className="w-6/12" size={InsightsPlaceholder.SizeVariant.MID_NANO} />
      </div>
    );
  };

  return (
    <div className="p-15 -mt-12">
      <div className="flex items-center justify-between">
        <div className="w-4/12">
          <InsightsPlaceholder
            className="w-5/12 mb-8"
            size={InsightsPlaceholder.SizeVariant.NANO}
          />
          <InsightsPlaceholder size={InsightsPlaceholder.SizeVariant.ATOM} />
        </div>
        {getRightSection()}
      </div>
      <BarChartPlaceholder
        fullBarHeight={true}
        rowsCount={5}
        rowHeight={38}
        groupsCount={30}
        groupItemsCount={1}
        loading={true}
      />
    </div>
  );
}) as any;

LoadingState.Variant = Variant;
export default LoadingState;
