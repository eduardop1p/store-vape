/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
'use client';

import dynamic from 'next/dynamic';
import { Checkbox } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { upperFirst, cloneDeep } from 'lodash'; // cloneDeep vai criar uma copia profuda de determinado objeto ou array
import nProgress from 'nprogress';

import { FiltersDbType } from '@/app/api/filters/route';
import ProductsGrid from '../products';
import Loading from '../loading';
import AlertMsg, { OpenAlertType } from '../alertMsg';
import { VapeDataAndPaginationType } from '@/app/pod-descartavel/page';
const PaginationComponent = dynamic(() => import('./pagination'), {
  ssr: false,
});

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
  vapeData: VapeDataAndPaginationType;
}) {
  useEffect(() => {
    setStateVapeData(vapeData);
  }, [vapeData]);

  const filtersInitialState = useRef([
    {
      title: 'Categoria',
      active: true,
      data: [
        ...filters.category.map(item => ({ ...item })),
        ...filters.subcategory2.map(item => ({ ...item })),
        ...filters.subcategory3.map(item => ({ ...item })),
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
            query: '0-332.99',
          },
        },
        {
          querys: {
            value: 'price',
            query: '655.99-333',
          },
          checked: false,
          value: 'De R$ 333,00 a R$ 665,99',
        },
        {
          querys: {
            value: 'price',
            query: '998.99-666',
          },
          checked: false,
          value: 'De R$ 666,00 a R$ 998,99',
        },
        {
          querys: {
            value: 'price',
            query: '1131.99-999',
          },
          checked: false,
          value: 'De R$ 999,00 a R$ 1.331,99',
        },
        {
          querys: {
            value: 'price',
            query: '1664.99-1332',
          },
          checked: false,
          value: 'De R$ 1.332,00 a R$ 1.664,99',
        },
        {
          querys: {
            value: 'price',
            query: '1999.9-0',
          },
          checked: false,
          value: ' Acima de R$ 1.999,90',
        },
      ],
    },
    {
      title: 'Marca',
      active: true,
      data: filters.mark.map(item => ({ ...item })),
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
      data: filters.flavors.map(item => ({ ...item })),
    },
    {
      title: 'Cores',
      active: false,
      data: filters.colors.map(item => ({ ...item })),
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
      data: filters.ohm.map(item => ({ ...item })),
    },
    {
      title: 'Quantidade de nicotina',
      active: true,
      data: filters.nicotina.map(item => ({ ...item })),
    },
    {
      title: 'Quantidade em ml',
      active: false,
      data: filters.ml.map(item => ({ ...item })),
    },
    {
      title: 'Quantidade de itens no produto',
      active: false,
      data: filters.qtdItems.map(item => ({ ...item })),
    },
  ]);

  const [stateVapeData, setStateVapeData] = useState(vapeData);

  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState<OpenAlertType>({
    open: false,
    msg: '',
    severity: 'success',
  });
  let urlSearchQuery = useRef(new URL(vapeData.urlApi));
  const [defaultPage, setDefaultPage] = useState(1);

  const [filtersData, setFiltersData] = useState<FiltersType[]>(
    cloneDeep(filtersInitialState.current)
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
      // setIsLoading(true);
      nProgress.start();
      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
      });
      if (!res.ok) throw new Error('Error');
      const data = await res.json();
      setStateVapeData(data);
    } catch (err) {
      console.log(err);
      setOpenAlert({
        msg: 'Erro ao buscar filtros, tente novalmente',
        open: true,
        severity: 'error',
      });
    } finally {
      // setIsLoading(false);
      nProgress.done(true);
      document.documentElement.scrollTop = 0;
    }
  };

  const handleSearchQuery = async (data: FiltersDataType) => {
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
    handlePagination(1);
  };

  const handleSearchClassify = async (query: string) => {
    urlSearchQuery.current = new URL(urlSearchQuery.current);
    urlSearchQuery.current.searchParams.set('classify', query);
    handlePagination(1);
  };

  const handleResetFilters = async () => {
    urlSearchQuery.current = new URL(vapeData.urlApi);
    handlePagination(1);
    setFiltersData(filtersInitialState.current);
    setClassify(state => ({ ...state, activeValue: 'Relevância' }));
    document.documentElement.scrollTop = 0;
  };

  const handlePagination = (page: number) => {
    urlSearchQuery.current.searchParams.set('page', page.toString());
    setDefaultPage(page!);
    handleGetFilters(urlSearchQuery.current.href);
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
                let newArr = cloneDeep(filtersData);
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
                          let newArr = cloneDeep(filtersData);
                          newArr[i].data[_i].checked = !newArr[i].data[_i].checked; // eslint-disable-line
                          handleSearchQuery(newArr[i].data[_i]);
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
                    handleSearchClassify(val.query);
                  }}
                >
                  {val.title}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full">
          <ProductsGrid
            vapeData={stateVapeData.results}
            gridCols="grid-cols-3"
          />
          <PaginationComponent
            countPages={stateVapeData.totalPages}
            resultsLength={stateVapeData.results.length}
            handlePagination={handlePagination}
            defaultPage={defaultPage}
          />
        </div>
      </div>
    </>
  );
}
