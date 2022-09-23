
import React from 'react';
import RowProp from '../../interfaces/Row';

export default function Row({gutter, className, children, ...rest}: RowProp) {
    return (
        <div className={`flex -mx-${gutter ? gutter: 15} ${className ? className : ""}`} {...rest}>
            {children}
        </div>
    )
}
