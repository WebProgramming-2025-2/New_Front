
// ===== Diary Data Management =====
let diaries = [
    { id: 1, name: '보라카이✈️', image: '../content/12_cover2.png', date: '2024-10-15', pages: 24, month: 0 },
    { id: 2, name: '🫧슬립오버', image: '../content/12_cover2.png', date: '2024-10-20', pages: 18, month: 0 },
    { id: 3, name: '🍰생일 파티!', image: '../content/12_cover2.png', date: '2024-10-25', pages: 32, month: 0 },
    { id: 4, name: '🚞경주 여행', image: '../content/12_cover1.png', date: '2024-09-10', pages: 28, month: 1 },
    { id: 5, name: '🥖베이킹', image: '../content/12_cover2.png', date: '2024-10-30', pages: 15, month: 0 },
    { id: 6, name: '🧶뜨개질', image: '../content/12_cover2.png', date: '2024-10-12', pages: 22, month: 0 },
    { id: 7, name: '🛍️쇼핑', image: '../content/12_cover2.png', date: '2024-10-08', pages: 19, month: 0 }
];

let moveMode = false;
let movingDiaryId = null;
let currentMonthFilter = 0;
let currentCoverNumber = 2;
let hoverTimers = {};
let previewMonthFilter = null;
let previewCoverNumber = null;
// let savedCarouselState = null; // 삭제
let isInCarousel = false;
let isInDiarySection = false;
let lastConfirmedCenterIndex = 0; // '기존 카드'의 인덱스
let isRotating = false;

// ===== Render Diaries =====
function renderDiaries() {
    const grid = document.getElementById('diaryGrid');
    grid.innerHTML = '';
    
    const displayMonth = previewMonthFilter !== null ? previewMonthFilter : currentMonthFilter;
    const filteredDiaries = diaries.filter(d => d.month === displayMonth);
    
    filteredDiaries.forEach(diary => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.dataset.diaryId = diary.id;
        card.innerHTML = `
            <img src="${diary.image}" alt="${diary.name}" class="book-card-image">
            <p class="book-title">${diary.name}</p>
            <div class="diary-info-popup">
                <div class="diary-info-title">${diary.name}</div>
                <div class="diary-info-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    생성일: ${diary.date}
                </div>
                <div class="diary-info-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    총 페이지: ${diary.pages}
                </div>
                <button class="diary-action-btn move" onclick="startMoveDiary(${diary.id}); event.stopPropagation();">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                    다이어리 이동
                </button>
                <button class="diary-action-btn delete" onclick="confirmDeleteDiary(${diary.id}); event.stopPropagation();">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    다이어리 삭제
                </button>
            </div>
        `;
        
        card.addEventListener('mouseenter', () => {
            hoverTimers[diary.id] = setTimeout(() => {
                card.classList.add('show-popup');
            }, 1200);
        });
        
        card.addEventListener('mouseleave', () => {
            if (hoverTimers[diary.id]) {
                clearTimeout(hoverTimers[diary.id]);
                delete hoverTimers[diary.id];
            }
            card.classList.remove('show-popup');
        });
        
        card.addEventListener('click', (e) => {
            if (moveMode) {
                e.stopPropagation();
            }
        });
        
        grid.appendChild(card);
    });
}

// ===== Delete Diary =====
function confirmDeleteDiary(id) {
    const diary = diaries.find(d => d.id === id);
    showModal(
        '다이어리를 삭제하시겠습니까?',
        `"${diary.name}"을(를) 삭제하면 복구할 수 없습니다.`,
        () => deleteDiary(id),
        'delete'
    );
}

function deleteDiary(id) {
    diaries = diaries.filter(d => d.id !== id);
    renderDiaries();
    hideModal();
}

// ===== Move Diary =====
function startMoveDiary(id) {
    movingDiaryId = id;
    moveMode = true;
    document.body.classList.add('move-mode');
    showToast('이동할 달을 선택해주세요');
}

function cancelMoveMode() {
    if (moveMode) {
        moveMode = false;
        movingDiaryId = null;
        document.body.classList.remove('move-mode');
        showToast('이동이 취소되었습니다');
        revertToLastConfirmed(); // '기존 카드'로 복원
    }
}

