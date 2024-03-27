/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from 'next/link';

import Container90 from '@/components/container90';
import Main from '@/components/main';
import CustomSeparator from '@/components/breadcrumb';
import Filters from '@/components/filters';
import UnavailablePage from '@/components/unavailablePage';
import { FiltersDbType } from '../api/filters/route';
import { VapeDataAndPaginationType } from '@/components/menu/category';

interface Props {
  searchParams: { query: string };
}

export default async function Page({ searchParams }: Props) {
  const { query } = searchParams;
  let filters: FiltersDbType;
  let dataSearch: VapeDataAndPaginationType;

  const urlApi = `${process.env.NEXT_PUBLIC_API_URL}/selected-filters?classify=relevance&name=${query}&page=1`;

  try {
    const res1 = fetch(`${process.env.NEXT_PUBLIC_API_URL}/filters`, {
      method: 'GET',
      cache: 'no-cache',
    });
    const res2 = fetch(urlApi, {
      method: 'GET',
      cache: 'no-cache',
    });
    const allRes = await Promise.all([res1, res2]);
    for (let res of allRes) {
      if (!res.ok) throw new Error('error');
    }
    const data1 = await allRes[0].json();
    filters = data1.results;

    const data2 = await allRes[1].json();
    dataSearch = data2;
  } catch (err) {
    console.log(err);
    return <UnavailablePage />;
  }

  return (
    <Main>
      <Container90 className="gap-5">
        <CustomSeparator>
          <Link href="/" className="text-ccba00 text-sm font-normal">
            Home
          </Link>
          <span className="text-555555 text-sm font-normal">Pesquisa</span>
        </CustomSeparator>
        <div className="w-full flex items-start gap-4">
          <Filters
            filters={filters}
            title={`Buscando por: ${query}`}
            vapeData={{ ...dataSearch, urlApi }}
          />
        </div>
      </Container90>
    </Main>
  );
}
