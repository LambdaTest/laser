const VariantToColorMap = {
  active: '#FFC86B',
  inactive: '#BEC5CD',
};

const IconQuarantineTest = ({
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
  const { execution_details: executionDetails, execution_meta: executionMeta } = data;
  const { status } = executionDetails;
  const { tests_quarantined: count } = executionMeta;

  if (count === 0) {
    return null;
  }

  const variant = status === 'quarantined' ? 'active' : 'inactive';

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
        <rect
          x="3.125"
          y="6.625"
          width="9.75"
          height="7.75"
          rx="1.375"
          stroke={VariantToColorMap[variant]}
          strokeWidth="1.25"
        />
        <path
          d="M11.5 7V4.5C11.5 2.567 9.933 1 8 1V1C6.067 1 4.5 2.567 4.5 4.5V7"
          stroke={VariantToColorMap[variant]}
          strokeWidth="1.25"
        />
        <line
          x1="7.75"
          y1="9.75"
          x2="7.75"
          y2="11.25"
          stroke={VariantToColorMap[variant]}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default IconQuarantineTest;
