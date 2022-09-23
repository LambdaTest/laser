import React from 'react';

import TextProp from '../../interfaces/Text';

const Text = React.forwardRef(({ size, className, children, ...rest }: TextProp, ref) => {
  switch (size) {
    case 'h1':
      return (
        // @ts-ignore
        <h1 ref={ref} className={`${className ? className : ''}`} {...rest}>
          {children}
        </h1>
      );
    case 'h2':
      return (
        // @ts-ignore
        <h2 ref={ref} className={`${className ? className : ''}`} {...rest}>
          {children}
        </h2>
      );
    case 'h3':
      return (
        // @ts-ignore
        <h3 ref={ref} className={`${className ? className : ''}`} {...rest}>
          {children}
        </h3>
      );
    case 'h4':
      return (
        // @ts-ignore
        <h4 ref={ref} className={`${className ? className : ''}`} {...rest}>
          {children}
        </h4>
      );
    case 'h5':
      return (
        // @ts-ignore
        <h5 ref={ref} className={`${className ? className : ''}`} {...rest}>
          {children}
        </h5>
      );
    case 'h6':
      return (
        // @ts-ignore
        <h6 ref={ref} className={`${className ? className : ''}`} {...rest}>
          {children}
        </h6>
      );
    case 'span':
      return (
        // @ts-ignore
        <span ref={ref} className={`${className ? className : ''}`} {...rest}>
          {children}
        </span>
      );
    case 'p':
      return (
        // @ts-ignore
        <p ref={ref} className={`${className ? className : ''}`} {...rest}>
          {children}
        </p>
      );
    default:
      return (
        // @ts-ignore
        <div ref={ref} className={`${className ? className : ''}`} {...rest}>
          {children}
        </div>
      );
  }
});

export default Text;
