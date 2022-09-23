import React, { useRef, useState } from 'react';

import Layout from 'components/Layout';
import { NextPage } from 'next';
import Row from 'components/Tags/Row';
import Col from 'components/Tags/Col';
import { useRouter } from 'next/router';
import { httpPost } from 'redux/httpclient';
import { errorInterceptor } from 'redux/helper';
import { toast } from 'react-toastify';
import { getCookieOrgName, logAmplitude } from 'helpers/genericHelpers';
import { useSelector } from 'react-redux';

const UserDetails: NextPage = () => {
  const state = useSelector((state) => state);
  const { persistData }: any = state;
  const { currentOrg }: any = persistData;
  const { userInfo } = persistData;

  const [valueUpdate, setValueUpdated] = useState(1);
  const [loading, setLoading] = useState(false);
  let form = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const updateValue = () => {
    setValueUpdated(valueUpdate + 1);
  };

  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    if (!loading) {
      // @ts-ignore
      const { user_description, experience, team_size } = form.current;
      if (user_description.value === '') {
        toast.error('Please select: What describes you the most?');
        return;
      }
      if (experience.value === '') {
        toast.error('Please select: How much experience do you have?');
        return;
      }
      if (team_size.value === '') {
        toast.error('Please select: What is your team size?');
        return;
      }
      let formdata = {
        user_description: user_description.value,
        experience: experience.value,
        team_size: team_size.value,
        org: getCookieOrgName(),
      };
      console.log(formdata);
      postData(formdata);
    }
    logAmplitude('tas_onboarding_questions', { 'User questions action': 'next' });
  };
  const postData = async (data: any) => {
    setLoading(true);
    await httpPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/info`, data)
      .then((data) => {
        console.log('data', data);
        setLoading(false);
        handleNavigation();
      })
      .catch((error) => {
        console.log('error', error);
        setLoading(false);
        errorInterceptor(error);
      });
  };
  const handleNavigation = () => {
    if (!currentOrg) {
      return;
    }

    const urlBase = `/${currentOrg.git_provider}/${currentOrg.name}`;
    const isUserActive = !!userInfo?.is_active;

    if (currentOrg.runner_type && currentOrg.synapse_key && isUserActive) {
      router.push(`${urlBase}/repositories`);
    } else if (currentOrg.runner_type && currentOrg.synapse_key && !isUserActive) {
      router.push(`${urlBase}/tas-runner-info`);
    } else {
      router.push(`${urlBase}/tas-runner`);
    }
  };

  return (
    <Layout title="TAS: User Details">
      <div style={{ paddingTop: '3%' }}>
        <form
          className="p-20"
          style={{ maxWidth: '540px', margin: '0 auto', minWidth: '540px' }}
          ref={form}
        >
          <div className="bg-white mb-10 rounded-md shadow-md">
            <h3 className="py-15 px-28 text-size-20 text-gray-900 border-b border-gray-150">
              What describes you the most?
            </h3>
            <div className="p-25">
              <Row gutter="5" className="mb-10">
                <Col size="6" gutter="5">
                  <div
                    className={`border rounded-md p-10 flex items-center justify-center cursor-pointer relative ${
                      form.current?.user_description.value == 'Software Developer'
                        ? 'border-blue-400 bg-blue-100'
                        : ''
                    }`}
                    onClick={updateValue}
                  >
                    {/* <span className="mr-15">
                                        <Image src="/assets/images/icon/developer.svg" alt="" width="60" />
                                    </span> */}
                    <span className="leading-normal text-size-14 text-blue-900">
                      Software Developer
                    </span>
                    <input
                      type="radio"
                      value="Software Developer"
                      name="user_description"
                      className="w-full h-full absolute left-0 top-0 cursor-pointer opacity-0"
                    />
                  </div>
                </Col>
                <Col size="6" gutter="5">
                  <div
                    className={`border rounded-md p-10 flex items-center   justify-center cursor-pointer relative ${
                      form.current?.user_description.value == 'Engineering Manager'
                        ? 'border-blue-400 bg-blue-100'
                        : ''
                    }`}
                    onClick={updateValue}
                  >
                    {/* <span className="mr-15">
                                        <Image src="/assets/images/icon/engineering-manager.svg" alt="" width="60" />
                                    </span> */}
                    <span className="leading-normal text-size-14 text-blue-900">
                      Engineering Manager
                    </span>
                    <input
                      type="radio"
                      value="Engineering Manager"
                      name="user_description"
                      className="w-full h-full absolute left-0 top-0 cursor-pointer opacity-0"
                    />
                  </div>
                </Col>
              </Row>
              <Row gutter="5">
                <Col size="6" gutter="5">
                  <div
                    className={`border rounded-md p-10 flex items-center  justify-center cursor-pointer relative ${
                      form.current?.user_description.value == 'Devops Manager'
                        ? 'border-blue-400 bg-blue-100'
                        : ''
                    }`}
                    onClick={updateValue}
                  >
                    {/* <span className="mr-15">
                                        <Image src="/assets/images/icon/deveops-manager.svg" alt="" width="60" />
                                    </span> */}
                    <span className="leading-normal text-size-14 text-blue-900">
                      Devops Manager
                    </span>
                    <input
                      type="radio"
                      value="Devops Manager"
                      name="user_description"
                      className="w-full h-full absolute left-0 top-0 cursor-pointer opacity-0"
                    />
                  </div>
                </Col>
                <Col size="6" gutter="5">
                  <div
                    className={`border rounded-md p-10 flex items-center  justify-center cursor-pointer relative ${
                      form.current?.user_description.value == 'Other'
                        ? 'border-blue-400 bg-blue-100'
                        : ''
                    }`}
                    onClick={updateValue}
                  >
                    {/* <span className="mr-15">
                                        <Image src="/assets/images/icon/other-manager.svg" alt="" width="60" />
                                    </span> */}
                    <span className="leading-normal text-size-14 text-blue-900">Other</span>
                    <input
                      type="radio"
                      value="Other"
                      name="user_description"
                      className="w-full h-full absolute left-0 top-0 cursor-pointer opacity-0"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="bg-white mb-10 rounded-md shadow-md">
            <h3 className="py-15 px-28 text-size-20 text-gray-900 border-b border-gray-150">
              How much experience do you have?
            </h3>
            <div className="p-25">
              <Row gutter="5" className="mb-10">
                <Col size="6" gutter="5">
                  <div
                    className={`border rounded-md p-10 flex items-center cursor-pointer justify-center relative ${
                      form.current?.experience.value == '1-3 Years'
                        ? 'border-blue-400 bg-blue-100'
                        : ''
                    }`}
                    onClick={updateValue}
                  >
                    <span className="leading-normal text-size-14 text-blue-900">1-3 Years</span>
                    <input
                      type="radio"
                      value="1-3 Years"
                      name="experience"
                      className="w-full h-full absolute left-0 top-0 cursor-pointer opacity-0"
                    />
                  </div>
                </Col>
                <Col size="6" gutter="5">
                  <div
                    className={`border rounded-md p-10 flex items-center cursor-pointer justify-center relative ${
                      form.current?.experience.value == '4-6 Years'
                        ? 'border-blue-400 bg-blue-100'
                        : ''
                    }`}
                    onClick={updateValue}
                  >
                    <span className="leading-normal text-size-14 text-blue-900">4-6 Years</span>
                    <input
                      type="radio"
                      value="4-6 Years"
                      name="experience"
                      className="w-full h-full absolute left-0 top-0 cursor-pointer opacity-0"
                    />
                  </div>
                </Col>
              </Row>
              <Row gutter="5">
                <Col size="6" gutter="5">
                  <div
                    className={`border rounded-md p-10 flex items-center cursor-pointer justify-center relative ${
                      form.current?.experience.value == '7-10 Years'
                        ? 'border-blue-400 bg-blue-100'
                        : ''
                    }`}
                    onClick={updateValue}
                  >
                    <span className="leading-normal text-size-14 text-blue-900">7-10 Years</span>
                    <input
                      type="radio"
                      value="7-10 Years"
                      name="experience"
                      className="w-full h-full absolute left-0 top-0 cursor-pointer opacity-0"
                    />
                  </div>
                </Col>
                <Col size="6" gutter="5">
                  <div
                    className={`border rounded-md p-10 flex items-center cursor-pointer justify-center relative ${
                      form.current?.experience.value == 'More than 10 Years'
                        ? 'border-blue-400 bg-blue-100'
                        : ''
                    }`}
                    onClick={updateValue}
                  >
                    <span className="leading-normal text-size-14 text-blue-900">
                      More than 10 Years
                    </span>
                    <input
                      type="radio"
                      value="More than 10 Years"
                      name="experience"
                      className="w-full h-full absolute left-0 top-0 cursor-pointer opacity-0"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="bg-white mb-20 rounded-md shadow-md ">
            <h3 className="py-15 px-28 text-size-20 text-gray-900 border-b border-gray-150">
              What is your team size?
            </h3>
            <div className="p-25">
              <Row gutter="5" className="mb-10">
                <Col size="6" gutter="5">
                  <div
                    className={`border rounded-md p-10 flex items-center cursor-pointer justify-center relative ${
                      form.current?.team_size.value == 'Less than 10 members'
                        ? 'border-blue-400 bg-blue-100'
                        : ''
                    }`}
                    onClick={updateValue}
                  >
                    <span className="leading-normal text-size-14 text-blue-900">
                      Less than 10 members
                    </span>
                    <input
                      type="radio"
                      value="Less than 10 members"
                      name="team_size"
                      className="w-full h-full absolute left-0 top-0 cursor-pointer opacity-0"
                    />
                  </div>
                </Col>
                <Col size="6" gutter="5">
                  <div
                    className={`border rounded-md p-10 flex items-center cursor-pointer justify-center relative ${
                      form.current?.team_size.value == '10-100 members'
                        ? 'border-blue-400 bg-blue-100'
                        : ''
                    }`}
                    onClick={updateValue}
                  >
                    <span className="leading-normal text-size-14 text-blue-900">
                      10-100 members
                    </span>
                    <input
                      type="radio"
                      value="10-100 members"
                      name="team_size"
                      className="w-full h-full absolute left-0 top-0 cursor-pointer opacity-0"
                    />
                  </div>
                </Col>
              </Row>
              <Row gutter="5">
                <Col size="6" gutter="5">
                  <div
                    className={`border rounded-md p-10 flex items-center cursor-pointer justify-center relative ${
                      form.current?.team_size.value == '100-500 members'
                        ? 'border-blue-400 bg-blue-100'
                        : ''
                    }`}
                    onClick={updateValue}
                  >
                    <span className="leading-normal text-size-14 text-blue-900">
                      100-500 members
                    </span>
                    <input
                      type="radio"
                      value="100-500 members"
                      name="team_size"
                      className="w-full h-full absolute left-0 top-0 cursor-pointer opacity-0"
                    />
                  </div>
                </Col>
                <Col size="6" gutter="5">
                  <div
                    className={`border rounded-md p-10 flex items-center cursor-pointer justify-center relative ${
                      form.current?.team_size.value == 'More than 500 members'
                        ? 'border-blue-400 bg-blue-100'
                        : ''
                    }`}
                    onClick={updateValue}
                  >
                    <span className="leading-normal text-size-14 text-blue-900">
                      More than 500 members
                    </span>
                    <input
                      type="radio"
                      value="More than 500 members"
                      name="team_size"
                      className="w-full h-full absolute left-0 top-0 cursor-pointer opacity-0"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="flex justify-end">
            <div>
              <span
                onClick={() => {
                  handleNavigation();
                  logAmplitude('tas_onboarding_questions', { 'User questions action': 'skip' });
                }}
                className=" text-gray-700 py-7 px-15 rounded  text-size-14 transition  inline-block cursor-pointer"
              >
                SKIP
              </span>
              <button
                onClick={handleSubmitForm}
                className="border border-black text-white py-7 px-15 rounded bg-black text-size-14 transition hover:bg-black hover:text-white hover:border-black ml-10 inline-flex"
              >
                PROCEED {loading && <div className="loader ml-10">Loading...</div>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default UserDetails;
