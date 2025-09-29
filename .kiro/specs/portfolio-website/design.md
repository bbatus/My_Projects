# Design Document

## Overview

Bu portfolyo websitesi, modern web teknolojileri kullanarak statik bir single-page application (SPA) olarak tasarlanmıştır. Vanilla HTML, CSS (Tailwind) ve JavaScript kullanılarak geliştirilecek, GitHub Pages'te deploy edilecektir. Proje kartları dinamik olarak JSON verilerinden oluşturulacak ve çoklu medya desteği sağlanacaktır.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │    │  GitHub Pages   │    │   User Browser  │
│                 │    │                 │    │                 │
│ - HTML/CSS/JS   │───▶│ - Static Host   │───▶│ - Website View  │
│ - JSON Data     │    │ - Auto Deploy   │    │ - Interactions  │
│ - Assets        │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

- **Frontend Framework:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **CSS Framework:** Tailwind CSS (via CDN)
- **Build Process:** None (pure static files)
- **Hosting:** GitHub Pages
- **Deployment:** GitHub Actions
- **Data Storage:** JSON files

## Components and Interfaces

### 1. Main Layout Structure

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Meta tags, Tailwind CSS CDN -->
</head>
<body>
  <header>
    <!-- Navigation, Title, Theme Toggle -->
  </header>
  
  <main>
    <!-- Hero Section -->
    <!-- Projects Grid -->
  </main>
  
  <footer>
    <!-- Contact Info, Social Links -->
  </footer>
</body>
</html>
```

### 2. Project Card Component

Her proje kartı şu yapıya sahip olacak:

```javascript
// Project Data Structure
{
  "id": "unique-id",
  "title": "Project Title",
  "description": "Project description",
  "technologies": ["React", "Node.js"],
  "media": {
    "type": "video|image|youtube|multiple",
    "content": {
      "video": "path/to/video.mp4",
      "image": "path/to/image.png", 
      "youtube": "youtube-video-id",
      "multiple": [
        {"type": "image", "src": "image1.png"},
        {"type": "video", "src": "video1.mp4"}
      ]
    }
  },
  "links": {
    "github": "github-repo-url",
    "live": "live-demo-url",
    "documentation": "docs-url"
  },
  "featured": true,
  "date": "2024-01-15"
}
```

### 3. Media Handler Component

```javascript
class MediaHandler {
  static renderMedia(mediaConfig) {
    switch(mediaConfig.type) {
      case 'video':
        return this.createVideoElement(mediaConfig.content.video);
      case 'image':
        return this.createImageElement(mediaConfig.content.image);
      case 'youtube':
        return this.createYouTubeEmbed(mediaConfig.content.youtube);
      case 'multiple':
        return this.createMediaCarousel(mediaConfig.content.multiple);
    }
  }
}
```

### 4. Theme System

```javascript
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.applyTheme();
  }
  
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme();
  }
}
```

## Data Models

### Project Model

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  media: MediaConfig;
  links: ProjectLinks;
  featured: boolean;
  date: string;
  category?: string;
}

interface MediaConfig {
  type: 'video' | 'image' | 'youtube' | 'multiple';
  content: {
    video?: string;
    image?: string;
    youtube?: string;
    multiple?: MediaItem[];
  };
}

interface MediaItem {
  type: 'video' | 'image' | 'youtube';
  src: string;
  alt?: string;
  title?: string;
}

interface ProjectLinks {
  github?: string;
  live?: string;
  documentation?: string;
}
```

### Site Configuration Model

```typescript
interface SiteConfig {
  title: string;
  subtitle: string;
  author: {
    name: string;
    bio: string;
    avatar: string;
    social: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      email?: string;
    };
  };
  seo: {
    description: string;
    keywords: string[];
  };
}
```

## Error Handling

### 1. Media Loading Errors

