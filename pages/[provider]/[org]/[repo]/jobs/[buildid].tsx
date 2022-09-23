import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cancelAxiosRequest, httpGet } from 'redux/httpclient';

import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import _ from 'underscore';

import {
  fetchBuildTasks,
  fetchCurrentBuild,
  fetchTimeSaved,
  unmountBuildLogs,
  unmountBuildMetrics,
  unmountBuildTests,
} from 'redux/actions/buildAction';
import { statusFound } from 'redux/helper';
import {
  clipText,
  getCookieGitProvider,
  getCookieOrgName,
  getCookieTasRepoBranch,
} from 'helpers/genericHelpers';

import BuildMetrics from 'modules/Builds/sections/BuildMetrics';
import BuildSummary from 'modules/Builds/sections/BuildSummary';
import BuildTasksList from 'modules/Builds/sections/BuildTasksList';
import BuildTestsList from 'modules/Builds/sections/BuildTestsList';
const FlakyTestsInsights = dynamic(() => import('modules/Builds/sections/FlakyTestsInsights'));
const FlakyTestsInsightsV2 = dynamic(() => import('modules/Builds/sections/FlakyTestsInsightsV2'));
const LogStream = dynamic(() => import('modules/Logs/sections/LogStream'), {
  ssr: false,
});
const LogStreamV2 = dynamic(() => import('modules/Logs/sections/LogStreamV2'), {
  ssr: false,
});

import CardDataLoader from 'components/CardDataLoader';
import Layout from 'components/Layout';
import TasTabs from 'components/TasTabs';

function getTabsList(taskType: string) {
  if (taskType === 'discover') {
    return [
      {
        key: 'logs',
        label: 'Logs',
      },
    ];
  } else if (taskType === 'flaky') {
    return [
      {
        key: 'ftm_impacted_tests',
        label: 'Impacted Tests',
      },
      {
        key: 'logs',
        label: 'Logs',
      },
    ];
  } else {
    return [
      {
        key: 'impacted_tests',
        label: 'Impacted Tests',
      },
      {
        key: 'metrics',
        label: 'Metrics',
      },
      {
        key: 'logs',
        label: 'Logs',
      },
    ];
  }
}

