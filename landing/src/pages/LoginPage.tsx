import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from ".././lib/supabase/client";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

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
            window.location.href = "/";
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
  }, [location, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

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

      // Si la autenticación es exitosa y tenemos sesión
      
        // Verificar si el usuario existe y está activo en nuestra tabla users
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("is_active")
          .eq("email", email)
          .single();

        if (userError || userData?.is_active) {
          console.warn(
            "Tu cuenta no está activa. Por favor, verifica tu correo electrónico.",
            userError
          );

          // Si no encontramos el usuario en nuestra tabla, intentamos crearlo
          const { error: insertError } = await supabase.from("users").insert([
            {
              id: data.session.user.id,
              email: email,
              username: email.split("@")[0], // Usamos parte del email como username provisional

              role: "client",
              is_active: true,
            },
          ]);

          if (insertError) {
            throw new Error("No se pudo crear el perfil de usuario");
          }
        } else {
          // Si el usuario no está activo en nuestra base, lo activamos
          if (!userData.is_active) {
            await supabase
              .from("users")
              .update({ is_active: true })
              .eq("email", email);
          }
        }

        // Guardar el token para compartirlo entre aplicaciones
        /* localStorage.setItem("supabase_auth_token", data.session.access_token); */

        // Redirigir al dashboard del proyecto Administración
        window.location.href = "http://localhost:5174/";
      
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
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenido
            </h2>
            <p className="text-gray-600">Accede a tu panel de cliente</p>
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Recordarme
                </label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

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
