import axios from 'axios';

const API_URL = "https://soccer-news-nu.vercel.app/api/fetch-news";

// Fetch all soccer news articles
export const fetchNews = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};
