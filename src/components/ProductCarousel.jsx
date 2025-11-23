import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard, Autoplay } from 'swiper/modules';
import { useState } from 'react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

export default function ProductCarousel() {
  const [products] = useState([
    { id: 1, brand: "ROYAL CANIN", name: "Royal Canin BHN Bulldog ADULT CD x 3 kg", price: "S/ 160.00", image: "/images/slide-1.svg" },
    { id: 2, brand: "ROYAL CANIN", name: "Royal Canin BHN FR Bulldog ADULT CD bolsa x 9kg", price: "S/ 0.00", image: "/images/slide-1.svg" },
    { id: 3, brand: "BIOFRESH", name: "BIOFRESH GATO Adulto Salmon bolsa x 1.5 kg", price: "S/ 70.00", image: "/images/slide-1.svg" },
    { id: 4, brand: "BIOFRESH", name: "BIOFRESH GATITO Pollo bolsa x 1.5 kg", price: "S/ 75.00", image: "/images/slide-1.svg" },
    { id: 5, brand: "ROYAL CANIN", name: "Royal Canin CCN MINI LIGHT WCARE Dog bolsa x 3kg", price: "S/ 175.00", image: "/images/slide-1.svg" },
    { id: 6, brand: "ROYAL CANIN", name: "Royal Canin Maxi Puppy x 15 kg", price: "S/ 320.00", image: "/images/slide-1.svg" },
    { id: 7, brand: "ROYAL CANIN", name: "Royal Canin BHN Bulldog ADULT CD x 3 kg", price: "S/ 160.00", image: "/images/slide-1.svg" },
    { id: 8, brand: "ROYAL CANIN", name: "Royal Canin BHN FR Bulldog ADULT CD bolsa x 9kg", price: "S/ 0.00", image: "/images/slide-1.svg" },
    { id: 9, brand: "BIOFRESH", name: "BIOFRESH GATO Adulto Salmon bolsa x 1.5 kg", price: "S/ 70.00", image: "/images/slide-1.svg" },
    { id: 10, brand: "BIOFRESH", name: "BIOFRESH GATITO Pollo bolsa x 1.5 kg", price: "S/ 75.00", image: "/images/slide-1.svg" },
  ]);

  return (
    <div className="w-full max-w-[1610px] mx-auto py-10 px-4 md:px-12 relative">
      <h1 className="text-center text-2xl font-bold mb-8 text-black">
        Productos recientes
      </h1>
      <Swiper
        loop={true}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}
        keyboard={true}
        autoplay={{
          delay: 3000, // 3 segundos entre cada slide
          disableOnInteraction: false, // Continúa después de la interacción del usuario
          pauseOnMouseEnter: true, // Pausa cuando el mouse está sobre el carousel
        }}
        modules={[Navigation, Keyboard, Autoplay]}
        // Breakpoints para responsividad
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 25 },
          1024: { slidesPerView: 4, spaceBetween: 30 },
          1280: { slidesPerView: 5, spaceBetween: 30 },
        }}
        speed={800} // Velocidad de transición
        className="mySwiper !pb-10"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="h-auto">
            <div className="border border-gray-200 rounded-2xl p-4 flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-300 bg-white">
              
              {/* Imagen */}
              <div className="w-full h-40 mb-4 flex items-center justify-center">
                <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain"/>
              </div>

              {/* Info */}
              <div className="flex flex-col flex-grow">
                <span className="text-xs text-gray-500 uppercase font-medium mb-1">{product.brand}</span>
                <h3 className="text-sm font-bold text-gray-800 leading-tight mb-3 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                <div className="text-lg font-extrabold text-green-600 mb-4">{product.price}</div>
              </div>

              {/* Botón */}
              <button className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Agregar
              </button>
            </div>
          </SwiperSlide>
        ))}
        
        <div className="custom-prev absolute text-white top-1/2 left-2 z-10 transform -translate-y-1/2 bg-gray-800/80 hover:bg-gray-800/100 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all text-xl font-bold shadow-lg">
          ‹
        </div>
        <div className="custom-next absolute text-white top-1/2 right-2 z-10 transform -translate-y-1/2 bg-gray-800/80 hover:bg-gray-800/100 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all text-xl font-bold shadow-lg">
          ›
        </div>
      </Swiper>
    </div>
  );
}