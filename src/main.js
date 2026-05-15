// === LENIS SMOOTH SCROLL ===
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// === SCROLL REVEAL ===
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// === STICKY HEADER ===
const header = document.querySelector('.main-header');
let lastScroll = 0;
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
    lastScroll = window.scrollY;
}, { passive: true });

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// === DARK MODE TOGGLE ===
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

// === IMPACT CALCULATOR ===
const range = document.getElementById('donation-range');
const amountVal = document.getElementById('amount-val');
const impactDesc = document.getElementById('impact-desc');

const impactData = [
    { threshold: 10, text: "Provides emergency care kits for a family." },
    { threshold: 50, text: "Funds awareness materials for a community." },
    { threshold: 150, text: "Provides 2 days of professional treatment support." },
    { threshold: 300, text: "Funds local awareness programs for 100 people." },
    { threshold: 500, text: "Plants 50 trees through our environmental partners." },
    { threshold: 750, text: "Sponsors a critical research lab session." },
    { threshold: 1000, text: "Funds comprehensive cancer screening for a community." }
];

if (range) {
    range.addEventListener('input', e => {
        const val = parseInt(e.target.value);
        amountVal.textContent = val;
        let desc = impactData[0].text;
        for (const item of impactData) {
            if (val >= item.threshold) desc = item.text;
        }
        impactDesc.textContent = desc;
    });
}

// === COUNTER ANIMATION ===
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'));
            let current = 0;
            const step = Math.ceil(target / 60);
            const timer = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = current;
            }, 30);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// === MOBILE MENU ===
const mobileToggle = document.querySelector('.mobile-nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
        const isActive = mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        mobileToggle.setAttribute('aria-expanded', isActive);
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            mobileToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// === VANILLA TILT ===
if (typeof VanillaTilt !== 'undefined') {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) {
        VanillaTilt.init(document.querySelectorAll(".glass-card, .nl-card, .supporter-item"), {
            max: 8,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.02
        });
    }
}

// === MILESTONE BAR LOGIC ===
const milestoneBar = document.getElementById('milestone-bar');
if (milestoneBar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 800) {
            milestoneBar.classList.remove('hide');
        } else {
            milestoneBar.classList.add('hide');
        }
    }, { passive: true });
}

// === CARD SPOTLIGHT EFFECT ===
document.querySelectorAll('.glass-card, .nl-card, .stat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// === MOBILE HERO EXPANSION ===
const heroSection = document.getElementById('hero');
if (heroSection) {
    heroSection.addEventListener('click', (e) => {
        // Don't toggle if clicking a button
        if (e.target.closest('.btn')) return;
        
        if (window.innerWidth <= 768) {
            heroSection.classList.toggle('hero-expanded');
        }
    });
}

// === PRELOADER LOGIC ===
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Minimum display time for the logo animation to feel premium
        setTimeout(() => {
            preloader.classList.add('loaded');
            // Trigger entry animations for hero content
            document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }, 1500);
    }
});

console.log('Empower Impact v2.0 — Fully Upgraded');
