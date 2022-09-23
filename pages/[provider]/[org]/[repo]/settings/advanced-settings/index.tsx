import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import Col from 'components/Tags/Col';
import Layout from 'components/Layout';
import RepoSettingsLeftNav from 'components/RepoSettingsLeftNav';
import Row from 'components/Tags/Row';
import TasTabs from 'components/TasTabs';

import PostMerge from 'modules/RepoSettings/sections/PostMerge';
import FTMSettings from 'modules/RepoSettings/sections/FTMSettings';
import DelinkRepo from 'modules/RepoSettings/sections/DelinkRepo';
import GeneralConfiguration from 'modules/RepoSettings/sections/GeneralConfiguration';

// @todo: move APIs to redux
const AdvancedSettings: NextPage = () => {
  const router = useRouter();
  const { repo } = router.query;

  return (
    <Layout title="TAS: Repo settings">
      <TasTabs activeTab="settings" pagination={[repo, 'Project Settings']} details_page={false} />
      <div className="p-20 max__center__container">
        <Row>
          <Col size="2">
            <RepoSettingsLeftNav />
          </Col>
          <Col size="10">
            <PostMerge />
            <FTMSettings />
            <GeneralConfiguration />
            <DelinkRepo />
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default AdvancedSettings;
