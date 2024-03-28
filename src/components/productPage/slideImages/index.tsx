'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { GrNext, GrPrevious } from 'react-icons/gr';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

export default function SlideImages({
  alt,
  fileNames,
}: {
  alt: string;
  fileNames: string[];
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const sliderRef = useRef<SwiperRef>(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <div className="w-[40%] relative">
      <Swiper
        ref={sliderRef}
        spaceBetween={10}
        slidesPerView={1}
        loop={fileNames.length > 1 ? true : false}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Thumbs]}
        style={{
          height: '390px',
          width: '100%',
          position: 'relative',
        }}
      >
        {fileNames.length > 1 && (
          <>
            <div
              className="active:scale-105 transition-all duration-200 hover:bg-gray-300 flex justify-center items-center w-[35px] h-[35px] rounded-full bg-gray-200 absolute top-1/2 -translate-y-1/2 left-0 cursor-pointer z-[5]"
              onClick={handlePrev}
            >
              <GrPrevious size={15} fill="#000" />
            </div>
            <div
              className="active:scale-105 transition-all duration-200 hover:bg-gray-300 flex justify-center items-center w-[35px] h-[35px] rounded-full bg-gray-200 absolute top-1/2 -translate-y-1/2 right-0 cursor-pointer z-[5]"
              onClick={handleNext}
            >
              <GrNext size={15} fill="#000" />
            </div>
          </>
        )}
        {fileNames.map(val => (
          <SwiperSlide
            key={val}
            className="relative"
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <Image
              src={`/uploads/imgs/${val}`}
              alt={alt}
              sizes="100%"
              fill
              style={{
                objectFit: 'contain',
              }}
              className="flex-none"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView="auto"
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mt-4"
      >
        {fileNames.map(val => (
          <SwiperSlide
            key={val}
            style={{
              width: '90px',
              height: '90px',
            }}
            className="relative"
          >
            <Image
              src={`/uploads/imgs/${val}`}
              fill
              sizes="100%"
              alt={alt}
              style={{
                objectFit: 'contain',
              }}
              className={`flex-none cursor-pointer p-2 border rounded-xl border-transparent hover:border-gray-200`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
