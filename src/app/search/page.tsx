import Link from 'next/link';

import Container90 from '@/components/container90';
import Main from '@/components/main';
import CustomSeparator from '@/components/breadcrumb';
import Classify from '@/components/classify';

interface Props {
  searchParams: { query: string };
}

export default async function Page({ searchParams }: Props) {
  const { query } = searchParams;

  return (
    <Main>
      <Container90 className="gap-8">
        <CustomSeparator>
          <Link href="/" className="text-ccba00 text-sm font-normal">
            Home
          </Link>
          <span className="text-555555 text-sm font-normal">Pesquisar</span>
        </CustomSeparator>
        <div className="w-full justify-between gap-4">
          <Classify />
        </div>
      </Container90>
    </Main>
  );
}
