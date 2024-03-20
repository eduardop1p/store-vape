'use client';

import replaceStringToLink from '@/services/replaceStringToLink';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

interface DataMenuType {
  name: string;
  type?: 'menu-1' | 'menu-2' | 'menu-3';
  menu?: {
    title?: string;
    titles?: string[];
    name?: string;
    names?: string[];
  }[];
}

export default function Links() {
  const [hideLinks, setHideLinks] = useState(false);
  const dataMenu: DataMenuType[] = [
    {
      name: 'Pod Descartável',
      type: 'menu-1',
      menu: [
        { name: 'Pod Descartável Atacado' },
        {
          name: 'Pod Descartável 2500 a 5000 Puffs',
        },
        {
          name: 'Pod Descartável 5000 a 10000 Puffs',
        },
      ],
    },
    {
      name: 'Aparelhos',
      type: 'menu-2',
      menu: [
        {
          title: 'Vapes',
          names: [
            'Kits Avançados',
            'Kits Intermediários',
            'Kits Iniciante',
            'Mods',
          ],
        },
        {
          title: 'Pods System',
          names: ['Aparelhos', 'Pods juul'],
        },
      ],
    },
    {
      name: 'E-Liquids',
      type: 'menu-2',
      menu: [
        {
          title: 'Freebase',
          names: [
            'Atabacados - Cigarro',
            'Café',
            'Mentolados - Gelados',
            'Frutados',
            'Doces - Sobremesas',
            'Refrigerante - Bebidas',
            'Chicletes - Balas',
          ],
        },
        {
          title: 'Nic Salt',
          names: [
            'Refrigerante / Bebidas',
            'Tabaco / Cigarros',
            'Café',
            'Mentolados / Gelados',
            'Frutados',
            'Doces / Sobremesas',
            'Chicletes / Balas',
          ],
        },
        {
          title: 'CBD',
        },
      ],
    },
    {
      name: 'Acessórios',
      type: 'menu-3',
      menu: [
        {
          titles: ['Tanques - Vidros', 'Atomizadores', 'Atomizadores RDA'],
        },
        {
          titles: [
            'Atomizadores RTA',
            'Atomizadores Sub Ohm',
            'Algodão Para Vape',
          ],
        },
        {
          titles: [
            'Baterias Para Vape',
            'Bobinas e Resistências - Vape',
            'Capas - Cases',
          ],
        },
        {
          titles: [
            'Carregadores',
            'Kit de Ferramentas',
            'Cartuchos e Resistências - Pod System',
          ],
        },
      ],
    },
    {
      name: 'Vapes de ervas',
    },
    {
      name: 'Marcas',
      type: 'menu-3',
      menu: [
        {
          titles: [
            'AIR FACTORY',
            'BAZOOKA',
            'BIG BOOTLE CO',
            'BLACK NOTE',
            'BLVK',
            'CLOWN',
            'SMOK',
            'GEEKVAPE',
            'HELLVAPE',
            'VAPORESSO',
            'VOOPOO',
            'VAPESOUL',
          ],
        },
        {
          titles: [
            'CUTTWOOD',
            'DINNER LADY',
            'DION',
            'ELEMENT',
            'GLAS VAPOR',
            'GOLD LEAF LIQUIDS',
            'HALO',
            'HORNY FLAVA',
            'IGNITE',
            'JOYETECH J',
            'JOY E TECH PREMIUM',
            'KILO',
          ],
        },
        {
          titles: [
            'COLD BREW',
            'KING SCREST',
            'MAGNA',
            'MR. FREEZE',
            'MSML MARSHMALLOW',
            'NAKED',
            'NASTY JUICE',
            'NKTR',
            'PACHAMAMA',
            'PROJECT CLOUD',
            'RIOT SQUAD',
          ],
        },
        {
          titles: [
            'RIPE VAPES',
            'SALT NICOTINE',
            'SECRET SAUCE',
            'THE MILKMAN',
            'TOP CLASS',
            'TRUST',
            'TWIT E-LIQUID',
            'V8 E-JUICE',
            'VAPETASIA',
            'VGOD',
            'ZOMO',
          ],
        },
      ],
    },
    {
      name: 'Ofertas especiais',
      type: 'menu-2',
      menu: [
        {
          title: 'PROMOÇÕES',
          names: ['PROMOÇÕES ATOMIZADORES'],
        },
      ],
    },
  ];

  useEffect(() => {
    let lastScrollTop = 0;
    const onscroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      scrollY > 100 && scrollY > lastScrollTop
        ? setHideLinks(true)
        : setHideLinks(false);
      lastScrollTop = scrollY <= 0 ? 0 : scrollY;
    };
    window.addEventListener('scroll', onscroll);

    return () => window.removeEventListener('scroll', onscroll);
  }, []);

  return (
    // eslint-disable-next-line
    <div className={`w-[85%] relative flex items-center gap-1 justify-between transition-all duration-200 ${hideLinks ? 'h-[0px] overflow-hidden' : 'h-[50px] mt-1'}`}>
      {dataMenu.map((entries, index) => (
        <LinkCustom key={index} {...entries} />
      ))}
    </div>
  );
}

