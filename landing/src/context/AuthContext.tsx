import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { Session, User } from '@supabase/supabase-js';

// Definimos el tipo para nuestro contexto
interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Creamos el contexto con un valor por defecto
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  isAuthenticated: false,
  isAdmin: false,
});

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Función para obtener la sesión actual
    const getSession = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error al obtener la sesión:', error);
          return;
        }

        setSession(data.session);

        if (data.session?.user) {
          setUser(data.session.user || null);
          // Verificar si el usuario es administrador
          if (data.session.user.id) {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('role')
              .eq('id', data.session.user.id)
              .single();
              
            if (!userError && userData) {
              setIsAdmin(userData.role === 'admin');
            } else {
              console.error('Error al verificar rol de usuario:', userError);
              setIsAdmin(false);
            }
          }
        } else {
          setUser(null);
          setIsAdmin(false);
        }

        
        
      } catch (error) {
        console.error('Error inesperado al verificar la sesión:', error);
      } finally {
        setLoading(false);
      }
    };

    // Obtenemos la sesión inicial
    getSession();

    // Configuramos el listener para cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);

        if (session?.user) {
          setUser(session.user);
          
        }
        
        setLoading(false);
      }
    );

    // Limpiamos el listener cuando el componente se desmonte
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Función para cerrar sesión
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Valor que proporcionaremos en el contexto
  const value = {
    session,
    user,
    loading,
    signOut,
    isAuthenticated: !!session,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};