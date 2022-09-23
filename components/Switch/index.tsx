import { ChangeEventHandler } from 'react';

export default function Switch({
  id = '',
  label,
  labelClass = '',
  onChange,
  value,
  wrapperClass = '',
  ...rest
}: {
  id: string;
  label?: string;
  labelClass?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: boolean;
  wrapperClass?: string;
  [_: string]: any;
}) {
  return (
    <div className={`flex items-center ${wrapperClass}`}>
      <label className="switch cursor-pointer">
        <input checked={!!value} id={id} onChange={onChange} type="checkbox" {...rest} />
        <span className="slider round"></span>
      </label>
      {!!label && (
        <label className={`block text-ellipsis ml-4 cursor-pointer ${labelClass}`} htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
}
