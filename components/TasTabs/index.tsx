
import ActiveSynapses from 'components/ActiveSynapses';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Select from 'react-dropdown-select';
import { useSelector } from 'react-redux';
import _ from 'underscore';
import { getCookieOrgName, writeCookie, getCookieTasRepoBranch, getCookieGitProvider, getAuthToken, logAmplitude } from '../../helpers/genericHelpers';
import TasTabsProp from '../../interfaces/TasTabs';
import { errorInterceptor } from '../../redux/helper';
import { httpGet } from '../../redux/httpclient';
import Text from '../Tags/Text';

let tabs = [
    {
        tabname: "Jobs",
        tabId: "jobs",
        pathname: 'jobs',
        amplitude_event_code: 'job'
    },
    {
        tabname: "Tests",
        tabId: "tests",
        pathname: 'tests',
        amplitude_event_code: 'test'
    },
    {
        tabname: "Test Suite",
        tabId: "test_suite",
        pathname: 'tests-suites',
        amplitude_event_code: 'test_suite'
    },
    {
        tabname: "Commits",
        tabId: "commits",
        pathname: 'commits',
        amplitude_event_code: 'commit'
    },
    // {
    //     tabname: "Contributors",
    //     tabId: "contributors",
    //     pathname: 'contributors'
    // },
    {
        tabname: "Insights",
        tabId: "analytics",
        pathname: 'insights',
        amplitude_event_code: 'insight'
    },
    {
        tabname: "Settings",
        tabId: "settings",
        pathname: 'settings',
        amplitude_event_code: 'setting'
    }
]

