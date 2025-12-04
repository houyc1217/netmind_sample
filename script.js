// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// Smooth Scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add smooth scrolling to all navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// CTA Button click handler
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', () => scrollToSection('contact'));
}

// Animated Counter for Statistics
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60 FPS
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate stat numbers
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(num => {
                if (!num.classList.contains('animated')) {
                    num.classList.add('animated');
                    animateCounter(num);
                }
            });

            // Fade in service cards
            const serviceCards = entry.target.querySelectorAll('.service-card');
            serviceCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observe sections
const aboutSection = document.querySelector('.about');
const servicesSection = document.querySelector('.services');

if (aboutSection) observer.observe(aboutSection);
if (servicesSection) observer.observe(servicesSection);

// Throttle function for performance optimization
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Cache DOM elements for scroll effects
const navbar = document.querySelector('.navbar');
const hero = document.querySelector('.hero');

// Consolidated scroll handler with throttling
const handleScroll = throttle(() => {
    const currentScroll = window.pageYOffset;

    // Navbar shadow effect
    if (navbar) {
        navbar.style.boxShadow = currentScroll <= 0 ? 'var(--shadow)' : 'var(--shadow-lg)';
    }

    // Parallax effect for hero section
    if (hero) {
        hero.style.transform = `translateY(${currentScroll * 0.5}px)`;
    }
}, 16);

window.addEventListener('scroll', handleScroll, { passive: true });

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Here you would typically send the form data to a server
        // For this demo, we'll just show a success message
        alert(`Thank you, ${name}! Your message has been received:\n\n"${message}"\n\nWe'll get back to you at ${email} soon.`);

        // Reset form
        contactForm.reset();
    });
}

// Add fade-in animation on page load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
