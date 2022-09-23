import React from 'react';

import dynamic from 'next/dynamic';
const Charts = dynamic(() => import('react-apexcharts'), { ssr: false });

const DefaultChartOption = {
  chart: {
    type: 'line',
    width: '100%',
    // stacked: true,
    parentHeightOffset: 0,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    }
  },
  dataLabels: {
    enabled: false,
  },
  colors: ['#46BD84', '#F0646E'],
  grid: {
    show: true,
    borderColor: '#EAEBEF',
    row: {
      colors: ['transparent', 'transparent'],
      opacity: 1,
    },
  },
  legend: {
    show: false,
  },
  stroke: {
    width: [2, 2],
  },
  title: {
    text: '',
    align: 'left',
  },
};

const LineChart = ({
  height = 300,
  options = {},
  series = [],
  width = 700,
}: {
  height: any;
  options: any;
  series: any;
  width: any;
}) => {
  const allOptions = {
    ...DefaultChartOption,
    ...options,
  };
  return <Charts type="line" options={allOptions} series={series} width={width} height={height} />;
};

export default LineChart;
