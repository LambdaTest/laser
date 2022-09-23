import { useRef, useEffect } from 'react';

const usePrevious = (prevValue: any) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = prevValue;
  }, [prevValue]);

  return ref.current;
};

export default usePrevious;
