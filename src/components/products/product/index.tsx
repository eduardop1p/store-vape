'use client';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Link from 'next/link';

import { VapeType } from '@/app/api/models/vape';
import replaceStringToLink from '@/services/replaceStringToLink';
import formatPrice from '@/services/formatPrice';
import AddCart from './addCart';
import { OpenAlertType } from '@/components/alertMsg';

export default function Product({
  product,
  setOpenAlert,
}: {
  product: VapeType & { _id?: string };
  setOpenAlert: Dispatch<SetStateAction<OpenAlertType>>;
}) {
  const [hover, setHover] = useState(false);
  const [showAddCart, setShowAddCart] = useState(false);
  const [overflowVisible, setOverflowVisible] = useState(false);

  useEffect(() => {
    if (showAddCart) {
      setTimeout(() => {
        setOverflowVisible(true);
      }, 250);
    } else {
      setOverflowVisible(false);
    }
  }, [showAddCart]);

  return (
    <div className="relative border-solid border-gray-300 border rounded-2xl">
      {product.productDescount && product.stock ? (
        <div className="rounded-xl absolute z-[4] -top-[18px] left-1/2 -translate-x-1/2 h-8 w-fit px-3 bg-ccba00 text-[13px] text-primary font-medium flex items-center justify-center">
          -{(product.productDescount * 100).toFixed(2)}%
        </div>
      ) : null}
      <div
        className={`relative h-full flex flex-col gap-2 justify-between ${overflowVisible ? 'overflow-visible' : 'overflow-hidden'} px-4 pt-2 pb-4 rounded-2xl`}
        tabIndex={0}
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setShowAddCart(false);
        }}
      >
        <div className="flex gap-2 flex-col ">
          <div
            className="relative w-full h-[280px] cursor-pointer overflow-hidden"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <Image
              src={`/uploads/imgs/${product.fileNames[0]}`}
              alt={product.name}
              fill
              sizes="100%"
              className="absolute"
            />
            <div
              className={`${hover ? 'opacity-100' : 'opacity-0'} duration-500 transition-opacity absolute w-full h-full`}
            >
              <Link
                href={`/${replaceStringToLink(product.category)}/${product._id}`}
                className="absolute z-[2] bg-ffffff99 w-full h-full flex items-center justify-center"
              >
                <span
                  className={`${hover ? 'scale-100' : 'scale-0'} duration-[600ms] transition-transform bg-secudary text-sm text-primary font-medium flex items-center justify-center rounded-3xl px-8 h-[50px]`}
                >
                  Ver produto
                </span>
              </Link>
              {product.fileNames.length > 1 && (
                <Image
                  src={`/uploads/imgs/${product.fileNames[1]}`}
                  alt={product.name}
                  fill
                  sizes="100%"
                  className={'absolute'}
                />
              )}
            </div>
          </div>
          {product.status ? (
            <div className="h-8 w-fit px-3 my-1 text-primary mx-auto bg-secudary text-[13px] font-medium rounded-xl flex items-center justify-center">
              {product.status}
            </div>
          ) : null}
          {product.stock ? (
            <div className="flex flex-col gap-1 items-center px-2">
              <h2 className="text-center text-secudary text-sm font-medium">
                {product.name}
              </h2>
              {product.productDescount ? (
                <div className="text-xs font-medium text-center text-00000099 flex- items-center">
                  De{' '}
                  <small className="text-[13px] font-medium text-secudary line-through">
                    {formatPrice(product.basePrice)}
                  </small>{' '}
                  por:
                </div>
              ) : (
                <span className="text-xs font-medium text-center text-00000099">
                  A partir de:
                </span>
              )}
              <div className={`text-xl font-semibold text-red-600`}>
                {formatPrice(product.finalPrice)}
              </div>
              <div className="text-xs font-medium text-center text-00000099">
                {formatPrice(product.pixPrice)} a vista no Pix
              </div>
              <div className="text-xs font-medium text-center text-00000099">
                ou 4x de {formatPrice(product.finalPrice / 4)} sem juros no
                cartão de credito
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1 items-center px-2">
              <h2 className="text-center text-secudary text-sm font-medium">
                {product.name}
              </h2>
              <span className="text-xs text-center font-medium text-red-600">
                Egotado
              </span>
            </div>
          )}
        </div>
        {product.stock ? (
          <div className="flex justify-between gap-3 w-full">
            <Link
              href={`/${replaceStringToLink(product.category)}/${product._id}`}
              className={`hover:scale-105 duration-200 transition-transform w-1/2 bg-ccba00 text-sm text-primary font-medium flex items-center justify-center rounded-3xl h-[50px]`}
            >
              Ver produto
            </Link>
            <AddCart
              product={product}
              showAddCart={showAddCart}
              setShowAddCart={setShowAddCart}
              setOpenAlert={setOpenAlert}
            />
          </div>
        ) : (
          <Link
            href={`/${replaceStringToLink(product.category)}/${product._id}`}
            className={`hover:scale-105 duration-200 transition-transform bg-secudary text-sm text-primary font-medium flex items-center justify-center rounded-3xl w-full h-[50px]`}
          >
            Ver produto
          </Link>
        )}
      </div>
    </div>
  );
}
