type ColorVariant = 'active' | 'inactive';

const VariantToColorMap = {
  active: '#FFFFFF',
  inactive: '#CCCCCC',
};

const IconSettings = ({
  className = '',
  height = 18,
  variant = 'active',
  width = 18,
}: {
  className?: string;
  height?: number;
  variant?: ColorVariant;
  width?: number;
}) => {
  return (
    <svg
      className={className}
      height={height}
      version="1.1"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <title>Gear</title>
      <g
        fill="none"
        fillRule="evenodd"
        id="New-Sidebar-Design"
        stroke="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      >
        <g
          id="Sidebar-5.2"
          stroke={VariantToColorMap[variant]}
          strokeWidth="2"
          transform="translate(-38.000000, -212.000000)"
        >
          <g id="Gear" transform="translate(39.000000, 213.000000)">
            <polygon id="Path" points="4.8 0 13.2 0 18 8 13.2 16 4.8 16 0 8"></polygon>
            <circle id="Oval" cx="9" cy="8" r="3"></circle>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default IconSettings;
