import React from 'react';
import InputProp from '../../interfaces/Input';

export default function Input({type,className, search, placeholder, ...rest}: InputProp) {
    return (
        <div className="relative">
            <input className={`border px-10 py-10 text-size-14 h-32 block ${search ? "search__icon" : ''} rounded w-full ${className ? className : ""}`} type={type ? type : 'text'} placeholder={placeholder ? placeholder : ''} {...rest} />
        </div>
    )
}