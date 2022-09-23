import Dropdown from 'components/Dropdown';

export default function SelectField({ disabled, mountRef, onChange, options, selected }: any) {
  return (
    <div className="w-full pt-16 flex">
      <div className="width-200">
        <Dropdown
          disabled={disabled}
          getPopupContainer={() => mountRef.current}
          onClick={(value) => onChange({ value: value, customValue: '' })}
          options={options}
          selectedOption={selected.value}
          toggleLabel="Select"
          toggleStyles={{
            background: '#fff',
            fontSize: 14,
            height: '32px',
            minWidth: '100%',
            border: selected.value ? '1px solid rgb(169, 165, 255)' : '',
          }}
          valueKey="key"
        />
      </div>
      {selected.value === 'custom' && (
        <div className="width-200 ml-8">
          <input
            className={`border border-gray-200 px-10 py-10 text-size-14 h-32 block rounded w-full ${
              selected.customValue ? 'border-purple' : ''
            }`}
            onChange={(e) => onChange({ value: 'custom', customValue: e.target.value })}
            value={selected.customValue}
          />
        </div>
      )}
    </div>
  );
}
