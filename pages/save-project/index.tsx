import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { NextPage } from 'next'
import Input from '../../components/Input'
import Text from '../../components/Tags/Text'
import Row from '../../components/Tags/Row'
import Col from '../../components/Tags/Col'
import Image from '../../components/Tags/Image'
import { CopyBlock, androidstudio } from "react-code-blocks";
import Link from 'next/link'
import { useSelector } from 'react-redux'


const SaveProject: NextPage = () => {
const state = useSelector((state) => state);
  const {repoData}:any = state;
  const {customImportRes} : {customImportRes:any} = repoData;
  const {persistData}:any = state;
   const {currentOrg}:any = persistData;
  const [isCopied, setIsCopied] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0);
  const copyText = (event:any, data:any, currentIndex:number) => {
      event.stopPropagation();
      event.preventDefault();
      let input = document.createElement('input');
      input.setAttribute('value', data);
      document.body.appendChild(input);
      input.select();
      let result = document.execCommand('copy');
      document.body.removeChild(input);
      setIsCopied(true);
      setCurrentIndex(currentIndex);
      setTimeout(() => {
          setIsCopied(false);
      }, 1000);
      return result;
   }
   const getRepoName = () => {
       if(window) {
        let url_string = window.location.href
        let url = new URL(url_string);
        let repo = url.searchParams.get("repo");
        return repo;
       }
   }

    const [toggleModal, setToggleModal] = useState(false);
    const handleToggle = () => {
        setToggleModal(!toggleModal);
    }

    return (
      <Layout title="TAS: Save Project">
        <div className="">
          <Text className="bg-white shadow-sm">
            <Text
              size="span"
              className="text-size-12 text-gray-500 py-12 px-15 inline-flex items-center"
            >
              <span>Project</span> <span className="mx-5 mt-3"> &gt;</span>{' '}
              <samp className="text-gray-900 mt-3">Project settings</samp>
            </Text>
          </Text>
          <div className="p-20 max__center__container">
            <Text className="bg-white py-23 px-27">
              <Text className="text-size-18 tracking-wide">
                The {getRepoName()} project is empty, follow the steps below to start testing!
              </Text>
              <Row className="mt-25">
                <Col size="4">
                  <Text className="mb-10">
                    <Text className="relative">
                      <Text className="text-size-14 font-semibold block mb-9 text-gray-950 tracking-wide">
                        Webhook URL
                      </Text>
                      <Input
                        placeholder="https://github.com/NordicRuins"
                        className="h-38 bg-gray-100 border-gray-350"
                        value={customImportRes.webhook_url && customImportRes.webhook_url}
                      />
                      <span
                        className="cursor-pointer absolute right-0 bottom-0 mr-12 mb-13"
                        onClick={(e) =>
                          copyText(
                            e,
                            customImportRes.webhook_url ? customImportRes.webhook_url : '',
                            0
                          )
                        }
                      >
                        <img
                          src={`/assets/images/icon/${
                            isCopied && currentIndex === 0 ? 'green-check' : 'copy-paste'
                          }.svg`}
                          className=" h-11 w-11"
                        />
                      </span>
                    </Text>
                    <Text size="span" className="text-size-10 text-gray-600">
                      Paste this URL in your webhook settings page.{' '}
                      <Text size="span" className="text-purple-400 font-bold cursor-pointer">
                        Know more
                      </Text>
                    </Text>
                  </Text>
                </Col>
                <Col size="4">
                  <Text className="mb-10">
                    <Text className="relative">
                      <Text className="text-size-14 font-semibold block mb-9 text-gray-950 tracking-wide">
                        Secret Key
                      </Text>
                      <Input
                        placeholder="THF2R-MMJ7Y-KRHTP-VK94R"
                        className="h-38 bg-gray-100 border-gray-350"
                        value={customImportRes.secret_key && customImportRes.secret_key}
                      />
                      <span
                        className="cursor-pointer absolute right-0 bottom-0 mr-12 mb-13"
                        onClick={(e) =>
                          copyText(
                            e,
                            customImportRes.secret_key ? customImportRes.secret_key : '',
                            1
                          )
                        }
                      >
                        <img
                          src={`/assets/images/icon/${
                            isCopied && currentIndex === 1 ? 'green-check' : 'copy-paste'
                          }.svg`}
                          className=" h-11 w-11"
                        />
                      </span>
                    </Text>
                    <Text size="span" className="text-size-10 text-gray-600">
                      Paste this secret key in your webhook settings page.{' '}
                      <Text size="span" className="text-purple-400 font-bold cursor-pointer">
                        Know more
                      </Text>
                    </Text>
                  </Text>
                </Col>
              </Row>
              <Text className="mt-30 ">
                <div className="flex justify-between">
                  <div className="inline-flex flex-col">
                    <Text size="h4" className="text-size-14 tracking-wide text-black font-semibold">
                      TAS yml Instructions
                    </Text>
                    <Text size="p" className="text-size-14 text-gray-600 leading-relaxed mt-2">
                      Download the configuration file, rename & place it as “.tas.yml“ at the root
                      level of your repository and push the changes to your repo.{' '}
                      <Text
                        size="span"
                        className="text-purple-400 font-bold cursor-pointer text-size-12"
                        onClick={handleToggle}
                      >
                        Need Help?
                      </Text>
                    </Text>
                  </div>
                  <div className="inline-flex items-center">
                    <a
                      href="/assets/files/root.tas.yml"
                      download
                      className="border py-3 px-10 rounded text-size-14 transition bg-white text-gray-600 border-gray-600 inline-flex items-center h-38 w-40 text-center justify-center mr-12"
                    >
                      <Image src="/assets/images/icon/download.svg" width="12" />
                    </a>
                    <Link
                      href={`/${currentOrg?.git_provider}/${
                        currentOrg?.name
                      }/${getRepoName()}/jobs/`}
                    >
                      <a className="border py-3 w-135 font-bold tracking-wider h-38 rounded text-size-14 transition bg-black text-white border-black inline-flex items-center mr-5  text-center justify-center">
                        Start Testing
                      </a>
                    </Link>
                  </div>
                </div>
                <Text className="mt-20 codeblock_parent">
                  <CopyBlock
                    className={'sssss'}
                    text={`

  # supported frameworks: mocha|jest|jasmine
  framework: mocha

  blocklist:
    # format: "<filename>##<suit-name>##<suit-name>##<test-name>"
    - "src/test/api.js"
    - "src/test/api1.js##this is a test-suite"
    - "src/test/api2.js##this is a test-suite##this is a test-case"

  preRun:
    # set of commands to run before running the tests like \`yarn install\`, \`yarn build\`
    command:
      # change the command according to the package manager being used in the repository.
      # For eg, npm ci, yarn install or any other command used to fetch node modules
      - npm install

  postMerge:
    # env vars provided at the time of discovering and executing the post-merge tests
    env:
      REPONAME: nexe
      AWS_KEY: $\{\{ secrets.AWS_KEY \}\}
    # glob-pattern for identifying the test files
    pattern:
      # regex pattern to discover tests to run in case of postMerge
      - "./test/**/*.spec.ts"

  preMerge:
    pattern:
      # regex pattern to discover tests to run in case of premerge
      - "./test/**/*.spec.ts"

  postRun:
    # set of commands to run after running the tests
    command:
      - node --version

  # path to your custom configuration file required by framework
  configFile: mocharc.yml

  # provide the semantic version of nodejs required for your project
  nodeVersion: 14.17.2

  # configure whether to smartSelect test-cases. Default true
  smartRun: false

  # supported tiers: xsmall|small|medium|large|xlarge
  tier: small

  # number of parallel instances of containers to spawned to distribute test execution
  parallelism: 2

  # version of tas file intended to be used in order to issue warnings for deprecation or breaking changes
  version: 1.0

`}
                    language={'yml'}
                    theme={androidstudio}
                  />
                </Text>
              </Text>
            </Text>
          </div>
        </div>
        {toggleModal && (
          <div className="modal__wrapper modal__wrapper modal__wrapper__opacity">
            <div className="modal__overlay"></div>
            <div className="modal__dialog" style={{ maxWidth: '500px' }}>
              <div className="bg-white mx-auto rounded">
                <Text className="pt-20 pb-5 px-10 text-size-20 text-black flex justify-between">
                  <span></span>
                  <Image
                    src="/assets/images/icon/cross.svg"
                    className="mr-18 cursor-pointer"
                    onClick={handleToggle}
                  />
                </Text>
                <Text className="pt-20 pb-5 px-20 text-size-20 text-black flex justify-between flex-wrap">
                  <span>Have you added a .tas.yml file?</span>
                  <Text className="text-size-14 mt-10 mb-10 leading-height-26 text-gray-700">
                    If you've already added{' '}
                    <code className="rounded bg-blue-200 text-size-12 p-1 text-black">
                      .tas.yml
                    </code>{' '}
                    to your default branch <br />
                    you're ready to start testing your project.
                  </Text>
                </Text>
                <hr />
                <Text className="pt-20 pb-5 px-20 text-size-20 text-black mb-15">
                  <span>How to add a .tas.yml file:</span>
                  <ol className="list-decimal pl-12 text-size-14 mt-10 leading-height-26 text-gray-700">
                    <li>Select "Download .tas.yml"</li>
                    <li>On the default branch add this file in the root of your repo</li>
                    <li>
                      Rename the file from{' '}
                      <code className="rounded bg-blue-200 text-size-12 p-1 text-black">
                        root.tas.yml
                      </code>{' '}
                      to{' '}
                      <code className="rounded bg-blue-200 text-size-12 p-1 text-black">
                        .tas.yml
                      </code>
                    </li>
                    <li>Make a commit, come back and select "Start Testing"</li>
                  </ol>
                </Text>
                <hr />
                <div className="pt-20 pb-15 px-20 text-size-20 text-black flex justify-end">
                  <a
                    href="/assets/files/root.tas.yml"
                    download
                    className="border py-3 px-10 rounded text-size-14 transition bg-white text-gray-600 border-gray-600 inline-flex items-center h-38  text-center justify-center mr-12"
                  >
                    Download .tas.yml
                  </a>
                  <Link
                    href={`/${currentOrg?.git_provider}/${currentOrg?.name}/${getRepoName()}/jobs`}
                  >
                    <a className="border py-3 w-135 font-bold tracking-wider h-38 rounded text-size-14 transition bg-black text-white border-black inline-flex items-center mr-5  text-center justify-center">
                      Start Testing
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    );
}

export default SaveProject
