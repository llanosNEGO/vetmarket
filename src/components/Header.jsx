import { useState } from "react";


export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <span className="text-2xl font-bold text-indigo-600">MiApp</span>
                    </div>
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        <a href="#" className="text-gray-700 hover:text-indigo-600">Inicio</a>
                        <a href="#" className="text-gray-700 hover:text-indigo-600">Características</a>
                        <a href="#" className="text-gray-700 hover:text-indigo-600">Precios</a>
                        <a href="#" className="text-gray-700 hover:text-indigo-600">Contacto</a>
                    </div>
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        >
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden">
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Inicio</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Características</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Precios</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Contacto</a>
                </div>
            )}
        </header>
    );  
}