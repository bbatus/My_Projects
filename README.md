# 🚀 Portfolio Website

Modern ve responsive bir portfolyo websitesi. Kişisel projelerinizi sergilemek için tasarlanmış, çoklu medya desteği sunan statik bir web uygulaması.

## ✨ Özellikler

### 🎨 Modern Tasarım
- **Responsive Design**: Mobil, tablet ve desktop uyumlu
- **Dark/Light Mode**: Otomatik sistem teması algılama
- **Smooth Animations**: Kullanıcı dostu geçiş efektleri
- **Tailwind CSS**: Modern ve özelleştirilebilir stil sistemi

### 📱 Çoklu Medya Desteği
- **Video**: MP4 formatında video oynatma
- **Resim**: PNG, JPG, WebP formatları
- **YouTube**: Embed video desteği
- **Carousel**: Birden fazla medya türü için tab sistemi

### 🔧 Teknik Özellikler
- **Vanilla JavaScript**: Framework bağımlılığı yok
- **Component-Based**: Modüler yapı
- **JSON Veri Yönetimi**: Kolay içerik güncelleme
- **GitHub Pages**: Otomatik deployment
- **SEO Optimized**: Meta tags, sitemap, robots.txt

## 🚀 Hızlı Başlangıç

### 1. Repository'yi Klonlayın
```bash
git clone https://github.com/[username]/portfolio-website.git
cd portfolio-website
```

### 2. Proje Verilerini Güncelleyin
`data/projects.json` dosyasını düzenleyerek projelerinizi ekleyin:

```json
{
  "projects": [
    {
      "id": "my-project-1",
      "title": "Proje Adı",
      "description": "Proje açıklaması...",
      "technologies": ["React", "Node.js", "MongoDB"],
      "media": {
        "type": "image",
        "content": {
          "image": "assets/images/projects/project1.png"
        }
      },
      "links": {
        "github": "https://github.com/username/project",
        "live": "https://project-demo.com"
      },
      "featured": true,
      "date": "2024-01-15",
      "category": "Full Stack"
    }
  ]
}
```

### 3. Site Konfigürasyonunu Ayarlayın
`data/config.json` dosyasında kişisel bilgilerinizi güncelleyin:

```json
{
  "site": {
    "title": "Portfolyo | Your Name",
    "description": "Kişisel projelerimi sergileyen portfolyo websitesi"
  },
  "author": {
    "name": "Your Name",
    "bio": "Yazılım geliştirici...",
    "email": "your-email@example.com",
    "social": {
      "github": "https://github.com/username",
      "linkedin": "https://linkedin.com/in/username"
    }
  }
}
```

### 4. Medya Dosyalarını Ekleyin
- Proje resimlerini `assets/images/projects/` klasörüne
- Video dosyalarını `assets/videos/` klasörüne koyun

### 5. Local Test
Basit bir HTTP server ile test edin:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx ile)
npx serve .

# PHP
php -S localhost:8000
```

Tarayıcıda `http://localhost:8000` adresini açın.

## 🌐 GitHub Pages Deployment

### Otomatik Deployment
1. Repository'yi GitHub'a push edin
2. Repository Settings > Pages bölümüne gidin
3. Source olarak "GitHub Actions" seçin
4. `.github/workflows/deploy.yml` otomatik çalışacak

### Manuel Deployment
```bash
git add .
git commit -m "Portfolio güncellendi"
git push origin main
```

Deployment tamamlandığında siteniz şu adreste erişilebilir olacak:
`https://[username].github.io/portfolio-website`

## 📁 Proje Yapısı

