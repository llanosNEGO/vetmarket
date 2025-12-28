import { useState, useRef } from 'react';

export const PaymentModal = ({ isOpen, onClose, onPaymentSubmit, total, loading }) => {
  const fileInputRef = useRef(null);
  
  const [paymentData, setPaymentData] = useState({
    metodoPago: 'transferencia',
    comprobante: null,
    comprobanteNombre: '',
    numeroOperacion: '',
    fechaPago: new Date().toISOString().split('T')[0]
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  // Datos de transferencia bancaria (puedes poner los reales)
  const bankAccounts = [
    {
      banco: 'BCP',
      nombre: 'TU EMPRESA S.A.C.',
      cuenta: '191-23456789-1-45',
      cci: '002191002345678914501',
      tipo: 'Cuenta Corriente Soles'
    }
    // {
    //   banco: 'Interbank',
    //   nombre: 'TU EMPRESA S.A.C.',
    //   cuenta: '123-456789012-3',
    //   cci: '0031230456789012303',
    //   tipo: 'Cuenta Ahorros Soles'
    // }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Por favor sube una imagen (JPG, PNG, WEBP) o PDF');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es muy grande. Máximo 5MB');
        return;
      }

      setPaymentData(prev => ({
        ...prev,
        comprobante: file,
        comprobanteNombre: file.name
      }));
    }
  };

  const handleRemoveFile = () => {
    setPaymentData(prev => ({
      ...prev,
      comprobante: null,
      comprobanteNombre: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validaciones según método de pago
  if (paymentData.metodoPago === 'transferencia' || paymentData.metodoPago === 'yape') {
    if (!paymentData.comprobante) {
      alert(`Por favor sube el comprobante de pago para ${paymentData.metodoPago}`);
      return;
    }
    
    if (!paymentData.numeroOperacion.trim()) {
      const mensaje = paymentData.metodoPago === 'transferencia' 
        ? 'Por favor ingresa el número de operación' 
        : 'Por favor ingresa el número de teléfono usado para el pago';
      alert(mensaje);
      return;
    }
  }
  
  // Crear FormData en lugar de Base64
  const formData = new FormData();
  
  // Agregar datos básicos
  formData.append('metodoPago', paymentData.metodoPago);
  formData.append('numeroOperacion', paymentData.numeroOperacion);
  formData.append('fechaPago', paymentData.fechaPago);
  
  // Agregar archivo si existe
  if (paymentData.comprobante) {
    formData.append('comprobante', paymentData.comprobante);
  } else {
    formData.append('comprobante', ''); // Campo vacío para mantener estructura
  }
  
  // También agregar el nombre del archivo
  formData.append('comprobanteNombre', paymentData.comprobanteNombre || '');
  
  // Opción 1: Llamar directamente a la API de pedidos
  // onPaymentSubmit(formData);
  
  // Opción 2: Convertir FormData a objeto para mantener compatibilidad
  const paymentInfo = {
    metodoPago: paymentData.metodoPago,
    numeroOperacion: paymentData.numeroOperacion,
    fechaPago: paymentData.fechaPago,
    comprobanteNombre: paymentData.comprobanteNombre,
    comprobanteArchivo: paymentData.comprobante,

  };
  
  onPaymentSubmit(paymentInfo);
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    // Si es una imagen, la optimizamos antes de convertir a Base64
    if (file.type.startsWith('image/')) {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        // Redimensionar a un máximo de 800px de ancho
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a JPG con calidad 0.7 (70%)
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(optimizedDataUrl);
      };
      
      img.onerror = (error) => {
        // Si falla la optimización, usar el método original
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      };
      
      img.src = URL.createObjectURL(file);
      
    } else {
      // Para PDF u otros archivos, usar el método original
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    }
  });
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Encabezado */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Método de Pago</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda: Información de pago */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Total a pagar: <span className="text-green-600">S/ {total.toFixed(2)}</span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Método de pago */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de pago *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="metodoPago"
                        value="transferencia"
                        checked={paymentData.metodoPago === 'transferencia'}
                        onChange={handleChange}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-gray-700">Transferencia Bancaria / QR</span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="metodoPago"
                        value="yape"
                        checked={paymentData.metodoPago === 'yape'}
                        onChange={handleChange}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-gray-700">Yape / Plin</span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="metodoPago"
                        value="efectivo"
                        checked={paymentData.metodoPago === 'efectivo'}
                        onChange={handleChange}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-gray-700">Pago en Efectivo</span>
                    </label>
                  </div>
                </div>

                {/* Mostrar opciones según método seleccionado */}
                {paymentData.metodoPago === 'transferencia' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Operación *
                      </label>
                      <input
                        type="text"
                        name="numeroOperacion"
                        value={paymentData.numeroOperacion}
                        onChange={handleChange}
                        required
                        placeholder="Ej: 123456789"
                        className="w-full border border-gray-300 bg-[var(--bg-cajas)] text-[var(--color-primary)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subir Comprobante *
                      </label>
                      {!paymentData.comprobante ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors cursor-pointer">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            className="hidden"
                          />
                          <div 
                            onClick={() => fileInputRef.current.click()}
                            className="cursor-pointer"
                          >
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-sm text-gray-600">Haz click para subir tu comprobante</p>
                            <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP o PDF (Max. 5MB)</p>
                          </div>
                        </div>
                      ) : (
                        <div className="border border-gray-300 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{paymentData.comprobanteNombre}</p>
                                <p className="text-xs text-gray-500">
                                  {paymentData.comprobante.size > 1024 * 1024 
                                    ? `${(paymentData.comprobante.size / (1024 * 1024)).toFixed(2)} MB`
                                    : `${Math.round(paymentData.comprobante.size / 1024)} KB`}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {paymentData.metodoPago === 'yape' && (
                  <>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Código QR para pagos
                        </label>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                           Su número de Teléfono (Yape/Plin) *
                          </label>
                          <input
                            type="tel"
                            name="numeroOperacion"
                            value={paymentData.numeroOperacion}
                            onChange={handleChange}
                            required
                            placeholder="Ej: 987654321"
                            pattern="[0-9]{9}"
                            className="w-full border border-gray-300 bg-[var(--bg-cajas)] text-[var(--color-primary)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                          />
                        </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subir Captura de Pago *
                      </label>
                      {!paymentData.comprobante ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                          />
                          <div 
                            onClick={() => fileInputRef.current.click()}
                            className="cursor-pointer"
                          >
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-sm text-gray-600">Subir captura de pantalla</p>
                            <p className="text-xs text-gray-500 mt-1">Toma foto o selecciona imagen</p>
                          </div>
                        </div>
                      ) : (
                        <div className="border border-gray-300 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{paymentData.comprobanteNombre}</p>
                                <p className="text-xs text-gray-500">Captura de pago</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {paymentData.metodoPago === 'efectivo' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm text-yellow-800">
                          <strong>Pago en Efectivo:</strong> Al seleccionar esta opción, nuestro equipo se pondrá en contacto contigo para coordinar la entrega y el pago en efectivo al momento de recibir tu pedido.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Procesando...
                        </>
                      ) : paymentData.metodoPago === 'efectivo' ? 'Confirmar Pedido' : 'Confirmar Pago'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Bancaria</h3>
              
              <div className="mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-gray-700 mb-2">Escanear QR para pagar:</p>
                  <div className="p-4 rounded inline-block mb-3">
                    <div className="bg-gray-200 flex items-center justify-center rounded">
                      <img
                        src="/images/QRpagos.jpeg"
                        alt="Código QR para pagos (Yape/Plin)"
                        className="w-56 h-56 object-contain rounded-lg border border-gray-200 shadow-sm"
                      />                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    Escanea con tu app bancaria o Yape/Plin
                  </p>
                </div>
              </div>

              {/* Bank Accounts */}
              <div className="space-y-4">
                {bankAccounts.map((account, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold">{account.banco.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{account.banco}</h4>
                        <p className="text-sm text-gray-600">{account.tipo}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Titular:</span>
                        <span className="font-medium">{account.nombre}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cuenta:</span>
                        <span className="font-medium">{account.cuenta}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CCI:</span>
                        <span className="font-medium">{account.cci}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Instrucciones:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>1. Realiza la transferencia a una de nuestras cuentas</li>
                  <li>2. Guarda el número de operación</li>
                  <li>3. Toma una captura del comprobante</li>
                  <li>4. Sube el comprobante en este formulario</li>
                  <li>5. Tu pedido será procesado una vez verifiquemos el pago</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};