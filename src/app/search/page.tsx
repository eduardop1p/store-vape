import Link from 'next/link';

import Container90 from '@/components/container90';
import Main from '@/components/main';
import CustomSeparator from '@/components/breadcrumb';
import Filters from '@/components/filters';
import UnavailablePage from '@/components/unavailablePage';
import { FiltersDbType } from '../api/filters/route';
import { VapeType } from '../api/models/vape';

interface Props {
  searchParams: { query: string };
}

export default async function Page({ searchParams }: Props) {
  const { query } = searchParams;
  let filters: FiltersDbType;
  let dataSearch: VapeType[] = [];

  try {
    const res1 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/filters`, {
      method: 'GET',
      cache: 'no-cache',
    });
    const res2 = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/selected-filters?name=${query}`,
      {
        method: 'GET',
        cache: 'no-cache',
      }
    );
    const allRes = await Promise.all([res1, res2]);
    for (let res of allRes) {
      if (!res.ok) throw new Error('error');
    }
    const dataRes1 = await allRes[0].json();
    filters = dataRes1.data;
    const dataRes2 = await allRes[1].json();
    dataSearch = dataRes2.data;
  } catch (err) {
    console.log(err);
    return <UnavailablePage />;
  }

  return (
    <Main>
      <Container90 className="gap-8">
        <CustomSeparator>
          <Link href="/" className="text-ccba00 text-sm font-normal">
            Home
          </Link>
          <span className="text-555555 text-sm font-normal">Pesquisar</span>
        </CustomSeparator>
        <div className="w-full flex items-start gap-4">
          <Filters filters={filters} />
        </div>
      </Container90>
    </Main>
  );
}
