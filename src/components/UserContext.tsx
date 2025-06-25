import { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  name: string;
  email: string;
  type: 'customer' | 'vendor';
  [key: string]: any;
}

export const UserContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  userType: 'customer' | 'vendor' | null;
  setUserType: (type: 'customer' | 'vendor' | null) => void;
}>(
  {
    user: null,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setUser: () => {},
    userType: null,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setUserType: () => {},
  }
);

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [userType, setUserTypeState] = useState<'customer' | 'vendor' | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    if (storedUser) setUserState(JSON.parse(storedUser));
    if (storedUserType) setUserTypeState(storedUserType as 'customer' | 'vendor');
  }, []);

  // Save to localStorage on change
  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  };
  const setUserType = (type: 'customer' | 'vendor' | null) => {
    setUserTypeState(type);
    if (type) {
      localStorage.setItem('userType', type);
    } else {
      localStorage.removeItem('userType');
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, userType, setUserType }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); 