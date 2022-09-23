import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
const EllipsisText = dynamic(() => import('../EllipsisText'));
export default function TasLink({
  addDots = false,
  id,
  notrim,
  path,
  text,
  textLength = undefined,
  tooltipProps = {},
  ellipsisProps = {},
}: any) {
  const router = useRouter();
  const { repo, provider, org } = router.query;
  return (
    <>
      {notrim ? (
        <span
          className="cursor-pointer leading-none inline-flex items-center"
          onClick={(e: any) => {
            e.stopPropagation();
            e.preventDefault();
            router.push(`/${provider}/${org}/${repo}/${path}/${id}`);
          }}
        >
          {path === 'jobs' && '#'}
          {text ? text : id ? id : 'N/A'}
        </span>
      ) : (
        <span
          className="cursor-pointer leading-none inline-flex items-center"
          onClick={(e: any) => {
            e.stopPropagation();
            e.preventDefault();
            router.push(`/${provider}/${org}/${repo}/${path}/${id}`);
          }}
          {...tooltipProps}
        >
          {path === 'jobs' && '#'}
          <EllipsisText
            copy
            {...(path === 'commits' ? { length: 7 } : { length: textLength })}
            dots={addDots ? true : undefined}
            text={text ? text : id ? id : 'N/A'}
            {...ellipsisProps}
          />
        </span>
      )}
    </>
  );
}
