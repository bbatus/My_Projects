/**
 * MediaHandler - Çoklu medya türleri için handler class'ı
 */
class MediaHandler {
    constructor() {
        this.supportedTypes = ['video', 'image', 'youtube', 'multiple'];
        this.loadingStates = new Map();
        this.errorStates = new Map();
        
        this.init();
    }

    /**
     * MediaHandler'ı initialize eder
     */
    init() {
        this.createPlaceholderImage();
        console.log('✅ MediaHandler initialized');
    }

    /**
     * Media content'ini render eder
     * @param {Object} mediaConfig - Media konfigürasyonu
     * @param {string} projectId - Proje ID'si
     * @returns {HTMLElement} Render edilmiş media element'i
     */
    renderMedia(mediaConfig, projectId = 'unknown') {
        if (!mediaConfig || !mediaConfig.type) {
            console.warn('⚠️ Geçersiz media konfigürasyonu:', mediaConfig);
            return this.createErrorElement('Geçersiz medya konfigürasyonu');
        }

        if (!this.supportedTypes.includes(mediaConfig.type)) {
            console.warn(`⚠️ Desteklenmeyen medya türü: ${mediaConfig.type}`);
            return this.createErrorElement(`Desteklenmeyen medya türü: ${mediaConfig.type}`);
        }

        try {
            switch (mediaConfig.type) {
                case 'video':
                    return this.createVideoElement(mediaConfig.content.video, projectId);
                case 'image':
                    return this.createImageElement(mediaConfig.content.image, projectId);
                case 'youtube':
                    return this.createYouTubeEmbed(mediaConfig.content.youtube, projectId);
                case 'multiple':
                    return this.createMediaCarousel(mediaConfig.content.multiple, projectId);
                default:
                    return this.createErrorElement('Bilinmeyen medya türü');
            }
        } catch (error) {
            console.error('❌ Media render hatası:', error);
            return this.createErrorElement('Medya yüklenirken hata oluştu');
        }
    }

    /**
     * Video element'i oluşturur
     * @param {string} videoSrc - Video kaynak URL'i
     * @param {string} projectId - Proje ID'si
     * @returns {HTMLElement} Video container element'i
     */
    createVideoElement(videoSrc, projectId) {
        if (!videoSrc) {
            return this.createErrorElement('Video kaynağı bulunamadı');
        }

        const container = document.createElement('div');
        container.className = 'relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden';
        
        const video = document.createElement('video');
        video.className = 'w-full h-full object-cover';
        video.controls = true;
        video.preload = 'metadata';
        video.setAttribute('data-project-id', projectId);
        
        // Loading state
        const loadingElement = this.createLoadingElement();
        container.appendChild(loadingElement);
        
        // Video load event handlers
        video.addEventListener('loadedmetadata', () => {
            container.removeChild(loadingElement);
            console.log(`✅ Video yüklendi: ${projectId}`);
        });
        
        video.addEventListener('error', (e) => {
            this.handleVideoError(video, container, projectId);
        });
        
        video.src = videoSrc;
        container.appendChild(video);
        
        return container;
    }

    /**
     * Image element'i oluşturur
     * @param {string} imageSrc - Resim kaynak URL'i
     * @param {string} projectId - Proje ID'si
     * @param {string} alt - Alt text
     * @returns {HTMLElement} Image container element'i
     */
    createImageElement(imageSrc, projectId, alt = '') {
        if (!imageSrc) {
            return this.createErrorElement('Resim kaynağı bulunamadı');
        }

        const container = document.createElement('div');
        container.className = 'relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden';
        
        const img = document.createElement('img');
        img.className = 'w-full h-full object-cover transition-smooth hover:scale-105';
        img.alt = alt || `${projectId} proje resmi`;
        img.setAttribute('data-project-id', projectId);
        
        // Loading state
        const loadingElement = this.createLoadingElement();
        container.appendChild(loadingElement);
        
        // Image load event handlers
        img.addEventListener('load', () => {
            container.removeChild(loadingElement);
            console.log(`✅ Resim yüklendi: ${projectId}`);
        });
        
        img.addEventListener('error', (e) => {
            this.handleImageError(img, container, projectId);
        });
        
        // Lazy loading
        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        }
        
        img.src = imageSrc;
        container.appendChild(img);
        
