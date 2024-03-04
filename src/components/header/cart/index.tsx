'use client';

import { FaShoppingCart } from 'react-icons/fa';

import { useOpenCartContext } from '@/utils/openCartContext/useContext';

export default function Cart() {
  const { showCart, setShowCart } = useOpenCartContext();

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
      <span className="text-base font-medium text-3d3d3d whitespace-nowrap">
        0
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

        <div className="flex flex-col items-center pt-4 gap-1 bg-inherit rounded-2xl overflow-hidden">
          <h2 className="text-base font-normal text-secudary">
            Seu carrinho está vazio.
          </h2>
          <div className="bg-0000001F w-full py-4 px-5 flex justify-center gap-3 mt-2">
            <span className="text-center text-3d3d3d text-sm font-normal">
              Adicione produtos ao carrinho e eles aparecerão aqui.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