function moveDiaryToMonth(monthIndex, coverNumber) {
    if (!moveMode || movingDiaryId === null) return;
    
    const diary = diaries.find(d => d.id === movingDiaryId);
    if (diary) {
        diary.month = monthIndex;
        diary.image = `../content/12_cover${coverNumber}.png`;
        
        // 이동 확정 (이미 rotateCarousel에서 '기존 카드'로 세팅됨)
        currentMonthFilter = monthIndex;
        currentCoverNumber = coverNumber;
        
        renderDiaries();
        showToast(`"${diary.name}"이(가) 이동되었습니다`);
    }
    
    moveMode = false;
    movingDiaryId = null;
    document.body.classList.remove('move-mode');
}

// ===== Modal Functions =====
function showModal(title, message, onConfirm, type = 'confirm') {
    const modal = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('modalConfirm');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    if (type === 'delete') {
        confirmBtn.className = 'modal-btn delete';
        confirmBtn.textContent = '삭제';
    } else {
        confirmBtn.className = 'modal-btn confirm';
        confirmBtn.textContent = '확인';
    }
    
    modal.classList.add('active');
    
    confirmBtn.onclick = () => {
        onConfirm();
    };
}

function hideModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

document.getElementById('modalCancel').onclick = hideModal;
document.getElementById('modalOverlay').onclick = (e) => {
    if (e.target.id === 'modalOverlay') hideModal();
};

