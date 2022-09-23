import React from 'react';
import { HumanizeDurationLanguage, HumanizeDuration } from 'humanize-duration-ts';
const langService: HumanizeDurationLanguage = new HumanizeDurationLanguage();
const humanizer: HumanizeDuration = new HumanizeDuration(langService);



export default function Duration({ value }: any) {
    const shortHand = (str: any, obj: any) => {
        let retStr = str;
        for (let x in obj) {
            retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
        }
        return retStr;
    };

    return (
        <>
            <span className="leading-none">{value < 1000 ? `${Math.round(value * 100) / 100} ms` : shortHand(humanizer.humanize(value, { round: true }), {
                'weeks': 'w',
                'week': 'w',
                'days': 'd',
                'day': 'd',
                'hours': 'h',
                'hour': 'h',
                'minutes': 'm',
                'minute': 'm',
                'seconds': 's',
                'second': 's',
                'milliseconds': 'ms',
                'millisecond': 'ms',
                ',': ''
            })}</span>
        </>
    )
}
