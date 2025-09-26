// app/(auth)/register.tsx

import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function RegisterScreen() {
  const [cuil, setCuil] = useState('');

  const handleRegister = () => {
    if (!cuil) {
      Alert.alert('Error', 'Por favor, ingrese un CUIL.');
      return;
    }
    
    router.push({
      pathname: '/(auth)/facialRegistration',
      params: { cuil: cuil }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su CUIL"
        value={cuil}
        onChangeText={setCuil}
        keyboardType="numeric"
      />
      
      <Button
        title="Continuar al Registro Facial"
        onPress={handleRegister}
        color="#2ecc71"
      />
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
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
});