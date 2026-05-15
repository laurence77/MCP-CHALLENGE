document.addEventListener('DOMContentLoaded', () => {
    // Check if touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const cursorInner = document.createElement('div');
    cursorInner.classList.add('custom-cursor-inner');
    document.body.appendChild(cursorInner);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let innerX = 0;
    let innerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animate = () => {
        // Smooth lag for main cursor - slightly faster lerp (0.2)
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

        // Faster response for inner dot
        innerX += (mouseX - innerX) * 0.45;
        innerY += (mouseY - innerY) * 0.45;
        cursorInner.style.transform = `translate3d(${innerX}px, ${innerY}px, 0)`;

        requestAnimationFrame(animate);
    };
    animate();

    // Hover states for all interactive elements
    const updateHovers = () => {
        const hoverElements = document.querySelectorAll('a, button, .glass-card, .nl-card, .supporter-item, #theme-toggle');
        hoverElements.forEach(el => {
            // Remove existing to avoid duplicates if re-called
            el.removeEventListener('mouseenter', onMouseEnter);
            el.removeEventListener('mouseleave', onMouseLeave);
            
            el.addEventListener('mouseenter', onMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        });
    };

    const onMouseEnter = () => {
        cursor.classList.add('cursor-active');
        cursorInner.classList.add('inner-active');
    };
    const onMouseLeave = () => {
        cursor.classList.remove('cursor-active');
        cursorInner.classList.remove('inner-active');
    };

    updateHovers();
    // Re-check for new elements periodically or after reveal animations
    setTimeout(updateHovers, 1000);

    // Click effect
    document.addEventListener('mousedown', () => cursor.classList.add('cursor-clicked'));
    document.addEventListener('mouseup', () => cursor.classList.remove('cursor-clicked'));

    // Visibility handlers
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorInner.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorInner.style.opacity = '1';
    });
});
