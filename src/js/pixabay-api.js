import axios from 'axios';

const API_KEY = '48826874-42260f613544ef710739f6c10';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page = 1, per_page = 40) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: per_page,
      },
    });

    console.log('API Response:', response.data); // Лог API для отладки
    return response.data;
  } catch (error) {
    console.error('Ошибка запроса:', error);
    throw error;
  }
}
