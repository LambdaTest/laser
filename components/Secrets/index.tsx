import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { toast } from 'react-toastify';

import { errorInterceptor } from 'redux/helper';
import { getCookieOrgName, getCookieGitProvider } from 'helpers/genericHelpers';
import { httpDelete, httpGet, httpPost } from 'redux/httpclient';

import Input from 'components/Input';
import Loader from 'components/Loader';
import Text from 'components/Tags/Text';

export default function Secrets({ yml_page = false }: any) {
  const router = useRouter();
  const { repo } = router.query;

  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);
  const [editmode, setEditmode] = useState(false);

  const getData = async () => {
    setLoading(true);
    await httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/secret`, {
      org: getCookieOrgName(),
      repo: repo,
      git_provider: getCookieGitProvider(),
    })
      .then((data) => {
        setData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('error', error.response.status);
        if (error.response?.status !== 409) {
          errorInterceptor(error);
        }
        setLoading(false);
        setData({});
      });
  };

  const postData = async (data: any) => {
    setPostLoading(true);
    await httpPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/secret/add`, data)
      .then((data) => {
        console.log('data', data);
        getData();
        setPostLoading(false);
        if (editmode) {
          toast.success('Saved successfully.');
        } else {
          toast.success('Secret added');
        }
        setEditmode(false);
      })
      .catch((error) => {
        console.log('error', error);
        setPostLoading(false);
        errorInterceptor(error);
      });
  };

  const deleteData = async (keyName: any) => {
    if (form.current?.secret_name?.value == keyName) {
      toast.error('You can not delete this secret as you are editing this.');
      return;
    }
    setLoading(true);
    await httpDelete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/secret/delete`, {
      secret_name: keyName,
      secret_value: '',
      org_name: getCookieOrgName(),
      repo_name: repo,
    })
      .then((data) => {
        console.log('data', data);
        getData();
        setLoading(false);
        toast.success('Secret deleted');
      })
      .catch((error) => {
        console.log('error', error);
        setLoading(false);
        errorInterceptor(error);
      });
  };

  let form = useRef<HTMLFormElement>(null);

  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    if (!loading) {
      // @ts-ignore
      const { secret_name, secret_value } = form.current;
      if (
        secret_name.value.replace(/  +/g, ' ') === '' ||
        secret_name.value.replace(/  +/g, ' ') === ' '
      ) {
        toast.error('Secret name can not be empty');
        return;
      }
      if (
        secret_value.value.replace(/  +/g, ' ') === '' ||
        secret_value.value.replace(/  +/g, ' ') === ' '
      ) {
        toast.error('Secret value can not be empty');
        return;
      }

      let formdata = {
        secret_name: secret_name.value,
        secret_value: secret_value.value,
        org_name: getCookieOrgName(),
        repo_name: repo,
      };
      postData(formdata);
      form.current?.reset();
    }
  };

  const editData = (keyName: any) => {
    // @ts-ignore
    const { secret_name, secret_value } = form.current;
    secret_name.value = keyName;
    secret_value.value = '';
    setEditmode(true);
  };

  const clearData = (e: any) => {
    e.preventDefault();
    form.current?.reset();
    setEditmode(false);
  };

  useEffect(() => {
    if (repo) {
      getData();
    }
  }, [repo]);

  const getListDOM = function () {
    return (
      data &&
      Object.keys(data).length > 0 ? <div className={`bg-white rounded-md overflow-hidden ${!yml_page ? 'mb-20' : ''}`}>
          {!yml_page && (
            <Text className="py-12 px-20 text-size-14 text-gray-900 border-b border-gray-150 bg-white">
              Secrets
            </Text>
          )}

          <div className={`${!yml_page ? 'p-40 pb-15' : 'p-10'}`}>
            <div className={`${!yml_page ? 'pr-50' : 'pl-10'}`}>
              {loading && data && Object.keys(data).length == 0 && (
                <div className="-mx-15">
                  <Loader length={3} margin_bottom={0} height={30} />
                </div>
              )}
              {data && Object.keys(data).length > 0 && (
                <>
                  {Object.keys(data).map((keyName, i) => (
                    <div
                      className={`flex justify-between items-center ${
                        !yml_page ? 'mb-25' : 'mb-10'
                      }`}
                      key={i}
                    >
                      <span className="text-size-14 text-gray-600">{keyName}</span>
                      <span className="inline-flex items-center">
                        <span className="cursor-pointer mr-10" onClick={() => editData(keyName)}>
                          <img src="/assets/images/icon/edit-icon.svg" alt="Edit" />
                        </span>
                        <span className="cursor-pointer" onClick={() => deleteData(keyName)}>
                          <img src="/assets/images/bin.svg" alt="Delete" />
                        </span>
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div> : <div className={`bg-white rounded-md overflow-hidden mb-20 text-tas-400 p-20 text-size-14`}> Secrets are <b className='text-black'>encrypted</b> environment variables that might be required while building your codebase.
Currently there are no secrets added.</div>
    );
  };

  return (
    <div>
      {yml_page ? '' : getListDOM()}
      <div className="bg-white rounded-md overflow-hidden">
        {!yml_page && (
          <Text className="py-12 px-20 text-size-14 text-gray-900 border-b border-gray-150 ">
            Add Secret
          </Text>
        )}
        <div className={`bg-white  ${!yml_page ? 'p-40' : 'p-10'}`}>
          {yml_page && (
            <div className="mb-20 text-size-13 pl-10">
              You can add environment variables in TAS to securely use sensitive information such as
              username, passwords, api keys etc. We securely encrypt and store the secrets on our
              end. The secrets have scope limited to the repository.{' '}
              <a
                href="https://www.lambdatest.com/support/docs/tas-configurations-managing-secrets"
                target="_blank"
                className="text-blue-400 cursor-pointer"
              >
                Know more
              </a>
            </div>
          )}
          {yml_page && <div className="mb-10 text-size-14 pl-10">Add Secrets</div>}
          <div className={`${!yml_page ? 'w-4/12' : 'w-full'}`}>
            <form
              action=""
              className={`form ${yml_page ? 'flex justify-between pl-10' : ''}`}
              ref={form}
            >
              <Text className={`mb-15 ${yml_page ? 'w-3/12' : ''}`}>
                <Text>
                  <Input
                    className="h-38 bg-gray-50 border-gray-350"
                    name="secret_name"
                    placeholder="Secret Name"
                    readOnly={editmode}
                  />
                </Text>
              </Text>
              <Text className={`mb-15 ${yml_page ? 'w-5/12 px-8' : ''}`}>
                <Text>
                  {!yml_page ? (
                    <textarea
                      className="border px-10 py-10 text-size-14 rounded  bg-gray-50 border-gray-350 w-full"
                      name="secret_value"
                      placeholder="Secret Value"
                      rows={4}
                    ></textarea>
                  ) : (
                    <Input
                      className="h-38 bg-gray-50 border-gray-350"
                      name="secret_value"
                      placeholder="Secret Value"
                    />
                  )}
                </Text>
              </Text>
              <Text className={`${yml_page ? 'w-4/12 inline-flex items-baseline' : ''}`}>
                <button
                  className="border  px-20 py-7 rounded text-size-14 transition bg-black text-white border-black tracking-wider h-38 mr-10 inline-flex items-center"
                  onClick={handleSubmitForm}
                >
                  {editmode ? 'Update' : 'Add Secret'}
                  {postLoading && <div className="loader ml-10">Loading...</div>}
                </button>
                {editmode && (
                  <button
                    className="border  px-20 py-7 rounded text-size-14 transition bg-gray-150 text-black border-gray-150 tracking-wider h-38 "
                    onClick={clearData}
                  >
                    Clear
                  </button>
                )}
              </Text>
            </form>
          </div>
        </div>
      </div>
      {yml_page ? getListDOM() : ''}
    </div>
  );
}
