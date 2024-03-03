'use client';

import { Checkbox } from '@mui/material';
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { FiltersDbType } from '@/app/api/filters/route';
import { upperFirst } from 'lodash';

interface FiltersType {
  name: string;
  active: boolean;
  data: {
    metadata?: number[];
    checked?: boolean;
    value?: string;
  }[];
}

export default function Filters({ filters }: { filters: FiltersDbType }) {
  const filtersInitialState: FiltersType[] = [
    {
      name: 'Categoria',
      active: true,
      data: [...filters.category],
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
      data: [...filters.mark],
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
      data: [...filters.flavors],
    },
    {
      name: 'Cores',
      active: false,
      data: [...filters.colors],
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
      data: [...filters.ohm],
    },
    {
      name: 'Quantidade de nicotina',
      active: true,
      data: [...filters.nicotina],
    },
    {
      name: 'Quantidade em ml',
      active: false,
      data: [...filters.ml],
    },
    {
      name: 'Quantidade de itens no produto',
      active: false,
      data: [...filters.qtdItems],
    },
  ];

  const [filtersData, setFiltersData] =
    useState<FiltersType[]>(filtersInitialState);
  const [classify, setClassify] = useState({
    active: false,
    activeValue: 'Relevância',
    values: [
      'Nome do produto',
      'Menor preço',
      'Maior preço',
      'Mais vendido',
      'Lançamento',
      'Relevância',
    ],
  });

  return (
    <>
      <div className="flex flex-col gap-5 max-w-[300px]">
        {filtersData.map((val, i) => (
          <div key={i} className="flex flex-col gap-2 w-fit">
            <div
              className="flex gap-2 items-start cursor-pointer group w-fit"
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
                className={`flex-none mt-2 ${val.active ? 'fill-555555 rotate-180' : 'group-hover:fill-555555 fill-secudary'} transition-all duration-200`}
              />
            </div>
            {val.active && val.data.length ? (
              <div className="flex flex-col gap-2">
                {val.data.map(
                  (_v, _i) =>
                    _v.value && (
                      <div
                        key={_i}
                        className="flex items-center gap-1 cursor-pointer group w-fit"
                        onClick={() => {
                          let newArr = [...filtersData]; // eslint-disable-line
                          newArr[i].data[_i].checked =
                            !newArr[i].data[_i].checked;
                          setFiltersData(newArr);
                        }}
                      >
                        <Checkbox
                          checked={_v.checked}
                          size="small"
                          className="!p-0 text-secudary font-normal group-hover:text-blue-500"
                        />
                        <span
                          className={`${_v.checked ? 'text-blue-500' : 'hover:text-blue-500 text-secudary'} font-medium text-[13px]  duration-200 transition-colors`}
                        >
                          {upperFirst(_v.value)}
                        </span>
                      </div>
                    )
                )}
              </div>
            ) : null}
          </div>
        ))}
        <button
          type="button"
          className="px-4 h-[50px] rounded-xl w-fit bg-secudary text-primary text-sm hover:bg-555555 transition-all duration-200 hover:scale-105"
          onClick={() => setFiltersData(filtersInitialState)}
        >
          Limpar filtros
        </button>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center gap-2">
          <span className="text-secudary text-sm font-medium">
            Classificar por:
          </span>
          <div
            className="relative"
            tabIndex={0}
            onBlur={event => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setClassify(state => ({ ...state, active: false }));
            }}
          >
            <div
              className="bg-gray-600 hover:bg-gray-500 cursor-pointer duration-200 transition-colors text-primary flex items-center justify-center gap-2 px-4 h-11 rounded-3xl text-sm font-medium"
              onClick={() =>
                setClassify(state => ({
                  ...state,
                  active: !state.active,
                }))
              }
            >
              {classify.activeValue}
              <IoIosArrowDown
                size={14}
                fill="#fff"
                stroke="#fff"
                strokeWidth={5}
                className={`${classify.active ? 'rotate-180' : 'rotate-0'} duration-200 transition-transform`}
              />
            </div>
            <div
              className={`transition-all duration-200 flex absolute top-12 bg-gray-600 rounded-lg flex-col left-0 overflow-hidden`}
              style={{
                height: classify.active
                  ? `${classify.values.length * 28.3}px`
                  : '0px',
                opacity: classify.active ? 1 : 0,
              }}
              onClick={event => event.stopPropagation()}
            >
              {classify.values.map((val, i) => (
                <button
                  key={val}
                  type="button"
                  className={`whitespace-nowrap text-[13px] text-left font-normal px-3 py-1 text-primary ${classify.values.length - 1 !== i && 'border-b border-solid border-b-gray-500'} hover:bg-gray-500 transition-colors duration-200 cursor-pointer`}
                  onClick={() =>
                    setClassify(state => ({
                      ...state,
                      active: false,
                      activeValue: val,
                    }))
                  }
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
