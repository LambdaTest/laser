import React, { useEffect } from 'react';
import Layout from 'components/Layout';
import { NextPage } from 'next';
import Text from 'components/Tags/Text';
import Image from 'components/Tags/Image';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrgs } from 'redux/actions/orgAction';
import { useRouter } from 'next/router';
import { persistCurrentOrg, persistOrgs, persistUserInfo } from 'redux/actions/persistAction';
import {
  createCookieGitProvider,
  createCookieOrgId,
  getCookie,
  logAmplitude,
  removeCookie,
  writeCookie,
} from 'helpers/genericHelpers';
import { httpGet } from 'redux/httpclient';
import { logOut } from 'redux/actions/authAction';

const SelectOrg: NextPage = () => {
  const state = useSelector((state) => state);
  const router = useRouter();
  const { provider } = router.query;
  // const [loading, setLoading] = useState(true)
  // const [currentIndex, setCurrentIndex] = useState(-1)
  const { orgData }: any = state;
  const { orgs, isOrgsFetching }: { orgs: any; isOrgsFetching: any } = orgData;

  const dispatch = useDispatch();

  const getData = async (org: any) => {
    // setLoading(true)
    await httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/info`, {
      org: org.name,
    })
      .then((data) => {
        dispatch(persistUserInfo(data));
        if (data?.user_info?.org) {
          selectOrg(org, false, data);
        } else {
          selectOrg(org, true, data);
        }
        // setLoading(false)
      })
      .catch((error) => {
        dispatch(persistUserInfo(null));
        selectOrg(org, true, null);
        console.log('error', error.response.status);
        // setLoading(false)
      });
    if (!getCookie('tas_org_name')) {
      logAmplitude('tas_onboarding_select_org');
    }
  };

  const selectOrg = (org: any, toDetails = true, userInfo: any) => {
    const urlBase = `/${org.git_provider}/${org.name}`;
    const isUserActive = !!userInfo?.is_active;

    dispatch(persistCurrentOrg(org));

    if (toDetails) {
      router.push(`${urlBase}/user-details`);
    } else if (org.runner_type && org.synapse_key && isUserActive) {
      router.push(`${urlBase}/repositories`);
    } else if (org.runner_type && org.synapse_key && !isUserActive) {
      router.push(`${urlBase}/tas-runner-info`);
    } else {
      router.push(`${urlBase}/tas-runner`);
    }
    writeCookie('tas_org_name', org.name);
    createCookieOrgId(org.id)
  };

  useEffect(() => {
    if (window) {
      window.addEventListener('TasLogout', (e: any) => {
        if (e.detail?.unauthorised) {
          removeCookie(`${process.env.NEXT_PUBLIC_AUTH_COOKIE}`);
          removeCookie('tas_org_name');
          removeCookie('tas_org_id')
          dispatch(logOut());
          router.push('/login');
        }
      });
    }
    dispatch(fetchOrgs());
  }, []);
  useEffect(() => {
    if (provider) {
      createCookieGitProvider(provider);
    }
  }, [provider]);
  useEffect(() => {
    if (orgs.length > 0) {
      dispatch(persistOrgs(orgs));
    }
  }, [orgs.length]);
  return (
    <Layout title="TAS: Select Org" hidenav={getCookie('tas_org_name') ? false : true}>
      <div className="modal__wrapper">
        <div className="modal__overlay"></div>
        <div className="modal__dialog">
          <div className="bg-white w-6/12 mx-auto shadow-md rounded-lg">
            <Text className="py-24 px-27 text-size-20 text-gray-900 border-b border-gray-150 text-center">
              Select Organization
            </Text>
            <div
              className="py-15 designed-scroll overflow-hidden overflow-y-scroll"
              style={{ maxHeight: '340px' }}
            >
              {isOrgsFetching && orgs.length == 0 && (
                <div className="px-10">
                  <div className="placeholder-content mb-10" style={{ height: '78px' }}></div>
                  <div className="placeholder-content mb-10" style={{ height: '78px' }}></div>
                </div>
              )}
              {orgs &&
                orgs.length > 0 &&
                orgs.map((org: any) => (
                  <Text
                    className="cursor-pointer py-20 px-32 text-size-16 text-gray-600 inline-flex items-center w-full hover:bg-gray-100"
                    key={org.name}
                    onClick={() => getData(org)}
                  >
                    <Image
                      src={`${org.avatar ? org.avatar : '/assets/images/icon/user.svg'}`}
                      className="mr-12 rounded-full bg-gray-100 w-38 h-38 p-9"
                    />{' '}
                    {org.name}
                  </Text>
                ))}



            </div>
          </div>
          {provider == 'github' && (
          <div className='text-center mt-15'>
              <span className="inline-block cursor-pointer"  key="add-org"
                  onClick={() => {
                    window.open(
                      `https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/new`,
                      '_blank'
                    );
                  }}>
                <span className='text-size-14 text-gray-630 tracking-wider'>Can’t see your git organisation?</span>
                <Text
                    className="text-size-12 text-gray-630"
                  >
                    Check permissions here
                  </Text>
              </span>
          </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SelectOrg;
