import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

export default function ProductManagerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  type Product = { code: string; name: string; price: string };

  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState<{ text: string; type: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(true);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const showMessage = (text:string , type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    const existingProduct = products.find((p) => p.code === data);
    if (existingProduct) {
      setEditingProduct(existingProduct);
      setShowScanner(false);
      showMessage('Producto encontrado. Puedes modificarlo o eliminarlo.');
    } else {
      setEditingProduct({ code: data, name: '', price: '' });
      setShowScanner(false);
      showMessage('Código escaneado. Ingresa los detalles para agregar el producto.');
    }
  };

  const saveProduct = () => {
    if (!editingProduct || !editingProduct.name || !editingProduct.price) {
      showMessage('Por favor, ingresa el nombre y el precio.', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const isUpdate = products.some((p) => p.code === editingProduct.code);
      if (isUpdate) {
        setProducts((prevProducts) =>
          prevProducts.map((p) => (p.code === editingProduct.code ? editingProduct : p))
        );
        showMessage('Producto modificado con éxito.');
      } else {
        setProducts((prevProducts) => [...prevProducts, editingProduct]);
        showMessage('Producto agregado con éxito.');
      }
      setLoading(false);
      setEditingProduct(null);
      setShowScanner(true);
    });
  };

  const deleteProduct = () => {
    if (!editingProduct) {
      showMessage('No hay producto seleccionado para eliminar.', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setProducts((prevProducts) => prevProducts.filter((p) => p.code !== editingProduct.code));
      showMessage('Producto eliminado con éxito.');
      setLoading(false);
      setEditingProduct(null);
      setShowScanner(true);
    });
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Solicitando permiso de la cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Acceso a la cámara denegado. Por favor, habilite los permisos en la configuración de su dispositivo.</Text>
        <Button title="Solicitar permiso" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Messages */}
      {message && (
        <View style={[styles.messageContainer, message.type === 'error' && styles.error]}>
          <Text style={styles.messageText}>{message.text}</Text>
        </View>
      )}

      {/* Main UI */}
      {showScanner ? (
        <View style={styles.scannerContainer}>
          <Text style={styles.title}>Escanear Código de Barras</Text>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.camera}
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code39', 'code93', 'code128', 'pdf417'],
            }}
          />
          <Text style={styles.scannerText}>Apunta la cámara a un código de barras o QR</Text>
          {scanned && <Button title="Toca para escanear de nuevo" onPress={() => setScanned(false)} />}
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.title}>{editingProduct && editingProduct.name ? 'Modificar Producto' : 'Agregar Producto'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Código del Producto"
            value={editingProduct?.code}
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre del Producto"
            value={editingProduct?.name}
            onChangeText={(text) => setEditingProduct(editingProduct ? { code: editingProduct.code, price: editingProduct.price, name: text } : null)}
          />
          <TextInput
            style={styles.input}
            placeholder="Precio"
            keyboardType="numeric"
            value={editingProduct?.price}
            onChangeText={(text) => setEditingProduct(editingProduct ? { code: editingProduct.code, name: editingProduct.name, price: text } : null)}
          />
          <View style={styles.buttonGroup}>
            <Button title="Guardar" onPress={saveProduct} disabled={loading} />
            {editingProduct && products.some((p) => p.code === editingProduct.code) && (
              <Button title="Eliminar" color="red" onPress={deleteProduct} disabled={loading} />
            )}
            <Button title="Cancelar" onPress={() => { setEditingProduct(null); setShowScanner(true); }} disabled={loading} />
          </View>
        </View>
      )}

      {/* Loader */}
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.loaderText}>Procesando...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  permissionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },
  scannerText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  messageContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(46, 204, 113, 0.9)',
    zIndex: 10,
  },
  error: {
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
  },
  messageText: {
    color: 'white',
    textAlign: 'center',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: '#fff',
    marginTop: 10,
  },
});