// ===== Toast Functions =====
function showToast(message) {
    const toast = document.getElementById('toastMessage');
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// ===== Carousel Functions =====
const carousel = document.getElementById('carousel');
const diarySection = document.getElementById('diarySection');
const cards = document.querySelectorAll('.story-card');
const indicators = document.querySelectorAll('.indicator-dot');
let currentCenterIndex = 0;
let rotationInterval = null;
let currentDirection = 0;


/**
 * 캐러셀을 회전시키는 유일한 함수.
 * @param {number} direction - 회전할 양 (e.g., -1, 1, 2, -2)
 * @param {boolean} isConfirm - '기존 카드'로 확정할지(true), 미리보기만 할지(false)
 */
function rotateCarousel(direction, isConfirm = false) {
    // 
    // 
    // 👇 [추가] 자물쇠 확인
    // 
    if (isRotating) return; // 이미 회전 중이면(0.5초가 안 지났으면) 모든 명령 무시

    // 
    // 👇 [추가] 자물쇠 잠그기
    // 
    isRotating = true;

    // 0을 돌리면(중앙 클릭) 아무것도 안 하고 '확정'만 함
    if (direction === 0) {
        if (isConfirm) {
            updateMonthFilter(false); // '기존 카드'로 확정
        }
        isRotating = false; // 👈 [추가] 0일 때는 바로 자물쇠 풀기
        return;
    }

    cards.forEach(card => {
        // ... (기존 회전 로직) ...
        let position = parseInt(card.dataset.position);
        position -= direction; // 이전 코드의 로직
        
        // Wrap-around logic
        if (position > 2) position -= 5;
        if (position < -2) position += 5;
        
        card.dataset.position = position;
        updateCardClass(card, position);
        
        if (position === 0) {
            currentCenterIndex = Array.from(cards).indexOf(card);
        }
    });
    updateIndicators();
    
    if (isConfirm) {
        updateMonthFilter(false); // '기존 카드'로 확정
    } else {
        updateMonthFilter(true); // 미리보기
    }

    // 
    // 
    // 👇 [추가] 0.5초(CSS 애니메이션 시간) 후에 자물쇠 풀기
    // 
    setTimeout(() => {
        isRotating = false;
    }, 500); // CSS의 transition 시간이 0.5s (500ms)
}

function updateMonthFilter(isPreview = false) {
    const monthIndex = currentCenterIndex;
    const centerCard = Array.from(cards).find(card => parseInt(card.dataset.position) === 0);
    
    if (centerCard) {
        const coverNumber = parseInt(centerCard.dataset.cover);
        
        if (isPreview) {
            previewMonthFilter = monthIndex;
            previewCoverNumber = coverNumber;
        } else {
            // '기존 카드'로 확정
            currentMonthFilter = monthIndex;
            currentCoverNumber = coverNumber;
            previewMonthFilter = null;
            previewCoverNumber = null;
            lastConfirmedCenterIndex = currentCenterIndex; // '기존 카드' 인덱스 업데이트
        }
        
        renderDiaries();
    }
}

// ===== 이 함수 전체를 아래 내용으로 교체하세요 =====

function revertToLastConfirmed() {
    // 1. '기존 카드'(lastConfirmedCenterIndex)가 실제로 몇 번 카드인지 찾습니다.
    const targetCard = cards[lastConfirmedCenterIndex];

    // 2. 그 카드의 '현재' data-position이 몇인지 확인합니다. (e.g., -1, 2 등)
    const targetPosition = parseInt(targetCard.dataset.position);

    // 3. 만약 '기존 카드'가 이미 중앙(position 0)에 있다면,
    //    (즉, 호버만 하다가 중앙으로 돌아온 경우)
    //    미리보기(preview)만 끄고 함수를 종료합니다.
    if (targetPosition === 0) {
        updateMonthFilter(false); // previewMonthFilter = null
        return;
    }

    // 4. 만약 '기존 카드'가 중앙에 없다면(e.g., position -2에 있다면),
    //    그 카드의 '현재 위치'(-2)를 클릭(rotateCarousel)해서
    //    중앙으로 오도록 하고 '확정'(true)합니다.
    rotateCarousel(targetPosition, true);
}

// --- Event Listeners ---

carousel.addEventListener('mouseenter', (e) => {
    isInCarousel = true;
    startRotation(e);
});

carousel.addEventListener('mousemove', (e) => {
    const rect = carousel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    let newDirection = 0;
    
    if (x < width * 0.1) {
        newDirection = -1;
    } else if (x > width * 0.9) {
        newDirection = 1;
    }

    if (newDirection !== currentDirection) {
        currentDirection = newDirection;
        stopRotation();
        if (currentDirection !== 0) {
            startContinuousRotation(currentDirection);
        }
    }
});

carousel.addEventListener('mouseleave', () => {
    isInCarousel = false;
    stopRotation();
    currentDirection = 0;
    
    if (moveMode) {
        cancelMoveMode();
    } else {
        setTimeout(() => {
            if (!isInCarousel) {
                revertToLastConfirmed(); 
            }
        }, 100);
    }
});

diarySection.addEventListener('mouseenter', () => {
    isInDiarySection = true;
});

diarySection.addEventListener('mouseleave', () => {
    isInDiarySection = false;
    
    if (moveMode) {
        // 이동 모드에서는 아무것도 안 함
    } else {
        revertToLastConfirmed();
    }
});

function startRotation(e) {
    const rect = carousel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    if (x < width * 0.1) {
        currentDirection = -1;
        startContinuousRotation(-1);
    } else if (x > width * 0.9) {
        currentDirection = 1;
        startContinuousRotation(1);
    }
}

function startContinuousRotation(direction) {
    rotateCarousel(direction, false); // 호버는 '미리보기'(false)
    rotationInterval = setInterval(() => {
        rotateCarousel(direction, false);
    }, 1500);
}

function stopRotation() {
    if (rotationInterval) {
        clearInterval(rotationInterval);
        rotationInterval = null;
    }
}

// 인디케이터(점) 클릭
function goToSlide(targetIndex) {
    const currentCard = Array.from(cards).find(card => parseInt(card.dataset.position) === 0);
    const currentIndex = Array.from(cards).indexOf(currentCard);
    
    let diff = targetIndex - currentIndex;
    
    if (diff > 2) diff -= 5;
    if (diff < -2) diff += 5;
    
    rotateCarousel(-diff, true); // 클릭이므로 '확정'(true)
}

function updateCardClass(card, position) {
    card.className = 'story-card';
    
    switch(position) {
        case 0:
            card.classList.add('center');
            break;
        case -1:
            card.classList.add('left-1');
            break;
        case -2:
            card.classList.add('left-2');
            break;
        case 1:
            card.classList.add('right-1');
            break;
        case 2:
            card.classList.add('right-2');
            break;
    }
}

function updateIndicators() {
    indicators.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentCenterIndex);
    });
}

// *** 핵심: Story Card 클릭 ***
cards.forEach((card, index) => {
    card.addEventListener('click', () => {
        const clickedPosition = parseInt(card.dataset.position);
        
        if (moveMode) {
            // 이동 모드: 클릭한 카드를 중앙으로 이동 & 확정 & 다이어리 이동
            rotateCarousel(clickedPosition, true); 
            moveDiaryToMonth(currentMonthFilter, currentCoverNumber);
        } else {
            // 일반 모드: 클릭한 카드를 중앙으로 이동 & '기존 카드'로 확정
            rotateCarousel(clickedPosition, true);
        }
    });
});

// Initialize
lastConfirmedCenterIndex = 0;
currentCenterIndex = 0;
updateMonthFilter(false); // 초기화 시 0번 카드를 '기존 카드'로 확정
renderDiaries();
