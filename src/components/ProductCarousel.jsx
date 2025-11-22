import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard } from 'swiper/modules'; // Quitamos Pagination si no se usa puntos abajo
import { useState } from 'react';

import 'swiper/css';
import 'swiper/css/navigation';

export default function ProductCarousel() {
  // He añadido más productos (duplicados) para que el loop infinito funcione suavemente
  const [products] = useState([
    { id: 1, brand: "ROYAL CANIN", name: "Royal Canin BHN Bulldog ADULT CD x 3 kg", price: "S/ 160.00", image: "/images/slide-1.svg" },
    { id: 2, brand: "ROYAL CANIN", name: "Royal Canin BHN FR Bulldog ADULT CD bolsa x 9kg", price: "S/ 0.00", image: "/images/slide-1.svg" },
    { id: 3, brand: "BIOFRESH", name: "BIOFRESH GATO Adulto Salmon bolsa x 1.5 kg", price: "S/ 70.00", image: "/images/slide-1.svg" },
    { id: 4, brand: "BIOFRESH", name: "BIOFRESH GATITO Pollo bolsa x 1.5 kg", price: "S/ 75.00", image: "/images/slide-1.svg" },
    { id: 5, brand: "ROYAL CANIN", name: "Royal Canin CCN MINI LIGHT WCARE Dog bolsa x 3kg", price: "S/ 175.00", image: "/images/slide-1.svg" },
    { id: 6, brand: "ROYAL CANIN", name: "Royal Canin Maxi Puppy x 15 kg", price: "S/ 320.00", image: "/images/slide-1.svg" },-
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
        navigation={true}
        keyboard={true}
        modules={[Navigation, Keyboard]}
        // Breakpoints para responsividad
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 25 },
          1024: { slidesPerView: 4, spaceBetween: 30 },
          1280: { slidesPerView: 5, spaceBetween: 30 },
        }}
        className="
          mySwiper !pb-10
          
          /* === Estilos de Flechas === */
          [&_.swiper-button-next]:bg-white
          [&_.swiper-button-prev]:bg-white
          [&_.swiper-button-next]:text-gray-800
          [&_.swiper-button-prev]:text-gray-800
          [&_.swiper-button-next]:w-10
          [&_.swiper-button-prev]:w-10
          [&_.swiper-button-next]:h-10
          [&_.swiper-button-prev]:h-10
          [&_.swiper-button-next]:rounded-full
          [&_.swiper-button-prev]:rounded-full
          [&_.swiper-button-next]:shadow-md
          [&_.swiper-button-prev]:shadow-md
          [&_.swiper-button-next]:border
          [&_.swiper-button-prev]:border
          [&_.swiper-button-next]:border-gray-200
          [&_.swiper-button-prev]:border-gray-200
          [&_.swiper-button-next]:after:text-[0.5rem]
          [&_.swiper-button-prev]:after:text-[0.5rem]
          [&_.swiper-button-next:hover]:bg-gray-50
          [&_.swiper-button-prev:hover]:bg-gray-50
          
          /* Posición Flechas */
          [&_.swiper-button-next]:-right-2
          [&_.swiper-button-prev]:-left-2
        "
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
      </Swiper>
    </div>
  );
}