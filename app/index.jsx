import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function FaceLoginApp() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [registeredFace, setRegisteredFace] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted' && mediaStatus === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.takePictureAsync({
          quality: 0.7,
          base64: false,
          skipProcessing: true,
        });
        
        setCapturedImage(photo.uri);
        
        // Simular proceso de reconocimiento facial
        setTimeout(() => {
          simulateFaceRecognition(photo.uri);
        }, 1500);
        
      } catch (error) {
        Alert.alert('Error', 'No se pudo capturar la imagen');
        setIsCapturing(false);
      }
    }
  };

  const simulateFaceRecognition = (imageUri) => {
    // Simulación simple: si no hay cara registrada, la registramos
    // Si ya hay una cara registrada, simulamos el reconocimiento
    
    if (!registeredFace) {
      // Primera vez: registrar cara
      setRegisteredFace(imageUri);
      setIsCapturing(false);
      setCapturedImage(null);
      Alert.alert(
        'Rostro Registrado',
        'Tu rostro ha sido registrado exitosamente. Ahora puedes intentar hacer login.',
        [{ text: 'OK' }]
      );
    } else {
      // Simular reconocimiento (éxito aleatorio del 80%)
      const isRecognized = Math.random() > 0.2;
      
      if (isRecognized) {
        setIsLoggedIn(true);
        Alert.alert(
          'Login Exitoso',
          'Rostro reconocido. ¡Bienvenido!',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Login Fallido',
          'Rostro no reconocido. Inténtalo de nuevo.',
          [{ text: 'OK' }]
        );
      }
      
      setIsCapturing(false);
      setCapturedImage(null);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCapturedImage(null);
  };

  const resetApp = () => {
    setIsLoggedIn(false);
    setRegisteredFace(null);
    setCapturedImage(null);
    setIsCapturing(false);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>Solicitando permisos de cámara...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>
          Sin acceso a la cámara. Por favor, habilita los permisos en la configuración.
        </Text>
      </SafeAreaView>
    );
  }

  if (isLoggedIn) {
    return (
      <SafeAreaView style={styles.loggedInContainer}>
        <StatusBar barStyle="light-content" />
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
          <Text style={styles.welcomeSubtitle}>
            Has iniciado sesión exitosamente con reconocimiento facial
          </Text>
          
          {registeredFace && (
            <View style={styles.profileContainer}>
              <Image source={{ uri: registeredFace }} style={styles.profileImage} />
              <Text style={styles.profileText}>Tu rostro registrado</Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resetButton} onPress={resetApp}>
            <Text style={styles.resetButtonText}>Resetear App</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Login Facial</Text>
        <Text style={styles.subtitle}>
          {!registeredFace 
            ? 'Primero registra tu rostro' 
            : 'Coloca tu rostro frente a la cámara'
          }
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.front}
          ref={(ref) => setCameraRef(ref)}
        >
          <View style={styles.cameraOverlay}>
            {isCapturing && (
              <View style={styles.processingContainer}>
                <Text style={styles.processingText}>
                  {!registeredFace ? 'Registrando rostro...' : 'Verificando identidad...'}
                </Text>
              </View>
            )}
            
            {capturedImage && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: capturedImage }} style={styles.previewImage} />
              </View>
            )}
          </View>
        </Camera>
        
        {/* Marco para guiar al usuario */}
        <View style={styles.faceFrame} />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
          onPress={takePicture}
          disabled={isCapturing}
        >
          <Text style={styles.captureButtonText}>
            {isCapturing 
              ? 'Procesando...' 
              : !registeredFace 
                ? 'Registrar Rostro' 
                : 'Iniciar Sesión'
            }
          </Text>
        </TouchableOpacity>
        
        {registeredFace && (
          <TouchableOpacity style={styles.resetButton} onPress={resetApp}>
            <Text style={styles.resetButtonText}>Resetear</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  message: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    color: '#fff',
    paddingHorizontal: 20,
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceFrame: {
    position: 'absolute',
    top: '25%',
    left: '20%',
    width: '60%',
    height: '50%',
    borderWidth: 3,
    borderColor: '#00ff88',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  processingContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  processingText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  previewContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#00ff88',
  },
  controls: {
    padding: 20,
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  captureButtonDisabled: {
    backgroundColor: '#555',
  },
  captureButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loggedInContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 40,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#00ff88',
    marginBottom: 15,
  },
  profileText: {
    color: '#ccc',
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  logoutButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});