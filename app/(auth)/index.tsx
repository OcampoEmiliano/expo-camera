import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    if (username === 'test' && password === 'test') {
      await login('dummy-token');
      Alert.alert('Éxito', 'Inicio de sesión completado.');
      router.replace('./(main)');
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos.');
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
      ) : (
        <View style={styles.buttonGroup}>
          <Button title="Ingresar" onPress={handleLogin} />
          <View style={styles.spacer} />
          <Button 
            title="Ingresar con Rostro" 
            onPress={() => router.push('./(auth)/facialLogin')} 
            color="#2ecc71"
          />
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
        <Button 
          title="Registrarse" 
          onPress={() => router.push('./(auth)/registro')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  spinner: {
    marginTop: 10,
  },
  buttonGroup: {
    marginTop: 10,
  },
  spacer: {
    height: 10,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#555',
    marginBottom: 5,
  },
});