import { useMemo, useState } from 'react';
import moment from 'moment';

import DateFormats from '../../../constants/DateFormats';
import { DatePatterns } from '../../../constants/InputPatterns';

import { TRange } from '../types';

const Today = moment().format(DateFormats.DATE_ONLY);

const DateFields = [
  {
    label: 'Start date',
    name: 'startDate'
  },
  {
    label: 'End date',
    name: 'endDate'
  },
];

const CustomRangePanel = ({
  onChange,
  value,
  max = Today,
}: {
  onChange: (range: TRange | null) => void;
  value: TRange;
  max?: string;
}) => {
  const [range, setRange] = useState(() => (value || []).map((date) => date.split('T')[0]));
  const [applyDisabled, errorMessage] = useMemo(() => {
    if (!range[0] || !range[1]) {
      return [true, ''];
    }
    if (range[0] > max) {
      return [true, 'Start date must be today or earlier'];
    }
    if (range[1] > max) {
      return [true, 'End date must be today or earlier'];
    }
    if (range[0] > range[1]) {
      return [true, 'Start date must be before end date'];
    }
    return [false, ''];
  }, [range]);

  const handleApply = () => {
    const formattedDate: TRange = [
      moment(range[0], DateFormats.DATE_ONLY).startOf('day').format(DateFormats.DATE_TIME),
      moment(range[1], DateFormats.DATE_ONLY).endOf('day').format(DateFormats.DATE_TIME),
    ];
    onChange(formattedDate);
  };

  const handleCancel = () => {
    onChange(null);
  };

  const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRange = [...range];
    newRange[index] = e.target.value;
    setRange(newRange);
  };

  return (
    <div className="p-10 border-l flex flex-col width-200">
      <div className="flex-1">
        {DateFields.map((field, index) => (
          <div className="mb-10" key={field.name}>
            <div className="text-tas-400 text-size-12">{field.label}</div>
            <input
              className="tas-period-input text-size-14 border radius-3 p-8 py-3 w-full"
              onChange={handleChange(index)}
              pattern={DatePatterns.DATE_ONLY}
              type="date"
              value={range[index]}
              max={max}
            />
          </div>
        ))}
      </div>
      {errorMessage && <div className="text-size-12 text-red-300 mb-10">{errorMessage}</div>}
      <div className="flex justify-end">
        <button
          className="ml-10 px-15 py-5 radius-3 text-size-12 hover:bg-gray-100"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className={`ml-10 px-15 py-5 radius-3 text-size-12 bg-black text-white ${
            applyDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={applyDisabled}
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default CustomRangePanel;
