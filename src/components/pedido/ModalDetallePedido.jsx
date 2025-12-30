import React from 'react';

export const ModalDetallePedido = ({ 
    selectedOrder, 
    orderDetails, 
    loadingDetails, 
    onClose,
    getEstadoTexto,
    getEstadoPagoTexto,
    getStatusColor,
    getPaymentStatusColor,
    formatDate,
    calculateTotalItems 
}) => {
    if (!selectedOrder) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Detalles del Pedido #{selectedOrder.id_pedido}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Realizado el {formatDate(selectedOrder.fecha_pedido)}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[70vh]">
                    {loadingDetails ? (
                        <div className="py-12 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando detalles...</p>
                        </div>
                    ) : orderDetails ? (
                        <div className="p-6">
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Estado del pedido</p>
                                        <span className={`mt-1 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(orderDetails.estado)}`}>
                                            {getEstadoTexto(orderDetails.estado)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Estado de pago</p>
                                        <span className={`mt-1 px-3 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(orderDetails.estado_pago)}`}>
                                            {getEstadoPagoTexto(orderDetails.estado_pago)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Método de pago</p>
                                        <p className="mt-1 text-sm text-gray-900 capitalize">
                                            {orderDetails.metodo_pago || 'Efectivo'}
                                        </p>
                                    </div>
                                    {orderDetails.numero_operacion && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Número de operación</p>
                                            <p className="mt-1 text-sm text-gray-900">{orderDetails.numero_operacion}</p>
                                        </div>
                                    )}
                                    {orderDetails.fecha_pago && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Fecha de pago</p>
                                            <p className="mt-1 text-sm text-gray-900">{formatDate(orderDetails.fecha_pago)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">
                                    Productos ({orderDetails.detalles ? orderDetails.detalles.length : 0})
                                </h4>
                                
                                {orderDetails.detalles && orderDetails.detalles.length > 0 ? (
                                    <div className="space-y-4">
                                        {orderDetails.detalles.map((item) => (
                                            <div key={item.id_detalle} className="flex items-center border border-gray-200 rounded-lg p-4">
                                                <div className="flex-shrink-0 h-16 w-16">
                                                    {item.imagen ? (
                                                        <img 
                                                            src={item.imagen} 
                                                            alt={item.descrip_corta || `Producto ${item.id_producto}`}
                                                            className="h-16 w-16 object-cover rounded"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.style.display = 'none';
                                                                e.target.parentElement.innerHTML = `
                                                                    <div class="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                                                                        <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                    </div>
                                                                `;
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                                                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="ml-4 flex-1">
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {item.marca} {item.descrip_corta || item.descripcion}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Código: {item.id_producto}
                                                            </p>
                                                            {item.categoria && (
                                                                <p className="text-xs text-gray-500">
                                                                    Categoría: {item.categoria}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="mt-2 md:mt-0 text-right">
                                                            <p className="text-sm text-gray-500">
                                                                {item.cantidad} x S/ {parseFloat(item.precio_unitario).toFixed(2)}
                                                            </p>
                                                            <p className="font-medium text-gray-900">
                                                                S/ {parseFloat(item.subtotal_linea).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No hay productos registrados para este pedido.
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Resumen del pedido</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-medium">
                                            S/ {orderDetails.subtotal ? parseFloat(orderDetails.subtotal).toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total:</span>
                                        <span className="text-lg font-bold text-gray-900">
                                            S/ {parseFloat(orderDetails.total).toFixed(2)}
                                        </span>
                                    </div>
                                    {orderDetails.detalles && (
                                        <div className="pt-2 border-t border-gray-200">
                                            <span className="text-sm text-gray-500">
                                                Total de productos: {calculateTotalItems(orderDetails.detalles)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {orderDetails.direccion_envio && (
                                <div className="mt-6">
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">Información de envío</h4>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700">{orderDetails.direccion_envio}</p>
                                        {orderDetails.telefono_contacto && (
                                            <p className="text-sm text-gray-500 mt-2">
                                                Teléfono de contacto: {orderDetails.telefono_contacto}
                                            </p>
                                        )}
                                        {orderDetails.notas && (
                                            <p className="text-sm text-gray-500 mt-2">
                                                Notas: {orderDetails.notas}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-2">Información del cliente</h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="font-medium text-gray-900">
                                        {orderDetails.nombre_cliente || orderDetails.cliente_nombre}
                                    </p>
                                    {orderDetails.cliente_dni && (
                                        <p className="text-sm text-gray-500">
                                            DNI: {orderDetails.cliente_dni}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Email: {orderDetails.email || orderDetails.cliente_email}
                                    </p>
                                    {orderDetails.phone && (
                                        <p className="text-sm text-gray-500">
                                            Teléfono: {orderDetails.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-12 text-center text-gray-500">
                            No se pudieron cargar los detalles del pedido.
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};