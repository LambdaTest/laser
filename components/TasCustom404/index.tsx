import React, { useEffect, useState } from 'react'
import WebLayout from '../WebLayout'

export default function TasCustom404() {
    const [show, setShow] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setShow(true)
        }, 500);
        return () => {
            setShow(false)
        }
    }, [])
    return (
        <>
        {show && <WebLayout wrapper_classes="bg-white">
            <div className="py-70 pb-10 relative">
                <img src="/assets/images/landing-page/black_bg.svg" alt="Black Shape" className="black__shape" />
                <div className="error_info">
                    <div className="w-12/12 mx-auto mb-55 pt-150">
                        <h1 className="text-size-80 text-center font-bold">404</h1>
                        <h1 className="text-size-24 text-center">Sorry, we couldn’t find that page</h1>
                    </div>
                </div>
            </div>
        </WebLayout>}
        </>
    )
}
