/**
 * ProjectGrid - Proje grid'i yönetimi
 */
class ProjectGrid {
    constructor(containerSelector = '#projects-grid') {
        this.container = document.querySelector(containerSelector);
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilter = 'all';
        this.currentSort = 'featured';
        this.isLoading = false;
        
        this.init();
    }

    /**
     * ProjectGrid'i initialize eder
     */
    init() {
        if (!this.container) {
            console.error('❌ Projects grid container bulunamadı');
            return;
        }
        
        this.setupGridLayout();
        this.setupEventListeners();
        
        console.log('✅ ProjectGrid initialized');
    }

    /**
     * Grid layout'unu kurar
     */
    setupGridLayout() {
        // Grid container class'larını ayarla
        this.container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-300';
        
        // Responsive breakpoint handling
        this.handleResponsiveLayout();
    }

    /**
     * Event listener'ları kurar
     */
    setupEventListeners() {
        // Window resize event
        window.addEventListener('resize', () => {
            this.debounce(() => {
                this.handleResponsiveLayout();
            }, 250)();
        });
        
        // Project card click events
        document.addEventListener('projectCardClick', (e) => {
            this.handleProjectCardClick(e.detail);
        });
        
        // Theme change events
        document.addEventListener('themechange', (e) => {
            this.handleThemeChange(e.detail);
        });
    }

