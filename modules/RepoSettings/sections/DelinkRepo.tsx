import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import _ from 'underscore';

import useIsApiLoadComplete from 'hooks/useIsApiLoadComplete';

import { delinkRepo, unmountRepoSettings } from 'redux/actions/repoSettingsAction';
import Image from 'components/Tags/Image';
import Text from 'components/Tags/Text';

const DelinkRepo = () => {
  const router = useRouter();
  const { repo } = router.query;

  const dispatch = useDispatch();
  const { repoSettingsData, persistData }: any = useSelector((state) => state, _.isEqual);
  const { isDelinkRepoLoading } = repoSettingsData;
  const { currentOrg }: any = persistData;

  const repoDelinkComplete = useIsApiLoadComplete(isDelinkRepoLoading);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const toggleConfirmModal = () => {
    setShowConfirmModal((showing) => !showing);
  };

  const onDelinkRepo = () => {
    dispatch(delinkRepo({ repo }));
  };

  useEffect(() => {
    if (repoDelinkComplete) {
      router.push(`/${currentOrg.git_provider}/${currentOrg.name}/repositories`);
    }
  }, [repoDelinkComplete, currentOrg]);

  useEffect(() => {
    return () => {
      dispatch(unmountRepoSettings());
    };
  }, []);

  return (
    <div className="tas__section__delink-repo mt-20">
      <div className="bg-white border-b rounded-md rounded-b-none py-12 px-20 flex justify-between items-center">
        <div className="flex h-32 items-center text-size-14 text-gray-900">Remove This Project</div>
      </div>
      <div className="bg-white py-12 px-20 flex justify-between items-center">
        <div className="text-size-16">
          Once you remove a project, you will no longer be able to run jobs on it. Please be
          certain.
        </div>
        <div>
          <button
            className={`px-20 py-5 rounded text-size-14 transition bg-error text-white tracking-widest inline-flex items-center ${
              isDelinkRepoLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={toggleConfirmModal}
            disabled={isDelinkRepoLoading}
          >
            Delete {isDelinkRepoLoading && <div className="loader ml-10">Loading...</div>}
          </button>
        </div>
      </div>
      {showConfirmModal && (
        <div className="modal__wrapper modal__wrapper modal__wrapper__opacity z-index-modal">
          <div className="modal__overlay"></div>
          <div className="modal__dialog" style={{ maxWidth: '500px' }}>
            <div className="bg-white mx-auto rounded">
              <Text className="p-20 pr-10 text-size-20 text-black flex justify-between border-b">
                <span>Are you sure?</span>
                <Image
                  className="ml-18 px-10 cursor-pointer"
                  onClick={toggleConfirmModal}
                  src="/assets/images/icon/cross.svg"
                />
              </Text>
              <div className="p-20">
                <div>
                  Once you remove a project, you will no longer be able to run jobs on it. Please be
                  certain.
                </div>
              </div>
              <div className="flex justify-end border-t p-20">
                <button
                  className="border px-20 py-5 rounded text-size-14 transition text-black border-black tracking-widest inline-flex items-center mr-10"
                  onClick={toggleConfirmModal}
                >
                  Cancel
                </button>
                <button
                  className={`px-20 py-5 rounded text-size-14 transition bg-error text-white tracking-widest inline-flex items-center ${
                    isDelinkRepoLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isDelinkRepoLoading}
                  onClick={onDelinkRepo}
                >
                  Delete {isDelinkRepoLoading && <div className="loader ml-10">Loading...</div>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DelinkRepo;
