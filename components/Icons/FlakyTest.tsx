const VariantToColorMap = {
  active: '#FFC86B',
  inactive: '#BEC5CD',
};

const IconFlakyTest = ({
  className = '',
  height = 20,
  width = 20,
  data,
}: {
  className?: string;
  height?: number;
  width?: number;
  data: { flaky_execution_meta: any; execution_details: any; execution_meta: any };
}) => {
  const { flaky_execution_meta: meta } = data;
  const { flaky_tests: count, last_flake_status: status } = meta;

  if (count === 0) {
    return null;
  }

  const variant = status === 'flaky' ? 'active' : 'inactive';

  return (
    <div
      className={`inline-flex items-center justify-center rounded ${className}`}
      style={{ height, width }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.58203 14.1524L7.98611 12.7483L9.3902 14.1524M6.58203 1.8667L7.98611 3.27078L9.3902 1.8667M7.98611 3.3366V12.6825"
          stroke={VariantToColorMap[variant]}
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M12.374 12.5327L11.9611 10.5904L13.9034 10.1775M2.07031 5.84137L4.01259 5.42852L3.59975 3.48624M4.06779 5.46437L11.9059 10.5545"
          stroke={VariantToColorMap[variant]}
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M2.07133 10.1776L4.01361 10.5904L3.60076 12.5327M12.375 3.48627L11.9622 5.42855L13.9044 5.84139M11.907 5.46439L4.06881 10.5545"
          stroke={VariantToColorMap[variant]}
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <circle
          cx="7.98857"
          cy="8.00957"
          r="1.71123"
          fill="white"
          stroke={VariantToColorMap[variant]}
          strokeWidth="1.25"
        />
      </svg>
    </div>
  );
};

export default IconFlakyTest;
