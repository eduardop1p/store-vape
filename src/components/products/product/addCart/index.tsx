/* eslint-disable react/display-name */
'use client';

import { VapeType } from '@/app/api/models/vape';
import { Dispatch, SetStateAction } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { IoIosClose } from 'react-icons/io';

import { OpenAlertType } from '@/components/alertMsg';
import Form from './form';

export interface SelectType {
  active: boolean;
  activeValue: string;
  values?: string[];
}

export default function AddCart({
  product,
  showAddCart,
  setShowAddCart,
  setOpenAlert,
}: {
  product: VapeType;
  showAddCart: boolean;
  setShowAddCart: Dispatch<SetStateAction<boolean>>;
  setOpenAlert: Dispatch<SetStateAction<OpenAlertType>>;
}) {
  return (
    <>
      <div
        className={`${showAddCart ? 'translate-y-0' : 'translate-y-[100%]'} z-[2] rounded-2xl px-4 pt-8 pb-4 h-fit duration-200 transition-transform absolute w-full bg-primary flex flex-col justify-center gap-3 bottom-0 left-0`}
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

        <Form
          product={product}
          setOpenAlert={setOpenAlert}
          showAddCart={showAddCart}
        />
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
