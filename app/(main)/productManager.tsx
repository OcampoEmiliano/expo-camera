import { router } from 'expo-router';
import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

type Product = { code: string; name: string; price: string };

export default function ProductManagerScreen() {
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestor de Productos</Text>
      <Button title="Escanear Código" onPress={() => router.push('/+not-found')} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text>{item.name} - ${item.price}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No hay productos aún.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  productItem: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
});