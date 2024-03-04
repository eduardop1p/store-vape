'use client';

import React, {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

export interface AddCartType {
  fileName: string;
  name: string;
  flavor: string;
  color: string;
  units: number;
  price: number;
}
export interface AddCartContextType {
  addCart: AddCartType[];
  setAddCart: Dispatch<SetStateAction<AddCartType[]>>;
}

export const CartContext = createContext({});

export default function AddCartContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [addCart, setAddCart] = useState<AddCartContextType[]>([]);

  return (
    <CartContext.Provider value={{ addCart, setAddCart }}>
      {children}
    </CartContext.Provider>
  );
}
