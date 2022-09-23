import moment from 'moment';

import { NULL_DATE_STRING, NULL_DATE_UTC_STRING } from '../constants';
import DateFormats from '../constants/DateFormats';
import { TIME_IN_MS } from 'constants/Duration';

export const getDaysBetweenDates = ({
  endDate,
  format = DateFormats.DATE_TIME,
  startDate,
}: {
  endDate: string;
  format?: string;
  startDate: string;
}): string[] => {
  const dates = [];

  const currDate = moment(startDate).startOf('day');
  const lastDate = moment(endDate).startOf('day');

  dates.push(String(currDate.format(format)));

  while (currDate.add(1, 'days').diff(lastDate) <= 0) {
    dates.push(currDate.clone().format(format));
  }

  return dates;
};

export const getDateDifference = (date1: Date, date2: Date, differenceUnit = 'ms') => {
  let startDate;
  // @ts-ignore
  if (date1 === NULL_DATE_STRING || date1 === NULL_DATE_UTC_STRING) {
    startDate = moment(date2);
  } else {
    startDate = moment(date1);
  }
  const endDate = moment(date2);

  // @ts-ignore
  return endDate.diff(startDate, differenceUnit);
};

export const compareDateRangeByDate = (
  rangeA: [string, string],
  rangeB: [string, string]
): boolean => {
  return (
    rangeA.map((date) => date.split('T')[0]).join(',') ===
    rangeB.map((date) => date.split('T')[0]).join(',')
  );
};

export const getGranularity = (milliseconds: number) => {
  if (milliseconds < TIME_IN_MS.HUNDRED_MILLISECOND) {
    return 'MILLISECOND';
  } else if (milliseconds < TIME_IN_MS.SECOND) {
    return 'HUNDRED_MILLISECOND';
  } else if (milliseconds < TIME_IN_MS.TEN_SECOND) {
    return 'SECOND';
  } else if (milliseconds < TIME_IN_MS.MINUTE) {
    return 'TEN_SECOND';
  } else if (milliseconds < TIME_IN_MS.HOUR) {
    return 'MINUTE';
  } else {
    return 'HOUR';
  }
};
