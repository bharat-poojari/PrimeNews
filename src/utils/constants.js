import { 
  FaNewspaper, 
  FaBriefcase, 
  FaLaptopCode, 
  FaFilm, 
  FaFutbol, 
  FaFlask, 
  FaHeartbeat,
  FaGlobeAsia
} from 'react-icons/fa';

export const CATEGORIES = [
  { id: "general", name: "General", icon: FaNewspaper, color: "blue" },
  { id: "india", name: "India", icon: FaGlobeAsia, color: "orange" },
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

export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/newsportal",
  facebook: "https://facebook.com/newsportal",
  instagram: "https://instagram.com/newsportal",
  linkedin: "https://linkedin.com/company/newsportal"
};