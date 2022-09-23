import Select from 'react-dropdown-select';

const getPostmergeGridConfig = ({
  activeStrategy,
  gridRef,
  isValidStrategy,
  onApplyEdit,
  onCancelEdit,
  onChange,
  onDelete,
  onShowEdit,
  strategies,
}: any) => [
  {
    header: 'Branch Name',
    key: 'branch',
    width: '30%',
    cellRenderer: ({ value, rowData }: any) => {
      if (rowData.loading) {
        return (
          <div className="h-full w-full">
            <div className="placeholder-content"></div>
          </div>
        );
      }
      return value === '*' ? 'All Branches' : value;
    },
  },
  {
    header: 'Strategy Name',
    key: 'strategy_name',
    width: '25%',
    cellValueFormatter: (rowStrategy: any) =>
      strategies?.find((strategy: any) => strategy.value === rowStrategy)?.label,
    cellRenderer: ({ value, rowData }: any) => {
      if (rowData.loading) {
        return (
          <div className="h-full w-full">
            <div className="placeholder-content"></div>
          </div>
        );
      }
      if (rowData.id === activeStrategy?.id) {
        return (
          <div className="flex h-full items-center">
            <Select
              backspaceDelete={false}
              className="tas__select__dropdown h-24 py-7 px-15 rounded bg-white text-size-14 w-150 inline-flex"
              dropdownPosition="auto"
              onChange={(value) => onChange('strategy_name', value[0])}
              options={strategies}
              portal={gridRef.current}
              searchable={false}
              values={[activeStrategy.strategy_name]}
            />
          </div>
        );
      }
      return value;
    },
  },
  {
    header: 'Parameters',
    key: 'threshold',
    width: '20%',
    cellValueFormatter: (_value: any, rowData: any) => ({ threshold: rowData.threshold }),
    cellRenderer: ({ value, rowData }: any) => {
      if (rowData.loading) {
        return (
          <div className="h-full w-full">
            <div className="placeholder-content"></div>
          </div>
        );
      }
      if (rowData.id === activeStrategy?.id) {
        return (
          <div className="flex h-full items-center">
            <div className="text-tas-400 mr-10">Threshold: </div>
            <div className="text-ellipsis">
              <input
                className="border border-gray-200 px-10 py-5 text-size-14 h-24 block rounded w-full"
                min="0"
                onChange={(e) => onChange('threshold', e.target.value)}
                type="number"
                value={activeStrategy.threshold}
              />
            </div>
          </div>
        );
      }
      return (
        <div className="flex">
          <div className="text-tas-400 mr-10">Threshold: </div>
          <div className="text-ellipsis">{value?.threshold || '-'}</div>
        </div>
      );
    },
  },
  {
    header: '',
    key: 'actions',
    width: '25%',
    cellRenderer: ({ rowData }: any) => {
      if (rowData.loading) {
        return (
          <div className="h-full w-full">
            <div className="placeholder-content"></div>
          </div>
        );
      }
      if (rowData.id === activeStrategy?.id) {
        return (
          <div className="inline-flex h-full justify-end w-full items-center">
            <button
              className="border px-10 h-24 p-4 rounded text-size-12 transition text-black border-black tracking-widest inline-flex items-center mr-10"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
            <button
              className={`border px-10 h-24 p-4 rounded text-size-12 transition bg-black text-white border-black tracking-widest inline-flex items-center ${
                !isValidStrategy ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={onApplyEdit}
              disabled={!isValidStrategy}
            >
              Apply
            </button>
          </div>
        );
      }
      return (
        <div className="inline-flex h-full justify-end w-full items-center">
          <span
            className="cursor-pointer mr-10 inline-flex justify-center w-20"
            onClick={() => onShowEdit(rowData)}
          >
            <img src="/assets/images/icon/edit-icon.svg" alt="Edit" />
          </span>
          <span
            className="cursor-pointer inline-flex justify-center w-20"
            onClick={() => onDelete(rowData)}
          >
            <img src="/assets/images/bin.svg" alt="Delete" />
          </span>
        </div>
      );
    },
  },
];

export default getPostmergeGridConfig;
