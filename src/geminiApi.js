import axios from 'axios';
import { GEMINI_API_KEY, GEMINI_API_BASE_URL } from '@env';

export const generateContent = async (query) => {
  try {
    const response = await axios.post(
      `${GEMINI_API_BASE_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: query }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};
