import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

const QRScanner: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);

  useEffect(() => {
    if (!permission || permission.status !== 'granted') {
      requestPermission();
    }
  }, [permission]);

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (result?.data) {
      setScannedData(result.data);
      Alert.alert('Código escaneado', `Contenido: ${result.data}`);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.centered}>
        <Text>Necesitamos permiso para usar la cámara</Text>
        <Button title="Dar permiso" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'code128'],
        }}
        onBarcodeScanned={handleBarcodeScanned}
      />
      {scannedData && (
        <View style={styles.overlay}>
          <Text style={styles.resultText}>Último código: {scannedData}</Text>
        </View>
      )}
    </View>
  );
};

export default QRScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#ffffffcc',
    padding: 10,
    borderRadius: 8,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
});