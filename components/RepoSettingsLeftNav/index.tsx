import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Text from '../Tags/Text';
import { logAmplitude } from 'helpers/genericHelpers';

const LeftNavConfig = {
  header: 'Project Settings',
  links: [
    {
      label: 'Secrets',
      href: 'settings',
    },
    {
      label: 'Advanced Settings',
      href: 'settings/advanced-settings',
    },
  ],
};

export default function RepoSettingsLeftNav() {
  const router = useRouter();
  const { repo, provider, org } = router.query;
  const handleTabSwitch = (label:any) => {
    logAmplitude(`tas_repo_settings_sub_menu`, {'Sub menu changed to': label})
  }
  return (
    <div className="mb-15 bg-white rounded-md overflow-hidden">
      <Text className="py-12 px-20 text-size-14 text-gray-900 border-b border-gray-150">
        {LeftNavConfig.header}
      </Text>
      {LeftNavConfig.links.map((link) => (
        <Link key={link.href} href={`/${provider}/${org}/${repo}/${link.href}`}>
          <a onClick={() => handleTabSwitch(link.label)}>
            <Text
              className={`cursor-pointer py-12 px-20 text-size-14 text-gray-600 ${
                router.asPath == `/${provider}/${org}/${repo}/${link.href}/`
                  ? 'bg-gray-50 border-l-2 border-black'
                  : ''
              }`}
            >
              {link.label}
            </Text>
          </a>
        </Link>
      ))}
      <a href={`${process.env.NEXT_PUBLIC_WEBSITE_HOST}/support/docs/tas-configuring-tas-yml/`} target="_blank">
        <Text
          className={`cursor-pointer py-12 px-20 text-size-14 text-gray-600`}
        >
          TAS YML Configuration
        </Text>
      </a>
    </div>
  );
}
