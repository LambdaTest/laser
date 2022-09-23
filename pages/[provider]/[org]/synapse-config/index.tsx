import React from 'react';
import { NextPage } from 'next';

import _ from 'underscore';

import Col from 'components/Tags/Col';
import Layout from 'components/Layout';
import Row from 'components/Tags/Row';
import AdminSettingsLeftNav from 'components/AdminSettingsLeftNav';
import SynapseConfig from 'components/SynapseConfig';


const SynapseConfigPage: NextPage = () => {
  return (
    <Layout title="TAS Synapse Config">
      <div className="p-20 pb-10 max__center__container">
        <Row>
          <Col size="2" className="pr-0">
             <AdminSettingsLeftNav />
          </Col>
          <Col size="10">
             <SynapseConfig test_connection={false} />
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default SynapseConfigPage;
