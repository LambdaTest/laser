import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import _ from 'underscore';

import useIsApiLoadComplete from 'hooks/useIsApiLoadComplete';

import {
  addFTMConfig,
  fetchBranchesListOnPreboarding,
  fetchFTMConfigList,
  unmountRepoSettings,
  updateFTMConfig,
} from 'redux/actions/repoSettingsAction';

import FTMConfigAdd from '../components/FTMConfigAdd';
import FTMConfigList from '../components/FTMConfigList';
import Image from 'components/Tags/Image';
import Text from 'components/Tags/Text';

const ConfigTypes = [
  {
    label: 'Pre Merge',
    value: 'premerge',
  },
  {
    label: 'Post Merge',
    value: 'postmerge',
  },
];

const FTMStrategies = [
  {
    label: 'Running n times',
    value: 'running_x_times',
  },
];

export default function FTMSettings() {
  const router = useRouter();
  const { repo }: any = router.query;

  const dispatch = useDispatch();
  const { repoSettingsData }: any = useSelector((state) => state, _.isEqual);
  const {
    activeFTMConfigList,
    ftmConfigList,
    isFTMConfigAddLoading,
    isFTMConfigLoading,
    isFTMConfigUpdateLoading,
    isPreBranchesLoading,
    preBranches,
    preBranchesNextCursor,
  } = repoSettingsData;

  const configAddComplete = useIsApiLoadComplete(isFTMConfigAddLoading);
  const configUpdateComplete = useIsApiLoadComplete(isFTMConfigUpdateLoading);

  const [showAddConfig, setShowAddConfig] = useState(false);

  const toggleAddConfig = () => {
    setShowAddConfig((showAddConfig) => !showAddConfig);
  };

  const onAddEditConfig = (config: any) => {
    const existingConfig = ftmConfigList.find(
      (item: any) => item.branch === config.branch && item.config_type === config.config_type
    );
    if (existingConfig) {
      dispatch(
        updateFTMConfig({
          ...existingConfig,
          ...config,
          is_active: true,
        })
      );
    } else {
      dispatch(addFTMConfig(config));
    }
  };

  const onDeleteConfig = (config: any) => {
    dispatch(
      updateFTMConfig({
        ...config,
        is_active: false,
      })
    );
  };

  const fetchBranches = () => {
    dispatch(fetchBranchesListOnPreboarding({ repo, next: preBranchesNextCursor }));
  };

  useEffect(() => {
    if (repo) {
      dispatch(fetchFTMConfigList({ repo }));
    }
  }, [repo]);

  useEffect(() => {
    if (repo && (configAddComplete || configUpdateComplete)) {
      setShowAddConfig(false);
      dispatch(fetchFTMConfigList({ repo }));
    }
  }, [configAddComplete, configUpdateComplete, repo]);

  useEffect(() => {
    return () => {
      dispatch(unmountRepoSettings());
    };
  }, []);

  const [toggleModal, setToggleModal] = useState(false);

  const handleToggle = () => {
    setToggleModal(!toggleModal);
  };

  return (
    <div className="tas__section__postmerge-strategy" id="tas__section__ftm-strategy">
      <div className="bg-white mt-20 border-b rounded-md rounded-b-none py-12 px-20 flex justify-between items-center">
        <div className="flex h-32 items-center text-size-14 text-gray-900"><span className='inline-flex items-center'>FTM Configuration <img src="/assets/images/icon/info.svg" alt='info' width={12} className="inline-block ml-3 cursor-pointer" onClick={handleToggle} /></span></div>
        <button
          className="border px-20 py-5 rounded text-size-14 transition bg-black text-white border-black tracking-widest inline-flex items-center h-32"
          onClick={toggleAddConfig}
        >
          Add
        </button>
      </div>
      {!!(showAddConfig && preBranches?.length && FTMStrategies?.length) && (
        <div className="bg-white mb-5">
          <FTMConfigAdd
            branches={preBranches}
            configTypes={ConfigTypes}
            fetchBranches={fetchBranches}
            hasMoreBranchesData={preBranchesNextCursor}
            isBranchesLoading={isPreBranchesLoading}
            loading={isFTMConfigAddLoading || isFTMConfigUpdateLoading}
            onApply={onAddEditConfig}
            onCancel={toggleAddConfig}
            repo={repo}
            strategies={FTMStrategies}
          />
        </div>
      )}
      <div className="bg-white">
        <FTMConfigList
          configTypes={ConfigTypes}
          data={activeFTMConfigList}
          deleteConfig={onDeleteConfig}
          editConfig={onAddEditConfig}
          loading={isFTMConfigLoading && !activeFTMConfigList.length}
          repo={repo}
          showAddConfig={showAddConfig}
          strategies={FTMStrategies}
        />
      </div>
      {toggleModal && (
        <div className="modal__wrapper modal__wrapper modal__wrapper__opacity z-10">
          <div className="modal__overlay"></div>
          <div className="modal__dialog" style={{ maxWidth: '800px' }}>
            <div className="bg-white mx-auto rounded">
              <Text className="pt-20 pb-15 px-10 text-size-20 text-black flex justify-between items-center">
                <span><Text className='text-size-20 text-black pl-10'>Flaky Test Management</Text></span>
                <Image
                  className="mr-18 cursor-pointer"
                  onClick={handleToggle}
                  src="/assets/images/icon/cross.svg"
                />
              </Text>
              <hr />
              <Text className="pt-20 pb-5 px-20 text-size-20 text-black mb-15 designed-scroll overflow-y-scroll" style={{height: '50vh'}}>
                <Text className="mb-20">
                  <Text className='text-size-14 text-tas-500 mb-10'>What is a flaky test?</Text>
                  <Text className='text-size-14 text-tas-400 mb-10'>A test that passes and fails even though no changes were made in the codebase is referred as a flaky test. </Text>
                </Text>
                <Text className="mb-20">
                  <Text className='text-size-14 text-tas-500 mb-10'>What is a TAS FTM pipelined?</Text>
                  <Text className='text-size-14 text-tas-400 mb-10'>The TAS FTM pipeline can detect, flag, and track flaky tests in your code base before they reach your CD pipeline.  </Text>
                  <Text className='text-size-14 text-tas-400 mb-10'>Whenever a test case is impacted by your code changes, it undergoes the FTM pipeline where it is executed multiple times (as configured by you) to make sure it's not flaky. </Text>
                  <Text className='text-size-14 text-tas-400 mb-10'>Only the tests that are marked as stable by the FTM pipeline are considered for execution in the consecutive runs. Tests that are found flaky can be quarantined, so that they are not executed in the subsequent runs. This helps your team to identify failed builds clearly, without getting confused with build failures caused by flaky tests. </Text>
                </Text>
                <Text className="mb-20">
                  <Text className='text-size-14 text-tas-500 mb-10'>FTM Configuration</Text>
                  <Text className='text-size-14 text-tas-400 mb-10'>In order to configure FTM pipeline you need to set following parameters : </Text>
                  <div className='my-20'>
                    <table className='ftm_info_modal_table text-size-14'>
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>Description</th>
                          <th>Default Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Activate FTM on</td>
                          <td>Name of branch on which you want to configure FTM </td>
                          <td>All Branches</td>
                        </tr>
                        <tr>
                          <td>Configuration Type</td>
                          <td>Whether you want to configure FTM on a pre-merge (when a PR is raised) job or a post-merge (when a PR is merged) job.</td>
                          <td>Pre-Merge</td>
                        </tr>
                        <tr>
                          <td>Consecutive Runs</td>
                          <td>The number of times you want the test to be executed</td>
                          <td>7</td>
                        </tr>
                        <tr>
                          <td>Transitions Threshold</td>
                          <td>The threshold of transitions after which a test case should be considered as flaky</td>
                          <td>1</td>
                        </tr>
                        <tr>
                          <td>Auto quarantine</td>
                          <td>Whether the test case that is found as flaky should be quarantined automatically or not?</td>
                          <td>
                            <span className="block mb-15">For Pre-Merge → Disabled</span>
                            <span className="block mb-15">For Post-Merge → Enabled</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <Text className='text-size-14 text-tas-500 mb-10'>Example</Text>
                  <Text className='text-size-14 text-tas-400 mb-10'>Let’s assume that you setup a FTM config as follows: </Text>
                    <ul className="list-disc text-size-14 pl-15 pt-10 leading-height-26 mb-20">
                      <li>Activate FTM on → Staging</li>
                      <li>
                        Configuration Type → Post-Merge
                      </li>
                      <li>
                       Consecutive Runs → 20
                      </li>
                      <li>Transitions Threshold → 2</li>
                      <li>Auto Quarantine → Enabled</li>
                    </ul>
                    <Text className='text-size-14 text-tas-400 mb-10'>Let’s also assume that there are a total of 1000 tests in your codebase. As per the above configuration, whenever a PR or Commit is merged on your Staging branch it would initiate a TAS job. </Text>
                    <Text className='text-size-14 text-tas-400 mb-10'>A TAS job after passing the <b className='text-black'>discovery phase</b> and the <b className='text-black'>execution phase</b>, will initiate a FTM phase (a FTM task) within that Job. Assuming that in your latest PR only 50/1000 tests were impacted and they all passed the <b className='text-black'>execution phase</b>, now will enter the <b className='text-black'>FTM phase.</b></Text>
                    <Text className='text-size-14 text-tas-400 mb-10'>
                      Those 50 tests will be executed consecutively 20 times. If any of those tests changes its state from pass to fail or vice versa, it would be considered as a transition. If the number of transitions for a particular test crosses the set threshold, it would be marked as a FLAKY test. Also give the <i>Auto Quarantine → Enabled</i>, the test case will also be quarantined automatically.
                    </Text>
                    <Text className='text-size-14 text-tas-400 mb-10'>
                      If you have any questions, feel free to contact us on our <a href="mailto:hello.tas@lambdatest.com" title="mailto:hello.tas@lambdatest.com" className='text-black'>email</a>.
                    </Text>
                </Text>
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
