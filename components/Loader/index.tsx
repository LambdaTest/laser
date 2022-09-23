import React from 'react';

export default function Loader({
  additionalClassesToAdd = '',
  background,
  height,
  length,
  loader_for = '',
  margin_bottom,
  type,
  ...rest
}: any) {
  const Cols = () => {
    if (loader_for === 'dashboard') {
      return (
        <>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-1/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-1/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
        </>
      );
    } else if (loader_for === 'tests') {
      return (
        <>
          <div className="w-3/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-1/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-1/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-1/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
        </>
      );
    } else if (loader_for === 'jobs') {
      return (
        <>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-1/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-3/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
        </>
      );
    } else if (loader_for === 'test_suites') {
      return (
        <>
          <div className="w-3/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-1/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-1/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-1/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
        </>
      );
    } else if (loader_for === 'commits') {
      return (
        <>
          <div className="w-4/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
        </>
      );
    } else if (loader_for === 'build_tests') {
      return (
        <>
          <div className="w-4/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
        </>
      );
    } else if (loader_for === 'build_ftm_insights') {
      return (
        <>
          <div className="width-260 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="width-135 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="width-135 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="flex-1 px-15">
            <div className="placeholder-content"></div>
          </div>
        </>
      );
    } else if (loader_for === 'test_details') {
      return (
        <>
          <div className="w-4/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
        </>
      );
    } else if (loader_for === 'test_details') {
      return (
        <>
          <div className="w-3/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-3/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
        </>
      );
    } else if (loader_for === 'impacted_tests') {
      return (
        <>
          <div className="w-6/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-3/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-3/12 px-15">
            <div className="placeholder-content"></div>
          </div>
        </>
      );
    } else if (loader_for === 'synapse_config') {
      return (
        <>
          <div className="w-6/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-3/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-3/12 px-15">
            <div className="placeholder-content"></div>
          </div>
        </>
      );
    } else if (loader_for === 'settings') {
      return (
        <>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-3/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
        </>
      );
    } else if (loader_for === 'repositories') {
      return (
        <>
          <div className="w-10/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="w-3/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-1/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
          <div className="w-2/12 px-15">
            <div className="placeholder-content"></div>
          </div>
        </>
      );
    }
  };

  const makeArr = (times: number) => {
    let arr = [];
    for (let i = 0; i < times; i++) {
      arr.push(i);
    }
    return arr;
  };
  const classesToAdd = `flex items-center justify-between ${additionalClassesToAdd}`;
  return (
    <div type={type ? type : 'list'} {...rest}>
      {makeArr(length ? length : 10).map((el: any) => (
        <div
          style={{
            marginBottom: `${margin_bottom ? margin_bottom : 1}px`,
            height: `${height ? height : 66}px`,
            background: `#${background ? background : 'FFFFFF'}`,
            borderRadius: '6px',
          }}
          className={classesToAdd}
          key={el}
        >
          <Cols />
        </div>
      ))}
    </div>
  );
}
