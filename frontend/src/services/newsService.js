import axios from 'axios';

const API_URL = "https://soccer-news-theta.vercel.app/api/fetch-news"; // Adjusted for relative path in production

// Fetch all soccer news articles

export const fetchNews = async () => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        NEWS_API_KEY: '9e74d699e93a4338a08590abe195e55e', // Add the key as a parameter
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};