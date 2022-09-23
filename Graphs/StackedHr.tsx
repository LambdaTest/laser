import React, { useMemo } from "react";
import Tooltip from "react-simple-tooltip";

const defaultWidth = 200;
const defaultHeight = 5;

/**
 * @todo: Move these to a separate constant file
 */
const StatusToClassName: { [key: string]: string } = {
  passed: 'bg-green-300',
  completed: 'bg-green-300',
  failed: 'bg-red-300',
  error: 'bg-red-300',
  aborted: 'bg-red-400',
  skipped: 'bg-gray-160',
  blacklisted: 'bg-black',
  blocklisted: 'bg-black',
  initiating: 'bg-yellow-500',
  running: 'bg-yellow-500',
  unimpacted: 'bg-gray-180',
};

const StackedHr = ({ data, width, height }: any) => {
  /**
 * @todo: Refactor this for ease of understanding
 */
  const totalVals = useMemo(() => () => {
    const countArr: any = [];
    data.forEach((el: any) => {
      countArr.push(+el.count)
    })
    let total = 0;
    for (let i in countArr) {
      total += countArr[i];
    }
    return total
  }, data)

  const mapArr = useMemo(() => () => {
    const newData = [...data];
    newData.map((el: any) => {
      el.width = (+el.count / totalVals()) * 100;
    })
    return newData;
  }, data)

  if (totalVals() === 0) {
    return <div
      className="inline-flex overflow-hidden rounded-full"
      style={{
        height: height ? height : defaultHeight,
        width: width ? width : defaultWidth,
      }}
    >
      <div className="w-full bg-gray-150"></div>
    </div>
  }

  return <div className="inline-flex relative">
    <div
      className="inline-flex overflow-hidden rounded-full"
      style={{
        width: width ? width : defaultWidth,
        height: height ? height : defaultHeight,
      }}
    >
      {mapArr().map((el: any) => (
        <Tooltip
          className="react_simple_tooltip react_simple_tooltip_stackhr"
          content={`${el.type === 'error' ? 'TAS Error' : el.type} : ${el.count}`}
          key={el.type}
        >
          <div
            className={StatusToClassName[el.type]}
            key={el.type}
            style={{ width: `${el.width}%` }}
          ></div>
        </Tooltip>
      ))}
    </div>
  </div>
};
export default React.memo(StackedHr, (prevProps, nextProps) => {
  if (prevProps.data !== nextProps.data) {
    return true
  }
  return false;
})