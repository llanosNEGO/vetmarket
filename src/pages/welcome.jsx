import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../services/api";

export const Welcome = () => {
    const [user, setUser] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [avatarError, setAvatarError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = localStorage.getItem('user');
            
            if (!userData) {
                navigate("/login");
                return;
            }

            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                
                try {
                    const response = await userService.getProfile();
                    if (response.data) {
                        setUser(response.data);
                        localStorage.setItem('user', JSON.stringify(response.data));
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const response = await userService.getAll();
                if (response.data && Array.isArray(response.data)) {
                    const users = response.data;
                    setAllUsers(users);

                    const stats = {
                        total_users: users.length,
                        google_users: users.filter(u => u.google_id).length,
                        facebook_users: users.filter(u => u.facebook_id).length,
                        users_with_dni: users.filter(u => u.dni).length,
                        users_with_avatar: users.filter(u => u.avatar).length
                    };
                    setUserStats(stats);
                }
            } catch (error) {
                console.error("Error loading user stats:", error);
            }
        };

        if (user) {
            loadStats();
        }
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate("/login");
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No disponible';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAvatarError = () => {
        setAvatarError(true);
    };

    const reloadAvatar = () => {
        setAvatarError(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando información del usuario...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/">
                        <div className="flex items-center space-x-4">
                            <img 
                                src="/images/logo_vetmarketpe.svg" 
                                alt="VetMarketPE" 
                                className="h-12 w-auto"
                            />
                            <h1 className="text-2xl font-bold text-gray-900">Panel de Usuario</h1>
                        </div>
                    </Link>
                   
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors font-medium"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">¡Bienvenido, {user.names}!</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Información Personal</h3>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <span className="font-medium text-gray-600 w-32">Nombre:</span>
                                    <span className="text-gray-900">{user.names || 'No disponible'}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium text-gray-600 w-32">Email:</span>
                                    <span className="text-gray-900">{user.email || 'No disponible'}</span>
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
                                    <span className="font-medium text-gray-600 w-32">Última actualización:</span>
                                    <span className="text-gray-900">{formatDate(user.updated_at)}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-700">Avatar</h3>
                                {avatarError && (
                                    <button
                                        onClick={reloadAvatar}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Reintentar
                                    </button>
                                )}
                            </div>
                            
                            {user.avatar && !avatarError ? (
                                <div className="flex flex-col items-center">
                                    <img 
                                        src={user.avatar} 
                                        alt="Avatar" 
                                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-sm"
                                        onError={handleAvatarError}
                                    />
                                    <p className="mt-2 text-sm text-green-600">
                                        ✓ Avatar cargado desde Google
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex flex-col items-center justify-center shadow-sm">
                                        {avatarError ? (
                                            <>
                                                <span className="text-gray-500 text-lg">⚠️</span>
                                                <span className="text-gray-500 text-xs mt-1">Error</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-gray-500 text-lg">👤</span>
                                                <span className="text-gray-500 text-xs mt-1">Sin avatar</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        {avatarError 
                                            ? 'No se pudo cargar la imagen' 
                                            : 'No hay avatar disponible'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {userStats && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Estadísticas del Sistema</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <div className="text-2xl font-bold text-blue-600">{userStats.total_users}</div>
                                <div className="text-sm text-blue-800">Total Usuarios</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <div className="text-2xl font-bold text-green-600">{userStats.google_users}</div>
                                <div className="text-sm text-green-800">Usuarios Google</div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                <div className="text-2xl font-bold text-purple-600">{userStats.facebook_users}</div>
                                <div className="text-sm text-purple-800">Usuarios Facebook</div>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                                <div className="text-2xl font-bold text-orange-600">{userStats.users_with_dni}</div>
                                <div className="text-sm text-orange-800">Con DNI</div>
                            </div>
                            <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                                <div className="text-2xl font-bold text-teal-600">{userStats.users_with_avatar}</div>
                                <div className="text-sm text-teal-800">Con Avatar</div>
                            </div>
                        </div>
                    </div>
                )}

                {allUsers.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">👥 Usuarios del Sistema</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Método
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Avatar
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {allUsers.slice(0, 10).map((userItem) => (
                                        <tr key={userItem.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {userItem.names}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                {userItem.email}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    userItem.google_id 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : userItem.facebook_id
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {userItem.google_id ? 'Google' : 
                                                     userItem.facebook_id ? 'Facebook' : 'Email'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {userItem.avatar ? (
                                                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-teal-100 text-teal-800 rounded-full">
                                                        ✓
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                                                        ✗
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(userItem.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {allUsers.length > 10 && (
                                <div className="mt-4 text-center text-sm text-gray-500">
                                    Mostrando 10 de {allUsers.length} usuarios
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <footer className="mt-8 py-4 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} VetMarketPE. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};