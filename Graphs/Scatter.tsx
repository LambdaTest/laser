import { Chart } from "react-google-charts";
import * as React from "react";
import PassFailPlaceholer from "../components/PassFailPlaceholder";


const Scatter = ({data, date, loading}:any) => {
  return (
    <>
      {loading && (
        <div style={{ padding: '50px 80px' }}>
          <div className="placeholder-content" style={{ height: '300px' }}></div>
        </div>
      )}
      {!loading && data && data.length < 2 && (
        <PassFailPlaceholer message={`No data available for selected duration.`} />
      )}
      {data && data.length >= 2 && (
        <Chart
          chartType="LineChart"
          data={data}
          height={'400px'}
          loader={
            <div style={{ padding: '50px 80px' }}>
              <div className="placeholder-content" style={{ height: '300px' }}></div>
            </div>
          }
          options={{
            pointSize: 8,
            lineWidth: 0,
            colors: ['#70cba6'],
            hAxis: {
              // title: 'Time',
              textStyle: {
                fontSize: 10,
                color: '#9aa1a9',
              },
              viewWindow: {
                min: new Date(date.start_date),
                max: new Date(date.end_date),
              },
              gridlines: {
                count: -1,
                units: {
                  days: { format: ['MMM dd'] },
                  hours: { format: ['HH:mm', 'ha'] },
                },
                // color: '#e9ebf1'
              },
            },
            vAxis: {
              title: 'ms',
              textStyle: {
                fontSize: 10,
                color: '#9aa1a9',
              },
              // gridlines: {
              //   color: '#e9ebf1'
              // }
              minValue: 0,
            },
            legend: { position: 'none' },
            tooltip: { textStyle: { fontSize: 12 } },
          }}
          rootProps={{ 'data-testid': '1' }}
          width={'100%'}
        />
      )}
    </>
  );
};
export default Scatter