# Requirements Document

## Introduction

Bu proje, kişisel projeleri sergilemek için modern ve estetik bir statik portfolyo websitesi geliştirmeyi amaçlamaktadır. Website, projeler için çoklu medya desteği (video, resim, link) sunacak ve GitHub Pages üzerinde deploy edilebilecek şekilde tasarlanacaktır. Tailwind CSS kullanılarak responsive ve modern bir tasarım oluşturulacaktır.

## Requirements

### Requirement 1

**User Story:** Bir portfolyo sahibi olarak, projelerimi görsel olarak çekici kartlar halinde sergileyebilmek istiyorum, böylece ziyaretçiler projelerimi kolayca görebilsin.

#### Acceptance Criteria

1. WHEN kullanıcı ana sayfayı ziyaret ettiğinde THEN sistem proje kartlarını grid layout'ta gösterecek
2. WHEN bir proje kartı görüntülendiğinde THEN sistem proje başlığı, açıklama ve medya içeriğini gösterecek
3. WHEN sayfa yüklendiğinde THEN sistem responsive tasarım ile farklı ekran boyutlarında düzgün görünecek

### Requirement 2

**User Story:** Bir portfolyo sahibi olarak, her proje için farklı medya türleri (MP4 video, PNG resim, YouTube linki) ekleyebilmek istiyorum, böylece projelerimi en iyi şekilde tanıtabileyim.

#### Acceptance Criteria

1. WHEN bir proje kartında MP4 video varsa THEN sistem videoyu otomatik oynatma olmadan gösterecek
2. WHEN bir proje kartında PNG resim varsa THEN sistem resmi optimize edilmiş boyutta gösterecek
3. WHEN bir proje kartında YouTube linki varsa THEN sistem YouTube embed player'ı gösterecek
4. WHEN bir projede birden fazla medya türü varsa THEN sistem bunları tab veya carousel formatında gösterecek

### Requirement 3

**User Story:** Bir portfolyo sahibi olarak, website verilerini kolayca güncelleyebilmek istiyorum, böylece yeni projeler ekleyebildiğim veya mevcut projeleri düzenleyebildiğim.

#### Acceptance Criteria

1. WHEN proje verileri JSON formatında tanımlandığında THEN sistem bu verileri otomatik olarak kartlara dönüştürecek
2. WHEN yeni bir proje eklendiğinde THEN sistem bunu mevcut grid'e entegre edecek
3. WHEN proje verisi eksik olduğunda THEN sistem uygun placeholder gösterecek

### Requirement 4

**User Story:** Bir portfolyo sahibi olarak, websitemi GitHub Pages'te deploy edebilmek istiyorum, böylece ücretsiz hosting kullanabileyim.

#### Acceptance Criteria

1. WHEN website build edildiğinde THEN sistem GitHub Pages ile uyumlu statik dosyalar oluşturacak
2. WHEN GitHub Actions workflow çalıştığında THEN sistem otomatik deployment yapacak
3. WHEN deployment tamamlandığında THEN website GitHub Pages URL'inde erişilebilir olacak

### Requirement 5

**User Story:** Bir ziyaretçi olarak, modern ve estetik bir arayüz görmek istiyorum, böylece portfolyoyu keyifle inceleyebileyim.

#### Acceptance Criteria

1. WHEN sayfa yüklendiğinde THEN sistem Tailwind CSS ile stillendirilmiş modern tasarım gösterecek
2. WHEN kullanıcı kartlar üzerinde hover yaptığında THEN sistem smooth animasyonlar gösterecek
3. WHEN sayfa scroll edildiğinde THEN sistem smooth scrolling davranışı sergileyecek
4. WHEN dark/light mode toggle varsa THEN sistem kullanıcı tercihini hatırlayacak

### Requirement 6

**User Story:** Bir ziyaretçi olarak, mobil cihazlarda da websiteyi rahatça kullanabilmek istiyorum, böylece her yerden portfolyoya erişebileyim.

#### Acceptance Criteria

1. WHEN mobil cihazda görüntülendiğinde THEN sistem responsive grid layout kullanacak
2. WHEN tablet boyutunda görüntülendiğinde THEN sistem uygun sütun sayısı gösterecek
3. WHEN touch cihazlarda kullanıldığında THEN sistem touch-friendly etkileşimler sağlayacak