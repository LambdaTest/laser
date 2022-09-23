import Dropdown from 'components/Dropdown';
import Image from 'components/Tags/Image';

interface IOptionValue {
  value: string;
  customValue?: string;
}

const toggleRenderer = ({
  disabled,
  index,
  isActive,
  onChange,
  selected,
  selectedOption,
  selectedValue,
}: any) => {
  const labelComponent =
    selectedValue?.value === 'custom' ? (
      <div className="width-200">
        <input
          className={`tas-custom-focus py-10 text-size-14 h-32 block rounded w-full`}
          onChange={(e) =>
            onChange(
              selected.map((el: IOptionValue, elIndex: number) =>
                elIndex === index ? { value: 'custom', customValue: e.target.value } : el
              )
            )
          }
          value={selectedValue.customValue}
          placeholder={'Enter command...'}
          autoFocus
        />
      </div>
    ) : (
      selectedOption?.label || 'Select'
    );

  const hasValue =
    selectedValue.value && (selectedValue.value !== 'custom' || selectedValue.customValue);

  return (
    <button
      className={`tas-custom-focus text-size-12 px-10 bg-gray-100 border rounded text-ellipsis flex items-center justify-between w-full ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{
        background: '#fff',
        fontSize: 14,
        height: '32px',
        minWidth: '100%',
        border: hasValue ? '1px solid rgb(169, 165, 255)' : '',
      }}
    >
      <span className="inline-flex items-center text-ellipsis">
        <span className="block text-ellipsis">{labelComponent}</span>
      </span>
      <span className={`inline-flex items-center ml-8 w-10 ${isActive ? 'tas-rotate-180' : ''}`}>
        <img className="w-full" src="/assets/images/arrow_down_gray.svg" alt="..." width="10" />
      </span>
    </button>
  );
};

export default function MultiSelectField({ disabled, mountRef, onChange, options, selected }: any) {
  return (
    <div className="w-full pt-16">
      {selected.length > 0 &&
        selected.map((selectedValue: IOptionValue, index: number) => {
          const hasValue =
            selectedValue.value && (selectedValue.value !== 'custom' || selectedValue.customValue);
          return (
            <div
              key={`${selectedValue}_${index}`}
              className={`flex items-center ${index + 1 !== selected.length ? 'pb-8' : ''}`}
            >
              <div className="width-200">
                <Dropdown
                  disabled={disabled}
                  getPopupContainer={() => mountRef.current}
                  onClick={(value) => {
                    const updatedConfig = selected.map((el: IOptionValue, elIndex: number) =>
                      elIndex === index ? { value } : el
                    );
                    onChange(updatedConfig);
                  }}
                  options={options}
                  selectedOption={selectedValue.value}
                  toggleRenderer={(props) =>
                    toggleRenderer({
                      ...props,
                      disabled,
                      index,
                      onChange,
                      selected,
                      selectedValue,
                    })
                  }
                  valueKey="key"
                />
              </div>

              <div>
                {index === 0 && hasValue && (
                  <button
                    className={`flex items-center justify-center hover:bg-gray-100 radius-3 text-size-12 h-28 w-28 ml-8 border`}
                    onClick={() => onChange([...selected, { value: '' }])}
                  >
                    <Image src={`/assets/images/icon/icon-Plus.svg`} width="10" />
                  </button>
                )}
                {index > 0 && (
                  <button
                    className={`flex items-center justify-center hover:bg-gray-100 radius-3 text-size-12 h-28 w-28 ml-8 border`}
                    onClick={() =>
                      onChange(
                        selected.filter(
                          (_v: IOptionValue, itemIndex: number) => itemIndex !== index
                        )
                      )
                    }
                  >
                    <Image src={`/assets/images/icon/icon-Bin.svg`} width="10" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
