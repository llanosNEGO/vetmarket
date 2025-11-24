import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart, toggleItemSelection } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (item.maxQuantity || 99)) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={item.selected}
        onChange={() => toggleItemSelection(item.id)}
        className="mt-2 w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
      />

      {/* Imagen */}
      <img
        src={item.image || '/images/slide-1.svg'}
        alt={item.name}
        className="w-24 h-24 object-contain rounded-lg border border-gray-200"
      />

      {/* Información del producto */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">{item.name}</h3>
        <p className="text-xs text-gray-500 mb-1">Marca: {item.brand}</p>
        <p className="text-xs text-gray-500 mb-2">Vendido por: {item.seller || 'VetMarket'}</p>

        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-900">{item.price}</span>
          {item.originalPrice && (
            <span className="text-sm text-gray-400 line-through">{item.originalPrice}</span>
          )}
          {item.discount && (
            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded">
              -{item.discount}%
            </span>
          )}
        </div>
      </div>

      {/* Controles de cantidad */}
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 hover:text-red-700 transition-colors p-1"
          title="Eliminar producto"
        >
          <Trash2 size={18} />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold text-gray-600"
          >
            −
          </button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold text-gray-600"
          >
            +
          </button>
        </div>

        {item.maxQuantity && (
          <span className="text-xs text-gray-500">Máx: {item.maxQuantity}</span>
        )}
      </div>
    </div>
  );
};