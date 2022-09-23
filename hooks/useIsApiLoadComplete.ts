import usePrevious from './usePrevious';

const useIsApiLoadComplete = (currentLoading: boolean) => {
  const previousLoading = usePrevious(currentLoading);

  return !!(previousLoading && !currentLoading);
};

export default useIsApiLoadComplete;
