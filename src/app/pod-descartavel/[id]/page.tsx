import Container90 from '@/components/container90';
import Main from '@/components/main';
import CustomSeparator from '@/components/breadcrumb';
import Filters from '@/components/filters';
import UnavailablePage from '@/components/unavailablePage';
import Link from 'next/link';
import { FiltersDbType } from '@/app/api/filters/route';

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const { id } = params;

  let filters: FiltersDbType;

  try {
    const res1 = fetch(`${process.env.NEXT_PUBLIC_API_URL}/filters`, {
      method: 'GET',
      cache: 'no-cache',
    });
    const res2 = fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/add-relevance-item/${id}`,
      {
        method: 'GET',
        cache: 'no-cache',
      }
    );
    const allRes = await Promise.all([res1, res2]);
    for (let res of allRes) {
      if (!res.ok) throw new Error('error');
    }
    const data1 = await allRes[0].json();
    filters = data1.data;
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
          <Link
            href="/pod-descartavel"
            className="text-ccba00 text-sm font-normal"
          >
            Pod Descartável
          </Link>
          <span className="text-555555 text-sm font-normal">Pesquisar</span>
        </CustomSeparator>
        <div className="w-full flex items-start gap-4">
          <Filters filters={filters} />
          <h1>Product {id}</h1>
        </div>
      </Container90>
    </Main>
  );
}
