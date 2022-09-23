const getFTMGridConfig = ({ configTypes, onDelete, onShowEdit, strategies }: any) => [
  {
    header: 'Branch Name',
    key: 'branch',
    width: '20%',
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
    header: 'Configuration Name',
    key: 'algo_name',
    width: '13%',
    cellValueFormatter: (algoName: any) =>
      strategies?.find((strategy: any) => strategy.value === algoName)?.label,
    cellRenderer: ({ value, rowData }: any) => {
      if (rowData.loading) {
        return (
          <div className="h-full w-full">
            <div className="placeholder-content"></div>
          </div>
        );
      }
      return value;
    },
  },
  {
    header: 'Configuration Type',
    key: 'config_type',
    width: '13%',
    cellValueFormatter: (configType: any) =>
      configTypes?.find((config: any) => config.value === configType)?.label,
    cellRenderer: ({ value, rowData }: any) => {
      if (rowData.loading) {
        return (
          <div className="h-full w-full">
            <div className="placeholder-content"></div>
          </div>
        );
      }
      return value;
    },
  },
  {
    header: 'Consecutive Runs',
    key: 'consecutive_runs',
    width: '12%',
    cellRenderer: ({ value, rowData }: any) => {
      if (rowData.loading) {
        return (
          <div className="h-full w-full">
            <div className="placeholder-content"></div>
          </div>
        );
      }
      return (
        <div className="flex">
          <div className="text-ellipsis">{value || '-'}</div>
        </div>
      );
    },
  },
  {
    header: 'Transitions Threshold',
    key: 'threshold',
    width: '14%',
    cellRenderer: ({ value, rowData }: any) => {
      if (rowData.loading) {
        return (
          <div className="h-full w-full">
            <div className="placeholder-content"></div>
          </div>
        );
      }
      return (
        <div className="flex">
          <div className="text-ellipsis">{value || '-'}</div>
        </div>
      );
    },
  },
  {
    header: 'Auto Quarantine',
    key: 'auto_quarantine',
    width: '11%',
    cellRenderer: ({ value, rowData }: any) => {
      if (rowData.loading) {
        return (
          <div className="h-full w-full">
            <div className="placeholder-content"></div>
          </div>
        );
      }
      return (
        <div className="flex">
          <div className="text-ellipsis">{value ? 'Enabled' : 'Disabled'}</div>
        </div>
      );
    },
  },
  {
    header: 'Shuffle',
    key: 'shuffle',
    width: '8%',
    cellRenderer: ({ value, rowData }: any) => {
      if (rowData.loading) {
        return (
          <div className="h-full w-full">
            <div className="placeholder-content"></div>
          </div>
        );
      }
      return (
        <div className="flex">
          <div className="text-ellipsis">{value ? 'Enabled' : 'Disabled'}</div>
        </div>
      );
    },
  },
  {
    header: '',
    key: 'actions',
    width: '9%',
    cellRenderer: ({ rowData }: any) => {
      if (rowData.loading) {
        return (
          <div className="h-full w-full">
            <div className="placeholder-content"></div>
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

export default getFTMGridConfig;
