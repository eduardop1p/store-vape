/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
'use client';

import { Checkbox } from '@mui/material';
import { useRef, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { FiltersDbType } from '@/app/api/filters/route';
import { upperFirst } from 'lodash';
import { VapeType } from '@/app/api/models/vape';
import ProductsGrid from '../products';
import Loading from '../loading';
import AlertMsg, { OpenAlertType } from '../alertMsg';

interface FiltersDataType {
  checked?: boolean;
  value?: string;
  querys: {
    value: string;
    query?: string;
  };
}

interface FiltersType {
  title: string;
  active: boolean;
  data: FiltersDataType[];
}

export default function Filters({
  filters,
  title,
  vapeData,
}: {
  filters: FiltersDbType;
  title: string;
  vapeData: VapeType[];
}) {
  const filtersInitialState = useRef<FiltersType[]>([
    {
      title: 'Categoria',
      active: true,
      data: [
        ...filters.category,
        ...filters.subcategory2,
        ...filters.subcategory3,
      ],
    },
    {
      title: 'Preço',
      active: true,
      data: [
        {
          checked: false,
          value: 'Até R$ 332,99',
          querys: {
            value: 'price',
            query: '332.99-0',
          },
        },
        {
          querys: {
            value: 'price',
            query: '333-655.99',
          },
          checked: false,
          value: 'De R$ 333,00 a R$ 665,99',
        },
        {
          querys: {
            value: 'price',
            query: '666-998.99',
          },
          checked: false,
          value: 'De R$ 666,00 a R$ 998,99',
        },
        {
          querys: {
            value: 'price',
            query: '999-1131.99',
          },
          checked: false,
          value: 'De R$ 999,00 a R$ 1.331,99',
        },
        {
          querys: {
            value: 'price',
            query: '1332-1664.99',
          },
          checked: false,
          value: 'De R$ 1.332,00 a R$ 1.664,99',
        },
        {
          querys: {
            value: 'price',
            query: '0-1999.9',
          },
          checked: false,
          value: ' Acima de R$ 1.999,90',
        },
      ],
    },
    {
      title: 'Marca',
      active: false,
      data: [...filters.mark],
    },
    {
      title: 'Status',
      active: true,
      data: [
        {
          checked: false,
          value: 'Destaque',
          querys: {
            value: 'status',
            query: 'Destaque',
          },
        },
        {
          checked: false,
          value: 'Novidade',
          querys: {
            value: 'status',
            query: 'Novidade',
          },
        },
      ],
    },
    {
      title: 'Sabores',
      active: false,
      data: [...filters.flavors],
    },
    {
      title: 'Cores',
      active: false,
      data: [...filters.colors],
    },
    {
      title: 'Com ou sem bateria',
      active: true,
      data: [
        {
          checked: false,
          value: 'Com bateria',
          querys: {
            value: 'withBattery',
            query: 'true',
          },
        },
        {
          checked: false,
          value: 'Sem bateria',
          querys: {
            value: 'withBattery',
            query: 'false',
          },
        },
      ],
    },
    {
      title: 'Com opção ohm',
      active: false,
      data: [...filters.ohm],
    },
    {
      title: 'Quantidade de nicotina',
      active: true,
      data: [...filters.nicotina],
    },
    {
      title: 'Quantidade em ml',
      active: false,
      data: [...filters.ml],
    },
    {
      title: 'Quantidade de itens no produto',
      active: false,
      data: [...filters.qtdItems],
    },
  ]);

  const [stateVapeData, setStateVapeData] = useState(vapeData);
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState<OpenAlertType>({
    open: false,
    msg: '',
    severity: 'success',
  });
  let urlSearchQuery = useRef(
    new URL(`${process.env.NEXT_PUBLIC_API_URL}/selected-filters`)
  );

  const [filtersData, setFiltersData] = useState<FiltersType[]>(
    filtersInitialState.current
  );
  const [classify, setClassify] = useState({
    active: false,
    activeValue: 'Relevância',
    data: [
      {
        title: 'Nome do produto',
        query: 'name',
      },
      {
        title: 'Menor preço',
        query: 'price-lte',
      },
      {
        title: 'Maior preço',
        query: 'price-gte',
      },
      {
        title: 'Mais vendido',
        query: 'buy',
      },
      {
        title: 'Lançamento',
        query: 'launch',
      },
      {
        title: 'Relevância',
        query: 'relevance',
      },
    ],
  });

  const handleGetFilters = async (url: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
      });
      if (!res.ok) throw new Error('Error');
      const { data } = await res.json();
      setStateVapeData(data);
    } catch (err) {
      console.log(err);
      setOpenAlert({
        msg: 'Erro ao buscar filtros, tente novalmente',
        open: true,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handelSearchQuery = async (data: FiltersDataType) => {
    urlSearchQuery.current = new URL(urlSearchQuery.current);
    const searchParams = urlSearchQuery.current.searchParams;
    const { checked, querys } = data;
    if (checked) {
      if (searchParams.has(querys.value)) {
        const query = searchParams.get(querys.value)!;
        searchParams.set(querys.value, query.concat(`,${querys.query!}`));
      } else {
        searchParams.set(querys.value, querys.query!);
      }
    } else {
      let query: string[] | string = searchParams.get(querys.value)?.split(',')!; // eslint-disable-line

      if (searchParams.has(querys.value) && query.length > 1) { // eslint-disable-line
        query = query.filter(val => val != querys.query).join(',');
        searchParams.set(querys.value, query);
      } else {
        searchParams.delete(querys.value, querys.query);
      }
    }
    handleGetFilters(urlSearchQuery.current.href);
  };

  const handelSearchClassify = async (query: string) => {
    urlSearchQuery.current = new URL(urlSearchQuery.current);
    urlSearchQuery.current.searchParams.set('classify', query);
    handleGetFilters(urlSearchQuery.current.href);
  };

  const handleResetFilters = async () => {
    urlSearchQuery.current = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}/selected-filters`
    );
    await handleGetFilters(urlSearchQuery.current.href);
    setFiltersData(
      filtersInitialState.current.map(val => ({
        ...val,
        data: val.data.map(_v => ({ ..._v, checked: false })),
      }))
    );
    document.documentElement.scrollTop = 0;
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="fixed">
        <AlertMsg openAlert={openAlert} setOpenAlert={setOpenAlert} />
      </div>
      <div className="flex flex-col gap-5 max-w-[300px] flex-none">
        {filtersData.map((val, i) => (
          <div key={i} className="flex flex-col gap-2 w-fit">
            <button
              type="button"
              className={`text-start cursor-pointer group text-xl font-medium ${val.active ? 'text-555555' : 'text-secudary hover:text-555555'} transition-all duration-200`}
              onClick={() => {
                let newArr = [...filtersData];
                newArr[i] = { ...newArr[i], active: !newArr[i].active };
                setFiltersData(newArr);
              }}
            >
              {val.title}
              <IoIosArrowDown
                size={16}
                className={`inline-block ml-2 ${val.active ? 'fill-555555 rotate-180' : 'group-hover:fill-555555 fill-secudary'} transition-all duration-200`}
              />
            </button>
            {val.active && val.data.length ? (
              <div className="flex flex-col gap-2">
                {val.data.map(
                  (_v, _i) =>
                    _v.value && (
                      <div
                        key={_i}
                        className="flex items-start gap-1 cursor-pointer group w-fit"
                        onClick={() => {
                          let newArr = [...filtersData]; // eslint-disable-line
                          newArr[i].data[_i].checked =
                            !newArr[i].data[_i].checked;
                          handelSearchQuery(newArr[i].data[_i]);
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
          onClick={handleResetFilters}
        >
          Limpar filtros
        </button>
      </div>
      <div className="flex gap-6 flex-col items-start w-full">
        <h1 className="text-4xl text-secudary font-semibold">{title}</h1>
        <div className="relative z-[5] flex items-center gap-2">
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
              className={`bg-gray-600 hover:bg-gray-500 cursor-pointer duration-200 transition-colors text-primary flex items-center justify-center gap-2 px-4 h-11 rounded-3xl text-sm font-medium`}
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
                  ? `${classify.data.length * 28.3}px`
                  : '0px',
                opacity: classify.active ? 1 : 0,
              }}
              onClick={event => event.stopPropagation()}
            >
              {classify.data.map((val, i) => (
                <button
                  key={val.title}
                  type="button"
                  className={`whitespace-nowrap text-[13px] text-left font-normal px-3 py-1 text-primary ${classify.data.length - 1 !== i && 'border-b border-solid border-b-gray-500'} ${classify.activeValue == val.title ? 'bg-gray-500' : 'hover:bg-gray-500'} transition-colors duration-200 cursor-pointer`}
                  onClick={() => {
                    setClassify(state => ({
                      ...state,
                      active: false,
                      activeValue: val.title,
                    }));
                    handelSearchClassify(val.query);
                  }}
                >
                  {val.title}
                </button>
              ))}
            </div>
          </div>
        </div>
        <ProductsGrid vapeData={stateVapeData} gridCols="grid-cols-3" />
      </div>
    </>
  );
}
