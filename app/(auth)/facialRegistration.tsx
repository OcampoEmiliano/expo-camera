import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';

export default function FacialRegistrationScreen() {
  const { cuil } = useLocalSearchParams();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Solicitamos el permiso de la cámara al cargar el componente
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Manejamos los mensajes en pantalla
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000); // El mensaje desaparece después de 3 segundos
      return () => clearTimeout(timer);
    }
  }, [message]);

  const showMessage = (text: string) => {
    setMessage(text);
  };

  const takeAndRegisterPhoto = async () => {
    if (!isCameraReady || isLoading || !cameraRef.current) {
      return;
    }

    if (!cuil) {
      showMessage('Error: No se encontró un CUIL para el registro.');
      return;
    }

    setIsLoading(true);
    showMessage('Registrando rostro...');

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, base64: false });
      const cuilValue = Array.isArray(cuil) ? cuil[0] : cuil;

      // Creamos un objeto FormData para enviar la imagen y el CUIL
      const formData = new FormData();
      formData.append('cuil', cuilValue);
      // Fetch the image as a Blob and append it to FormData
      const imageResponse = await fetch(photo.uri);
      const imageBlob = await imageResponse.blob();
      formData.append('image', imageBlob, `${cuilValue}_photo.jpg`);

      // Llamada directa a la API para asegurar que se envíe el FormData
      const response = await fetch('https://u5hvywfa7s4g.share.zrok.io/register', {
        method: 'POST',
        headers: {
          'skip_zrok_interstitial': 'true',
        },
        body: formData,
      });

      const data = await response.json();

      if (data && data.success) {
        showMessage(data.message || 'Registro facial completado con éxito.');
        setTimeout(() => router.back(), 1500); // Volvemos después de un breve retraso
      } else {
        showMessage(data.message || 'El registro facial falló. Por favor, intente de nuevo.');
      }
    } catch (error) {
      console.error('Error al intentar registro facial:', error);
      showMessage('Error: No se pudo conectar con el servicio o hubo un problema.');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizado condicional basado en los permisos de la cámara
  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Solicitando permiso de la cámara...</Text>
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

  // Interfaz de usuario principal
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
        onCameraReady={() => setIsCameraReady(true)}
      >
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        )}
        {message && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        )}
      </CameraView>
      <View style={styles.buttonContainer}>
        <Button
          title="Capturar y Registrar"
          onPress={takeAndRegisterPhoto}
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    position: 'absolute',
    top: 50,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  messageText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
  },
});