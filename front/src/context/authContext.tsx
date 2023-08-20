import React, { createContext, useContext, useState } from 'react'; // Importe ReactNode
import {AuthContextType} from './types';
import { User } from "../interfaces/IUser";

const AuthContext = createContext<AuthContextType | undefined>({} as AuthContextType);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedValue = localStorage.getItem('isLoggedIn');
    return storedValue === 'true';
  });

  const [user, setUser] = useState<User | undefined>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) as User : undefined;
  });

  function setLoggedUser(newUser: User) {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user, setLoggedUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log('useAuth', context)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
