import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { authService } from "../services/api";
import { useAuth } from "../context/AuthContext.jsx";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { user, login: setAuthenticatedUser } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const googleLogin = useGoogleLogin({
        scope: "openid profile email",
        onSuccess: async (tokenResponse) => {
            try {
                const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });

                if (!userInfoResponse.ok) {
                    throw new Error("No se pudo obtener la información del perfil de Google");
                }

                const profile = await userInfoResponse.json();
                let userData = {
                    id: profile.sub,
                    names: profile.name,
                    email: profile.email,
                    avatar: profile.picture,
                    provider: "google",
                };

                try {
                    const response = await authService.loginWithGoogle(tokenResponse.access_token, profile);
                    if (response?.data?.success && response?.data?.user) {
                        userData = response.data.user;
                    }
                } catch (apiError) {
                    console.warn("Endpoint /auth/google no disponible, usando datos de Google", apiError);
                }

                setAuthenticatedUser(userData);
                navigate("/");
            } catch (err) {
                setError("No se pudo iniciar sesión con Google");
            } finally {
                setIsLoading(false);
            }
        },
        onError: (errorResponse) => {
            setError("No se pudo iniciar sesión con Google");
            setIsLoading(false);
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await authService.login(email, password);
            
            if (response.data.success) {
                setAuthenticatedUser(response.data.user);
                navigate("/");
            }
        } catch (err) {
            console.error("Error en login:", err);
            setError(err.response?.data?.error || "Error de conexión con el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setError("");
        setIsLoading(true);

        try {
            googleLogin();
        } catch (err) {
            console.error("Error iniciando Google OAuth:", err);
            setError("No se pudo iniciar sesión con Google");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Link to="/">
                        <img 
                            src="/images/logo_vetmarketpe.svg" 
                            alt="VetMarketPE" 
                            className="h-16 w-auto"
                        />
                    </Link>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Iniciar sesión
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continuar con Google
                        </button>

                    </div>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">O ingresa con tu correo</span>
                            </div>
                        </div>
                    </div>

                    <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                Correo electrónico
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    className="appearance-none block text-black bg-gray-200 w-full px-3 py-2 border border-gray-200 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm disabled:opacity-50"
                                    placeholder="correo@gmail.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="appearance-none block w-full text-black bg-gray-200 px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm disabled:opacity-50"
                                    placeholder="Tu contraseña"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    disabled={isLoading}
                                    className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] border-gray-300 rounded disabled:opacity-50"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Recordarme
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-[var(--primary)] hover:text-[var(--primary-dark)]">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Iniciando sesión...
                                    </div>
                                ) : (
                                    "Iniciar sesión"
                                )}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};
