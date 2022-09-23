import React from 'react';

import dynamic from 'next/dynamic';
const Charts = dynamic(() => import('react-apexcharts'), { ssr: false });

const DefaultChartOption = {
  chart: {
    type: 'bar',
    width: '100%',
    stacked: true,
    parentHeightOffset: 0,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      columnWidth: '40%',
      borderRadius: [5],
    },
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
    curve: 'smooth',
  },
  title: {
    text: '',
    align: 'left',
  },
};

const BarChart = ({
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
  return <Charts type="bar" options={allOptions} series={series} width={width} height={height} />;
};

export default BarChart;
