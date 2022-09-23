import React, { useEffect } from 'react';
import Layout from 'components/Layout';
import { NextPage } from 'next';
import Text from 'components/Tags/Text';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { setUserActiveState } from 'redux/actions/settingsAction';

const TasRunner: NextPage = () => {
  const router = useRouter();

  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const { provider, org } = router.query;
  const { persistData }: any = state;
  const { currentOrg }: any = persistData;

  const handleProceed = () => {
    router.push(`/${provider}/${org}/repositories`);
  };

  useEffect(() => {
    if (org && provider) {
      dispatch(setUserActiveState({ org, provider }));
    }
  }, [org, provider]);

  useEffect(() => {
    if (!currentOrg && provider) {
      router.push(`/${provider}/select-org`);
    }
  }, [provider]);

  useEffect(() => {
    if (currentOrg && (!currentOrg.runner_type || !currentOrg.synapse_key)) {
      router.push(`/${currentOrg.git_provider}/${currentOrg.name}/tas-runner`);
    }
  }, [currentOrg && currentOrg.name]);

  return (
    <Layout title="TAS: Runner Info">
      <div className="modal__wrapper">
        <div className="modal__overlay"></div>
        <div className="modal__dialog">
          <div className="w-6/12 mx-auto">
            <div className="bg-white shadow-md rounded-lg">
              <div className="p-40 px-45 pt-10 tracking-wide">
                <div className="w-full flex justify-items-center p-40">
                  <img
                    src={
                      currentOrg?.runner_type === 'cloud-runner'
                        ? '/assets/images/synapse-Self-Hosted.png'
                        : '/assets/images/synapse-Cloud.png'
                    }
                    width="167"
                    className="m-auto"
                  />
                </div>
                <Text className="text-size-18 text-black font-bold  w-full mb-10">Welcome {currentOrg?.name},</Text>
                <Text className="text-size-16 text-gray-600 w-full">
                  Your organisation <strong>{currentOrg?.name}</strong> has been already configured
                  for{' '}
                  <strong>
                    {currentOrg?.runner_type === 'cloud-runner'
                      ? ' TAS Cloud mode '
                      : ' Self hosted mode '}
                  </strong>
                  by your team members already on TAS.
                </Text>
              </div>
            </div>
            <div className="text-right">
              <button
                onClick={handleProceed}
                className={`relative border px-20 w-135 h-38 rounded text-size-14 transition bg-black text-white border-black inline-flex items-center   text-center justify-center tracking-wider mt-20`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TasRunner;
