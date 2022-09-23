
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Text from '../Tags/Text';
import { useSelector } from 'react-redux';

export default function AdminSettingsLeftNav() {
    const state = useSelector((state) => state);
    const router = useRouter()
    const {persistData}:any = state;
    const {currentOrg}:any = persistData;
  const LeftNavConfig = [
      {
      header: 'Plan Settings',
      links: [
        {
          label: 'Usage Details',
          href: '/settings',
        }
      ],
    },
    {
      header: 'Developer Settings',
      kind:'synapse',
      links: [
        {
          label: 'Connected Synapse',
          href: `/${currentOrg?.git_provider}/${currentOrg?.name}/synapse-list`,
        },
        {
          label: 'Synapse Configurations',
          href: `/${currentOrg?.git_provider}/${currentOrg?.name}/synapse-config`,
        }
      ],
    }
    ];

  return (
    <>
    {
      LeftNavConfig && LeftNavConfig.map((obj) => (
        <div className={`mb-15 bg-white radius-3 overflow-hidden ${currentOrg && currentOrg.runner_type == 'cloud-runner' && obj.kind === 'synapse' ? 'hidden' : ''}`}>
          <Text className="py-12 px-20 text-size-16 text-gray-900 border-b border-gray-150">
            {obj.header}
          </Text>
          {obj.links.map((link) => (
            <Link key={link.href} href={`${link.href}`}>
              <a >
                <Text
                  className={`cursor-pointer py-12 px-20 text-size-14 text-gray-600 ${
                    router.asPath == `${link.href}/`
                      ? 'bg-gray-50 border-l-2 border-black'
                      : ''
                  }`}
                >
                  {link.label}
                </Text>
              </a>
            </Link>
          ))}
        </div>
      ))
    }

    </>
  );
}
