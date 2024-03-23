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
  subCategory2Link: {
    url: string;
    title: string;
  };
  subCategory3Title: string;
}

export default async function SubCategory3({
  categoryLink,
  subCategory2Link,
  subCategory3Title,
}: Props) {
  let filters: FiltersDbType;
  let vapeData: VapeDataAndPaginationType;

  const urlApi = `${process.env.NEXT_PUBLIC_API_URL}/selected-filters?classify=relevance&subcategory3=${subCategory3Title}&page=1`;

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
    filters.subcategory3 = filters.subcategory3.map(val => {
      if (val.value == subCategory3Title) {
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
          <Link
            href={subCategory2Link.url}
            className="text-ccba00 text-sm font-normal"
          >
            {subCategory2Link.title}
          </Link>
          <span className="text-555555 text-sm font-normal">
            {subCategory3Title}
          </span>
        </CustomSeparator>
        <div className="w-full flex items-start gap-4">
          <Filters
            filters={filters}
            title={subCategory3Title}
            vapeData={{ ...vapeData, urlApi }}
          />
        </div>
      </Container90>
    </Main>
  );
}
