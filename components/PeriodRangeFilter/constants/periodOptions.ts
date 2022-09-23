import moment from 'moment';

import DateFormats from '../../../constants/DateFormats';

import { TPeriodRangeOption } from '../types';

const PeriodOptions: TPeriodRangeOption[] = [
  {
    label: 'Last 24 hours',
    range: [
      moment().subtract(1, 'day').format(DateFormats.DATE_TIME),
      moment().format(DateFormats.DATE_TIME),
    ],
    value: 'day',
  },
  {
    label: 'Last week',
    range: [
      moment().subtract(1, 'week').format(DateFormats.DATE_TIME),
      moment().format(DateFormats.DATE_TIME),
    ],
    value: 'week',
  },
  {
    label: 'Last 2 weeks',
    range: [
      moment().subtract(2, 'week').format(DateFormats.DATE_TIME),
      moment().format(DateFormats.DATE_TIME),
    ],
    value: 'two_weeks',
  },
  {
    label: 'Last 4 weeks',
    range: [
      moment().subtract(4, 'week').format(DateFormats.DATE_TIME),
      moment().format(DateFormats.DATE_TIME),
    ],
    value: 'four_weeks',
  },
];

export default PeriodOptions;