```javascript
class MediaErrorHandler {
  static handleVideoError(videoElement) {
    videoElement.style.display = 'none';
    const fallback = document.createElement('div');
    fallback.className = 'bg-gray-200 dark:bg-gray-700 rounded-lg p-8 text-center';
    fallback.innerHTML = '<p class="text-gray-500">Video yüklenemedi</p>';
    videoElement.parentNode.replaceChild(fallback, videoElement);
  }
  
  static handleImageError(imgElement) {
    imgElement.src = 'assets/placeholder.png';
    imgElement.alt = 'Resim yüklenemedi';
  }
}
```

### 2. Data Loading Errors

```javascript
class DataLoader {
  static async loadProjects() {
    try {
      const response = await fetch('data/projects.json');
      if (!response.ok) throw new Error('Veri yüklenemedi');
      return await response.json();
    } catch (error) {
      console.error('Proje verileri yüklenirken hata:', error);
      return this.getFallbackData();
    }
  }
}
```

## Testing Strategy

### 1. Manual Testing Checklist

- **Responsive Design Testing:**
  - Desktop (1920x1080, 1366x768)
  - Tablet (768x1024, 1024x768)
  - Mobile (375x667, 414x896)

- **Media Testing:**
  - MP4 video oynatma
  - PNG/JPG resim görüntüleme
  - YouTube embed çalışması
  - Multiple media carousel

- **Browser Compatibility:**
  - Chrome (son 2 versiyon)
  - Firefox (son 2 versiyon)
  - Safari (son 2 versiyon)
  - Edge (son 2 versiyon)

### 2. Performance Testing

```javascript
// Performance monitoring
class PerformanceMonitor {
  static measureLoadTime() {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`Sayfa yükleme süresi: ${loadTime}ms`);
    });
  }
  
  static measureImageLoad() {
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('load', (e) => {
        console.log(`Resim yüklendi: ${e.target.src}`);
      });
    });
  }
}
```

### 3. Accessibility Testing

- Keyboard navigation testi
- Screen reader uyumluluğu
- Color contrast kontrolü
- Alt text kontrolü
- ARIA labels kontrolü

## Deployment Architecture

### GitHub Pages Setup

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Pages
      uses: actions/configure-pages@v3
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: '.'
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2
```

### File Structure

```
portfolio-website/
├── index.html
├── assets/
│   ├── css/
│   │   └── custom.css
│   ├── js/
│   │   ├── main.js
│   │   ├── components/
│   │   │   ├── ProjectCard.js
│   │   │   ├── MediaHandler.js
│   │   │   └── ThemeManager.js
│   │   └── utils/
│   │       └── DataLoader.js
│   ├── images/
│   │   ├── projects/
│   │   └── icons/
│   └── videos/
├── data/
│   ├── projects.json
│   └── config.json
├── .github/
│   └── workflows/
│       └── deploy.yml
└── README.md
```

## Design System

### Color Palette

```css
:root {
  /* Light Theme */
  --primary: #3b82f6;
  --primary-dark: #1d4ed8;
  --secondary: #64748b;
  --accent: #f59e0b;
  --background: #ffffff;
  --surface: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  
  /* Dark Theme */
  --dark-primary: #60a5fa;
  --dark-primary-dark: #3b82f6;
  --dark-secondary: #94a3b8;
  --dark-accent: #fbbf24;
  --dark-background: #0f172a;
  --dark-surface: #1e293b;
  --dark-text-primary: #f1f5f9;
  --dark-text-secondary: #cbd5e1;
}
```

### Typography Scale

```css
.text-display { font-size: 3.75rem; line-height: 1; }
.text-h1 { font-size: 3rem; line-height: 1.1; }
.text-h2 { font-size: 2.25rem; line-height: 1.2; }
.text-h3 { font-size: 1.875rem; line-height: 1.3; }
.text-body { font-size: 1rem; line-height: 1.6; }
.text-small { font-size: 0.875rem; line-height: 1.5; }
```

### Animation System

```css
/* Smooth transitions */
.transition-smooth { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }

/* Hover effects */
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Loading animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
```