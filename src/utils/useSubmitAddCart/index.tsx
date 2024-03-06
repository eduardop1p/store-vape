'use client';

import { isEqual } from 'lodash';
import { SubmitHandler } from 'react-hook-form';

import { CartType } from '../cartContext/context';
import { useOpenCartContext } from '../openCartContext/useContext';
import { useCartContext } from '../cartContext/useContext';
import { Dispatch, SetStateAction } from 'react';
import { OpenAlertType } from '@/components/alertMsg';
import { BodyType } from '@/components/products/product/addCart/form';

export default function useSubmitAddCart(
  setOpenAlert: Dispatch<SetStateAction<OpenAlertType>>
) {
  const { setShowCart } = useOpenCartContext();
  const { setCart } = useCartContext();

  const handleFormSubmit: SubmitHandler<BodyType> = body => {
    body = { ...body, createdIn: Date.now() };
    const cart = document.querySelector('#cart') as HTMLDivElement;
    const cartDataLocalStorage = localStorage.getItem('cart');
    if (!cartDataLocalStorage) {
      localStorage.setItem('cart', JSON.stringify([body]));
      setCart([body]);
    } else {
      const cartData: CartType[] = JSON.parse(cartDataLocalStorage);
      const { createdIn, ..._b } = body; // eslint-disable-line
      if (
        cartData
          .map(val => {
            const { createdIn, ..._c } = val; // eslint-disable-line
            return _c;
          })
          .some(val => isEqual(val, _b))
      ) {
        setOpenAlert({
          msg: 'Produto já foi adicionado ao carrinho',
          open: true,
          severity: 'success',
        });
        setShowCart(true);
        cart.focus();
        return;
      }
      if (cartData.length > 20) {
        setOpenAlert({
          msg: 'Carrinho lotado, exclua itens para adicionar novos',
          open: true,
          severity: 'error',
        });
        setShowCart(true);
        cart.focus();
        return;
      }

      cartData.push(body);
      localStorage.setItem('cart', JSON.stringify(cartData));
      setCart(cartData);
    }
    setOpenAlert({
      msg: 'Produto adicionado ao carrinho',
      open: true,
      severity: 'success',
    });
    setShowCart(true);
    cart.focus();
  };

  return { handleFormSubmit };
}
