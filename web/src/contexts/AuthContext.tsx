import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/auth.types';
import { ApiService } from '../services/api.service';
import { cookieUtils } from '../utils/cookies';
import { setupFetchInterceptor } from '../utils/fetchInterceptor';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuthToken: () => Promise<boolean>;
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

    // Setup fetch interceptor for automatic token refresh
    setupFetchInterceptor({
      onRefreshToken: async () => {
        const savedRefreshToken = cookieUtils.get('refreshToken');
        
        if (!savedRefreshToken) {
          return false;
        }

        try {
          const response = await ApiService.refreshToken(savedRefreshToken);
          const { user: newUser, token: newToken } = response;
          
          setUser(newUser);
          setToken(newToken.accessToken);
          
          cookieUtils.set('user', encodeURIComponent(JSON.stringify(newUser)), 7);
          cookieUtils.set('token', newToken.accessToken, 7);
          cookieUtils.set('refreshToken', newToken.refreshToken, 7);
          
          return true;
        } catch (error) {
          console.error('Token refresh failed:', error);
          setUser(null);
          setToken(null);
          cookieUtils.clearAuth();
          return false;
        }
      }
    });
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
      await ApiService.register(userName, email, password);
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

  const refreshAuthToken = async (): Promise<boolean> => {
    try {
      const savedRefreshToken = cookieUtils.get('refreshToken');
      
      if (!savedRefreshToken) {
        console.log('❌ No refresh token available');
        logout();
        return false;
      }

      console.log('🔄 Refreshing access token...');
      const response = await ApiService.refreshToken(savedRefreshToken);
      const { user: newUser, token: newToken } = response;
      
      setUser(newUser);
      setToken(newToken.accessToken);
      
      // Update cookies
      cookieUtils.set('user', encodeURIComponent(JSON.stringify(newUser)), 7);
      cookieUtils.set('token', newToken.accessToken, 7);
      cookieUtils.set('refreshToken', newToken.refreshToken, 7);
      
      console.log('✅ Token refreshed successfully');
      return true;
    } catch (error) {
      console.error('❌ Error refreshing token:', error);
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        refreshAuthToken,
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
