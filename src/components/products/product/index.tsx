'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import Link from 'next/link';

import { VapeType } from '@/app/api/models/vape';
import replaceStringToLink from '@/services/replaceStringToLink';
import formatPrice from '@/services/formatPrice';
import pixDescount from '@/services/pixDescount';
import AddCart from './addCart';

export default function Product({
  product,
}: {
  product: VapeType & { _id?: string };
}) {
  const [hover, setHover] = useState(false);

  const addCartRef = useRef<any>(null);

  const productPrice = product.descount
    ? product.price * (1 - product.descount)
    : product.price;

  const productPixDescount = product.descount
    ? productPrice * (1 - pixDescount)
    : product.price;

  return (
    <div className="relative border-solid border-gray-300 border rounded-2xl">
      {product.descount && product.stock ? (
        <div className="rounded-xl absolute z-[4] -top-5 left-1/2 -translate-x-1/2 h-8 w-fit px-3 bg-ccba00 text-[13px] text-primary font-medium flex items-center justify-center">
          -{(product.descount * 100).toFixed(2)}%
        </div>
      ) : null}
      <div
        className="relative h-full flex flex-col gap-2 justify-between overflow-hidden px-4 pt-2 pb-4 rounded-2xl"
        tabIndex={0}
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            addCartRef.current.setShowAddCart(false);
          }
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
            {product.fileNames.length > 0 ? (
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
                <Image
                  src={`/uploads/imgs/${product.fileNames[1]}`}
                  alt={product.name}
                  fill
                  sizes="100%"
                  className={'absolute'}
                />
              </div>
            ) : null}
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
              <span className="text-xs font-medium text-center text-00000099">
                A partir de:
              </span>
              <div
                className={`text-xl font-semibold ${product.descount ? 'text-red-600' : 'text-secudary'}`}
              >
                {formatPrice(productPrice)}
              </div>
              <div className="text-xs font-medium text-center text-00000099">
                {formatPrice(productPixDescount)} vista com desconto Pix
              </div>
              <div className="text-xs font-medium text-center text-00000099">
                ou 4x de {formatPrice(productPrice / 4)} Sem juros Cartão de
                Credito
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
            <AddCart product={product} ref={addCartRef} />
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
