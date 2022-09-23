
import React from 'react';
import CardProp from '../../interfaces/Card';

export default function Card({className, children, ...rest}: CardProp) {
    return (
        <div className={`inline-flex flex-col items-center pt-85 pb-80 pl-40 pr-40 card__shadow bg-white ${className ? className : ""}`} {...rest}>
            {children}
        </div>
    )
}
