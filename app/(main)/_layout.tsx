// app/(main)/_layout.tsx

import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="productManager"
        options={{
          headerTitle: 'Gestión de Productos',
        }}
      />
      <Stack.Screen
        name="scanner"
        options={{
          headerTitle: 'escanear producto',
        }}
      />
      <Stack.Screen
        name="setProduct"
        options={{
          headerTitle: 'ingresar producto',
        }}
      />
    </Stack>
  );
}