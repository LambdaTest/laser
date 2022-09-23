export const TIME_IN_MS = {
  MILLISECOND: 1,
  HUNDRED_MILLISECOND: 100,
  SECOND: 1000,
  TEN_SECOND: 10 * 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
};

export const TIME_LABEL = {
  MILLISECOND: 'ms',
  HUNDRED_MILLISECOND: (val: number) => val * 100 + 'ms',
  SECOND: 's',
  TEN_SECOND: (val: number) => val * 10 + 's',
  MINUTE: 'm',
  HOUR: 'h',
};
