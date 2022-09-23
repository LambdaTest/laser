import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';

import _ from 'underscore';

import { unmountTrends } from 'redux/actions/trendsAction';

import Col from 'components/Tags/Col';
import InsightsLeftMenu from 'components/InsightsLeftMenu';
import Layout from 'components/Layout';
import Row from 'components/Tags/Row';
import TasTabs from 'components/TasTabs';

import AnalyticsTable from 'modules/Trends/sections/AnalyticsTable';
import BuildByDateChart from 'modules/Trends/sections/BuildsByDateChart';
// @ts-ignore
import CumulativeTestsByDate from 'modules/Trends/sections/CumulativeTestsByDate';
import TestsByCommitChart from 'modules/Trends/sections/TestsByCommitChart';

import { fetchCommits, unmountCommits } from 'redux/actions/commitAction';
import { useRouter } from 'next/router';

const AnalyticsTrends: NextPage = () => {
  const dispatch = useDispatch();

  const router = useRouter();
  const { repo } = router.query;
  const commitData = useSelector((state: any) => state.commitData, _.isEqual);
  const {commits, isCommitsFetching}: { commits: any; isCommitsFetching: any; resMetaData: any } = commitData;
   let params = {
    text: '',
    status: '',
    author: undefined,
  };



  useEffect(() => {
    return () => {
      dispatch(unmountTrends());
    };
  }, []);

  useEffect(() => {
    if (repo) {
      dispatch(fetchCommits(repo, '', params));
    }
    return () => {
      dispatch(unmountCommits());
    };
  }, [repo]);

  return (
    <Layout title="Insights: Trends">
      <TasTabs activeTab="analytics" pagination={['Insights', 'Overview']} details_page={false} />
      <div className="p-20 max__center__container">
        <Row className="flex-wrap">
          <Col size="2">
            <InsightsLeftMenu />
          </Col>
          <Col size="10">
            <div className="bg-white pt-20 pb-10 mb-20 rounded">
              <BuildByDateChart />
            </div>
            <div className="bg-white pt-20 pb-10 mb-20 rounded">
              <TestsByCommitChart />
            </div>
            {!isCommitsFetching && commits && commits.length >= 2 && <div className="bg-white pt-20 pb-10 mb-20 rounded">
              <CumulativeTestsByDate />
            </div>}
            <div className="bg-white pt-10 rounded">
              <AnalyticsTable />
            </div>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default AnalyticsTrends;
