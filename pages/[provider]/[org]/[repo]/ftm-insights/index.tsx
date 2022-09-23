import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useDispatch } from 'react-redux';

import _ from 'underscore';
import moment from 'moment';

import { unmountInsightsFlakyTests } from 'redux/actions/insightsFlakyTests';
import DateFormats from 'constants/DateFormats';

import Col from 'components/Tags/Col';
import InsightsLeftMenu from 'components/InsightsLeftMenu';
import Layout from 'components/Layout';
import Row from 'components/Tags/Row';
import TasTabs from 'components/TasTabs';
import { TRange } from 'components/PeriodRangeFilter';

import ChartWithSummary from 'modules/InsightsFlakyTests/sections/ChartWithSummary';
import TestsList from 'modules/InsightsFlakyTests/sections/TestsList';

const InsightsFlakyTests: NextPage = () => {
  const dispatch = useDispatch();

  const [periodRange, setPeriodRange] = useState<TRange>(() => [
    moment().subtract(1, 'month').format(DateFormats.DATE_TIME),
    moment().format(DateFormats.DATE_TIME),
  ]);

  useEffect(() => {
    return () => {
      dispatch(unmountInsightsFlakyTests());
    };
  }, []);

  return (
    <Layout title="Insights: Flaky Tests">
      <TasTabs
        activeTab="analytics"
        pagination={['Insights', 'Flaky Tests']}
        details_page={false}
      />
      <div className="p-20 max__center__container">
        <Row className="flex-wrap">
          <Col size="2">
            <InsightsLeftMenu />
          </Col>
          <Col size="10">
            <ChartWithSummary periodRange={periodRange} setPeriodRange={setPeriodRange} />
            <TestsList periodRange={periodRange} />
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default InsightsFlakyTests;