    /**
     * Projeleri grid'e yükler
     * @param {Array} projects - Proje listesi
     */
    async loadProjects(projects) {
        if (!Array.isArray(projects)) {
            console.error('❌ Geçersiz proje listesi:', projects);
            return;
        }
        
        this.isLoading = true;
        this.showLoadingState();
        
        try {
            this.projects = projects;
            this.filteredProjects = [...projects];
            
            // Varsayılan sıralama uygula
            this.applySorting(this.currentSort);
            
            // Grid'i render et
            await this.renderGrid();
            
            console.log(`✅ ${projects.length} proje grid'e yüklendi`);
            
        } catch (error) {
            console.error('❌ Proje yükleme hatası:', error);
            this.showErrorState('Projeler yüklenirken hata oluştu');
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Grid'i render eder
     */
    async renderGrid() {
        if (!window.projectCard) {
            console.error('❌ ProjectCard component bulunamadı');
            return;
        }
        
        // Container'ı temizle
        this.container.innerHTML = '';
        
        if (this.filteredProjects.length === 0) {
            this.showEmptyState();
            return;
        }
        
        // Projeleri render et
        const fragment = document.createDocumentFragment();
        
        for (const project of this.filteredProjects) {
            try {
                const cardElement = window.projectCard.createCard(project);
                
                // Fade-in animation için
                cardElement.style.opacity = '0';
                cardElement.style.transform = 'translateY(20px)';
                
                fragment.appendChild(cardElement);
            } catch (error) {
                console.error(`❌ Proje kartı render hatası: ${project.id}`, error);
            }
        }
        
        this.container.appendChild(fragment);
        
        // Animate cards
        this.animateCardsIn();
    }

    /**
     * Kartları animate eder
     */
    animateCardsIn() {
        const cards = this.container.querySelectorAll('.project-card');
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    /**
     * Projeleri kategoriye göre filtreler
     * @param {string} category - Kategori ('all' veya kategori adı)
     */
    filterByCategory(category = 'all') {
        this.currentFilter = category;
        
        if (category === 'all') {
            this.filteredProjects = [...this.projects];
        } else {
            this.filteredProjects = this.projects.filter(project => 
                project.category && project.category.toLowerCase() === category.toLowerCase()
            );
        }
        
        this.applySorting(this.currentSort);
        this.renderGrid();
        
        console.log(`🔍 Kategori filtresi uygulandı: ${category} (${this.filteredProjects.length} proje)`);
    }

    /**
     * Projeleri sıralar
     * @param {string} sortType - Sıralama türü ('featured', 'date-desc', 'date-asc', 'title')
     */
    applySorting(sortType = 'featured') {
        this.currentSort = sortType;
        
        switch (sortType) {
            case 'featured':
                this.filteredProjects.sort((a, b) => {
                    // Featured projeler önce
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    
                    // Sonra tarihe göre (yeni önce)
                    return new Date(b.date) - new Date(a.date);
                });
                break;
                
            case 'date-desc':
                this.filteredProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
                
            case 'date-asc':
                this.filteredProjects.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
                
            case 'title':
                this.filteredProjects.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
                break;
                
            default:
                console.warn(`⚠️ Bilinmeyen sıralama türü: ${sortType}`);
        }
        
        console.log(`📊 Sıralama uygulandı: ${sortType}`);
    }

    /**
     * Proje arama işlemi
     * @param {string} query - Arama sorgusu
     */
    searchProjects(query) {
        if (!query || query.trim() === '') {
            this.filteredProjects = [...this.projects];
        } else {
            const searchTerm = query.toLowerCase().trim();
            
            this.filteredProjects = this.projects.filter(project => {
                // Title'da ara
                if (project.title && project.title.toLowerCase().includes(searchTerm)) {
                    return true;
                }
                
                // Description'da ara
                if (project.description && project.description.toLowerCase().includes(searchTerm)) {
                    return true;
                }
                
                // Technologies'de ara
                if (project.technologies && Array.isArray(project.technologies)) {
                    return project.technologies.some(tech => 
                        tech.toLowerCase().includes(searchTerm)
                    );
                }
                
                return false;
            });
        }
        
        this.applySorting(this.currentSort);
        this.renderGrid();
        
        console.log(`🔍 Arama yapıldı: "${query}" (${this.filteredProjects.length} sonuç)`);
    }

    /**
     * Loading state'ini gösterir
     */
    showLoadingState() {
        this.container.innerHTML = `
            <div class="col-span-full flex items-center justify-center py-16">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p class="text-text-secondary">Projeler yükleniyor...</p>
                </div>
            </div>
        `;
    }

    /**
     * Empty state'ini gösterir
     */
    showEmptyState() {
        const message = this.currentFilter === 'all' 
            ? 'Henüz proje bulunmuyor.' 
            : `"${this.currentFilter}" kategorisinde proje bulunamadı.`;
            
        this.container.innerHTML = `
            <div class="col-span-full flex items-center justify-center py-16">
                <div class="text-center">
                    <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-text-primary mb-2">Proje Bulunamadı</h3>
                    <p class="text-text-secondary">${message}</p>
                    ${this.currentFilter !== 'all' ? `
                        <button onclick="window.projectGrid.filterByCategory('all')" class="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-smooth">
                            Tüm Projeleri Göster
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Error state'ini gösterir
     * @param {string} message - Hata mesajı
     */
    showErrorState(message) {
        this.container.innerHTML = `
            <div class="col-span-full flex items-center justify-center py-16">
                <div class="text-center">
                    <svg class="mx-auto h-24 w-24 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-text-primary mb-2">Hata Oluştu</h3>
                    <p class="text-text-secondary mb-4">${message}</p>
                    <button onclick="window.location.reload()" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-smooth">
                        Sayfayı Yenile
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Responsive layout'u handle eder
     */
    handleResponsiveLayout() {
        const width = window.innerWidth;
        
        // Grid columns'unu ekran boyutuna göre ayarla
        if (width < 768) {
            // Mobile: 1 column
            this.container.className = this.container.className.replace(/grid-cols-\d+/g, 'grid-cols-1');
        } else if (width < 1024) {
            // Tablet: 2 columns
            this.container.className = this.container.className.replace(/lg:grid-cols-\d+/g, 'lg:grid-cols-2');
        } else {
            // Desktop: 3 columns
            this.container.className = this.container.className.replace(/lg:grid-cols-\d+/g, 'lg:grid-cols-3');
        }
    }

    /**
     * Project card click'ini handle eder
     * @param {Object} detail - Click event detayı
     */
    handleProjectCardClick(detail) {
        const { project, element } = detail;
        
        // Analytics tracking
        console.log(`📊 Proje kartı etkileşimi: ${project.id}`);
        
        // Custom handling (modal açma, detay sayfası vb.)
        // Bu kısım ihtiyaca göre genişletilebilir
    }

    /**
     * Theme change'i handle eder
     * @param {Object} detail - Theme change detayı
     */
    handleThemeChange(detail) {
        // Grid'deki kartların theme'ini güncelle
        const cards = this.container.querySelectorAll('.project-card');
        cards.forEach(card => {
            // Theme-specific adjustments if needed
        });
        
        console.log(`🎨 Grid theme güncellendi: ${detail.theme}`);
    }

    /**
     * Debounce utility function
     * @param {Function} func - Debounce edilecek fonksiyon
     * @param {number} wait - Bekleme süresi (ms)
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Grid istatistiklerini döndürür
     * @returns {Object} Grid istatistikleri
     */
    getStats() {
        return {
            totalProjects: this.projects.length,
            filteredProjects: this.filteredProjects.length,
            currentFilter: this.currentFilter,
            currentSort: this.currentSort,
            isLoading: this.isLoading
        };
    }

    /**
     * Grid'i yeniler
     */
    refresh() {
        if (this.projects.length > 0) {
            this.renderGrid();
        }
    }

    /**
     * Grid'i temizler
     */
    clear() {
        this.container.innerHTML = '';
        this.projects = [];
        this.filteredProjects = [];
    }
}

// Global instance oluştur
window.projectGrid = new ProjectGrid();