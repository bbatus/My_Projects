/**
 * Main Application Class - Tüm component'leri yönetir
 */
class PortfolioApp {
    constructor() {
        this.components = {};
        this.config = null;
        this.projects = [];
        this.isInitialized = false;
        
        this.init();
    }

    /**
     * Uygulamayı initialize eder
     */
    async init() {
        try {
            console.log('🚀 Portfolio App başlatılıyor...');
            
            // DOM ready kontrolü
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                await this.start();
            }
            
        } catch (error) {
            console.error('❌ App initialization hatası:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Uygulamayı başlatır
     */
    async start() {
        try {
            // 1. Component'leri initialize et
            this.initializeComponents();
            
            // 2. Veri yükleme
            await this.loadData();
            
            // 3. UI'yi populate et
            await this.populateUI();
            
            // 4. Event listener'ları kur
            this.setupGlobalEventListeners();
            
            // 5. Performance monitoring
            this.setupPerformanceMonitoring();
            
            this.isInitialized = true;
            console.log('✅ Portfolio App başarıyla başlatıldı');
            
            // Custom event dispatch
            this.dispatchAppReadyEvent();
            
        } catch (error) {
            console.error('❌ App start hatası:', error);
            this.handleStartupError(error);
        }
    }

    /**
     * Component'leri initialize eder
     */
    initializeComponents() {
        console.log("🔧 Component'ler initialize ediliyor...");
        
        // Global component'leri al
        this.components = {
            dataLoader: window.dataLoader,
            navigation: window.navigation,
            themeManager: window.themeManager,
            mediaHandler: window.mediaHandler,
            projectCard: window.projectCard,
            projectGrid: window.projectGrid
        };
        
        // Component kontrolü
        const missingComponents = [];
        Object.entries(this.components).forEach(([name, component]) => {
            if (!component) {
                missingComponents.push(name);
            }
        });
        
        if (missingComponents.length > 0) {
            throw new Error(`Eksik component'ler: ${missingComponents.join(', ')}`);
        }
        
        console.log("✅ Tüm component'ler hazır");
    }

    /**
     * Veri yükleme işlemi
     */
    async loadData() {
        console.log('📊 Veriler yükleniyor...');
        
        try {
            // Paralel veri yükleme
            const [projects, config] = await Promise.all([
                this.components.dataLoader.loadProjects(),
                this.components.dataLoader.loadConfig()
            ]);
            
            this.projects = projects;
            this.config = config;
            
            console.log(`✅ ${projects.length} proje ve konfigürasyon yüklendi`);
            
        } catch (error) {
            console.error('❌ Veri yükleme hatası:', error);
            
            // Fallback data kullan
            this.projects = this.components.dataLoader.getFallbackProjects();
            this.config = this.components.dataLoader.getFallbackConfig();
            
            console.warn('⚠️ Fallback veriler kullanılıyor');
        }
    }

    /**
     * UI'yi populate eder
     */
    async populateUI() {
        console.log('🎨 UI populate ediliyor...');
        
        try {
            // Site bilgilerini güncelle
            this.updateSiteInfo();
            
            // Projeleri grid'e yükle
            await this.components.projectGrid.loadProjects(this.projects);
            
            // Loading state'ini kaldır
            this.removeLoadingStates();
            
            console.log('✅ UI başarıyla populate edildi');
            
        } catch (error) {
            console.error('❌ UI populate hatası:', error);
            throw error;
        }
    }

    /**
     * Site bilgilerini günceller
     */
    updateSiteInfo() {
        if (!this.config) return;
        
        // Page title
        if (this.config.site && this.config.site.title) {
            document.title = this.config.site.title;
        }
        
        // Meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && this.config.site && this.config.site.description) {
            metaDescription.content = this.config.site.description;
        }
        
        // Meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords && this.config.site && this.config.site.keywords) {
            metaKeywords.content = this.config.site.keywords.join(', ');
        }
        
        // Author info
        if (this.config.author) {
            const authorMeta = document.querySelector('meta[name="author"]');
            if (authorMeta && this.config.author.name) {
                authorMeta.content = this.config.author.name;
            }
        }
        
        // Open Graph
        this.updateOpenGraphTags();
        
        console.log('✅ Site bilgileri güncellendi');
    }

    /**
     * Open Graph tag'lerini günceller
     */
    updateOpenGraphTags() {
        if (!this.config || !this.config.site) return;
        
        const ogTags = {
            'og:title': this.config.site.title,
            'og:description': this.config.site.description,
            'og:url': this.config.site.url
        };
        
        Object.entries(ogTags).forEach(([property, content]) => {
            if (content) {
                let metaTag = document.querySelector(`meta[property="${property}"]`);
                if (!metaTag) {
                    metaTag = document.createElement('meta');
                    metaTag.property = property;
                    document.head.appendChild(metaTag);
                }
                metaTag.content = content;
            }
        });
    }

