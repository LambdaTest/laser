enum Color {
  /**
   * #1F1F1F
   */
  PRIMARY = 'text-tas-500',
  /**
   * #707070
   */
  SECONDARY = 'text-tas-400',
  /**
   * WHITE
   */
  WHITE = 'text-white',
}

const Txt = ({ className = '', color = Color.PRIMARY, icon, size, text }: any) => {
  let customClass = `${color} text-size-${size}`;

  return (
    <span className={`flex items-center ${customClass} ${className}`}>
      {icon && (
        <span className="flex items-center justify-start w-20 mr-4">
          <img alt={text} src={icon} />
        </span>
      )}
      <span>{text}</span>
    </span>
  );
};

Txt.Color = Color;

export default Txt;
