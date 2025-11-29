import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard, Autoplay } from 'swiper/modules';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

export default function ProductCarousel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://ventas.vetmarket.pe/data/productos.php');
        setProducts(response.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setProducts([
          { id: 1, marca: "ROYAL CANIN", descrip: "Royal Canin BHN Bulldog ADULT CD x 3 kg", precio: "160.00", imagen: "views/php/images/productos/004187-.jpg" },
          { id: 2, marca: "BIOFRESH", descrip: "BIOFRESH GATO Adulto Salmon bolsa x 1.5 kg", precio: "70.00", imagen: "views/php/images/productos/004332-.jpg" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-[1610px] mx-auto py-10 px-4 md:px-12">
        <h1 className="text-center text-2xl font-bold mb-8 text-black">Productos recientes</h1>
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

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
          delay: 3000, 
          disableOnInteraction: false, 
          pauseOnMouseEnter: true, 
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
              <div 
                className="w-full h-40 mb-4 flex items-center justify-center cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img 
                  src={`https://ventas.vetmarket.pe/${product.imagen || product.image}`}
                  alt={product.descrip || product.name} 
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => { e.target.src = '/images/slide-1.svg'; }}
                />
              </div>
              <div 
                className="flex flex-col flex-grow cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <span className="text-xs text-gray-500 uppercase font-medium mb-1">
                  {product.marca || 'Sin marca'}
                </span>
                <h3 className="text-sm font-bold text-gray-800 leading-tight mb-3 line-clamp-2 min-h-[2.5rem] hover:text-teal-600 transition-colors">
                  {product.descrip || product.name || 'Producto sin nombre'}
                </h3>
                <div className="text-lg font-extrabold text-green-600 mb-4">
                  S/ {product.precio || '0.00'}
                </div>
              </div>
              <button 
                  onClick={() => {
                      addToCart({
                          id: product.id,
                          name: product.descrip || 'Producto sin nombre',
                          price: `S/ ${product.precio || '0.00'}`,
                          brand: product.marca || 'Sin marca',
                          image: `https://ventas.vetmarket.pe/${product.imagen}`,
                          seller: 'VetMarket',
                          maxQuantity: 10
                      });
                  }}
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
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