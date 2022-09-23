import { useState, useRef, useEffect, ChangeEvent } from 'react';

import { getCookieOrgName } from '../../../helpers/genericHelpers';

import Dropdown from 'components/Dropdown';
import DropdownAsync from 'components/DropdownAsync';
import Image from 'components/Tags/Image';
import Switch from 'components/Switch';
import Text from 'components/Tags/Text';

import validateConfig from '../utils/validateFTMSetting';

const FTMConfigAdd = ({
  branches = [],
  configTypes = [],
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
  const [activeConfig, setActiveConfig] = useState({
    algoName: strategies[0],
    autoQuarantine: false,
    shuffle: false,
    branch: { label: 'All Branches', value: '*' },
    configType: configTypes[0],
    consecutive_runs: 7,
    threshold: 1,
  });

  const sectionRef = useRef<HTMLDivElement>(null);

  const isValidConfig = validateConfig({
    ...activeConfig,
    algo_name: activeConfig.algoName,
  });
  const isApplyDisabled = loading || !isValidConfig;

  const onInputChange = (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
    onChange(key, e.target.value);
  };

  const onSwitchChange = (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
    onChange(key, e.target.checked);
  };

  const onChange = (field: string, value: any) => {
    setActiveConfig((activeConfig) => {
      const newConfig = { ...activeConfig, [field]: value };

      if (field === 'configType') {
        newConfig.autoQuarantine = value?.value === 'premerge' ? false : true;
      }

      return newConfig;
    });
  };

  const onSubmit = () => {
    const formattedConfig = {
      algo_name: activeConfig.algoName.value,
      shuffle: activeConfig.shuffle,
      auto_quarantine: activeConfig.autoQuarantine,
      branch: activeConfig.branch.value,
      config_type: activeConfig.configType.value,
      consecutive_runs: Number(activeConfig.consecutive_runs),
      is_active: true,
      org: getCookieOrgName(),
      repo: repo,
      threshold: Number(activeConfig.threshold),
    };
    onApply(formattedConfig);
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
            <span>Add FTM Configuration</span>
            <Image
              className="ml-18 px-10 cursor-pointer"
              onClick={onCancel}
              src="/assets/images/icon/cross.svg"
            />
          </Text>
          <div className="p-20">
            <div className="flex w-full items-center text-size-14 mb-10">
              <div className="flex-1 pr-10">Activate FTM on</div>
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
                      selectedOption={activeConfig.branch}
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
            <div className="flex w-full items-center text-size-14 mb-10">
              <div className="flex-1 pr-10">Configuration Type</div>
              <div className="flex width-200">
                {mounted && sectionRef.current && (
                  <div className="text-ellipsis items-center justify-center flex-1">
                    <Dropdown
                      onClick={(_value, option) => onChange('configType', option)}
                      options={configTypes}
                      getPopupContainer={() => sectionRef.current as HTMLElement}
                      selectedOption={activeConfig.configType}
                      toggleStyles={{
                        background: '#fff',
                        fontSize: 14,
                        height: '32px',
                        minWidth: '100%',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex w-full items-center text-size-14 mb-10">
              <div className="flex-1 pr-10">
                Consecutive Runs <span className="text-tas-400 text-size-12">(max 50)</span>
              </div>
              <div className="flex width-200">
                <div className="w-full">
                  <input
                    className="border border-gray-200 px-10 py-10 text-size-14 h-32 block rounded w-full"
                    min="1"
                    max="50"
                    onChange={onInputChange('consecutive_runs')}
                    type="number"
                    value={activeConfig.consecutive_runs}
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full items-center text-size-14 mb-16">
              <div className="flex-1 pr-10">
                Transitions Threshold <span className="text-tas-400 text-size-12">(max 200)</span>
              </div>
              <div className="flex width-200">
                <div className="w-full">
                  <input
                    className="border border-gray-200 px-10 py-10 text-size-14 h-32 block rounded w-full"
                    min="1"
                    max="200"
                    onChange={onInputChange('threshold')}
                    type="number"
                    value={activeConfig.threshold}
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full items-center text-size-14 mb-20">
              <div className="flex-1 pr-10">Auto quarantine</div>
              <div className="flex width-200 items-start">
                <div className="flex items-center w-full text-left">
                  <Switch
                    id="add_toggleAutoQuarantine"
                    onChange={onSwitchChange('autoQuarantine')}
                    value={!!activeConfig.autoQuarantine}
                    wrapperClass={'mr-8'}
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full items-center text-size-14 mb-10">
              <div className="flex-1 pr-10">Shuffle</div>
              <div className="flex width-200 items-start">
                <div className="flex items-center w-full text-left">
                  <Switch
                    id="add_toggleShuffle"
                    onChange={onSwitchChange('shuffle')}
                    value={!!activeConfig.shuffle}
                    wrapperClass={'mr-8'}
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

export default FTMConfigAdd;
