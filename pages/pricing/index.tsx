import React, { } from 'react'
import { NextPage } from 'next'
import WebLayout from 'components/WebLayout'


const PricingPage: NextPage = () => {

  return (
    <WebLayout wrapper_classes="bg-pricing-page" title='Test At Scale | Pricing'>
      <div className="py-100 smtablet:py-50">
        <div className="container">
           <div className="smtablet:block mx-auto mb-55  w-11/12 smtablet:w-full">
             <div className="flex -mx-8 ">
                <div className="px-8 w-4/12 smtablet:w-full">
                    <div className="bg-white px-50 py-55">
                        <div className="flex items-center">
                            <img src="/assets/images/landing-page/pricing_lite.svg" alt="" className="mr-20" />
                            <span>
                                <span className="font-bold text-size-32 text-purple-400 block leading-none mb-3">Lite</span>
                                <span className="text-size-16 text-tas-400">
                                  (5 users)
                                </span>
                            </span>
                        </div>
                        <p className="text-size-14 text-tas-500 mt-25">Best for small teams</p>
                        <ul className="mt-135">
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />Smart Test Selection</li>
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />Flaky Test Management</li>
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />Deep Analysis & Insights</li>
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />Culprit Finding</li>
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />Up to 5 Concurrent Jobs</li>
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />Email Support</li>
                        </ul>
                        <div className="mt-50">
                          <a href={`#none`} className="text-size-16 font-normal rounded px-15 py-9 smtablet:mt-10 smtablet:ml-0 bg-purple-250 text-white flex items-center text-center justify-center">
                            Contact Sales
                          </a>
                        </div>
                    </div>
                </div>
                <div className="px-8 w-4/12 smtablet:w-full">
                    <div className="bg-white px-50 py-55">
                        <div className="flex items-center">
                            <img src="/assets/images/landing-page/pricing_pro.svg" alt="" className="mr-20" />
                            <span>
                                <span className="font-bold text-size-32 text-purple-400 block leading-none mb-3">Pro</span>
                                <span className="text-size-16 text-tas-400">
                                  (5-150 users)
                                </span>
                            </span>
                        </div>
                        <p className="text-size-14 text-tas-500 mt-25">Best of medium sized teams</p>
                        <div className="flex rounded overflow-hidden bg-gray-170 mt-63">
                          <a href={`#none`} className="text-size-16 font-normal  px-15 py-9 smtablet:mt-10 smtablet:ml-0  flex flex-1 items-center text-center justify-center text-tas-500">
                            Cloud
                          </a>
                          <a href={`#none`} className="text-size-16 font-normal rounded px-15 py-9 smtablet:mt-10 smtablet:ml-0 text-tas-500 bg-blue-100 border border-purple-250 flex flex-1 items-center text-center justify-center">
                            Self Hosted
                          </a>
                        </div>
                        <ul className="mt-30">
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />Unlimited Developers</li>
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />Support with SLAs</li>
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />Onboarding Assistance</li>
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />Beta Access to New Features</li>
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />Up to 25 Concurrent Jobs</li>
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />Also available on premise</li>
                        </ul>
                        <div className="mt-50">
                          <a href={`#none`} className="text-size-16 font-normal rounded px-15 py-9 smtablet:mt-10 smtablet:ml-0 bg-purple-250 text-white flex items-center text-center justify-center">
                            Contact Sales
                          </a>
                        </div>
                    </div>
                </div>
                <div className="px-8 w-4/12 smtablet:w-full">
                    <div className="bg-white px-50 py-55">
                        <div className="flex items-center">
                            <img src="/assets/images/landing-page/pricing_enterprise.svg" alt="" className="mr-20" />
                            <span>
                                <span className="font-bold text-size-32 text-purple-400 block leading-none mb-3">Enterprise</span>
                                <span className="text-size-16 text-tas-400">
                                  (150+ users)
                                </span>
                            </span>
                        </div>
                        <p className="text-size-14 text-tas-500 mt-25">Best for large teams with multiple projects</p>
                        <div className="flex rounded overflow-hidden bg-gray-170  mt-63">
                          <a href={`#none`} className="text-size-16 font-normal  px-15 py-9 smtablet:mt-10 smtablet:ml-0  flex flex-1 items-center text-center justify-center text-tas-500">
                            Cloud
                          </a>
                          <a href={`#none`} className="text-size-16 font-normal rounded px-15 py-9 smtablet:mt-10 smtablet:ml-0 text-tas-500 bg-blue-100 border border-purple-250 flex flex-1 items-center text-center justify-center">
                            On Premise
                          </a>
                        </div>
                        <ul className="mt-30">
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />Dedicated Account Manager</li>
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />Custom CI Integration</li>
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />24/7 Premium Support SLAs</li>
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />On-Premise Deployment</li>
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />25+ Concurrent Jobs</li>
                          <li className="flex text-size-14 text-tas-500 my-15"><img src="/assets/images/landing-page/check-purple.svg" alt="" className="mr-15" />Also available on premise</li>
                        </ul>
                        <div className="mt-50">
                          <a href={`#none`} className="text-size-16 font-normal rounded px-15 py-9 smtablet:mt-10 smtablet:ml-0 bg-purple-250 text-white flex items-center text-center justify-center">
                            Contact Sales
                          </a>
                        </div>
                    </div>
                </div>
             </div>
           </div>

        </div>
      </div>
    </WebLayout>
  )
}

export default PricingPage
