// Moon phases array - 12 phases representing 12 months
const moonPhases = [
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f311.svg', // 🌑
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f312.svg', // 🌒
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f313.svg', // 🌓
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f314.svg', // 🌔
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f315.svg', // 🌕
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f316.svg', // 🌖
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f317.svg', // 🌗
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f318.svg', // 🌘
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f311.svg', // 🌑
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f312.svg', // 🌒
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f313.svg', // 🌓
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f314.svg', // 🌔
];

let currentScrollPosition = 0;
const moonPhase = document.getElementById('moonPhase');
const moonImage = document.getElementById('moonImage');

/**
 * Create animated stars in the background
 * @param {string} containerId - ID of the container element
 */
function createStars(containerId) {
    const starsContainer = document.getElementById(containerId);
    if (!starsContainer) return;
    
    const starCount = 250;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.opacity = Math.random() * 0.7 + 0.3;
        starsContainer.appendChild(star);
    }
}

/**
 * Update moon position and phase based on scroll position
 * Moon moves in a semicircle arc from left to right across the screen
 */
function updateMoonPosition() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const maxScroll = windowHeight; // Only track first section scroll
    
    // Calculate progress (0 to 1) through the first section
    const progress = Math.min(scrollY / maxScroll, 1);
    
    // Moon moves in a semi-circle from left to right
    const startX = 50; // Start at 50px from left
    const endX = window.innerWidth - 150; // End at 150px from right
    const centerY = windowHeight / 2;
    
    // Calculate x position (linear movement)
    const x = startX + (endX - startX) * progress;
    
    // Calculate y position (arc/semicircle using sine wave)
    const arcHeight = windowHeight * 0.3; // Height of the arc
    const y = centerY - Math.sin(progress * Math.PI) * arcHeight;
    
    // Update moon position
    moonPhase.style.left = x + 'px';
    moonPhase.style.top = y + 'px';
    
    // Update moon phase image (0-11 for 12 phases)
    const phaseIndex = Math.floor(progress * 11);
    moonImage.src = moonPhases[phaseIndex];
    
    // Fade out moon when entering second section
    if (scrollY > maxScroll * 0.8) {
        const fadeProgress = (scrollY - maxScroll * 0.8) / (maxScroll * 0.2);
        moonPhase.style.opacity = 1 - fadeProgress;
    } else {
        moonPhase.style.opacity = 1;
    }
}

/**
 * Scroll to the next section (second section)
 */
function scrollToNext() {
    const secondSection = document.getElementById('secondSection');
    if (secondSection) {
        secondSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Navigate to fourth section (Login/Signup)
 */
function startJourney() {
    const fourthSection = document.getElementById('fourthSection');
    if (fourthSection) {
        fourthSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Learn more - scroll to second section
 */
function learnMore() {
    scrollToNext();
}

// Event Listeners
window.addEventListener('scroll', updateMoonPosition);

// Initialize on page load
window.addEventListener('load', () => {
    createStars('starsContainer');
    createStars('starsContainer2');
    createStars('starsContainer3');
    createStars('starsContainer4');
    
    updateMoonPosition();
    
    document.body.style.opacity = '1';
});