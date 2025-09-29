/**
 * ThemeManager - Dark/Light theme yönetimi
 */
class ThemeManager {
    constructor() {
        this.themeToggleBtn = document.getElementById('theme-toggle');
        this.darkIcon = document.getElementById('theme-toggle-dark-icon');
        this.lightIcon = document.getElementById('theme-toggle-light-icon');
        this.htmlElement = document.documentElement;
        
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        
        this.init();
    }

    /**
     * Theme manager'ı initialize eder
     */
    init() {
        this.applyTheme(this.currentTheme);
        this.updateIcons();
        this.setupEventListeners();
        this.watchSystemTheme();
        
        console.log(`✅ Theme Manager initialized - Current theme: ${this.currentTheme}`);
    }

    /**
     * Event listener'ları kurar
     */
    setupEventListeners() {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Keyboard shortcut (Ctrl/Cmd + Shift + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    /**
     * Theme'i toggle eder
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Smooth transition effect
        this.addTransitionEffect();
    }

    /**
     * Belirtilen theme'i uygular
     * @param {string} theme - 'light' veya 'dark'
     */
    setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') {
            console.warn(`⚠️ Geçersiz theme: ${theme}. 'light' veya 'dark' olmalı.`);
            return;
        }

        this.currentTheme = theme;
        this.applyTheme(theme);
        this.storeTheme(theme);
        this.updateIcons();
        this.dispatchThemeChangeEvent();
        
        console.log(`🎨 Theme değiştirildi: ${theme}`);
    }

    /**
     * Theme'i DOM'a uygular
     * @param {string} theme - Uygulanacak theme
     */
    applyTheme(theme) {
        // HTML class'ını güncelle
        this.htmlElement.classList.remove('light', 'dark');
        this.htmlElement.classList.add(theme);
        
        // Meta theme-color'ı güncelle
        this.updateMetaThemeColor(theme);
        
        // Body background'unu güncelle (Tailwind class'ları için)
        document.body.className = document.body.className
            .replace(/bg-\w+-\w+/g, '')
            .replace(/text-\w+-\w+/g, '');
        
        document.body.classList.add(
            theme === 'dark' ? 'bg-gray-900' : 'bg-white',
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        );
    }

    /**
     * Theme icon'larını günceller
     */
    updateIcons() {
        if (!this.darkIcon || !this.lightIcon) return;

        if (this.currentTheme === 'dark') {
            this.darkIcon.classList.add('hidden');
            this.lightIcon.classList.remove('hidden');
        } else {
            this.darkIcon.classList.remove('hidden');
            this.lightIcon.classList.add('hidden');
        }
    }

    /**
     * Meta theme-color'ı günceller
     * @param {string} theme - Theme adı
     */
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const color = theme === 'dark' ? '#0f172a' : '#ffffff';
        metaThemeColor.content = color;
    }

    /**
     * Theme'i localStorage'a kaydeder
     * @param {string} theme - Kaydedilecek theme
     */
    storeTheme(theme) {
        try {
            localStorage.setItem('portfolio-theme', theme);
        } catch (error) {
            console.warn('⚠️ Theme localStorage\'a kaydedilemedi:', error);
        }
    }

    /**
     * Kaydedilmiş theme'i localStorage'dan alır
     * @returns {string|null} Kaydedilmiş theme veya null
     */
    getStoredTheme() {
        try {
            return localStorage.getItem('portfolio-theme');
        } catch (error) {
            console.warn('⚠️ Theme localStorage\'dan okunamadı:', error);
            return null;
        }
    }

    /**
     * Sistem theme tercihini alır
     * @returns {string} 'light' veya 'dark'
     */
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    /**
     * Sistem theme değişikliklerini dinler
     */
    watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // Sadece kullanıcı manuel olarak theme seçmemişse sistem theme'ini takip et
                if (!this.getStoredTheme()) {
                    const systemTheme = e.matches ? 'dark' : 'light';
                    this.setTheme(systemTheme);
                }
            });
        }
    }

    /**
     * Theme değişikliği event'ini dispatch eder
     */
    dispatchThemeChangeEvent() {
        const event = new CustomEvent('themechange', {
            detail: {
                theme: this.currentTheme,
                timestamp: Date.now()
            }
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Smooth transition effect ekler
     */
    addTransitionEffect() {
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    /**
     * Mevcut theme'i döndürür
     * @returns {string} Mevcut theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Theme'in dark olup olmadığını kontrol eder
     * @returns {boolean} Dark theme ise true
     */
    isDarkTheme() {
        return this.currentTheme === 'dark';
    }

    /**
     * Theme'i sistem tercihi ile senkronize eder
     */
    syncWithSystem() {
        const systemTheme = this.getSystemTheme();
        this.setTheme(systemTheme);
        
        // localStorage'dan kaldır ki sistem theme'ini takip etsin
        try {
            localStorage.removeItem('portfolio-theme');
        } catch (error) {
            console.warn('⚠️ Theme localStorage\'dan silinemedi:', error);
        }
    }

    /**
     * Theme manager'ı destroy eder
     */
    destroy() {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.removeEventListener('click', this.toggleTheme);
        }
        
        document.removeEventListener('keydown', this.setupEventListeners);
        
        console.log('🗑️ Theme Manager destroyed');
    }
}

// Global instance oluştur
window.themeManager = new ThemeManager();