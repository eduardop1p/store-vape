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

export interface ImagesTypes {
  blob: Blob;
  url: string;
}

export default function ImageSlides({ imgs }: { imgs: ImagesTypes[] }) {
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
    <>
      {imgs.length > 1 && (
        <>
          <GrPrevious
            size={35}
            className="absolute top-1/2 -translate-y-1/2 left-0 cursor-pointer z-[5]"
            onClick={handlePrev}
          />
          <GrNext
            size={35}
            className="absolute top-1/2 -translate-y-1/2 right-0 cursor-pointer z-[5]"
            onClick={handleNext}
          />
        </>
      )}
      <Swiper
        ref={sliderRef}
        spaceBetween={10}
        slidesPerView={1}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Thumbs]}
        style={{
          height: 'calc(100% - 110px)',
        }}
      >
        {imgs.map(val => (
          <SwiperSlide
            key={val.url}
            className="relative"
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <Image
              src={val.url}
              alt="Picture of the author"
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
        {imgs.map(val => (
          <SwiperSlide
            key={val.url}
            style={{
              width: '90px',
              height: '90px',
            }}
            className="relative"
          >
            <Image
              src={val.url}
              fill
              sizes="100%"
              alt="preview"
              style={{
                objectFit: 'contain',
              }}
              className="flex-none cursor-pointer"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
