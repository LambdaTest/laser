import { logAmplitude } from 'helpers/genericHelpers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Text from '../Tags/Text';

const TabOptions = [
  {
    key: 'overview',
    label: 'Overview',
    path: 'insights',
  },
  {
    key: 'trends',
    label: 'Trends',
    path: 'trends',
  },
  {
    key: 'contributors',
    label: 'Contributors',
    path: 'contributors',
  },
  // {
  //   key: 'ftm-insights',
  //   label: 'Flaky Tests',
  //   path: 'ftm-insights',
  // },
];

export default function InsightsLeftMenu() {
  const router = useRouter();
  const { repo, provider, org } = router.query;
  const handleTabSwitch = (label:any) => {
    logAmplitude(`tas_insights_sub_menu`, {'Sub menu changed to': label})
  }
  return (
    <div className="mb-15 bg-white rounded">
      <Text className="py-12 px-20 text-size-14 text-gray-900 border-b border-gray-150">
        Insights
      </Text>
      {TabOptions.map(option => (
        <Link href={`/${provider}/${org}/${repo}/${option.path}`} key={option.key}>
          <a onClick={() => handleTabSwitch(option.label)}>
            <Text
              className={`cursor-pointer py-12 px-20 text-size-14 text-gray-600 ${router.asPath === `/${provider}/${org}/${repo}/${option.path}/`
                ? 'bg-gray-50 border-l-2 border-black'
                : ''}`}
            >
              {option.label}
            </Text>
          </a>
        </Link>
      ))}
    </div>
  );
}
