import { useState, useRef, useEffect } from 'react';

import { getCookieOrgName } from '../../../helpers/genericHelpers';

import validateStrategy from '../utils/validateStrategy';

import DropdownAsync from 'components/DropdownAsync';
import Image from 'components/Tags/Image';
import Text from 'components/Tags/Text';

const PostMergeAdd = ({
  branches = [],
  fetchBranches,
  hasMoreBranchesData,
  isBranchesLoading,
  loading = true,
  onApply,
  onCancel,
  repo = '',
  strategies = [],
}: any) => {
  const [mounted, setMounted] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState({
    branch: { label: 'All Branches', value: '*' },
    strategyName: strategies[0],
    threshold: 1,
  });

  const sectionRef = useRef<HTMLDivElement>(null);

  const isValidStrategy = validateStrategy({
    ...activeStrategy,
    strategy_name: activeStrategy.strategyName,
  });
  const isApplyDisabled = loading || !isValidStrategy;

  const onChange = (field: string, value: any) => {
    setActiveStrategy((activeStrategy) => ({
      ...activeStrategy,
      [field]: value,
    }));
  };

  const onSubmit = () => {
    const formattedStrategy = {
      branch: activeStrategy.branch.value,
      is_active: true,
      org: getCookieOrgName(),
      repo: repo,
      strategy_name: activeStrategy.strategyName.value,
      threshold: String(activeStrategy.threshold),
    };
    onApply(formattedStrategy);
  };

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, [mounted]);

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div
      className="modal__wrapper modal__wrapper modal__wrapper__opacity z-index-modal"
      ref={sectionRef}
    >
      <div className="modal__overlay"></div>
      <div className="modal__dialog" style={{ maxWidth: '500px' }}>
        <div className="bg-white mx-auto rounded">
          <Text className="p-20 pr-10 text-size-20 text-black flex justify-between border-b">
            <span>Add Post Merge Strategy</span>
            <Image
              className="ml-18 px-10 cursor-pointer"
              onClick={onCancel}
              src="/assets/images/icon/cross.svg"
            />
          </Text>
          <div className="p-20">
            <div className="flex w-full items-center text-size-14 mb-10">
              <div className="flex-1 pr-10">Activate post-merge on</div>
              <div className="flex width-200">
                {mounted && sectionRef.current && (
                  <div className="text-ellipsis items-center justify-center flex-1">
                    <DropdownAsync
                      disabled={isBranchesLoading}
                      getData={fetchBranches}
                      hasMoreData={hasMoreBranchesData}
                      loading={isBranchesLoading}
                      onClick={(_value, option) => onChange('branch', option)}
                      options={branches}
                      getPopupContainer={() => sectionRef.current as HTMLElement}
                      prefix={<img src="/assets/images/icon/branch.svg" alt="..." width="10" />}
                      selectedOption={activeStrategy.branch}
                      toggleStyles={{
                        background: '#fff',
                        fontSize: 14,
                        height: '32px',
                        minWidth: '100%',
                      }}
                      showSearch
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex w-full items-center text-size-14 mb-15">
              <div className="flex-1 pr-10">Initiate a post-merge job for every</div>
              <div className="flex width-200">
                <div className="w-full">
                  <input
                    className="border border-gray-200 px-10 py-10 text-size-14 h-32 block rounded w-full"
                    min="1"
                    onChange={(e) => onChange('threshold', e.target.value)}
                    type="number"
                    value={activeStrategy.threshold}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end border-t p-20">
            <button
              className="border px-20 py-5 rounded text-size-14 transition text-black border-black tracking-widest inline-flex items-center mr-10"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className={`border px-20 py-5 rounded text-size-14 transition bg-black text-white border-black tracking-widest inline-flex items-center ${
                isApplyDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isApplyDisabled}
              onClick={onSubmit}
            >
              Add {loading && <div className="loader ml-10">Loading...</div>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostMergeAdd;
