import React from 'react'
import Link from 'next/link'
import _ from "underscore";
import dynamic from 'next/dynamic'
import Text from '../Tags/Text';
import BuildLink from '../Build/Link';
const VerticalLine = dynamic(() => import('../../Graphs/VerticalLine'))
const Duration = dynamic(() => import('../Duration'))
const TasLink = dynamic(() => import('../TasLink'))

const TestListDetails = ({testId, repo, git_provider, org, testDetails, currentTestId, isTestDetailsFetching}: any) => {
    return (
        <div className="w-12/12 w-full p-30 cursor-auto">
                    {
                       currentTestId &&  testDetails && testDetails.length > 0 ?
                       <>
                       <div className="flex py-10 items-center font-medium justify-between text-size-12 text-tas-400">
                            <div className="px-15 w-3/12 pl-0">
                                <span className="flex">Tests Run</span>
                            </div>
                            <div className="px-15 w-4/12">
                                <span className="flex">Jobs</span>
                            </div>
                            <div className="px-15 w-5/12">
                                <span className="flex">Commit</span>
                            </div>
                            <div className="px-15 w-3/12">
                                <span className="flex">Author</span>
                            </div>
                        </div>
                       {testDetails.map((el: any, index: number) => (
                            <div className={`flex bg-white py-10 items-center border border-gray-300  justify-between ${index + 1 === testDetails.length ? '' : 'border-b-0'}`} key={el.id}>
                                <div className="px-15 w-3/12 inline-flex items-center">
                                    <div className="inline-flex items-center">
                                        <VerticalLine className="mmw5 h-inherit self-stretch rounded-lg mr-17" type={el.status} />
                                        <span><Duration value={el.duration} /></span>
                                    </div>
                                </div>
                                <div className="px-15 w-4/12 inline-flex items-center">
                                    <span className="flex items-center">
                                       <BuildLink
                                           id={el.build_id}
                                           link
                                           type={el.build_tag}
                                       />
                                    </span>
                                </div>
                                <div className="px-15 w-5/12 inline-flex items-center">
                                    <div className="inline-flex items-center">
                                        <span className="flex items-center"><img src="/assets/images/yellow-2.svg" alt="" className="mr-7 h-10" />
                                            <TasLink id={el.commit_id} path="commits" />
                                        </span>
                                    </div>
                                </div>
                                <div className="px-15 w-3/12 inline-flex items-center">
                                    <span className="flex ">{el.commit_author}</span>
                                </div>
                            </div>
                        ))}
                        <div className="flex  py-7 pb-5 items-center">
                            <div className="inline-flex items-center">
                                <Link href={`/${git_provider}/${org}/${repo}/tests/${testId}`}>
                                    <a><Text size="span">See all</Text></a>
                                </Link>
                            </div>
                        </div>
                        </> : <span>{!isTestDetailsFetching && "No data found."}</span>
                    }
                </div>
    )
}


export default React.memo(TestListDetails, (prevProps, nextProps) => {
    if(prevProps.currentTestId !== nextProps.currentTestId) {
     return true
    }
    return false;
    })