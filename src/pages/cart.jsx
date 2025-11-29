import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/footer';
import { CartItem } from '../components/CartItem';
import { CartSummary } from '../components/CartSummary';
import { CartSidebar } from '../components/CartSidebar';
import { useCart } from '../context/CartContext';

export const Cart = () => {
  const { cartItems } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-teal-600">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-900">Carrito de compras</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de compras</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 mx-auto text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-6">Agrega productos para comenzar tu compra</p>
            <Link
              to="/"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Ir a comprar
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna izquierda - Lista de productos */}
            <div className="lg:col-span-2">
              <CartSidebar />
              <div className="bg-white rounded-lg shadow-sm">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Columna derecha - Resumen */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};