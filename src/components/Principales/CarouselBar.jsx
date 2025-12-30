import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Navigation, Pagination, Keyboard, Autoplay } from 'swiper/modules';

export default function CarouselBar() {
  return (
    <div className="w-full max-w-[1400px] mx-auto py-6 px-4"> 
      <Swiper
        loop={true}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}
        pagination={{ clickable: true }}
        keyboard={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Navigation, Pagination, Keyboard, Autoplay]}
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
        
        <div
          className="custom-prev absolute text-white top-1/2 left-6 z-10 transform -translate-y-1/2 bg-gray-800/80 hover:bg-gray-800/100 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all"
          role="button"
          aria-label="Anterior"
          tabIndex={0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <div
          className="custom-next absolute text-white top-1/2 right-6 z-10 transform -translate-y-1/2 bg-gray-800/80 hover:bg-gray-800/100 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all"
          role="button"
          aria-label="Siguiente"
          tabIndex={0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Swiper>
    </div>
  );
}