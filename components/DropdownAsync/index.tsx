import { useEffect } from 'react';

import Dropdown, { TDropdownProps } from 'components/Dropdown';
import useIsApiLoadComplete from 'hooks/useIsApiLoadComplete';

type TDropdownAsyncProps = TDropdownProps & {
  getData?: Function;
  hasMoreData?: boolean;
};

const DropdownAsync = ({
  getData,
  hasMoreData = false,
  loading = true,
  ...props
}: TDropdownAsyncProps) => {
  const dataLoadComplete = useIsApiLoadComplete(loading);

  useEffect(() => {
    if (dataLoadComplete && hasMoreData) {
      getData?.();
    }
  }, [dataLoadComplete, hasMoreData]);

  return <Dropdown loading={loading || hasMoreData} {...props} />;
};

export default DropdownAsync;
