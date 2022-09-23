import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';

import { getAuthToken, getCookieGitProvider, getCookieOrgName } from '../helpers/genericHelpers';
import Image from './Tags/Image';
import AcceptCookie from './AcceptCookie';

type Props = {
  title?: string;
  wrapper_classes?: string;
  is_login_page?: boolean;
  homepage?: boolean;
  hide_header?: boolean;
  hide_footer?: boolean;
};

const OPEN_SOURCE_URL = '/open-source';

const WebLayout: React.FunctionComponent<Props> = ({
  children,
  title,
  wrapper_classes,
  is_login_page,
  homepage = false,
  hide_header = false,
  hide_footer = false,
}) => {
  const state = useSelector((state) => state);
  const { persistData }: any = state;
  const { currentOrg }: any = persistData;

  const [toggle, setToggle] = useState(false);
  const handleToggle = () => {
    setToggle(!toggle);
  };
  let header = useRef<any>(null);
  useEffect(() => {
    if (window) {
      window.scrollTo(0, 0);
    }
    window.onscroll = () => {
      try {
        let lastScrollTop = 0;
        let st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScrollTop) {
          header.current.classList.add('header_fixed');
        } else {
          header.current.classList.remove('header_fixed');
        }
        lastScrollTop = st <= 0 ? 0 : st;
      } catch (err) {
        console.log('ref err');
      }
    };
  }, []);
  const provider = currentOrg?.git_provider || getCookieGitProvider();
  const orgName = currentOrg?.name || getCookieOrgName();

  const [showNotification, setShownotification] = useState(true);
  const hideNotification = () => {
    setShownotification(false);
  };

  return (
    <>
      <Head>
        <title>{title ? title : 'Test At Scale | LambdaTest'}</title>
        <meta
          name="description"
          content="Accelerate your testing, shorten job times and get faster feedback on code changes,
manage flaky tests and keep master green at all times with Test At Scale."
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Karla&display=swap" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script src={`${process.env.NEXT_PUBLIC_TAS_ASSETS}/js/lambda_gtm.js`}></script>
      </Head>
      <div className={`landing_page interFont ${wrapper_classes ? wrapper_classes : ''}`}>
        {showNotification && homepage && (
          <div className="bg-black text-white py-7 text-size-14 px-15 font-normal">
            <div className="flex justify-between">
              <div className="text-center flex-1">
                <div className="inline-flex items-center justify-center">
                  <span>
                    TAS is free for{' '}
                    <a className="underline" href={OPEN_SOURCE_URL} target="_blank">
                      Open Source
                    </a>{' '}
                    and educational projects
                  </span>
                  <Image
                    src="/assets/images/heart.png"
                    width={18}
                    height={18}
                    className={'inline-block ml-5'}
                  />
                </div>
              </div>
              <div>
                <span className="inline-block cursor-pointer" onClick={hideNotification}>
                  <Image src="/assets/images/icon/cross-white.svg" />
                </span>
              </div>
            </div>
          </div>
        )}
        {!hide_header && (
          <header id="header" className="px-40" ref={header}>
            <nav className="mx-auto">
              <div className="px-2">
                <div className="flex -mx-2 items-center w-full  smtablet:flex-col">
                  <div className="w-3/12 px-2 smtablet:w-full">
                    <div className="flex justify-between items-center">
                      <Link href="/">
                        <a>
                          <img
                            src="/assets/images/landing-page/logo.svg"
                            alt="Logo"
                            width="147"
                            height="26"
                            className="logo__img"
                          />
                        </a>
                      </Link>
                      <img
                        src="/assets/images/landing-page/toggle_menu.svg"
                        alt="..."
                        width="24"
                        className="hidden smtablet:block cursor-pointer"
                        onClick={handleToggle}
                      />
                    </div>
                  </div>
                  <div
                    className={`w-9/12 px-2 website_menu  smtablet:w-full ${
                      toggle ? 'website_menu_active' : ''
                    }`}
                  >
                    <div className="text-right  smtablet:text-left">
                      <a
                        target="_blank"
                        href={`${process.env.NEXT_PUBLIC_WEBSITE_HOST}/pricing?type=tas`}
                        className={`fromtablet:block  fromtablet:ml-0 fromtablet:mt-10 nav-link inline-block py-5 text-size-14 font-medium ml-30 `}
                        data-amplitude="tas_landing_pricing"
                      >
                        Pricing
                      </a>

                      <a
                        href={`${process.env.NEXT_PUBLIC_DOC_HOST}/tas-overview/`}
                        target="_blank"
                        className={`fromtablet:block  fromtablet:ml-0 fromtablet:mt-10 nav-link inline-block py-5 text-size-14 font-medium ml-30`}
                        data-amplitude="tas_landing_docs"
                      >
                        Documentation
                      </a>
                      {!is_login_page && (
                        <>
                          {!getAuthToken() ? (
                            <>
                              <Link href={`/login`}>
                                <a
                                  className="fromtablet:block  fromtablet:ml-0 fromtablet:mt-10 nav-link inline-block py-5 text-size-14 font-medium ml-30"
                                  data-amplitude="tas_landing_login"
                                >
                                  Login
                                </a>
                              </Link>
                              <Link href={`/login`}>
                                <a
                                  className="text-size-14 font-normal rounded-md px-15 py-9 ml-30 smtablet:mt-10 smtablet:ml-0 bg-purple-250 text-white mr-10 inline-flex items-center smtablet:w-full"
                                  data-amplitude="tas_landing_try_tas_for_free"
                                >
                                  Try TAS for free
                                </a>
                              </Link>
                            </>
                          ) : (
                            <Link
                              href={
                                orgName
                                  ? `/${provider}/${orgName}/dashboard`
                                  : `/${provider}/select-org`
                              }
                            >
                              <a className="text-size-14 font-normal rounded-md px-15 py-9 ml-30 smtablet:mt-10 smtablet:ml-0 bg-purple-250 text-white mr-10 inline-flex items-center smtablet:w-full">
                                Dashboard
                              </a>
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </header>
        )}
        {children}
        {!hide_footer && (
          <div className="py-75 pb-30 relative bg-white border-t px-30 smtablet:px-0">
            <div className="container">
              <div className="smtablet:block mx-auto w-11/12 smtablet:w-full">
                <div className="flex -mx-10 relative justify-between smtablet:block">
                  <div className="px-15 smtablet:mb-25">
                    <h3 className="text-black font-bold mb-13 inline-flex items-center text-size-14">
                      <span className="inline-flex border border-purple-400 p-7 border-radius-2 bg-purple-400 mr-10">
                        <img
                          loading="lazy"
                          src="/assets/images/emailer/TAS_Rocket_White.svg"
                          alt="Comments"
                          width="20"
                        />
                      </span>{' '}
                      TAS
                    </h3>
                    <div className="text-size-12 text-tas-350">
                      Accelerate your testing, shorten job times and get faster <br /> feedback on
                      code changes, manage flaky tests and <br />
                      keep master green at all times with Test At Scale.
                    </div>
                  </div>
                  <div className="px-15 smtablet:mb-25">
                    <h3 className="text-black font-bold mb-13 inline-flex items-center text-size-14">
                      Docs
                    </h3>
                    <div className="text-size-12">
                      <div className="mb-13">
                        <Link href="https://www.lambdatest.com/support/docs/tas-getting-started-creating-an-account">
                          <a className="text-tas-350" target="_blank">
                            Getting Started
                          </a>
                        </Link>
                      </div>
                      <div className="mb-13">
                        <Link href="https://www.lambdatest.com/support/docs/tas-self-hosted-overview">
                          <a className="text-tas-350" target="_blank">
                            Self Host TAS
                          </a>
                        </Link>
                      </div>
                      <div className="mb-13">
                        <Link href="https://www.lambdatest.com/support/docs/tas-tutorial-cloud-demo">
                          <a className="text-tas-350" target="_blank">
                            Tutorials
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="px-15 smtablet:mb-25">
                    <h3 className="text-black font-bold mb-13 inline-flex items-center text-size-14">
                      Open Source
                    </h3>
                    <div className="text-size-12">
                      <div className="mb-13">
                        <Link href="https://github.com/LambdaTest/test-at-scale/blob/main/CODE_OF_CONDUCT.md">
                          <a className="text-tas-350" target="_blank">
                            Code of Conduct
                          </a>
                        </Link>
                      </div>
                      <div className="mb-13">
                        <Link href="https://github.com/LambdaTest/test-at-scale/blob/main/CONTRIBUTING.md">
                          <a className="text-tas-350" target="_blank">
                            Contribution Guidelines
                          </a>
                        </Link>
                      </div>
                      <div className="mb-13">
                        <Link href="https://discord.com/invite/Wyf8srhf6K">
                          <a className="text-tas-350" target="_blank">
                            Discord
                          </a>
                        </Link>
                      </div>
                      <div className="mb-13">
                        <Link href="https://github.com/LambdaTest/test-at-scale/issues">
                          <a className="text-tas-350" target="_blank">
                            Issues
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="px-15 smtablet:mb-25">
                    <h3 className="text-black font-bold mb-13 inline-flex items-center text-size-14">
                      FAQs
                    </h3>
                    <div className="text-size-12">
                      <div className="mb-13">
                        <Link href="https://www.lambdatest.com/support/docs/tas-faq-and-troubleshooting">
                          <a className="text-tas-350" target="_blank">
                            FAQs
                          </a>
                        </Link>
                      </div>
                      <div className="mb-13">
                        <Link href="https://www.lambdatest.com/contact-us">
                          <a className="text-tas-350" target="_blank">
                            Contact Us
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <AcceptCookie />
    </>
  );
};

export default WebLayout;
