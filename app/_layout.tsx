import { AuthProvider } from '@/context/AuthContext'; // Asegúrate de importar correctamente
import { useAuth } from '@/hooks/useAuth';
import { SplashScreen, Stack, router } from 'expo-router';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

function LayoutContent() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading || isAuthenticated === null) return;

    if (isAuthenticated) {
      router.replace('/(main)/productManager');
    } else {
      router.replace('/(auth)');
    }

    SplashScreen.hideAsync();
  }, [isAuthenticated, loading]);

  return (
    <Stack>
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
}