'use client';

import { Pagination, PaginationItem } from '@mui/material';
import { usePathname } from 'next/navigation';
import { MouseEvent } from 'react';

export default function PaginationComponent({
  countPages,
  resultsLength,
  handlePagination,
  defaultPage,
}: {
  countPages: number;
  resultsLength: number;
  handlePagination(page: number): void;
  defaultPage: number;
}) {
  const pathName = usePathname();

  const handleMouse = (
    event: MouseEvent<HTMLDivElement>,
    { selected, bg, color }: { selected: boolean; bg: string; color: string }
  ) => {
    if (!selected)
      event.currentTarget.style.cssText = `background-color: ${bg}; color: ${color};`;
  };

  return (
    <div className="mt-20">
      {countPages > 1 && resultsLength ? (
        <Pagination
          count={countPages}
          defaultPage={defaultPage}
          page={defaultPage}
          renderItem={item => {
            const page = item.page;
            if (!page) return;
            const url = new URL(`${window.origin}${pathName}`);
            url.searchParams.set('page', page.toString());

            return (
              <button type="button">
                <PaginationItem
                  {...item}
                  size="large"
                  className="!mx-[5px]"
                  onClick={() => handlePagination(item.page!)}
                  onMouseEnter={event =>
                    handleMouse(event, {
                      selected: item.selected,
                      bg: '#ccba00',
                      color: '#fff',
                    })
                  }
                  onMouseLeave={event =>
                    handleMouse(event, {
                      selected: item.selected,
                      bg: '#eee',
                      color: '#666',
                    })
                  }
                  style={{
                    color: item.selected ? '#fff' : '#666',
                    backgroundColor: item.selected ? '#ccba00' : '#eee',
                  }}
                />
              </button>
            );
          }}
        />
      ) : resultsLength ? (
        <p className="text-red-600 text-base font-normal -mt-10">
          Isso é tudo por aqui
        </p>
      ) : null}
    </div>
  );
}
