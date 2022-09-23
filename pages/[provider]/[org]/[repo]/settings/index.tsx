import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import _ from 'underscore';

import Col from 'components/Tags/Col';
import Layout from 'components/Layout';
import RepoSettingsLeftNav from 'components/RepoSettingsLeftNav';
import Row from 'components/Tags/Row';
import TasTabs from 'components/TasTabs';
import Secrets from 'components/Secrets';

// @todo: move APIs to redux
const Profile: NextPage = () => {
  const router = useRouter();
  const { repo } = router.query;

  const persistData = useSelector((state: any) => state.persistData, _.isEqual);
  const { currentOrg }: any = persistData;
  const runnerType = currentOrg?.runner_type;

  return (
    <Layout title="TAS: Repo settings">
      <TasTabs activeTab="settings" pagination={[repo, 'Project Settings']} details_page={false} />
      <div className="p-20 max__center__container">
        <Row>
          <Col size="2">
            <RepoSettingsLeftNav />
          </Col>
          <Col size="10">
            {runnerType === 'self-hosted' ? (
              <div className={`bg-white rounded-md overflow-hidden`}>
                <div className="p-20">
                In case of TAS Self Hosted mode, you need to define your secrets in the synapse
                  configuration file.{' '}
                  <a
                    className="text-blue-400"
                    href={`${process.env.NEXT_PUBLIC_DOC_HOST}/tas-self-hosted-configuration#reposecrets`}
                    target="_blank"
                  >
                    See more details
                  </a>
                </div>
              </div>
            ) : (
              <Secrets />
            )}
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Profile;
