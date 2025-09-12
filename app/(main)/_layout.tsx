// app/(main)/_layout.tsx

import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack>
      {/* La pantalla "productManager" será la primera en mostrarse 
        dentro de este grupo. Si usas pestañas, aquí podrías 
        definir un `Tabs` en lugar de un `Stack`.
      */}
      <Stack.Screen
        name="productManager"
        options={{
          headerTitle: 'Gestión de Productos',
        }}
      />
      {/* Agrega otras pantallas aquí */}
      <Stack.Screen
        name="other-screen"
        options={{
          headerTitle: 'Otra Pantalla',
        }}
      />
    </Stack>
  );
}