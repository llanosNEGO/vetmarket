import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard, Autoplay } from 'swiper/modules';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      nombre: product.descrip || product.name || 'Producto sin nombre',
      precio: parseFloat(product.precio || 0),
      marca: product.marca || product.brand || 'Sin marca',
      imagen: product.imagen 
        ? `https://ventas.vetmarket.pe/${product.imagen}`
        : '/placeholder-product.png'
    });

    toast.success(
      (t) => (
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Producto agregado</p>
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
              {product.descrip || product.name}
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-4 flex-shrink-0"
          >
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ),
      {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#f0fdf4',
          border: '1px solid #86efac',
          padding: '16px',
          maxWidth: '400px',
        },
      }
    );
  };

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
    <>
      <Toaster />

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
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 25 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
            1280: { slidesPerView: 5, spaceBetween: 30 },
          }}
          speed={800}
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
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors group"
                >
                  <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                  <span>Agregar al carrito</span>
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
    </>
  );
}