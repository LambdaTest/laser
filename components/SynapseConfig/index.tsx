import React, { useState } from 'react';
import { androidstudio, CopyBlock } from 'react-code-blocks';
import { httpGet } from 'redux/httpclient';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import SynapseToken from 'components/SynapseToken';
import { logAmplitude } from 'helpers/genericHelpers';
import Image from 'components/Tags/Image';
import Text from 'components/Tags/Text';

export default function SynapseConfig({ test_connection }: any) {
  const router = useRouter();

  const state = useSelector((state) => state);
  const { persistData }: any = state;
  const { currentOrg }: any = persistData;
  const { synapse_key = '' }: { synapse_key: string } = currentOrg || {};

  const [activeStep, setActiveStep] = useState('2');
  const [toggleModal, setToggleModal] = useState(false);

  const handleToggle = () => {
    setToggleModal(!toggleModal);
  };
  /**
   * Tests the connect
   */
  const testConnection = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    await httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/org/synapse/test-connection`, {
      org: currentOrg.name,
    })
      .then((data) => {
        setSynapaseConnected(data.synapse_connection);
        setSynapaseConnectionError(!data.synapse_connection);
        setLoading(false);
      })
      .catch((error) => {
        console.log('error', error);
        setSynapaseConnectionError(true);
        setSynapaseConnected(false);
        setLoading(false);
      });
    logAmplitude('tas_onboarding_synapse_test_connection', {'Button clicked': 'test connection'})
  };

  /**
   * User clicks on proceed.
   */
  const onProceed = () => {
    router.push(`/${currentOrg.git_provider}/${currentOrg.name}/repositories`);
    logAmplitude('tas_onboarding_synapse_proceed', {'Button clicked': 'proceed'})
  };

  const [synapseConnected, setSynapaseConnected] = useState(false);
  const [synapseConnectionError, setSynapaseConnectionError] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <>
    <div className="synapse__container__config__parent">
      <div>
        <div className="border-b flex justify-between py-12 px-20">
          <div className="text-size-16 font-medium">Steps to Configure TAS Self Hosted</div>
         {!test_connection && <div className='pl-52 flex items-center'>
            <a href={`${process.env.NEXT_PUBLIC_WEBSITE_HOST}/support/docs/tas-faq-and-troubleshooting/`} target="_blank" className='rounded border border-gray-600 text-size-12 inline-flex items-center'>
              <span className='py-3 px-8 inline-flex items-center self-stretch bg-black mr-5'>
                <img src="/assets/images/icon/Troubleshooting-white.svg" alt="Troubleshooting" className='inline-block' width={12} />
              </span>
              <span className='py-3 px-8 pl-0'>Troubleshooting Guide</span>
              </a>
              <span className='rounded border border-gray-600 text-size-12 inline-flex items-center ml-5 cursor-pointer' onClick={handleToggle}>
              <span className='py-3 px-8 inline-flex items-center self-stretch bg-black mr-5'>
                <img src="/assets/images/icon/play-video.svg" alt="Troubleshooting" className='inline-block' width={8} />
              </span>
              <span className='py-3 px-8 pl-0'>Video Tutorial</span>
              </span>
          </div>}
        </div>
        <ul style={{height: `${test_connection ? '75vh' : '100%'}`}} className={`${test_connection ? 'designed-scroll overflow-y-scroll' : ''}`}>
          <li className=" p-10 border-b">
            <div
              className={`flex items-center justify-between py-5 rounded-md rounded-b-none text-size-16`}
            >
              <div className="inline-flex items-center">
                <span className={`rounded inline-block arrow__down__icon ${activeStep}`}></span>
                <div>Here’s your Lambdatest Secret Key </div>
              </div>
            </div>
            <div className="w-full p-10 pl-20">
              <div className="flex justify-between">
                <div className="flex items-center rounded-md px-10 text-tas-400 tas_synapse_token_wrapper h-38">
                  {synapse_key ? (
                    <>{synapse_key && <SynapseToken token={synapse_key} />}</>
                  ) : (
                    'No Token found.'
                  )}
                </div>
              </div>
              <span className="block mt-15 text-size-14">
                This key will be required in the next steps to complete the setup.
              </span>
            </div>
          </li>
          <li className="p-10 border-b">
            <div
              className={`flex items-center justify-between py-5 cursor-pointer  rounded-md rounded-b-none bg-gray-60 hover:bg-gray-100`}

            >
              <div className="inline-flex items-center pl-10 text-size-16 font-medium">
                <span
                  className={`cursor-pointer rounded inline-block arrow__down__icon  arrow__down__true`}
                >
                  <img src="/assets/images/arrow_down_gray.svg" alt="..." width="8" />
                </span>
                <div className={`pl-10`}>Step 1/2- Creating a configuration file for self hosted setup</div>
              </div>
            </div>
              <div className="w-full p-10 pl-20 text-size-16 bg-gray-50">
                <div className="pt-10">
                  <span className="text-size-16">
                    Before installation we need to create a file that will be used for configuring
                    test-at-scale.
                  </span>
                  <ul className="list-disc pl-25 mt-15">
                    <li>
                      Open any <span className="font-medium inline-block">Terminal</span> of your
                      choice.
                    </li>
                    <li>
                      Move to your desired directory or you can create a new directory and move into
                      to it.
                    </li>
                    <li>
                      Then download our <span className="font-medium">sample configuration</span>{' '}
                      file using the given command.
                    </li>
                  </ul>
                  <div className="my-15 pl-25 synapse__copy__block">
                    <CopyBlock
                      text={`mkdir ~/test-at-scale
cd ~/test-at-scale`}
                      language="bash"
                      theme={androidstudio}
                      wrapLines
                    />
                  </div>
                  <div className="my-15 pl-25 synapse__copy__block">
                    <CopyBlock
                      text={`curl https://raw.githubusercontent.com/LambdaTest/test-at-scale/main/.sample.synapse.json -o .synapse.json`}
                      language="bash"
                      theme={androidstudio}
                      // wrapLines
                    />
                  </div>
                  <ul className="list-disc pl-25 mt-15">
                    <li>
                      Open the downloaded <span className="font-medium">.synapse.json</span>{' '}
                      configuration file in any editor of your choice. The downloaded sample file
                      will contain values for some parameters already.
                    </li>
                    <li>
                      <span>
                        Add both of the following parameters into your{' '}
                        <span className="font-medium">.synapse.json</span> file:
                      </span>
                      <ol className="list-decimal pl-25 mb-15">
                        <li>
                          <span className="font-medium">LambdaTest Secret Key</span> that you got
                          after login.{' '}
                          <button
                            className="text-blue-400"
                            onClick={(evt) =>
                              evt.target
                                // @ts-ignore
                                ?.closest('.synapse__container__config__parent')
                                ?.scrollIntoView(true)
                            }
                          >
                            Can't find it?
                          </button>
                        </li>
                        <li>
                          <span className="font-medium">Git Token</span> that you have already
                          generated.{' '}
                          <a
                            className="text-blue-400"
                            href={`${process.env.NEXT_PUBLIC_DOC_HOST}/tas-how-to-guides-gh-token/`}
                            target="_blank"
                          >
                            Can't find git tokens?
                          </a>
                        </li>
                        <li>
                          Do not change the predefined{' '}
                          <span className="font-medium">ContainerRegistry</span> settings inside
                          this file
                        </li>
                      </ol>
                    </li>
                  </ul>
                  <div>
                    Other <span className="font-medium">optional</span> parameters such as{' '}
                    <span className="font-medium">Repository Secrets</span> etc that might be
                    required in configuring test-at-scale on your local/self-hosted environment can
                    also be added in this file. You can learn more about the configuration options{' '}
                    <a
                      className="text-blue-400"
                      href={`${process.env.NEXT_PUBLIC_DOC_HOST}/tas-self-hosted-configuration/`}
                      target="_blank"
                    >
                      here
                    </a>
                    .
                  </div>
                </div>
              </div>
          </li>
          <li className="p-10">
            <div
              className={`flex items-center justify-between py-5 cursor-pointer   rounded-md rounded-b-none bg-gray-60 hover:bg-gray-100`}

            >
              <div className="inline-flex items-center pl-10 text-size-16 font-medium">
                <span
                  className={`cursor-pointer rounded inline-block arrow__down__icon  arrow__down__true`}
                >
                  <img src="/assets/images/arrow_down_gray.svg" alt="..." width="8" />
                </span>
                <div className={`pl-10`}>Step 2/2- Installation on Docker</div>
              </div>
            </div>
              <div className="w-full p-10 pl-20 text-size-16 bg-gray-50">
                <div className="pt-10">
                  <div className="font-medium">Prerequisites</div>
                  <ul className="list-disc pl-25 mt-15">
                    <li>
                      <a
                        className="text-blue-400"
                        href={`https://docs.docker.com/get-docker/`}
                        target="_blank"
                      >
                        Docker
                      </a>{' '}
                      and{' '}
                      <a
                        className="text-blue-400"
                        href={`https://docs.docker.com/compose/install/`}
                        target="_blank"
                      >
                        Docker-Compose
                      </a>{' '}
                      (Recommended)
                    </li>
                  </ul>
                  <div className="mt-15 font-medium">Docker Compose</div>
                  <ul className="list-disc pl-25 mt-15">
                    <li>Run the docker application.</li>
                    <li>
                      <span className="font-medium">NOTE:</span> In order to run test-at-scale you
                      require a minimum configuration of 2 CPU cores and 4 GBs of RAM.
                    </li>
                    <li>
                      Execute the following command to ensure that resources usable by Docker are
                      atleast <span className="font-medium">CPU: 2, RAM: 4294967296</span>.
                    </li>
                  </ul>
                  <div className="my-15 synapse__copy__block">
                    <CopyBlock
                      text={`docker info --format "CPU: {{.NCPU}}, RAM: {{.MemTotal}}"`}
                      language="bash"
                      theme={androidstudio}
                      wrapLines
                    />
                  </div>
                  <ul className="list-disc pl-25 mt-15">
                    <li>
                      The <span className="font-medium">.synapse.json</span> configuration file made
                      in{' '}
                      <span
                        className="cursor-pointer text-blue-400"
                        onClick={() =>
                          setActiveStep((activeStep) => (activeStep === '2' ? '' : '2'))
                        }
                      >
                        Step 1
                      </span>{' '}
                      above, will be required before executing the next command.
                    </li>
                    <li>Run the docker compose file using the following command.</li>
                  </ul>
                  <div className="my-15 synapse__copy__block">
                    <CopyBlock
                      text={`curl -L https://raw.githubusercontent.com/LambdaTest/test-at-scale/main/docker-compose.yml -o docker-compose.yml
docker-compose up -d`}
                      language="bash"
                      theme={androidstudio}
                      // wrapLines
                    />
                  </div>
                  <span className="bg-yellow-200 text-black p-10 rounded my-10 block">
                    <b>NOTE:</b> This docker-compose file will pull the latest version of
                    test-at-scale and install on your self hosted environment..
                  </span>
                  <span className="mt-25 block font-medium">Without Docker Compose</span>
                  <p className="mt-10">
                    To get up and running quickly, you can use the following instructions to setup
                    Test at Scale on Self hosted environment without docker-compose.
                  </p>
                  <ul className="list-disc pl-25 mt-15">
                    <li>
                      Create a configuration file using{' '}
                      <span
                        className="cursor-pointer text-blue-400"
                        onClick={() =>
                          setActiveStep((activeStep) => (activeStep === '2' ? '' : '2'))
                        }
                      >
                        these steps.
                      </span>
                    </li>
                    <li>Execute the following command to run Test at Scale docker container.</li>
                  </ul>
                  <div className="my-15 pl-25 synapse__copy__block">
                    <CopyBlock
                      text={`docker network create --internal test-at-scale
docker run --name synapse --restart always \\
    -v /var/run/docker.sock:/var/run/docker.sock \\
    -v /tmp/synapse:/tmp/synapse \\
    -v $\{PWD\}/.synapse.json:/home/synapse/.synapse.json \\
    -v /etc/machine-id:/etc/machine-id \\
    --network=test-at-scale \\
    lambdatest/synapse:latest`}
                      language="bash"
                      theme={androidstudio}
                      wrapLines
                    />
                  </div>
                  <span className="bg-yellow-200 text-black p-10 rounded my-10 block">
                    <b>WARNING:</b> We strongly recommend to use docker-compose while Test at Scale
                    on Self hosted environment.
                  </span>
                </div>
              </div>
          </li>
        </ul>
      </div>
      {test_connection && (
        <div className="tas_synapse_btn_container">
          {synapseConnected && !loading && (
            <div className=" flex justify-between py-10 px-20 bg-green-50 rounded rounded-t-none rounded-r-none  ">
              <div className="text-size-20">Synapse Setup Successful</div>
            </div>
          )}
          {synapseConnectionError && !loading && (
            <div className="  flex justify-between py-10 px-20 bg-yellow-200 rounded rounded-t-none rounded-r-none   text-yellow-800">
              <div className="text-size-20">No Synapse connected!</div>
            </div>
          )}

          <div style={{ position: 'absolute', right: '10px', top: '9px' }}>
            {!synapseConnected && (
              <button
                className={`${
                  synapse_key ? '' : 'relative pointer-events-none opacity-40'
                } border px-20 h-32 rounded text-size-12 transition bg-black text-white border-black inline-flex items-center mr-5 text-center justify-center tracking-wider ${
                  loading ? 'opacity-30' : ''
                }`}
                onClick={testConnection}
              >
                Test Connection
                {loading && <div className="loader ml-15"></div>}
              </button>
            )}
            {synapseConnected && !loading && (
              <button
                className="border px-20 w-135 h-32 rounded text-size-12 transition bg-black text-white border-black inline-flex items-center mr-5 text-center justify-center tracking-wider"
                onClick={onProceed}
              >
                Proceed
              </button>
            )}
          </div>
        </div>
      )}
    </div>
    {toggleModal && (
        <div className="modal__wrapper modal__wrapper modal__wrapper__opacity z-10">
          <div className="modal__overlay"></div>
          <div className="modal__dialog" style={{ maxWidth: '800px' }}>
            <div className="bg-white mx-auto rounded">
              <Text className="pt-20 pb-5 px-10 text-size-20 text-black flex justify-between">
                <span className='ml-5'>Video Walkthrough</span>
                <Image
                  className="mr-18 cursor-pointer"
                  onClick={handleToggle}
                  src="/assets/images/icon/cross.svg"
                />
              </Text>
              <div className="flex-1 p-15">
                <video width="100%" controls autoPlay>
                  <source src="/assets/media/SynapseSetup.mp4" type="video/mp4" />
                Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
