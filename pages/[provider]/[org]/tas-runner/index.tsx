import React, { useEffect, useState } from 'react'
import Layout from 'components/Layout'
import { NextPage } from 'next'
import Text from 'components/Tags/Text'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { httpPut } from 'redux/httpclient'
import { persistCurrentOrg } from 'redux/actions/persistAction'
import { setUserActiveState } from 'redux/actions/settingsAction';
import { logAmplitude } from 'helpers/genericHelpers'

const TasRunner: NextPage = () => {
    const state = useSelector((state) => state);
    const router = useRouter()
    const { provider, org} = router.query;
    const {persistData}:any = state;
    const {currentOrg}:any = persistData;
    const [runnerType, setRunnerType] = useState('cloud-runner');
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    const handleSetupType = (setup:any) => {
        setRunnerType(setup);
        logAmplitude('tas_onboarding_mode_select', {'User selected mode': setup})
    }

    const handleProceed = () => {
        withSynapse();
    }

    const withSynapse = async () => {
        if(loading) {
            return;
        }
        setLoading(true)
        await httpPut(`${process.env.NEXT_PUBLIC_API_BASE_URL}/org/config`,
        {
            org: currentOrg.name,
            runner_type: runnerType
        }
        ).then((data) => {
            let _currentOrg = currentOrg;
            _currentOrg.synapse_key = data.token;
            _currentOrg.runner_type = runnerType;
            dispatch(persistCurrentOrg(_currentOrg));
            if(runnerType === 'cloud-runner') {
                router.push(`/${provider}/${org}/repositories`);
            } else {
                router.push(`/${provider}/${org}/synapse-setup/`);
            }
            setLoading(false)
        }).catch((error) => {
            console.log("error", error)
            setLoading(false)
        })
    }

    useEffect(() => {
      if (org && provider) {
        dispatch(setUserActiveState({ org, provider }));
      }
    }, [org, provider]);

    useEffect(() => {
        if(!currentOrg && provider) {
            router.push(`/${provider}/select-org`);
        }
    }, [provider])
    useEffect(() => {
        if(currentOrg && currentOrg.name && currentOrg.runner_type && currentOrg.synapse_key) {
            router.push(`/${currentOrg.git_provider}/${currentOrg.name}/repositories`);
        }
    }, [currentOrg && currentOrg.name])

    return (
        <Layout title="TAS: Runner">
             <div className="modal__wrapper">
                <div className="modal__overlay"></div>
                <div className="modal__dialog">
                <div className="w-6/12 mx-auto">
                    {/* <div className="text-center mb-30">
                        <span className="lt-dropdown-toggle cursor-pointer items-center inline-flex justify-center w-60 h-60 p-5 bg-white rounded-full shadow overflow-hidden">
                            {currentOrg && currentOrg.avatar ? <img src={`${currentOrg.avatar}`}  alt="logo" width="30" className="menu__item__img pointer-events-none rounded-full" /> : <img src={"/assets/images/icon/user.svg"}  alt="logo" width="30" className="menu__item__img pointer-events-none rounded-full" />}
                        </span>
                        <p>{currentOrg && currentOrg.name} </p>
                    </div> */}
                    <div className="bg-white shadow-md rounded-lg">
                        <Text className="py-24 px-27 text-size-20 text-gray-900 border-b border-gray-150">Choose which mode you want to use</Text>
                        <div className="py-15">

                            <Text className=" py-20 px-32 text-size-16 text-gray-600 w-full">
                                <Text
                                    className={`rounded border p-25 font-bold text-tas-500 tracking-wider hover:bg-gray-100 cursor-pointer ${runnerType == 'cloud-runner' && 'bg-gray-100'}`}
                                 onClick={() => handleSetupType('cloud-runner')}>
                                    <div className="clearfix">
                                        <span>TAS Cloud</span>
                                        {runnerType == 'cloud-runner' && <span className="w-12 h-12 rounded-full inline-block bg-green-300 float-right -mr-12 -mt-12">
                                        </span>}
                                    </div>
                                    <p className="flex font-normal leading-height-30 mt-10">
                                        Get started right away on our cloud.
                                        No technical setup required.
                                    </p>
                                </Text>
                                <Text className={`mt-20 rounded border p-25 font-bold text-tas-500 tracking-wider hover:bg-gray-100 cursor-pointer ${runnerType == 'self-hosted' && 'bg-gray-100'}`}  onClick={() => handleSetupType('self-hosted')}>
                                    <div className="clearfix">
                                        <span>TAS Self Managed</span>
                                        {runnerType == 'self-hosted' && <span className="w-12 h-12 rounded-full inline-block bg-green-300 float-right -mr-12 -mt-12">
                                        </span>}
                                    </div>
                                    <p className="font-normal leading-height-30 mt-10">
                                        Setup TAS on your own workstation or cloud.
                                        Basic installation required. <a href="https://www.lambdatest.com/support/docs/tas-self-hosted-overview/" target='_blank' className='text-blue-700'>Learn more</a>
                                    </p>
                                </Text>
                            </Text>
                        </div>
                    </div>
                    <div className="text-right">
                        <button onClick={handleProceed} className={`relative border px-20 w-135 h-38 rounded text-size-14 transition bg-black text-white border-black inline-flex items-center   text-center justify-center tracking-wider mt-20 ${loading ? 'pointer-events-none opacity-30' : ''}`}>
                            Next
                            {loading && <div className="loader ml-15" style={{position: 'absolute', right: '25px'}}></div>}
                        </button>
                    </div>
                </div>
                </div>
            </div>
        </Layout>
    )
}

export default TasRunner