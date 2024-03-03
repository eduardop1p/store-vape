import Image from 'next/image';

import Main from '@/components/main';
import Container90 from '@/components/container90';
import ProductsGrid from '@/components/products/grid';
import { VapeType } from './api/models/vape';
import UnavailablePage from '@/components/unavailablePage';

export default async function Page() {
  let vapeData: VapeType[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/selected-filters?classify=relevance&category=Pod Descartável`,
      {
        method: 'GET',
      }
    );
    if (!res.ok) throw new Error('Error');
    const { data } = await res.json();
    vapeData = data;
  } catch (err) {
    console.log(err);
    return <UnavailablePage />;
  }

  return (
    <Main>
      <Container90 className="gap-10">
        <div className="flex justify-between gap-4 w-full">
          <div className="flex gap-2 items-start">
            <Image
              src="/assets/imgs/Motoboyimg1.png"
              alt="Motoboyimg1"
              width={60}
              height={60}
              className="flex-none object-contain"
            />
            <div className="flex flex-col">
              <h2 className="text-base font-medium text-secudary">MotoBoy</h2>
              <p className="text-gray-500 text-sm font-normal">
                Entrega no mesmo dia útil para pedidos pago até as 15:30h.
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-start">
            <Image
              src="/assets/imgs/Correiosimg1.png"
              alt="Correiosimg1"
              width={60}
              height={60}
              className="flex-none object-contain"
            />
            <div className="flex flex-col">
              <h2 className="text-base font-medium text-secudary">Correios</h2>
              <p className="text-gray-500 text-sm font-normal">
                Postagem no mesmo dia útil para pedidos pago até as 14:00h.
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-start">
            <Image
              src="/assets/imgs/piximg1.png"
              alt="piximg1"
              width={60}
              height={60}
              className="flex-none object-contain"
            />
            <div className="flex flex-col">
              <h2 className="text-base font-medium text-secudary">Pix</h2>
              <p className="text-gray-500 text-sm font-normal">
                10% de desconto e rápida aprovação.
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-start">
            <Image
              src="/assets/imgs/cartaoimg1.png"
              alt="cartaoimg1"
              width={60}
              height={60}
              className="flex-none object-contain"
            />
            <div className="flex flex-col">
              <h2 className="text-base font-medium text-secudary">Cartão</h2>
              <p className="text-gray-500 text-sm font-normal">
                Parcelamento em até 4x sem Juros.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-6">
          <h1 className="text-secudary font-medium text-3xl">
            Pod Descartável
          </h1>
          <p className="text-sm font-medium text-secudary">
            Os melhores Pods Descartáveis você encontra aqui, Confira!
          </p>
          <ProductsGrid vapeData={vapeData} />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-secudary font-medium text-3xl">
            Produtos Mais Vendido
          </h1>
          <p className="text-sm font-medium text-secudary">
            Os mais procurados estão aqui, confira.
          </p>
          <div className="mt-4">{/*  Produtos Mais Vendido */}</div>
        </div>
      </Container90>
      <div className="w-full h-[1px] bg-555555"></div>
    </Main>
  );
}
