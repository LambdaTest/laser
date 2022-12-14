import { useState, useCallback } from 'react';

const useToggle = (initialState = false): [boolean, Function, Function] => {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState((state) => !state), []);

  return [state, toggle, setState];
};

export default useToggle;
