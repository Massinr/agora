class CustomCursor {
    constructor() {
        this.cursorDot = document.querySelector('.cursor-dot');
        this.cursorOutline = document.querySelector('.cursor-outline');
        this.init();
    }

    init() {
        if (!this.cursorDot || !this.cursorOutline) return;

        document.addEventListener('mousemove', (e) => {
            this.updateCursor(e);
        });

        document.addEventListener('mousedown', () => {
            this.cursorDot.style.transform = 'scale(0.8)';
            this.cursorOutline.style.transform = 'scale(0.8)';
        });

        document.addEventListener('mouseup', () => {
            this.cursorDot.style.transform = 'scale(1)';
            this.cursorOutline.style.transform = 'scale(1)';
        });

        const hideCursorElements = document.querySelectorAll('button, a, input, textarea');
        hideCursorElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursorDot.style.opacity = '0';
                this.cursorOutline.style.opacity = '0';
            });
            el.addEventListener('mouseleave', () => {
                this.cursorDot.style.opacity = '1';
                this.cursorOutline.style.opacity = '0.5';
            });
        });
    }

    updateCursor(e) {
        requestAnimationFrame(() => {
            this.cursorDot.style.left = e.clientX + 'px';
            this.cursorDot.style.top = e.clientY + 'px';
        });
        
        requestAnimationFrame(() => {
            this.cursorOutline.style.left = e.clientX + 'px';
            this.cursorOutline.style.top = e.clientY + 'px';
        });
    }
}

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    
                    this.smoothScrollTo(offsetTop, 1000);
                }
            });
        });
    }

    smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Custom easing function for smooth animation
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }
}

class MobileNav {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        if (!this.hamburger || !this.navMenu) return;

        this.hamburger.addEventListener('click', () => {
            this.toggleMenu();
        });

        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        const bars = this.hamburger.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (this.hamburger.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        
        const bars = this.hamburger.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
    }
}

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        const animateElements = document.querySelectorAll('.event-card, .gallery-item, .stat-item, .contact-item');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            observer.observe(el);
        });

        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

class ParallaxEffects {
    constructor() {
        this.init();
    }

    init() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const shapes = document.querySelectorAll('.shape');
            
            shapes.forEach((shape, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                shape.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }
}

class FormHandler {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                this.form.reset();
            }, 2000);
        }, 1500);
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(107, 70, 193, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        if (!this.navbar) return;

        let ticking = false;
        
        const updateNavbar = () => {
            if (window.scrollY > 100) {
                this.navbar.style.background = 'rgba(15, 15, 35, 0.98)';
                this.navbar.style.backdropFilter = 'blur(15px)';
            } else {
                this.navbar.style.background = 'rgba(15, 15, 35, 0.95)';
                this.navbar.style.backdropFilter = 'blur(10px)';
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });
    }
}

class TypingEffect {
    constructor() {
        this.elements = document.querySelectorAll('.hero-title .title-line');
        this.init();
    }

    init() {
        this.elements.forEach((element, index) => {
            const text = element.textContent;
            element.textContent = '';
            element.style.opacity = '1';
            
            setTimeout(() => {
                this.typeText(element, text, 50);
            }, index * 200);
        });
    }

    typeText(element, text, speed) {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }
}

class IntroAnimation {
    constructor() {
        this.introOverlay = document.getElementById('introOverlay');
        this.init();
    }

    init() {
        if (!this.introOverlay) return;

        this.startIntroSequence();
    }

    startIntroSequence() {
        const randomDelay = Math.random() * 500 + 500;
        
        setTimeout(() => {
            this.introOverlay.style.opacity = '1';
            
            this.animateLetters();
            
            this.startProgressBar();
            
            setTimeout(() => {
                this.hideIntro();
            }, 4000); // Total intro duration
            
        }, randomDelay);
    }

