import ReloadPage from 'components/ReloadPage';
import Tooltip from '../Tooltip';

interface SummaryItem {
  content?: any;
  label?: string;
  loading?: boolean;
  styles?: any;
  tooltip?: string;
  type?: string;
}

const SummarySection = ({
  className = '',
  footer,
  gridStyle = {},
  list = [],
  style = {},
}: {
  className?: string;
  footer?: any;
  gridStyle?: any;
  list: SummaryItem[];
  style?: any;
}) => {
  return (
    <div
      className={`bg-white w-full p-16 ${footer ? 'pb-0 flex-wrap' : ''} flex items-start ${className}`}
      style={style}
    >
      <div
        className="flex-1 grid items-stretch"
        style={{
          // gridTemplateColumns: 'repeat(auto-fill, minmax(100px, max-content))',
          // gridTemplateColumns: 'repeat(auto-fit, minmax(100px, max-content))',
          // gridTemplateColumns: 'repeat(auto-fit, minmax(max-content, auto))',
          gap: '10px 40px',
          gridAutoRows: 'minmax(44px, auto)',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, auto))',
          ...gridStyle,
        }}
      >
        {list.map((item, index) => {
          if (item.type === 'separator') {
            return (
              <div
                className="flex flex-col flex-1 flex-shrink-0"
                key={index}
                style={item.styles || {}}
              ></div>
            );
          }
          if (!item.content && !item.loading) {
            return null;
          }

          let content = item.loading ? (
            <div className="w-full card__data__loader">
              <div className="placeholder-content"></div>
            </div>
          ) : (
            item.content
          );

          if (item.tooltip) {
            content = (
              <Tooltip placement="bottom-start" content={item.tooltip} interactive>
                {content}
              </Tooltip>
            );
          }
          return (
            <div
              className={`flex flex-col flex-1 flex-shrink-0`}
              key={index}
              style={item.styles || {}}
            >
              {item.label && (
                <div className="text-size-12 text-tas-400 whitespace-no-wrap">{item.label}</div>
              )}
              <div className="flex items-center flex-1">{content}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-12">
        <ReloadPage />
      </div>
      {footer && <div className="w-full">{footer}</div>}
    </div>
  );
};

export default SummarySection;
