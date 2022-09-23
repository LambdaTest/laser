import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { getAuthToken, getCookieOrgName, removeCookie } from "../../helpers/genericHelpers";
import { useDispatch } from "react-redux";
import { logOut } from '../../redux/actions/authAction'
import { useRouter } from "next/router";
import { errorInterceptor } from "../../redux/helper";
import { httpGet } from "../../redux/httpclient";


export default function Topnav() {
  const dropdown = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch()
  const router = useRouter()
  const handleOpenDropdown = () => {
    dropdown.current?.classList.toggle('open');
  }
  const handleLogout = () => {
    console.log("Logging out...");
    httpGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`).then((data:any) => {
      console.log(data)
      removeCookie(`${process.env.NEXT_PUBLIC_AUTH_COOKIE}`);
      removeCookie('tas_org_name');
      removeCookie('tas_org_id')
      dispatch(logOut());
      router.push('/login');
    }).catch((error:any) => {
        errorInterceptor(error)
    })
  }
  useEffect(() => {
     if(window) {
      window.addEventListener('TasLogout' , (e:any) => {
        if(e.detail?.unauthorised) {
          removeCookie(`${process.env.NEXT_PUBLIC_AUTH_COOKIE}`);
          removeCookie('tas_org_name');
          removeCookie('tas_org_id')
          dispatch(logOut());
          router.push('/login');
        }
      })
     }
     if(!getAuthToken()) {
      removeCookie(`${process.env.NEXT_PUBLIC_AUTH_COOKIE}`);
      removeCookie('tas_org_name');
      removeCookie('tas_org_id')
      dispatch(logOut());
      router.push('/login');
     }
  }, [])
  return (
    <div className="admin-header">
      <div className="flex -mx-15 items-center">
        <div className="w-6/12 px-15 inline-flex">
          <Link href="/dashboard">
            <a  className="inline-flex items-center">
              <img src={"/assets/images/tas-logo.svg"} alt="logo" width="120" />
              {/* <b className="text-size-14 font-bold ml-10 tracking-widest">TEST AT SCALE</b> */}
            </a>
          </Link>
        </div>
        <div className="w-6/12 px-15 text-right">
          <div>
            {/* <Link href="/">
              <a className="inline-flex items-center topnavLink">
                <img src={"/assets/images/dropdown-menu.svg"} alt="User" width="18" />
              </a>
            </Link> */}
            <div className={`inline-flex dropdown top_dropdown lt-dropdown`} ref={dropdown}>
              <span className="topnavLink lt-dropdown-toggle" onClick={() => handleOpenDropdown()}>
                <img src={"/assets/images/person-icon.svg"} alt="User" width="18" className="mr-10 pointer-events-none" />
                <span className="text-size-12 tracking-wide pointer-events-none">{getCookieOrgName()}</span>
              </span>
              <div className="dropdown_menu lt-dropdown-menu">
                  <Link href="/settings">
                      <a  className="dropdown_item">Settings</a>
                  </Link>
                  <Link href="/select-org">
                      <a  className="dropdown_item">Organization</a>
                  </Link>
                  <span className="dropdown_item cursor-pointer" onClick={handleLogout}>
                     Log out
                  </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
