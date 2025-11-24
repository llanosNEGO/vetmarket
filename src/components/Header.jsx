import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from '../context/CartContext';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { getCartCount } = useCart();

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Buscar:", searchQuery);
        // Aquí puedes navegar o ejecutar la búsqueda real
    };

    return (
        <header className="w-full bg-white shadow-md">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <img src="/images/logo_vetmarketpe.svg" alt="Logo" className="h-12" />
                    </div>

                    <div className="hidden md:flex md:items-center md:space-x-6">
                        <a href="#" className="px-4 py-2 text-[var(--primary)] font-medium hover:text-[var(--primary-dark)] transition-colors">Inicio</a>
                        <a href="#" className="px-4 py-2 text-[var(--primary)] font-medium hover:text-[var(--primary-dark)] transition-colors">Quiénes Somos</a>
                    </div>

                    <div className="hidden md:flex md:items-center md:flex-1 md:justify-center md:mx-8">
                        <form onSubmit={handleSearch} className="w-full max-w-md">
                            <label htmlFor="search" className="sr-only">Buscar productos...</label>
                            <div className="relative">
                                <input
                                    id="search"
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar productos..."
                                    className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[var(--primary)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <Link to="/login" className="flex items-center space-x-1 text-gray-700 hover:text-[var(--primary)] transition-colors">
                            <img src="/images/usuario.svg" alt="User" className="h-7" />
                            <span className="font-medium">Mi cuenta</span>
                        </Link>
                        
                        <Link to="/cart" className="text-gray-700 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {getCartCount() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[var(--primary)] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>
                    </div>

                    <div className="flex items-center md:hidden space-x-4">
                        <button className="text-gray-700 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="absolute -top-1 -right-1 bg-[var(--primary)] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                        </button>
                        
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700"
                            aria-expanded={isMenuOpen}
                            aria-label="Abrir menú"
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

                <div className="md:hidden pb-3">
                    <form onSubmit={handleSearch} className="w-full">
                        <label htmlFor="search-mobile" className="sr-only">Buscar productos...</label>
                        <div className="relative">
                            <input
                                id="search-mobile"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar productos..."
                                className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[var(--primary)]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
                    <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium">Inicio</a>
                    <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium">Quiénes Somos</a>
                    <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium">Productos</a>
                    <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium">Servicios</a>
                    <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium">Contacto</a>
                    <div className="border-t border-gray-200 mt-2 pt-2">
                        <a href="/login" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium">
                            <img src="/images/usuario.svg" alt="User" className="h-5 w-5 mr-2" />
                            Mi cuenta
                        </a>
                    </div>
                </div>
            )}
        </header>
    );  
}