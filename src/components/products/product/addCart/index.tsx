/* eslint-disable react/display-name */
'use client';

import { VapeType } from '@/app/api/models/vape';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { IoIosArrowDown, IoIosClose } from 'react-icons/io';

const AddCart = forwardRef((props: { product: VapeType }, ref) => {
  const { product } = props;

  const [showAddCart, setShowAddCart] = useState(false);
  const [flavors, setFlavors] = useState<{
    active: boolean;
    activeValue: string;
    values?: string[];
    elTarget?: HTMLElement;
  }>({
    active: false,
    activeValue: 'Selecionar',
    values: product.flavors,
  });

  useImperativeHandle(ref, () => ({
    setShowAddCart,
  }));

  return (
    <>
      <div
        className={`${showAddCart ? 'translate-y-0' : 'translate-y-[100%]'} p-4 min-h-[50%] duration-200 transition-transform absolute w-full bg-primary flex flex-col bottom-0 left-0`}
      >
        <button
          className="absolute top-2 right-2"
          type="button"
          onClick={() => setShowAddCart(false)}
        >
          <IoIosClose
            size={30}
            className="hover:fill-red-600 fill-3d3d3d transition-colors duration-200"
          />
        </button>

        <div className="flex justify-between gap-3 w-full">
          {flavors.values?.length ? (
            <div className="flex gap-1 flex-col items-start">
              <h3 className="text-sm font-medium text-secudary text-center">
                Sabores
              </h3>
              <div className="relative">
                <div
                  className="bg-gray-600 hover:bg-gray-500 cursor-pointer duration-200 transition-colors text-primary flex items-center justify-center gap-2 px-4 h-11 rounded-3xl text-[13px] font-normal"
                  onClick={() =>
                    setFlavors(state => ({ ...state, active: !state.active }))
                  }
                >
                  {flavors.activeValue}
                  <IoIosArrowDown
                    size={14}
                    fill="#fff"
                    string="#fff"
                    strokeWidth={20}
                    className={`${flavors.active ? 'rotate-180' : 'rotate-0'} duration-200 transition-transform`}
                  />
                </div>

                <div
                  // bug do blur na porra do display resolvido aqui com altura e nunca com display hidden e visibilite
                  className={`${flavors.active ? 'opacity-100 h-[100px]' : 'opacity-0 h-0'} duration-200 transition-all flex absolute top-12 bg-gray-600 rounded-lg left-0 overflow-hidden w-full`}
                >
                  <div
                    className={`w-full h-full  bg-inherit flex-col  overflow-x-hidden overflow-y-auto`}
                    onClick={event => event.stopPropagation()}
                  >
                    {flavors.values.map((val, i) => (
                      <button
                        key={val}
                        type="button"
                        className={`w-full whitespace-nowrap text-[13px] text-left font-normal px-3 py-1 text-primary ${flavors.values && flavors.values.length - 1 !== i && 'border-b border-solid border-b-gray-500'} hover:bg-gray-500 transition-colors duration-200 cursor-pointer`}
                        onClick={event => {
                          setFlavors(state => ({
                            ...state,
                            active: false,
                            activeValue: val,
                            elTarget: event.target as HTMLElement,
                          }));
                        }}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        className={`${!showAddCart && 'hover:scale-105 duration-200 transition-transform'} flex items-center justify-center bg-secudary h-[50px] rounded-3xl w-1/2`}
        onClick={() => setShowAddCart(!showAddCart)}
      >
        <FaShoppingCart fill="#fff" size={23} className="flex-none" />
      </button>
    </>
  );
});

export default AddCart;
