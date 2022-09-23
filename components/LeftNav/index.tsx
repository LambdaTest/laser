import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCookieGitProvider,
  getAuthToken,
  removeCookie,
  createCookieOrgName,
  createCookieOrgId,
} from '../../helpers/genericHelpers';
import { logOut } from '../../redux/actions/authAction';
import { persistCurrentOrg } from '../../redux/actions/persistAction';
import { errorInterceptor } from '../../redux/helper';
import { httpGet } from '../../redux/httpclient';
import Image from '../Tags/Image';
import Text from '../Tags/Text';
import IconDashboard from '../Icons/Dashboard';
import IconSettings from '../Icons/Settings';

export default function LeftNav() {
  const router = useRouter();
  const { repo, provider, org } = router.query;
  const dropdown = useRef<HTMLDivElement>(null);
  const state = useSelector((state) => state);
  const { persistData }: any = state;
  const { currentOrg, orgs }: any = persistData;
  const dispatch = useDispatch();
  const [loginExpired, setLoginExpired] = useState(false);
  const selectOrg = (org: any) => {
    dispatch(persistCurrentOrg(org));
    createCookieOrgName(org.name);
    createCookieOrgId(org.id);
    setTimeout(() => {
      if (window) {
        window.location.href = `${window.location.origin}/${org?.git_provider}/${org?.name}/dashboard`;
      }
    }, 500);
  };
  const handleOpenDropdown = () => {
    dropdown.current?.classList.toggle('open');
  };
  const logOutCleanup = () => {
    removeCookie(`${process.env.NEXT_PUBLIC_AUTH_COOKIE}`);
    removeCookie('tas_org_name');
    removeCookie('tas_git_provider');
    removeCookie('tas_repo_branch');
    removeCookie('tas_org_id')
    dispatch(logOut());
    router.push('/login');
  };
  const handleLogout = () => {
    console.log('Logging out...');
    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`)
      .then((data: any) => {
        console.log(data);
        logOutCleanup();
      })
      .catch((error: any) => {
        errorInterceptor(error);
      });
  };

  useEffect(() => {
    if (window) {
      window.addEventListener('TasLogout', (e: any) => {
        if (e.detail?.unauthorised) {
          logOutCleanup();
        }
      });
    }
  }, []);
  useEffect(() => {
    if (!repo && provider && org) {
      removeCookie('tas_repo_branch');
    }
  }, [provider, org, repo]);
  useEffect(() => {
    if (provider && org && repo) {
      createCookieGitProvider(provider);
      createCookieOrgName(org);
      if (!getAuthToken()) {
        setLoginExpired(true);
      } else {
        setLoginExpired(false);
      }
    }
    if (provider && org && !repo) {
      if (!getAuthToken()) {
        logOutCleanup();
      }
      if (currentOrg) {
        if (currentOrg.git_provider == provider && currentOrg.name == org) {
          return;
        }
        createCookieGitProvider(currentOrg.git_provider);
        createCookieOrgName(currentOrg.name);
        createCookieOrgId(currentOrg.id);
        let routeOn = `/${currentOrg.git_provider}/${currentOrg.name}/dashboard/`;
        router.push(routeOn);
      }
    }
    if (window && provider && org && repo) {
      let isSettingsPage = window.location.pathname.includes(`/settings/`);
      if (isSettingsPage && currentOrg && currentOrg.name !== org) {
        router.push(`/${provider}/${org}/${repo}/jobs/`);
      }
    }
  }, [provider, org, repo]);

  const handleSidebarClick = () => {
    createCookieGitProvider(currentOrg.git_provider);
    createCookieOrgName(currentOrg.name);
    createCookieOrgId(currentOrg.id);
  };
  return (
    <div className="admin-wrapper-leftsection">
      <div className="leftnavmenu">
        {!loginExpired ? (
          <>
            <div className="flex flex-col items-center">
              <Link href={`/${currentOrg?.git_provider}/${currentOrg?.name}/dashboard`}>
                <a
                  onClick={handleSidebarClick}
                  className="items-center bg-white p-8 rounded-full w-36 h-36 mt-40 mb-50 inline-flex justify-center"
                >
                  <img
                    src={'/assets/images/lt-logo.svg'}
                    alt="logo"
                    width="20"
                    className="menu__item__img"
                  />
                </a>
              </Link>
              <div className="flex items-center flex-col">
                <Link href={`/${currentOrg?.git_provider}/${currentOrg?.name}/dashboard`}>
                  <a
                    onClick={handleSidebarClick}
                    className={`items-center inline-flex p-10 justify-center rounded w-44 h-44 mb-40 menu__item ${
                      router.asPath == `/${currentOrg?.git_provider}/${currentOrg?.name}/dashboard/`
                        ? 'active'
                        : ''
                    }`}
                  >
                    <IconDashboard
                      className="menu__item__img"
                      height={18}
                      variant={
                        router.asPath ==
                        `/${currentOrg?.git_provider}/${currentOrg?.name}/dashboard/`
                          ? 'active'
                          : 'inactive'
                      }
                      width={18}
                    />
                    <span className="text-white menu__text">Dashboard</span>
                  </a>
                </Link>
                <Link href="/settings">
                  <a
                    onClick={handleSidebarClick}
                    className={`items-center inline-flex p-10 justify-center rounded w-44 h-44 mb-40 menu__item ${
                      router.asPath.startsWith(`/settings/`) ||
                      router.asPath.startsWith(
                        `/${currentOrg?.git_provider}/${currentOrg?.name}/synapse-config/`
                      )
                        ? 'active'
                        : ''
                    }`}
                  >
                    <IconSettings
                      className="menu__item__img"
                      height={18}
                      variant={
                        router.asPath.startsWith(`/settings/`) ||
                        router.asPath.startsWith(
                          `/${currentOrg?.git_provider}/${currentOrg?.name}/synapse-config/`
                        )
                          ? 'active'
                          : 'inactive'
                      }
                      width={20}
                    />
                    <span className="text-white menu__text">Settings</span>
                  </a>
                </Link>
              </div>
            </div>
            <div className="flex items-center flex-col">
              <a href={`${process.env.NEXT_PUBLIC_DOC_HOST}/tas-overview/`} target="_blank">
                <Text
                  className={`items-center inline-flex p-10 justify-center rounded w-44 h-44 mb-40 menu__item`}
                >
                  <img
                    src={'/assets/images/icon/doc.svg'}
                    alt="logo"
                    width="18"
                    className="menu__item__img"
                  />
                  <span className="text-white menu__text">Docs</span>
                </Text>
              </a>
              <div
                className={`items-center inline-flex p-2 justify-center rounded-full w-36 h-36 mb-50 lt-dropdown relative`}
                ref={dropdown}
              >
                <span
                  className="lt-dropdown-toggle cursor-pointer items-center inline-flex justify-center w-24 h-24 p-2 bg-white rounded-full"
                  onClick={() => handleOpenDropdown()}
                >
                  {currentOrg && currentOrg.avatar ? (
                    <img
                      src={`${currentOrg.avatar}`}
                      alt="logo"
                      width="10"
                      className="menu__item__img pointer-events-none"
                    />
                  ) : (
                    <img
                      src={'/assets/images/icon/logout.svg'}
                      alt="logo"
                      width="10"
                      className="menu__item__img pointer-events-none"
                    />
                  )}
                </span>
                <div className="org__dropdown__menu rounded lt-dropdown-menu">
                  <div
                    className="designed-scroll overflow-hidden overflow-y-scroll"
                    style={{ maxHeight: '260px' }}
                  >
                    {orgs &&
                      orgs.length > 0 &&
                      orgs.map((org: any) => (
                        <Text
                          className="cursor-pointer py-5 px-10 text-size-14 text-gray-600 inline-flex items-center w-full hover:bg-gray-100"
                          key={org.name}
                          onClick={() => selectOrg(org)}
                        >
                          <Image
                            src={`${org.avatar ? org.avatar : '/assets/images/icon/user.svg'}`}
                            className="mr-12 rounded-full bg-gray-100 w-38 h-38 p-9"
                          />{' '}
                          {org.name}
                        </Text>
                      ))}
                  </div>
                  {provider === 'github' && (
                    <div className="border-t cursor-pointer py-10 px-20 flex flex-col w-full hover:bg-gray-100">
                      <Link
                        href={`https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/new`}
                      >
                        <a target="_blank">
                        <Text className="cursor-pointer text-size-14 text-gray-600 inline-flex items-center w-full">
                          Can't find an organization?
                        </Text>
                        <Text className="cursor-pointer text-size-12 text-blue-600 hover:bg-gray-100">
                              Check Permissions
                            </Text>
                          </a>
                      </Link>
                    </div>
                  )}
                  <Text
                    className="border-t cursor-pointer py-15 px-20 text-size-14 text-gray-600 inline-flex items-center w-full hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </Text>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <Link href={`/`}>
                <a className="items-center bg-white p-8 rounded-full w-36 h-36 mt-40 mb-50 inline-flex justify-center">
                  <img
                    src={'/assets/images/lt-logo.svg'}
                    alt="logo"
                    width="20"
                    className="menu__item__img"
                  />
                </a>
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <Link href={`/login`}>
                <a
                  className={`items-center inline-flex p-10 justify-center rounded w-44 h-44 mb-40 menu__item ${
                    router.asPath == `/login/` ? 'bg-gray-800' : ''
                  }`}
                >
                  <img
                    src={'/assets/images/icon/logout.svg'}
                    alt="logo"
                    width="18"
                    className="menu__item__img"
                  />
                  <span className="text-white menu__text">Login</span>
                </a>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
