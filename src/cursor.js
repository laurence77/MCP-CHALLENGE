document.addEventListener('DOMContentLoaded', () => {
    // Check if touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const cursorInner = document.createElement('div');
    cursorInner.classList.add('custom-cursor-inner');
    document.body.appendChild(cursorInner);

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let innerX = -100;
    let innerY = -100;
    
    let isHovering = false;
    let magneticTarget = null;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Ensure visibility on first move
        cursor.style.opacity = '1';
        cursorInner.style.opacity = '1';
    });

    const animate = () => {
        let targetX = mouseX;
        let targetY = mouseY;

        // Magnetic Effect Logic
        if (isHovering && magneticTarget) {
            const rect = magneticTarget.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Pull 20% towards the center of the element
            targetX = mouseX + (centerX - mouseX) * 0.2;
            targetY = mouseY + (centerY - mouseY) * 0.2;
        }

        // Smooth lag for main cursor
        cursorX += (targetX - cursorX) * 0.15;
        cursorY += (targetY - cursorY) * 0.15;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

        // Faster response for inner dot
        innerX += (mouseX - innerX) * 0.4;
        innerY += (mouseY - innerY) * 0.4;
        cursorInner.style.transform = `translate3d(${innerX}px, ${innerY}px, 0)`;

        requestAnimationFrame(animate);
    };
    animate();

    const updateHovers = () => {
        const hoverElements = document.querySelectorAll('a, button, .glass-card, .nl-card, .supporter-item, .theme-btn');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                isHovering = true;
                magneticTarget = e.currentTarget;
                cursor.classList.add('cursor-active');
                cursorInner.classList.add('inner-active');
            });
            el.addEventListener('mouseleave', () => {
                isHovering = false;
                magneticTarget = null;
                cursor.classList.remove('cursor-active');
                cursorInner.classList.remove('inner-active');
            });
        });
    };

    updateHovers();
    // Re-run periodically to catch dynamically added elements
    setInterval(updateHovers, 2000);

    // Click effects
    document.addEventListener('mousedown', () => cursor.classList.add('cursor-clicked'));
    document.addEventListener('mouseup', () => cursor.classList.remove('cursor-clicked'));

    // Handle window focus/visibility
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorInner.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorInner.style.opacity = '1';
    });
});
