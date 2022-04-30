import { createContext, ReactNode } from 'react';
import { api } from '../services/api';

type SignInCredentials = {
  email: string;
  password: string;
};

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const isAuthenticated = false;

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', { email, password });

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const providerValue = {
    signIn,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
}
