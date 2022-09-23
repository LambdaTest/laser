import React from 'react';

import _ from 'underscore';
import dynamic from 'next/dynamic';

import { NULL_DATE_STRING } from '../../constants';
import { statusFound } from '../../redux/helper';

import Col from '../Tags/Col';
import Row from '../Tags/Row';
import Text from '../Tags/Text';
import TimeAgo from '../TimeAgo';

const Duration = dynamic(() => import('../Duration'));
const TinyGraph = dynamic(() => import('../../components/Dashboard/TinyGraph'));

import StackedHrV2, { StackedHrType } from 'Graphs/StackedHrV2';

const ActiveRepoList = ({ isActive, onClick, repo }: any) => {
  return (
    <>
      {repo && repo.id && (
        <Row
          className="flex bg-white py-15 items-center list-hover justify-between h-67 border-b cursor-pointer"
          gutter="0"
          onClick={() => onClick(repo)}
        >
          <Col size="2" className="inline-flex items-center">
            <Text className="block items-center  text-ellipsis" title={repo.name}>
              {repo.name}
            </Text>
          </Col>
          <Col size="1" className="inline-flex items-center">
            <Text className="inline-flex items-center">
              <Text size="span" className="flex mr-7 items-center leading-none">
                {repo.metadata?.total_builds_executed === 1 &&
                statusFound(repo.latest_build?.status)
                  ? '-'
                  : repo.metadata?.total_tests}
              </Text>
            </Text>
          </Col>
          <Col size="1" className="inline-flex items-center">
            <Text className="inline-flex items-center">
              <Text size="span" className="flex mr-7 items-center leading-none">
                {repo.metadata?.total_builds_executed === 1 &&
                statusFound(repo.latest_build?.status)
                  ? '-'
                  : repo.metadata?.total_builds_executed}
              </Text>
            </Text>
          </Col>
          <Col size="2" className="inline-flex items-center pl-50">
            {repo.metadata && (
              <Text className="flex leading-none width-110">
                {(repo.metadata?.total_builds_executed === 1 && (repo.metadata?.builds_initiating === 1 || repo.metadata?.builds_running === 1)) || repo.metadata?.total_builds_executed === 0  ? (
                  '-'
                ) : (
                  <Duration value={repo.metadata?.avg_builds_duration * 1000} />
                )}
              </Text>
            )}
          </Col>
          <Col size="2" className="flex items-center">
            <Text className="inline-flex flex-col width-150">
              {repo.metadata ? (
                <>
                  <StackedHrV2
                    height={6}
                    width={120}
                    data={[
                      {
                        count: repo.metadata?.builds_passed,
                        type: 'passed',
                      },
                      // {
                      //   count: repo.metadata?.builds_initiating,
                      //   type: 'initiating',
                      // },
                      // {
                      //   count: repo.metadata?.builds_running,
                      //   type: 'running',
                      // },
                      // {
                      //   count: repo.metadata?.builds_aborted,
                      //   type: 'aborted',
                      // },
                      {
                        count: repo.metadata?.builds_failed,
                        type: 'failed',
                      },
                      {
                        count: repo.metadata?.builds_error,
                        type: 'error',
                      },
                    ]}
                    type={StackedHrType.BUILD}
                    tooltipProps={{
                      label: 'Job History',
                    }}
                  />
                </>
              ) : (
                <Text size="span" className="flex mb-3">
                  -
                </Text>
              )}
            </Text>
          </Col>
          <Col size="2" className="inline-flex items-center">
            <Text className="inline-flex items-center">
              <TinyGraph data={repo.repo_graph} id={repo.id} height={50} width={150} />
            </Text>
          </Col>

          <Col size="2" className="flex items-center justify-between">
            <Text className="flex">
              <Text size="span" className=" flex leading-none">
                {repo.created_at != NULL_DATE_STRING ? <TimeAgo date={repo.created_at} /> : '-'}
              </Text>
            </Text>

            {isActive && <div className="loader mr-20">Loading...</div>}
          </Col>
        </Row>
      )}
    </>
  );
};

export default ActiveRepoList;
