import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { createCookieGitProvider, getAuthToken } from '../../helpers/genericHelpers';

import Link from 'next/link';
import Text from 'components/Tags/Text';
import Image from 'components/Tags/Image';
import Head from 'next/head';

const Login: NextPage = () => {
  const state = useSelector((state) => state);
  const { persistData }: any = state;
  const { currentOrg }: any = persistData;

  const router = useRouter();

  const dropdown = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (getAuthToken()) {
      router.push(`/${currentOrg?.git_provider}/${currentOrg?.name}/dashboard`);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Test At Scale | Login</title>
      </Head>
      <div className="admin-wrapper">
        <div className="container-fluid admin-wrapper-fluid">
          <div className="row admin-wrapper-row">
            <div className="admin-wrapper-leftsection">
              <div className="leftnavmenu">
                <div className="flex flex-col items-center">
                  <Link href={`/`}>
                    <a className="items-center bg-white p-8 rounded-full  w-36 h-36 mt-40 mb-50 inline-flex justify-center">
                      <img
                        src={'/assets/images/lt-logo.svg'}
                        alt="logo"
                        width="23"
                        className="menu__item__img"
                      />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col admin-wrapper-rightsection">
              <div className="admin-content-area designed-scroll" style={{ width: 'auto' }}>
                <div className="modal__wrapper">
                  <div className="modal__overlay"></div>
                  <div className="modal__dialog">
                    <div className="bg-white w-6/12 mx-auto shadow-md rounded-lg">
                      <div className="flex items-center justify-center pt-30">
                        <img src={'/assets/images/lt-logo.svg'} alt="logo" width="60" />
                      </div>
                      <Text className="pt-12 pb-34 px-27 text-size-18 text-gray-900 border-gray-150 font-normal text-center">
                        Start testing with TAS
                      </Text>
                      <div className="px-45">
                        <a
                          onClick={() => createCookieGitProvider('github')}
                          data-amplitude="tas_login_github"
                          ref={dropdown}
                          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/login/github`}
                          className={`bg-gray-960 text-white text-size-14 h-48 tracking-wide  rounded flex items-center justify-center`}
                        >
                          <span className="h-48 inline-flex items-center center justify-center rounded pl-10">
                            <Image
                              src="/assets/images/icon/github-white.svg"
                              className="mr-8 w-24 h-24"
                            />
                            Login with Github
                          </span>
                        </a>
                      </div>
                      <div className="px-45 mt-10">
                        <a
                          className="cursor-pointer  text-size-14 text-white inline-flex items-center w-full bg-brown-950 h-48 justify-center rounded"
                          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/login/gitlab`}
                          onClick={() => createCookieGitProvider('gitlab')}
                          data-amplitude="tas_login_gitlab"
                        >
                          <Image
                            src="/assets/images/icon/gitlab_v2.svg"
                            className="mr-12 w-24 h-24"
                          />
                          Login with GitLab
                        </a>
                      </div>
                      <div className="px-45 mt-10">
                        <a
                          className="cursor-pointer  text-size-14 text-white inline-flex items-center w-full bg-blue-670 h-48 justify-center rounded"
                          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/login/bitbucket`}
                          onClick={() => createCookieGitProvider('bitbucket')}
                          data-amplitude="tas_login_bitbucket"
                        >
                          <span className="inline-flex items-center pl-15">
                            <Image
                              src="/assets/images/icon/bitbucket_v2.svg"
                              className="mr-12 w-24 h-24"
                            />
                            Login with Bitbucket
                          </span>
                        </a>
                      </div>
                      <div className="py-25 text-tas-400 text-center text-size-12">
                        By continuing, I agree to the <br />
                        <a href="https://www.lambdatest.com/legal/terms-of-service" target="_blank">
                          {' '}
                          Terms of service{' '}
                        </a>{' '}
                        and{' '}
                        <a href="https://www.lambdatest.com/legal/privacy" target="_blank">
                          {' '}
                          Privacy Policy{' '}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
