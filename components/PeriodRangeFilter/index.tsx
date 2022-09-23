import { useEffect, useState, useRef } from 'react';

import useDetectOutsideClick from '../../hooks/useDetectOutsideClick';
import useToggle from '../../hooks/useToggle';

import { compareDateRangeByDate } from '../../helpers/dateHelpers';

import { TRange, TPeriodRangeOption } from './types';
import PeriodOptions from './constants/periodOptions';

import DetailsPanel from './components/DetailsPanel';
import ToggleButton from './components/ToggleButton';

const CustomOption: TPeriodRangeOption = {
  label: 'Custom',
  range: ['', ''],
  value: 'custom',
};

const MergedPeriodOptions: TPeriodRangeOption[] = [...PeriodOptions, CustomOption];

const getPeriodOptionFromRange = (range: TRange): TPeriodRangeOption => {
  return (
    MergedPeriodOptions.find((option) =>
      range?.length === 2 ? compareDateRangeByDate(option.range, range) : false
    ) || { ...CustomOption, range: range || ['', ''] }
  );
};

const PeriodRangeFilter = ({
  defaultOpen = false,
  label,
  onChange = () => {},
  placeholder = 'Select',
  value,
}: {
  defaultOpen?: boolean;
  label?: string;
  onChange: (range: TRange) => void;
  placeholder?: string;
  value: TRange;
}) => {
  const [isOpen, toggleOpen, setOpen] = useToggle(defaultOpen);
  const [selectedOption, setSelectedOption] = useState<TPeriodRangeOption>(() =>
    getPeriodOptionFromRange(value)
  );

  const filterWrapperRef = useRef<HTMLDivElement>(null);

  const handleChange = (option: TPeriodRangeOption) => {
    option && onChange(option.range);
    setOpen(false);
  };

  useDetectOutsideClick([filterWrapperRef], () => {
    setOpen(false);
  });

  useEffect(() => {
    const selectedOption = getPeriodOptionFromRange(value);
    setSelectedOption(selectedOption);
  }, [value]);

  return (
    <div className="tas-period-container" ref={filterWrapperRef}>
      <ToggleButton
        label={label}
        onClick={toggleOpen}
        placeholder={placeholder}
        selectedOption={selectedOption}
      />
      {isOpen && (
        <DetailsPanel
          onChange={handleChange}
          options={MergedPeriodOptions}
          selectedOption={selectedOption}
        />
      )}
    </div>
  );
};

export type { TRange, TPeriodRangeOption };

export default PeriodRangeFilter;
