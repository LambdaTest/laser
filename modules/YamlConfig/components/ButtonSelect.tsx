export default function ButtonSelect({ options, selected, onChange }: any) {
  return (
    <div className="w-full pt-16 flex text-size-12">
      {options.map((option: { key: string; label: string }) => (
        <div
          className={`border width-100 px-8 h-28 font-bold tracking-wider radius-3 transition inline-flex items-center text-center justify-center overflow-hidden mr-8 cursor-pointer ${
            selected.value === option.key ? ' border-purple bg-purple-350 ' : 'bg-gray-60'
          }`}
          key={option.key}
          onClick={() => onChange({ value: option.key })}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
}