export default function TasTabs({activeTab, pagination, showtabs=true, fetching=false, details_page=true}: TasTabsProp) {
    const router = useRouter();
    const persistData = useSelector((state: any) => state.persistData, _.isEqual);
    const { currentOrg }: any = persistData;
    const { repo, provider, org } = router.query;
    const [loading, setLoading] = useState(false)
    const [mappedBranches, setMappedBranches] = useState([]);
    const [currentBranch, setCurrentBranch] = useState({label: 'All Branches', value: ''});
    const changeBranch = (value:any) => {
        if(value && value.length > 0) {
            setCurrentBranch(value[0])
            writeCookie('tas_repo_branch', value[0].value);
            router.reload();
        }
        let obj = tabs.find((x:any) => x.tabId === activeTab)
        if (obj && obj.amplitude_event_code && !details_page) {
            if(obj.amplitude_event_code == 'insight') {
                logAmplitude(`tas_change_branch_insight_overview`);
            } else {
                logAmplitude(`tas_change_branch_${obj.amplitude_event_code}_list`);
            }
        }
    }
    const handleTabSwitch = (tabId:any) => {
        let obj = tabs.find((x:any) => x.tabId === tabId)
        if (obj && obj.amplitude_event_code && !details_page) {
            if(obj.amplitude_event_code == 'insight') {
                logAmplitude(`tas_switch_tab_insight_overview`, {'Shifted to tab': obj.tabname});
            } else if (obj.amplitude_event_code == 'setting') {
                logAmplitude(`tas_switch_tab_rep_settings`, {'Shifted to tab': obj.tabname});
            } else {
                logAmplitude(`tas_switch_tab_${obj.amplitude_event_code}_list`, {'Shifted to tab': obj.tabname});
            }
        }
    }
    const getBranches = async () => {
        setLoading(true)
        await httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/repo/branch?org=${getCookieOrgName()}&repo=${repo}&git_provider=${getCookieGitProvider()}`)
        .then(data => {
            setLoading(false)
            let copyArr = [];
            copyArr = JSON.parse(JSON.stringify(data.branches));
            let branches:any = [currentBranch];
            if(copyArr && copyArr.length > 0) {
                copyArr.forEach((el:any) => {
                    let obj = {label: '', value: ''};
                    obj.label = el;
                    obj.value = el;
                    branches.push(obj);
                });
            }
            setMappedBranches(branches);
        }).catch((error) => {
            setLoading(false)
            errorInterceptor(error)
        })
    }

    const [listPageUrl, setListPageUrl] = useState('');
    const returnListPageLink = () => {
        if(tabs && tabs.length > 0 && provider && org && repo) {
            let arr = tabs.filter((tab) => {
                if(tab.tabId == activeTab) {
                    return tab;
                }
            })
            let obj = arr.length > 0 && arr[0];
            // @ts-ignore
            setListPageUrl(`/${provider}/${org}/${repo}/${obj.pathname}/`)
        }
    }

    useEffect(() => {
        if(repo) {
            getBranches()
            setCurrentBranch({label: getCookieTasRepoBranch() ? getCookieTasRepoBranch() : 'All Branches', value: getCookieTasRepoBranch() ? getCookieTasRepoBranch() : ''});
            returnListPageLink();
        }
    }, [repo])
    return (
        <Text className="bg-white shadow-sm" id="tas_breadcrumb_bar">
            <Text className="py-12 px-15 flex justify-between text-tas-400 text-size-12">
               <Text className="flex items-center">
                    {getAuthToken() && <> <Link href={`/${currentOrg?.git_provider}/${currentOrg?.name}/dashboard/`}>
                        <a className='mr-10'>Dashboard</a>
                    </Link>
                    <img src="/assets/images/icon/right_arrow.svg" className="inline-block" /> </>}
                    <Link href={`/${provider}/${org}/${repo}/jobs`}>
                        <a className='mr-10 ml-10 leading-none'>{repo}</a>
                    </Link>
                    <img src="/assets/images/icon/right_arrow.svg" className="inline-block" />
                    {loading &&
                    <span className={`inline-flex items-center  ml-10 mr-10 pointer-events-none`}>
                    <Select
                        style={{minWidth: '130px'}}
                            backspaceDelete={false}
                            searchable={false}
                            className="tas__select__dropdown tas__select__dropdown__branch py-7 px-15 rounded bg-white text-size-13 w-150 inline-flex"
                            options={[]}
                            values={[currentBranch]}
                            onChange={(value) => changeBranch(value)}
                        />
                        </span>}
                    {!loading && <span className={`inline-flex items-center  ml-10 mr-10 ${details_page ? 'hidden' : ''}`}>
                    <Select
                        style={{minWidth: '130px'}}
                            backspaceDelete={false}
                            searchable={false}
                            className="tas__select__dropdown tas__select__dropdown__branch py-7 px-15 rounded bg-white text-size-13 w-150 inline-flex"
                            options={mappedBranches}
                            values={[currentBranch]}
                            onChange={(value) => changeBranch(value)}
                        />
                        </span>}
                    {!loading && details_page && <>
                        <a href={listPageUrl} className="inline-flex items-center ml-10 mr-10 cursor-pointer" >
                            <img src="/assets/images/icon/branch.svg" className="inline-block mr-10" />
                            {currentBranch && currentBranch.label}
                        </a>
                    </>}
                    <img src="/assets/images/icon/right_arrow.svg" className="inline-block mr-10" />
                    {
                        pagination && pagination.length > 0 && pagination.map((el:any,index:number) => (
                            <span key={index} className="mr-10 leading-none inline-flex items-center">
                                {index !== pagination.length -1 ? el : <span className="text-tas-500">{el}</span>}
                                {index !== pagination.length -1 && <img src="/assets/images/icon/right_arrow.svg" className="inline-block ml-10" />}
                            </span>
                        ))
                    }
               </Text>
               <ActiveSynapses />
            </Text>
            {fetching && <>
                <div className="placeholder-content inline-block width-100 ml-10" style={{height: '44px'}}></div>
                <div className="placeholder-content inline-block width-100 ml-10" style={{height: '44px'}}></div>
                <div className="placeholder-content inline-block width-100 ml-10" style={{height: '44px'}}></div>
                <div className="placeholder-content inline-block width-100 ml-10" style={{height: '44px'}}></div>
                <div className="placeholder-content inline-block width-100 ml-10" style={{height: '44px'}}></div>
            </>}
            {showtabs && !fetching && <Text>
                {
                    tabs && tabs.length > 0 && tabs.map((el, index:number) => (
                        <Link
                            href={`/${provider}/${org}/${repo}/${el.pathname}`}
                            key={index}
                            >
                            <a onClick={() => handleTabSwitch(el.tabId)} className={`${el.tabId === 'settings' && (!getAuthToken() || currentOrg?.name !== org) &&  'hidden'}`}>
                                <Text className={`${activeTab === el.tabId ? 'text-tas-500 py-12 px-15 border-b border-black inline-block' : 'text-tas-400 py-12 px-15 inline-block cursor-pointer'} text-size-14`}>{el.tabname}</Text>
                            </a>
                        </Link>

                    ))
                }
            </Text>}
        </Text>
    )
}


export async function getServerSideProps() {
    return {
        props: {},
    };
}