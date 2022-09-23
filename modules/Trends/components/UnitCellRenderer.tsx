const UnitCellRenderer = ({ value, unit }: { value: string; unit: string }) => {
  return (
    <div className="flex items-baseline">
      <div className="mr-4">{value}</div>
      <div className="text-tas-400 text-size-12">{unit}</div>
    </div>
  );
};

export default UnitCellRenderer;
