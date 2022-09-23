import Tooltip from 'components/Tooltip';
import React from 'react';

type ReloadPageType = {
  onClick?: Function;
};

export default function ReloadPage({ onClick }: ReloadPageType) {
  const reloadPage = () => {
    if (window && !onClick) {
      window.addEventListener('unload', function () {
        window.scrollTo(0, 0);
      });
      window.location.reload();
    } else {
      onClick && onClick();
    }
  };
  return (
    <>
      <Tooltip content="Reload Page" placement="bottom">
        <div
          className="flex items-center justify-center cursor-pointer w-32 bg-white radius-3"
          onClick={reloadPage}
        >
          <img src="/assets/images/icon/icon-Refresh.svg" width="32" />
        </div>
      </Tooltip>
    </>
  );
}
