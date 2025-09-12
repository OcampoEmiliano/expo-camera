// services/api.ts (o api.js)

const API_BASE_URL = 'https://ixk9cqrvwl5t.share.zrok.io'; // Tu URL base de la API

interface ApiResponse {
  success: boolean;
  message: string;
  // Puedes agregar otros campos si la API los devuelve, como 'userId'
}

export const registerUser = async (cuil: string, imageFile: Blob): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('cuil', cuil);
  formData.append('image', imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'skip_zrok_interstitial': 'true',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || `Error del servidor: ${response.status}` };
    }

    return await response.json();
  } catch (error) {
    console.error("Error en registerUser:", error);
    return { success: false, message: 'Problema de conexión o red.' };
  }
};

export const recognizeUser = async (imageFile: Blob): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/recognize`, {
      method: 'POST',
      headers: {
        'skip_zrok_interstitial': 'true',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || `Error del servidor: ${response.status}` };
    }

    return await response.json();
  } catch (error) {
    console.error("Error en recognizeUser:", error);
    return { success: false, message: 'Problema de conexión o red.' };
  }
};