import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase/client";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();

  // Extraer returnUrl del estado si existe
  const returnUrl = location.state?.returnUrl || "/dashboard";
  const adminReturnUrl = "/admin";

  useEffect(() => {
    // Verificar si venimos de una redirección de confirmación de correo
    const handleEmailConfirmation = async () => {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const type = hashParams.get("type");

      if (type === "signup") {
        setSuccessMessage(
          "¡Tu correo electrónico ha sido verificado! Ahora puedes iniciar sesión."
        );
      }
    };

    // Verificar si hay una sesión activa al cargar
    const checkSession = async () => {
      try {
        console.log("Verificando sesión existente...");
        const { data } = await supabase.auth.getSession();

        if (data.session) {
          // Si hay sesión activa, verificamos si el usuario ya completó su registro en nuestra tabla
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.session.user.id)
            .single();

          console.log("Error al buscar usuario (si existe):", userError);

          if (userError) {
            console.warn(
              "No se pudo verificar el estado del usuario:",
              userError
            );
            return;
          }

          // Solo redirigimos si el usuario está activo en nuestra tabla
          if (userData && userData.is_active) {
            // Si el usuario es admin, redirigimos al panel de administración
            if (userData.role === "admin") {
              navigate(adminReturnUrl);
            } else {
              // Redirigir a la URL de retorno si existe, o al inicio para clientes
              navigate(returnUrl);
            }
          } else {
            // Si el usuario existe en Auth pero no está activo en nuestra tabla,
            // lo desconectamos para que complete el proceso normalmente
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error("Error al verificar sesión:", error);
      }
    };

    handleEmailConfirmation();
    checkSession();
  }, [location, navigate, returnUrl, adminReturnUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    console.log("Iniciando proceso de autenticación...");

    try {
      // Autenticar con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Correo no confirmado")) {
          throw new Error(
            "Necesitas verificar tu correo electrónico antes de iniciar sesión. Por favor, revisa tu bandeja de entrada."
          );
        }
        throw error;
      }

      console.log("Autenticación exitosa, verificando datos de usuario...");

      // Si la autenticación es exitosa y tenemos sesión
      if (data.session) {
        // Verificar si el usuario existe y está activo en nuestra tabla users
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        console.log("Resultado de verificación de usuario:", { userData, userError });

        if (userError) {
          console.warn(
            "Error al verificar usuario en la base de datos:",
            userError
          );

          // Si no encontramos el usuario en nuestra tabla, intentamos crearlo
          const { error: insertError } = await supabase.from("users").insert([
            {
              id: data.session.user.id,
              email: email,
              username: email.split("@")[0], // Usamos parte del email como username provisional
              role: isAdminLogin && email === "lopez.ayrton@gmail.com" ? "admin" : "client",
              is_active: true,
            },
          ]);

          if (insertError) {
            throw new Error("No se pudo crear el perfil de usuario");
          }
          console.log("Perfil de usuario creado exitosamente");
          
          // Verificamos el rol después de crear el usuario
          if (isAdminLogin && email === "lopez.ayrton@gmail.com") {
            console.log("Administrador autenticado, redirigiendo al panel admin");
            navigate(adminReturnUrl);
            return;
          }
        } else {
          // Si el usuario no está activo en nuestra base, lo activamos
          if (!userData.is_active) {
            await supabase
              .from("users")
              .update({ is_active: true })
              .eq("email", email);
          }
          
          // Verificar si es administrador
          if (userData.role === "admin") {
            console.log("Administrador autenticado, redirigiendo al panel admin");
            navigate(adminReturnUrl);
            return;
          }
        }
        
        console.log("Cliente autenticado, redirigiendo a:", returnUrl);
        // Redirigir a la URL de retorno para clientes
        navigate(returnUrl);
      }
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      setError(
        error.message ||
          "Error al iniciar sesión. Por favor, verifica tus credenciales."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    if (!email) {
      setError(
        "Por favor, ingresa tu correo electrónico para reenviar el enlace de verificación"
      );
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      setSuccessMessage(
        `Enlace de verificación reenviado a ${email}. Por favor revisa tu correo.`
      );
    } catch (error: any) {
      setError(error.message || "Error al reenviar el correo de verificación");
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminMode = () => {
    setIsAdminLogin(!isAdminLogin);
    setError(null);
    setSuccessMessage(null);
    
    // Pre-rellenar credenciales admin si activamos el modo admin
    if (!isAdminLogin) {
      setEmail("lopez.ayrton@gmail.com");
      setPassword("easyProcess*30106");
    } else {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="absolute top-4 left-4">
        <Link
          to="/"
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Volver al inicio</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-white rounded-2xl shadow-xl p-8 ${isAdminLogin ? 'border-2 border-purple-400' : ''}`}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isAdminLogin ? "Acceso Administrativo" : "Bienvenido"}
            </h2>
            <p className="text-gray-600">
              {isAdminLogin
                ? "Ingresa para administrar el sistema"
                : "Accede a tu panel de cliente"}
            </p>
          </div>
          
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleAdminMode}
              className={`flex items-center text-sm ${
                isAdminLogin ? "text-purple-700" : "text-gray-600"
              } hover:text-purple-800 transition-colors`}
            >
              <ShieldCheck className={`h-4 w-4 mr-1 ${isAdminLogin ? "text-purple-700" : "text-gray-500"}`} />
              {isAdminLogin ? "Cambiar a modo cliente" : "Acceso administrador"}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              <p>{error}</p>
              {error.includes("verificar tu correo") && (
                <button
                  onClick={handleResendVerificationEmail}
                  className="mt-2 text-blue-600 hover:text-blue-800 font-medium underline"
                  disabled={loading}
                >
                  Reenviar email de verificación
                </button>
              )}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    isAdminLogin ? "border-purple-300 focus:ring-purple-500 focus:border-purple-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } rounded-lg`}
                  placeholder="tu@email.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-2 border ${
                    isAdminLogin ? "border-purple-300 focus:ring-purple-500 focus:border-purple-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } rounded-lg`}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className={`h-4 w-4 ${
                    isAdminLogin ? "text-purple-600 focus:ring-purple-500" : "text-blue-600 focus:ring-blue-500"
                  } border-gray-300 rounded`}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Recordarme
                </label>
              </div>
              {!isAdminLogin && (
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              )}
            </div>

            <button
              type="submit"
              className={`w-full ${
                isAdminLogin
                  ? "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              } text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300`}
              disabled={loading}
            >
              {loading 
                ? "Iniciando sesión..." 
                : isAdminLogin 
                  ? "Acceder como Administrador" 
                  : "Iniciar Sesión"}
            </button>
          </form>

          {!isAdminLogin && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿Necesitas ayuda?{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Contáctanos
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;