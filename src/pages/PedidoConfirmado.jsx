import { useLocation, Link, useParams } from 'react-router-dom';
import { Header } from '../components/Principales/Header';
import { Footer } from '../components/Principales/footer';

export const PedidoConfirmado = () => {
  const { id } = useParams();
  const location = useLocation();
  const { state } = location;

  if (!state) {
    const ultimoPedido = JSON.parse(localStorage.getItem('ultimoPedido') || '{}');

    if (!ultimoPedido.id) {
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar el pedido</h1>
              <p className="text-gray-600 mb-6">
                No se encontraron datos del pedido. Es posible que hayas recargado la página.
              </p>
              <Link
                to="/historial"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Ver mis pedidos
              </Link>
            </div>
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
            <Link to="/historial" className="hover:text-teal-600">Mis Pedidos</Link>
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
              Tu pedido <strong>#{ultimoPedido.id}</strong> ha sido procesado exitosamente.
            </p>
            <p className="text-gray-600 mb-6">
              Hemos enviado un correo de confirmación con los detalles de tu compra.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Resumen del pedido:</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Número de pedido:</span>
                  <span className="font-medium">#{ultimoPedido.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estado:</span>
                  <span className="font-medium text-green-600">{ultimoPedido.estado || 'Pendiente'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">S/ {ultimoPedido.total?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fecha:</span>
                  <span className="font-medium">{ultimoPedido.fecha || '--'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hora:</span>
                  <span className="font-medium">{ultimoPedido.hora || '--'}</span>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <span className="font-medium">Dirección de envío:</span>
                  <p className="mt-1 text-gray-700">{ultimoPedido.direccion || '--'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/historial"
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-teal-600">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to="/historial" className="hover:text-teal-600">Mis Pedidos</Link>
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
            Tu pedido <strong>#{state.pedidoId || id}</strong> ha sido procesado exitosamente.
          </p>
          <p className="text-gray-600 mb-6">
            Hemos enviado un correo de confirmación con los detalles de tu compra.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Resumen del pedido:</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Número de pedido:</span>
                <span className="font-medium">#{state.pedidoId || id}</span>
              </div>
              <div className="flex justify-between">
                <span>Estado:</span>
                <span className="font-medium text-green-600">{state.estado || 'Pendiente'}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">S/ {state.total?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Fecha:</span>
                <span className="font-medium">{state.fecha || '--'}</span>
              </div>
              <div className="flex justify-between">
                <span>Hora:</span>
                <span className="font-medium">{state.hora || '--'}</span>
              </div>
              <div className="mt-2 pt-2 border-t">
                <span className="font-medium">Dirección de envío:</span>
                <p className="mt-1 text-gray-700">{state.direccion_envio || '--'}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/historial"
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