    /**
     * Loading state'lerini kaldırır
     */
    removeLoadingStates() {
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(element => {
            element.style.opacity = '0';
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 300);
        });
    }

    /**
     * Global event listener'ları kurar
     */
    setupGlobalEventListeners() {
        // Window events
        window.addEventListener('error', (e) => {
            this.handleGlobalError(e);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            this.handleUnhandledRejection(e);
        });
        
        // Visibility change (sayfa focus/blur)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // Online/offline events
        window.addEventListener('online', () => {
            this.handleConnectionChange(true);
        });
        
        window.addEventListener('offline', () => {
            this.handleConnectionChange(false);
        });
        
        // Custom app events
        document.addEventListener('projectCardClick', (e) => {
            this.handleProjectCardClick(e.detail);
        });
        
        document.addEventListener('themechange', (e) => {
            this.handleThemeChange(e.detail);
        });
        
        console.log("✅ Global event listener'lar kuruldu");
    }

    /**
     * Performance monitoring kurar
     */
    setupPerformanceMonitoring() {
        // Page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log(`📊 Sayfa yükleme süresi: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
                }
            }, 0);
        });
        
        // Memory usage monitoring (Chrome)
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                    console.warn('⚠️ Yüksek memory kullanımı tespit edildi');
                }
            }, 30000); // 30 saniyede bir kontrol
        }
        
        console.log('✅ Performance monitoring kuruldu');
    }

    /**
     * App ready event'ini dispatch eder
     */
    dispatchAppReadyEvent() {
        const event = new CustomEvent('portfolioAppReady', {
            detail: {
                app: this,
                components: this.components,
                config: this.config,
                projects: this.projects,
                timestamp: Date.now()
            }
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Global error'ları handle eder
     * @param {ErrorEvent} error - Error event
     */
    handleGlobalError(error) {
        console.error('❌ Global JavaScript hatası:', error.error);
        
        // User-friendly error message
        this.showErrorNotification('Bir hata oluştu. Sayfa yenileniyor...');
        
        // Auto-reload after 3 seconds
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }

    /**
     * Unhandled promise rejection'ları handle eder
     * @param {PromiseRejectionEvent} event - Rejection event
     */
    handleUnhandledRejection(event) {
        console.error('❌ Unhandled Promise rejection:', event.reason);
        event.preventDefault(); // Prevent default browser behavior
    }

    /**
     * Visibility change'i handle eder
     */
    handleVisibilityChange() {
        if (document.hidden) {
            console.log('👁️ Sayfa gizlendi');
        } else {
            console.log('👁️ Sayfa görünür hale geldi');
            // Sayfa geri geldiğinde refresh gerekli mi kontrol et
        }
    }

    /**
     * Connection change'i handle eder
     * @param {boolean} isOnline - Online durumu
     */
    handleConnectionChange(isOnline) {
        if (isOnline) {
            console.log('🌐 İnternet bağlantısı geri geldi');
            this.showSuccessNotification('İnternet bağlantısı geri geldi');
        } else {
            console.log('📡 İnternet bağlantısı kesildi');
            this.showErrorNotification('İnternet bağlantısı kesildi');
        }
    }

    /**
     * Project card click'ini handle eder
     * @param {Object} detail - Click detail
     */
    handleProjectCardClick(detail) {
        console.log('🖱️ Proje kartı tıklandı:', detail.project.id);
        
        // Analytics tracking burada yapılabilir
        if (typeof gtag !== 'undefined') {
            gtag('event', 'project_card_click', {
                'project_id': detail.project.id,
                'project_title': detail.project.title
            });
        }
    }

    /**
     * Theme change'i handle eder
     * @param {Object} detail - Theme detail
     */
    handleThemeChange(detail) {
        console.log('🎨 Theme değişti:', detail.theme);
        
        // Theme-specific adjustments
        this.applyThemeSpecificStyles(detail.theme);
    }

    /**
     * Theme-specific style'ları uygular
     * @param {string} theme - Theme adı
     */
    applyThemeSpecificStyles(theme) {
        // Theme'e özel CSS class'ları ekle/çıkar
        document.body.classList.toggle('dark-theme', theme === 'dark');
        document.body.classList.toggle('light-theme', theme === 'light');
    }

    /**
     * Initialization error'ını handle eder
     * @param {Error} error - Hata objesi
     */
    handleInitializationError(error) {
        console.error('❌ Initialization hatası:', error);
        
        document.body.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gray-100">
                <div class="text-center p-8">
                    <h1 class="text-2xl font-bold text-red-600 mb-4">Uygulama Başlatılamadı</h1>
                    <p class="text-gray-600 mb-4">Bir hata oluştu ve uygulama başlatılamadı.</p>
                    <button onclick="window.location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Sayfayı Yenile
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Startup error'ını handle eder
     * @param {Error} error - Hata objesi
     */
    handleStartupError(error) {
        console.error('❌ Startup hatası:', error);
        this.showErrorNotification('Uygulama başlatılırken hata oluştu');
    }

    /**
     * Success notification gösterir
     * @param {string} message - Mesaj
     */
    showSuccessNotification(message) {
        this.showNotification(message, 'success');
    }

    /**
     * Error notification gösterir
     * @param {string} message - Mesaj
     */
    showErrorNotification(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Notification gösterir
     * @param {string} message - Mesaj
     * @param {string} type - Notification türü
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    /**
     * App durumunu döndürür
     * @returns {Object} App durumu
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            projectCount: this.projects.length,
            components: Object.keys(this.components),
            config: this.config ? 'loaded' : 'not loaded'
        };
    }
}

// Uygulamayı başlat
const app = new PortfolioApp();

// Global erişim için
window.portfolioApp = app;