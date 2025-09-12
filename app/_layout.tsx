import { useAuth } from '@/hooks/useAuth';
import { SplashScreen, Stack, router } from 'expo-router';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated === null) {
      return;
    }

    if (isAuthenticated) {
      // Corrected: Redirect to the main app group, e.g., '/(main)'
      router.replace('/(main)');
    } else {
      // Corrected: Redirect to the authentication group, which you have
      router.replace('/(auth)');
    }

    SplashScreen.hideAsync();

  }, [isAuthenticated]);

  return (
    <Stack>
      {/* This screen name must match your main app content folder name */}
      <Stack.Screen name="(main)" options={{ headerShown: false }} /> 
      {/* This screen name must match your auth folder name */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}