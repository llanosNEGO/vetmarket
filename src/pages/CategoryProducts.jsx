import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Header } from '../components/Header';
import { Footer } from '../components/footer';
import { CategoryBar } from '../components/CategoryBar';
import { useCart } from '../context/CartContext';

export const CategoryProducts = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función recursiva para obtener todos los IDs de subcategorías
    const getAllSubcategoryIds = useCallback((category) => {
        let ids = [category.id];

        if (category.sub_menus && Array.isArray(category.sub_menus)) {
            for (const sub of category.sub_menus) {
                ids = [...ids, ...getAllSubcategoryIds(sub)];
            }
        }

        return ids;
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                // Obtener todas las categorías
                const categoriesResponse = await axios.get('/data/categorias.php');
                const categories = categoriesResponse.data.value || categoriesResponse.data;

                console.log("Todas las categorías:", categories);
                console.log("Buscando categoría:", categoryName);

                // Buscar la categoría actual por nombre
                const currentCategory = categories.find(
                    (cat) => cat.nom.toLowerCase() === decodeURIComponent(categoryName).toLowerCase()
                );

                console.log("Categoría encontrada:", currentCategory);

                if (!currentCategory) {
                    setError("Categoría no encontrada");
                    setLoading(false);
                    return;
                }

                // Obtener todos los IDs de subcategorías recursivamente
                const allCategoryIds = getAllSubcategoryIds(currentCategory);
                console.log("IDs a consultar:", allCategoryIds);

                let allProducts = [];

                // Obtener TODOS los productos
                const productsResponse = await axios.get('/data/productos.php');
                const allProductsData = productsResponse.data.value || productsResponse.data || [];
                
                console.log('Total de productos obtenidos:', allProductsData.length);

                // Filtrar productos que pertenezcan a alguna de las categorías/subcategorías
                allProducts = allProductsData.filter(product => 
                    allCategoryIds.includes(product.idcat)
                );
                
                console.log('Productos filtrados por categorías:', allProducts.length);

                console.log("TOTAL productos encontrados:", allProducts.length);

                if (allProducts.length === 0) {
                    setError("No hay productos disponibles en esta categoría");
                    setProducts([]);
                } else {
                    // Eliminar duplicados por ID
                    const uniqueProducts = allProducts.filter(
                        (product, index, self) =>
                            index === self.findIndex((p) => p.id === product.id)
                    );
                    console.log("Productos únicos:", uniqueProducts.length);
                    setProducts(uniqueProducts);
                }
            } catch (err) {
                console.error("Error completo:", err);
                console.error("Error response:", err.response);

                if (err.response?.status === 404) {
                    setError("No hay productos disponibles en esta categoría");
                } else {
                    setError(`Error al cargar los productos: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryName, getAllSubcategoryIds]);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        
        const productToAdd = {
            id: product.id,
            nombre: product.nombre || product.descrip,
            precio: parseFloat(product.precio || 0),
            imagen: product.imagen 
                ? `https://ventas.vetmarket.pe/${product.imagen}`
                : '/placeholder-product.png',
            marca: product.marca
        };
        
        addToCart(productToAdd);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <CategoryBar />

            <main className="flex-grow container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm mb-6">
                    <a href="/" className="text-gray-600 hover:text-[#008B9C]">
                        Inicio
                    </a>
                    <span className="text-gray-400">&gt;</span>
                    <span className="text-gray-900 font-medium capitalize">
                        {categoryName}
                    </span>
                </nav>

                <h1 className="text-3xl font-bold text-gray-900 mb-8 uppercase">
                    {categoryName}
                </h1>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008B9C]"></div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-lg flex items-start gap-3">
                        <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="font-medium">{error}</p>
                            <p className="text-sm mt-1">Intenta explorar otras categorías con productos disponibles.</p>
                        </div>
                    </div>
                )}

                {/* Productos */}
                {!loading && !error && (
                    <>
                        {products.length === 0 ? (
                            <div className="text-center py-20 text-gray-500 text-lg">
                                No hay productos disponibles
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleProductClick(product.id)}
                                        className="bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow duration-200 overflow-hidden group"
                                    >
                                        <div className="relative aspect-square bg-gray-100">
                                            <img
                                                src={
                                                    product.imagen 
                                                        ? `https://ventas.vetmarket.pe/${product.imagen}`
                                                        : "/placeholder-product.png"
                                                }
                                                alt={product.nombre || product.nom}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-product.png';
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
                                                onClick={(e) => handleAddToCart(e, product)}
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
