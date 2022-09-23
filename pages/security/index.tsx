import React, { } from 'react'
import { NextPage } from 'next'
import WebLayout from 'components/WebLayout'

const SecurityPage: NextPage = () => {

  return (
    <WebLayout wrapper_classes="bg-white" title='Test At Scale | Security'>
      <div className="pt-50">
        <div className="container">
          <div className="smtablet:block mx-auto mb-55  w-11/12 smtablet:w-full">
            <div className="flex -mx-15 relative items-center">
              <div className="px-15 w-6/12 pt-15  smtablet:w-full">
                <div className=" pt-35">
                  <h3 className="text-size-48 text-gray-900 leading-tight font-bold tracking-wider smtablet:text-size-30 smtablet:text-center">Enterprise Grade <br/> Security, Privacy and <br/> Compliance</h3>
                  <p className="text-size-18 mt-20 font-normal text-tas-400">
                   More than 420k users trust LambdaTest Cloud Platform to scale up their development process.
                  </p>
                </div>
              </div>
              <div className="px-15 w-6/12 smtablet:hidden">
                <img src="/assets/images/landing-page/secure-illustration.svg" alt="" className="w-full"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-50">
        <div className="container">
          <div className="smtablet:block mx-auto mb-55  w-11/12 smtablet:w-full rounded p-45" style={{background: 'rgba(103, 114, 229, 0.05)'}}>
            <div className="flex -mx-15 relative items-center">
              <div className="px-15 w-6/12 smtablet:w-full">
                <div>
                  <h3 className="text-size-30 text-gray-900 leading-tight   smtablet:text-size-30 smtablet:text-center">Customer trust & data security <br/>are critical to us</h3>
                </div>
              </div>
              <div className="px-15 w-6/12 smtablet:hidden">
                <div className="flex justify-end">
                  <img src="/assets/images/landing-page/soc.svg" alt=""/>
                  <img src="/assets/images/landing-page/gdpr.svg" alt="" className="mx-25" />
                  <img src="/assets/images/landing-page/ccpa.svg" alt=""/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-50">
        <div className="container">
          <div className="smtablet:block mx-auto mb-55  w-11/12 smtablet:w-full">
            <div className="flex -mx-15 relative items-center">
              <div className="px-15 w-6/12 smtablet:w-full">
                <div>
                  <h3 className="text-size-28 text-tas-500 leading-tight   smtablet:text-size-30 smtablet:text-center mb-25">Protecting Your Rights</h3>
                  <p className="text-size-14 text-tas-500 tracking-wider leading-height-26">
                    We're committed to securing and honoring your privacy rights. We have built up a comprehensive protection compliance program, abiding to regulations such as the General Data Protection Regulation and the California Consumer Privacy Act. Read More
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-50">
        <div className="container">
          <div className="smtablet:block mx-auto mb-55  w-11/12 smtablet:w-full">
            <h3 className="text-size-28 text-tas-500 leading-tight   smtablet:text-size-30 smtablet:text-center mb-50">Ensuring Enterprise Grade Security:</h3>
            <div className="flex -mx-15 relative">
              <div className="px-15 w-3/12 smtablet:w-full">
                <div>
                  <div className="flex items-center uppercase text-size-14 tracking-wide font-medium text-tas-500 mb-12">
                    <img src="/assets/images/landing-page/grade-circle.svg" alt="" className="mr-15" />
                    Cloud Security
                  </div>
                  <div className="flex items-center uppercase text-size-14 tracking-wide font-medium text-tas-400 mb-12">
                    <img src="/assets/images/landing-page/grade-square.svg" alt="" className="mr-15" />
                    In-House Security
                  </div>
                  <div className="flex items-center uppercase text-size-14 tracking-wide font-medium text-tas-400 mb-12">
                    <img src="/assets/images/landing-page/grade-circle.svg" alt="" className="mr-15" />
                    Separate Environments
                  </div>
                  <div className="flex items-center uppercase text-size-14 tracking-wide font-medium text-tas-400 mb-12">
                    <img src="/assets/images/landing-page/grade-square.svg" alt="" className="mr-15" />
                    DOS and DDOS Mitigation
                  </div>
                  <div className="flex items-center uppercase text-size-14 tracking-wide font-medium text-tas-400 mb-12">
                    <img src="/assets/images/landing-page/grade-circle.svg" alt="" className="mr-15" />
                    Incident Management
                  </div>
                </div>
              </div>
              <div className="px-15 w-9/12 smtablet:w-full">
                <div className="pt-20">
                  <p className="text-size-14 text-tas-500 tracking-wider leading-height-26">
                    LambdaTest services are deployed on a highly secure and scalable virtual private cloud AWS platform. AWS ensures to protect all its infrastructure by taking strong measures in terms of security. AWS does not have the ability to access the LambdaTest data or its infrastructure. AWS data centers are certified as ISO 27001, PCI DSS Service Provider Level 1, and or SOC 1 and 2 compliant. Read More
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-50 pb-50">
        <div className="container">
          <div className="smtablet:block mx-auto mb-55  w-11/12 smtablet:w-full">
            <div className="flex -mx-15 relative items-center">
              <div className="px-15 w-6/12 smtablet:w-full">
                <div>
                  <h3 className="text-size-28 text-tas-500 leading-tight   smtablet:text-size-30 smtablet:text-center mb-25">Availability Status & Performance:</h3>
                  <p className="uppercase text-size-14 text-tas-500 tracking-wider leading-height-26 font-medium mb-10">Uptime Status:</p>
                  <p className="text-size-14 text-tas-500 tracking-wider leading-height-26">
                   LambdaTest offers complete transparency into real-time and historical platform status Our services are deployed in multiple data centers which are capable of scaling up automatically to handle the traffic.
                  </p>
                  <p className="uppercase text-size-14 text-tas-500 tracking-wider leading-height-26 font-medium mb-10 mt-40">Third Party Sub Processors: </p>
                  <p className="text-size-14 text-tas-500 tracking-wider leading-height-26">
                   LambdaTest uses third-party sub processors to support the application for its infrastructure and services further allowing us to provide the services to our users/customers. Read More
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WebLayout>
  )
}

export default SecurityPage
