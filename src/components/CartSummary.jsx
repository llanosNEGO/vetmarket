import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export const CartSummary = () => {
  const { getCartTotal, getDiscount, cartItems } = useCart();
  const [showDiscount, setShowDiscount] = useState(false);
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const discount = getDiscount();
  const total = subtotal - discount;
  const selectedCount = cartItems.filter(item => item.selected).length;

  const handleContinueToCheckout = () => {
    if (selectedCount === 0) {
      alert('Por favor selecciona al menos un producto para continuar');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen de compra</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-700">
          <span>Productos ({selectedCount})</span>
          <span className="font-semibold">S/ {subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="border-t pt-3">
            <button
              onClick={() => setShowDiscount(!showDiscount)}
              className="flex items-center justify-between w-full text-left text-green-600 hover:text-green-700"
            >
              <span className="font-medium">Descuentos</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">-S/ {discount.toFixed(2)}</span>
                {showDiscount ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            {showDiscount && (
              <div className="mt-2 pl-4 text-sm text-gray-600">
                {cartItems
                  .filter(item => item.selected && item.discount)
                  .map(item => {
                    const originalPrice = parseFloat(item.originalPrice?.replace('S/ ', '') || 0);
                    const currentPrice = parseFloat(item.price.replace('S/ ', ''));
                    const itemDiscount = (originalPrice - currentPrice) * item.quantity;
                    return (
                      <div key={item.id} className="flex justify-between py-1">
                        <span className="truncate mr-2">{item.name}</span>
                        <span className="text-green-600 font-medium">
                          -S/ {itemDiscount.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between text-xl font-bold text-gray-900">
          <span>Total</span>
          <span className="text-teal-600">S/ {total.toFixed(2)}</span>
        </div>
      </div>

      <button 
        onClick={handleContinueToCheckout}
        disabled={selectedCount === 0}
        className={`w-full font-bold py-3 px-6 rounded-lg transition-colors ${
          selectedCount === 0 
            ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        Continuar compra ({selectedCount})
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Aceptamos todos los medios de pago
      </p>
    </div>
  );
};