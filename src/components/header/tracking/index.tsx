'use client';

import { useState } from 'react';
import { FaTruck } from 'react-icons/fa6';
import Link from 'next/link';

export default function Tracking() {
  const [showTracking, setShowTracking] = useState(false);

  return (
    <div
      className={`${showTracking ? 'bg-ffffff1F' : 'hover:bg-ffffff1F '} duration-200 transition-colors rounded-3xl h-[50px] px-6 flex items-center gap-2 cursor-pointer relative justify-center`} // eslint-disable-line
      onClick={() => setShowTracking(!showTracking)}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setShowTracking(false);
      }}
      tabIndex={0}
    >
      <FaTruck fill="#fff" size={18} />
      <span className="text-base font-medium text-primary">Rastrio</span>

      <div
        className={`rounded-2xl absolute bg-primary top-16 w-[300px] cursor-default z-[2] transition-all duration-200 ${showTracking ? 'translate-y-0 opacity-100 visible' : 'translate-y-14 opacity-0 invisible'}`} // eslint-disable-line
        onClick={event => event.stopPropagation()}
      >
        <div
          className="absolute bg-primary w-3 h-3 top-2 left-1/2 z-[-2]"
          style={{
            transform: 'scaleY(2) rotate(45deg) translateX(-50%)',
          }}
        ></div>

        <div className="flex flex-col items-center gap-1 bg-inherit rounded-2xl overflow-hidden">
          <span className="text-secudary font-normal text-balance text-center pt-4">
            Rastreie seu perdido
          </span>
          <div className="bg-0000001F w-full py-4 px-8 flex justify-center gap-3 mt-2">
            <Link
              href="https://rastreamento.correios.com.br/app/index.php"
              target="_blank"
              className="flex justify-center items-center h-[50px] px-4 rounded-3xl transition-transform duration-200 hover:scale-105 text-primary font-normal text-sm w-full bg-ccba00 "
            >
              Ir pra rastreio
            </Link>

            {/* <input
              type="text"
              name="tracking"
              id="tracking"
              className="h-[50px] px-4 rounded-3xl focus:bg-primary focus:shadow-sm transition-all duration-150 text-secudary font-normal text-sm w-full bg-0000001F placeholder:text-gray-600"
              placeholder="Código de rastreio"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
