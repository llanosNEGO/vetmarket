import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/api";

export const Welcome = () => {
    const [user, setUser] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener usuario del localStorage
        const userData = localStorage.getItem('user');
        
        if (!userData) {
            // Si no hay usuario, redirigir al login
            navigate("/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            loadAdditionalData();
        } catch (error) {
            console.error("Error parsing user data:", error);
            navigate("/login");
        }
    }, [navigate]);

    const loadAdditionalData = async () => {
        try {
            // Cargar estadísticas de usuarios
            const statsResponse = await userService.getStats();
            setUserStats(statsResponse.data.data);

            // Cargar todos los usuarios
            const usersResponse = await userService.getAll();
            setAllUsers(usersResponse.data.data);
        } catch (error) {
            console.error("Error loading additional data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate("/login");
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <img 
                            src="/images/logo_vetmarketpe.svg" 
                            alt="VetMarketPE" 
                            className="h-12 w-auto"
                        />
                        <h1 className="text-2xl font-bold text-gray-900">Panel de Usuario</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Información del usuario logeado */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">¡Bienvenido!</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Información Personal</h3>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <span className="font-medium text-gray-600 w-32">Nombre:</span>
                                    <span className="text-gray-900">{user.names}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium text-gray-600 w-32">Email:</span>
                                    <span className="text-gray-900">{user.email}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium text-gray-600 w-32">DNI:</span>
                                    <span className="text-gray-900">{user.dni || 'No registrado'}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium text-gray-600 w-32">Teléfono:</span>
                                    <span className="text-gray-900">{user.phone || 'No registrado'}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium text-gray-600 w-32">Registrado:</span>
                                    <span className="text-gray-900">{formatDate(user.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Avatar</h3>
                            {user.avatar ? (
                                <img 
                                    src={user.avatar} 
                                    alt="Avatar" 
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">Sin avatar</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Estadísticas del sistema */}
                {userStats && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Estadísticas del Sistema</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{userStats.total_users}</div>
                                <div className="text-sm text-blue-800">Total Usuarios</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{userStats.google_users}</div>
                                <div className="text-sm text-green-800">Usuarios Google</div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">{userStats.facebook_users}</div>
                                <div className="text-sm text-purple-800">Usuarios Facebook</div>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">{userStats.users_with_dni}</div>
                                <div className="text-sm text-orange-800">Con DNI</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lista de todos los usuarios */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Todos los Usuarios Registrados ({allUsers.length})
                    </h3>
                    
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
                            <p className="mt-2 text-gray-600">Cargando usuarios...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usuario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contacto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Método
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Registro
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {allUsers.map((userItem) => (
                                        <tr key={userItem.id} className={userItem.id === user.id ? 'bg-blue-50' : ''}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {userItem.avatar ? (
                                                        <img 
                                                            src={userItem.avatar} 
                                                            alt="Avatar" 
                                                            className="w-8 h-8 rounded-full mr-3"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {userItem.names}
                                                            {userItem.id === user.id && (
                                                                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                                    Tú
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {userItem.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{userItem.email}</div>
                                                <div className="text-sm text-gray-500">
                                                    {userItem.phone && `📞 ${userItem.phone}`}
                                                    {userItem.dni && ` | 🆔 ${userItem.dni}`}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {userItem.google_id && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                                                            Google
                                                        </span>
                                                    )}
                                                    {userItem.facebook_id && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 ml-1">
                                                            Facebook
                                                        </span>
                                                    )}
                                                    {!userItem.google_id && !userItem.facebook_id && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                            Email
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(userItem.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};