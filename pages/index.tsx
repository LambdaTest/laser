import React, { useState } from 'react'
import { NextPage } from 'next'
import WebLayout from '../components/WebLayout'
const faq_left = [
    {
      question: 'How do I start using TAS?',
      html: [<><ul className="list-disc pl-25">
                          <li>You can simply login on the TAS portal with your existing GitHub or GitLab account. Allow necessary access to Git organisations and onboard your repositories onto TAS. Add a .tas.yml and you’re ready to go.</li>
                        </ul> </>]
    },
    {
      question: 'Will it work on my local setup?',
      html: [<><ul className="list-disc pl-25">
                          <li>Yes. Through our Self-Hosted mode, it is possible. However, test-insights will only be available on TAS portal. <a
                          target="_blank"
                           className="font-bold" href={`${process.env.NEXT_PUBLIC_DOC_HOST}/tas-self-hosted-installation/`}>Setup TAS on a self-hosted environment</a></li>
                        </ul> </>]
    },
    {
      question: 'Does TAS look inside my code?',
      html: [<><ul className="list-disc pl-25">
                          <li>In order to discover and execute the test-cases in your repository, TAS needs access to your code. However, TAS provides an option to run a repository on self-hosted environment. The test-at-scale binary (hosted on machine(s) provided by you) has the access to your code. TAS Servers store metadata only related to tests like name of testFile, testCase, testSuite. At no point, we collect the business logic of your code.</li>
                        </ul> </>]
    }
  ]

   const faq_right = [
    {
      question: 'What are the different Hosting options?',
      html: [<><ul className="list-disc pl-25">
                          <li className="mb-15"><b>TAS Cloud -</b> The entire infrastructure is managed by TAS including the “test runners” that has access to your code for running the tests. The tests in your repository will be executed on cloud runners managed by TAS.</li>
                           <li><b>Self Hosted -</b>  In this option, you need to provide the machines (and manage those machines yourselves) to run tests in your repository. TAS will only receive the tests metadata to show you the insights on TAS portal.</li>
                        </ul> </>]
    },
    {
      question: 'Will this work on an on-premise data centre.',
      html: [<><ul className="list-disc pl-25">
                          <li>Yes it will. Soon we will be bringing all of our offerings to on-prem as well. So that everything stays inside your infrastructure, including the tests metadata and TAS portal.</li>
                        </ul> </>]
    }
  ]


