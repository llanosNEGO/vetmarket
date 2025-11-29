import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/footer';
import { useCart } from '../context/CartContext';

export const Checkout = () => {
  const { cartItems, getCartTotal, getDiscount, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    distrito: '',
    referencia: '',
    notas: ''
  });

  const [loading, setLoading] = useState(false);

  const selectedItems = cartItems.filter(item => item.selected);
  const subtotal = getCartTotal();
  const discount = getDiscount();
  const total = subtotal - discount;

  useEffect(() => {
    // Si no hay productos seleccionados, redirigir al carrito
    if (selectedItems.length === 0) {
      navigate('/cart');
    }

    // Cargar datos del usuario si está logueado
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.id) {
      setFormData(prev => ({
        ...prev,
        nombres: userData.names || '',
        email: userData.email || '',
        telefono: userData.phone || '',
        dni: userData.dni || ''
      }));
    }
  }, [navigate, selectedItems.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!userData.id) {
        alert('Debes iniciar sesión para realizar un pedido');
        navigate('/login');
        return;
      }

      const pedidoData = {
        id_cliente: userData.id,
        subtotal: subtotal,
        total: total,
        direccion_envio: `${formData.direccion}, ${formData.distrito}, ${formData.ciudad}`,
        telefono_contacto: formData.telefono,
        notas: formData.notas,
        detalles: selectedItems.map(item => ({
          id_producto: item.id,
          cantidad: item.quantity,
          precio_unitario: parseFloat(item.price.replace('S/ ', '')),
          subtotal_linea: parseFloat(item.price.replace('S/ ', '')) * item.quantity,
          marca: item.marca || '',
          descripcion: item.name,
          descrip_corta: item.descrip_corta || '',
          categoria: item.cat || '',
          imagen: item.imagen || ''
        }))
      };

      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoData)
      });

      const result = await response.json();

      if (result.success) {
        // Limpiar carrito y redirigir a confirmación
        clearCart();
        navigate(`/pedido-confirmado/${result.data.id_pedido}`);
      } else {
        throw new Error(result.error || 'Error al crear el pedido');
      }

    } catch (error) {
      console.error('Error al procesar pedido:', error);
      alert('Error al procesar el pedido. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-teal-600">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to="/cart" className="hover:text-teal-600">Carrito</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-900">Finalizar compra</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de envío y datos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Información de envío</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DNI *
                  </label>
                  <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección completa *
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  required
                  placeholder="Calle, número, urbanización"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distrito *
                  </label>
                  <input
                    type="text"
                    name="distrito"
                    value={formData.distrito}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referencia (opcional)
                </label>
                <textarea
                  name="referencia"
                  value={formData.referencia}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Puntos de referencia para la entrega"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas del pedido (opcional)
                </label>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Instrucciones especiales para tu pedido..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                }`}
              >
                {loading ? 'Procesando pedido...' : `Confirmar pedido - S/ ${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Resumen del pedido */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen del pedido</h2>
            
            <div className="space-y-4 mb-6">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 border-b pb-4">
                  <img
                    src={item.imagen || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      S/ {(parseFloat(item.price.replace('S/ ', '')) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span>-S/ {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                <span>Total</span>
                <span className="text-teal-600">S/ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};