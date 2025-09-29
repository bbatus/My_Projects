/**
 * DataLoader - Veri yükleme ve hata yönetimi utility class'ı
 */
class DataLoader {
    constructor() {
        this.cache = new Map();
        this.loadingStates = new Map();
    }

    /**
     * Proje verilerini yükler
     * @returns {Promise<Array>} Proje listesi
     */
    async loadProjects() {
        const cacheKey = 'projects';
        
        // Cache kontrolü
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        // Loading state kontrolü
        if (this.loadingStates.has(cacheKey)) {
            return this.loadingStates.get(cacheKey);
        }

        try {
            const loadingPromise = this.fetchData('data/projects.json');
            this.loadingStates.set(cacheKey, loadingPromise);
            
            const response = await loadingPromise;
            const data = response.projects || [];
            
            // Cache'e kaydet
            this.cache.set(cacheKey, data);
            this.loadingStates.delete(cacheKey);
            
            console.log(`✅ ${data.length} proje başarıyla yüklendi`);
            return data;
            
        } catch (error) {
            this.loadingStates.delete(cacheKey);
            console.error('❌ Proje verileri yüklenirken hata:', error);
            return this.getFallbackProjects();
        }
    }

    /**
     * Site konfigürasyonunu yükler
     * @returns {Promise<Object>} Site konfigürasyonu
     */
    async loadConfig() {
        const cacheKey = 'config';
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        if (this.loadingStates.has(cacheKey)) {
            return this.loadingStates.get(cacheKey);
        }

        try {
            const loadingPromise = this.fetchData('data/config.json');
            this.loadingStates.set(cacheKey, loadingPromise);
            
            const data = await loadingPromise;
            
            this.cache.set(cacheKey, data);
            this.loadingStates.delete(cacheKey);
            
            console.log('✅ Site konfigürasyonu başarıyla yüklendi');
            return data;
            
        } catch (error) {
            this.loadingStates.delete(cacheKey);
            console.error('❌ Site konfigürasyonu yüklenirken hata:', error);
            return this.getFallbackConfig();
        }
    }

    /**
     * Genel veri yükleme metodu
     * @param {string} url - Yüklenecek dosyanın URL'i
     * @returns {Promise<Object>} JSON verisi
     */
    async fetchData(url) {
        // Cache-busting: GitHub Pages ve tarayıcı cache'lerini aşmak için
        const cacheBuster = `t=${Date.now()}`;
        const sep = url.includes('?') ? '&' : '?';
        const requestUrl = `${url}${sep}${cacheBuster}`;

        const response = await fetch(requestUrl, { cache: 'no-store' });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        const looksLikeJson = url.endsWith('.json');
        if (contentType && !contentType.includes('application/json') && !looksLikeJson) {
            throw new Error('Geçersiz JSON formatı');
        }
        
        return await response.json();
    }

    /**
     * Fallback proje verileri
     * @returns {Array} Varsayılan proje listesi
     */
    getFallbackProjects() {
        return [
            {
                id: 'fallback-1',
                title: 'Örnek Proje 1',
                description: 'Bu bir örnek proje açıklamasıdır. Gerçek veriler yüklenemediği için gösteriliyor.',
                technologies: ['HTML', 'CSS', 'JavaScript'],
                media: {
                    type: 'image',
                    content: {
                        image: 'assets/images/placeholder.png'
                    }
                },
                links: {
                    github: '#'
                },
                featured: false,
                date: '2024-01-01',
                category: 'Frontend'
            },
            {
                id: 'fallback-2',
                title: 'Örnek Proje 2',
                description: 'Bu da başka bir örnek proje açıklamasıdır.',
                technologies: ['React', 'Node.js'],
                media: {
                    type: 'image',
                    content: {
                        image: 'assets/images/placeholder.png'
                    }
                },
                links: {
                    github: '#'
                },
                featured: false,
                date: '2024-01-02',
                category: 'Full Stack'
            }
        ];
    }

    /**
     * Fallback site konfigürasyonu
     * @returns {Object} Varsayılan site konfigürasyonu
     */
    getFallbackConfig() {
        return {
            site: {
                title: 'Portfolyo',
                subtitle: 'Kişisel Projeler',
                description: 'Kişisel projelerimi sergileyen portfolyo websitesi'
            },
            author: {
                name: 'Geliştirici',
                bio: 'Yazılım geliştirici',
                social: {}
            },
            settings: {
                projectsPerPage: 6,
                showFeaturedFirst: true,
                enableDarkMode: true
            }
        };
    }

    /**
     * Projeleri kategoriye göre filtreler
     * @param {Array} projects - Proje listesi
     * @param {string} category - Kategori ID'si
     * @returns {Array} Filtrelenmiş proje listesi
     */
    filterProjectsByCategory(projects, category) {
        if (!category || category === 'all') {
            return projects;
        }
        
        return projects.filter(project => 
            project.category && project.category.toLowerCase() === category.toLowerCase()
        );
    }

    /**
     * Projeleri featured durumuna göre sıralar
     * @param {Array} projects - Proje listesi
     * @returns {Array} Sıralanmış proje listesi
     */
    sortProjectsByFeatured(projects) {
        return [...projects].sort((a, b) => {
            // Featured projeler önce
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            
            // Sonra tarihe göre (yeni önce)
            return new Date(b.date) - new Date(a.date);
        });
    }

    /**
     * Projeleri tarihe göre sıralar
     * @param {Array} projects - Proje listesi
     * @param {string} order - 'asc' veya 'desc'
     * @returns {Array} Sıralanmış proje listesi
     */
    sortProjectsByDate(projects, order = 'desc') {
        return [...projects].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            
            return order === 'desc' ? dateB - dateA : dateA - dateB;
        });
    }

    /**
     * Cache'i temizler
     */
    clearCache() {
        this.cache.clear();
        this.loadingStates.clear();
        console.log('🗑️ Cache temizlendi');
    }

    /**
     * Belirli bir cache anahtarını temizler
     * @param {string} key - Cache anahtarı
     */
    clearCacheKey(key) {
        this.cache.delete(key);
        this.loadingStates.delete(key);
        console.log(`🗑️ Cache anahtarı temizlendi: ${key}`);
    }
}

// Global instance oluştur
window.dataLoader = new DataLoader();