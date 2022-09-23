import BarChartPlaceholder from 'components/BarChartPlaceholder';
import PeriodRangeFilter, { TRange } from 'components/PeriodRangeFilter';
import TestsByBuildChart from './TestsByBuildChart';

interface TProps {
  chartData: any;
  loading: boolean;
  periodRange: TRange;
  setPeriodRange: (range: TRange) => void;
}

export default function ChartPanel({
  chartData,
  loading = false,
  periodRange,
  setPeriodRange,
}: TProps) {
  let content;
  if (loading || !chartData.length) {
    content = (
      <BarChartPlaceholder rowsCount={4} groupsCount={10} groupItemsCount={5} loading={loading} />
    );
  } else {
    content = <TestsByBuildChart chartData={chartData} />;
  }

  return (
    <div className="p-16 bg-white radius-3">
      <div className="flex justify-between items-center mb-8">
        <div className="text-size-16">No. of Flaky Tests</div>
        <div>
          <PeriodRangeFilter onChange={setPeriodRange} label="Date - " value={periodRange} />
        </div>
      </div>
      <div className="" style={{ height: '260px' }}>
        {content}
      </div>
    </div>
  );
}
