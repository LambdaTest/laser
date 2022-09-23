import React from 'react';
import ReactTimeago from 'react-timeago';

export default function TimeAgo({ date, hideTitle = false }: any) {
  return (
    <>
      <ReactTimeago
        date={date}
        minPeriod={10}
        title={!hideTitle ? new Date(date).toLocaleString() : ''}
      />
    </>
  );
}