const LinkCustom = ({ name, menu, type }: DataMenuType) => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div
      className="flex flex-col"
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      <Link
        href={`/${replaceStringToLink(name)}`}
        className={` relative after:absolute after:content-[''] after:h-5 after:w-full after:top-11 after:left-0 whitespace-nowrap h-[50px] flex items-center gap-2 justify-between px-4 hover:bg-ffffff1F rounded-3xl transition-colors duration-200 text-primary font-normal text-sm`}
        onClick={() => setShowMenu(false)}
      >
        {name}
        {menu && <IoIosArrowDown size={16} fill="#fff" />}

        {menu && (
          <div
            className={`${showMenu ? 'translate-y-0 opacity-100 visible pointer-events-auto' : 'translate-y-14 opacity-0 invisible pointer-events-none'} transition-all duration-150 absolute top-[65px] bg-primary w-3 h-3`}
            style={{
              transform: 'scaleY(2) rotate(45deg)',
              left: '50%',
              transition: 'translateX(-50%)',
            }}
          ></div>
        )}
      </Link>

      {menu && (
        <div
          tabIndex={0}
          className={`-z-[1] border border-solid border-3d3d3d absolute bg-primary left-0 top-16 w-full min-h-48 p-6 cursor-default rounded-2xl transition-all duration-200 ${showMenu ? 'translate-y-0 opacity-100 visible pointer-events-auto' : 'translate-y-14 opacity-0 invisible pointer-events-none'}`} // eslint-disable-line
        >
          {type === 'menu-1' && (
            <div className="flex justify-start gap-12">
              {menu.map(val => (
                <Link
                  key={val.name}
                  className="hover:text-gray-500 transition-colors duration-200 text-[15px] text-secudary font-medium underline"
                  href={`/${replaceStringToLink(name)}/${replaceStringToLink(val.name!)}`}
                  onClick={() => setShowMenu(false)}
                >
                  {val.name}
                </Link>
              ))}
            </div>
          )}
          {type === 'menu-2' && (
            <div className="flex gap-12">
              {menu.map(val => (
                <div key={val.title} className="flex flex-col gap-1">
                  <Link
                    href={`/${replaceStringToLink(name)}/${replaceStringToLink(val.title!)}`}
                    className="text-[15px] text-secudary font-medium underline mb-1 hover:text-gray-500 transition-colors duration-200"
                  >
                    {val.title}
                  </Link>
                  {val.names?.map(val2Names => (
                    <Link
                      key={val2Names}
                      href={`/${replaceStringToLink(name)}/${replaceStringToLink(val.title!)}/${replaceStringToLink(val2Names!)}`}
                      className="text-sm text-secudary font-normal underline hover:text-gray-500 transition-colors duration-200 "
                    >
                      {val2Names}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
          {type === 'menu-3' && (
            <div className="flex justify-start gap-12">
              {menu.map((val, index) => (
                <div key={index} className="flex flex-col gap-1">
                  {val.titles?.map(valTitles => (
                    <Link
                      key={valTitles}
                      className="w-fit hover:text-gray-500 transition-colors duration-200 text-[15px] text-secudary font-medium underline"
                      href={`/${replaceStringToLink(name)}/${replaceStringToLink(valTitles)}`}
                      onClick={() => setShowMenu(false)}
                    >
                      {valTitles}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
