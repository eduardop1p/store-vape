'use client';

import { useState } from 'react';

import FormPf from './pf';
import FormPj from './pj';

export default function FormCreateAcount() {
  const [toggle, setToggle] = useState({
    activePf: true,
    activePj: false,
  });

  return (
    <>
      <div className="flex gap-6 items-center">
        <button
          className={`px-4 text-sm font-medium  h-[50px] rounded-3xl transition-all duration-200 ${toggle.activePf ? 'bg-ccba00 text-primary scale-105' : 'bg-gray-200 text-secudary scale-100'}`}
          type="button"
          onClick={() =>
            setToggle({
              activePf: true,
              activePj: false,
            })
          }
        >
          Pessoa física
        </button>
        <button
          className={`px-4 text-sm font-medium h-[50px] rounded-3xl transition-all duration-200 ${toggle.activePj ? 'bg-ccba00 text-primary scale-105' : 'bg-gray-200 text-secudary scale-100'}`}
          type="button"
          onClick={() =>
            setToggle({
              activePf: false,
              activePj: true,
            })
          }
        >
          Pessoa jurídica
        </button>
      </div>
      <div className="mt-2">
        {toggle.activePf && <FormPf />}
        {toggle.activePj && <FormPj />}
      </div>
    </>
  );
}
