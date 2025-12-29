import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
import { CategoryBar } from '../components/Categorias/CategoryBar';
import { Header } from '../components/Principales/Header';
import { Footer } from '../components/Principales/footer';
import toast, { Toaster } from 'react-hot-toast';

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
      (t) => (
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {quantity > 1 
                ? `${quantity} productos agregados` 
                : 'Producto agregado'
              }
            </p>
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
              {product.descrip}
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

      <Toaster />
      
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
              <p className="text-4xl font-bold text-gray-900">
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
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
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
              Agregar al carrito {quantity > 1 && `(${quantity})`}
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