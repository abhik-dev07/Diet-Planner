import axios from "axios";

const SERVER_URL = "http://10.0.2.2:8080/api";

const callAiBackend = async (route, prompt) => {
  try {
    const response = await axios.post(`${SERVER_URL}${route}`, { prompt });
    return response.data;
  } catch (error) {
    console.error(`Error calling ${route}:`, error);
    throw error;
  }
};

export const GenerateRecipe = async (prompt) => {
  const data = await callAiBackend("/recipe", prompt);
  return data.result;
};

export const GenerateRecipeImage = async (prompt) => {
  try {
    const data = await callAiBackend("/image", prompt);
    return data.image;
  } catch (error) {
    console.error("Error generating image via backend:", error);
    return null;
  }
};
