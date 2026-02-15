
import { TMDBResponse } from '../types';

const API_KEY = 'fb7bb23f03b6994dafc674c074d01761';
const BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query: string): Promise<TMDBResponse> => {
  if (!query) return { page: 1, results: [], total_pages: 0, total_results: 0 };
  
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  
  return response.json();
};

export const getPopularMovies = async (page = 1): Promise<TMDBResponse> => {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch popular movies');
  }
  return response.json();
};

export const getImageUrl = (path: string, size: 'w500' | 'w1920' | 'original' = 'original') => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const downloadImage = async (imageUrl: string, fileName: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback if fetch fails (due to CORS or other issues)
    window.open(imageUrl, '_blank');
  }
};
