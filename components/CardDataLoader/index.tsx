import React from 'react';

export default function CardDataLoader({one_row}:any) {

    return (
        <div className="w-full card__data__loader">
            <div className="inline-flex items-center justify-between w-full mb-15" >
                <div className="w-3/12 pr-15">
                    <div className="placeholder-content"></div>
                </div>
                <div className="w-2/12 px-15">
                    <div className="placeholder-content"></div>
                </div>
                <div className="w-2/12 px-15">
                    <div className="placeholder-content"></div>
                </div>
                <div className="w-1/12 px-15">
                    <div className="placeholder-content"></div>
                </div>
                <div className="w-2/12 px-15">
                    <div className="placeholder-content"></div>
                </div>
                <div className="w-2/12 pl-15">
                    <div className="placeholder-content"></div>
                </div>
            </div>
            {!one_row && <div className="inline-flex items-center justify-between w-full">
                <div className="w-3/12 pr-15">
                    <div className="placeholder-content"></div>
                </div>
                <div className="w-2/12 px-15">
                    <div className="placeholder-content"></div>
                </div>
                <div className="w-2/12 px-15">
                    <div className="placeholder-content"></div>
                </div>
                <div className="w-1/12 px-15">
                    <div className="placeholder-content"></div>
                </div>
                <div className="w-2/12 px-15">
                    <div className="placeholder-content"></div>
                </div>
                <div className="w-2/12 pl-15">
                    <div className="placeholder-content"></div>
                </div>
            </div>}
        </div>
    )
}