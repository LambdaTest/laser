import React, { useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { getCookieOrgName } from '../../helpers/genericHelpers';
import { importCustomRepo } from 'redux/actions/repoAction';

import Col from 'components/Tags/Col';
import Input from 'components/Input';
import Layout from 'components/Layout';
import Row from 'components/Tags/Row';
import Text from 'components/Tags/Text';

const CreatProjectStepsData = [
  {
    title: 'Go to Github settings',
    description: ['Click on developer settings and select personal tokens from sidebar'],
  },
  {
    title: 'Generate new token',
    description: [
      'Click on generate new token inside personal tokens',
      'Give your token a description, set expiration time to "No Expiration"',
    ],
  },
  {
    title: 'Grant permissions',
    description: [
      'Select "<b>permission-1</b>" "<b>permission-2</b>"  ',
      'Hit <b>Generate token</b> and save the token',
    ],
  },
];

const CreateProject: NextPage = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { repoData }: any = state;
  const {
    isImportRepoFetching,
    isImportRepoFetched,
  }: { isImportRepoFetching: any; isImportRepoFetched: any } = repoData;

  const [activeStep, setActiveStep] = useState(CreatProjectStepsData[0].title);

  let form = useRef<HTMLFormElement>(null);
  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    if (!isImportRepoFetching) {
      // @ts-ignore
      const { name, link, access_token } = form.current;
      if (link.value === '') {
        toast.error('Link can not be empty');
        return;
      }
      if (name.value === '') {
        toast.error('Name can not be empty');
        return;
      }
      if (access_token.value === '') {
        toast.error('Access Token can not be empty');
        return;
      }

      let formdata = {
        access_token: access_token.value,
        link: link.value,
        name: name.value,
        namespace: getCookieOrgName(),
      };

      dispatch(importCustomRepo(JSON.stringify(formdata)));
    }
  };
  const handleUrlChange = (event: any) => {
    let urlvalue = event.target.value;
    let arr = urlvalue.split('/');
    if (urlvalue == '') {
      // @ts-ignore
      const { name } = form.current;
      name.value = '';
    }
    if (arr.length > 2) {
      // @ts-ignore
      const { name } = form.current;
      name.value = arr[arr.length - 1];
    }
  };
  useEffect(() => {
    if (isImportRepoFetched) {
      // @ts-ignore
      const { name } = form.current;
      router.push(`/save-project/?repo=${name.value}`);
    }
  }, [isImportRepoFetched]);
  return (
    <Layout title="TAS: Create new Project">
      <div className="flex justify-center">
        <div className="w-full p-20">
          <Text size="h3" className="mb-20">
            Create a New Project
          </Text>
          <form action="" className="form" ref={form}>
            <Text className="bg-white py-27 px-29">
              <Row>
                <Col size="4" className="pr-0">
                  <Text className="pr-40">
                    <Text>
                      <Text className="text-size-14 font-bold block mb-10 text-gray-950 tracking-wide">
                        Repo URL
                      </Text>
                      <Input
                        className="h-38 border-gray-350"
                        name="link"
                        onChange={(e: any) => {
                          handleUrlChange(e);
                        }}
                        placeholder="https://github.com/NordicRuins"
                      />
                    </Text>
                  </Text>

                  <Text className="mt-50 pl-20 border-l-2 w-10/12 relative">
                    {CreatProjectStepsData.map((stepData) => (
                      <Text
                        className={`mb-22 cursor-pointer ${
                          stepData.title === activeStep ? 'active_slide' : 'opacity-50'
                        }`}
                        key={stepData.title}
                        onClick={() => setActiveStep(stepData.title)}
                      >
                        <Text size="h4" className="tracking-wide text-black leading-none mb-10">
                          {stepData.title}
                        </Text>
                        <ul>
                          {stepData.description.map((description) => (
                            <li
                              className="text-size-12 text-tas-400 leading-relaxed mb-5"
                              key={description}
                              dangerouslySetInnerHTML={{ __html: description }}
                            ></li>
                          ))}
                        </ul>
                      </Text>
                    ))}
                  </Text>

                  <Text className="flex items-end accessToken mt-60">
                    <Text>
                      <Text className="text-size-14 font-bold block mb-10 text-gray-950 tracking-wide">
                        Access Token
                      </Text>
                      <Input
                        className="h-38 border-gray-350"
                        name="access_token"
                        placeholder="Paste Access Token Here"
                        type="password"
                      />
                    </Text>
                    <button
                      className="bg-black text-white text-size-14 h-38 px-15 font-bold tracking-wide  rounded-md ml-10"
                      onClick={handleSubmitForm}
                    >
                      {isImportRepoFetching ? 'Creating...' : 'Create Project'}
                    </button>
                  </Text>
                </Col>
                <Col size="8" className="pl-50">
                  <Row>
                    <Col size="6">
                      <Text>
                        <Text className="text-size-14 font-bold block mb-10 text-gray-950 tracking-wide">
                          Repo Name
                        </Text>
                        <Input
                          className="h-38 border-gray-350"
                          name="name"
                          placeholder="My Awesome Project"
                          readOnly
                        />
                      </Text>
                      <Text size="span" className="text-size-10 text-gray-600">
                        Great repository names are short & memorable. How about{' '}
                        <Text size="span" className="text-purple-400 font-bold cursor-pointer">
                          DourSquire?
                        </Text>
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col size="10">
                      <Text className="mt-40">
                        <iframe
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          className="w-full"
                          height="353"
                          src="https://www.youtube.com/embed/9rzV6e8QJsM"
                          title="YouTube video player"
                        ></iframe>
                      </Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Text>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProject;