        return container;
    }

    /**
     * YouTube embed'i oluşturur
     * @param {string} videoId - YouTube video ID'si
     * @param {string} projectId - Proje ID'si
     * @returns {HTMLElement} YouTube container element'i
     */
    createYouTubeEmbed(videoId, projectId) {
        if (!videoId) {
            return this.createErrorElement('YouTube video ID\'si bulunamadı');
        }

        // YouTube video ID'sini temizle (URL'den ID çıkar)
        const cleanVideoId = this.extractYouTubeId(videoId);
        
        if (!cleanVideoId) {
            return this.createErrorElement('Geçersiz YouTube video ID\'si');
        }

        const container = document.createElement('div');
        container.className = 'relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden';
        
        const iframe = document.createElement('iframe');
        iframe.className = 'w-full h-full';
        iframe.src = `https://www.youtube.com/embed/${cleanVideoId}?rel=0&modestbranding=1`;
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.setAttribute('data-project-id', projectId);
        iframe.title = `${projectId} YouTube videosu`;
        
        // Loading state
        const loadingElement = this.createLoadingElement();
        container.appendChild(loadingElement);
        
        // Iframe load event
        iframe.addEventListener('load', () => {
            if (container.contains(loadingElement)) {
                container.removeChild(loadingElement);
            }
            console.log(`✅ YouTube video yüklendi: ${projectId}`);
        });
        
        container.appendChild(iframe);
        
        return container;
    }

    /**
     * Multiple media carousel'ini oluşturur
     * @param {Array} mediaItems - Media item'ları
     * @param {string} projectId - Proje ID'si
     * @returns {HTMLElement} Carousel container element'i
     */
    createMediaCarousel(mediaItems, projectId) {
        if (!Array.isArray(mediaItems) || mediaItems.length === 0) {
            return this.createErrorElement('Medya öğeleri bulunamadı');
        }

        const container = document.createElement('div');
        container.className = 'relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden';
        container.setAttribute('data-project-id', projectId);
        
        // Carousel content container
        const carouselContent = document.createElement('div');
        carouselContent.className = 'relative w-full h-full';
        
        // Media items container
        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'w-full h-full';
        
        // Tab navigation (eğer birden fazla item varsa)
        if (mediaItems.length > 1) {
            const tabNav = this.createTabNavigation(mediaItems, projectId);
            container.appendChild(tabNav);
        }
        
        // İlk media item'ını göster
        const firstMediaConfig = {
            type: mediaItems[0].type,
            content: { [mediaItems[0].type]: mediaItems[0].src }
        };
        
        const firstMediaElement = this.renderMedia(firstMediaConfig, `${projectId}-0`);
        mediaContainer.appendChild(firstMediaElement);
        
        carouselContent.appendChild(mediaContainer);
        container.appendChild(carouselContent);
        
        // Carousel data'sını element'e kaydet
        container._mediaItems = mediaItems;
        container._currentIndex = 0;
        container._mediaContainer = mediaContainer;
        
        return container;
    }

    /**
     * Tab navigation oluşturur
     * @param {Array} mediaItems - Media item'ları
     * @param {string} projectId - Proje ID'si
     * @returns {HTMLElement} Tab navigation element'i
     */
    createTabNavigation(mediaItems, projectId) {
        const tabNav = document.createElement('div');
        tabNav.className = 'absolute top-2 right-2 z-10 flex space-x-1';
        
        mediaItems.forEach((item, index) => {
            const tab = document.createElement('button');
            tab.className = `px-2 py-1 text-xs rounded ${
                index === 0 
                    ? 'bg-primary text-white' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
            } transition-smooth`;
            tab.textContent = item.title || this.getMediaTypeLabel(item.type);
            tab.setAttribute('data-index', index);
            
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchCarouselItem(tab.closest('[data-project-id]'), index);
            });
            
            tabNav.appendChild(tab);
        });
        
        return tabNav;
    }

    /**
     * Carousel item'ını değiştirir
     * @param {HTMLElement} carouselContainer - Carousel container
     * @param {number} index - Yeni index
     */
    switchCarouselItem(carouselContainer, index) {
        const mediaItems = carouselContainer._mediaItems;
        const mediaContainer = carouselContainer._mediaContainer;
        const projectId = carouselContainer.getAttribute('data-project-id');
        
        if (!mediaItems || index >= mediaItems.length) return;
        
        // Tab navigation'ı güncelle
        const tabs = carouselContainer.querySelectorAll('button[data-index]');
        tabs.forEach((tab, i) => {
            if (i === index) {
                tab.className = tab.className.replace('bg-white/80 text-gray-700', 'bg-primary text-white');
            } else {
                tab.className = tab.className.replace('bg-primary text-white', 'bg-white/80 text-gray-700');
            }
        });
        
        // Media content'ini değiştir
        const newMediaConfig = {
            type: mediaItems[index].type,
            content: { [mediaItems[index].type]: mediaItems[index].src }
        };
        
        const newMediaElement = this.renderMedia(newMediaConfig, `${projectId}-${index}`);
        
        // Fade transition
        mediaContainer.style.opacity = '0';
        setTimeout(() => {
            mediaContainer.innerHTML = '';
            mediaContainer.appendChild(newMediaElement);
            mediaContainer.style.opacity = '1';
        }, 150);
        
        carouselContainer._currentIndex = index;
    }

    /**
     * Media type label'ını döndürür
     * @param {string} type - Media türü
     * @returns {string} Label
     */
    getMediaTypeLabel(type) {
        const labels = {
            'video': 'Video',
            'image': 'Resim',
            'youtube': 'YouTube'
        };
        return labels[type] || type;
    }

    /**
     * Loading element'i oluşturur
     * @returns {HTMLElement} Loading element'i
     */
    createLoadingElement() {
        const loading = document.createElement('div');
        loading.className = 'absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800';
        loading.innerHTML = `
            <div class="flex items-center space-x-2 text-gray-500">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span class="text-sm">Yükleniyor...</span>
            </div>
        `;
        return loading;
    }

    /**
     * Error element'i oluşturur
     * @param {string} message - Hata mesajı
     * @returns {HTMLElement} Error element'i
     */
    createErrorElement(message) {
        const error = document.createElement('div');
        error.className = 'w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center';
        error.innerHTML = `
            <div class="text-center text-gray-500">
                <svg class="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-sm">${message}</p>
            </div>
        `;
        return error;
    }

    /**
     * Placeholder image oluşturur
     */
    createPlaceholderImage() {
        // SVG placeholder oluştur
        const svg = `
            <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f3f4f6"/>
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">
                    Resim Yüklenemedi
                </text>
            </svg>
        `;
        
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        this.placeholderUrl = URL.createObjectURL(blob);
    }

    /**
     * Video error'ını handle eder
     * @param {HTMLVideoElement} video - Video element'i
     * @param {HTMLElement} container - Container element'i
     * @param {string} projectId - Proje ID'si
     */
    handleVideoError(video, container, projectId) {
        console.error(`❌ Video yükleme hatası: ${projectId}`, video.error);
        
        const errorElement = this.createErrorElement('Video yüklenemedi');
        container.innerHTML = '';
        container.appendChild(errorElement);
        
        this.errorStates.set(projectId, 'video-error');
    }

    /**
     * Image error'ını handle eder
     * @param {HTMLImageElement} img - Image element'i
     * @param {HTMLElement} container - Container element'i
     * @param {string} projectId - Proje ID'si
     */
    handleImageError(img, container, projectId) {
        console.error(`❌ Resim yükleme hatası: ${projectId}`);
        
        if (this.placeholderUrl) {
            img.src = this.placeholderUrl;
            img.alt = 'Resim yüklenemedi';
        } else {
            const errorElement = this.createErrorElement('Resim yüklenemedi');
            container.innerHTML = '';
            container.appendChild(errorElement);
        }
        
        this.errorStates.set(projectId, 'image-error');
    }

    /**
     * YouTube video ID'sini extract eder
     * @param {string} input - YouTube URL veya video ID
     * @returns {string|null} Video ID veya null
     */
    extractYouTubeId(input) {
        if (!input) return null;
        
        // Eğer sadece ID ise direkt döndür
        if (input.length === 11 && !/[\/\?&=]/.test(input)) {
            return input;
        }
        
        // YouTube URL pattern'leri
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /youtube\.com\/v\/([^&\n?#]+)/
        ];
        
        for (const pattern of patterns) {
            const match = input.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    }

    /**
     * Media type'ını detect eder
     * @param {string} src - Kaynak URL'i
     * @returns {string} Detected media type
     */
    detectMediaType(src) {
        if (!src) return 'unknown';
        
        const extension = src.split('.').pop().toLowerCase();
        const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        
        if (videoExtensions.includes(extension)) return 'video';
        if (imageExtensions.includes(extension)) return 'image';
        if (src.includes('youtube.com') || src.includes('youtu.be')) return 'youtube';
        
        return 'unknown';
    }
}

// Global instance oluştur
window.mediaHandler = new MediaHandler();