import { useMemo } from 'react';
import moment from 'moment';

import DateFormats from '../../../constants/DateFormats';

import { TPeriodRangeOption } from '../types';

const ToggleButton = ({
  label,
  onClick,
  placeholder,
  selectedOption,
}: {
  label?: string;
  onClick: any;
  placeholder?: string;
  selectedOption: TPeriodRangeOption;
}) => {
  const displayLabel = useMemo(() => {
    if (!selectedOption?.range[0] || !selectedOption?.range[1]) {
      return placeholder;
    } else if (selectedOption.value === 'custom') {
      return (
        moment(selectedOption.range[0]).format(DateFormats.DISPLAY) +
        ' - ' +
        moment(selectedOption.range[1]).format(DateFormats.DISPLAY)
      );
    }
    return selectedOption.label;
  }, [selectedOption]);

  return (
    <button
      className="tas-period-toggle hover:bg-gray-100 text-size-14 block bg-white border border-gray-300 radius-3 px-10 py-5"
      onClick={onClick}
    >
      {label && <span className="text-tas-400">{label}</span>}
      <span id='tas_period_filter_label'>{displayLabel}</span>
    </button>
  );
};

export default ToggleButton;
