'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { IoSearch } from 'react-icons/io5';
import { useRouter, usePathname } from 'next/navigation';
import nProgress from 'nprogress';

export default function Search() {
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (pathName !== '/search') {
      setSearchValue('');
      nProgress.done();
    }
  }, [pathName]);

  const [inputFocus, setInputFocus] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchValue) return;
    nProgress.start();

    router.push(`/search?query=${searchValue}`);
  };

  return (
    <>
      <form
        className={`w-full flex items-center ${inputFocus ? 'bg-primary' : 'bg-2f2e2e'} rounded-3xl px-4 h-[50px] gap-2 overflow-hidden`} // eslint-diable-line
        onSubmit={handleSubmit}
      >
        <input
          className="w-full h-full text-sm font-normal text-secudary bg-inherit"
          type="text"
          id="search"
          name="search"
          placeholder="Buscar"
          value={searchValue}
          onFocus={() => setInputFocus(true)}
          onBlur={event => !event.currentTarget.value && setInputFocus(false)}
          onChange={event => setSearchValue(event.currentTarget.value)}
        />
        <button type="submit" className="bg-transparent">
          <IoSearch
            fill={inputFocus ? '#000' : '#fff'}
            size={18}
            className="flex-none"
          />
        </button>
      </form>
    </>
  );
}
