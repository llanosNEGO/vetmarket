import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Header } from '../components/Principales/Header';
import { Footer } from '../components/Principales/footer';
import { PaymentModal } from '../components/pedido/PagosModal';

export const Checkout = () => {
  const { cartItems, getCartTotal, getDiscount, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombres: '',
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
  const [pedidoProcesado, setPedidoProcesado] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const selectedItems = cartItems.filter(item => item.selected);
  const subtotal = getCartTotal();
  const discount = getDiscount();
  const total = subtotal - discount;

  useEffect(() => {
    if (selectedItems.length === 0 && !pedidoProcesado) {
      navigate('/cart');
    }

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
  }, [navigate, selectedItems.length, pedidoProcesado]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const parsePrice = (price) => {
    if (price == null) return 0;
    if (typeof price === 'number') return price;
    
    const cleaned = String(price)
      .replace(/[^\d,.-]/g, '')
      .replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const validateForm = () => {
    if (!formData.nombres.trim()) {
      alert('Por favor ingresa tus nombres');
      return false;
    }
    if (!formData.dni.trim() || !/^\d{8}$/.test(formData.dni)) {
      alert('Por favor ingresa un DNI válido (8 dígitos)');
      return false;
    }
    if (!formData.telefono.trim() || !/^\d{9}$/.test(formData.telefono)) {
      alert('Por favor ingresa un teléfono válido (9 dígitos)');
      return false;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      alert('Por favor ingresa un email válido');
      return false;
    }
    if (!formData.direccion.trim()) {
      alert('Por favor ingresa tu dirección');
      return false;
    }
    if (!formData.ciudad.trim()) {
      alert('Por favor ingresa tu ciudad');
      return false;
    }
    if (!formData.distrito.trim()) {
      alert('Por favor ingresa tu distrito');
      return false;
    }
    return true;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (selectedItems.length === 0) {
      alert('No hay productos seleccionados en el carrito');
      navigate('/cart');
      return;
    }

    // Abrir modal de pago
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (paymentData) => {
    setLoading(true);
    setShowPaymentModal(false);

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      console.log('=== DEBUG USER DATA ===');
      console.log('userData:', userData);
      console.log('userData.id:', userData.id);
      console.log('Type of userData.id:', typeof userData.id);
      
      if (!userData.id) {
        alert('Debes iniciar sesión para realizar un pedido');
        navigate('/login');
        return;
      }

      // Preparar dirección completa
      let direccionCompleta = formData.direccion;
      if (formData.ciudad) direccionCompleta += `, ${formData.ciudad}`;
      if (formData.distrito) direccionCompleta += `, ${formData.distrito}`;
      if (formData.referencia) direccionCompleta += ` (Referencia: ${formData.referencia})`;

      // Preparar datos del pedido (sin el comprobante en Base64)
      const pedidoData = {
        id_cliente: userData.id,
        cliente_nombre: formData.nombres.trim(),
        cliente_dni: formData.dni,
        cliente_email: formData.email,
        cliente_telefono: formData.telefono,
        subtotal: subtotal.toFixed(2),
        total: total.toFixed(2),
        direccion_envio: direccionCompleta,
        telefono_contacto: formData.telefono,
        notas: formData.notas || '',
        estado: 'pendiente',
        // Información de pago (sin comprobanteBase64 aquí)
        metodo_pago: paymentData.metodoPago,
        numero_operacion: paymentData.numeroOperacion || null,
        nombre_comprobante: paymentData.comprobanteNombre || null,
        fecha_pago: paymentData.fechaPago || null,
        estado_pago: paymentData.metodoPago === 'efectivo' ? 'pendiente' : 'por_verificar',
        // Detalles del pedido
        detalles: selectedItems.map(item => {
          const precioUnitario = parsePrice(item.precio);
          const subtotalLinea = precioUnitario * item.quantity;
          
          return {
            id_producto: String(item.id),
            cantidad: item.quantity,
            precio_unitario: precioUnitario.toFixed(2),
            subtotal_linea: subtotalLinea.toFixed(2),
            nombre_producto: item.descrip || '',
            marca: item.marca || '',
            descripcion: item.descrip_corta || '',
            categoria: item.cat || '',
            imagen: item.imagen || ''
          };
        })
      };

      console.log('=== DEBUG PEDIDO DATA ===');
      console.log('pedidoData completo:', pedidoData);
      console.log('pedidoData.id_cliente:', pedidoData.id_cliente);
      console.log('Tipo de pedidoData.id_cliente:', typeof pedidoData.id_cliente);

      console.log('Preparando envío del pedido con FormData...');

      // Crear FormData para enviar
      const formDataToSend = new FormData();
      
      // Agregar datos del pedido como JSON
      const pedidoDataJSON = JSON.stringify(pedidoData);
      formDataToSend.append('pedidoData', pedidoDataJSON);
      
      console.log('=== DEBUG FORMDATA ===');
      console.log('pedidoDataJSON:', pedidoDataJSON);
      console.log('¿Contiene id_cliente?:', pedidoDataJSON.includes('"id_cliente":'));
      
      // Verificar contenido del FormData
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], ':', typeof pair[1], pair[1]);
      }
      
      // Agregar archivo del comprobante si existe
      if (paymentData.comprobanteArchivo) {
        formDataToSend.append('comprobante', paymentData.comprobanteArchivo);
        console.log('Comprobante archivo agregado');
      } else if (paymentData.comprobanteBase64 && paymentData.comprobanteBase64.startsWith('data:')) {
        // Si aún viene en Base64 (para compatibilidad), convertirlo a Blob
        const base64Data = paymentData.comprobanteBase64.split(',')[1];
        const mimeType = paymentData.comprobanteBase64.split(',')[0].split(':')[1].split(';')[0];
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
        
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);
          
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        
        const blob = new Blob(byteArrays, { type: mimeType });
        const file = new File([blob], paymentData.comprobanteNombre || 'comprobante.jpg', { type: mimeType });
        formDataToSend.append('comprobante', file);
        console.log('Comprobante base64 convertido y agregado');
      }

      console.log('Enviando a:', 'http://localhost:3000/api/pedidos');

      // Enviar con FormData
      const response = await fetch('http://localhost:3000/api/pedidos', {
        method: 'POST',
        // NO agregar Content-Type header cuando usas FormData
        // El navegador lo establece automáticamente con el boundary correcto
        body: formDataToSend
      });

      const result = await response.json();
      console.log('Respuesta del backend:', result);

      if (!response.ok) {
        throw new Error(result.error || `Error HTTP: ${response.status}`);
      }

      if (result.success) {
        setPedidoProcesado(true);
        
        // Guardar en localStorage para PedidoConfirmado
        const detallesPedido = {
          id: result.data.id_pedido,
          total: total,
          fecha: new Date().toLocaleDateString('es-PE'),
          hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
          productos: selectedItems,
          direccion: direccionCompleta,
          estado: 'pendiente',
          metodoPago: paymentData.metodoPago,
          numeroOperacion: paymentData.numeroOperacion
        };
        
        localStorage.setItem('ultimoPedido', JSON.stringify(detallesPedido));
        
        // Limpiar carrito
        clearCart();
        
        // Redirigir a confirmación
        navigate(`/pedidos-confirmado/${result.data.id_pedido}`, {
          state: {
            pedidoId: result.data.id_pedido,
            total: total,
            fecha: new Date().toLocaleDateString('es-PE'),
            hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
            productos: selectedItems,
            direccion_envio: direccionCompleta,
            telefono: formData.telefono,
            notas: formData.notas,
            estado: 'pendiente',
            metodoPago: paymentData.metodoPago,
            numeroOperacion: paymentData.numeroOperacion || 'N/A',
            clienteNombre: formData.nombres.trim(),
            clienteEmail: formData.email
          }
        });
      } else {
        throw new Error(result.error || 'Error al crear el pedido');
      }

    } catch (error) {
      console.error('Error al procesar pedido:', error);
      alert(`Error al procesar el pedido: ${error.message}\nPor favor intenta nuevamente.`);
      // Reabrir modal en caso de error
      setShowPaymentModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (selectedItems.length === 0 && !pedidoProcesado) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">No hay productos seleccionados</h1>
          <p className="text-gray-600 mb-6">Por favor selecciona productos en tu carrito para continuar.</p>
          <Link 
            to="/cart" 
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Volver al Carrito
          </Link>
        </div>
        <Footer />
      </div>
    );
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
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
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
                    pattern="[0-9]{8}"
                    title="El DNI debe tener 8 dígitos"
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
                    pattern="[0-9]{9}"
                    title="El teléfono debe tener 9 dígitos"
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

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Al confirmar el pedido, se abrirá una ventana para seleccionar el método de pago. 
                  Puedes elegir entre transferencia bancaria, Yape/Plin o pago en efectivo.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : `Continuar al Pago - S/ ${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Resumen del pedido */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen del pedido</h2>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
              {selectedItems.map((item) => (
                <div key={`${item.id}-${item.selected}`} className="flex items-center space-x-3 border-b pb-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={item.imagen || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                    {item.marca && (
                      <p className="text-xs text-gray-500">Marca: {item.marca}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900">
                      S/ {(parsePrice(item.precio) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      S/ {parsePrice(item.precio).toFixed(2)} c/u
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
                <span>Total a pagar</span>
                <span className="text-teal-600">S/ {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p className="mb-2">
                <span className="font-medium">Productos en el pedido:</span> {selectedItems.length}
              </p>
              <p className="mb-2">
                <span className="font-medium">Total de items:</span> {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
              <p className="text-xs text-gray-500">
                El pedido será procesado una vez confirmado el pago.
              </p>
            </div>

            <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
              <h3 className="font-semibold text-teal-800 mb-2">Información importante:</h3>
              <ul className="text-sm text-teal-700 space-y-1">
                <li>• Tiempo de entrega: 2-5 días hábiles</li>
                <li>• Horario de atención: Lunes a Viernes 9am - 6pm</li>
                <li>• Contacto: +51 987 654 321</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Modal de Pago */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSubmit={handlePaymentSubmit}
        total={total}
        loading={loading}
      />
    </div>
  );
};