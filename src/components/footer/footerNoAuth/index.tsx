import Link from 'next/link';
import { IoLogoWhatsapp } from 'react-icons/io';
import { FaRegClock } from 'react-icons/fa';
import Image from 'next/image';

import FormFooterNoAuth from './form';

export default function FooterNoAuth() {
  return (
    <div className="flex flex-col">
      <div className="py-16 w-full">
        <h1 className="text-3xl font-semibold text-secudary text-center">
          Últimas Notícias
        </h1>
      </div>
      <div className="w-full bg-7a7a7a justify-center items-center py-8 flex flex-col gap-4">
        <h2 className="text-lg font-normal text-primary">
          Venha fazer parte do Clube King vapes!
        </h2>
        <FormFooterNoAuth />
      </div>
      <div className="bg-3d3d3d px-12 py-8">
        <div className=" w-[80%]  mx-auto flex justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Link
              href="/como-comprar"
              className="text-[13px] font-normal text-primary hover:underline hover:text-blue-400 transition-all duration-150"
            >
              Como comprar
            </Link>
            <Link
              href="/seguranca"
              className="text-[13px] font-normal text-primary hover:underline hover:text-blue-400 transition-all duration-150"
            >
              Segurança
            </Link>
            <Link
              href="/envio"
              className="text-[13px] font-normal text-primary hover:underline hover:text-blue-400 transition-all duration-150"
            >
              Envio
            </Link>
            <Link
              href="/pagamento"
              className="text-[13px] font-normal text-primary hover:underline hover:text-blue-400 transition-all duration-150"
            >
              Pagamento
            </Link>
            <Link
              href="/tempo-garantia"
              className="text-[13px] font-normal text-primary hover:underline hover:text-blue-400 transition-all duration-150"
            >
              Tempo de garantia
            </Link>
            <Link
              href="/trocas-devolucoes"
              className="text-[13px] font-normal text-primary hover:underline hover:text-blue-400 transition-all duration-150"
            >
              Trocas e devoluções
            </Link>
            <Link
              href="/contato"
              className="text-[13px] font-normal text-primary hover:underline hover:text-blue-400 transition-all duration-150"
            >
              Contato
            </Link>
          </div>
          <Link
            href={`https://api.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            className="flex gap-1 h-fit items-center text-[13px] font-normal text-primary hover:underline hover:text-blue-400 transition-all duration-150"
          >
            <IoLogoWhatsapp size={20} className="fill-green-500" />
            {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
          </Link>
          <div className="flex gap-1 items-center h-fit">
            <FaRegClock fill="#fff" size={18} />
            <p className="text-[13px] font-normal text-primary">
              Atendimento de segunda a sexta das 09:00 as 18:00h.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="flex flex-col gap-1 items-start">
                <Image
                  alt="pag_peqpagseguro"
                  src="/assets/imgs/pag_peqpagseguro.png"
                  width={37}
                  height={40}
                />
                <p className="text-[10px] font-normal text-primary">A vista</p>
              </div>
              <div className="flex flex-col gap-1 items-start">
                <Image
                  alt="pag_peqbase"
                  src="/assets/imgs/pag_peqbase.png"
                  width={37}
                  height={40}
                />
                <p className="text-[10px] font-normal text-primary">
                  Parcelado
                </p>
              </div>
            </div>
            <Image
              alt="selo_lojaprotegida"
              src="/assets/imgs/selo_lojaprotegida.gif"
              width={130}
              height={40}
            />
          </div>
        </div>
      </div>
      <div className="bg-primary px-12 py-4">
        <p className="w-[80%] mx-auto text-left text-[13px] font-normal text-secudary">
          A King Vapes é uma das lojas que mais se preocupa com você amigo e
          cliente, sempre trazendo novidades e preço justo. Buscamos levar o que
          há de melhor, vapes, juices, acessórios, coils e muito mais. Fazemos
          entrega para todo o Brasil com agilidade e segurança.
        </p>
      </div>
    </div>
  );
}
