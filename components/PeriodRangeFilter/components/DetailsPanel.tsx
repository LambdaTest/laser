import { useState } from 'react';

import { TPeriodRangeOption } from '../types';

import CustomRangePanel from './CustomRangePanel';

const DetailsPanel = ({
  onChange,
  options,
  selectedOption,
}: {
  onChange: any;
  options: TPeriodRangeOption[];
  selectedOption: TPeriodRangeOption;
}) => {
  const [activeOption, setActiveOption] = useState(selectedOption);

  const handleChange = (option: TPeriodRangeOption) => () => {
    if (option.value !== 'custom') {
      setActiveOption(option);
      onChange(option);
    } else {
      setActiveOption({ ...option, range: activeOption.range });
    }
  };

  const onCustomRangeChange = (range: [string, string] | null) => {
    let newOption;
    if (range) {
      newOption = {
        ...activeOption,
        range,
      };
    }
    onChange(newOption);
  };

  return (
    <div className="tas-period-options-container absolute w-auto bg-white border border-gray-300 radius-3 right-0 mt-5">
      <div className="border-b p-10 px-15 text-size-14 text-black">Timespan</div>
      <div className="flex">
        <div className="w-150 p-10">
          {options.map((option) => (
            <div
              className={`text-tas-400 tas-period-item text-size-12 block px-8 py-5 cursor-pointer text-ellipsis radius-3 ${
                option.value === activeOption.value ? 'active' : ''
              }`}
              key={option.value}
              onClick={handleChange(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
        {activeOption.value === 'custom' && (
          <CustomRangePanel onChange={onCustomRangeChange} value={activeOption.range} />
        )}
      </div>
    </div>
  );
};

export default DetailsPanel;
