import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity: 1, selected: true }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleItemSelection = (productId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems
      .filter(item => item.selected)
      .reduce((total, item) => {
        const priceString = item.price || '0';
        const price = parseFloat(typeof priceString === 'string' ? priceString.replace('S/ ', '') : priceString);
        return total + (price * item.quantity);
      }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getDiscount = () => {
    return cartItems
      .filter(item => item.selected && item.discount)
      .reduce((total, item) => {
        const originalPriceString = item.originalPrice || '0';
        const currentPriceString = item.price || '0';
        const originalPrice = parseFloat(typeof originalPriceString === 'string' ? originalPriceString.replace('S/ ', '') : originalPriceString);
        const currentPrice = parseFloat(typeof currentPriceString === 'string' ? currentPriceString.replace('S/ ', '') : currentPriceString);
        const discountAmount = (originalPrice - currentPrice) * item.quantity;
        return total + discountAmount;
      }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleItemSelection,
        clearCart,
        getCartTotal,
        getCartCount,
        getDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};