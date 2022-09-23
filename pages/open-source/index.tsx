import React, { useEffect, useRef, useState } from 'react'
import { NextPage } from 'next'
import WebLayout from 'components/WebLayout'
import Row from 'components/Tags/Row';
import Col from 'components/Tags/Col';
import { httpPost } from 'redux/httpclient';
import { errorInterceptor } from 'redux/helper';
import { toast } from 'react-toastify';
import { createCookieGitProvider } from 'helpers/genericHelpers';
import Link from 'next/link';

const OpenSourcePage: NextPage = () => {

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlide = () => {
     setTimeout(() => {
       if(currentSlide === 2) {
        setCurrentSlide(0)
       } else {
          setCurrentSlide(currentSlide+1)
       }
     }, 14500);
  }

  useEffect(() => {
    handleSlide();
  }, [currentSlide])


  const [modalState, setModalState] = useState(false);

  const handleToggleModal = () => {
    setModalState(!modalState);
  }

  const [loading, setLoading] = useState(false)
  let form = useRef<HTMLFormElement>(null);

  const validateEmail = (email:any) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    if(loading) {
      return;
    }
     setLoading(true);
      // @ts-ignore
      const { first_name, last_name, email_id, repository_link, description } = form.current;
      if (first_name.value.replace(/\s{2,}/g, ' ').trim() === '') {
        toast.error('First name can not be empty');
        setLoading(false);
        return;
      }
      if (last_name.value.replace(/\s{2,}/g, ' ').trim() === '') {
        toast.error('Last name can not be empty');
        setLoading(false);
        return;
      }
      if (email_id.value.replace(/\s{2,}/g, ' ').trim() === '') {
        toast.error('Email id can not be empty');
        setLoading(false);
        return;
      }
      if (email_id.value.replace(/\s{2,}/g, ' ').trim() && !validateEmail(email_id.value)) {
        toast.error('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      if (repository_link.value.replace(/\s{2,}/g, ' ').trim() === '') {
        toast.error('Repository link can not be empty');
        setLoading(false);
        return;
      }
      if(description.value.replace(/\s{2,}/g, ' ').trim().length > 250) {
        toast.error('Project description should be less than 250 characters.');
        setLoading(false);
        return;
      }

      let formdata = {
        first_name: first_name.value.replace(/\s{2,}/g, ' ').trim(),
        last_name: last_name.value.replace(/\s{2,}/g, ' ').trim(),
        email_id: email_id.value.replace(/\s{2,}/g, ' ').trim(),
        repository_link: repository_link.value.replace(/\s{2,}/g, ' ').trim(),
        description: description.value.replace(/\s{2,}/g, ' ').trim()
      };

      httpPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/eligibility-info`, formdata)
        .then(data => {
            console.log(data)
            setLoading(false)
            setModalState(false);
            toast.success('Thank You!');
            form.current?.reset();

            setLoading(false);
        }).catch((error) => {
            setLoading(false)
            errorInterceptor(error)
            setLoading(false);
        })
  }


  return (
     <>
    <WebLayout wrapper_classes="bg-white logo_white open__source__page" title='Test At Scale | Open Source'>
      <div className="pt-50 bg-purple-450 open_source_first_fold">
        <div className="container pt-100">
          <div className="smtablet:block mx-auto  w-11/12 smtablet:w-full">
            <div className="flex -mx-15 relative items-center justify-between">
              <div className="px-15 w-6/12 pt-15  smtablet:w-full">
                <div>
                  <h3 className="text-size-48 text-white leading-tight font-bold tracking-wider smtablet:text-size-30 smtablet:text-center">TAS for Open Source</h3>
                  <p className="text-size-18 mt-20 font-normal text-white">
                  With hundreds of contributors, thousands of pull requests, and long build cycles, it's hard to evaluate and keep shipping the code contributions at a high velocity.
                  </p>
                  <p className="text-size-18 mt-20 font-normal text-white">
                    TAS provides faster feedback to your contributors by only executing the tests that matter, hence reducing the build duration and boosting your team's productivity.
                  </p>
                  <p className="text-size-22 mt-20 font-bold text-white mb-25">
                    Test Smarter and Ship Faster with TAS
                  </p>
                  <div className="flex items-center">
                    <a href={`/login`} className="text-size-16 font-normal rounded px-15 py-9 smtablet:mt-10 smtablet:ml-0 bg-purple-250 text-white mr-10 inline-flex items-center text-center justify-center" style={{minWidth: '160px'}}>
                      Try for Free
                    </a>

                    <a href={`https://github.com/LambdaTest/test-at-scale`} className="text-size-16 font-normal rounded px-15 py-9 smtablet:mt-10 smtablet:ml-0 bg-purple-350 text-black mr-10 inline-flex items-center" style={{minWidth: '160px'}}>
                      <img src="/assets/images/landing-page/github-black.svg" alt="Github" width="20" className="mr-7" />
                      View on Github
                    </a>
                  </div>
                </div>
              </div>
              <div className="px-15 w-4/12 smtablet:hidden">
                <div className="flex justify-end">
                  <img src="/assets/images/landing-page/open-source-rocket.svg" alt="" className="w-full"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-80">
        <div className="container">
          <div className="w-11/12 desktop:w-full mx-auto">
            <h2 className="text-gray-900 text-size-40 font-bold tracking-wide leading-tight  mb-20 text-center smtablet:text-size-30 tablet:text-size-24">How can TAS Help?</h2>
            <p className="tracking-wide text-tas-500 mb-0 text-center smtablet:text-size-14 tablet:text-size-16 w-8/12 mx-auto smtablet:w-full">Test at Scale (TAS) is a free tool for open source projects to help contributors accelerate their testing, shorten job times and get faster feedback on code changes and open PRs. </p>
            <div className="mt-70">
              <div className="flex -mx-15 relative items-center">
                <div className="px-15 w-5/12 pt-15  smtablet:w-full">
                  <div className=" pt-35">
                    <div className={`inline-flex items-start osp__item ${currentSlide === 0 ? 'active' : ''}`}>
                      <div className='inline-flex relative svg__border__animation__parent'>
                        <svg width="50" height="50" className='svg__border__animation'>
                         <path className="path"
                         d="M15,10 h24
                            a5,5 0 0 1 5,5 v24
                            a5,5 0 0 1 -5,5 h-24
                            a5,5 0 0 1 -5,-5 v-24
                            a5,5 0 0 1 5,-5 z" fill="none" stroke="#E1E0FC" stroke-width="3" />
                        </svg>
                        <img src={`/assets/images/landing-page/icon-1.svg`} alt="" className="mx-auto smtablet:m-0 inline-block" width="32" height="32" />
                      </div>
                      <div className="pl-20">
                        <p className="text-size-18 text-black font-bold tracking-wide mb-10">Accelerate your entire development pipeline</p>
                        <div className="osp__item__content">
                          <p className="text-size-16 text-tas-350">
                            TAS  Smart Test Selection intelligently interprets & runs
                            only the relevant subset of tests which are impacted
                          </p>
                          <ul className="pl-20 pt-10 text-tas-350"><li className="list-disc text-size-16 graytext tracking-wide leading-7">Gain up to 95% reduction in testing durations </li><li className="list-disc text-size-16 graytext tracking-wide leading-7">Get same test results, Faster.</li></ul>
                        </div>
                      </div>
                    </div>
                    <div className={`inline-flex items-start mt-25 osp__item ${currentSlide === 1 ? 'active' : ''}`}>
                      <div className='inline-flex relative svg__border__animation__parent active'>
                        <svg width="50" height="50" className='svg__border__animation'>
                         <path className="path"
                            d="M15,10 h24
                            a5,5 0 0 1 5,5 v24
                            a5,5 0 0 1 -5,5 h-24
                            a5,5 0 0 1 -5,-5 v-24
                            a5,5 0 0 1 5,-5 z" fill="none" stroke="#E1E0FC" stroke-width="3" />
                        </svg>
                        <img src={`/assets/images/landing-page/icon-3.svg`} alt="" className="mx-auto smtablet:m-0" width="32" height="32" />
                      </div>
                      <div className="pl-20">
                        <p className="text-size-18 text-black font-bold tracking-wide">One-Stop Shop for Analytics + Collaboration</p>
                        <div className="osp__item__content">
                            <ul className="pl-20 pt-10 text-tas-350 mt-15"><li className="list-disc text-size-16 graytext  leading-7 mb-10 tracking-wider">A workflow manager for business process management and communication among teams</li><li className="list-disc text-size-16 graytext  leading-7 tracking-wider">Get visibility to KPI's like MTTR, MTBF, Flake rate, frequently failing tests and much more.</li></ul>
                        </div>

                      </div>
                    </div>
                    <div className={`inline-flex items-start mt-25 osp__item ${currentSlide === 2 ? 'active' : ''}`}>
                      <div className='inline-flex relative svg__border__animation__parent active'>
                        <svg width="50" height="50" className='svg__border__animation'>
                         <path className="path"
                          d="M15,10 h24
                          a5,5 0 0 1 5,5 v24
                          a5,5 0 0 1 -5,5 h-24
                          a5,5 0 0 1 -5,-5 v-24
                          a5,5 0 0 1 5,-5 z" fill="none" stroke="#E1E0FC" stroke-width="3" />
                        </svg>
                        <img src={`/assets/images/landing-page/icon-2.svg`} alt="" className="mx-auto smtablet:m-0" width="32" height="32" />
                      </div>

                      <div className="pl-20">
                        <p className="text-size-18 text-black font-bold tracking-wide">We’re the testing experts so you
                        don’t have to be</p>
                        <div className="osp__item__content">
                          <ul className="pl-20 pt-10 text-tas-350 mt-10"><li className="list-disc text-size-16 graytext leading-7 tracking-wider">Find, flag, quarantine and manage flaky tests with our Flaky Test Management Pipeline.  </li><li className="list-disc text-size-16 graytext leading-7 tracking-wider">Our fully automated triaging solution finds the culprit commits that lead to failed jobs.</li></ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-15 w-7/12 smtablet:hidden">
                  <img src="/assets/images/landing-page/pipeline.png" alt="" className={`osp_slide_img w-full ${currentSlide === 0 ? 'block' : 'hidden'}`} />
                  <img src="/assets/images/landing-page/one-stop.svg" alt="" className={`osp_slide_img w-full ${currentSlide === 1 ? 'block' : 'hidden'}`} />
                  <img src="/assets/images/landing-page/testing_experts.png" alt="" className={`osp_slide_img w-full ${currentSlide === 2 ? 'block' : 'hidden'}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-80 pb-80">
        <div className="container">
          <div className="w-11/12 desktop:w-full mx-auto">
            <h2 className="text-gray-900 text-size-40 font-bold tracking-wide leading-tight  mb-20 smtablet:text-size-30 tablet:text-size-24">TAS Open Source Programme</h2>
            <div >
              <div className="flex -mx-15 relative items-center">
                <div className="px-15 w-7/12 pt-15  smtablet:w-full">
                  <div className=" pt-35">
                    <div className="inline-flex items-start">
                      <img src={`/assets/images/landing-page/icon-4.svg`} alt="" className="mx-auto smtablet:m-0" width="48" height="48" />
                      <div className="pl-25">
                        <p className="text-size-32 text-tas-350 tracking-wide mb-10">TAS for free</p>
                        <p className="text-size-16 text-tas-350">
                         Maintainers & Contributors get a generous free plan for up to 3000 credits a month on our cloud.  For projects that run their own infra TAS Self Hosted licenses are also available.
                        </p>

                      </div>
                    </div>
                    <div className="inline-flex items-start  mt-50">
                      <img src={`/assets/images/landing-page/icon-5.svg`} alt="" className="mx-auto smtablet:m-0" width="48" height="48" />
                      <div className="pl-25">
                        <p className="text-size-32 text-tas-350 tracking-wide mb-10">Personal onboarding</p>
                        <p className="text-size-16 text-tas-350">
                         We are here to help you with getting started and can provide ongoing support for maintaining the .tas.yml [this will link to yaml docs] if you want.
                        </p>

                      </div>
                    </div>
                    <div className="inline-flex items-start mt-50">
                      <img src={`/assets/images/landing-page/icon-6.svg`} alt="" className="mx-auto smtablet:m-0" width="48" height="48" />
                      <div className="pl-25">
                        <p className="text-size-32 text-tas-350 tracking-wide mb-10">Special treats</p>
                        <p className="text-size-16 text-tas-350">
                         Get free goodies. Chance to become our open source ambassador or a full time working opportunity with us.
                        </p>

                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-15 w-5/12 smtablet:hidden">
                  <div className="flex justify-end"><img src="/assets/images/landing-page/open-source-img.svg" alt="" width="392" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-80 pb-80">
        <div className="container">
          <div className="flex -mx-15 relative items-center">
          <div className="px-15 w-4/12 smtablet:hidden">
            <div className="flex justify-center"><img src="/assets/images/landing-page/Artwork.svg" alt="" width="320" /></div>
          </div>
          <div className="w-8/12 desktop:w-full mx-auto">
            <h2 className="text-gray-900 text-size-40 font-bold tracking-wide leading-tight  mb-25 smtablet:text-size-30 tablet:text-size-24">Eligibility criteria</h2>

            <div >
              <div className="flex -mx-15 relative items-center">
                <div className="px-15 w-11/12 pt-15  smtablet:w-full">
                  <div className="">
                    <div className="inline-flex items-start">
                      <div className="pl-25">
                        <p className="text-size-18 text-black mb-25">
                        To qualify for our Opensource program, need to meet one of these criteria
                        </p>
                        <ul className="pl-20 pt-10 text-black"><li className="list-disc text-size-16 text-black mb-10 tracking-wide leading-7">You are a maintainer, core contributor to a well-established free software or open-source project.</li>
                        <li className="list-disc text-size-16 text-black mb-10 tracking-wide leading-7">You regularly contribute to free software or open source communities in other ways (e.g. producing regular content like blog posts, videos, live streams, translations, or organising meet-ups, conferences, hackathons, etc).</li>
                        <li className="list-disc text-size-16 text-black mb-10 tracking-wide leading-7">
                          You are an author, core contributor of any widely used testing framework such as jest, mocha, etc or of developer tools such as build systems, programming languages, compilers.
                        </li>
                         <li className="list-disc text-size-16 text-black mb-10 tracking-wide leading-7">
                           A significant part of your income (employment or via community support) is from maintaining or producing open source work.
                         </li>
                        </ul>
                        <span onClick={handleToggleModal} className="text-size-16 font-normal rounded px-15 py-9 smtablet:mt-10 smtablet:ml-0 bg-purple-250 text-white mr-10 inline-flex items-center text-center justify-center mt-15 cursor-pointer" style={{minWidth: '120px'}}>
                          Apply Now
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      <div className="pb-100 smtablet:pb-50 ">
        <div className="container">
          <div className="flex -mx-15">
            <div className="w-11/12 desktop:w-full mx-auto flex items-center rounded-lg bg-purple-450 ">
            <div className="w-6/12 mx-auto pl-60 py-20 smtablet:w-full smtablet:pl-30">
              <h3 className="text-white text-size-36 font-bold tracking-wide smtablet:text-size-30">Test smarter, Ship Faster.</h3>
              <p className="text-white text-size-16 font-normal tracking-wider">Join us in shipping healthy code faster, today.</p>
              <div className="flex items-center mt-35">
                <span className="inline-block mr-20">
              <a href={`/login`} className="text-size-16 font-medium text-gray-900 rounded px-20 py-15 inline-block   bg-white hover:bg-purple-250 hover:text-white smtablet:mb-10">Signup Now</a>
              </span>
              <span className="inline-block custom_g_border h-54 p-1 rounded">
              <a onClick={() => createCookieGitProvider('github')} href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/login/github`} className="text-size-16 font-normal text-white rounded px-10 py-10 inline-flex  bg-gray-800 hover:bg-purple-250 hover:text-white">
                <img loading="lazy" src="/assets/images/landing-page/github-white.svg" className="mx-auto" alt="..." width="33" />
              </a>
              </span>
              <span className="inline-block custom_g_border h-54 p-1 rounded  mx-5">
              <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/login/gitlab`}
                        onClick={() => createCookieGitProvider('gitlab')} className="text-size-16 font-normal text-white rounded px-10 py-10 inline-flex  bg-gray-800 hover:bg-purple-250 hover:text-white">
                <img loading="lazy" src="/assets/images/landing-page/gitlab-white.svg" className="mx-auto" alt="..." width="36"  height="30"  />
              </a>
              </span>
              <span className="inline-block custom_g_border h-54 p-1 rounded">
              <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/login/bitbucket`}
                        onClick={() => createCookieGitProvider('bitbucket')} className="text-size-16 font-normal text-white rounded px-10 py-10 inline-flex  bg-gray-800 hover:bg-purple-250 hover:text-white">
                <img loading="lazy" src="/assets/images/landing-page/bitbucket-white.svg" className="mx-auto" alt="..." width="35"  />
              </a>
              </span>
              </div>

            </div>
            <div className="w-6/12 mx-auto smtablet:hidden">
              <img loading="lazy" src="/assets/images/landing-page/Design.svg" className="mx-auto" alt="..." width="2385" height="1280"></img>
            </div>
          </div>
          </div>
        </div>
      </div>



    </WebLayout>

     {modalState && <div className="osp__form__box bg-gray-10">
       <form action="" className="form"
       ref={form}
       >
         <div className="w-10/12 desktop:w-full mx-auto">
            <div className='mb-30'>
              <div className="flex justify-center mb-20">
                <Link href="/">
                  <a>
                    <img
                      src="/assets/images/landing-page/logo.svg"
                      alt="Logo"
                      width="226"
                      height="26"
                      className="logo__img"
                    />
                  </a>
                </Link>
              </div>
              <h1 className="text-size-24 font-bold text-black text-center leading-none smtablet:leading-height-42  ">We'd want to learn more about you</h1>
            </div>
          </div>
       <div>
            <span className='absolute right-0 top-0 mt-25 mr-25'>
              <img src="/assets/images/icon/cross.svg" className='bg-white p-8 rounded cursor-pointer' width={30} height={30}  onClick={handleToggleModal}/>
            </span>
        </div>
            <div className="demo__box py-45 px-56 bg-white ">
              <Row gutter="7" className="mb-30">
                  <Col size="6" gutter="7">
                    <span className="block input-control-label">First Name</span>
                    <input type="text" placeholder="Enter first name" className="input-control" name='first_name' />
                  </Col>
                  <Col size="6" gutter="7">
                    <span className="block input-control-label">Last Name</span>
                    <input type="text" placeholder="Enter last name" className="input-control" name='last_name' />
                  </Col>
              </Row>
              <Row gutter="7" className="mb-30">
                  <Col className="w-full" gutter="7">
                    <span className="block input-control-label">Email id</span>
                    <input type="text" placeholder="Enter email id" className="input-control" name='email_id' />
                  </Col>
              </Row>
               <Row gutter="7" className="mb-30">
                  <Col className="w-full" gutter="7">
                    <span className="block input-control-label">Repository Link</span>
                    <input type="text" placeholder="Enter Repository Link" className="input-control" name='repository_link' />
                  </Col>
              </Row>
              <Row gutter="7">
                  <Col className="w-full" gutter="7">
                    <span className="block input-control-label">Project Description</span>
                    <textarea className='border w-full block rounded p-10 text-size-12' name="description" placeholder="Write description..."></textarea>
                    <button className="mt-30 text-size-16 font-normal rounded px-15 py-9 smtablet:mt-10 smtablet:ml-0 bg-purple-250 text-white mr-10 inline-flex items-center" onClick={handleSubmitForm}>
                          Submit {loading && <div className='loader ml-10'></div>}
                    </button>
                  </Col>
              </Row>
            </div>
          </form>
          </div>}
    </>
  )
}

export default OpenSourcePage
