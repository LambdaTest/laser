import React, { useEffect } from 'react';

const useDetectOutsideClick = (ref: React.RefObject<HTMLElement>[], callback: () => void) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const containedInAtleastOne = ref.some(r => r.current && r.current.contains(target));
      if (!containedInAtleastOne) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ref, callback]);
};

export default useDetectOutsideClick;
