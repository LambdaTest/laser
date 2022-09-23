import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSynapseCount } from 'redux/actions/settingsAction';

export default function ActiveSynapses() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { persistData, settingsData }: any = state;
  const { synapseCountDataLoading: loading, synapseCountData: data } = settingsData;
  const { currentOrg }: any = persistData;

  const router = useRouter();
  const { provider, org } = router.query;

  const getSynapseList = async () => {
    dispatch(
      fetchSynapseCount({
        org: org,
        git_provider: provider,
      })
    );
  };

  const navigateTo = () => {
    if (!loading) {
      if (data && data.connected > 0) {
        router.push(`/${provider}/${org}/synapse-list/`);
      } else {
        router.push(`/${provider}/${org}/synapse-config/`);
      }
    }
  };

  useEffect(() => {
    if (
      provider &&
      org &&
      currentOrg &&
      currentOrg.name === org &&
      currentOrg.runner_type === 'self-hosted'
    ) {
      getSynapseList();
    }
  }, [org, provider]);

  const isSynapseMode =
    currentOrg && currentOrg.name === org && currentOrg.runner_type === 'self-hosted';

  if (!isSynapseMode) {
    return null;
  }

  if (!loading && data.connected == 0) {
    return (
      <div
        className="h-32 inline-flex items-center border border-gray-20 bg-white text-size-12 rounded cursor-pointer p-4 pl-8"
        onClick={navigateTo}
      >
        <span
          className={`w-4 h-4 rounded-full inline-block mr-8 tas-animate-synapse-configure bg-gray-30`}
        ></span>
        <span className="text-black inline-flex items-center">Configure Synapse</span>
        <span className="inline-flex justify-center items-center bg-gray-30 mm24 ml-8 h-20">
          <img src="/assets/images/icon/icon-Plus-Black.svg" width="20" />
        </span>
      </div>
    );
  }

  return (
    <>
      {currentOrg && currentOrg.name === org && currentOrg.runner_type === 'self-hosted' && (
        <div
          className="h-32 inline-flex items-center border border-gray-20 bg-white text-size-12 rounded cursor-pointer p-4 pl-8"
          onClick={navigateTo}
        >
          <span className="text-black inline-flex items-center">
            <span
              className={`w-4 h-4 rounded-full inline-block mr-8 ${
                loading ? 'bg-gray-30' : data && data.connected > 0 ? 'bg-green-600' : 'bg-red-600'
              }`}
            ></span>
            <span>Synapse</span>
          </span>
          <span className="inline-flex justify-center items-center bg-gray-30 mm24 ml-8 h-20 text-black">
            {data?.connected && !loading ? data.connected : '-'}
          </span>
        </div>
      )}
    </>
  );
}
