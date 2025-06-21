// ===== GLOBAL VARIABLES =====
let isScrolling = false;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initializeNavigation();
    initializeScrollAnimations();
    initializeProjectFiltering();
    initializeContactForm();
    initializeFloatingIcons();
    initializeSkillsScroll();
});

// ===== NAVIGATION FUNCTIONALITY =====
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.navbar__link');

    // Handle navbar background on scroll
    window.addEventListener('scroll', throttle(function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();
    }, 100));

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });
}

// ===== UPDATE ACTIVE NAVIGATION LINK =====
function updateActiveNavLink() {
    if (isScrolling) return;

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;

        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('skill-card')) {
                    // Add visible class with staggered delay
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, 100); // Base delay for first card
                } else {
                    entry.target.classList.add('visible');
                }
            }
        });
    }, observerOptions);

    // Hero content animations
    const heroContent = document.querySelector('.hero__content');
    const heroImage = document.querySelector('.hero__image-wrapper');
    if (heroContent) {
        heroContent.classList.add('slide-in-left');
        observer.observe(heroContent);
    }
    if (heroImage) {
        heroImage.classList.add('slide-in-right');
        observer.observe(heroImage);
    }

    // Section titles
    const sectionTitles = document.querySelectorAll('.section__title');
    sectionTitles.forEach((title, index) => {
        title.classList.add('fade-in');
        title.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(title);
    });

    // Skill cards with staggered animation
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        card.classList.add('scale-in');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Project filter buttons
    const filterButtons = document.querySelector('.projects__filters');
    if (filterButtons) {
        filterButtons.classList.add('fade-in');
        observer.observe(filterButtons);
    }

    // Project cards with staggered animation
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.classList.add('rotate-in');
        card.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(card);
    });

    // Contact form and info
    const contactForm = document.querySelector('.contact__form-wrapper');
    const contactInfo = document.querySelector('.contact__info');
    if (contactForm) {
        contactForm.classList.add('slide-in-left');
        observer.observe(contactForm);
    }
    if (contactInfo) {
        contactInfo.classList.add('slide-in-right');
        observer.observe(contactInfo);
    }

    // Footer sections
    const footerSections = document.querySelectorAll('.footer__section');
    footerSections.forEach((section, index) => {
        section.classList.add('fade-in');
        section.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(section);
    });
}

// ===== PROJECT FILTERING =====
function initializeProjectFiltering() {
    const filterButtons = document.querySelectorAll('.projects__filter');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('projects__filter--active'));
            this.classList.add('projects__filter--active');

            // Filter projects with animation
            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 100);
                } else {
                    item.classList.remove('visible');
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });

    // Initialize with all projects visible
    setTimeout(() => {
        projectItems.forEach(item => {
            item.classList.add('visible');
        });
    }, 500);
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(formData.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission (replace with actual form handling)
            const submitButton = contactForm.querySelector('.contact__submit');
            const originalText = submitButton.textContent;

            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            setTimeout(() => {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

// ===== EMAIL VALIDATION =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// ===== FLOATING ICONS ANIMATION =====
function initializeFloatingIcons() {
    const floatingIcons = document.querySelectorAll('.floating-icon');

    floatingIcons.forEach(icon => {
        const events = {
            mouseenter: () => {
                icon.style.animationPlayState = 'paused';
                icon.style.transform = 'scale(1.2) translateY(-10px)';
            },
            mouseleave: () => {
                icon.style.animationPlayState = 'running';
                icon.style.transform = '';
            }
        };

        Object.entries(events).forEach(([event, handler]) => {
            icon.addEventListener(event, handler);
        });
    });
}

// ===== SKILLS DRAG SCROLL =====
function initializeSkillsScroll() {
    const skillsContainer = document.querySelector('.skills__container');
    const skillCards = document.querySelectorAll('.skill-card');

    // Touch interaction handling
    let isDown = false;
    let startX;
    let scrollLeft;

    skillsContainer.addEventListener('touchstart', (e) => {
        isDown = true;
        skillsContainer.style.cursor = 'grabbing';
        startX = e.touches[0].pageX - skillsContainer.offsetLeft;
        scrollLeft = skillsContainer.scrollLeft;
    });

    skillsContainer.addEventListener('touchend', () => {
        isDown = false;
        skillsContainer.style.cursor = 'grab';
    });

    skillsContainer.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - skillsContainer.offsetLeft;
        const walk = (x - startX) * 2;
        skillsContainer.scrollLeft = scrollLeft - walk;
    });

    // Intersection Observer for fade-in animation
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px'
        }
    );

    skillCards.forEach((card) => observer.observe(card));
}

// ===== PERFORMANCE OPTIMIZATION =====
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== INITIALIZE ADDITIONAL FEATURES =====
document.addEventListener('DOMContentLoaded', function () {
    // Add loading state management
    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse.show');
            if (navbarCollapse) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
});

// ===== SMOOTH SCROLL POLYFILL FOR OLDER BROWSERS =====
if (!('scrollBehavior' in document.documentElement.style)) {
    function smoothScrollTo(element, duration = 1000) {
        const target = element.getBoundingClientRect().top + window.pageYOffset - 80;
        const startPosition = window.pageYOffset;
        const distance = target - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }
}

// ===== TELEGRAM BOT =====

const form = document.getElementById('contactForm');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // === Send to Telegram ===
    const botToken = '7713095754:AAFIUS6UJmwVrLPbj9xxJV64p7ecXK1_gh8';
    const chatId = '5378555770';

    const telegramMessage = `
📬 New Message
👤 Name: ${name}
📧 Email: ${email}
📝 Message: ${message}
`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: 'Markdown'
        })
    })
        .then(response => {
            if (response.ok) {
                console.log('✅ Telegram message sent');
            } else {
                console.error('❌ Telegram failed');
            }
        })
        .catch(error => {
            console.error('⚠️ Telegram error:', error);
        });

    // === Send to Email via EmailJS ===
    emailjs.send('service_9hhey0h', 'template_9j1kdob', {
        from_name: name,
        from_email: email,
        message: message,
        time: new Date().toLocaleString()
    }).then(() => {
        alert('✅ Your message was sent successfully!');
        form.reset();
    }, (error) => {
        console.error('⚠️ EmailJS error:', error);
        alert('❌ Failed to send email. Please try again.');
    });
});

// ===== TOP SCROLL PROGRESS BAR =====
(function () {
    const bar = document.querySelector('#scroll-progress-top .scroll-progress-bar');
    if (!bar) return;
    function updateBar() {
        const scrollTop = window.scrollY || window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = percent + '%';
    }
    window.addEventListener('scroll', updateBar);
    window.addEventListener('resize', updateBar);
    updateBar();
})();