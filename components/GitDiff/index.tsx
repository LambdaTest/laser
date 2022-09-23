import React from 'react';

export default function GitDiff({ diffUrl }: any) {

  if(!diffUrl) {
    return null;
  }

  return (
    <a
      href={diffUrl}
      className="text-size-12 rounded bg-warning px-7 inline-flex items-center width-90"
      target="_blank"
    >
      <img src="/assets/images/icon/gitdiff.svg" alt="" className="mr-5" width={10} /> View Git
      Diff
    </a>
  )
}
