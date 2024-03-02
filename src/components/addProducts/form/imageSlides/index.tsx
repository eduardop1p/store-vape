'use client';

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react';
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

export default function ImageSlides({
  imgs,
  setPreviewImages,
}: {
  imgs: ImagesTypes[];
  setPreviewImages: Dispatch<SetStateAction<ImagesTypes[]>>;
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const sliderRef = useRef<SwiperRef>(null);
  let index = useRef(0);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  const handleOrderImgs = (i: number) => {
    let newArr = [...imgs];
    newArr.splice(i, 1);
    let currentValue = imgs[i];
    newArr.splice(index.current, 0, currentValue);

    index.current++;
    setPreviewImages(newArr);
  };

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
        {imgs.map((val, i) => (
          <SwiperSlide
            key={val.url}
            style={{
              width: '90px',
              height: '90px',
            }}
            className="relative"
          >
            <div
              className="absolute z-[2] w-full h-full border-[3px] border-solid border-blue-400 flex items-center justify-center cursor-pointer"
              onClick={() => handleOrderImgs(i)}
            >
              <div className="bg-blue-400 text-primary font-medium text-sm w-8 h-8 rounded-full flex items-center justify-center">
                {i + 1}
              </div>
            </div>
            <Image
              src={val.url}
              fill
              sizes="100%"
              alt="preview"
              style={{
                objectFit: 'contain',
              }}
              className={`flex-none cursor-pointer`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