const BuildDetails: NextPage = () => {
  const router = useRouter();
  const { buildid, repo, provider, org } = router.query;

  const dispatch = useDispatch();
  const state: any = useSelector((state) => state, _.isEqual);

  const { buildTasks, buildTasksMetadata, isBuildTasksFetching } = state?.buildData;
  const { currentBuild, isCurrentBuildFetching, time_saved, isTimeSavedFetching } =
    state?.buildData;

  const isFTMOnlyView = currentBuild.job_view === 'ftm_only';

  const [currentBuildTask, setCurrentBuildTask] = useState<any>(null);
  const [selectedView, setSelectedView] = useState<string>('');

  const viewTabs = getTabsList(currentBuildTask?.type);

  const buildAndTaskFetching = isCurrentBuildFetching || isBuildTasksFetching;
  const showTabsList = currentBuild?.id && !buildAndTaskFetching;

  const statusMessage =
    currentBuild.remark && (currentBuild.status === 'failed' || currentBuild.status === 'error')
      ? currentBuild.remark
      : null;

  const mainHeaderHeight = 88;
  const summaryHeight = statusMessage ? 112 : 80;
  const contentTabsHeight = 63;
  const contentFiltersHeight = 63;
  const sectionSpacing = 16;

  const { discoveryTasks, executionTasks, ftmTasks } = (buildTasks || []).reduce(
    (acc: any, task: any) => {
      if (task.type === 'discover') {
        acc.discoveryTasks.push(task);
      } else if (task.type === 'execute') {
        acc.executionTasks.push(task);
      } else if (task.type === 'flaky') {
        acc.ftmTasks.push(task);
      }
      return acc;
    },
    { discoveryTasks: [], executionTasks: [], ftmTasks: [] }
  );

  const onBuildTaskChange = (task: any) => {
    const validTabs = getTabsList(task?.type);

    if (task?.status === 'error') {
      setSelectedView('logs');
    } else if (!validTabs.find((value) => value.key === selectedView)) {
      if (task?.type === 'discover') {
        setSelectedView('logs');
      } else if (task?.type === 'flaky') {
        setSelectedView('ftm_impacted_tests');
      } else {
        setSelectedView('impacted_tests');
      }
    }
    setCurrentBuildTask(task);
  };

  const getTasksData = (nextCursor = '') => {
    dispatch(fetchBuildTasks(repo, buildid, nextCursor));
  };

  const getCurrentBuild = () => {
    dispatch(fetchCurrentBuild(repo, buildid));
  };

  const getTimeSaved = () => {
    dispatch(fetchTimeSaved(repo, currentBuild.id));
  };

  useEffect(() => {
    if (repo) {
      getCurrentBuild();
    }
    return () => {
      dispatch(unmountBuildTests());
    };
  }, [repo]);

  useEffect(() => {
    if (repo && currentBuild.id) {
      getTasksData();
    }
  }, [repo, currentBuild]);

  useEffect(() => {
    return () => {
      dispatch(unmountBuildLogs());
      dispatch(unmountBuildMetrics());
      cancelAxiosRequest && cancelAxiosRequest();
    };
  }, []);

  const checkIfJobIsRunning = () => {
    let interval = setInterval(() => {
      httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/build/${currentBuild.id}/aggregate`, {
        branch: getCookieTasRepoBranch(),
        git_provider: getCookieGitProvider(),
        org: getCookieOrgName(),
        repo: repo,
      })
        .then((data) => {
          let build = data.builds && data.builds.length > 0 && data.builds[0];
          if (!statusFound(build.status)) {
            if (window) {
              window.location.reload();
            }
            clearInterval(interval);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 10000);
  };

  useEffect(() => {
    if (repo && currentBuild.id) {
      if (statusFound(currentBuild.status)) {
        checkIfJobIsRunning();
      }
      if (!statusFound(currentBuild.status, false, true)) {
        getTimeSaved();
      }
    }
  }, [currentBuild.id]);

  useEffect(() => {
    if (currentBuild.id && buildTasks.length) {
      let _currentTask = null;

      if (isFTMOnlyView && ftmTasks[0]) {
        _currentTask = ftmTasks[0];
      } else if (!isFTMOnlyView && executionTasks[0]) {
        _currentTask = executionTasks[0];
      } else {
        _currentTask = ftmTasks[0] || executionTasks[0] || discoveryTasks[0];
      }

      if (!currentBuildTask) {
        onBuildTaskChange(_currentTask);
      }
    }
  }, [currentBuild.id, currentBuildTask, buildTasks.length]);

  return (
    <Layout title={`TAS: ${repo} / Jobs / ${clipText(currentBuild.id)}`}>
      <TasTabs
        activeTab="jobs"
        pagination={[
          <Link href={`/${provider}/${org}/${repo}/jobs/`}>
            <a>Jobs</a>
          </Link>,
          clipText(currentBuild.id),
        ]}
      />
      <div
        className="max__center__container view__build__details relative flex flex-col"
        style={
          selectedView === 'impacted_tests' ? {} : { height: `calc(100vh - ${mainHeaderHeight}px)` }
        }
      >
        {/* Summary Section */}
        {isCurrentBuildFetching && (
          <div className="bg-white p-16 flex flex-wrap">
            <CardDataLoader />
          </div>
        )}
        {currentBuild.id && (
          <BuildSummary
            build={currentBuild}
            isTimeSavedFetching={isTimeSavedFetching}
            statusMessage={statusMessage}
            timeSaved={time_saved}
          />
        )}

        <div className="flex flex-1 w-full px-16">
          {/* Tasks List */}
          {currentBuildTask && buildTasks.length > 0 && (
            <BuildTasksList
              hasMoreData={!!buildTasksMetadata?.next_cursor}
              isLoading={isBuildTasksFetching}
              list={{ discoveryTasks, executionTasks, ftmTasks }}
              loadMore={() => getTasksData(buildTasksMetadata?.next_cursor)}
              onSelect={onBuildTaskChange}
              selected={currentBuildTask}
              styles={{
                // header + top space
                top: `${mainHeaderHeight + sectionSpacing}px`,
                // 100vh - (header + summary height + top/bottom space of tasks list)
                minHeight: `calc(100vh - ${
                  mainHeaderHeight + summaryHeight + 2 * sectionSpacing
                }px)`,
                // 100vh - (header + top/bottom space)
                maxHeight: `calc(100vh - ${mainHeaderHeight + 2 * sectionSpacing}px)`,
              }}
              isCollapsible={!!ftmTasks?.length && isFTMOnlyView}
            />
          )}

          {/* Content Panel */}
          <div
            className={`flex-1 ${
              currentBuildTask && buildTasks.length > 0 ? 'pl-16' : ''
            } max-w-full`}
            style={{
              width: currentBuildTask && buildTasks.length > 0 ? 'calc(100% - 248px)' : '100%',
            }}
          >
            {/* Sub views tabs */}
            <div
              className={`bg-gray-60 pt-16 border-b px-0 sticky z-10`}
              style={{ top: `${mainHeaderHeight}px` }}
            >
              <div className="flex text-size-14 bg-white radius-3 overflow-hidden">
                {showTabsList
                  ? viewTabs.map((view) => {
                      return (
                        <div
                          className={`
                            px-16 py-12 cursor-pointer
                            ${view.key === selectedView ? 'text-black' : 'text-tas-400'}
                            ${
                              view.key === selectedView && viewTabs.length > 1
                                ? ' border-b border-black'
                                : ''
                            }
                          `}
                          key={view.key}
                          onClick={() => setSelectedView(view.key)}
                        >
                          {view.label}
                        </div>
                      );
                    })
                  : ''}
              </div>
            </div>

            <div className="pb-16 flex flex-1">
              <div className="flex-1 w-full">
                {selectedView === 'impacted_tests' && (
                  <BuildTestsList
                    buildAndTaskFetching={buildAndTaskFetching}
                    currentBuild={currentBuild}
                    currentBuildTask={currentBuildTask}
                    isCurrentBuildFetching={isCurrentBuildFetching}
                    styles={{
                      // 100vh - (header + summary + content tabs + bottom space)
                      minHeight: `calc(100vh - ${
                        mainHeaderHeight + summaryHeight + contentTabsHeight + sectionSpacing
                      }px)`,
                      // header + content tabs
                      top: `${mainHeaderHeight + contentTabsHeight}px`,
                    }}
                    timeSaved={time_saved}
                  />
                )}
                {selectedView === 'ftm_impacted_tests' && (
                  <FlakyTestsInsights
                    job={currentBuild}
                    task={currentBuildTask}
                    repo={repo}
                    // container styles
                    styles={{
                      // 100vh - (header + summary + content tabs + bottom space)
                      minHeight: `calc(100vh - ${
                        mainHeaderHeight + summaryHeight + contentTabsHeight + sectionSpacing
                      }px)`,
                      // header + content tabs
                      top: `${mainHeaderHeight + contentTabsHeight}px`,
                    }}
                    // list styles
                    listStyles={{
                      // 100vh - (header + summary + content tabs + filterHeight + top/bottom space
                      maxHeight:
                        mainHeaderHeight +
                        summaryHeight +
                        contentTabsHeight +
                        contentFiltersHeight +
                        2 * sectionSpacing,
                      minHeight: 'auto',
                    }}
                  />
                )}
                {selectedView === 'ftm_only_impacted_tests' && (
                  <FlakyTestsInsightsV2
                    job={currentBuild}
                    task={currentBuildTask}
                    repo={repo}
                    // container styles
                    styles={{
                      // 100vh - (header + summary + content tabs + bottom space)
                      minHeight: `calc(100vh - ${
                        mainHeaderHeight + summaryHeight + contentTabsHeight + sectionSpacing
                      }px)`,
                      // header + content tabs
                      top: `${mainHeaderHeight + contentTabsHeight}px`,
                    }}
                    // list styles
                    listStyles={{
                      // header + summary + content tabs + filterHeight + top/bottom space + filters panel
                      maxHeight:
                        mainHeaderHeight +
                        summaryHeight +
                        contentTabsHeight +
                        contentFiltersHeight +
                        2 * sectionSpacing,
                      minHeight: 'auto',
                    }}
                  />
                )}
                {selectedView === 'metrics' && (
                  <BuildMetrics
                    currentBuild={currentBuild}
                    currentBuildTask={currentBuildTask}
                    buildAndTaskFetching={buildAndTaskFetching}
                    styles={{
                      // 100vh - (header + summary + content tabs + bottom space)
                      minHeight: `calc(100vh - ${
                        mainHeaderHeight + summaryHeight + contentTabsHeight + sectionSpacing
                      }px)`,
                    }}
                  />
                )}
                {selectedView === 'logs' && (
                  <LogStream
                    buildId={currentBuild.id}
                    buildStatus={currentBuild.status}
                    repo={String(repo)}
                    task={currentBuildTask}
                    styles={{
                      // 100vh - (header + summary + content tabs + bottom space)
                      minHeight: `calc(100vh - ${
                        mainHeaderHeight + summaryHeight + contentTabsHeight + sectionSpacing
                      }px)`,
                    }}
                  />
                )}
                {selectedView === 'ftm_only_logs' && (
                  <LogStreamV2
                    buildId={currentBuild.id}
                    buildStatus={currentBuild.status}
                    list={{ discoveryTasks, executionTasks, ftmTasks }}
                    repo={String(repo)}
                    tasks={buildTasks}
                    styles={{
                      // 100vh - (header + summary + content tabs + bottom space)
                      minHeight: `calc(100vh - ${
                        mainHeaderHeight + summaryHeight + contentTabsHeight + sectionSpacing
                      }px)`,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BuildDetails;
