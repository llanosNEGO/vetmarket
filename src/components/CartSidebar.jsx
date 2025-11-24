import { useCart } from '../context/CartContext';

export const CartSidebar = () => {
  const { cartItems } = useCart();
  
  const selectedItems = cartItems.filter(item => item.selected);
  const selectedCount = selectedItems.length;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">
            {selectedCount} {selectedCount === 1 ? 'producto seleccionado' : 'productos seleccionados'}
          </h3>
          <p className="text-sm text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} en el carrito
          </p>
        </div>
      </div>
    </div>
  );
};