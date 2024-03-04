'use client';

import React, {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

export interface OpenCartContextType {
  showCart: boolean;
  setShowCart: Dispatch<SetStateAction<boolean>>;
}

export const OpenCartContext = createContext<OpenCartContextType>({
  showCart: false,
  setShowCart: () => false,
});

export default function OpenCartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showCart, setShowCart] = useState(false);

  return (
    <OpenCartContext.Provider value={{ showCart, setShowCart }}>
      {children}
    </OpenCartContext.Provider>
  );
}
