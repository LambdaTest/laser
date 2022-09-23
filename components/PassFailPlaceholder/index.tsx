import React from 'react';

const arrHr = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
];
const arrVr = [1, 2, 3, 4, 5, 6];

const SquareBox = () => <div className="border h-38 border-gray-350 flex-1 pfp_grid_box"></div>;

export default function PassFailPlaceholer({
  message = `Currently there is no <br /> data available`,
}) {
  return (
    <div className="passFailPlaceholder relative">
      <div
        className="flex items-center passFailPlaceholder_info"
        style={{
          background: '#ffffffb0',
          borderRadius: '4px',
          left: '0',
          margin: 'auto',
          padding: '10px',
          position: 'absolute',
          right: '0',
          top: '40%',
          width: '220px',
        }}
      >
        <img src="/assets/images/passfail.svg" className="mr-15" />
        <span
          className="text-gray-500 text-size-14"
          dangerouslySetInnerHTML={{
            __html: message,
          }}
        ></span>
      </div>
      <div className="p-66">
        <div>
          {arrVr &&
            arrVr.map((el1: any, index1: any) => (
              <div className="flex pfp_grid_row" key={el1}>
                <span className="w-30 text-size-12 text-gray-500">0.{arrVr.length - index1}</span>
                <div className="flex flex-wrap justify-between flex-1" key={el1}>
                  {arrHr && arrHr.map((el2: any) => <SquareBox key={el2} />)}
                </div>
              </div>
            ))}
        </div>
        <div className="flex">
          <span className="w-30 text-size-12 text-gray-500"></span>
          <div className="flex flex-wrap justify-between flex-1">
            {arrHr &&
              arrHr.map((el3: any) => (
                <span className="text-size-12 text-gray-500" key={el3}>
                  {el3}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
