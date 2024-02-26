'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

export default function Links() {
  const [hideLinks, setHideLinks] = useState(false);

  useEffect(() => {
    const onscroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      scrollY > 30 ? setHideLinks(true) : setHideLinks(false);
    };
    window.addEventListener('scroll', onscroll);

    return () => window.removeEventListener('scroll', onscroll);
  }, []);

  return (
    // eslint-disable-next-line
    <div className={`w-[85%] flex items-center gap-1 justify-between transition-all duration-200 ${hideLinks ? 'h-[0px] overflow-hidden' : 'h-[50px] mt-1'}`}>
      <LinkCustom link="/pod-descartavel" title="Pod Descartável" />
      <LinkCustom link="/aparelhos" title="Aparelhos" />
      <LinkCustom link="/e-liquids" title="E-Liquids" />
      <LinkCustom link="/acessorios" title="Acessórios" />
      <LinkCustom link="/vapes-ervas" title="Vapes de ervas" />
      <LinkCustom link="/marcas" title="Marcas" />
      <LinkCustom link="/ofertas-especiais" title="Ofertas especiais" />
      <div className="h-[50px] flex items-center gap-2 justify-between px-4 hover:bg-ffffff1F rounded-3xl transition-colors duration-200 text-primary font-normal text-sm">
        +Categorias
      </div>
    </div>
  );
}

const LinkCustom = ({ link, title }: { link: string; title: string }) => {
  return (
    <Link
      href={link}
      className="whitespace-nowrap h-[50px] flex items-center gap-2 justify-between px-4 hover:bg-ffffff1F rounded-3xl transition-colors duration-200 text-primary font-normal text-sm"
    >
      {title}
      <IoIosArrowDown size={16} fill="#fff" />
    </Link>
  );
};
