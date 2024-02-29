'use client';

import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

export default function Classify() {
  const [classifyData, setClassifyData] = useState([
    {
      name: 'Categoria',
      active: true,
      data: [],
    },
    {
      name: 'Preço',
      active: false,
      data: [],
    },
    {
      name: 'Marca',
      active: false,
      data: [],
    },
    {
      name: 'Status',
      active: false,
      data: [],
    },
    {
      name: 'Sabores',
      active: false,
      data: [],
    },
    {
      name: 'Cores',
      active: false,
      data: [],
    },
    {
      name: 'Com ou sem bateria',
      active: false,
      data: [],
    },
    {
      name: 'Com opção ohm',
      active: false,
      data: [],
    },
    {
      name: 'Quantidade de nicotina',
      active: false,
      data: [],
    },
    {
      name: 'Quantidade em ml',
      active: false,
      data: [],
    },
    {
      name: 'Quantidade de itens no produto',
      active: false,
      data: [],
    },
  ]);

  return (
    <div className="flex flex-col gap-5">
      {classifyData.map((val, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div
            className="flex gap-2 items-center cursor-pointer group"
            onClick={() => {
              const newArr = classifyData.map(_ => val.name == _.name ? { ..._, active: !_.active, } : _); // eslint-disable-line
              setClassifyData(newArr);
            }}
          >
            <h2
              className={`text-xl font-medium ${val.active ? 'text-555555' : 'text-secudary group-hover:text-555555'} transition-all duration-200`}
            >
              {val.name}
            </h2>
            <IoIosArrowDown
              size={16}
              className={`${val.active ? 'fill-555555 rotate-180' : 'group-hover:fill-555555 fill-secudary'} transition-all duration-200`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
