import Image from 'next/image';

import Main from '@/components/main';

export default async function Page() {
  return (
    <Main>
      <div className="px-12 py-8 w-[90%] mx-auto min-h-screen">
        <div className="flex justify-between gap-4 w-full">
          <div className="flex gap-2 w-1/4">
            <Image
              src="/assets/imgs/Motoboyimg1.png"
              alt="Motoboyimg1"
              width={60}
              height={60}
              className="flex-none"
            />
            <div className="flex flex-col">
              <h2 className="text-base font-medium text-secudary">MotoBoy</h2>
              <p className="text-gray-500 text-sm font-normal">
                Entrega no mesmo dia útil para pedidos pago até as 15:30h.
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-1/4">
            <Image
              src="/assets/imgs/Correiosimg1.png"
              alt="Correiosimg1"
              width={60}
              height={60}
              className="flex-none"
            />
            <div className="flex flex-col">
              <h2 className="text-base font-medium text-secudary">Correios</h2>
              <p className="text-gray-500 text-sm font-normal">
                Postagem no mesmo dia útil para pedidos pago até as 14:00h.
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-1/4">
            <Image
              src="/assets/imgs/piximg1.png"
              alt="piximg1"
              width={60}
              height={60}
              className="flex-none"
            />
            <div className="flex flex-col">
              <h2 className="text-base font-medium text-secudary">Pix</h2>
              <p className="text-gray-500 text-sm font-normal">
                10% de desconto e rápida aprovação.
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-1/4">
            <Image
              src="/assets/imgs/cartaoimg1.png"
              alt="cartaoimg1"
              width={60}
              height={60}
              className="flex-none"
            />
            <div className="flex flex-col">
              <h2 className="text-base font-medium text-secudary">Cartão</h2>
              <p className="text-gray-500 text-sm font-normal">
                Parcelamento em até 4x sem Juros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}
