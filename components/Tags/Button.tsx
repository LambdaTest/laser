import React from 'react'
import ButtonProp from '../../interfaces/Button';
export default function Button({children}: ButtonProp) {
    return (
        <button className="border border-gray-400 text-gray-700 py-7 px-15 rounded bg-white text-size-14 transition hover:bg-black hover:text-white hover:border-black">{children}</button>
    )
}
