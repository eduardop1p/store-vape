'use client';

import { useContext } from 'react';

import { OpenCartContext } from '../context';

export function useOpenCartContext() {
  const context = useContext(OpenCartContext);

  return { showCart: context?.showCart, setShowCart: context?.setShowCart };
}
