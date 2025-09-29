/**
 * ProjectCard - Proje kartları için component class'ı
 */
class ProjectCard {
    constructor() {
        this.cardTemplate = null;
        this.init();
    }

    /**
     * ProjectCard'ı initialize eder
     */
    init() {
        this.createCardTemplate();
        console.log('✅ ProjectCard initialized');
    }

    /**
     * Proje kartı template'ini oluşturur
     */
    createCardTemplate() {
        this.cardTemplate = `
            <article class="project-card bg-surface rounded-xl shadow-lg hover:shadow-xl transition-smooth card-hover overflow-hidden group">
                <!-- Media Container -->
                <div class="media-container relative">
                    <!-- Media content will be inserted here -->
                </div>
                
                <!-- Card Content -->
                <div class="card-content p-6">
                    <!-- Featured Badge -->
                    <div class="featured-badge hidden absolute top-4 left-4 z-20">
                        <span class="bg-accent text-white text-xs font-semibold px-2 py-1 rounded-full">
                            ⭐ Öne Çıkan
                        </span>
                    </div>
                    
                    <!-- Project Title -->
                    <h3 class="project-title text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-smooth">
                        <!-- Title will be inserted here -->
                    </h3>
                    
                    <!-- Project Description -->
                    <p class="project-description text-text-secondary text-sm mb-4 line-clamp-3">
                        <!-- Description will be inserted here -->
                    </p>
                    
                    <!-- Technologies -->
                    <div class="technologies mb-4">
                        <div class="flex flex-wrap gap-2">
                            <!-- Technology badges will be inserted here -->
                        </div>
                    </div>
                    
                    <!-- Project Meta -->
                    <div class="project-meta flex items-center justify-between text-xs text-text-secondary mb-4">
                        <span class="project-date">
                            <!-- Date will be inserted here -->
                        </span>
                        <span class="project-category">
                            <!-- Category will be inserted here -->
                        </span>
                    </div>
                    
                    <!-- Project Links -->
                    <div class="project-links flex items-center justify-between">
                        <div class="links-left flex space-x-3">
                            <!-- Links will be inserted here -->
                        </div>
                        <div class="links-right">
                            <!-- Additional actions -->
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    /**
     * Proje kartı oluşturur
     * @param {Object} project - Proje verisi
     * @returns {HTMLElement} Proje kartı element'i
     */
    createCard(project) {
        if (!project || !project.id) {
            console.warn('⚠️ Geçersiz proje verisi:', project);
            return this.createErrorCard('Geçersiz proje verisi');
        }

        try {
            // Card container oluştur
            const cardElement = document.createElement('div');
            cardElement.innerHTML = this.cardTemplate;
            const card = cardElement.firstElementChild;
            
            // Card'a proje ID'sini ekle
            card.setAttribute('data-project-id', project.id);
            card.setAttribute('data-category', project.category || 'uncategorized');
            
            // Featured class'ını ekle
            if (project.featured) {
                card.classList.add('featured-project');
                card.querySelector('.featured-badge').classList.remove('hidden');
            }
            
            // Card content'ini doldur
            this.populateCardContent(card, project);
            
            // Media content'ini ekle
            this.populateMediaContent(card, project);
            
            // Event listener'ları ekle
            this.attachEventListeners(card, project);
            
            console.log(`✅ Proje kartı oluşturuldu: ${project.id}`);
            return card;
            
        } catch (error) {
            console.error(`❌ Proje kartı oluşturma hatası: ${project.id}`, error);
            return this.createErrorCard(`Kart oluşturma hatası: ${project.title || project.id}`);
        }
    }

    /**
     * Card content'ini doldurur
     * @param {HTMLElement} card - Card element'i
     * @param {Object} project - Proje verisi
     */
    populateCardContent(card, project) {
        // Title
        const titleElement = card.querySelector('.project-title');
        titleElement.textContent = project.title || 'Başlıksız Proje';
        
        // Description
        const descriptionElement = card.querySelector('.project-description');
        descriptionElement.textContent = project.description || 'Açıklama bulunmuyor.';
        
        // Technologies
        this.populateTechnologies(card, project.technologies || []);
        
        // Date
        const dateElement = card.querySelector('.project-date');
        if (project.date) {
            const formattedDate = this.formatDate(project.date);
            dateElement.innerHTML = `📅 ${formattedDate}`;
        } else {
            dateElement.style.display = 'none';
        }
        
        // Category
        const categoryElement = card.querySelector('.project-category');
        if (project.category) {
            categoryElement.innerHTML = `🏷️ ${project.category}`;
        } else {
            categoryElement.style.display = 'none';
        }
        
        // Links
        this.populateLinks(card, project.links || {});
    }

    /**
     * Technology badge'lerini oluşturur
     * @param {HTMLElement} card - Card element'i
     * @param {Array} technologies - Teknoloji listesi
     */
    populateTechnologies(card, technologies) {
        const techContainer = card.querySelector('.technologies .flex');
        
        if (!Array.isArray(technologies) || technologies.length === 0) {
            card.querySelector('.technologies').style.display = 'none';
            return;
        }
        
        technologies.forEach(tech => {
            const badge = document.createElement('span');
            badge.className = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-smooth';
            badge.textContent = tech;
            techContainer.appendChild(badge);
        });
    }

    /**
     * Proje linklerini oluşturur
     * @param {HTMLElement} card - Card element'i
     * @param {Object} links - Link objeleri
     */
    populateLinks(card, links) {
        const linksContainer = card.querySelector('.links-left');
        
        const linkConfigs = [
            { key: 'github', label: 'GitHub', icon: this.getGitHubIcon(), className: 'hover:text-gray-900 dark:hover:text-white' },
            { key: 'live', label: 'Demo', icon: this.getExternalIcon(), className: 'hover:text-primary' },
            { key: 'documentation', label: 'Docs', icon: this.getDocIcon(), className: 'hover:text-blue-600' }
        ];
        
        linkConfigs.forEach(config => {
            if (links[config.key]) {
                const linkElement = this.createLinkElement(links[config.key], config);
                linksContainer.appendChild(linkElement);
            }
        });
        
        // Eğer hiç link yoksa placeholder göster
        if (linksContainer.children.length === 0) {
            const placeholder = document.createElement('span');
            placeholder.className = 'text-text-secondary text-xs';
            placeholder.textContent = 'Link bulunmuyor';
            linksContainer.appendChild(placeholder);
        }
    }

    /**
     * Link element'i oluşturur
     * @param {string} url - Link URL'i
     * @param {Object} config - Link konfigürasyonu
     * @returns {HTMLElement} Link element'i
     */
    createLinkElement(url, config) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = `inline-flex items-center space-x-1 text-text-secondary ${config.className} transition-smooth text-sm`;
        link.innerHTML = `
            ${config.icon}
            <span>${config.label}</span>
        `;
        
        // Analytics tracking (opsiyonel)
        link.addEventListener('click', () => {
            console.log(`🔗 Link tıklandı: ${config.label} - ${url}`);
        });
        
        return link;
    }

    /**
     * Media content'ini card'a ekler
     * @param {HTMLElement} card - Card element'i
     * @param {Object} project - Proje verisi
     */
    populateMediaContent(card, project) {
        const mediaContainer = card.querySelector('.media-container');
        
        if (!project.media || !window.mediaHandler) {
            // Placeholder media
            const placeholder = this.createMediaPlaceholder();
            mediaContainer.appendChild(placeholder);
            return;
        }
        
        try {
            const mediaElement = window.mediaHandler.renderMedia(project.media, project.id);
            mediaContainer.appendChild(mediaElement);
        } catch (error) {
            console.error(`❌ Media render hatası: ${project.id}`, error);
            const placeholder = this.createMediaPlaceholder('Medya yüklenemedi');
            mediaContainer.appendChild(placeholder);
        }
    }

    /**
     * Media placeholder oluşturur
     * @param {string} message - Placeholder mesajı
     * @returns {HTMLElement} Placeholder element'i
     */
    createMediaPlaceholder(message = 'Medya bulunmuyor') {
        const placeholder = document.createElement('div');
        placeholder.className = 'w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center';
        placeholder.innerHTML = `
            <div class="text-center text-gray-500">
                <svg class="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p class="text-sm">${message}</p>
            </div>
        `;
        return placeholder;
    }

    /**
     * Event listener'ları card'a ekler
     * @param {HTMLElement} card - Card element'i
     * @param {Object} project - Proje verisi
     */
    attachEventListeners(card, project) {
        // Card click event (detay sayfasına yönlendirme için)
        card.addEventListener('click', (e) => {
            // Link'lere tıklandığında card click'ini engelle
            if (e.target.closest('a')) {
                return;
            }
            
            this.handleCardClick(project, e);
        });
        
        // Keyboard navigation
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleCardClick(project, e);
            }
        });
        
        // Hover analytics (opsiyonel)
        card.addEventListener('mouseenter', () => {
            console.log(`👀 Proje kartı görüntülendi: ${project.id}`);
        });
    }

    /**
     * Card click event'ini handle eder
     * @param {Object} project - Proje verisi
     * @param {Event} event - Click event'i
     */
    handleCardClick(project, event) {
        console.log(`🖱️ Proje kartına tıklandı: ${project.id}`);
        
        // Custom event dispatch et
        const cardClickEvent = new CustomEvent('projectCardClick', {
            detail: {
                project: project,
                element: event.currentTarget
            }
        });
        
        document.dispatchEvent(cardClickEvent);
        
        // Varsayılan davranış: İlk mevcut link'e yönlendir
        if (project.links) {
            const firstLink = project.links.live || project.links.github || project.links.documentation;
            if (firstLink) {
                window.open(firstLink, '_blank', 'noopener,noreferrer');
            }
        }
    }

    /**
     * Error card oluşturur
     * @param {string} message - Hata mesajı
     * @returns {HTMLElement} Error card element'i
     */
    createErrorCard(message) {
        const errorCard = document.createElement('div');
        errorCard.className = 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center';
        errorCard.innerHTML = `
            <div class="text-red-600 dark:text-red-400">
                <svg class="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-sm font-medium">${message}</p>
            </div>
        `;
        return errorCard;
    }

    /**
     * Tarihi formatlar
     * @param {string} dateString - Tarih string'i
     * @returns {string} Formatlanmış tarih
     */
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            return date.toLocaleDateString('tr-TR', options);
        } catch (error) {
            return dateString;
        }
    }

    /**
     * GitHub icon SVG'sini döndürür
     * @returns {string} SVG string
     */
    getGitHubIcon() {
        return `
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
        `;
    }

    /**
     * External link icon SVG'sini döndürür
     * @returns {string} SVG string
     */
    getExternalIcon() {
        return `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
        `;
    }

    /**
     * Documentation icon SVG'sini döndürür
     * @returns {string} SVG string
     */
    getDocIcon() {
        return `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
        `;
    }
}

// Global instance oluştur
window.projectCard = new ProjectCard();