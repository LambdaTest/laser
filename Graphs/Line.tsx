import { Chart } from "react-google-charts";
import * as React from "react";
import LinePlaceholer from "../components/LinePlaceholder";

const Line = ({data, vAxisTitle='', loading}:any) => {
  return (
      <>
      {loading &&
      <div className="bg-white">
          <div style={{padding: '50px 80px'}}>
            <div className="placeholder-content" style={{height: '300px'}}>

            </div>
          </div>
      </div>
      }
      {!loading && data && data.length < 2 && <LinePlaceholer />}
      {!loading && !data && <LinePlaceholer />}
    {data && data.length >= 2 && <Chart
        width={'100%'}
        height={'400px'}
        chartType="LineChart"
        loader={<div className="bg-white">
        <div style={{padding: '50px 80px'}}>
          <div className="placeholder-content" style={{height: '300px'}}>

          </div>
        </div>
    </div>}
        data={data}
        options={{
            colors: ['#5FC8AF'],
            hAxis: {
                // title: 'Time',
                textStyle : {
                    fontSize: 10,
                    color: "#9aa1a9"
                },
                viewWindow: {
                  min: new Date(data[1][0]),
                  max: new Date(data[data.length - 1][0])
                },
                gridlines: {
                  count: -1,
                  units: {
                    days: {format: ['MMM dd']},
                    hours: {format: ['HH:mm', 'ha']},
                  },
                  // color: '#e9ebf1'
                }
            },
            vAxis: {
                title: vAxisTitle,
                textStyle : {
                    fontSize: 10,
                    color: "#9aa1a9"
                },
                minValue: 0,
            },
            legend: { position: 'none' },
            tooltip: { textStyle: {fontSize: 12 } },

        }}
        rootProps={{ 'data-testid': '1' }}
    />}
    </>
  );
};
export default Line