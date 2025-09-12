// hooks/useAuth.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for a saved user session or token on app startup
    const checkAuthStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Failed to load authentication status", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  return {
    isAuthenticated,
    // Add login and logout functions here
    login: async (token: string) => {
      await AsyncStorage.setItem('userToken', token);
      setIsAuthenticated(true);
    },
    logout: async () => {
      await AsyncStorage.removeItem('userToken');
      setIsAuthenticated(false);
    }
  };
}