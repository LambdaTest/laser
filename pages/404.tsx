import { useEffect, useState } from 'react';
import Router from 'next/router';

import TasCustom404 from '../components/TasCustom404';

const dynamicPaths = [
  {
    has_detail_page: true,
    path: 'tests',
  },
  {
    has_detail_page: true,
    path: 'tests-suites',
  },
  {
    has_detail_page: true,
    path: 'jobs',
  },
  {
    has_detail_page: true,
    path: 'logs',
  },
  {
    has_detail_page: true,
    path: 'commits',
  },
  {
    has_detail_page: false,
    path: 'contributors',
  },
  {
    has_detail_page: false,
    path: 'trends',
  },
  {
    has_detail_page: false,
    path: 'insights',
  },
  {
    has_detail_page: false,
    path: 'ftm-insights',
  },
  {
    has_detail_page: false,
    path: 'settings',
  },
  {
    has_detail_page: false,
    path: 'select-org',
  },
  {
    has_detail_page: false,
    path: 'get-started',
  },
  {
    has_detail_page: false,
    path: 'get-started',
  },
  {
    has_detail_page: false,
    path: 'dashboard',
  },
  {
    has_detail_page: false,
    path: 'repositories',
  },
  {
    has_detail_page: false,
    path: 'user-details',
  },
  {
    has_detail_page: false,
    path: 'tas-runner',
  },
  {
    has_detail_page: false,
    path: 'tas-runner-info',
  },
  {
    has_detail_page: false,
    path: 'synapse-setup',
  },
  {
    has_detail_page: false,
    path: 'synapse-config',
  },
  {
    has_detail_page: false,
    path: 'synapse-list',
  },
];

const providers = ['github', 'gitlab', 'bitbucket'];
// const org = '[a-zA-Z-_0-9]{1,1000}';
// const repoNameRegex = '[a-zA-Z-_0-9]{1,1000000}';
// const genericId = '[a-zA-Z-_0-9]{30,40}';

export default function Custom404() {
  const [isNotFound, setIsNotFound] = useState(true);

  const handleDynamicRoute = (url_pathname: any, provider: any) => {
    let pathname = url_pathname;
    let lastChar = pathname.substr(-1);
    if(lastChar !== "/") {
      pathname = `${pathname}/`
    }
    if(providers.indexOf(provider) !== -1) {
      dynamicPaths.forEach((el) => {
        let regex1 = new RegExp(`${provider}\\/${el.path}\\/(?:\\?(.*))?$`);
        let regex2 = new RegExp(`${provider}\\/([^\\/]*?)\\/${el.path}\\/(?:\\?(.*))?$`);
        let regex3 = new RegExp(`${provider}\\/([^\\/]*?)\\/([^\\/]*?)\\/${el.path}\\/(?:\\?(.*))?$`);
        let regex4 = new RegExp(`${provider}\\/([^\\/]*?)\\/([^\\/]*?)\\/${el.path}\\/([^\\/]*?)\\/(?:\\?(.*))?$`);
        if (regex1.test(pathname) || regex2.test(pathname) || regex3.test(pathname) || regex4.test(pathname)) {
          setIsNotFound(false);
          Router.replace(pathname); // Redirect to the right page...
        }
      });
    }
  };

  useEffect(() => {
    let pathNameArray = window.location.pathname.split('/');
    pathNameArray = pathNameArray.filter((v) => v != '');
    if (pathNameArray.length > 0) {
      handleDynamicRoute(window.location.pathname, pathNameArray[0]);
    }
  }, []);

  if (isNotFound) return <TasCustom404 />;

  return null;
}
