import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function AddProductScreen() {
  const { code } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSave = () => {
    if (!name || !price) {
      Alert.alert('Campos incompletos', 'Por favor ingresa nombre y precio.');
      return;
    }

    // Aquí podrías guardar el producto en contexto, AsyncStorage o base de datos
    // Por ejemplo, usando router.push con parámetros:
    router.push({
      pathname: '/(main)/productManager',
      params: { code, name, price },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo Producto</Text>
      <Text style={styles.label}>Código escaneado:</Text>
      <Text style={styles.code}>{code}</Text>

      <Text style={styles.label}>Nombre del producto:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Precio:</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Button title="Guardar producto" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginTop: 10 },
  code: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
});