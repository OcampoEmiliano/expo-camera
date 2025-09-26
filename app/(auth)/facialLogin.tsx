import { recognizeUser } from '@/services/api';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function FacialLoginScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const takeAndLoginPhoto = async () => {

    if (!isCameraReady || isLoading || !cameraRef.current) {
      return;
    }

    setIsLoading(true);
    try {
      // Takes a picture with a specific quality setting.
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
      });

      const imageFile = {
        uri: photo.uri,
        name: `login_photo_${Date.now()}.jpg`,
        type: 'image/jpeg',
      } as unknown as Blob;

      const data = await recognizeUser(imageFile);

      if (data && data.success) {
        Alert.alert('Éxito', data.message || 'Ingreso exitoso por reconocimiento facial.');

        router.replace('/(main)/productManager');
      } else {
        Alert.alert('Error', data.message || 'Rostro no reconocido. Por favor, intente de nuevo.');
      }
    } catch (error) {
      console.error('Error al intentar login facial:', error);
      Alert.alert('Error', 'No se pudo conectar con el servicio de reconocimiento facial o hubo un problema.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Solicitando permiso de la cámara...</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Acceso a la cámara denegado. Por favor, habilite los permisos en la configuración de su dispositivo.</Text>
        <Button title="Solicitar permiso" onPress={requestPermission} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="front"
        onCameraReady={() => setIsCameraReady(true)}
      >
        {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.loaderText}>Reconociendo rostro...</Text>
        </View>
        )}
      </CameraView>
      <View style={styles.buttonContainer}>
        <Button
          title="Capturar y Entrar"
          onPress={takeAndLoginPhoto}
          disabled={!isCameraReady || isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  permissionText: {
    marginHorizontal: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loaderText: {
    color: '#0FF',
    marginTop: 10,
    fontSize: 16,
  },
  buttonContainer: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
  },
});
