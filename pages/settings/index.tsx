import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import _ from 'underscore';

import { fetchUserUsageDetails, unmountSettings } from 'redux/actions/settingsAction';

import Col from 'components/Tags/Col';
import Layout from 'components/Layout';
import Row from 'components/Tags/Row';
import Loader from 'components/Loader';
import NoData from 'components/Nodata';
import AdminSettingsLeftNav from 'components/AdminSettingsLeftNav';

const OrgCreditsList = dynamic(() => import('modules/Settings/sections/OrgCreditsList'));

const Profile: NextPage = () => {
  const dispatch = useDispatch();
  const { settingsData }: any = useSelector((state) => state, _.isEqual);
  const { userUsageDetails, areUserUsageDetailsLoading } = settingsData;

  useEffect(() => {
    dispatch(fetchUserUsageDetails());
    return () => {
      dispatch(unmountSettings());
    };
  }, []);

  return (
    <Layout title="TAS Profile">
      <div className="p-20 pb-10 max__center__container">
        <Row>
          <Col size="2" className="pr-0">
            <AdminSettingsLeftNav />
          </Col>
          <Col size="10">
            {areUserUsageDetailsLoading && (
              <div className="mb-15 bg-white py-20 px-40 radius-3">
                <div className="flex flex-wrap items-center">
                  <img src="/assets/images/organization.svg" className="mr-15" alt="" width="40" />
                  <div className="flex flex-1 justify-between">
                    <div>
                      <div>
                        <span className="opacity-60 text-size-12">Organization</span>
                        <div className="placeholder-content mt-8" style={{ height: '16px' }}></div>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="mr-40">
                        <span className="text-tas-400 text-size-12">Projects</span>
                        <div className="placeholder-content mt-8" style={{ height: '16px' }}></div>
                      </div>
                      <div className="mr-40">
                        <span className="text-tas-400 text-size-12">Jobs</span>
                        <div className="placeholder-content mt-8" style={{ height: '16px' }}></div>
                      </div>
                      <div className="mr-40">
                        <span className="text-tas-400 text-size-12">Commits</span>
                        <div className="placeholder-content mt-8" style={{ height: '16px' }}></div>
                      </div>
                      <div className="mr-40">
                        <span className="text-tas-400 text-size-12">Total Tests </span>
                        <div className="placeholder-content mt-8" style={{ height: '16px' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!areUserUsageDetailsLoading && userUsageDetails && (
              <div className="mb-15 bg-white py-20 px-40 radius-3">
                <div className="flex flex-wrap items-center">
                  <img src="/assets/images/organization.svg" className="mr-15" alt="" width="40" />
                  <div className="flex flex-1 justify-between">
                    <div>
                      <span className="opacity-60 text-size-12">Organization</span>
                      <span className="text-gray-900 flex text-size-16 font-medium">
                        {userUsageDetails?.author}
                      </span>
                    </div>
                    <div className="flex">
                      <div className="mr-40 items-center">
                        <span className="text-tas-400 text-size-12">Projects</span>
                        <span className="text-gray-900 flex text-size-16 mr-8">
                          {userUsageDetails?.repositories_count}
                        </span>
                      </div>
                      <div className="mr-40 items-center">
                        <span className="text-tas-400 text-size-12">Jobs</span>
                        <span className="text-gray-900 flex text-size-16 mr-8">
                          {userUsageDetails?.builds_count}
                        </span>
                      </div>
                      <div className="mr-40 items-center">
                        <span className="text-tas-400 text-size-12">Commits</span>
                        <span className="text-gray-900 flex text-size-16 mr-8">
                          {userUsageDetails?.commits_count}
                        </span>
                      </div>
                      <div className="mr-40 items-center">
                        <span className="text-tas-400 text-size-12">Total Tests</span>
                        <span className="text-gray-900 flex text-size-16 mr-8">
                          {userUsageDetails?.tests_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {userUsageDetails && <OrgCreditsList />}
            {!userUsageDetails && !areUserUsageDetailsLoading && (
              <div
                className="inline-flex bg-white w-full justify-center items-center radius-3"
                style={{ height: '95vh' }}
              >
                <NoData
                  msg={[
                    `Seems like no jobs have been executed till now. <br /> No usage data available.`,
                  ]}
                />
              </div>
            )}
            {areUserUsageDetailsLoading && (
              <div>
                <div style={{ height: '48px' }}></div>
                <div className="flex justify-between items-center bg-white px-20 py-10  radius-3 rounded-b-none border-b text-size-12 text-tas-400 font-medium">
                  <div className="px-15 w-2/12">
                    <span className="w-full leading-none inline-flex items-center">Job ID</span>
                  </div>
                  <div className="px-15 w-2/12">
                    <span className="w-full leading-none inline-flex items-center">Commit ID</span>
                  </div>
                  <div className="px-15  w-3/12">
                    <span className="w-full leading-none inline-flex items-center">
                      System Config
                    </span>
                  </div>
                  <div className="px-15  w-2/12">
                    <span className="w-full leading-none inline-flex items-center">Duration</span>
                  </div>
                  <div className="px-15  w-2/12">
                    <span className="w-full leading-none inline-flex items-center">Credits</span>
                  </div>
                </div>
                <Loader additionalClassesToAdd="px-20 py-10" loader_for="settings" />
              </div>
            )}
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Profile;
