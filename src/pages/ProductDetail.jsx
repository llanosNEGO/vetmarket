import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { ShoppingCart, Check } from 'lucide-react';
import { CategoryBar } from '../components/Categorias/CategoryBar';
import { Header } from '../components/Principales/Header';
import { Footer } from '../components/Principales/footer';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get('https://ventas.vetmarket.pe/data/productos.php');
        const products = response.data.value || response.data;
        const foundProduct = products.find(p => p.id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
        }
      } catch (error) {
        console.error('Error al cargar producto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 20)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.descrip,
        price: parseFloat(product.precio),
        marca: product.marca || 'Sin marca',
        imagen: product.imagen 
          ? `https://ventas.vetmarket.pe/${product.imagen}`
          : '/placeholder-product.png',
        seller: 'VetMarket',
        maxQuantity: product.stock || 20
      });
    }
    
    toast.success(
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
            {product.descrip}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {quantity > 1 ? `${quantity} productos agregados` : 'Agregado al carrito'}
            </span>
            <span className="text-sm font-bold text-green-600 whitespace-nowrap">
              S/ {(parseFloat(product.precio) * quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>,
      {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          borderRadius: '12px',
          padding: '16px',
          maxWidth: '420px',
          minWidth: '320px',
          borderLeft: '4px solid #10b981',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        },
        bodyClassName: "p-0",
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CategoryBar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CategoryBar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h2>
          <Link to="/" className="text-teal-600 hover:text-teal-700 font-medium">
            Volver al inicio
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CategoryBar />

      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
        style={{
          zIndex: 9999,
          bottom: '20px',
          right: '20px',
        }}
        toastStyle={{
          borderRadius: '12px',
          marginBottom: '12px',
          padding: '0',
          maxWidth: '420px',
          minWidth: '320px',
          overflow: 'hidden',
        }}
        bodyClassName="p-0"
        progressStyle={{
          background: 'linear-gradient(to right, #10b981, #34d399)',
          height: '3px',
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-teal-600">Inicio</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-500">{product.cat || 'Suplementos'}</span>
          <span className="mx-2">›</span>
          <span className="font-semibold text-gray-900">{product.descrip}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-lg shadow-sm p-8">

          <div className="flex items-start justify-center">
            <img
              src={`https://ventas.vetmarket.pe/${product.imagen}`}
              alt={product.descrip}
              className="w-full max-w-md object-contain rounded-lg"
              onError={(e) => { e.target.src = '/images/slide-1.svg'; }}
            />
          </div>

          <div className="flex flex-col">

            <p className="text-sm font-semibold text-teal-600 uppercase tracking-wide mb-2">
              {product.marca || 'SIN MARCA'}
            </p>

            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {product.descrip}
            </h1>

            <p className="text-gray-600 mb-6">
              {product.descrip_corta || 'Descripción no disponible.'}
            </p>

            <div className="mb-8">
              <p className="text-4xl font-bold text-green-600">
                S/ {product.precio}
              </p>
              {quantity > 1 && (
                <p className="text-lg text-gray-600 mt-2">
                  Total: S/ {(parseFloat(product.precio) * quantity).toFixed(2)}
                </p>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-3">
                Cantidad
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 font-bold text-xl"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 text-center bg-[var(--bg-cajas)] border-x-2 border-gray-300 py-2 font-semibold"
                    min="1"
                    max={product.stock || 20}
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 font-bold text-xl"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Máximo {product.stock || 20} unidades
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors text-lg group"
            >
              <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
              Agregar {quantity > 1 && `(${quantity})`}
            </button>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoría:</span>
                  <span className="font-medium text-gray-900">{product.cat || 'General'}</span>
                </div>                
                <div className="flex justify-between">
                  <span className="text-gray-600">Disponibilidad:</span>
                  <span className="font-medium text-green-600">En stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};