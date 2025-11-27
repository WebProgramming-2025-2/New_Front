const originalPhases = [
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

const RepeatCount = 3;

const moonPhases = originalPhases.flatMap(phase => Array(RepeatCount).fill(phase));
const moonPhase = document.getElementById('moonPhase');
const moonImage = document.getElementById('moonImage');

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

function updateMoonPosition() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const maxScroll = windowHeight;
    
    const progress = Math.min(scrollY / maxScroll, 1);
    
    const startX = 50;
    const endX = window.innerWidth - 150;
    const centerY = windowHeight / 2;
    
    const x = startX + (endX - startX) * progress;
    
    const arcHeight = windowHeight * 0.3;
    const y = centerY - Math.sin(progress * Math.PI) * arcHeight;
    
    moonPhase.style.left = x + 'px';
    moonPhase.style.top = y + 'px';
    
    // 기존 코드
    // const phaseIndex = Math.floor(progress * 11);
    // moonImage.src = moonPhases[phaseIndex];
    
    // // Fade out moon when entering second section
    // if (scrollY > maxScroll * 0.8) {
    //     const fadeProgress = (scrollY - maxScroll * 0.8) / (maxScroll * 0.2);
    //     moonPhase.style.opacity = 1 - fadeProgress;
    // } else {
    //     moonPhase.style.opacity = 1;
    // }
    const totalFrames = moonPhases.length;
    const phaseIndex = Math.floor(progress * (totalFrames - 1));
    
    const safeIndex = Math.min(Math.max(phaseIndex, 0), totalFrames - 1);
    moonImage.src = moonPhases[safeIndex];
    
    if (scrollY > maxScroll * 0.8) {
        const fadeProgress = (scrollY - maxScroll * 0.8) / (maxScroll * 0.2);
        moonPhase.style.opacity = 1 - fadeProgress;
    } else {
        moonPhase.style.opacity = 1;
    }
}

function scrollToNext() {
    const secondSection = document.getElementById('secondSection');
    if (secondSection) {
        secondSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function startbook() {
    const fourthSection = document.getElementById('fourthSection');
    if (fourthSection) {
        fourthSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function learnMore() {
    scrollToNext();
}

function toggleAuthForm() {
    const authForms = document.getElementById('authForms');
    authForms.classList.toggle('show-signup');
}

function handleLogin(event) {
    event.preventDefault();
    // TODO: Implement login logic
    console.log('Login submitted');
    alert('로그인 기능은 곧 구현될 예정입니다.');
}

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

        const slideWidth = slides[0].offsetWidth;
        const gap = 30; 
        
        const centerOffset = (viewportWidth / 2) - (slideWidth / 2);
        const moveAmount = (slideWidth + gap) * currentSlideIndex;
        const finalTranslate = centerOffset - moveAmount;

        track.style.transform = `translateX(${finalTranslate}px)`;

        slides.forEach((slide, index) => {
            if (index === currentSlideIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }

    window.nextSlide = function() {
        currentSlideIndex = (currentSlideIndex + 1) % slideCount;
        updateSlidePosition();
    };

    window.prevSlide = function() {
        currentSlideIndex = (currentSlideIndex - 1 + slideCount) % slideCount;
        updateSlidePosition();
    };

    updateSlidePosition();
    window.addEventListener('resize', updateSlidePosition);
    
    setInterval(() => {}, 5000); 
}

window.addEventListener('scroll', updateMoonPosition);

window.addEventListener('load', () => {
    createStars('starsContainer');
    createStars('starsContainer2');
    createStars('starsContainer3');
    createStars('starsContainer4');
    
    updateMoonPosition();
    initCustomSlider();
    
    document.body.style.opacity = '1';
});