import Link from 'next/link';

import CustomSeparator from '@/components/breadcrumb';
import Container90 from '@/components/container90';
import Main from '@/components/main';
import Filters from '@/components/filters';
import UnavailablePage from '@/components/unavailablePage';
import { FiltersDbType } from '../api/filters/route';

export default async function Page() {
  let filters: FiltersDbType;

  try {
    const res1 = fetch(`${process.env.NEXT_PUBLIC_API_URL}/filters`, {
      method: 'GET',
      cache: 'no-cache',
    });
    const allRes = await Promise.all([res1]);
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
      <Container90 className="gap-5">
        <CustomSeparator>
          <Link href="/" className="text-ccba00 text-sm font-normal">
            Home
          </Link>
          <span className="text-555555 text-sm font-normal">
            Pod descartável
          </span>
        </CustomSeparator>
        <div className="w-full flex items-start gap-4">
          <Filters filters={filters}>
            <h1 className="text-4xl text-secudary font-semibold">
              Pod descartável
            </h1>
          </Filters>
        </div>
      </Container90>
    </Main>
  );
}
