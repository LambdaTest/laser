import React, { useState } from 'react'

export default function SynapseToken({token}:any) {
  const [eyeView, setEyeView] = useState(false);
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
    if (mouseleave) {
        setShowCopy(false);
      } else {
        setShowCopy(true);
      }
  };
  const toggleEye = () => {
    setEyeView(!eyeView);
  }
  const protectedText = () => {
    if(token) {
       let start5chars = token.substring(0, 5);
       let end3chars = token.substring(token.length-3);
       return `${start5chars}****************************${end3chars}`
    }
  }
  return (
    <div className="flex items-center"  onMouseOver={() => handleShowCopy(false)}
          onMouseLeave={() => handleShowCopy(true)}>
      <div >
        <span className="inline-block mr-5">
          {
            !eyeView ? protectedText() :
        token
        }</span>
        <span className={`ellipsis_text_icon  mr-5 inline-block ${showCopy ? 'cursor-pointer' : 'pointer-events-none opacity-0'}`} onClick={(e) => copyText(e, token)}>
            <img
              src={`/assets/images/icon/${isCopied ? 'green-check' : 'copy-paste'}.svg`}
              className=" h-11 w-11"
            />
          </span>
        </div>
      <img src={"/assets/images/icon/visibility.png"} alt="Show" width="18" className="opacity-70 cursor-pointer" onClick={toggleEye} />
    </div>
  )
}
