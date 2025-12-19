import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/footer';

export const PedidoConfirmado = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPedido = async () => {
      try {
        const response = await fetch(`/api/pedidos/${id}`);
        const result = await response.json();
        
        if (result.success) {
          setPedido(result.data);
        }
      } catch (error) {
        console.error('Error al cargar pedido:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarPedido();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-teal-600">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to="/pedidos" className="hover:text-teal-600">Mis Pedidos</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-900">Pedido Confirmado</span>
        </nav>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Pedido Confirmado!</h1>
          <p className="text-lg text-gray-600 mb-2">
            Tu pedido <strong>#{id}</strong> ha sido procesado exitosamente.
          </p>
          <p className="text-gray-600 mb-6">
            Hemos enviado un correo de confirmación con los detalles de tu compra.
          </p>

          {pedido && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Resumen del pedido:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Estado:</span>
                  <span className="font-medium text-green-600">Confirmado</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">S/ {pedido.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dirección de envío:</span>
                  <span className="font-medium text-right">{pedido.direccion_envio}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pedidos"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Ver mis pedidos
            </Link>
            <Link
              to="/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};