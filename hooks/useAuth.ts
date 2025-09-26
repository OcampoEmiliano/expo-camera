// hooks/useAuth.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
  const checkAuthStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      setIsAuthenticated(!!userToken);
    } catch (error) {
      console.error("Failed to load authentication status", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  checkAuthStatus();
}, []);

  return {
  isAuthenticated,
  loading,
    login: async (token: string) => {
    await AsyncStorage.setItem('userToken', token);
    setIsAuthenticated(true);
    },
    logout: async () => {
    await AsyncStorage.removeItem('userToken');
    setIsAuthenticated(false);
    }
  }
};