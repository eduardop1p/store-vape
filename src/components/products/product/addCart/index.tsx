/* eslint-disable react/display-name */
'use client';

import { VapeType } from '@/app/api/models/vape';
import { useState, Dispatch, SetStateAction } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { IoIosArrowDown, IoIosClose } from 'react-icons/io';

interface SelectType {
  active: boolean;
  activeValue: string;
  values?: string[];
}

export default function AddCart({
  product,
  showAddCart,
  setShowAddCart,
}: {
  product: VapeType;
  showAddCart: boolean;
  setShowAddCart: Dispatch<SetStateAction<boolean>>;
}) {
  const [flavors, setFlavors] = useState<SelectType>({
    active: false,
    activeValue: 'Selecionar',
    values: product.flavors,
  });
  const [colors, setColors] = useState<SelectType>({
    active: false,
    activeValue: 'Selecionar',
    values: product.colors,
  });

  return (
    <>
      <div
        className={`${showAddCart ? 'translate-y-0' : 'translate-y-[100%]'} rounded-2xl px-4 pt-8 pb-4 h-fit duration-200 transition-transform absolute w-full bg-primary flex flex-col justify-center gap-3 bottom-0 left-0`}
      >
        <button
          className="absolute top-0 right-2"
          type="button"
          onClick={() => setShowAddCart(false)}
        >
          <IoIosClose
            size={30}
            className="hover:fill-red-600 fill-3d3d3d transition-colors duration-200"
          />
        </button>

        <div className="flex justify-between gap-3 w-full">
          {flavors.values?.length && colors.values?.length ? (
            <>
              <SelectFlavors flavors={flavors} setFlavors={setFlavors} />
              <SelectColors colors={colors} setColors={setColors} />
            </>
          ) : null}
          {flavors.values?.length && !colors.values?.length ? (
            <SelectFlavors flavors={flavors} setFlavors={setFlavors} wFull />
          ) : null}
          {!flavors.values?.length && colors.values?.length ? (
            <SelectColors colors={colors} setColors={setColors} wFull />
          ) : null}
        </div>
        <div className="flex justify-between gap-3 w-full">
          <input
            defaultValue={1}
            placeholder="Quantidade"
            className="text-secudary font-medium text-[13px] text-center bg-e5e5e5 px-4 h-11 rounded-3xl w-[40%]"
            onInput={event => {
              const currentTarget = event.currentTarget;
              let value = currentTarget.value.replace(/[^\d]/g, '');
              currentTarget.value = value;
            }}
          />
          <button
            type="button"
            className="hover:scale-105 text-center transition-transform duration-200 px-4 h-11 rounded-3xl w-[60%] text-[13px] text-primary bg-ccba00 font-medium"
          >
            Comprar
          </button>
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
}

const SelectFlavors = ({
  flavors,
  setFlavors,
  wFull,
}: {
  flavors: SelectType;
  setFlavors: Dispatch<SetStateAction<SelectType>>;
  wFull?: boolean;
}) => {
  if (typeof flavors.values == 'undefined' || !flavors.values.length) return;

  return (
    <div
      className={`flex gap-1 flex-col items-center ${wFull ? 'w-full' : 'w-1/2'}`}
    >
      <h3 className="text-sm font-medium text-secudary text-center">Sabores</h3>
      <div
        className="relative w-full"
        tabIndex={0}
        onBlur={event => {
          // nunca colocar evento de foco no mesmo elemento que foi setado evento de click
          if (!event.currentTarget.contains(event.relatedTarget))
            setFlavors(state => ({ ...state, active: false }));
        }}
      >
        <div
          className=" bg-gray-600 hover:bg-gray-500 cursor-pointer duration-200 transition-colors flex items-center justify-between gap-2 px-4 h-11 rounded-3xl"
          onClick={() =>
            setFlavors(state => ({ ...state, active: !state.active }))
          }
        >
          <div className="truncate text-primary text-[13px] font-normal">
            {flavors.activeValue}
          </div>
          <IoIosArrowDown
            size={14}
            fill="#fff"
            stroke="#fff"
            strokeWidth={5}
            className={`${flavors.active ? 'rotate-180' : 'rotate-0'} flex-none duration-200 transition-transform`}
          />
        </div>

        <div
          // bug do blur na porra do display resolvido aqui com altura e nunca com display hidden e visibilite
          className={`duration-200 transition-all flex absolute top-12 bg-gray-600 rounded-lg left-0 overflow-hidden w-full`}
          style={{
            height: flavors.active
              ? flavors.values.length > 4
                ? '110px'
                : `${flavors.values.length * 28.3}px`
              : '0px',
            opacity: flavors.active ? 1 : 0,
          }}
        >
          <div
            className={`w-full h-full  bg-inherit flex-col overflow-x-hidden overflow-y-auto`}
            onClick={event => event.stopPropagation()}
          >
            {flavors.values.map((val, i) => (
              <button
                key={val}
                title={val}
                type="button"
                className={`truncate w-full whitespace-nowrap text-[13px] text-left font-normal px-3 py-1 text-primary ${flavors.values && flavors.values.length - 1 !== i && 'border-b border-solid border-b-gray-500'} hover:bg-gray-500 transition-colors duration-200 cursor-pointer`}
                onClick={() => {
                  setFlavors(state => ({
                    ...state,
                    active: false,
                    activeValue: val,
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
  );
};

const SelectColors = ({
  colors,
  setColors,
  wFull,
}: {
  colors: SelectType;
  setColors: Dispatch<SetStateAction<SelectType>>;
  wFull?: boolean;
}) => {
  if (typeof colors.values == 'undefined' || !colors.values.length) return;

  return (
    <div
      className={`flex gap-1 flex-col items-center ${wFull ? 'w-full' : 'w-1/2'}`}
    >
      <h3 className="text-sm font-medium text-secudary text-center">Cores</h3>
      <div
        className="relative w-full"
        tabIndex={0}
        onBlur={event => {
          // nunca colocar evento de foco no mesmo elemento que foi setado evento de click
          if (!event.currentTarget.contains(event.relatedTarget))
            setColors(state => ({ ...state, active: false }));
        }}
      >
        <div
          className="bg-gray-600 hover:bg-gray-500 cursor-pointer duration-200 transition-colors flex items-center justify-between gap-2 px-4 h-11 rounded-3xl"
          onClick={() =>
            setColors(state => ({ ...state, active: !state.active }))
          }
        >
          <div className="truncate text-primary text-[13px] font-normal">
            {colors.activeValue}
          </div>
          <IoIosArrowDown
            size={14}
            fill="#fff"
            stroke="#fff"
            strokeWidth={5}
            className={`${colors.active ? 'rotate-180' : 'rotate-0'} duration-200 transition-transform`}
          />
        </div>

        <div
          // bug do blur na porra do display resolvido aqui com altura e nunca com display hidden e visibilite
          className={`duration-200 transition-all flex absolute top-12 bg-gray-600 rounded-lg left-0 overflow-hidden w-full`}
          style={{
            height: colors.active
              ? colors.values.length > 4
                ? '110px'
                : `${colors.values.length * 28.3}px`
              : '0px',
            opacity: colors.active ? 1 : 0,
          }}
        >
          <div
            className={`w-full h-full  bg-inherit flex-col overflow-x-hidden overflow-y-auto`}
            onClick={event => event.stopPropagation()}
          >
            {colors.values.map((val, i) => (
              <button
                key={val}
                type="button"
                title={val}
                className={`truncate w-full whitespace-nowrap text-[13px] text-left font-normal px-3 py-1 text-primary ${colors.values && colors.values.length - 1 !== i && 'border-b border-solid border-b-gray-500'} hover:bg-gray-500 transition-colors duration-200 cursor-pointer`}
                onClick={() => {
                  setColors(state => ({
                    ...state,
                    active: false,
                    activeValue: val,
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
  );
};
