import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';

export default function CarouselBar() {
  return (
    <div className="w-full max-w-[1400px] mx-auto py-6 px-4"> 
      <Swiper
        loop={true}
        navigation={true}
        pagination={{ clickable: true }}
        keyboard={true}
        modules={[Navigation, Pagination, Keyboard]}
        className="
          mySwiper 
          w-full
          h-[220px] md:h-[400px]
          rounded-[2.5rem]
          [&_.swiper-pagination-bullet]:opacity-100
          [&_.swiper-pagination-bullet-active]:bg-green-600
        "
      >
        <SwiperSlide>
          <img src="/images/slide-1.webp" alt="Slide 1" className="w-full h-full object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/slide-2.webp" alt="Slide 2" className="w-full h-full object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/slide-3.webp" alt="Slide 3" className="w-full h-full object-cover" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}