document.addEventListener("DOMContentLoaded", () => {
    const starContainer = document.createElement('div');
    starContainer.className = 'common-star-bg';
    document.body.appendChild(starContainer);

    const createStars = () => {
        const starCount = 85;

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';

            const x = Math.random() * 100;
            const y = Math.random() * 100;

            const size = Math.random() * 2 + 1;
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 5;

            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.animationDuration = `${duration}s`;
            star.style.animationDelay = `${delay}s`;

            starContainer.appendChild(star);
        }
    };

    createStars();
});