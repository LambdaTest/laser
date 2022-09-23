import React from 'react'
import { DebounceInput as Input } from 'react-debounce-input'

export default function DebounceInput({onChange, value, className, search, amplitude}:any) {
  return (
    <div className="relative">
      <Input
        data-amplitude={amplitude}
        debounceTimeout={500}
        onChange={onChange} value={value} placeholder="Search" className={`border px-10 py-10 text-size-14 h-32 block ${search ? "search__icon" : ''} rounded w-full ${className ? className : ""}`}/>
    </div>
  )
}
