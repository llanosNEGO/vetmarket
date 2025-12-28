// src/services/pedidosServicios.js


export const pedidosService = {
  /**
   * Convertir archivo de imagen a Base64
   * @param {File} file - Archivo de imagen
   * @returns {Promise<string>} Imagen en formato 
   */
  async convertirImagenABase64(file) {
    return new Promise((resolve, reject) => {

      if (!file.type.startsWith('image/')) {
        reject(new Error('El archivo debe ser una imagen'));
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        reject(new Error('La imagen no debe superar los 5MB'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = () => {
        resolve(reader.result);
      };
      
      reader.onerror = (error) => {
        reject(new Error('Error al leer el archivo: ' + error));
      };
      
      reader.readAsDataURL(file);
    });
  },

  /**
   * Convertir Base64 a Blob (para enviar como FormData si es necesario)
   * @param {string} base64 - String Base64
   * @returns {Blob} Blob de la imagen
   */
  base64ToBlob(base64) {
    // Separar el header Base64 del contenido
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    
    const uInt8Array = new Uint8Array(rawLength);
    
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([uInt8Array], { type: contentType });
  },

  /**
   * Crear un nuevo pedido con imagen convertida a Base64
   * @param {Object} pedidoData - Datos del pedido
   * @param {File} [comprobanteFile] - Archivo del comprobante (opcional)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async crearPedidoConComprobante(pedidoData, comprobanteFile = null) {
    try {
      let comprobanteBase64 = null;
      let mimeType = null;

      if (comprobanteFile) {
        comprobanteBase64 = await this.convertirImagenABase64(comprobanteFile);
        mimeType = comprobanteFile.type;

        const estimatedSize = this.estimarTamanoBase64(comprobanteBase64);
        if (estimatedSize > 2 * 1024 * 1024) {
          console.warn('Imagen muy grande, se recomienda comprimir');
        }
      }

      const datosCompletos = {
        ...pedidoData,
        comprobante: comprobanteBase64 ? {
          data: comprobanteBase64,
          mime_type: mimeType,
          nombre_original: comprobanteFile?.name || 'comprobante.jpg'
        } : null
      };

      const response = await fetch('http://localhost:3000/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(datosCompletos)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear pedido');
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('Error en crearPedidoConComprobante:', error);
      throw error;
    }
  },

  /**
   * Estimar tamaño de un string Base64 en bytes
   * @param {string} base64String - String Base64
   * @returns {number} Tamaño estimado en bytes
   */
  estimarTamanoBase64(base64String) {
    if (!base64String) return 0;
    
    const stringLength = base64String.length;
    const padding = (base64String.match(/=/g) || []).length;
    
    return (stringLength * 3) / 4 - padding;
  },

  /**
   * Validar si una cadena es Base64 válido de imagen
   * @param {string} str
   * @returns {boolean}
   */
  esBase64ImagenValido(str) {
    if (typeof str !== 'string') return false;

    if (!str.startsWith('data:image/')) return false;
    
    if (!str.includes(';base64,')) return false;
    
    const base64Part = str.split(';base64,')[1];
    if (!base64Part) return false;
    
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    return base64Regex.test(base64Part);
  },

  /**
   * Obtener extensión de archivo desde Base64
   * @param {string} base64String - String Base64
   * @returns {string} Extensión del archivo
   */
  obtenerExtensionDesdeBase64(base64String) {
    if (!this.esBase64ImagenValido(base64String)) return 'jpg';
    
    const mimeType = base64String.match(/data:(image\/\w+);/)[1];
    const extension = mimeType.split('/')[1];
    
    const extensionMap = {
      'jpeg': 'jpg',
      'jpg': 'jpg',
      'png': 'png',
      'gif': 'gif',
      'webp': 'webp'
    };
    
    return extensionMap[extension] || 'jpg';
  }
};