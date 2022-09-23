import { Chart } from "react-google-charts";
import * as React from "react";

const TinyChart = ({data, loading}:any) => {
  return (
    <>
    {loading && <div className="loader"></div>}
    {!loading && data && data.length < 2 && <span>NO GRAPH</span>}
    {!loading && !data && <span>NO GRAPH</span>}
    {data && data.length >= 2 && <Chart
        width={'100px'}
        height={'35px'}
        chartType="LineChart"
        loader={<div className="loader"></div>}
        data={data}
        options={{
            lineWidth: 2,
            legend: { position: 'none' },
            backgroundColor: 'none',
            colors: ['#6772e5'],
            axisFontSize: 0,
            hAxis: {
                baselineColor: 'none',
                ticks: [],
              },
              vAxis: {
                baselineColor: 'none',
                ticks: []
              },
              tooltip: {trigger: 'none', textStyle: {fontSize: 9 } },
              chartArea:{
                left:0,
                top: 0,
                width: '100%',
                height: '100%',
            }

        }}
        rootProps={{ 'data-testid': '1' }}
    /> }
    </>
  );
};
export default TinyChart