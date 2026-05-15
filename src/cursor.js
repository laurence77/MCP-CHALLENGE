document.addEventListener('DOMContentLoaded', () => {
    // Hide on mobile/touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    // Create cursor element
    let cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<span class="cursor-label"></span>';
        document.body.appendChild(cursor);
    }
    const label = cursor.querySelector('.cursor-label');

    let mouseX = -100, mouseY = -100;
    let cursorX = -100, cursorY = -100;
    let speed = 0;
    let lastMouseX = -100, lastMouseY = -100;
    let angle = 0;

    // Smooth movement constants
    const lerp = 0.25; // Increased for snappier response

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Initial jump fix
        if (cursorX === -100) {
            cursorX = mouseX;
            cursorY = mouseY;
            lastMouseX = mouseX;
            lastMouseY = mouseY;
        }
    });

    // Refresh interaction state on scroll
    window.addEventListener('scroll', () => {
        // Trigger a fake mousemove to refresh position if needed
        // but mostly we want to ensure interactions are re-evaluated
        updateInteractions();
    }, { passive: true });

    function animate() {
        // Calculate movement physics
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * lerp;
        cursorY += dy * lerp;

        // Calculate velocity & stretch
        const moveX = mouseX - lastMouseX;
        const moveY = mouseY - lastMouseY;
        
        // Damping the speed calculation for smoother stretching
        const targetSpeed = Math.min(Math.sqrt(moveX * moveX + moveY * moveY) * 0.1, 0.6);
        speed += (targetSpeed - speed) * 0.2;
        
        // Directional angle for stretching
        if (speed > 0.02) {
            const targetAngle = Math.atan2(moveY, moveX) * 180 / Math.PI;
            angle += (targetAngle - angle) * 0.2;
        }

        lastMouseX = mouseX;
        lastMouseY = mouseY;

        // Apply transformations
        const stretch = 1 + speed;
        const squash = 1 / stretch;
        
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) rotate(${angle}deg) scale(${stretch}, ${squash})`;

        requestAnimationFrame(animate);
    }
    animate();

    // Interaction logic
    const updateInteractions = () => {
        const interactive = document.querySelectorAll('a, button, .glass-card, .nl-card, .supporter-item, .theme-btn');
        
        interactive.forEach(el => {
            // Remove existing listeners to prevent duplicates
            el.removeEventListener('mouseenter', hoverEnter);
            el.removeEventListener('mouseleave', hoverLeave);
            
            el.addEventListener('mouseenter', hoverEnter);
            el.addEventListener('mouseleave', hoverLeave);
        });
    };

    function hoverEnter(e) {
        const el = e.currentTarget;
        cursor.classList.add('cursor-active');
        
        // Set contextual label
        const text = el.innerText ? el.innerText.toLowerCase() : '';
        if (text.includes('donate') || text.includes('involved')) label.innerText = 'GIVE';
        else if (el.classList.contains('nl-card')) label.innerText = 'READ';
        else if (el.classList.contains('glass-card') || el.classList.contains('team-card')) label.innerText = 'VIEW';
        else if (el.id === 'theme-toggle') label.innerText = 'MODE';
        else label.innerText = 'GO';
    }

    function hoverLeave() {
        cursor.classList.remove('cursor-active');
        label.innerText = '';
    }

    updateInteractions();
    setInterval(updateInteractions, 2000);

    // Click feedback
    window.addEventListener('mousedown', () => cursor.classList.add('cursor-clicked'));
    window.addEventListener('mouseup', () => cursor.classList.remove('cursor-clicked'));

    // Handle window focus/visibility
    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursor.style.opacity = '1');

    // --- MAGNETIC BUTTONS LOGIC ---
    const updateMagnetic = () => {
        const magneticElements = document.querySelectorAll('.btn, .theme-btn, .nav-link, .honor-card, .btn-secondary');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transition = 'transform 0.1s ease-out';
                el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
                el.style.transform = `translate(0, 0)`;
            });
        });
    };
    updateMagnetic();
    setInterval(updateMagnetic, 3000);
});
