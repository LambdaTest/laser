import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { errorInterceptor } from 'redux/helper';
import { getCookieGitProvider, getCookieOrgName } from 'helpers/genericHelpers';
import { httpGet, httpPost } from 'redux/httpclient';

import Input from 'components/Input';
import Loader from 'components/Loader';
import Text from 'components/Tags/Text';
import Switch from 'components/Switch';

export default function JobDetailsViewSettings() {
  const router = useRouter();
  const { repo } = router.query;

  const [defaultData, setDefaultData] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [editConfigurationFile, setEditConfigurationFile] = useState(false);

  let form = useRef<HTMLFormElement>(null);

  const onInputChange = (e: any) => {
    const key = e.target.name;
    const value = e.target.value;

    setData((data: any) => ({ ...data, [key]: value }));
  };

  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    if (!loading) {
      // @ts-ignore
      const { config_file_name } = form.current;
      if (config_file_name.value === '') {
        toast.error('Secret value can not be empty');
        return;
      }

      let formdata = {
        ...data,
        org: getCookieOrgName(),
        repo: repo,
      };
      postData(formdata);
    }
  };

  const onConfigurationSubmit = (shouldSubmit: boolean) => (e: any) => {
    e.preventDefault();
    if (shouldSubmit) {
      handleSubmitForm(e);
      return;
    }
    setData(defaultData);
    setEditConfigurationFile((editConfigurationFile) => !editConfigurationFile);
  };

  const getData = async () => {
    setLoading(true);
    await httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/repo/settings`, {
      org: getCookieOrgName(),
      repo: repo,
      git_provider: getCookieGitProvider(),
    })
      .then((data) => {
        setDefaultData(data);
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('error', error);
        errorInterceptor(error);
        setLoading(false);
      });
  };

  const postData = async (data: any) => {
    setLoading(true);
    await httpPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/repo/settings`, data)
      .then((data) => {
        console.log('data', data);
        getData();
        setLoading(false);
        toast.success('Saved successfully.');
      })
      .catch((error) => {
        console.log('error', error);
        setLoading(false);
        errorInterceptor(error);
      });
  };

  useEffect(() => {
    if (!loading) {
      setEditConfigurationFile(false);
    }
  }, [loading]);

  useEffect(() => {
    if (repo) {
      getData();
    }
  }, [repo]);

  return (
    <div className="bg-white rounded-md mb-20 mt-20">
      <div className="py-12 px-20  border-b border-gray-150 flex justify-between items-center">
        <Text className=" text-size-14 text-gray-900">General Configuration</Text>
        <div className="">
          {!editConfigurationFile && (
            <button
              className="border h-32 px-20 py-5 rounded text-size-14 transition bg-black text-white border-black tracking-widest inline-flex items-center"
              onClick={onConfigurationSubmit(false)}
            >
              Edit
            </button>
          )}
          {editConfigurationFile && (
            <button
              className="border h-32 px-20 py-5 rounded text-size-14 transition text-black border-black tracking-widest inline-flex items-center mr-10"
              onClick={onConfigurationSubmit(false)}
            >
              Cancel
            </button>
          )}
          {editConfigurationFile && (
            <button
              className="border h-32 px-20 py-5 rounded text-size-14 transition bg-black text-white border-black tracking-widest inline-flex items-center"
              onClick={onConfigurationSubmit(true)}
            >
              Save {loading && <div className="loader ml-10">Loading...</div>}
            </button>
          )}
        </div>
      </div>
      <div className="mb-15">
        <form action="" className="form" ref={form}>
          {loading && !data && (
            <div className="py-10 px-20">
              <Loader length={1} margin_bottom={0} height={40} />
            </div>
          )}
          {data && (
            <>
              <div className="flex items-center py-10 px-20">
                <span className="width-150 text-tas-400 text-size-12">
                  Configuration File Name :
                </span>
                <Input
                  className={`h-38 ${
                    editConfigurationFile
                      ? 'border-gray-350 bg-gray-50 ml-10'
                      : 'border-none bg-white'
                  }`}
                  value={data?.config_file_name}
                  onChange={onInputChange}
                  disabled={!editConfigurationFile}
                  name="config_file_name"
                  placeholder=".drone.yml"
                />
              </div>
              <div className="flex items-center pb-10 px-20">
                <span className="width-150 text-tas-400 text-size-12">FTM Only :</span>
                <Switch
                  disabled={!editConfigurationFile}
                  id="toggleFTMOnlyView"
                  labelClass={'text-size-14'}
                  onChange={(e) => {
                    setData((data: any) => ({
                      ...data,
                      ['job_view']: e.target.checked ? 'ftm_only' : 'default',
                    }));
                  }}
                  value={data?.job_view === 'ftm_only'}
                  wrapperClass={'px-10'}
                />
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
