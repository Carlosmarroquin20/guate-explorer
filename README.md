# 🇬🇹 Guate Explorer

> Discover the beauty, culture, and heritage of Guatemala at your fingertips

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20ES-success)](./src/i18n)

## ✨ Overview

**Guate Explorer** is a modern, interactive web application that brings Guatemala's most iconic destinations, cultural landmarks, and natural wonders to life. Explore stunning imagery, interactive maps, and rich information about Guatemala's heritage—all in a sleek, responsive interface with dark mode support and multilingual support.

### 🎯 Key Features

- 🗺️ **Interactive Map** - Explore Guatemala's geography with an integrated map view
- 🖼️ **Image Gallery** - Beautiful curated images from Wikimedia Commons
- 📍 **Rich Location Data** - Comprehensive information about places, monuments, and landmarks
- 🌙 **Dark Mode** - Eye-friendly interface with theme switching
- 🌍 **Multilingual** - Full support for English and Spanish
- ⚡ **Lightning Fast** - Built with Vite for instant page loads and HMR
- 📱 **Fully Responsive** - Works flawlessly on desktop, tablet, and mobile
- ♿ **Accessible** - Modern React patterns with accessibility best practices

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (or **yarn**/**pnpm**)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/guate-explorer.git
   cd guate-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` and start exploring!

## 📚 Project Structure

```
guate-explorer/
├── src/
│   ├── components/          # React components
│   │   ├── ImageGallery/    # Image gallery display component
│   │   ├── Map/             # Interactive map component
│   │   └── Sidebar/         # Navigation & info sidebar
│   ├── context/             # React Context providers
│   │   └── ThemeContext.tsx # Light/Dark mode management
│   ├── data/                # Static data files
│   │   └── places.json      # Guatemalan places & landmarks
│   ├── hooks/               # Custom React hooks
│   │   └── useWikimediaImages.ts # Fetch images from Wikimedia
│   ├── i18n/                # Internationalization
│   │   ├── index.ts
│   │   └── locales/         # Translation files
│   │       ├── en.json      # English translations
│   │       └── es.json      # Spanish translations
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   │   └── icons.ts         # Icon utilities
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## 🛠️ Available Scripts

```bash
# Development - Start Vite dev server with HMR
npm run dev

# Build - Create optimized production build
npm run build

# Preview - Preview production build locally
npm run preview

# Lint - Run ESLint to check code quality
npm run lint
```

## 🎨 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | User interface library |
| **TypeScript** | Type-safe JavaScript |
| **Vite 5** | Next-generation build tool |
| **React Router** | Client-side routing (ready for expansion) |
| **Context API** | State management (themes, preferences) |
| **Wikimedia API** | Image data sourcing |
| **i18n** | Multilingual support |
| **ESLint** | Code quality & consistency |

## 🌐 Internationalization

Guate Explorer supports multiple languages out of the box:

- **English** (en)
- **Spanish** (es)

Add more languages by creating new locale files in `src/i18n/locales/` and extending the language configuration.

## 🎭 Theme System

The app includes a sophisticated theme system powered by React Context:

- **Light Mode** - Clean, bright interface
- **Dark Mode** - Comfortable for low-light environments
- **Persistent** - Theme preference is remembered

Toggle themes using the built-in theme switcher in the UI.

## 📦 Dependencies

Key dependencies include:

- `react` - UI framework
- `react-dom` - DOM rendering
- `vite` - Build tool
- `typescript` - Type safety
- Custom hooks & utilities for extended functionality

See `package.json` for the complete list.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙌 Acknowledgments

- **Wikimedia Commons** for providing high-quality images
- **The React Community** for amazing tools and libraries
- Contributors and testers who help make Guate Explorer better

## 📞 Contact & Support

Have questions or suggestions? Feel free to:
- Open an issue on GitHub
- Reach out via email
- Join our community discussions

---

<div align="center">

**Made with ❤️ for Guatemala**

*Explore. Discover. Connect.*

</div>
