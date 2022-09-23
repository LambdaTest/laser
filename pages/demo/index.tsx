import React, { useRef, useState } from 'react'
import { NextPage } from 'next'
import WebLayout from 'components/WebLayout'
import Row from 'components/Tags/Row'
import Col from 'components/Tags/Col'
import { toast } from 'react-toastify'
import { httpPost } from 'redux/httpclient'
import { errorInterceptor } from 'redux/helper'
import Link from 'next/link'


const DemoPage: NextPage = () => {
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
    if (true) {
      // @ts-ignore
      const { first_name, last_name, email_id, company } = form.current;
      if (first_name.value.replace(/\s{2,}/g, ' ').trim()  === '') {
        toast.error('First name can not be empty');
        return;
      }
      if (last_name.value.replace(/\s{2,}/g, ' ').trim()  === '') {
        toast.error('Last name can not be empty');
        return;
      }
      if (email_id.value.replace(/\s{2,}/g, ' ').trim()  === '') {
        toast.error('Email id can not be empty');
        return;
      }
      if (email_id.value.replace(/\s{2,}/g, ' ').trim()  && !validateEmail(email_id.value)) {
        toast.error('Please enter a valid email address.');
        return;
      }

      if (company.value.replace(/\s{2,}/g, ' ').trim()  === '') {
        toast.error('Company can not be empty');
        return;
      }

      let formdata = {
        first_name: first_name.value.replace(/\s{2,}/g, ' ').trim(),
        last_name: last_name.value.replace(/\s{2,}/g, ' ').trim(),
        email_id: email_id.value.replace(/\s{2,}/g, ' ').trim(),
        company: company.value.replace(/\s{2,}/g, ' ').trim(),
      };

      httpPost(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/demo/info`, formdata)
        .then(data => {
            console.log(data)
            setLoading(false)
            toast.success('Thank You!');
            form.current?.reset();

            if(window) {
             window.location.href = `${window.location.origin}/github/arjun-rathi/rheostat/jobs/`;
            }

        }).catch((error) => {
            setLoading(false)
            errorInterceptor(error)
        })
    }
  }

  return (
    <WebLayout wrapper_classes="bg-gray-10" hide_header={true} hide_footer={true}>
      <div className="py-100 pt-50 smtablet:py-50 h-screen flex justify-center items-center">
        <div>
          <Link href="/">
            <a className='absolute right-0 top-0 mt-25 mr-25'>
              <img src="/assets/images/icon/cross.svg" className='bg-white p-8 rounded' width={30} height={30} />
            </a>
          </Link>
        </div>
        <div className="container">
          <div className="w-10/12 desktop:w-full mx-auto">
            <div className='mb-45'>
              <div className="flex justify-center mb-50">
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
                <p className='text-center text-size-12 text-tas-500 mt-10'>You’ll be redirected to Live demo after the form submission</p>
            </div>
          </div>
          <form action="" className="form" ref={form}>
            <div className="demo__box py-45 px-56 bg-white">
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
                    <span className="block input-control-label">Business Email</span>
                    <input type="text" placeholder="Enter business email id" className="input-control" name='email_id' />
                  </Col>
              </Row>
              <Row gutter="7">
                  <Col className="w-full" gutter="7">
                    <span className="block input-control-label">Company Name</span>
                    <input type="text" placeholder="Enter company name" className="input-control" name='company' />

                    <button className="mt-30 text-size-16 font-normal rounded px-15 py-9 smtablet:mt-10 smtablet:ml-0 bg-purple-250 text-white mr-10 inline-flex items-center" onClick={handleSubmitForm}>
                          Submit {loading && <div className='loader ml-10'></div>}
                    </button>
                  </Col>
              </Row>
            </div>
          </form>
        </div>
      </div>
    </WebLayout>
  )
}

export default DemoPage