```
portfolio-website/
├── index.html                 # Ana sayfa
├── 404.html                  # Custom 404 sayfası
├── assets/
│   ├── css/
│   │   └── custom.css        # Özel CSS stilleri
│   ├── js/
│   │   ├── main.js           # Ana uygulama
│   │   ├── utils/
│   │   │   └── DataLoader.js # Veri yükleme utility
│   │   └── components/
│   │       ├── Navigation.js     # Navigation component
│   │       ├── ThemeManager.js   # Theme yönetimi
│   │       ├── MediaHandler.js   # Medya işleme
│   │       ├── ProjectCard.js    # Proje kartları
│   │       └── ProjectGrid.js    # Grid yönetimi
│   ├── images/               # Resim dosyaları
│   └── videos/               # Video dosyaları
├── data/
│   ├── projects.json         # Proje verileri
│   └── config.json          # Site konfigürasyonu
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions workflow
├── .nojekyll                # Jekyll'ı devre dışı bırak
├── robots.txt               # SEO robot direktifleri
├── sitemap.xml             # Site haritası
└── README.md               # Bu dosya
```

## 🎯 Medya Türleri

### Resim
```json
{
  "media": {
    "type": "image",
    "content": {
      "image": "assets/images/projects/project.png"
    }
  }
}
```

### Video
```json
{
  "media": {
    "type": "video",
    "content": {
      "video": "assets/videos/demo.mp4"
    }
  }
}
```

### YouTube
```json
{
  "media": {
    "type": "youtube",
    "content": {
      "youtube": "dQw4w9WgXcQ"
    }
  }
}
```

### Çoklu Medya
```json
{
  "media": {
    "type": "multiple",
    "content": {
      "multiple": [
        {
          "type": "image",
          "src": "assets/images/project1.png",
          "title": "Ana Sayfa"
        },
        {
          "type": "video",
          "src": "assets/videos/demo.mp4",
          "title": "Demo Video"
        }
      ]
    }
  }
}
```

## 🎨 Özelleştirme

### Renkler
`assets/css/custom.css` dosyasında CSS custom properties'leri düzenleyin:

```css
:root {
  --primary: #3b82f6;        /* Ana renk */
  --primary-dark: #1d4ed8;   /* Ana renk koyu */
  --accent: #f59e0b;         /* Vurgu rengi */
  /* ... */
}
```

### Tailwind Konfigürasyonu
`index.html` içindeki Tailwind config'i düzenleyin:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--current-primary)',
        // Özel renkler ekleyin
      }
    }
  }
}
```

## 🔧 Geliştirme

### Component Ekleme
Yeni component eklemek için:

1. `assets/js/components/` klasöründe yeni dosya oluşturun
2. Component class'ını yazın
3. `index.html`'de script tag'i ekleyin
4. `main.js`'de component'i initialize edin

### Veri Yapısı Genişletme
Proje verilerine yeni alanlar eklemek için:

1. `data/projects.json`'da yeni alanları ekleyin
2. `ProjectCard.js`'de rendering logic'ini güncelleyin
3. CSS'de gerekli stilleri ekleyin

## 📊 Analytics (Opsiyonel)

Google Analytics eklemek için `index.html`'de `</head>` tag'inden önce:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🐛 Sorun Giderme

### Projeler Görünmüyor
1. `data/projects.json` dosyasının geçerli JSON formatında olduğunu kontrol edin
2. Browser console'da hata mesajlarını kontrol edin
3. Medya dosyalarının doğru yolda olduğunu kontrol edin

### GitHub Pages Deployment Hatası
1. Repository'nin public olduğunu kontrol edin
2. GitHub Actions'da build log'larını kontrol edin
3. `main` veya `master` branch'e push ettiğinizi kontrol edin

### Responsive Sorunları
1. Browser developer tools'da farklı ekran boyutlarını test edin
2. `assets/css/custom.css`'deki media query'leri kontrol edin

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 🙏 Teşekkürler

- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [GitHub Pages](https://pages.github.com/) - Hosting
- [Heroicons](https://heroicons.com/) - Icon set

## 📞 İletişim

- **Email**: your-email@example.com
- **GitHub**: [@username](https://github.com/username)
- **LinkedIn**: [Your Name](https://linkedin.com/in/username)

---

⭐ Bu projeyi beğendiyseniz star vermeyi unutmayın!