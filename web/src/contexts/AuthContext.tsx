import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/auth.types';
import { ApiService } from '../services/api.service';
import { cookieUtils } from '../utils/cookies';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Cargar token y usuario de las cookies al iniciar
    const savedToken = cookieUtils.get('token');
    const savedUser = cookieUtils.get('user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(decodeURIComponent(savedUser)));
      } catch (error) {
        console.error('Error al parsear usuario de cookies:', error);
        cookieUtils.clearAuth();
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await ApiService.login(email, password);
      const { user, token } = response;
      
      console.log('✅ Login exitoso:', user);
      
      setUser(user);
      setToken(token.accessToken);
      
      // Guardar en cookies (expiran en 7 días)
      cookieUtils.set('user', encodeURIComponent(JSON.stringify(user)), 7);
      cookieUtils.set('token', token.accessToken, 7);
      cookieUtils.set('refreshToken', token.refreshToken, 7);
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const register = async (userName: string, email: string, password: string) => {
    try {
      const user = await ApiService.register(userName, email, password);
      
      // Después del registro exitoso, hacer login automáticamente
      await login(email, password);
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    cookieUtils.clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
