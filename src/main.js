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
            const target = anchor.getAttribute('href');
            if (target && lenis) lenis.scrollTo(target);
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

// === CORE CONSTANTS ===
const names = ["James", "Sarah", "Elena", "Liam", "Peaker 77", "Marcus", "Sophie", "Sam", "MPC Team", "The Heughans"];

// === PRELOADER LOGIC ===
function clearPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('loaded')) {
        setTimeout(() => {
            preloader.classList.add('loaded');
            // Trigger entry animations for hero content
            document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }, 1000);
    }
}

// Event Listeners for Preloader
window.addEventListener('load', clearPreloader);
// Fallback: Force clear if it takes too long
setTimeout(clearPreloader, 4000); 

// === FUNDRAISING SIMULATOR ===
const donationProgress = document.querySelector('.milestone-progress-fill');
const donationPctText = document.querySelector('.milestone-pct');
const donationTotalText = document.querySelector('.milestone-text');
const liveNotify = document.getElementById('live-donation');

let currentRaised = 150000;
const goal = 1000000;

function simulateDonation() {
    const amount = Math.floor(Math.random() * 500) + 10; // $10 to $510
    const name = names[Math.floor(Math.random() * names.length)];
    
    currentRaised += amount;
    const pct = (currentRaised / goal) * 100;
    
    // Update UI
    if (donationProgress) donationProgress.style.width = `${pct}%`;
    if (donationPctText) donationPctText.innerText = `${pct.toFixed(1)}% Raised`;
    if (donationTotalText) {
        donationTotalText.innerHTML = `£${currentRaised.toLocaleString()} <span class="text-accent">Goal</span>`;
    }
    
    // Show Notification
    if (liveNotify) {
        liveNotify.querySelector('.donation-user').innerText = name;
        liveNotify.querySelector('.donation-amount').innerText = `£${amount}`;
        liveNotify.classList.add('active');
        
        const bar = document.getElementById('milestone-bar');
        if (bar) bar.classList.add('pulse');
        
        setTimeout(() => {
            liveNotify.classList.remove('active');
            if (bar) bar.classList.remove('pulse');
        }, 3000);
    }
    
    // Schedule next donation (random between 5-15 seconds)
    setTimeout(simulateDonation, Math.random() * 10000 + 5000);
}

// Start simulator after preloader clears
window.addEventListener('load', () => {
    setTimeout(simulateDonation, 5000);
});

// === SOCIAL PROOF FEED ===
const socialProofContainer = document.getElementById('social-proof');
const locations = ["London, UK", "New York, US", "Sydney, AU", "Berlin, DE", "Paris, FR", "Tokyo, JP", "Toronto, CA", "Glasgow, SC"];
const actions = ["just donated £25", "just joined the challenge", "became a monthly supporter", "completed their first peak", "just shared the impact"];

