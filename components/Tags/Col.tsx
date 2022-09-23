
import React from 'react';
import ColProp from '../../interfaces/Col';

export default function Col({gutter, size, className, children, ...rest}: ColProp) {
    return (
        <div className={`w-${size}/12 px-${gutter ? gutter: 15} ${className ? className : ""}`} {...rest}>
            {children}
        </div>
    )
}
