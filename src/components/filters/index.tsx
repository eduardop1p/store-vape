'use client';

import { Checkbox } from '@mui/material';
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

interface FiltersType {
  name: string;
  active: boolean;
  data: {
    metadata?: number[];
    checked?: boolean;
    value: string;
  }[];
}

export default function Filters() {
  const filtersInitialState: FiltersType[] = [
    {
      name: 'Categoria',
      active: true,
      data: [],
    },
    {
      name: 'Preço',
      active: true,
      data: [
        {
          metadata: [332.99],
          checked: false,
          value: 'Até R$ 332,99',
        },
        {
          metadata: [333, 655.99],
          checked: false,
          value: 'De R$ 333,00 a R$ 665,99',
        },
        {
          metadata: [666, 998.99],
          checked: false,
          value: 'De R$ 666,00 a R$ 998,99',
        },
        {
          metadata: [999, 1131.99],
          checked: false,
          value: 'De R$ 999,00 a R$ 1.331,99',
        },
        {
          metadata: [1332, 1664.99],
          checked: false,
          value: 'De R$ 1.332,00 a R$ 1.664,99',
        },
        {
          metadata: [1999.9],
          checked: false,
          value: ' Acima de R$ 1.999,90',
        },
      ],
    },
    {
      name: 'Marca',
      active: false,
      data: [],
    },
    {
      name: 'Status',
      active: true,
      data: [
        {
          checked: false,
          value: 'Destaque',
        },
        {
          checked: false,
          value: 'Novidade',
        },
      ],
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
      active: true,
      data: [
        {
          checked: false,
          value: 'Com bateria',
        },
        {
          checked: false,
          value: 'Sem bateria',
        },
      ],
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
  ];

  const [filtersData, setFiltersData] =
    useState<FiltersType[]>(filtersInitialState);

  return (
    <div className="flex flex-col gap-5">
      {filtersData.map((val, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div
            className="flex gap-2 items-center cursor-pointer group w-fit"
            onClick={() => {
              let newArr = [...filtersData];
              newArr[i] = { ...newArr[i], active: !newArr[i].active };
              setFiltersData(newArr);
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
          {val.active && (
            <div className="flex flex-col gap-2">
              {val.data.map((_v, _i) => (
                <div
                  key={_i}
                  className="flex items-center gap-1 cursor-pointer group w-fit"
                  onClick={() => {
                    let newArr = [...filtersData]; // eslint-disable-line
                    newArr[i].data[_i].checked = !newArr[i].data[_i].checked;
                    setFiltersData(newArr);
                  }}
                >
                  <Checkbox
                    checked={_v.checked}
                    size="small"
                    className="!p-0 text-secudary font-normal group-hover:text-blue-500"
                  />
                  <span className="text-secudary font-medium text-[13px] hover:text-blue-500 duration-200 transition-colors">
                    {_v.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
