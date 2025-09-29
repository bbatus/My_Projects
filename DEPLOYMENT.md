# 🚀 Deployment Kılavuzu

Bu kılavuz portfolyo website'inizi GitHub Pages'te nasıl deploy edeceğinizi adım adım açıklar.

## 📋 Ön Gereksinimler

- GitHub hesabı
- Git kurulu bilgisayar
- Temel terminal/command line bilgisi

## 🔧 Adım 1: Repository Hazırlığı

### 1.1 GitHub Repository Oluşturma
1. GitHub'da yeni repository oluşturun
2. Repository adını `portfolio-website` yapın (veya istediğiniz ad)
3. Public olarak ayarlayın
4. README.md eklemeyin (zaten mevcut)

### 1.2 Local Repository'yi Bağlama
```bash
git init
git add .
git commit -m "Initial commit: Portfolio website"
git branch -M main
git remote add origin https://github.com/[username]/portfolio-website.git
git push -u origin main
```

## ⚙️ Adım 2: GitHub Pages Konfigürasyonu

### 2.1 Pages Ayarlarını Aktifleştirme
1. Repository'de **Settings** sekmesine gidin
2. Sol menüden **Pages** seçin
3. **Source** bölümünde **GitHub Actions** seçin
4. Ayarları kaydedin

### 2.2 Workflow Kontrolü
- `.github/workflows/deploy.yml` dosyasının mevcut olduğunu kontrol edin
- İlk push sonrası Actions sekmesinde workflow'un çalıştığını görün

## 🌐 Adım 3: Domain Ayarları (Opsiyonel)

### 3.1 GitHub Subdomain (Varsayılan)
Site otomatik olarak şu adreste yayınlanır:
```
https://[username].github.io/portfolio-website
```

### 3.2 Custom Domain
Kendi domain'inizi kullanmak için:

1. `CNAME` dosyasını düzenleyin:
```
yourdomain.com
```

2. DNS ayarlarınızda CNAME record ekleyin:
```
www.yourdomain.com -> [username].github.io
```

3. Repository Settings > Pages'te custom domain'i girin

## 🔄 Adım 4: İçerik Güncelleme Süreci

### 4.1 Proje Ekleme/Düzenleme
1. `data/projects.json` dosyasını düzenleyin
2. Medya dosyalarını ilgili klasörlere ekleyin
3. Değişiklikleri commit edin:

```bash
git add .
git commit -m "Yeni proje eklendi: [proje-adı]"
git push origin main
```

### 4.2 Otomatik Deployment
- Her push sonrası GitHub Actions otomatik çalışır
- 2-5 dakika içinde değişiklikler yayınlanır
- Actions sekmesinden deployment durumunu takip edin

## 📊 Adım 5: Monitoring ve Analytics

### 5.1 GitHub Actions Monitoring
- Repository > Actions sekmesinde deployment loglarını kontrol edin
- Hata durumunda log detaylarını inceleyin

### 5.2 Google Analytics (Opsiyonel)
`index.html`'e Google Analytics kodu ekleyin:

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

### Deployment Başarısız
1. Actions sekmesinde hata loglarını kontrol edin
2. JSON dosyalarının geçerli formatda olduğunu kontrol edin
3. Dosya yollarının doğru olduğunu kontrol edin

### Site Açılmıyor
1. Repository'nin public olduğunu kontrol edin
2. Pages ayarlarının doğru olduğunu kontrol edin
3. 24 saat bekleyin (DNS propagation)

### Medya Dosyaları Görünmüyor
1. Dosya yollarının doğru olduğunu kontrol edin
2. Dosya boyutlarının GitHub limitlerinde olduğunu kontrol edin
3. Desteklenen formatları kullandığınızı kontrol edin

## ✅ Deployment Checklist

- [ ] Repository oluşturuldu ve public yapıldı
- [ ] Local kod repository'ye push edildi
- [ ] GitHub Pages aktifleştirildi
- [ ] GitHub Actions workflow çalışıyor
- [ ] Site erişilebilir durumda
- [ ] Tüm linkler çalışıyor
- [ ] Medya dosyaları yükleniyor
- [ ] Responsive tasarım test edildi
- [ ] SEO ayarları yapıldı

## 🔄 Güncelleme Süreci

### Düzenli Güncelleme
```bash
# 1. Değişiklikleri yap
# 2. Test et (local)
# 3. Commit et
git add .
git commit -m "Açıklayıcı commit mesajı"

# 4. Push et
git push origin main

# 5. Deployment'ı bekle (2-5 dakika)
# 6. Live site'ı kontrol et
```

### Acil Düzeltme
```bash
# Hızlı düzeltme için
git add .
git commit -m "Hotfix: [sorun açıklaması]"
git push origin main
```

## 📞 Destek

Deployment sırasında sorun yaşarsanız:
- GitHub Pages documentation'ı kontrol edin
- Repository Issues bölümünde soru sorun
- Community forumlarından yardım alın

---
Bu kılavuz ile portfolyo website'inizi başarıyla deploy edebilirsiniz! 🎉