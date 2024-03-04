'use client';

import React, {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

export interface CartType {
  fileName: string;
  name: string;
  flavor?: string;
  color?: string;
  price: number;
  units: number;
  createdIn: number;
}

interface CartContextType {
  cart: CartType[];
  setCart: Dispatch<SetStateAction<CartType[]>>;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  setCart: () => [],
});

export default function CartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartType[]>([]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}
