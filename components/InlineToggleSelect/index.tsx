export interface IOption {
  key: any;
  label: string;
}

export interface IProps {
  className?: string;
  itemClassName?: string;
  label: string;
  options: IOption[];
  selected: IOption['key'];
  onChange: (key: IOption['key'], option: IOption) => void;
}

const InlineToggleSelect = ({ options, label, selected, onChange, className, itemClassName }: IProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="text-size-14 mr-4">{label}</div>
      <div className="border border-gray-125 flex p-2 bg-gray-150 text-size-12 rounded-md ml-4">
        {options.map((el) => (
          <div
            className={`cursor-pointer px-5 py-3 rounded mmw30 text-center ${
              selected === el.key ? ' bg-white lt-disabled' : ''
            } ${itemClassName}`}
            key={el.key}
            onClick={() => onChange(el.key, el)}
          >
            {el.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InlineToggleSelect;
