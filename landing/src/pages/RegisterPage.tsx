import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from ".././lib/supabase/client"; 

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  /* const navigate = useNavigate(); */

  // Función para verificar si el nombre de usuario ya existe
  const checkUsernameExists = async (username: string) => {
    try {
      const { data, error, count } = await supabase
        .from("users")
        .select("*", { count: "exact" })
        .eq("username", username);
      
      if (error) {
        console.error("Error al verificar el nombre de usuario:", error);
        throw error;
      }
      
      return count !== null && count > 0;
    } catch (err) {
      console.error("Excepción al verificar username:", err);
      throw err;
    }
  };

  // Función para verificar si el email ya existe
  const checkEmailExists = async (email: string) => {
    try {
      const { data, error, count } = await supabase
        .from("users")
        .select("*", { count: "exact" })
        .eq("email", email);
      
      if (error) {
        console.error("Error al verificar el email:", error);
        throw error;
      }
      
      return count !== null && count > 0;
    } catch (err) {
      console.error("Excepción al verificar email:", err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // 1. Verificar si el nombre de usuario ya existe
      const usernameExists = await checkUsernameExists(name);
      
      if (usernameExists) {
        setError("El nombre de usuario ya existe, intente con otro");
        setLoading(false);
        return;
      }

      // 2. Verificar si el email ya existe
      const emailExists = await checkEmailExists(email);
      
      if (emailExists) {
        setError("Este correo electrónico ya está registrado");
        setLoading(false);
        return;
      }

      // 3. Registrar usuario en Supabase Auth con confirmación de correo electrónico
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: name,
          },
          // Asegurarnos de que se requiere confirmación por correo
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (authError) throw authError;

      // 4. Añadir información adicional a la tabla users
      if (authData.user) {
        console.log("Usuario creado en Auth, ID:", authData.user.id);
        
        const { error: userError } = await supabase
          .from("users")
          .insert([
            {
              id: authData.user.id,
              email: email,
              username: name,
              
              role: 'client',
              is_active: false,
            },
          ]);

        if (userError) {
          console.error("Error al crear perfil de usuario:", userError);
          throw userError;
        }

        // 5. Mostrar mensaje de éxito
        setSuccessMessage(
          `¡Registro iniciado con éxito! Por favor, revisa el correo ${email} para verificar tu cuenta. Luego podrás iniciar sesión.`
        );
        
        // Limpiamos el formulario
        setName('');
        setEmail('');
        setPassword('');
      } else {
        throw new Error("No se pudo crear la cuenta de usuario");
      }
    } catch (error: any) {
      console.error("Error en el registro:", error);
      setError(error.message || "Error al registrar usuario.");
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
              Crear cuenta
            </h2>
            <p className="text-gray-600">Regístrate para acceder a tu panel de cliente</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
              {successMessage}
              <div className="mt-3">
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  Ir a la página de inicio de sesión
                </Link>
              </div>
            </div>
          )}

          {!successMessage && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tu nombre de usuario"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

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
                    minLength={6}
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
                <p className="mt-1 text-xs text-gray-500">
                  La contraseña debe tener al menos 6 caracteres
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrarse"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;