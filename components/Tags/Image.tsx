
import React from 'react';
import ImageProp from '../../interfaces/Image';

export default function Image({src, alt, className, ...rest}: ImageProp) {
    return (
        <img loading="lazy" src={src} className={className ? className : ''} alt={alt ? alt : "..."} {...rest} />
    )
}
