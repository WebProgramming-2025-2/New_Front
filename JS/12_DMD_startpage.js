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
function startbook() {
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

/**
 * Toggle between login and signup forms
 */
function toggleAuthForm() {
    const authForms = document.getElementById('authForms');
    authForms.classList.toggle('show-signup');
}

/**
 * Handle login form submission
 */
function handleLogin(event) {
    event.preventDefault();
    // TODO: Implement login logic
    console.log('Login submitted');
    alert('로그인 기능은 곧 구현될 예정입니다.');
}

/**
 * Handle signup form submission
 */
function handleSignup(event) {
    event.preventDefault();
    // TODO: Implement signup logic
    console.log('Signup submitted');
    alert('회원가입 기능은 곧 구현될 예정입니다.');
}

let currentSlideIndex = 0;

function initCustomSlider() {
    const track = document.getElementById('sliderTrack');
    const slides = document.querySelectorAll('.dmd-slide');
    const slideCount = slides.length;
    
    if(slideCount === 0) return;

    function updateSlidePosition() {
        const track = document.getElementById('sliderTrack');
        const slides = document.querySelectorAll('.dmd-slide');
        const viewportWidth = document.querySelector('.dmd-slider-viewport').offsetWidth;
        
        // 슬라이드 크기와 간격 계산 (CSS와 일치해야 함)
        // PC 기준 flex: 0 0 40%, gap: 30px
        // 정확한 중앙 정렬을 위해 계산
        const slideWidth = slides[0].offsetWidth;
        const gap = 30; 
        
        // 중앙 정렬을 위한 오프셋 계산
        // (뷰포트 절반) - (슬라이드 절반) - (이전 슬라이드들의 너비와 간격)
        const centerOffset = (viewportWidth / 2) - (slideWidth / 2);
        const moveAmount = (slideWidth + gap) * currentSlideIndex;
        const finalTranslate = centerOffset - moveAmount;

        track.style.transform = `translateX(${finalTranslate}px)`;

        // Active 클래스 갱신
        slides.forEach((slide, index) => {
            if (index === currentSlideIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }

    // Global 함수로 등록 (HTML onclick에서 접근 가능하도록)
    window.nextSlide = function() {
        currentSlideIndex = (currentSlideIndex + 1) % slideCount;
        updateSlidePosition();
    };

    window.prevSlide = function() {
        currentSlideIndex = (currentSlideIndex - 1 + slideCount) % slideCount;
        updateSlidePosition();
    };

    // 초기 실행 및 리사이즈 대응
    updateSlidePosition();
    window.addEventListener('resize', updateSlidePosition);
    
    // 자동 슬라이드 (옵션)
    setInterval(() => {
        // 사용자가 마우스를 올리지 않았을 때만 넘어가게 하려면 추가 로직 필요
        // 여기서는 간단히 자동 넘김
       // window.nextSlide(); 
    }, 5000); 
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
    initCustomSlider();
    
    document.body.style.opacity = '1';
});