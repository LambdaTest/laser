import Image from 'components/Tags/Image';

export default function MultiTextField({ selected, onChange, disabled }: any) {
  return (
    <div className="w-full pt-16">
      {selected.length > 0 &&
        selected.map((selectedValue: { value: any }, index: number) => {
          return (
            <div
              key={`${selectedValue}_${index}`}
              className={`flex items-center ${index + 1 !== selected.length ? 'pb-8' : ''}`}
            >
              <div className="width-200">
                <input
                  className={`tas-custom-focus border border-gray-200 px-10 py-10 text-size-14 h-32 block rounded w-full ${
                    disabled ? 'opacity-50 bg-white cursor-not-allowed' : ''
                  } ${selectedValue.value ? 'border-purple' : ''}`}
                  onChange={(e) =>
                    onChange(
                      selected.map((el: any, elIndex: number) =>
                        elIndex === index ? { value: e.target.value } : el
                      )
                    )
                  }
                  value={selectedValue.value}
                  disabled={disabled}
                  placeholder="Enter pattern..."
                />
              </div>
              <div>
                {index === 0 && selectedValue.value && (
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
                      onChange(selected.filter((_v: any, itemIndex: number) => itemIndex !== index))
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
