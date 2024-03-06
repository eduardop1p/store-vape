'use client';

import { FaShoppingCart } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

import { useOpenCartContext } from '@/utils/openCartContext/useContext';
import { useCartContext } from '@/utils/cartContext/useContext';
import formatPrice from '@/services/formatPrice';
import { useEffect } from 'react';

export default function Cart() {
  const { showCart, setShowCart } = useOpenCartContext();
  const { cart, setCart } = useCartContext();

  useEffect(() => {
    const cartDataLocalStorage = localStorage.getItem('cart');
    if (cartDataLocalStorage) setCart(JSON.parse(cartDataLocalStorage));
  }, [setCart]);

  return (
    <div
      className={`bg-primary duration-200 transition-colors rounded-3xl h-[50px] px-6 flex items-center gap-2 cursor-pointer relative justify-center`} // eslint-disable-line
      onClick={() => setShowCart(!showCart)}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setShowCart(false);
      }}
      id="cart"
      tabIndex={0}
    >
      <FaShoppingCart fill="#3d3d3d" size={16} className="flex-none" />
      <span
        className={`text-base font-medium flex-none whitespace-nowrap ${cart.length ? 'bg-ccba00 w-6 h-6 flex rounded-full items-center justify-center text-primary' : 'bg-transparent text-3d3d3d'}`}
      >
        {cart.length}
      </span>

      <div
        className={`rounded-2xl absolute bg-primary top-16 w-[300px] cursor-default z-[2] transition-all duration-200 ${showCart ? 'translate-y-0 opacity-100 visible' : 'translate-y-14 opacity-0 invisible'}`} // eslint-disable-line
        onClick={event => event.stopPropagation()}
      >
        <div
          className="absolute bg-primary w-3 h-3 top-2 left-1/2 z-[-2]"
          style={{
            transform: 'scaleY(2) rotate(45deg) translateX(-50%)',
          }}
        ></div>

        <div className="flex flex-col items-center gap-1 bg-inherit rounded-2xl overflow-hidden shadow-lg">
          {!cart.length ? (
            <>
              <h2 className="mt-4 text-base font-normal text-secudary">
                Seu carrinho está vazio.
              </h2>
              <div className="bg-0000001F w-full py-4 px-5 flex justify-center gap-3 mt-2">
                <span className="text-center text-3d3d3d text-sm font-normal">
                  Adicione produtos ao carrinho e eles aparecerão aqui.
                </span>
              </div>
            </>
          ) : (
            <div className="flex relative flex-col h-fit">
              <div
                className={`flex flex-col pt-2 max-h-[290px] overflow-x-hidden overflow-y-auto`}
              >
                {cart
                  .sort((a, b) => b.createdIn - a.createdIn)
                  .map((val, i) => (
                    <div
                      key={i}
                      className="flex gap-2 justify-between border-b border-solid border-gray-200 px-4 py-2"
                    >
                      <Image
                        src={`/uploads/imgs/${val.fileName}`}
                        width={90}
                        height={90}
                        alt={val.name}
                        className="!object-contain flex-none"
                      />
                      <div className="flex flex-col">
                        <h3 className="text-[13px] font-normal text-left text-secudary">
                          {val.name}
                        </h3>
                        {val.flavor && (
                          <p className="text-[11px] font-normal text-left text-00000099">
                            <span className="text-secudary">Sabor:</span>{' '}
                            {val.flavor}
                          </p>
                        )}
                        {val.color && (
                          <p className="text-[11px] font-normal text-left text-00000099">
                            <span className="text-secudary">Cor:</span>{' '}
                            {val.color}
                          </p>
                        )}
                        <div className="flex justify-between items-center gap-2">
                          <p className="text-[11px] font-normal text-left text-00000099">
                            <span className="text-secudary">Unidades:</span>{' '}
                            {val.units}
                          </p>
                          <button
                            type="button"
                            className="text-xs font-medium text-red-600 cursor-pointer hover:scale-105 duration-200 transition-transform"
                            onClick={() => {
                              const newArr = [...cart];
                              newArr.splice(i, 1);
                              localStorage.setItem(
                                'cart',
                                JSON.stringify(newArr)
                              );
                              setCart(newArr);
                            }}
                          >
                            Remover
                          </button>
                        </div>
                        <h3 className="text-secudary font-medium text-lg">
                          {formatPrice(val.price * val.units)}
                        </h3>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="flex flex-col items-center w-full bg-primary rounded-b-2xl overflow-hidden border-t border-solid border-gray-200">
                <button
                  type="button"
                  className="text-center cursor-pointer text-red-600 text-xs font-medium py-3 hover:scale-105 transition-transform duration-200"
                  onClick={() => {
                    localStorage.setItem('cart', JSON.stringify([]));
                    setCart([]);
                    setShowCart(false);
                  }}
                >
                  Esvaziar carrinho
                </button>
                <div className="px-6 py-3 bg-0000001F w-full flex justify-between">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-00000099">
                      Total:
                    </span>
                    <div className="text-red-600 font-medium text-xl leading-none">
                      {formatPrice(
                        cart.reduce(
                          (prev, current) =>
                            prev + current.price * current.units,
                          0
                        )
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/payment`}
                    className="bg-ccba00 flex items-center justify-center hover:scale-105 transition-transform duration-200 text-primary font-medium text-sm h-[50px] px-6 rounded-3xl"
                  >
                    Avançar
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
