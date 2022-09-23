import React, {} from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'
import Image from '../../components/Tags/Image'
import { NextPage } from 'next'
import Text from '../../components/Tags/Text'
import Row from '../../components/Tags/Row'
import Col from '../../components/Tags/Col'
import Card from '../../components/Card'
import { useSelector } from 'react-redux'

const NewProject: NextPage = () => {
  const state = useSelector((state) => state);
  const { persistData }: any = state;
  const { currentOrg }: any = persistData;
  return (
    <Layout title="TAS: New Project">
        <div className="flex">
          <div className="w-full p-20">
            <div style={{maxWidth: '1280px'}}>
              <Text size="h3" className=" mb-20">Create a New Project</Text>
              <Row gutter="10">
                  {/* <Col size="4" gutter="10">
                    <Link href="/create-new-project">
                      <a>
                        <Card>
                            <Text className="inline-flex items-center w-128 h-128 rounded-full bg-gray-60 p-32 justify-center mb-55">
                                <Image src="/assets/images/icon/plus.svg" />
                            </Text>
                            <Text>
                              <Text size="h4" className="font-bold tracking-wide">Create Blank Project</Text>
                              <Text size="p" className="text-size-12 text-tas-400 leading-relaxed mt-12">Create a blank project and manually setup your repository from your choice of GIT.</Text>
                            </Text>
                        </Card>
                      </a>
                    </Link>
                  </Col> */}
                 { currentOrg?.git_provider == 'github' && <Col size="4" gutter="10">
                    <Link href={`/${currentOrg?.git_provider}/select-org/`}>
                      <a>
                        <Card>
                          <Text className="inline-flex items-center w-128 h-128 rounded-full bg-gray-60 p-32 justify-center mb-55">
                              <Image src="/assets/images/icon/github.svg" />
                          </Text>
                          <Text>
                            <Text size="h4" className=" font-bold tracking-wide">Import from Github</Text>
                            <Text size="p" className="text-size-12 text-tas-400 leading-relaxed mt-12">Import your projects from Github directly and start testing immediately..</Text>
                          </Text>
                        </Card>
                      </a>
                    </Link>
                  </Col>}
                  { currentOrg?.git_provider == 'gitlab' && <Col size="4" gutter="10">
                    <Link href={`/${currentOrg?.git_provider}/select-org/`}>
                      <a>
                        <Card>
                          <Text className="inline-flex items-center w-128 h-128 rounded-full bg-gray-60 p-32 justify-center mb-55">
                              <Image src="/assets/images/icon/gitlab.svg" />
                          </Text>
                          <Text>
                            <Text size="h4" className=" font-bold tracking-wide">Import from Gitlab</Text>
                            <Text size="p" className="text-size-12 text-tas-400 leading-relaxed mt-12">Import your projects from Gitlab directly and start testing immediately..</Text>
                          </Text>
                        </Card>
                      </a>
                    </Link>
                  </Col>}
                  { currentOrg?.git_provider == 'bitbucket' && <Col size="4" gutter="10">
                    <Link href={`/${currentOrg?.git_provider}/select-org/`}>
                      <a>
                        <Card>
                          <Text className="inline-flex items-center w-128 h-128 rounded-full bg-gray-60 p-32 justify-center mb-55">
                              <Image src="/assets/images/icon/bitbucket_v2.svg" />
                          </Text>
                          <Text>
                            <Text size="h4" className=" font-bold tracking-wide">Import from Bitbucket</Text>
                            <Text size="p" className="text-size-12 text-tas-400 leading-relaxed mt-12">Import your projects from Bitbucket directly and start testing immediately..</Text>
                          </Text>
                        </Card>
                      </a>
                    </Link>
                  </Col>}
              </Row>
            </div>
          </div>
        </div>
    </Layout>
  )
}

export default NewProject
