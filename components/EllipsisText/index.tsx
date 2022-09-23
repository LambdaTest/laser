import React, { useState } from 'react';

interface EllipsisTextProps {
  copy?: boolean;
  dots?: boolean;
  length?: number | string;
  suffixElement?: React.ReactNode;
  text: string;
}

export default function EllipsisText({
  copy,
  dots,
  length = 5,
  suffixElement = '',
  text,
}: EllipsisTextProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const copyText = (event: any, data: any) => {
    event.stopPropagation();
    event.preventDefault();
    let input = document.createElement('input');
    input.setAttribute('value', data);
    document.body.appendChild(input);
    input.select();
    let result = document.execCommand('copy');
    document.body.removeChild(input);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
    return result;
  };
  const handleShowCopy = (mouseleave: any) => {
    if (copy) {
      if (mouseleave) {
        setShowCopy(false);
      } else {
        setShowCopy(true);
      }
    }
  };
  return (
    <>
      {text && (
        <span
          className={`relative inline-flex ${showCopy ? 'ellipsis_text_showcopy' : ''}`}
          onMouseOver={() => handleShowCopy(false)}
          onMouseLeave={() => handleShowCopy(true)}
        >
          <span>
            {text && text.substring(0, Number(length))}
            {dots && text.length > length ? '...' : ''}
          </span>
          {suffixElement}
          <span className="ellipsis_text_icon_parent flex-shrink-0 w-14">
            <span className="ellipsis_text_icon cursor-pointer" onClick={(e) => copyText(e, text)}>
              <img
                src={`/assets/images/icon/${isCopied ? 'green-check' : 'copy-paste'}.svg`}
                className=" h-11 w-11"
              />
            </span>
          </span>
        </span>
      )}
    </>
  );
}
