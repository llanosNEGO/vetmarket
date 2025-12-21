import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Principales/Header';
import { Footer } from '../../components/Principales/footer';
import { useAuth } from '../../context/AuthContext';
import { ModalDetallePedido } from './ModalDetallePedido';

export const Historial = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const { user } = useAuth();
    const navigate = useNavigate();

    const API_URL = 'http://localhost:3000/api';

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log(`Buscando pedidos para cliente ID: ${user.id}`);
                
                const response = await fetch(`${API_URL}/pedidos/cliente/${user.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const result = await response.json();
                
                if (result.success) {
                    console.log('Pedidos obtenidos:', result.data);
                    const sortedOrders = result.data.sort((a, b) => 
                        new Date(b.fecha_pedido) - new Date(a.fecha_pedido)
                    );
                    setOrders(sortedOrders);
                    setFilteredOrders(sortedOrders);
                } else {
                    throw new Error(result.error || 'Error al obtener pedidos');
                }
                
            } catch (error) {
                console.error('Error al cargar pedidos:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate, API_URL]);

    useEffect(() => {
        let filtered = [...orders];
        
        if (statusFilter !== 'todos') {
            filtered = filtered.filter(order => {
                const estadoNormalizado = order.estado?.toLowerCase().trim().replace(/\s+/g, '_');
                const filtroNormalizado = statusFilter.toLowerCase().trim();
                                
                return estadoNormalizado === filtroNormalizado;
            });
        }
        
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(order => {
                const idMatch = order.id_pedido?.toString().includes(term);
                
                const direccionMatch = order.direccion_envio?.toLowerCase().includes(term);
                const metodoPagoMatch = order.metodo_pago?.toLowerCase().includes(term);
                
                const found = idMatch || direccionMatch || metodoPagoMatch;
                
                if (found) {
                    console.log(`Pedido ID ${order.id_pedido} - Coincide con búsqueda`);
                }
                
                return found;
            });
            console.log('Resultado final después de búsqueda:', filtered.length, 'pedidos');
        }
        
        setFilteredOrders(filtered);
        setCurrentPage(1);
    }, [orders, searchTerm, statusFilter]);

    const fetchOrderDetails = async (idPedido) => {
        try {
            setLoadingDetails(true);
            console.log(`Obteniendo detalles del pedido: ${idPedido}`);
            
            const response = await fetch(`${API_URL}/pedidos/${idPedido}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                setOrderDetails(result.data);
            } else {
                throw new Error(result.error || 'Error al obtener detalles del pedido');
            }
            
        } catch (error) {
            alert('Error al cargar los detalles del pedido: ' + error.message);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleViewDetails = async (order) => {
        setSelectedOrder(order);
        await fetchOrderDetails(order.id_pedido);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setOrderDetails(null);
    };

    const getEstadoTexto = (estado) => {
        const estados = {
            'pendiente': 'Pendiente',
            'procesando': 'Procesando',
            'en_camino': 'En camino',
            'entregado': 'Entregado',
            'cancelado': 'Cancelado'
        };
        return estados[estado] || estado;
    };

    const getEstadoPagoTexto = (estadoPago) => {
        const estados = {
            'pendiente': 'Pendiente',
            'por_verificar': 'Por verificar',
            'verificado': 'Verificado',
            'rechazado': 'Rechazado'
        };
        return estados[estadoPago] || estadoPago;
    };

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'entregado':
            case 'Entregado': 
                return 'bg-green-100 text-green-800';
            case 'en_camino':
            case 'En camino':
            case 'enviado':
                return 'bg-blue-100 text-blue-800';
            case 'procesando':
            case 'Procesando':
            case 'pendiente':
            case 'Pendiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelado':
            case 'Cancelado':
                return 'bg-red-100 text-red-800';
            default: 
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (estadoPago) => {
        switch (estadoPago) {
            case 'verificado':
                return 'bg-green-100 text-green-800';
            case 'por_verificar':
                return 'bg-yellow-100 text-yellow-800';
            case 'pendiente':
                return 'bg-orange-100 text-orange-800';
            case 'rechazado':
                return 'bg-red-100 text-red-800';
            default: 
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getOrderNumber = (index) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return startIndex + index + 1;
    };

    const calculateTotalItems = (detalles) => {
        if (!detalles || detalles.length === 0) return 0;
        return detalles.reduce((total, item) => total + parseInt(item.cantidad), 0);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando tus pedidos...</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error al cargar los pedidos</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{error}</p>
                                    <button 
                                        onClick={() => window.location.reload()} 
                                        className="mt-2 text-sm font-medium text-red-800 hover:text-red-900"
                                    >
                                        Intentar nuevamente
                                    </button>
                                </div>
                            </div>
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
                    <p className="mt-2 text-gray-600">
                        Revisa el historial y estado de todos tus pedidos
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm font-medium text-gray-500">Total de pedidos</p>
                        <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm font-medium text-gray-500">Pendientes</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {orders.filter(o => o.estado?.toLowerCase().trim() === 'pendiente').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm font-medium text-gray-500">En proceso</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {orders.filter(o => {
                                const estado = o.estado?.toLowerCase().trim();
                                return estado === 'procesando' || estado === 'en_camino';
                            }).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm font-medium text-gray-500">Entregados</p>
                        <p className="text-2xl font-bold text-green-600">
                            {orders.filter(o => o.estado?.toLowerCase().trim() === 'entregado').length}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar por ID de pedido, dirección o método de pago..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-100 text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                                />
                                <svg 
                                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border bg-slate-100 text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                            >
                                <option value="todos">Todos los estados</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="procesando">Procesando</option>
                                <option value="en_camino">En camino</option>
                                <option value="entregado">Entregado</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('todos');
                                }}
                                className="px-4 py-2 bg-[var(--primary)] rounded-lg text-white hover:bg-[var(--primary-dark)] font-medium"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </div>
                    {(searchTerm || statusFilter !== 'todos') && (
                        <div className="mt-3 text-sm text-gray-600">
                            <p>
                                Mostrando {filteredOrders.length} de {orders.length} pedidos
                                {searchTerm && ` - Buscando: "${searchTerm}"`}
                                {statusFilter !== 'todos' && ` - Estado: ${statusFilter}`}
                            </p>
                        </div>
                    )}
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="bg-white shadow rounded-lg p-8 text-center">
                        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pedidos</h3>
                        <p className="text-gray-500 mb-6">
                            {orders.length === 0 
                                ? 'Cuando realices tu primer pedido, aparecerá aquí.'
                                : 'No hay pedidos que coincidan con los filtros aplicados.'}
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center px-4 py-2 bg-[var(--primary)] text-white font-medium rounded-md hover:bg-[var(--primary-dark)] transition-colors"
                        >
                            Ir a comprar
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                #
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Pago
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentOrders.map((order, index) => (
                                            <tr key={order.id_pedido} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {getOrderNumber(index)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ID: {order.id_pedido}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {formatDate(order.fecha_pedido)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {order.metodo_pago ? order.metodo_pago.charAt(0).toUpperCase() + order.metodo_pago.slice(1) : 'Efectivo'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900">
                                                        S/ {parseFloat(order.total).toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.estado)}`}>
                                                        {getEstadoTexto(order.estado)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.estado_pago)}`}>
                                                        {getEstadoPagoTexto(order.estado_pago)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleViewDetails(order)}
                                                            className="text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium"
                                                        >
                                                            Ver detalles
                                                        </button>
                                                        {order.comprobante_pago && (
                                                            <a 
                                                                href={`http://localhost:3000${order.comprobante_pago}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-green-600 hover:text-green-800 font-medium"
                                                                title="Ver comprobante"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-b-lg">
                                <div className="flex flex-1 justify-between sm:hidden">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{' '}
                                            <span className="font-medium">
                                                {Math.min(indexOfLastItem, filteredOrders.length)}
                                            </span>{' '}
                                            de <span className="font-medium">{filteredOrders.length}</span> resultados
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="sr-only">Anterior</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            {[...Array(totalPages)].map((_, index) => {
                                                const pageNumber = index + 1;
                                                const isCurrentPage = pageNumber === currentPage;
                                                const isNearCurrent = Math.abs(pageNumber - currentPage) <= 2;
                                                const isFirstPage = pageNumber === 1;
                                                const isLastPage = pageNumber === totalPages;

                                                if (isFirstPage || isLastPage || isNearCurrent) {
                                                    return (
                                                        <button
                                                            key={pageNumber}
                                                            onClick={() => paginate(pageNumber)}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                isCurrentPage
                                                                    ? 'z-10 bg-[var(--primary)] border-[var(--primary)] text-white'
                                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    );
                                                }
                                                return null;
                                            })}
                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="sr-only">Siguiente</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <ModalDetallePedido
                    selectedOrder={selectedOrder}
                    orderDetails={orderDetails}
                    loadingDetails={loadingDetails}
                    onClose={closeModal}
                    getEstadoTexto={getEstadoTexto}
                    getEstadoPagoTexto={getEstadoPagoTexto}
                    getStatusColor={getStatusColor}
                    getPaymentStatusColor={getPaymentStatusColor}
                    formatDate={formatDateTime}
                    calculateTotalItems={calculateTotalItems}
                />
            </div>
            <Footer />
        </div>
    );
};