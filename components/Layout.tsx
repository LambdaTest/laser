import * as React from 'react'
import Head from 'next/head'
import LeftNav from './LeftNav';

type Props = {
  title?: string,
  hidenav?:boolean
}

const Layout: React.FunctionComponent<Props> = ({
  children,
  title,
  hidenav
}) => (
  <>
      <Head>
        <title>{title ? title : 'TAS'}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Karla&display=swap" rel="stylesheet" />
        <script defer src={`${process.env.NEXT_PUBLIC_TAS_ASSETS}/js/lambda_gtm.js`}></script>
      </Head>
      <div className="admin-wrapper">
        <div className="container-fluid admin-wrapper-fluid">
          <div className="row admin-wrapper-row">
            {!hidenav && <LeftNav />}
            <div className="col admin-wrapper-rightsection">
              <div className="admin-content-area designed-scroll">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
)

export default Layout
