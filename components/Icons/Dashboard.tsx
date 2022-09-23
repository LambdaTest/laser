type ColorVariant = 'active' | 'inactive';

const VariantToColorMap = {
  active: '#FFFFFF',
  inactive: '#CCCCCC',
};

const IconDashboard = ({
  className = '',
  variant = 'active',
  height = 18,
  width = 18,
}: {
  className?: string;
  height?: number;
  variant?: ColorVariant;
  width?: number;
}) => {
  return (
    <svg
      height={height}
      version="1.1"
      viewBox="0 0 18 18"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
    >
      <title>Boxed</title>
      <g id="New-Sidebar-Design" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g
          id="Sidebar-5.2"
          strokeWidth="2"
          stroke={VariantToColorMap[variant]}
          transform="translate(-39.000000, -136.000000)"
        >
          <g id="Boxed" transform="translate(39.000000, 136.000000)">
            <rect id="Rectangle" x="1" y="1" width="16" height="16" rx="4"></rect>
            <line
              id="Line-2"
              strokeLinecap="round"
              strokeLinejoin="round"
              x1="1.5"
              x2="16.5"
              y1="6.5"
              y2="6.5"
            ></line>
            <line
              id="Line-2"
              strokeLinecap="round"
              strokeLinejoin="round"
              x1="7"
              x2="7"
              y1="17"
              y2="7"
            ></line>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default IconDashboard;
