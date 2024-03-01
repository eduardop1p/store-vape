import Link from 'next/link';

import Container90 from '@/components/container90';
import Main from '@/components/main';
import CustomSeparator from '@/components/breadcrumb';
import Filters from '@/components/filters';
import UnavailablePage from '@/components/unavailablePage';
import { FiltersDbType } from '../api/filters/route';

interface Props {
  searchParams: { query: string };
}

export default async function Page({ searchParams }: Props) {
  const { query } = searchParams;
  let filters: FiltersDbType;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/filters`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('error');
    const { data } = await res.json();
    filters = data;
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
