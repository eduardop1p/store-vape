'use client';

import { useEffect, useState } from 'react';

export default function useIsRemoveKey() {
  let [isRemoveKey, setIsRemoveKey] = useState(false);
  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        setIsRemoveKey(true);
      } else {
        setIsRemoveKey(false);
      }
    };
    window.addEventListener('keydown', event => onKeydown(event));

    return () => window.removeEventListener('keydown', onKeydown);
  }, []);

  return { isRemoveKey };
}
