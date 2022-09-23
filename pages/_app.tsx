import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux'
import { useStore } from '../redux/store'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import 'react-virtualized/styles.css';
import "react-toastify/dist/ReactToastify.css";
import "../styles/font/font.css"
import '../styles/index.css';
import '../styles/main.css';
import dynamic from "next/dynamic";
import amplitude from 'amplitude-js';

import { toast } from "react-toastify";
import { getCookie, getCookieOrgName, parseJwt } from 'helpers/genericHelpers';
toast.configure({
  position: toast.POSITION.TOP_RIGHT,
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  const store = useStore(pageProps.initialReduxState)
  const persistor = persistStore(store, {}, function () {
    persistor.persist()
  })
  const amplitudeSelfLogger = (window_click_event:any) => {
    let amplitude_el = window_click_event.target.closest('[data-amplitude]');
    if(amplitude_el && amplitude_el.dataset && amplitude_el.dataset.amplitude) {
      if(amplitude) {
        amplitude.getInstance().logEvent(amplitude_el.dataset.amplitude);
      }
    }
  }
  useEffect(() => {
    if(window) {
      window.addEventListener('click', function (event:any) {
        if (!event.target.matches(".lt-dropdown-toggle")) {
          let ltdropdowns = document.getElementsByClassName("lt-dropdown");
          for (var i = 0; i < ltdropdowns.length; i++) {
            let openSharedown = ltdropdowns[i];
            if (openSharedown.classList.contains("open")) {
              openSharedown.classList.remove("open");
            }
          }
        }
        amplitudeSelfLogger(event);
      });
    }
    if(amplitude) {
      window.amplitude = amplitude;
      amplitude.getInstance().init(`${process.env.NEXT_PUBLIC_AMPLITUDE_KEY}`);
      try {
        let jwt_data = parseJwt(getCookie(`${process.env.NEXT_PUBLIC_AUTH_COOKIE}`))
        amplitude.getInstance().setUserId(jwt_data.user_id);
        let userProperties = {
          user_name: jwt_data.username,
          git_provider: jwt_data.git_provider,
          org: getCookieOrgName()
        };
        amplitude.getInstance().setUserProperties(userProperties);
      } catch (err) {
        console.log("err",err)
      }
    }
  }, [])
  return (
    <Provider store={store}>
      <PersistGate loading={<div>loading</div>} persistor={persistor}>
        {/* <Component {...pageProps} /> */}
        <div suppressHydrationWarning>
          {typeof window === 'undefined' ? null : <Component {...pageProps} />}
        </div>
      </PersistGate>
    </Provider>
  )
}

// export default MyApp

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});