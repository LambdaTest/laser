import BarChart from 'components/ECharts/BarChart';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import getTestsByBuildChartConfig from '../services/getTestsByBuildChartConfig';

export default function TestsByBuildChart({ chartData }: { chartData: any[] }) {
  const router = useRouter();
  const { repo, provider, org } = router.query;

  const [chartInstance, setChartInstance] = useState<any>();
  
  const chartConfig = useMemo(() => {
    return getTestsByBuildChartConfig({ data: chartData });
  }, [chartData]);

  useEffect(() => {
    const clickHandler = function ({
      componentType,
      name,
      value,
    }: {
      componentType: string;
      name: string;
      value: string;
    }) {
      const jobId = (componentType === 'series' && name) || (componentType === 'xAxis' && value);
      if (jobId) {
        router.push(`/${provider}/${org}/${repo}/jobs/${jobId}`);
      }
    };
    chartInstance?.on('click', clickHandler);
    return function () {
      chartInstance?.off('click', clickHandler);
    };
  }, [chartInstance]);

  if (!chartConfig) return null;

  return <BarChart height="100%" width="100%" {...chartConfig} onChartReady={setChartInstance} />;
}
