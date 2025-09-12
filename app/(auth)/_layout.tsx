import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      {/* This is where your authentication screens will be defined.
        The `index` file (login screen) is automatically included.
      */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // Hides the header for the login screen
        }}
      />
      <Stack.Screen
        name="facialLogin"
        options={{
          headerTitle: 'Login Facial',
        }}
      />
      <Stack.Screen
        name="facialRegistration"
        options={{
          headerTitle: 'Registrar Rostro',
        }}
      />
      <Stack.Screen
        name="registro"
        options={{
          headerTitle: 'Registro de Usuario',
        }}
      />
    </Stack>
  );
}