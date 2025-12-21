import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Header } from '../components/Principales/Header';
import { Footer } from '../components/Principales/footer';
import { CategoryBar } from '../components/Categorias/CategoryBar';
import { useCart } from '../context/CartContext';

export const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const nextQuery = (params.get('query') || '').trim();
        setQuery(nextQuery);
    }, [location.search]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!query) {
                setProducts([]);
                setLoading(false);
                setError(null);
                return;
            }

            setLoading(true);
            setError(null);
            setProducts([]);

            try {
                const response = await axios.get('/data/productos.php');
                const data = response.data.value || response.data || [];
                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error al obtener productos:', err);
                setError('No se pudieron cargar los productos.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [query]);

    const filteredProducts = useMemo(() => {
        if (!query) {
            return [];
        }

        const normalized = query.toLowerCase();

        return products.filter((product) => {
            const name = (product.nombre || product.nom || product.descrip || '').toLowerCase();
            const brand = (product.marca || '').toLowerCase();
            const description = (product.descripcion || product.descrip || '').toLowerCase();
            const sku = (product.sku || product.codigo || '').toString().toLowerCase();

            return [name, brand, description, sku].some((text) => text.includes(normalized));
        });
    }, [products, query]);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = (event, product) => {
        event.stopPropagation();

        const productToAdd = {
            id: product.id,
            nombre: product.nombre || product.descrip,
            precio: parseFloat(product.precio || product.price || 0),
            imagen: product.imagen ? `https://ventas.vetmarket.pe/${product.imagen}` : '/placeholder-product.png',
            marca: product.marca
        };

        addToCart(productToAdd);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <CategoryBar />

            <main className="flex-grow container mx-auto px-4 py-8">
                <nav className="flex items-center gap-2 text-sm mb-6">
                    <a href="/" className="text-gray-600 hover:text-[#008B9C]">
                        Inicio
                    </a>
                    <span className="text-gray-400">&gt;</span>
                    <span className="text-gray-900 font-medium capitalize">
                        {query ? `Resultados para "${query}"` : 'Búsqueda'}
                    </span>
                </nav>

                <h1 className="text-3xl font-bold text-gray-900 mb-6">Buscar productos</h1>

                <p className="text-gray-600 mb-8">
                    {query
                        ? `Mostrando productos que coinciden con "${query}"`
                        : 'Ingresa un término en la barra de búsqueda para encontrar productos.'}
                </p>

                {!query && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 text-gray-600">
                        Usa la barra de búsqueda en la parte superior para comenzar.
                    </div>
                )}

                {query && loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008B9C]"></div>
                    </div>
                )}

                {query && error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                        {error}
                    </div>
                )}

                {query && !loading && !error && (
                    <>
                        {filteredProducts.length === 0 ? (
                            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-600">
                                No encontramos productos que coincidan con "{query}". Intenta con otro término.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleProductClick(product.id)}
                                        className="bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow duration-200 overflow-hidden group"
                                    >
                                        <div className="relative aspect-square bg-gray-100">
                                            <img
                                                src={product.imagen ? `https://ventas.vetmarket.pe/${product.imagen}` : '/placeholder-product.png'}
                                                alt={product.nombre || product.nom || product.descrip}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                onError={(event) => {
                                                    event.target.src = '/placeholder-product.png';
                                                }}
                                            />
                                        </div>

                                        <div className="p-4">
                                            {product.marca && (
                                                <p className="text-xs text-gray-500 uppercase mb-1">
                                                    {product.marca}
                                                </p>
                                            )}

                                            <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                                                {product.nombre || product.nom || product.descrip}
                                            </h3>

                                            <p className="text-xl font-bold text-gray-900 mb-3">
                                                S/ {parseFloat(product.precio || product.price || 0).toFixed(2)}
                                            </p>

                                            <button
                                                onClick={(event) => handleAddToCart(event, product)}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                                </svg>
                                                Agregar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};
