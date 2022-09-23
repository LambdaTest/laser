import React from 'react';

enum SizeVariant {
  EXTRA_SMALL = 'xs',
  LARGE = 'lg',
  MEDIUM = 'md',
  ATOM = 'atom',
  SMALL = 'sm',
  TINY = 'tiny',
  NANO = 'nano',
  LITTLE_SMALL = 'ls',
  MID_SMALL = 'mds',
  MID_NANO = 'md_nano',
}

interface IProps {
  className?: String;
  isAbsolute?: Boolean;
  size?: SizeVariant;
  style?: any;
}

const SizeMap = {
  [SizeVariant.ATOM]: '8px',
  [SizeVariant.NANO]: '14px',
  [SizeVariant.MID_NANO]: '16px',
  [SizeVariant.TINY]: '10px',
  [SizeVariant.EXTRA_SMALL]: '20px',
  [SizeVariant.LITTLE_SMALL]: '24px',
  [SizeVariant.MID_SMALL]: '32px',
  [SizeVariant.SMALL]: '200px',
  [SizeVariant.MEDIUM]: '320px',
  [SizeVariant.LARGE]: '440px',
};

function InsightsPlaceholder({
  className = '',
  isAbsolute = false,
  size = SizeVariant.LARGE,
  style = {},
}: IProps) {
  const positioning = isAbsolute ? 'absolute' : 'relative';
  return (
    <div
      className={`placeholder-content ${positioning} ${className}`}
      style={{ height: SizeMap[size], ...style }}
    ></div>
  );
}

InsightsPlaceholder.SizeVariant = SizeVariant;

export default InsightsPlaceholder;
