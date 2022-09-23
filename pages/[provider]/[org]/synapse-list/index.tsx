import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';

import _ from 'underscore';

import Col from 'components/Tags/Col';
import Layout from 'components/Layout';
import Row from 'components/Tags/Row';
import Text from 'components/Tags/Text';
import Loader from 'components/Loader';
import NoData from 'components/Nodata';
import AdminSettingsLeftNav from 'components/AdminSettingsLeftNav';
import { httpGet, httpPatch } from 'redux/httpclient';
import { useRouter } from 'next/router';
import { errorInterceptor } from 'redux/helper';
import { useSelector } from 'react-redux';
import SynapseToken from 'components/SynapseToken';
import EllipsisText from 'components/EllipsisText';
import TimeAgo from 'components/TimeAgo';
import Tooltip from 'components/Tooltip';
import { toast } from 'react-toastify';

const SynapseList: NextPage = () => {
  const state = useSelector((state) => state);
  const {persistData}:any = state;
  const {currentOrg}:any = persistData;
  const router = useRouter()
  const { provider, org} = router.query;
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const getSynapseList = async () => {
        setLoading(true)
        await httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/org/synapse/list`,
        {
            org: org,
            git_provider: provider
        }
        ).then(data => {
            setData(data.synapse_list ? data.synapse_list : []);
            setLoading(false)
        }).catch((error) => {
            errorInterceptor(error);
            setLoading(false)
            setData([]);
        })
    }

    const convertMibToGB = (value:any) => {
      return parseFloat(`${(value*0.00104858).toFixed(2)}`);
    }

    const toggleSynapse = (synapseID:any) => {
       httpPatch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/org/synapse`, {},
        {
            org: org,
            git_provider: provider,
            synapseID: synapseID,
            is_active: false
        }
        ).then(data => {
            console.log('data', data)
            toast.success('Synapse Deactivated');
            getSynapseList();
        }).catch((error) => {
            errorInterceptor(error);
        })
    }

    useEffect(() => {
      if(provider && org) {
        getSynapseList();
      }

    }, [org, provider])
  return (
    <Layout title="TAS Synapse Config">
      <div className="p-20 pb-10 max__center__container">
        <Row>
          <Col size="2" className="pr-0">
             <AdminSettingsLeftNav />
          </Col>
          <Col size="10">
            <div className="mb-15 bg-white py-20 px-30 rounded-md">
                  <div className="flex flex-wrap items-center">
                    <div className="flex-1">
                      <div>
                        <div className="w-6/12">
                          <div className="text-size-12 text-gray-600 mb-10">Synapse Token</div>
                            {currentOrg && currentOrg.synapse_key && <SynapseToken token={currentOrg?.synapse_key} />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            {!loading && data.length === 0 ? (
              <div className="inline-flex bg-white w-full justify-center items-center rounded-lg" style={{height: '83vh'}}>
                <div className="text-center">
                  <NoData msg={[`Seems like there are no synapse connected. <br/> Go to Synapse Configurations to setup a synapse.`]} />
                </div>
              </div>
            ) : (
              <div>

                <div className="flex  flex-wrap  items-center bg-white px-20 py-10  rounded-md rounded-b-none border-b text-size-12 text-tas-400 font-medium">
                  <div className="px-15 w-1/12">
                    <span className="w-full leading-none inline-flex items-center">Name</span>
                  </div>
                  <div className="px-15 w-2/12" style={{width: '12%'}}>
                    <span className="w-full leading-none inline-flex items-center">Synapse ID</span>
                  </div>
                  <div className="px-15 w-1/12" style={{width: '12%'}}>
                    <span className="w-full leading-none inline-flex items-center">Status</span>
                  </div>
                  <div className="px-15  w-2/12">
                    <span className="w-full leading-none inline-flex items-center">
                      Total Resources
                    </span>
                  </div>
                  <div className="px-15  w-2/12">
                    <span className="w-full leading-none inline-flex items-center">
                      Available Resources
                    </span>
                  </div>
                  <div className="px-15 w-2/12">
                    <span className="w-full leading-none inline-flex items-center">First Connected</span>
                  </div>
                  <div className="px-15 w-2/12">
                    <span className="w-full leading-none inline-flex items-center">Last Connected</span>
                  </div>
                </div>
              </div>
            )}
            {loading && <Loader loader_for="synapse_config" length="2" />}

            {!loading && data.length > 0 && (
              <div>
                {data.map((row: any) => {
                  return (
                    <Row
                      className="w-full flex-wrap flex py-12 items-center hover:bg-gray-50  px-20 bg-white border-b text-size-14"
                      gutter="0"
                    >
                      <Col size={1}>
                        <Text className="inline-flex items-center w-full    text-tas-500">
                          {
                            row.name ?<Tooltip
                                content={row.name}
                                placement="top"
                              >
                                <span>
                                  <EllipsisText text={row.name} copy length={6} dots />
                                </span>
                          </Tooltip> : '-'
                          }

                        </Text>
                      </Col>
                      <Col size={2} style={{width: '12%'}}>
                        <Text className="inline-flex items-center w-full   cursor-pointer text-tas-500">
                         <EllipsisText text={row.id} copy length={10} dots />
                        </Text>
                      </Col>
                      <Col size={1} style={{width: '12%'}}>
                        <Text className="inline-flex items-center w-full    text-tas-500 capitalize">
                          {row.status}
                        </Text>
                      </Col>
                      <Col size={2} className="pr-0">
                        <Text className="inline-flex items-center w-full ">
                          <div>
                            <div className="flex">
                              <div className="flex mr-10 items-baseline">
                                <div>{row.total_cpu_core}</div>
                                <div className="ml-5 opacity-60 text-size-10">vCPUs</div>
                              </div>
                              <div className="flex items-baseline">
                                <div>{convertMibToGB(row.total_ram_mib)}</div>
                                <div className="ml-5 opacity-60 text-size-10">GB RAM</div>
                              </div>
                            </div>
                          </div>
                        </Text>
                      </Col>
                      <Col size={2} className="pr-0">
                        <Text className="inline-flex items-center w-full ">
                          <div>
                            <div className="flex">
                              <div className="flex mr-10 items-baseline">
                                <div>{row.available_cpu_core}</div>
                                <div className="ml-5 opacity-60 text-size-10">vCPUs</div>
                              </div>
                              <div className="flex items-baseline">
                                <div>{convertMibToGB(row.available_ram_mib)}</div>
                                <div className="ml-5 opacity-60 text-size-10">GB RAM</div>
                              </div>
                            </div>
                          </div>
                        </Text>
                      </Col>
                      <Col size={2}>
                        <Text className="inline-flex items-center w-full    text-tas-500">
                          <TimeAgo date={row.first_connected} />
                        </Text>
                      </Col>
                      <Col size={2} className="relative">
                        <Text className="inline-flex items-center w-full    text-tas-500">
                          <TimeAgo date={row.last_connected} />
                          {row.status === 'disconnected' &&<Tooltip content={'Deactivate Synapse'}>
                              <span className='cursor-pointer ml-15 absolute right-0' onClick={() => toggleSynapse(row.id)}>
                              <img src="/assets/images/icon/icon-Bin.svg" alt="Delete" />
                            </span>
                          </Tooltip>}
                        </Text>
                      </Col>
                    </Row>
                  );
                })}
              </div>
            )}
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default SynapseList;
