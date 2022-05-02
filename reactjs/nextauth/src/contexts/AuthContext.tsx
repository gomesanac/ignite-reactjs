import { createContext, ReactNode, useState } from 'react';
import { setCookie } from 'nookies';
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
