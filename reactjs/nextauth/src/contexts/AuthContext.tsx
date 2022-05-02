import { createContext, ReactNode, useEffect, useState } from 'react';
import { setCookie, parseCookies } from 'nookies';
import { useRouter } from 'next/router';

import { api } from '../services/api';

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

type SignInCredentials = {
  email: string;
  password: string;
};

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  user: User | undefined;
  isAuthenticated: boolean;
}

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();

  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();

    if (token) {
      api.get('/me').then(response => {
        const { email, permissions, roles } = response.data;

        setUser({
          email,
          permissions,
          roles,
        });
      })
    }

  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', { email, password });

      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, 'nextauth.token', token, {
        masAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/',
      });

      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        masAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/',
      });

      setUser({
        email,
        permissions,
        roles,
      });

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
  }

  const providerValue = {
    signIn,
    isAuthenticated,
    user,
  };

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
}
