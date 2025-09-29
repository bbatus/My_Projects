/**
 * Navigation - Navigation ve mobile menu yönetimi
 */
class Navigation {
    constructor() {
        this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navLinks = document.querySelectorAll('nav a[href^="#"]');
        this.isMenuOpen = false;
        
        this.init();
    }

    /**
     * Navigation'ı initialize eder
     */
    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveLinks();
        this.setupScrollSpy();
        
        console.log('✅ Navigation initialized');
    }

    /**
     * Mobile menu toggle functionality'sini kurar
     */
    setupMobileMenu() {
        if (!this.mobileMenuToggle || !this.mobileMenu) return;

        this.mobileMenuToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Mobile menu linklerine tıklandığında menüyü kapat
        const mobileLinks = this.mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Dışarı tıklandığında menüyü kapat
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.mobileMenu.contains(e.target) && 
                !this.mobileMenuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // ESC tuşu ile menüyü kapat
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Mobile menüyü toggle eder
     */
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * Mobile menüyü açar
     */
    openMobileMenu() {
        this.mobileMenu.classList.remove('hidden');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        this.isMenuOpen = true;
        
        // Animasyon için
        setTimeout(() => {
            this.mobileMenu.classList.add('animate-fade-in');
        }, 10);
    }

    /**
     * Mobile menüyü kapatır
     */
    closeMobileMenu() {
        this.mobileMenu.classList.add('hidden');
        this.mobileMenu.classList.remove('animate-fade-in');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        this.isMenuOpen = false;
    }

    /**
     * Smooth scrolling'i kurar
     */
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.scrollToElement(targetElement);
                }
            });
        });
    }

    /**
     * Belirtilen elemente smooth scroll yapar
     * @param {HTMLElement} element - Scroll yapılacak element
     */
    scrollToElement(element) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const elementPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Active link highlighting'i kurar
     */
    setupActiveLinks() {
        // Sayfa yüklendiğinde URL hash'ine göre active link'i ayarla
        this.updateActiveLink();
        
        // Hash değişikliklerini dinle
        window.addEventListener('hashchange', () => {
            this.updateActiveLink();
        });
    }

    /**
     * Active link'i günceller
     */
    updateActiveLink() {
        const currentHash = window.location.hash || '#hero';
        
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href === currentHash) {
                link.classList.add('text-primary', 'font-semibold');
                link.classList.remove('text-text-secondary');
            } else {
                link.classList.remove('text-primary', 'font-semibold');
                link.classList.add('text-text-secondary');
            }
        });
    }

    /**
     * Scroll spy functionality'sini kurar
     */
    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const headerHeight = document.querySelector('header').offsetHeight;
        
        const observerOptions = {
            root: null,
            rootMargin: `-${headerHeight + 50}px 0px -50% 0px`,
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.setActiveNavLink(sectionId);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Belirtilen section için nav link'i active yapar
     * @param {string} sectionId - Section ID'si
     */
    setActiveNavLink(sectionId) {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            
            if (href === sectionId) {
                link.classList.add('text-primary', 'font-semibold');
                link.classList.remove('text-text-secondary');
            } else {
                link.classList.remove('text-primary', 'font-semibold');
                link.classList.add('text-text-secondary');
            }
        });
        
        // URL hash'ini güncelle (history'ye ekleme)
        if (window.location.hash !== `#${sectionId}`) {
            history.replaceState(null, null, `#${sectionId}`);
        }
    }

    /**
     * Responsive breakpoint değişikliklerini handle eder
     */
    handleResize() {
        // Desktop'ta mobile menüyü kapat
        if (window.innerWidth >= 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /**
     * Navigation'ı destroy eder
     */
    destroy() {
        // Event listener'ları temizle
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.removeEventListener('click', this.toggleMobileMenu);
        }
        
        this.navLinks.forEach(link => {
            link.removeEventListener('click', this.setupSmoothScrolling);
        });
        
        console.log('🗑️ Navigation destroyed');
    }
}

// Global instance oluştur
window.navigation = new Navigation();