function triggerSocialProof() {
    if (!socialProofContainer) return;
    
    const name = names[Math.floor(Math.random() * names.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    const card = document.createElement('div');
    card.className = 'social-proof-card';
    card.innerHTML = `
        <div class="proof-avatar">${name.charAt(0)}</div>
        <div class="proof-content">
            <span class="proof-user">${name} from ${location}</span>
            <span class="proof-action">${action}</span>
            <span class="proof-time">Just Now</span>
        </div>
    `;
    
    socialProofContainer.appendChild(card);
    
    // Trigger animation
    setTimeout(() => card.classList.add('active'), 100);
    
    // Remove after 6 seconds
    setTimeout(() => {
        card.classList.remove('active');
        setTimeout(() => card.remove(), 600);
    }, 6000);
}

// Start Social Proof Feed
window.addEventListener('load', () => {
    // First one after 10 seconds
    setTimeout(triggerSocialProof, 10000);
    // Then every 20-40 seconds
    setInterval(() => {
        if (Math.random() > 0.5) triggerSocialProof();
    }, 25000);
});

// === GLOBAL SEARCH LOGIC ===
const searchOverlay = document.getElementById('search-overlay');
const searchTrigger = document.getElementById('search-trigger');
const searchClose = document.querySelector('.search-close');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

const searchContent = [
    { title: "Cancer Support", type: "Initiative", link: "#initiatives" },
    { title: "Empower Impact Newsletter", type: "Communication", link: "newsletter.html" },
    { title: "Corporate Partnerships", type: "B2B", link: "partnerships.html" },
    { title: "Impact Milestone Progress", type: "Transparency", link: "#impact" },
    { title: "Volunteer Locally", type: "Community", link: "#community" },
    { title: "Join the Challenge", type: "Action", link: "index.html" }
];

function openSearch() {
    if (!searchOverlay || !searchInput) return;
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (typeof lenis !== 'undefined') lenis.stop();
    setTimeout(() => searchInput.focus(), 100);
}

function closeSearch() {
    if (!searchOverlay || !searchInput) return;
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (typeof lenis !== 'undefined') lenis.start();
    searchInput.value = '';
    renderResults([]);
}

function renderResults(results) {
    if (!searchResults || !searchInput) return;

    if (results.length === 0 && searchInput.value !== '') {
        searchResults.innerHTML = `<div class="search-suggestions"><h3>No results found</h3></div>`;
        return;
    }
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-suggestions">
                <h3>Popular Searches</h3>
                <div class="suggestion-tags">
                    <button class="tag">Cancer Support</button>
                    <button class="tag">Impact Map</button>
                    <button class="tag">Newsletter</button>
                    <button class="tag">Initiatives</button>
                </div>
            </div>`;
        return;
    }

    searchResults.innerHTML = results.map((res, i) => `
        <div class="search-result-item" style="animation-delay: ${i * 0.1}s" onclick="window.location.href='${res.link}'">
            <div class="proof-avatar">${res.title.charAt(0)}</div>
            <div class="proof-content">
                <span class="proof-user">${res.title}</span>
                <span class="proof-action">${res.type}</span>
            </div>
        </div>
    `).join('');
}

if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
if (searchClose) searchClose.addEventListener('click', closeSearch);

// Keyboard listeners
window.addEventListener('keydown', (e) => {
    if (!searchOverlay) return;
    
    if (e.key === '/' && !searchOverlay.classList.contains('active')) {
        e.preventDefault();
        openSearch();
    }
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        closeSearch();
    }
});

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        if (val.length < 2) {
            renderResults([]);
            return;
        }
        const filtered = searchContent.filter(item => 
            item.title.toLowerCase().includes(val) || 
            item.type.toLowerCase().includes(val)
        );
        renderResults(filtered);
    });
}

// Suggested tags delegation
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag')) {
        if (searchInput) {
            searchInput.value = e.target.innerText;
            searchInput.dispatchEvent(new Event('input'));
        }
    }
});

// === IMPACT MAP LOGIC ===
const mapImpactCard = document.getElementById('map-impact-card');
const mapImpactCity = document.getElementById('map-impact-city');
const mapImpactDesc = document.getElementById('map-impact-desc');
const mapImpactMetric = document.getElementById('map-impact-metric');
const pulsePoints = document.querySelectorAll('.pulse-point');

const mapImpactData = {
    "London": { desc: "Supporting Blood Cancer UK research and patient care programs.", metric: "£250,000 Donated" },
    "Nairobi": { desc: "Clean water initiatives supporting over 5,000 families in rural areas.", metric: "5,000+ Families" },
    "Toronto": { desc: "New recovery centers for children undergoing cancer treatment.", metric: "12 New Centers" },
    "Sydney": { desc: "Environmental restoration projects protecting native wildlife.", metric: "50,000 Trees Planted" }
};

if (pulsePoints.length > 0) {
    pulsePoints.forEach(point => {
        point.addEventListener('click', (e) => {
            e.stopPropagation();
            const city = point.getAttribute('data-city');
            const data = mapImpactData[city];
            
            if (data && mapImpactCard && mapImpactCity && mapImpactDesc && mapImpactMetric) {
                mapImpactCity.innerText = city;
                mapImpactDesc.innerText = data.desc;
                mapImpactMetric.innerText = data.metric;
                mapImpactCard.classList.add('active');
            }
        });
    });
}

// === PEAKER WALL MODAL LOGIC ===
const honorModal = document.getElementById('honor-modal');
const modalName = document.getElementById('modal-name');
const modalLocation = document.getElementById('modal-location');
const modalGoal = document.getElementById('modal-goal');
const modalRaised = document.getElementById('modal-raised');
const modalAvatar = document.getElementById('modal-avatar');
const honorCards = document.querySelectorAll('.honor-card');
const modalClose = document.querySelector('.modal-close');

if (honorCards.length > 0) {
    honorCards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.getAttribute('data-peaker');
            const goal = card.getAttribute('data-goal');
            const raised = card.getAttribute('data-raised');
            const location = card.querySelector('.honor-info span').innerText;
            const imgSrc = card.querySelector('img').src;

            if (name && honorModal) {
                modalName.innerText = name;
                modalGoal.innerText = goal;
                modalRaised.innerText = raised;
                modalLocation.innerText = location;
                modalAvatar.style.backgroundImage = `url(${imgSrc})`;
                honorModal.classList.add('active');
            }
        });
    });
}

if (modalClose) {
    modalClose.addEventListener('click', () => {
        honorModal.classList.remove('active');
    });
}

// === ULTRA-HIGH-FIDELITY EFFECTS ===

// 1. 3D Parallax Hero
const heroVideo = document.getElementById('hero-video');
const heroContent = document.getElementById('hero-content');
const heroSection = document.getElementById('hero');

if (heroSection) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            if (heroVideo) heroVideo.style.transform = `translate3d(0, ${scrolled * 0.4}px, 0)`;
            if (heroContent) heroContent.style.transform = `translate3d(0, ${scrolled * 0.2}px, 0)`;
            if (heroContent) heroContent.style.opacity = 1 - (scrolled / 700);
        }
    });
}

// 2. Interactive Glass Particles
const particleContainer = document.getElementById('hero-particles');
if (particleContainer) {
    // Generate particles
    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'glass-particle';
        const size = Math.random() * 60 + 20;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.opacity = Math.random() * 0.3;
        particleContainer.appendChild(p);
    }

    // React to mouse
    window.addEventListener('mousemove', (e) => {
        const particles = document.querySelectorAll('.glass-particle');
        const x = (e.clientX / window.innerWidth - 0.5) * 50;
        const y = (e.clientY / window.innerHeight - 0.5) * 50;
        
        particles.forEach((p, i) => {
            const factor = (i + 1) * 0.2;
            p.style.transform = `translate3d(${x * factor}px, ${y * factor}px, 0) rotate(${x}deg)`;
        });
    });
}

console.log('Empower Impact v2.1 — Ultra-HD Edition');
