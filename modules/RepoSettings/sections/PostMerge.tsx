import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import _ from 'underscore';

import useIsApiLoadComplete from 'hooks/useIsApiLoadComplete';

import {
  addPostmergeConfig,
  fetchBranchesListOnPreboarding,
  fetchPostmergeConfigList,
  unmountRepoSettings,
  updatePostmergeConfig,
} from 'redux/actions/repoSettingsAction';

import PostMergeAdd from '../components/PostMergeAdd';
import PostMergeList from '../components/PostMergeList';

const PostmergeStrategies = [
  {
    label: 'After every nth commit',
    value: 'after_n_commits',
  },
];

const PostMerge = () => {
  const router = useRouter();
  const { repo } = router.query;

  const dispatch = useDispatch();
  const { repoSettingsData }: any = useSelector((state) => state, _.isEqual);
  const {
    activePostmergeConfigList,
    isPostmergeConfigAddLoading,
    isPostmergeConfigLoading,
    isPostmergeConfigUpdateLoading,
    isPreBranchesLoading,
    postmergeConfigList,
    preBranches,
    preBranchesNextCursor,
  } = repoSettingsData;

  const configAddComplete = useIsApiLoadComplete(isPostmergeConfigAddLoading);
  const configUpdateComplete = useIsApiLoadComplete(isPostmergeConfigUpdateLoading);

  const [showAddStrategy, setShowAddStrategy] = useState(false);

  const toggleAddStrategy = () => {
    setShowAddStrategy((strategy) => !strategy);
  };

  const onAddEditStrategy = (strategy: any) => {
    const existingStrategy = postmergeConfigList.find(
      (item: any) => item.branch === strategy.branch
    );

    if (existingStrategy) {
      dispatch(
        updatePostmergeConfig({
          ...existingStrategy,
          ...strategy,
          is_active: true,
        })
      );
    } else {
      dispatch(addPostmergeConfig(strategy));
    }
  };

  const onDeleteStrategy = (strategy: any) => {
    dispatch(
      updatePostmergeConfig({
        ...strategy,
        is_active: false,
      })
    );
  };

  const fetchBranches = () => {
    dispatch(fetchBranchesListOnPreboarding({ repo, next: preBranchesNextCursor }));
  };

  useEffect(() => {
    if (repo) {
      dispatch(fetchPostmergeConfigList({ repo }));
    }
  }, [repo]);

  useEffect(() => {
    if (repo && (configAddComplete || configUpdateComplete)) {
      setShowAddStrategy(false);
      dispatch(fetchPostmergeConfigList({ repo }));
    }
  }, [configAddComplete, configUpdateComplete, repo]);

  useEffect(() => {
    return () => {
      dispatch(unmountRepoSettings());
    };
  }, []);

  return (
    <div className="tas__section__postmerge-strategy">
      <div className="bg-white border-b rounded-md rounded-b-none py-12 px-20 flex justify-between items-center">
        <div className="flex h-32 items-center text-size-14 text-gray-900">
          Post Merge Strategies
        </div>
        <button
          onClick={toggleAddStrategy}
          className="border px-20 py-5 rounded text-size-14 transition bg-black text-white border-black tracking-widest inline-flex items-center h-32"
        >
          Add
        </button>
      </div>
      {!!(showAddStrategy && preBranches?.length && PostmergeStrategies?.length) && (
        <div className="bg-white mb-5">
          <PostMergeAdd
            branches={preBranches}
            fetchBranches={fetchBranches}
            hasMoreBranchesData={preBranchesNextCursor}
            isBranchesLoading={isPreBranchesLoading}
            loading={isPostmergeConfigAddLoading || isPostmergeConfigUpdateLoading}
            onApply={onAddEditStrategy}
            onCancel={toggleAddStrategy}
            repo={repo}
            strategies={PostmergeStrategies}
          />
        </div>
      )}
      <div className="bg-white">
        <PostMergeList
          data={activePostmergeConfigList}
          deleteStrategy={onDeleteStrategy}
          editStrategy={onAddEditStrategy}
          loading={isPostmergeConfigLoading && !activePostmergeConfigList.length}
          showAddStrategy={showAddStrategy}
          strategies={PostmergeStrategies}
        />
      </div>
    </div>
  );
};

export default PostMerge;
