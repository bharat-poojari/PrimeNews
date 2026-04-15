import { 
  FaNewspaper, 
  FaBriefcase, 
  FaLaptopCode, 
  FaFilm, 
  FaFutbol, 
  FaFlask, 
  FaHeartbeat 
} from 'react-icons/fa';

export const CATEGORIES = [
  { id: "general", name: "General", icon: FaNewspaper, color: "blue" },
  { id: "business", name: "Business", icon: FaBriefcase, color: "green" },
  { id: "technology", name: "Technology", icon: FaLaptopCode, color: "purple" },
  { id: "entertainment", name: "Entertainment", icon: FaFilm, color: "pink" },
  { id: "sports", name: "Sports", icon: FaFutbol, color: "orange" },
  { id: "science", name: "Science", icon: FaFlask, color: "teal" },
  { id: "health", name: "Health", icon: FaHeartbeat, color: "red" }
];

export const COUNTRIES = [
  { code: "in", name: "India" },
  { code: "us", name: "USA" },
  { code: "gb", name: "UK" },
  { code: "au", name: "Australia" },
  { code: "ca", name: "Canada" }
];

export const PAGE_SIZES = [10, 20, 30, 50];
export const DEFAULT_IMAGE = "https://via.placeholder.com/400x300?text=News+Image";

export const API_CONFIG = {
  NEWS_API: {
    BASE_URL: "https://newsapi.org/v2",
    TIMEOUT: 10000,
    CACHE_DURATION: 300,
    API_KEY: import.meta.env.VITE_NEWS_API_KEY
  },
  GNEWS: {
    BASE_URL: "https://gnews.io/api/v4",
    API_KEY: import.meta.env.VITE_GNEWS_API_KEY
  },
  MEDIASTACK: {
    BASE_URL: "http://api.mediastack.com/v1",
    API_KEY: import.meta.env.VITE_MEDIASTACK_API_KEY
  }
};

export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/newsportal",
  facebook: "https://facebook.com/newsportal",
  instagram: "https://instagram.com/newsportal",
  linkedin: "https://linkedin.com/company/newsportal"
};