import Link from 'next/link';

import CustomSeparator from '@/components/breadcrumb';
import Container90 from '@/components/container90';
import Main from '@/components/main';
import Filters from '@/components/filters';
import UnavailablePage from '@/components/unavailablePage';
import { FiltersDbType } from '@/app/api/filters/route';
import { VapeDataAndPaginationType } from '@/components/menu/category';

interface Props {
  categoryLink: {
    url: string;
    title: string;
  };
  subCategory2Title: string;
}

export default async function SubCategory2({
  categoryLink,
  subCategory2Title,
}: Props) {
  let filters: FiltersDbType;
  let vapeData: VapeDataAndPaginationType;

  const urlApi = `${process.env.NEXT_PUBLIC_API_URL}/selected-filters?classify=relevance&subcategory2=${subCategory2Title}&page=1`;

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
    filters.subcategory2 = filters.subcategory2.map(val => {
      if (val.value == subCategory2Title) {
        val.checked = true;
        val.default = true;
      }
      return val;
    });

    const data2 = await allRes[1].json();
    vapeData = data2;
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
          <Link
            href={categoryLink.url}
            className="text-ccba00 text-sm font-normal"
          >
            {categoryLink.title}
          </Link>
          <span className="text-555555 text-sm font-normal">
            {subCategory2Title}
          </span>
        </CustomSeparator>
        <div className="w-full flex items-start gap-4">
          <Filters
            filters={filters}
            title={subCategory2Title}
            vapeData={{ ...vapeData, urlApi }}
          />
        </div>
      </Container90>
    </Main>
  );
}
