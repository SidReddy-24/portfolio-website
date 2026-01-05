# Cyberpunk Portfolio - Siddharth Reddy

A futuristic, cyberpunk-themed portfolio website built with React and featuring scroll-based frame animation, neon aesthetics, and an admin panel for content management.

## 🚀 Live Demo

Visit the portfolio at: [Your Portfolio URL]

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Admin Panel](#admin-panel)
- [Animated Background](#animated-background)
- [Design System](#design-system)
- [What I Learned](#what-i-learned)
- [Performance Optimizations](#performance-optimizations)
- [Future Enhancements](#future-enhancements)

## 🎯 Overview

This portfolio showcases a unique cyberpunk aesthetic with:
- **Scroll-based frame animation** using 240 sequential images
- **Futuristic UI design** with neon glows, glitch effects, and HUD elements
- **Admin panel** for dynamic content management
- **Responsive design** optimized for all devices
- **Smooth animations** powered by Framer Motion

## ✨ Features

### Core Features
- **Animated Background**: 240-frame sequence that responds to scroll position
- **Cyberpunk Aesthetics**: Neon colors, glitch effects, scanlines, and HUD elements
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Smooth Animations**: Page transitions and micro-interactions
- **Admin Panel**: Content management system accessible via `#sidadmin`

### Sections
1. **Landing Page**: Animated loading screen with progress indicator
2. **Hero Section**: Main introduction with glitch text effects
3. **About**: Personal bio with tech stack display
4. **Work**: Project showcase with GitHub integration
5. **Play**: Hobbies and experiences with LinkedIn integration
6. **Contact**: Social links and contact information

## 🛠 Technologies Used

### Frontend Framework
- **React 19.2.0** - Latest React with concurrent features
- **Vite 7.2.4** - Fast build tool and dev server

### Styling & Animation
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Framer Motion 12.23.26** - Animation library for React
- **Custom CSS** - Cyberpunk effects (glitch, neon, scanlines)

### Development Tools
- **ESLint** - Code linting with React-specific rules
- **PostCSS** - CSS processing with Autoprefixer
- **Tailwind Scrollbar** - Custom scrollbar styling

### Fonts
- **Inter** - Body text font
- **Outfit** - Display font for headings

## 📁 Project Structure

```
├── public/
│   ├── frames/           # 240 animation frames (ezgif-frame-001.jpg to 240.jpg)
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── About.jsx     # About section with tech stack
│   │   ├── Admin.jsx     # Content management panel
│   │   ├── Contact.jsx   # Contact information and social links
│   │   ├── Hero.jsx      # Main hero section
│   │   ├── LandingPage.jsx # Loading screen with progress
│   │   ├── Navbar.jsx    # Navigation component
│   │   ├── Play.jsx      # Hobbies and experiences
│   │   ├── ScrollCanvas.jsx # Animated background handler
│   │   └── Work.jsx      # Project showcase
│   ├── App.jsx           # Main application component
│   ├── App.css           # Cyberpunk CSS effects
│   ├── index.css         # Tailwind imports and base styles
│   └── main.jsx          # React entry point
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd cyberpunk-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 💻 Usage

### Development
- Run `npm run dev` to start the development server
- Visit `http://localhost:5173` to view the portfolio
- Hot reload is enabled for instant updates

### Production
- Run `npm run build` to create optimized production build
- Deploy the `dist` folder to your hosting platform

## 🔧 Admin Panel

Access the admin panel by adding `#sidadmin` to the URL (e.g., `localhost:5173/#sidadmin`)

### Features
- **Project Management**: Add GitHub repositories automatically
- **Hobby Management**: Add LinkedIn posts with metadata extraction
- **About Section**: Edit bio, description, and tech stack
- **Real-time Sync**: Changes sync across browser tabs
- **Export Config**: Download portfolio data as JSON

### Adding Content
1. **GitHub Projects**: Paste GitHub repo URL for automatic metadata extraction
2. **LinkedIn Posts**: Paste LinkedIn post URL (with fallback for manual editing)
3. **Manual Entry**: Add items manually with custom details

## 🎨 Animated Background

### How It Works
The animated background uses a sequence of 240 images that change based on scroll position:

1. **Image Loading**: All frames are preloaded with progress tracking
2. **Scroll Detection**: Calculates scroll percentage of total page height
3. **Frame Selection**: Maps scroll position to corresponding frame
4. **Canvas Rendering**: Draws images on HTML5 canvas with proper scaling
5. **Performance**: Uses `requestAnimationFrame` for smooth rendering

### Technical Implementation
```javascript
// Frame calculation based on scroll
const scrollFraction = scrollPos / maxScroll;
const frameIndex = Math.floor(scrollFraction * frameCount);
```

### Frame Requirements
- **Format**: JPG images
- **Naming**: `ezgif-frame-001.jpg` to `ezgif-frame-240.jpg`
- **Location**: `/public/frames/` directory
- **Recommended Size**: 1920x1080 or similar 16:9 aspect ratio

## 🎨 Design System

### Color Palette
```css
--neon-cyan: #00f3ff      /* Primary accent */
--neon-magenta: #ff00ff   /* Secondary accent */
--neon-yellow: #f3ec19    /* Highlight color */
--cyber-black: #050505    /* Background */
```

### Typography
- **Display Font**: Outfit (headings, bold text)
- **Body Font**: Inter (paragraphs, UI text)
- **Mono Font**: System monospace (code, technical text)

### Effects
- **Glitch Text**: CSS-based text distortion animation
- **Neon Glow**: Text-shadow and box-shadow effects
- **Scanlines**: Overlay pattern for CRT monitor effect
- **HUD Elements**: Futuristic UI components and brackets

## 📚 What I Learned

### Technical Skills
1. **Advanced React Patterns**
   - Custom hooks for scroll detection
   - State management with localStorage sync
   - Cross-tab communication via storage events

2. **Canvas Animation**
   - HTML5 Canvas API for image rendering
   - Performance optimization with requestAnimationFrame
   - Responsive canvas sizing with device pixel ratio

3. **CSS Animations**
   - Complex keyframe animations for glitch effects
   - CSS custom properties for theming
   - Blend modes and advanced visual effects

4. **API Integration**
   - GitHub API for repository metadata
   - CORS proxy handling for LinkedIn scraping
   - Error handling and fallback strategies

5. **Build Optimization**
   - Vite configuration for fast development
   - Image optimization and preloading strategies
   - Code splitting and lazy loading

### Design Concepts
1. **Cyberpunk Aesthetics**
   - Color theory for neon themes
   - Typography hierarchy in futuristic designs
   - UI/UX patterns for sci-fi interfaces

2. **Responsive Design**
   - Mobile-first development approach
   - Adaptive layouts for different screen sizes
   - Touch-friendly interactions

3. **Performance Considerations**
   - Image optimization for web delivery
   - Smooth scroll animations
   - Memory management for large image sequences

## ⚡ Performance Optimizations

### Image Loading
- **Progressive Loading**: Images load with progress feedback
- **Error Handling**: Graceful fallbacks for failed image loads
- **Memory Management**: Efficient canvas rendering

### Animation Performance
- **RequestAnimationFrame**: Smooth 60fps animations
- **GPU Acceleration**: CSS transforms for hardware acceleration
- **Debounced Scroll**: Optimized scroll event handling

### Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Dynamic imports for admin panel
- **Asset Optimization**: Compressed images and fonts

## 🔮 Future Enhancements

### Planned Features
1. **3D Elements**: Three.js integration for 3D models
2. **Audio Integration**: Cyberpunk soundtrack and sound effects
3. **Interactive Particles**: Mouse-following particle system
4. **Blog Section**: Technical articles and tutorials
5. **Dark/Light Mode**: Theme switching capability

### Technical Improvements
1. **PWA Support**: Service worker for offline functionality
2. **SEO Optimization**: Meta tags and structured data
3. **Analytics**: User interaction tracking
4. **Performance Monitoring**: Real-time performance metrics
5. **Accessibility**: WCAG compliance improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Siddharth Reddy**
- Email: sidreddy.onwork@gmail.com
- LinkedIn: [the-siddharth-reddy](https://www.linkedin.com/in/the-siddharth-reddy/)
- GitHub: [SidReddy-24](https://github.com/SidReddy-24)
- Instagram: [sid_rdy](https://www.instagram.com/sid_rdy/)

---

*Built with ❤️ and lots of neon lights* ✨