# 📰 PrimeNews - Modern Real-time News Portal

[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-38bdf8.svg)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-4.4.7-764abc.svg)](https://zustand-demo.pmnd.rs/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

![PrimeNews Banner](https://via.placeholder.com/1200x400/3b82f6/ffffff?text=PrimeNews+-+Your+Trusted+News+Source)

## 🌟 Live Demo

**Coming Soon!** 

## 📱 Project Overview

PrimeNews is a modern, feature-rich news portal built with React and Vite that delivers real-time news from multiple sources. The application provides a seamless reading experience with dark mode support, bookmarking capabilities, video news integration, and personalized content filtering.

### ✨ Key Features

- **🏠 Home Page** - Dynamic news feed with category filtering
- **📰 Breaking News Ticker** - Real-time scrolling news alerts
- **🔍 Advanced Search** - Search news with recent search history
- **📑 Category Filtering** - Browse news by Technology, Business, Sports, Entertainment, Science, Health
- **🔖 Bookmark System** - Save articles for later reading (persistent storage)
- **🎥 Video News** - YouTube integration for video news content
- **📊 Trending Stories** - Popular news based on user engagement
- **🌙 Dark Mode** - Eye-friendly dark theme with persistent preference
- **📱 Fully Responsive** - Optimized for all devices (mobile, tablet, desktop)
- **⚡ Infinite Scroll** - Seamless loading of more content
- **🔗 Social Sharing** - Share articles on Facebook, Twitter, WhatsApp, LinkedIn
- **📈 Analytics** - Track article views, category preferences, and search history

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with hooks and functional components
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router DOM v6** - Client-side routing
- **Zustand** - State management with persistence
- **Axios** - HTTP client for API requests
- **React Helmet Async** - SEO optimization

### Libraries & Utilities
- **date-fns** - Date formatting and manipulation
- **react-hot-toast** - Toast notifications
- **react-icons** - Icon library
- **react-intersection-observer** - Infinite scroll implementation
- **react-lazy-load-image-component** - Lazy loading images
- **react-share** - Social sharing buttons

### APIs Used
- **NewsAPI.org** - Primary news source
- **GNews API** - Backup news API
- **MediaStack API** - Secondary backup API
- **YouTube API** - Video news content

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Step 1: Clone the repository
```bash
git clone https://github.com/bharat-poojari/PrimeNews.git
cd PrimeNews
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Set up environment variables
Create a `.env` file in the root directory:
```env
VITE_NEWS_API_KEY=your_newsapi_key_here
VITE_GNEWS_API_KEY=your_gnews_api_key_here
VITE_MEDIASTACK_API_KEY=your_mediastack_key_here
VITE_APP_NAME="PrimeNews"
VITE_APP_VERSION="1.0.0"
```

### Step 4: Get API Keys
1. **NewsAPI**: Register at [https://newsapi.org/](https://newsapi.org/)
2. **GNews API**: Register at [https://gnews.io/](https://gnews.io/)
3. **MediaStack**: Register at [https://mediastack.com/](https://mediastack.com/)

### Step 5: Run development server
```bash
npm run dev
```

### Step 6: Build for production
```bash
npm run build
```

### Step 7: Preview production build
```bash
npm run preview
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add all keys from your `.env` file

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Drag and drop the `dist` folder to Netlify

3. Add environment variables in Netlify dashboard

## 📁 Project Structure

```
PrimeNews/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── BookmarkButton.jsx
│   │   │   ├── CategoryTabs.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── LoaderSkeleton.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── layout/
│   │   │   ├── BreakingTicker.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   ├── news/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── NewsCard.jsx
│   │   │   └── NewsGrid.jsx
│   │   └── video/
│   │       └── VideoCard.jsx
│   ├── hooks/
│   │   ├── useClickOutside.js
│   │   ├── useDebounce.js
│   │   ├── useInfiniteScroll.js
│   │   ├── useLocalStorage.js
│   │   └── useMediaQuery.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CategoryPage.jsx
│   │   ├── ArticlePage.jsx
│   │   ├── SearchPage.jsx
│   │   ├── TrendingPage.jsx
│   │   ├── VideoPage.jsx
│   │   ├── BookmarksPage.jsx
│   │   └── ContactPage.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── apiStatus.js
│   │   └── cache.js
│   ├── store/
│   │   ├── analyticsStore.js
│   │   ├── bookmarkStore.js
│   │   ├── newsStore.js
│   │   ├── preferencesStore.js
│   │   └── themeStore.js
│   ├── utils/
│   │   └── constants.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎯 Features in Detail

### 1. Real-time News Feed
- Fetches latest news from multiple APIs
- Fallback mechanism if primary API fails
- Caching system for improved performance

### 2. Smart Search
- Debounced search input
- Recent search history
- Autocomplete suggestions
- Paginated results

### 3. Bookmark System
- Persistent storage using localStorage
- Add/remove bookmarks
- View all saved articles
- Clear all bookmarks option

### 4. Dark Mode
- Theme persistence
- Smooth transition
- System preference detection

### 5. Responsive Design
- Mobile-first approach
- 2 cards per row on mobile
- 3-4 cards per row on desktop
- Optimized touch targets

### 6. Performance Optimizations
- Lazy loading images
- Code splitting
- Infinite scroll pagination
- Debounced search
- Cached API responses

## 🔧 Configuration

### Tailwind CSS Configuration
The project uses a custom Tailwind configuration with:
- Custom color schemes
- Extended spacing
- Custom animations
- Dark mode support

### API Fallback Strategy
1. Primary: NewsAPI
2. Secondary: GNews API
3. Tertiary: MediaStack API
4. Fallback: Enhanced mock data

## 📱 Responsive Breakpoints

| Device | Breakpoint | Cards per row |
|--------|------------|---------------|
| Mobile | < 640px | 1-2 |
| Tablet | 640px - 1024px | 2 |
| Desktop | > 1024px | 3-4 |

## 🎨 Color Scheme

```css
Primary: #1a1a1a (Dark gray)
Secondary: #4a4a4a (Medium gray)
Accent: #c41e3a (Red)
Info: #3b82f6 (Blue)
Success: #10b981 (Green)
Warning: #f59e0b (Orange)
Error: #ef4444 (Red)
```

## 🧪 Testing

```bash
# Run tests (coming soon)
npm run test

# Lint code
npm run lint
```

## 📈 Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 2.5s
- **Lighthouse Score**: 90+ (target)
- **Bundle Size**: Optimized with code splitting

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

### Bharat Poojari

**Full Stack Developer | React Specialist | UI/UX Enthusiast**

- 🌐 **Portfolio**: [https://bharat-poojari.vercel.app](https://bharat-poojari.vercel.app)
- 💻 **GitHub**: [https://github.com/bharat-poojari](https://github.com/bharat-poojari)
- 📧 **Email**: bharatpoojari@example.com
- 💼 **LinkedIn**: [Bharat Poojari](https://linkedin.com/in/bharat-poojari)
- 🐦 **Twitter**: [@bharatpoojari](https://twitter.com/bharatpoojari)

### Skills & Expertise
- **Frontend**: React, Next.js, Vue.js, Angular
- **Styling**: Tailwind CSS, Material-UI, Chakra UI
- **State Management**: Redux, Zustand, Context API
- **Backend**: Node.js, Express, MongoDB, PostgreSQL
- **DevOps**: Docker, AWS, Vercel, Netlify
- **Mobile**: React Native, Flutter

## 🙏 Acknowledgments

- [NewsAPI](https://newsapi.org/) for providing news data
- [GNews API](https://gnews.io/) for backup news source
- [YouTube API](https://developers.google.com/youtube) for video content
- [Vite](https://vitejs.dev/) for amazing build tool
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [React Hot Toast](https://react-hot-toast.com/) for beautiful notifications

## 🗺️ Roadmap

### Version 1.1.0 (Coming Soon)
- [ ] User authentication
- [ ] Personalized news feed
- [ ] Push notifications
- [ ] Offline support (PWA)
- [ ] Comments section
- [ ] News summarization using AI

### Version 1.2.0 (Planned)
- [ ] Audio news (text-to-speech)
- [ ] Weather integration
- [ ] Stock market ticker
- [ ] Multiple language support
- [ ] RSS feed integration
- [ ] Email newsletter system

## 🐛 Known Issues

- Some APIs may have rate limits on free tiers
- Mock data used when all APIs fail
- YouTube API requires separate configuration

## 📞 Support

For support, email bharatpoojari@example.com or open an issue on GitHub.

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

### Made with ❤️ by Bharat Poojari

**Happy Coding! 🚀**
