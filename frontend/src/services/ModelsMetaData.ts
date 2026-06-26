// frontend/src/services/ModelsMetaData.ts

const API_BASE_URL = "http://127.0.0.1:5000/api/v1"; // Ensure this matches your backend port

export async function getModels() {
  const response = await fetch(`${API_BASE_URL}/modelsdata`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch models");
  }

  // response.json() will return an object with a 'models' array
  // matching your ModelsMetaData interface
  return response.json();
}