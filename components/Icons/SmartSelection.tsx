type ColorVariant = 'active' | 'inactive';

const VariantToColorMap = {
  active: '#7B74F5',
  inactive: '#BDBCC9',
};

const VariantToBgColorMap = {
  active: '#E5E3FD',
  inactive: '#F6F6F6',
};

const IconSmartSelection = ({
  className = '',
  height = 20,
  variant = 'active',
  width = 20,
}: {
  className?: string;
  height?: number;
  variant?: ColorVariant;
  width?: number;
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded ${className}`}
      style={{ background: VariantToBgColorMap[variant], height, width }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="M10.4143 7.66277C10.4143 8.20722 10.1226 8.71279 9.65111 8.98988L6.76361 10.6572C6.29208 10.9295 5.70875 10.9295 5.23236 10.6572L2.34486 8.98988C1.87334 8.71765 1.58167 8.21208 1.58167 7.66277V4.33779C1.58167 3.79334 1.87334 3.28777 2.34486 3.01068L5.23236 1.34333C5.70389 1.0711 6.28722 1.0711 6.76361 1.34333L9.65111 3.01068C10.1226 3.28777 10.4143 3.78848 10.4143 4.33779V7.66277Z"
          fill={VariantToColorMap[variant]}
          stroke={VariantToColorMap[variant]}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="M4.05566 6.3654L5.11627 7.45915L7.94455 4.54248"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default IconSmartSelection;
