import { getCookie, writeCookie } from 'helpers/genericHelpers';
import React, { useEffect, useState } from 'react'

export default function AcceptCookie() {
  const [shouldCookieShow, setShouldCookieShow] = useState(true);
    const hideCookie = () => {
        setShouldCookieShow(false);
    }
    const acceptCookie = () => {
        setShouldCookieShow(false);
        writeCookie("tas_allow_cookie_accepted", true)
    }
    useEffect(() => {
        if(getCookie("tas_allow_cookie_accepted")) {
            setShouldCookieShow(false);
        }
    }, [shouldCookieShow])
  return (
    <div className={`cookies__bar ${shouldCookieShow ? '' : 'hidden'}`}>
      <div className='flex justify-between absolute w-full left-0 top-0 items-end -mt-25'>
        <span className='flex-1 text-center'>
          <img
            src={`/assets/images/cookie.svg`}
            alt="Cookie"
             className='mx-auto'
          />
        </span>
          <span className='pr-15 inline-block'>
            <img
               onClick={hideCookie}
                src={`/assets/images/icon/cross.svg`}
                alt="Cross"
                className='cursor-pointer'
              />
          </span>
      </div>
      <div className="flex justify-between items-center mt-15">
        <p className="font-medium text-size-12">We use cookies to give you the best experience. Cookies help to provide a more personalized experience and relevant advertising for you, and web analytics for us. Learn More in our <a target='_blank' className="underline" href="https://www.lambdatest.com/legal/cookie">Cookies policy</a>, <a className="underline" target='_blank' href="https://www.lambdatest.com/legal/privacy">Privacy</a> &amp; <a className="underline" href="https://www.lambdatest.com/legal/terms-of-service" target='_blank'>Terms of service</a></p>
        <span onClick={acceptCookie} className='rounded cursor-pointer bg-black text-white text-size-12 py-10 px-15 w-150 text-center ml-50'>
         Allow Cookie
       </span>
      </div>
    </div>
  )
}
