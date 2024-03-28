import { notFound } from 'next/navigation';
import Link from 'next/link';
import { IoLogoWhatsapp } from 'react-icons/io';

import Container90 from '@/components/container90';
import Main from '@/components/main';
import UnavailablePage from '@/components/unavailablePage';
import { VapeType } from '@/app/api/models/vape';
import CustomSeparator from '@/components/breadcrumb';
import replaceStringToLink from '@/services/replaceStringToLink';
import SlideImages from './slideImages';
import formatPrice from '@/services/formatPrice';

export default async function ProductPage({
  productId,
}: {
  productId: string;
}) {
  let vapeData: VapeType;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/get-product/${productId}`,
      {
        method: 'GET',
        cache: 'no-cache',
      }
    );
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.error, {
        cause: data.cause,
      });
    vapeData = data.result;
  } catch (err: any) {
    console.log(err);
    if (err.cause == 'product not found') notFound();
    return <UnavailablePage />;
  }

  return (
    <Main>
      <Container90 className="gap-5">
        <CustomSeparator>
          <Link href="/" className="text-ccba00 text-sm font-normal">
            Home
          </Link>
          <Link
            href={replaceStringToLink(vapeData.category)}
            className="text-ccba00 text-sm font-normal"
          >
            {vapeData.category}
          </Link>
          {vapeData.subcategory2 && (
            <Link
              href={`${replaceStringToLink(vapeData.category)}/${replaceStringToLink(vapeData.subcategory2)}`}
              className="text-ccba00 text-sm font-normal"
            >
              {vapeData.subcategory2}
            </Link>
          )}
          {vapeData.subcategory2 && vapeData.subcategory3 && (
            <Link
              href={`${replaceStringToLink(vapeData.category)}/${replaceStringToLink(vapeData.subcategory2)}/${replaceStringToLink(vapeData.subcategory3)}`}
              className="text-ccba00 text-sm font-normal"
            >
              {vapeData.subcategory3}
            </Link>
          )}
          <span className="text-555555 text-sm font-normal">
            {vapeData.name}
          </span>
        </CustomSeparator>
        <div className="flex justify-between items-start gap-16 w-full">
          <SlideImages alt={vapeData.name} fileNames={vapeData.fileNames} />
          <div className="w-[60%] flex flex-col gap-1">
            <h1 className="text-secudary text-2xl font-medium w-fit">
              {vapeData.name}
            </h1>
            <div className="flex justify-between gap-4 my-2">
              {vapeData.status && (
                <span className="bg-secudary text-primary font-medium text-[13px] px-2 py-[6px]  rounded-2xl">
                  {vapeData.status}
                </span>
              )}
              <Link
                href={`https://api.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                className="flex gap-1 h-fit items-center text-[13px] font-normal text-primary group transition-all duration-150"
              >
                <IoLogoWhatsapp size={22} className="fill-green-500" />
                <span className="text-secudary text-[13px] font-normal group-hover:underline group-hover:text-blue-400">
                  Tire suas dúvidas
                </span>
              </Link>
            </div>
            {vapeData.productDescount ? (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-secudary text-sm font-medium">
                    Produto com
                  </span>
                  <div className="rounded-2xl h-8 w-fit px-3 bg-ccba00 text-[13px] text-primary font-medium flex items-center justify-center">
                    -{(vapeData.productDescount * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="text-sm font-medium line-through text-00000099 ">
                  De {formatPrice(vapeData.basePrice)}
                </div>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <div className={`text-3xl font-semibold text-red-600`}>
                {formatPrice(vapeData.finalPrice)}
              </div>
              {vapeData.productDescount ? (
                <>
                  <span className="bg-transparent text-secudary font-medium text-[13px] px-2 py-[6px] border border-solid border-gray-300 rounded-2xl">
                    Economize
                  </span>
                  <span className="text-sm font-medium text-secudary">
                    {formatPrice(vapeData.basePrice - vapeData.finalPrice)}
                  </span>
                </>
              ) : null}
            </div>
            {vapeData.pixDescount ? (
              <div className="text-sm font-medium text-00000099">
                {formatPrice(vapeData.pixPrice)} a vista no Pix
              </div>
            ) : null}
            <div className="text-sm font-medium  text-00000099">
              ou 4x de {formatPrice(vapeData.finalPrice / 4)} sem juros no
              cartão de credito
            </div>
          </div>
        </div>
      </Container90>
    </Main>
  );
}
