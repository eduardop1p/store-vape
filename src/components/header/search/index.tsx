'use client';

import { useState, type FormEvent, useEffect, ChangeEvent } from 'react';
import { IoSearch } from 'react-icons/io5';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import nProgress from 'nprogress';
import Image from 'next/image';
import Link from 'next/link';

import { VapeType } from '@/app/api/models/vape';
import replaceStringToLink from '@/services/replaceStringToLink';

interface SearchDataType {
  name: string;
  fileName: string;
  category: string;
  subcategory2?: string;
  subcategory3?: string;
  mark: string;
  _id: string;
}

export default function Search() {
  const router = useRouter();
  const pathName = usePathname();
  const query = useSearchParams().get('query');

  const [inputFocus, setInputFocus] = useState(query ? true : false);
  const [searchValue, setSearchValue] = useState(query ? query : '');
  const [searchData, setSearchData] = useState<SearchDataType[]>([]); // eslint-disable-line

  useEffect(() => {
    if (pathName !== '/search') {
      setSearchValue('');
    }
  }, [pathName]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchValue) return;
    nProgress.start();

    router.push(`/search?query=${searchValue.trim()}`);
  };

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearchValue(value);
    handleGetSearchData(value);
  };

  const handleGetSearchData = async (value: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/selected-filters?classify=relevance&name=${value}&page=1`,
        {
          method: 'GET',
          cache: 'no-cache',
        }
      );
      if (!res.ok) throw new Error('Erro desconhecido');
      let data = await res.json();
      data = data.results.map((val: VapeType & { _id: string }) => ({
        name: val.name,
        fileName: val.fileNames[0],
        category: val.category,
        subcategory2: val.subcategory2,
        subcategory3: val.subcategory3,
        mark: val.mark,
        _id: val._id,
      }));
      setSearchData(data);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleHrefLink = (value: SearchDataType) => {
    return `/${replaceStringToLink(value.category)}${value.subcategory2 ? `/${replaceStringToLink(value.subcategory2)}` : ''}${value.subcategory3 ? `/${replaceStringToLink(value.subcategory3)}` : ''}/${value._id}`;
  };

  return (
    <>
      <form
        className={`relative w-full flex items-center ${inputFocus || searchValue ? 'bg-primary' : 'bg-2f2e2e'} rounded-3xl px-4 h-[50px] gap-2`} // eslint-diable-line
        onSubmit={handleSubmit}
      >
        <input
          className="w-full h-full text-sm font-normal text-secudary bg-transparent"
          type="text"
          id="search"
          name="search"
          placeholder="Buscar"
          value={searchValue}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          onChange={handleChangeSearch}
        />
        <button type="submit" className="bg-transparent">
          <IoSearch
            fill={inputFocus || searchValue ? '#000' : '#fff'}
            size={18}
            className="flex-none"
          />
        </button>
        <div
          className={`${searchValue && searchData.length && inputFocus ? 'block' : 'hidden'} absolute z-[2] top-16 rounded-xl bg-primary shadow-md w-full left-0 overflow-hidden`}
        >
          <h2 className="text-primary text-lg font-medium p-4 bg-555555 w-full">
            Produtos
          </h2>
          <div className=" max-h-[350px] bg-inherit w-full overflow-x-hidden overflow-y-auto flex flex-col">
            {searchData.map(val => (
              <Link
                key={val.fileName}
                href={handleHrefLink(val)}
                className="flex w-full items-center p-4 gap-10 group cursor-pointer hover:bg-gray-200 transition-colors duration-150"
              >
                <div className="rounded-2xl bg-primary p-2">
                  <Image
                    src={`/uploads/imgs/${val.fileName}`}
                    alt={val.name}
                    width={80}
                    height={80}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-secudary font-medium text-sm group-hover:underline group-hover:text-blue-500">
                    {val.name}
                  </p>
                  <div className="flex items-center">
                    <span className="text-secudary text-[13px] font-normal">
                      {val.category || val.subcategory2 || val.subcategory3}
                    </span>
                    &nbsp;•&nbsp;
                    <span className="text-secudary text-[13px] font-normal">
                      {val.mark}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </form>
    </>
  );
}
