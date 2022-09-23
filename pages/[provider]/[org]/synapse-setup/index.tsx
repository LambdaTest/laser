import React from 'react';
import { NextPage } from 'next';


import _ from 'underscore';

import Layout from 'components/Layout';
import SynapseConfig from 'components/SynapseConfig';



const SynapseSetup: NextPage = () => {


  return (
    <Layout title={`TAS: Synapse > Installation`}>
      <div className="flex h-full flex-col">
        <div className="bg-white p-15 text-size-10 text-tas-400 flex items-center">
          <span className="mt-3">Synapse</span>
          <span className="mx-5 mt-3"> &gt;</span>
          <span className="mt-3">Installation</span>
        </div>
        <div className="flex p-15">
          <div className="w-6/12">
              <div className="h-full">
                  <SynapseConfig test_connection={true} />
              </div>
          </div>
          <div className="w-6/12 pl-15" style={{height: 'inherit'}}>
            <div className="bg-white rounded-md h-full flex flex-col">
              <div className="border-b flex justify-between py-10 px-20">
                <div className="text-size-16">Video Walkthrough</div>
              </div>
              <div className="flex-1 p-15" style={{paddingTop: '15vh'}}>
                <video width="100%" controls>
                  <source src="/assets/media/SynapseSetup.mp4" type="video/mp4" />
                Your browser does not support the video tag.
                </video>
              </div>
              <div className='pl-15 h-80 pt-10'>
                  <a href={`${process.env.NEXT_PUBLIC_WEBSITE_HOST}/support/docs/tas-faq-and-troubleshooting/`} target="_blank" className='rounded border border-gray-600 text-size-12 inline-flex items-center py-6 px-8'>
                      <img src="/assets/images/icon/Troubleshooting.svg" alt="Troubleshooting" className='inline-block mr-5' width={12} /> Troubleshooting Guide
                    </a>
                </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SynapseSetup;
