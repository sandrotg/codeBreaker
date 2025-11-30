import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/auth.types';
import { ApiService } from '../services/api.service';

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
    // Cargar token y usuario del localStorage al iniciar
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await ApiService.login(email, password);
      const { user, token } = response;
      
      console.log('✅ Login exitoso:', user);
      
      setUser(user);
      setToken(token.accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token.accessToken);
      localStorage.setItem('refreshToken', token.refreshToken);
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
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