const LandingPage: NextPage = () => {
  const showFaq= true;
  const [toggle, setToggle] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [side, setSide] = useState('left');

  const handleToggle = (index:any, _side:any) => {
    setSide(_side);
    if(currentIndex == index  && side == _side ) {
      setToggle(!toggle);
    } else{
      setToggle(true);
    }
    setCurrentIndex(index);
  }

  return (
    <WebLayout wrapper_classes="bg-white" homepage={true}>
      <div className="py-100 smtablet:py-50">
        <div className="container">
          <div className="w-10/12 desktop:w-full mx-auto">
            <h1 className="text-size-64 font-bold text-black text-center leading-none smtablet:text-size-30 smtablet:leading-height-42 ">Test Smarter. Release Faster.</h1>
          </div>
          <p className="mt-12 text-size-18 text-tas-400 font-normal text-center m-0 tracking-wider">
            Accelerate your testing, shorten job times and get faster feedback on code changes, <br />
manage flaky tests and keep master green at all times with <strong>Test At Scale.</strong>
          </p>
          <div className="clearfix text-center mx-auto mt-40">
            <div className="inline-flex items-center">
              <a href={`https://github.com/LambdaTest/test-at-scale`} className="text-size-16 font-normal rounded px-15 py-9 smtablet:mt-10 smtablet:ml-0 bg-purple-250 text-white mr-10 inline-flex items-center" data-amplitude="tas_landing_view_on_github">
                <img src="/assets/images/landing-page/github-white.svg" alt="Github" width="20" className="mr-7" />
                View on Github <img src="/assets/images/landing-page/right_arrow_white.svg" alt="Arrow" width="7" className="ml-7" />
              </a>
              <a href={`${process.env.NEXT_PUBLIC_WEBSITE_HOST}/demo?type=TAS`} className="text-size-16 font-normal text-purple-250 bg-purple-350 rounded px-30 py-9 inline-block smtablet:mt-10 smtablet:ml-0 hover:bg-purple-250 hover:text-white" data-amplitude="tas_landing_book_demo">Book a Demo</a>
            </div>
          </div>
          <img src="/assets/images/landing-page/TAS_banner.svg" className="mx-auto" width="2576" height="1270" />
        </div>
      </div>
      <div className="pb-150 relative">
        <div className="container">
          <div className="w-8/12 desktop:w-full mx-auto">
            <div className="flex -mx-15 relative items-center justify-center">
              <div className="px-15 mr-30 smtablet:hidden">
                <img src="/assets/images/landing-page/TAS_Illustration.svg" alt="Smart" className="mx-auto" width="320"    />
              </div>
              <div className="px-15 pt-15">
                <div className="">
                  <h3 className="text-purple-850 text-size-16 font-normal tracking-wider uppercase mb-20">THE PROBLEM</h3>
                  <p className="text-purple-950 text-size-16 font-normal tracking-wider leading-6 mb-12">Development teams don’t know what subset of test cases were <br/> impacted by their latest code changes.</p>
                  <p className="text-purple-950 text-size-16 font-normal tracking-wider leading-6">
                    Hence, teams keep executing <strong className="text-black">all the tests every time</strong> in every job <br/> which is <strong className="text-black">pointless</strong> and just leads to:
                  </p>
                  <div className="flex items-center mt-40 smtablet:block">
                    <div className="flex items-center">
                      <img src={`/assets/images/landing-page/Clogged.svg`} alt="Clogged Pipelines" className="mx-auto smtablet:m-0" width="56" height="56" />
                      <p className="text-size-16 text-black font-bold tracking-wider ml-15">Clogged Pipelines</p>
                    </div>
                    <div className="flex items-center ml-40 smtablet:ml-0 smtablet:mt-10">
                      <img src={`/assets/images/landing-page/Expensive.svg`} alt="Expensive" className="mx-auto smtablet:m-0" width="56" height="56" />
                      <p className="text-size-16 text-black font-bold tracking-wider ml-15">Expensive Resources</p>
                    </div>
                  </div>
                  <div className="flex items-center mt-30 smtablet:block smtablet:mt-10">
                    <div className="flex items-center">
                      <img src={`/assets/images/landing-page/Low.svg`} alt="Low Productivity" className="mx-auto smtablet:m-0" width="56" height="56" />
                      <p className="text-size-16 text-black font-bold tracking-wider ml-15">Low Productivity</p>
                    </div>
                    <div className="flex items-center ml-50 smtablet:ml-0 smtablet:mt-10">
                      <img src={`/assets/images/landing-page/Slow.svg`} alt="Slow Release Cycles" className="mx-auto smtablet:m-0" width="56" height="56" />
                      <p className="text-size-16 text-black font-bold tracking-wider ml-15">Slow Release Cycles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="container">
          <div className="w-11/12 desktop:w-full mx-auto">
            <h3 className="text-purple-850 text-size-16 font-normal tracking-wider leading-8 uppercase text-center">INTRODUCING</h3>
            <h2 className="text-gray-900 text-size-40 font-bold tracking-wide leading-tight  mb-20 text-center smtablet:text-size-30 tablet:text-size-24">Test At Scale</h2>
            <p className="tracking-wider text-tas-400 mb-0 text-center smtablet:text-size-14 tablet:text-size-16 graytext w-8/12 mx-auto smtablet:w-full">TAS enables developers and engineering leaders
to accelerate testing, <br />reduce job times upto 95% & gain actionable visibility into their test cases.</p>
            <div className="mt-70">
              <div className="flex -mx-15 smtablet:flex-col smtablet:justify-center smtablet:items-center">
                <div className="md:w-4/12 px-15 text-center mdtablet:pr-50">
                  <div className="clearfix">
                    <img loading="lazy" src="/assets/images/landing-page/Integrate_Easily.svg" className="mx-auto" alt="Integrate Easily" title="Integrate Easily" width="48" height="48" />
                    <h2 className=" tracking-wide leading-tight text-black my-30 text-size-32 opacity-70 smtablet:text-size-24">Integrate Easily</h2>
                    <div className="text-size-16 text-tas-400   mb-40 tracking-wider">TAS brings the testing expertise into your existing workflows.</div>
                  </div>
                </div>
                <div className="md:w-4/12 px-15 text-center mdtablet:pr-50">
                  <div className="clearfix">
                    <img loading="lazy" src="/assets/images/landing-page/TAS_T.svg" className="mx-auto" alt="Test Smartly" title="Test Smartly" width="48" height="48" />
                    <h2 className=" tracking-wide leading-tight text-black my-30 text-size-32 opacity-70 smtablet:text-size-24">Test Smartly</h2>
                    <div className="text-size-16 text-tas-400   mb-40 tracking-wider">TAS selects & executes only specific tests that are impacted by the code changes</div>
                  </div>
                </div>
                <div className="md:w-4/12 px-15 text-center mdtablet:pr-50">
                  <div className="clearfix">
                    <img loading="lazy" src="/assets/images/landing-page/TAS_S.svg" className="mx-auto" alt="Deliver Frequently" title="Deliver Frequently" width="48" height="48" />
                    <h2 className=" tracking-wide leading-tight text-black my-30 mt-40 text-size-32 opacity-70 smtablet:text-size-24">Deliver Frequently</h2>
                    <div className="text-size-16 text-tas-400   mb-40 tracking-wider">TAS shortens test times enabling developers to deliver faster</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-50">
        <div className="container">
          <div className="flex smtablet:block mx-auto mb-55 items-center w-11/12 smtablet:w-full">
            <div className="flex -mx-15 relative items-center">
              <div className="px-15 w-5/12 pt-15  smtablet:w-full">
                <div className=" pt-35">
                  <h3 className="text-size-40 text-gray-900 leading-tight font-bold tracking-wider smtablet:text-size-30 smtablet:text-center">Accelerate your entire development pipeline</h3>
                  <p className="text-size-16 mt-20 font-normal tracking-wider text-tas-400">
                    TAS  Smart Test Selection intelligently interprets & runs
only the relevant subset of tests which are impacted
                  </p>
                  <ul className="pl-20 pt-10 text-tas-400"><li className="list-disc text-size-16 graytext tracking-wider leading-7">Gain up to 95% reduction in testing durations </li><li className="list-disc text-size-16 graytext tracking-wider leading-7">Get same test results, Faster.</li></ul>
                  <a target="_blank" href={`${process.env.NEXT_PUBLIC_DOC_HOST}/tas-learn-about-tas-how-tas-works/#how-it-works`} className="inline-flex items-center leading-none text-purple-400 text-size-14 ml-20 font-bold mt-20" data-amplitude="tas_landing_how_it_works">See how it works? <img src="/assets/images/landing-page/right_arrow_long_purple.svg" width="12" className="inline-block ml-5" alt="..." /></a>
                </div>
              </div>
              <div className="px-15 w-7/12 smtablet:hidden">
                <img src="/assets/images/landing-page/pipeline.png" alt="" className="w-full" style={{ position: 'relative', left: '40px' }} />
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="smtablet:pt-25">
        <div className="container">
          <div className="flex smtablet:block mx-auto mb-55 items-center w-11/12 smtablet:w-full">
            <div className="flex -mx-15 relative items-center">
              <div className="px-15 w-7/12 pr-50 smtablet:hidden">
                <img src="/assets/images/landing-page/one-stop.svg" alt="" className="w-full" style={{ position: 'relative', left: '40px' }} />
              </div>
              <div className="px-15 w-5/12 smtablet:w-full">
                <div className="">
                  <h3 className="text-size-40 text-gray-900  leading-tight font-bold tracking-wider smtablet:text-center smtablet:text-size-30">One-Stop Shop for
Analytics + Collaboration</h3>

                  <ul className="pl-20 pt-10 text-tas-400 mt-15"><li className="list-disc text-size-16 graytext  leading-7 mb-10 tracking-wider">A workflow manager for business process management and communication among teams</li><li className="list-disc text-size-16 graytext  leading-7 tracking-wider">Get visibility to KPI's like MTTR, MTBF, Flake rate, frequently failing tests and much more.</li></ul>
                <a href="/demo" className="inline-flex items-center leading-none text-purple-400 text-size-14  mt-20 font-semibold ml-23" data-amplitude="tas_landing_live_demo">
                    Live Demo <img src="/assets/images/landing-page/right_arrow_long_purple.svg" alt="" width="14" className="ml-5" /></a>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="pt-50 smtablet:pt-20">
        <div className="container">
          <div className="flex smtablet:block mx-auto mb-55 items-center w-11/12 smtablet:w-full">
            <div className="flex -mx-15 relative items-center">
              <div className="px-15 w-5/12 pt-15 smtablet:w-full">
                <div className=" pt-35 smtablet:pt-0">
                  <h3 className="text-size-40 text-gray-900 leading-tight font-bold tracking-wider smtablet:text-center smtablet:text-size-30">We’re the testing experts
so you don’t have to be</h3>

                  <ul className="pl-20 pt-10 text-tas-400 mt-10"><li className="list-disc text-size-16 graytext leading-7 tracking-wider">Find, flag, quarantine and manage flaky tests with our Flaky Test Management Pipeline.  </li><li className="list-disc text-size-16 graytext leading-7 tracking-wider">Our fully automated triaging solution finds the culprit commits that lead to failed jobs.</li></ul>
                  <a href="#none" className="inline-flex items-center leading-none text-purple-400 text-size-14 ml-20 mt-20 pointer-events-none tracking-wider">New features coming every week. Stay tuned.</a>
                </div>
              </div>
              <div className="px-15 w-7/12 pl-50 smtablet:hidden">
                <img src="/assets/images/landing-page/testing_experts.png" alt="" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-50 pb-70 smtablet:py-50">
        <div className="container">
          <h2 className="text-size-40 font-bold text-center smtablet:text-size-30">Built for your Engineering Stack</h2>
          <p className="text-size-16 text-center  font-normal w-5/12 mx-auto mb-5 mt-30 smtablet:w-full tracking-wider text-tas-400">TAS supports your favourite testing frameworks and is super easy to integrate
with your pipelines and workflows via a simple config yaml  </p>
          <div className="text-center mb-80">
            <a target="_blank" href={`${process.env.NEXT_PUBLIC_DOC_HOST}/tas-overview/`} className="inline-flex items-center leading-none text-purple-400 text-size-14" data-amplitude="tas_landing_see_documentation">See Documentation <img src="/assets/images/landing-page/right_arrow_long_purple.svg" width="12" className="inline-block  ml-5" alt="..."/></a>
          </div>
          <div className="w-10/12 mx-auto smtablet:w-full">
            <div className="text-center bg-purple-450 px-0 pt-85 pb-65 flex items-start smtablet:block" style={{borderRadius: '15px'}}>
           <div className="w-6/12 smtablet:w-full">
              <div style={{maxWidth: '500px'}} className="text-center mx-auto">
              <div className="text-center inline-block">
                <div className="w-95 h-95 mx-23 flex items-center justify-center  border-transparent rounded-lg tas_build bg-purple-60" style={{background: 'rgba(237, 236, 255, 0.1)'}}>
                  <img loading="lazy" src="/assets/images/landing-page/Jest.svg" className="" alt="Jest" width="48" height="48" />
                </div>
                <p className="text-size-12 text-white font-normal tracking-wide mt-10">Jest</p>
              </div>
              <div className="text-center inline-block">
                <div className="w-95 h-95 mx-23 flex items-center justify-center  border-transparent rounded-lg tas_build bg-purple-60" style={{background: 'rgba(237, 236, 255, 0.1)'}}>
                  <img loading="lazy" src="/assets/images/landing-page/FrameworkMocha.svg" className="" alt="mocha" width="48" height="48" />
                </div>
                <p className="text-size-12 text-white font-normal tracking-wide mt-10">Mocha</p>
              </div>
              <div className="text-center inline-block">
                <div className="w-95 h-95 mx-23 flex items-center justify-center  border-transparent rounded-lg tas_build bg-purple-60" style={{background: 'rgba(237, 236, 255, 0.1)'}}>
                  <img loading="lazy" src="/assets/images/landing-page/Jasmine.svg" className="" alt="Jasmine" width="48" height="48" />
                </div>
                <p className="text-size-12 text-white font-normal tracking-wide mt-10">Jasmine</p>
              </div>
               <div className="text-center inline-block mt-30">
                <div className="w-95 h-95 mx-23 flex items-center justify-center border border-gray-700 rounded-lg tas_build bg-transparent">
                  <img loading="lazy" src="/assets/images/landing-page/Python.svg" className="" alt="Python" width="48" height="48" />
                </div>
                <p className="text-size-12 text-white font-normal tracking-wide mt-10">Python</p>
              </div>
              <div className="text-center inline-block mt-30">
                <div className="w-95 h-95 mx-23 flex items-center justify-center border border-gray-700 rounded-lg tas_build bg-transparent">
                  <img loading="lazy" src="/assets/images/landing-page/J_Unit.svg" className="" alt="JUnit" width="48" height="48" />
                </div>
                <p className="text-size-12 text-white font-normal tracking-wide mt-10">JUnit</p>
              </div>
              <div className="text-center inline-block">
                <div className="w-95 h-95 mx-23 flex items-center justify-center border border-gray-700 rounded-lg tas_build bg-transparent">
                  <img loading="lazy" src="/assets/images/landing-page/RobotFramework.svg" className="" alt="Robot Framework" width="48" height="48" />
                </div>
                <p className="text-size-12 text-white font-normal tracking-wide mt-10">Robot Framework</p>
              </div>
            </div>
           </div>
           <div className="w-6/12 relative smtablet:w-full">
             <img src="/assets/images/landing-page/lang_code.svg" alt="..." className="w-full smtablet:hidden" style={{position: 'absolute', top: '-70px', width: '120%', maxWidth: '120%', left: '-105px'}} />
             <img src="/assets/images/landing-page/lang_code.svg" className="hidden smtablet:block" />
           </div>
          </div>
          </div>
        </div>
      </div>
      <div className="py-100 my-100 smtablet:my-15  smtablet:py-30" style={{background: 'rgba(103, 114, 229, 0.05)'}}>
        <div className="container">
          <div className="flex smtablet:block mx-auto mb-55 items-center w-11/12 smtablet:w-full">
            <div className="flex -mx-15 relative items-center">
              <div className="px-15 w-5/12 pt-15 smtablet:w-full">
                <div className=" pt-35">
                  <h3 className="text-size-40 text-gray-900 leading-tight font-bold tracking-wider smtablet:text-left smtablet:mb-10 smtablet:text-size-30">Open-source < br />
and Always free <img loading="lazy" src="/assets/images/landing-page/heart.png" className="mx-auto inline-block w-30" alt="..." width="22" height="19" /></h3>

                  <a href={`https://github.com/LambdaTest/test-at-scale`} className="text-size-14 font-normal rounded px-10 py-10 mt-35 smtablet:mt-10 smtablet:ml-0 bg-purple-250 text-white mr-10 inline-flex items-center" data-amplitude="tas_landing_os_view_on_github">
                    <img src="/assets/images/landing-page/github-white.svg" alt="Github" width="20" className="mr-7" />
                    View on Github <img src="/assets/images/landing-page/right_arrow_white.svg" alt="Arrow" width="7" className="ml-7" />
                  </a>
                  <p className="mt-25 tracking-wider">
                    TAS cloud is free for Open source & educational projects.
Includes hosting and smart features.
                  </p>
                  <a target="_blank" href="https://discord.com/invite/Wyf8srhf6K " className="inline-flex items-center leading-none text-purple-400 text-size-14  mt-20 font-semibold" data-amplitude="tas_landing_os_join_TAS_discord">
                    Join TAS Community on Discord <img src="/assets/images/landing-page/right_arrow_long_purple.svg" alt="" width="14" className="ml-5" /></a>
                </div>
              </div>
              <div className="px-15 w-7/12 pl-50 smtablet:hidden">
                <img src="/assets/images/landing-page/open-source.svg" alt="" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-100 smtablet:pb-50 ">
        <div className="container">
          <div className="w-11/12 desktop:w-full mx-auto flex items-center rounded-lg bg-purple-450 ">
            <div className="w-6/12 mx-auto pl-60 py-20 smtablet:w-full smtablet:pl-30">
              <h3 className="text-white text-size-36 font-bold tracking-wide smtablet:text-size-30">Ready to get started?</h3>
              <p className="text-white text-size-16 font-normal my-20 tracking-wider">Setup is a breeze. Accelerate your testing today with TAS. <br />
No credit card required.</p>
<span className="inline-block mr-20">
<a href={`/login`} className="text-size-16 font-normal text-gray-900 rounded px-20 py-15 inline-block   bg-white hover:bg-purple-250 hover:text-white smtablet:mb-10" data-amplitude="tas_landing_get_started_try_tas_for_free">Try for free</a>
</span>
<span className="inline-block custom_g_border p-1 rounded">
<a href={`${process.env.NEXT_PUBLIC_WEBSITE_HOST}/demo?type=TAS`} className="text-size-16 font-normal text-white rounded px-20 py-15 inline-block  bg-gray-800 hover:bg-purple-250 hover:text-white" data-amplitude="tas_landing_get_started_book_demo">Book a Demo</a>
</span>

            </div>
            <div className="w-6/12 mx-auto smtablet:hidden">
              <img loading="lazy" src="/assets/images/landing-page/Design.svg" className="mx-auto" alt="..." width="2385" height="1280"></img>
            </div>
          </div>
        </div>
      </div>
      {showFaq && <div className="mb-50">
        <div className="container">
          <div className='w-11/12 desktop:w-full mx-auto rounded-lg'>
            <h2 className="text-size-40 text-black font-bold mb-30 smtablet:text-size-30">Frequently Asked Questions</h2>
            <div className="flex -mx-15 relative smtablet:block">
              <div className="px-15 w-6/12 smtablet:w-full">
                  <ul className="faq__wrapper">
                    {faq_left && faq_left.length > 0 && faq_left.map((list, index) => (
                         <li className="faq__list">
                          <div className="faq__header" onClick={() => {handleToggle(index, 'left')}}>
                            <span>{list.question}</span>
                            <span className="text-size-24">
                              {toggle && side == 'left' && currentIndex == index ? '-' : '+'}
                            </span>
                          </div>
                          <div className={`py-15 ${toggle && side == 'left' && currentIndex == index ? 'block' : 'hidden'}`}>
                            {list.html}
                          </div>
                        </li>
                    ))}
                  </ul>
              </div>
              <div className="px-15 w-6/12  smtablet:w-full">
                <ul className="faq__wrapper">
                    {faq_right && faq_right.length > 0 && faq_right.map((list, index) => (
                         <li className="faq__list">
                          <div className="faq__header" onClick={() => {handleToggle(index, 'right')}}>
                            <span>{list.question}</span>
                            <span className="text-size-24">
                              {toggle && side == 'right' && currentIndex == index ? '-' : '+'}
                            </span>
                          </div>
                          <div className={`py-15 ${toggle && side == 'right' && currentIndex == index ? 'block' : 'hidden'}`}>
                            {list.html}
                          </div>
                        </li>
                    ))}
                  </ul>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </WebLayout>
  )
}

export default LandingPage
