import React from 'react';
import Link from 'next/link';

import Image from '../Tags/Image';
import Text from '../Tags/Text';

export default function NoTest({
  button = false,
  footerContent = null,
  msg = 'You have not ran any jobs yet!',
  repo,
  style
}: {
  button?: boolean;
  footerContent?: any;
  msg?: string;
  repo: string;
  style?: {}
}) {
  return (
    <Text className="px-20 bg-white mb-15 flex items-center text-center justify-center flex-col py-40" style={style}>
      <Image
        height="236"
        src="/assets/images/notests.png"
        style={{ backgroundColor: '#e7e7ec', borderRadius: '4px' }}
        width="386"
      />
      <Text size="h4" className="text-size-18 text-black mb-2 mt-40">
        Hey There!
      </Text>
      <Text
        className="text-size-16 text-gray-700 mb-15"
        dangerouslySetInnerHTML={{ __html: msg }}
        size="h5"
      ></Text>
      {button && (
        <Link href={`/${repo}/get-started`}>
          <a className="mt-20 border  px-20 py-10 rounded text-size-14 transition bg-black text-white border-black tracking-widest ">
            Get Started
          </a>
        </Link>
      )}
      {footerContent}
    </Text>
  );
}
