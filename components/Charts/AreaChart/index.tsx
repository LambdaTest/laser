import React from 'react';

import dynamic from 'next/dynamic';
const Charts = dynamic(() => import('react-apexcharts'), { ssr: false });

const DefaultChartOption = {
  chart: {
    type: 'area',
    width: '100%',
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  colors: ['#AADAF4', '#F9E9B8', '#DCF9B8', '#FFCA82', '#8F8F8F'],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
  },
  fill: {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.8,
      opacityTo: 0.4,
    },
  },
  legend: {
    horizontalAlign: 'left',
    offsetX: -10,
    markers: {
      offsetX: -5,
      offsetY: 2,
      radius: 3,
    },
    itemMargin: {
      horizontal: 20,
    },
  },
  xaxis: {
    type: 'datetime',
  },
};

const AreaChart = ({
  options = {},
  series = [],
  width = 700,
  height = 300,
}: {
  options: any;
  series: any;
  width: number;
  height: number;
}) => {
  const allOptions = {
    ...DefaultChartOption,
    ...options,
  };
  return <Charts type="area" options={allOptions} series={series} width={width} height={height} />;
};

export default AreaChart;