    animateLetters() {
        const letters = document.querySelectorAll('.letter');
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.animationPlayState = 'running';
            }, index * 200);
        });
        
        setTimeout(() => {
            letters.forEach((letter, index) => {
                setTimeout(() => {
                    letter.style.transform = 'translateY(-5px) scale(1.02)';
                    setTimeout(() => {
                        letter.style.transform = 'translateY(0) scale(1)';
                    }, 200);
                }, index * 100);
            });
        }, 2000);
    }

    startProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15 + 5;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                }
                progressBar.style.width = progress + '%';
            }, 100);
        }
    }

    hideIntro() {
        this.introOverlay.classList.add('fade-out');
        
        setTimeout(() => {
            this.introOverlay.classList.add('hidden');
            this.initializeWebsite();
        }, 1000);
    }

    initializeWebsite() {
        new CustomCursor();
        new SmoothScroll();
        new MobileNav();
        new ScrollAnimations();
        new ParallaxEffects();
        new FormHandler();
        new ParticleSystem();
        new NavbarScroll();
        new TypingEffect();
        new ScrollArrow();
        new ContentManager();
    }
}

class ScrollArrow {
    constructor() {
        this.scrollArrow = document.querySelector('.scroll-arrow');
        this.init();
    }

    init() {
        if (!this.scrollArrow) return;

        this.scrollArrow.style.cursor = 'pointer';
        this.scrollArrow.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        this.scrollArrow.addEventListener('mouseenter', () => {
            this.scrollArrow.style.transform = 'translateX(-50%) translateY(-5px) scale(1.1)';
            this.scrollArrow.style.opacity = '0.8';
        });

        this.scrollArrow.addEventListener('mouseleave', () => {
            this.scrollArrow.style.transform = 'translateX(-50%) translateY(0) scale(1)';
            this.scrollArrow.style.opacity = '1';
        });

        this.scrollArrow.addEventListener('click', () => {
            this.scrollToNextSection();
        });

        this.scrollArrow.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.scrollToNextSection();
            }
        });

        this.scrollArrow.setAttribute('tabindex', '0');
        this.scrollArrow.setAttribute('role', 'button');
        this.scrollArrow.setAttribute('aria-label', 'Scroll to next section');
    }

    scrollToNextSection() {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const offsetTop = aboutSection.offsetTop - 80;
            
            this.smoothScrollTo(offsetTop, 1000);
        }
    }

    smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Custom easing function for smooth animation
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }
}

class ContentManager {
    constructor() {
        this.init();
        this.setupStorageListener();
    }

    init() {
        this.loadGalleryImages();
        this.loadEvents();
    }

    setupStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'agoraGalleryImages') {
                this.loadGalleryImages();
            } else if (e.key === 'agoraEvents') {
                this.loadEvents();
            }
        });
        
        setInterval(() => {
            this.loadGalleryImages();
            this.loadEvents();
        }, 1000);
    }

    loadGalleryImages() {
        const galleryContainer = document.querySelector('.gallery-grid');
        const images = JSON.parse(localStorage.getItem('agoraGalleryImages') || '[]');
        
        if (images.length > 0) {
            galleryContainer.innerHTML = '';
            images.forEach(imageData => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.innerHTML = `
                    <img src="${imageData.url}" alt="Gallery Image">
                    <div class="image-caption">${imageData.description || 'No description available'}</div>
                `;
                galleryContainer.appendChild(galleryItem);
            });
        } else {
            galleryContainer.innerHTML = `
                <div class="gallery-item">
                    <div class="gallery-placeholder">
                        <span>Image 1</span>
                    </div>
                </div>
                <div class="gallery-item">
                    <div class="gallery-placeholder">
                        <span>Image 2</span>
                    </div>
                </div>
                <div class="gallery-item">
                    <div class="gallery-placeholder">
                        <span>Image 3</span>
                    </div>
                </div>
                <div class="gallery-item">
                    <div class="gallery-placeholder">
                        <span>Image 4</span>
                    </div>
                </div>
                <div class="gallery-item">
                    <div class="gallery-placeholder">
                        <span>Image 5</span>
                    </div>
                </div>
                <div class="gallery-item">
                    <div class="gallery-placeholder">
                        <span>Image 6</span>
                    </div>
                </div>
            `;
        }
    }

    loadEvents() {
        const eventsContainer = document.querySelector('.events-grid');
        const events = JSON.parse(localStorage.getItem('agoraEvents') || '[]');
        
        if (events.length > 0) {
            eventsContainer.innerHTML = '';
            events.forEach((event, index) => {
                const eventCard = document.createElement('div');
                eventCard.className = 'event-card';
                eventCard.onclick = () => this.showEventModal(event);
                
                const dateParts = event.date.split(' ');
                const day = dateParts[1] || 'TBD';
                const month = dateParts[0] || 'Soon';
                
                eventCard.innerHTML = `
                    <div class="event-date">
                        <span class="day">${day}</span>
                        <span class="month">${month}</span>
                    </div>
                    <div class="event-content">
                        <h3>${event.title}</h3>
                        <p>${event.description.length > 100 ? event.description.substring(0, 100) + '...' : event.description}</p>
                        <div class="event-meta">
                            <span class="event-time">${event.time}</span>
                            <span class="event-location">${event.location}</span>
                        </div>
                    </div>
                `;
                eventsContainer.appendChild(eventCard);
            });
        } else {
            const defaultEvents = [
                {
                    title: "Environmental Issues Discussion",
                    description: "Join us to discuss environmental challenges in our city and explore ways to maintain our school and community through service projects. We'll cover topics like waste reduction, energy conservation, and local environmental initiatives.",
                    date: "Soon TBD",
                    time: "TBD",
                    location: "School Grounds"
                },
                {
                    title: "Science & Technology Showcase",
                    description: "Present and discuss recent research breakthroughs in any scientific field and explore emerging technologies that interest you. This is your chance to share your passion for science and learn from your peers.",
                    date: "Soon TBD",
                    time: "TBD",
                    location: "School Grounds"
                },
                {
                    title: "School Policy & Student Needs",
                    description: "Voice your concerns about school policies and discuss ways to address student needs and create positive change. Your input matters in shaping our school community.",
                    date: "Soon TBD",
                    time: "TBD",
                    location: "School Grounds"
                }
            ];
            
            eventsContainer.innerHTML = '';
            defaultEvents.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.className = 'event-card';
                eventCard.onclick = () => this.showEventModal(event);
                
                eventCard.innerHTML = `
                    <div class="event-date">
                        <span class="day">TBD</span>
                        <span class="month">Soon</span>
                    </div>
                    <div class="event-content">
                        <h3>${event.title}</h3>
                        <p>${event.description.substring(0, 100)}...</p>
                        <div class="event-meta">
                            <span class="event-time">${event.time}</span>
                            <span class="event-location">${event.location}</span>
                        </div>
                    </div>
                `;
                eventsContainer.appendChild(eventCard);
            });
        }
    }

    showEventModal(event) {
        const modal = document.getElementById('eventModal');
        const dateParts = event.date.split(' ');
        const day = dateParts[1] || 'TBD';
        const month = dateParts[0] || 'Soon';
        
        document.getElementById('modalDay').textContent = day;
        document.getElementById('modalMonth').textContent = month;
        document.getElementById('modalTitle').textContent = event.title;
        document.getElementById('modalTime').textContent = event.time;
        document.getElementById('modalLocation').textContent = event.location;
        document.getElementById('modalDescription').textContent = event.description;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.addEventListener('DOMContentLoaded', () => {
    new IntroAnimation();
    
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'K') {
            e.preventDefault();
            window.open('admin.html', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.event-card, .gallery-item, .stat-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    const joinUsBtn = document.querySelector('.btn-primary');
    const learnMoreBtn = document.querySelector('.btn-secondary');

    if (joinUsBtn) {
        joinUsBtn.addEventListener('click', () => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const offsetTop = contactSection.offsetTop - 80;
                smoothScrollTo(offsetTop, 1000);
            }
        });
    }

    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const offsetTop = aboutSection.offsetTop - 80;
                smoothScrollTo(offsetTop, 1000);
            }
        });
    }

    function smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
