import users from "../Models/User"

require('dotenv').config();

export const updateUserRecommendations = async (userId: string): Promise<void> => {
  try {

    const baseUrl = process.env.RECOMMENDATION_SERVICE_URL;
    
    if (!baseUrl) {
      throw new Error("La variable RECOMMENDATION_SERVICE_URL no está definida en el .env");
    }

    const response = await fetch(`${baseUrl}/recommendations/${userId}`, {
      headers: {
        'User-Agent': 'PostmanRuntime/7.39.1',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`Error del microservicio: ${response.status}`);
    }

    const recommendations = await response.json();

    await users.findByIdAndUpdate(userId, { recommendations });

  } catch (error) {
    console.error(`❌ Error actualizando recomendaciones para ${userId}:`, error);
  }
};