import React from 'react';
import Link from 'next/link';

import Col from 'components/Tags/Col';
import Duration from 'components/Duration';
import EllipsisText from 'components/EllipsisText';
import Row from 'components/Tags/Row';
import Text from 'components/Tags/Text';
import BuildLink from 'components/Build/Link';

const OrgCreditsRow = ({ data, gitProvider, orgName }: any) => {
  if (!data) {
    return null;
  }

  const dataTier = data.tier
    ? `${data.tier?.charAt(0).toUpperCase() + data.tier?.slice(1) || ''}`
    : '';

  const dataMachineConfig = data.machine_config ? `(${data.machine_config})` : '';

  const systemConfigText = dataTier || dataMachineConfig ? `${dataTier} ${dataMachineConfig}` : '-';

  return (
    <Row
      className="w-full flex flex-wrap py-10 items-center hover:bg-gray-50  justify-between px-20 bg-white border-b"
      gutter="0"
    >
      <Col size={2}>
        <Link href={`/${gitProvider}/${orgName}/${data.repo_name}/jobs/${data.build_id}`}>
          <Text className="inline-flex text-size-14 items-center w-full cursor-pointer">
            <BuildLink type={data.build_tag} id={data.build_id} />
          </Text>
        </Link>
      </Col>
      <Col size={2}>
        <Link href={`/${gitProvider}/${orgName}/${data.repo_name}/commits/${data.commit_id}`}>
          <Text className="inline-flex items-center w-full cursor-pointer">
            <span className="flex text-size-14 items-center">
              <img src="/assets/images/yellow-2.svg" alt="" className="mr-7 h-12" />
              #<EllipsisText length={5} text={data.commit_id} copy />
            </span>
          </Text>
        </Link>
      </Col>
      <Col size={3}>
        <Text className="inline-flex items-center w-full text-size-14" title={systemConfigText}>
          <span className="mr-10 font-medium text-ellipsis flex items-center">
            <div className="mr-2 text-size-14">{dataTier} </div>
            <div className="text-tas-400 text-size-12">{`${dataMachineConfig}`}</div>
          </span>
        </Text>
      </Col>
      <Col size={2}>
        <Text className="inline-flex items-center w-full text-ellipsis ml-5">
          <span className="flex text-size-14 items-center">
            <Duration value={data.duration * 1000} />
          </span>
        </Text>
      </Col>
      <Col size={2}>
        <Text className="inline-flex items-center w-full ml-5">
          <span className="text-size-14 text-ellipsis">{data.credits_consumed}</span>
        </Text>
      </Col>
    </Row>
  );
};

export default OrgCreditsRow;
