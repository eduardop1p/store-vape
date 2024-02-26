'use client';

import { useState } from 'react';
import { IoSearch } from 'react-icons/io5';

export default function Search() {
  const [inputFocus, setInputFocus] = useState(false);

  return (
    <div
      className={`w-full flex items-center ${inputFocus ? 'bg-primary' : 'bg-2f2e2e'} rounded-3xl px-4 h-[50px] gap-2 overflow-hidden`} // eslint-diable-line
    >
      <input
        className="w-full h-full text-sm font-normal text-secudary bg-inherit"
        type="text"
        id="search"
        name="search"
        placeholder="Buscar"
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
      />
      <IoSearch
        fill={inputFocus ? '#000' : '#fff'}
        size={18}
        className="flex-none"
      />
    </div>
  );
}
