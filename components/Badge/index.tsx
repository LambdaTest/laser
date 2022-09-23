import React, { } from "react";
import Tooltip from 'react-simple-tooltip';
import { testStatusFound } from "../../redux/helper";
import Image from "../Tags/Image";

// TODO (komal): Refactor this component.
const Badge = ({ status, remark }: any) => {
    return (
        <>
            {(status === "skipped") && <button className="border-0 py-0 outline-none border-none focus:outline-none h-24 px-8 rounded-md text-size-14 transition bg-gray-160 text-black  inline-flex items-center mr-5">
                <Image src="/assets/images/mask.svg" alt="" width="12" className="mr-5 inline" />  <span className="capitalize">{status}</span>
            </button>}
            {(status === "aborted") && <button className="border-0 py-0 outline-none border-none focus:outline-none h-24 px-8 rounded-md text-size-14 transition bg-red-400 text-white  inline-flex items-center mr-5">
                <Image src="/assets/images/mask.svg" alt="" width="12" className="mr-5 inline" />  <span className="capitalize">{status}</span>
            </button>}
            {(status === "blacklisted" || status === "blocklisted") && <button className="border-0 py-0 outline-none border-none focus:outline-none h-24 px-8 rounded-md text-size-14 transition bg-black text-white  inline-flex items-center mr-5">
                <Image src="/assets/images/mask.svg" alt="" width="12" className="mr-5 inline" />  <span className="capitalize">{status}</span>
            </button>}
            {status === "failed" && <button className="border-0 py-0 outline-none border-none focus:outline-none h-24 px-8 rounded-md text-size-14 transition bg-red-300 text-white  inline-flex items-center mr-5">
                <span className="h-14 w-14 rounded-full bg-white inline-flex items-center justify-center mr-5">
                    <Image src="/assets/images/icon/badge_cross.svg" alt="" width="12" />
                </span>
                <span className="capitalize">{status}</span>

            </button>}
            {status === "error" && remark && <Tooltip
                className="react_simple_tooltip mr-20 react_simple_tooltip-max_width"
                content={remark || "TAS Error"}
                placement="right"
            >
                <button className="border-0 py-0 outline-none border-none focus:outline-none h-24 px-8 rounded-md text-size-14 transition bg-red-300 text-white  inline-flex items-center mr-5">
                    <Image src="/assets/images/mask.svg" alt="" width="12" className="mr-5 inline" />  <span className="capitalize">TAS Error</span>
                </button>
            </Tooltip>
            }
            {status === "error" && !remark && <button className="border-0 py-0 outline-none border-none focus:outline-none h-24 px-8 rounded-md text-size-14 transition bg-red-300 text-white  inline-flex items-center mr-5">
                    <Image src="/assets/images/mask.svg" alt="" width="12" className="mr-5 inline" />  <span className="capitalize">TAS Error</span>
                </button>}
            {(status === "running" || status === "pending" || status === "initiating") && <button className="border-0 py-0 outline-none border-none focus:outline-none h-24 px-8 rounded-md text-size-14 transition bg-yellow-500 text-white inline-flex items-center mr-5 overflow-hidden">
                <span className="capitalize">{status}</span> <div className="loader ml-10 loader-base-yellow">Loading...</div>
            </button>}
            {(status === "completed" || status === 'passed') && <button className="border-0 py-0 outline-none border-none focus:outline-none h-24 px-8 rounded-md text-size-14 transition bg-green-500 text-white inline-flex items-center mr-5">
                <span className="h-14 w-14 rounded-full bg-white inline-flex items-center justify-center mr-5">
                    <Image src="/assets/images/icon/green-check.svg" alt="" width="10" />
                </span>
                <span className="capitalize">{status}</span>
            </button>}
            {!testStatusFound(status) && <button className="border-0 py-0 outline-none border-none focus:outline-none h-24 px-8 rounded-md text-size-14 transition bg-gray-150  inline-flex items-center mr-5">
                <Image src="/assets/images/mask-gray.svg" alt="" width="12" className="mr-5 inline" />  <span className="capitalize">N/A</span>
            </button>}
        </>
    );
};
export default Badge