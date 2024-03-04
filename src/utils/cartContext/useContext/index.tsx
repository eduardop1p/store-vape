'use client';

import { useContext } from 'react';

import { CartContext } from '../context';

export function useCartContext() {
  const context = useContext(CartContext);

  return { cart: context.cart, setCart: context.setCart };
}
