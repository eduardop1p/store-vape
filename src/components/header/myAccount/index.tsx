'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaUser } from 'react-icons/fa6';

export default function MyAccount() {
  const [showMyAccount, setShowMyAccount] = useState(false);

  return (
    <div
      className={`bg-primary duration-200 transition-colors rounded-3xl h-[50px] px-6 flex items-center gap-2 cursor-pointer relative justify-center`} // eslint-disable-line
      onClick={() => setShowMyAccount(!showMyAccount)}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setShowMyAccount(false);
      }}
      tabIndex={0}
    >
      <FaUser fill="#3d3d3d" size={13} className="flex-none" />
      <span className="text-base font-medium text-3d3d3d whitespace-nowrap">
        Minha conta
      </span>

      <div
        className={`rounded-2xl absolute bg-primary top-16 w-[300px] cursor-default z-[2] transition-all duration-200 ${showMyAccount ? 'translate-y-0 opacity-100 visible' : 'translate-y-14 opacity-0 invisible'}`} // eslint-disable-line
        onClick={event => event.stopPropagation()}
      >
        <div
          className="absolute bg-primary w-3 h-3 top-2 left-1/2 z-[-2]"
          style={{
            transform: 'scaleY(2) rotate(45deg) translateX(-50%)',
          }}
        ></div>

        <div className="flex flex-col items-center pt-4 gap-1 bg-inherit rounded-2xl overflow-hidden">
          <h2 className="text-base font-normal text-secudary">
            Seja bem-vindo!
          </h2>
          <span className="text-[13px] font-normal text-3d3d3d">
            Faça Login ou Cadastre-se
          </span>
          <div className="bg-0000001F w-full py-4 px-5 flex justify-center gap-3 mt-2">
            <Link
              href="/create-account"
              className="h-[50px] px-4 bg-primary text-3d3d3d rounded-3xl flex items-center justify-center font-medium text-sm hover:scale-105 transition-transform duration-200"
            >
              Cadastre-se
            </Link>
            <Link
              href="/login"
              className="h-[50px] px-4 bg-yellow-400 text-3d3d3d rounded-3xl flex items-center justify-center font-medium text-sm hover:scale-105 transition-transform duration-200"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
