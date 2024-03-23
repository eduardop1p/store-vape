import Link from 'next/link';
import { notFound } from 'next/navigation';

import CustomSeparator from '@/components/breadcrumb';
import Container90 from '@/components/container90';
import Main from '@/components/main';
import Filters from '@/components/filters';
import UnavailablePage from '@/components/unavailablePage';
import { FiltersDbType } from '@/app/api/filters/route';
import { VapeType } from '@/app/api/models/vape';

export interface VapeDataAndPaginationType {
  results: VapeType[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
  urlApi: string;
}

interface Props {
  markLink: {
    url: string;
    title: string;
  };
  markTitle: string;
}

export default async function SubMark2({ markLink, markTitle }: Props) {
  let filters: FiltersDbType;
  let vapeData: VapeDataAndPaginationType;

  const urlApi = `${process.env.NEXT_PUBLIC_API_URL}/selected-filters?classify=relevance&mark=${markTitle}&page=1`;

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
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error, {
          cause: data.cause,
        });
      }
    }
    const data1 = await allRes[0].json();
    filters = data1.results;
    filters.mark = filters.mark.map(val => {
      if (val.value == markTitle) {
        val.checked = true;
        val.default = true;
      }
      return val;
    });

    const data2 = await allRes[1].json();
    vapeData = data2;
  } catch (err: any) {
    console.log(err);
    if (err.cause == 'mark not found') notFound();
    return <UnavailablePage />;
  }

  return (
    <Main>
      <Container90 className="gap-5">
        <CustomSeparator>
          <Link href="/" className="text-ccba00 text-sm font-normal">
            Home
          </Link>
          <Link href={markLink.url} className="text-ccba00 text-sm font-normal">
            {markLink.title}
          </Link>
          <span className="text-555555 text-sm font-normal">{markTitle}</span>
        </CustomSeparator>
        <div className="w-full flex items-start gap-4">
          <Filters
            filters={filters}
            title={markTitle}
            vapeData={{ ...vapeData, urlApi }}
          />
        </div>
      </Container90>
    </Main>
  );
}
