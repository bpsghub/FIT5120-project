
import axios from 'axios';

// Create basic API configuration
const apiClient = axios.create({
  // baseURL: 'http://localhost:5566/api',
  baseURL: 'http://54.252.184.10:5566/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});


export const englishService = {
  /**
   *
   * @returns {Promise}
   */
  getPhrases: async () => {
    try {
      const response = await apiClient.get('/phrases');
      return response;
    } catch (error) {
      console.error('Error fetching phrases:', error);
      throw error;
    }
  },

  getPhrasesByCategory: async (category) => {
    try {
      const response = await apiClient.get(`/phrases?category=${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${category} phrases:`, error);
      throw error;
    }
  }
};

