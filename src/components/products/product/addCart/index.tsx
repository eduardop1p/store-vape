'use client';

import { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { IoIosClose } from 'react-icons/io';

export default function AddCart() {
  const [showAddCart, setShowAddCart] = useState(false);

  return (
    <>
      <div
        className={`${showAddCart ? 'h-[50%] opacity-100 visible' : 'h-0 opacity-0 invisible'} rounded-2xl duration-200 transition-all absolute w-full bg-primary flex flex-col bottom-0 left-0`}
        tabIndex={0}
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setShowAddCart(false);
        }}
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
