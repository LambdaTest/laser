import Tooltip from 'components/Tooltip'
import React from 'react'

const infoObj:any = {
  transition: 'Every time a test case goes from a pass to fail state or any other state or vice versa, we refer to that event as a Test Transition.',
  discovery: 'Discovery task is a phase of the TAS job where all the  project dependencies are installed and test cases are discovered for execution.'
}

export default function Info({text, width, placement, type, className}:any) {
  return (
    <span className={`inline-block align-middle ${className}`}>
        <Tooltip content={type ? infoObj[type] : text} placement={placement ? placement : 'bottom'}>
        <img src="/assets/images/icon/info.svg" alt="Info" width={width ? width : 12} />
      </Tooltip>
    </span>
  )
}
