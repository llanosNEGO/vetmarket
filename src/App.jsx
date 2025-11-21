import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bienvenido a React + Tailwind
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Un proyecto moderno con Vite, React y Tailwind CSS
        </p>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">🚀</span>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Contador Interactivo
            </h2>
            
            <div className="flex items-center justify-center gap-6 mb-6">
              <button 
                onClick={() => setCount(count - 1)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                Decrementar
              </button>
              
              <span className="text-4xl font-bold text-gray-800 min-w-20">
                {count}
              </span>
              
              <button 
                onClick={() => setCount(count + 1)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                Incrementar
              </button>
            </div>
            
            <button 
              onClick={() => setCount(0)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              Reiniciar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '⚡', title: 'Rápido', desc: 'Vite para desarrollo veloz' },
            { icon: '🎨', title: 'Moderno', desc: 'Tailwind para diseño' },
            { icon: '🔧', title: 'Flexible', desc: 'Fácil de personalizar' }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-12">
        <p className="text-gray-500">
          Creado con ❤️ usando React + Tailwind CSS
        </p>
      </footer>
    </div>
  )
}

export default App