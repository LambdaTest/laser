import ReactTooltip from 'react-tooltip';

import InsightsPlaceholder from '../InsightsPlaceholder';
import NoDataPlaceholder from '../NoDataPlaceholder';

export interface IHeaderRendererProps {
  value: any;
}

export interface ICellRendererProps {
  rowData: any;
  value: any;
}

export interface IColumnConfig {
  cellRenderer?: React.FC<ICellRendererProps>;
  cellTooltipFormatter?: Function;
  cellValueFormatter?: Function;
  className?: string;
  header: string;
  headerRenderer?: React.FC<IHeaderRendererProps>;
  headerTooltip?: string;
  key: string;
  width?: string;
}

export interface IGridProps {
  columnConfig: IColumnConfig[];
  data: any[];
  headerCellClassName?: string;
  headerClassName?: string;
  isLoading?: boolean;
  loadingRowCount?: number;
  noDataText?: string;
  placeholderVariant?: PlaceholderVariant;
  rowCellClassName?: string;
  rowClassName?: string;
  showHeaderWhenNoData?: boolean;
}

enum PlaceholderVariant {
  COMPACT = 'COMPACT',
  EXPANDED = 'EXPANDED',
}

const Grid = ({
  columnConfig,
  data,
  headerCellClassName,
  headerClassName,
  isLoading = false,
  loadingRowCount = 4,
  noDataText,
  placeholderVariant,
  rowCellClassName,
  rowClassName,
  showHeaderWhenNoData = false,
}: IGridProps) => {
  let gridBodyElement = null;
  const showHeader = isLoading || showHeaderWhenNoData || data.length > 0;

  if (isLoading) {
    gridBodyElement = [...Array(loadingRowCount).keys()].map((row) => (
      <div key={row} className="flex border-b border-gray-125">
        {columnConfig.map(({ key, width }) => {
          const size =
            placeholderVariant === PlaceholderVariant.COMPACT
              ? InsightsPlaceholder.SizeVariant.TINY
              : InsightsPlaceholder.SizeVariant.EXTRA_SMALL;

          return (
            <div
              className={`text-ellipsis text-size-14 py-10 px-15 text-left`}
              key={key}
              style={{
                flex: width ? `0 0 ${width}` : '1',
              }}
            >
              <InsightsPlaceholder size={size} />
            </div>
          );
        })}
      </div>
    ));
  } else if (!data.length) {
    gridBodyElement = <NoDataPlaceholder message={noDataText} />;
  } else {
    gridBodyElement = data.map((rowData, rowIndex) => (
      <div
        key={rowData.key || rowData.id || rowIndex}
        className={`flex border-b border-gray-125 ${rowClassName || ''}`}
      >
        <ReactTooltip clickable globalEventOff="click" />
        {columnConfig.map(
          ({ cellRenderer, cellTooltipFormatter, cellValueFormatter, key, width, className }) => {
            const cellValue = cellValueFormatter
              ? cellValueFormatter(rowData[key], rowData)
              : rowData[key];
            const tooltipValue =
              cellTooltipFormatter && cellTooltipFormatter(rowData[key], rowData);

            return (
              <div
                className={`text-ellipsis text-size-14 py-10 px-15 text-left ${
                  rowCellClassName || ''
                } ${className || ''}`}
                key={key}
                style={{
                  flex: width ? `0 0 ${width}` : '1',
                }}
                {...(tooltipValue ? { 'data-tip': tooltipValue } : {})}
              >
                {cellRenderer ? cellRenderer({ value: cellValue, rowData }) : cellValue}
              </div>
            );
          }
        )}
      </div>
    ));
  }

  const getHeader = (headerRenderer: any, header: any, width: any) => {
    if (!isLoading) {
      return headerRenderer ? headerRenderer({ value: header }) : header;
    } else {
      return (
        <div className="flex  border-gray-125">
          <div
            className={``}
            style={{
              flex: width ? `0 0 ${width}` : '0 0 80%',
            }}
          >
            <InsightsPlaceholder size={InsightsPlaceholder.SizeVariant.NANO} />
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <div>
        <div className={`flex border-b border-gray-125 ${headerClassName || ''}`}>
          {showHeader &&
            columnConfig.map(({ header, headerRenderer, headerTooltip, key, width }) => (
              <div
                className={`text-ellipsis text-size-12 font-bold text-tas-400 text-left py-10 px-15 ${
                  headerCellClassName || ''
                }`}
                data-tip={headerTooltip}
                key={key}
                style={{
                  flex: width ? `0 0 ${width}` : '1',
                }}
              >
                {getHeader(headerRenderer, header, width)}
              </div>
            ))}
        </div>
      </div>
      <div>{gridBodyElement}</div>
    </div>
  );
};

Grid.PlaceholderVariant = PlaceholderVariant;
export default Grid;
