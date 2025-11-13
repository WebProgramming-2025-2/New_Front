// ===== Diary Data Management =====
let diaries = [
    { id: 1, name: '✈️보라카이', date: '2024-01-15', pages: 24, month: 0 }, // 1월
    { id: 2, name: '🫧슬립오버', date: '2024-01-20', pages: 18, month: 0 }, // 1월
    { id: 3, name: '🎰생일 파티!', date: '2024-01-25', pages: 32, month: 0 }, // 1월
    { id: 4, name: '🚞경주 여행', date: '2024-02-10', pages: 28, month: 1 }, // 2월
    { id: 5, name: '🥖베이킹', date: '2024-03-30', pages: 15, month: 2 }, // 3월
    { id: 6, name: '🧶뜨개질', date: '2024-04-12', pages: 22, month: 3 }, // 4월
    { id: 7, name: '🛍️쇼핑', date: '2024-05-08', pages: 19, month: 4 } // 5월
];


let moveMode = false;
let movingDiaryId = null;
let currentMonthFilter = 0;
let hoverTimers = {};
let previewMonthFilter = null;
let isInCarousel = false;
let isInDiarySection = false;
let lastConfirmedCenterIndex = 0;
let isRotating = false;

// ===== Render Diaries =====
function renderDiaries() {
    const grid = document.getElementById('diaryGrid');
    grid.innerHTML = '';
    
    const displayMonth = previewMonthFilter !== null ? previewMonthFilter : currentMonthFilter;
    const filteredDiaries = diaries.filter(d => d.month === displayMonth);
    
    filteredDiaries.forEach((diary, index) => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.dataset.diaryId = diary.id;
        
        // 🚨 SVG 색상 설정: 배경은 연보라색 단색, 중앙 네모는 요청 그라데이션
        card.innerHTML = `
           <svg class="book-svg" viewBox="0 0 490 490" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="innerFillGradient${diary.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:rgb(255, 255, 255);stop-opacity:0.9" /> 
                        <stop offset="100%" style="stop-color:rgb(248, 249, 255);stop-opacity:0.9" /> 
                    </linearGradient>
                </defs>
                
                <g fill="#CDBEFF"> 
                    <rect x="369.587" y="412.128" width="19.993" height="38"/>
                    <rect x="409.574" y="0" width="19.426" height="401.309"/>
                    
                    <path d="M103.666,430.25c0-15.983,12.98-28.941,28.991-28.941H389.58V0H119.255C87.082,0,61,26.037,61,58.154v373.692
                        C61,463.963,87.081,490,119.255,490H429v-30.809H132.657C116.646,459.191,103.666,446.233,103.666,430.25z"/>
                </g>
                
                <path fill="url(#innerFillGradient${diary.id})" d="M154.663,95.645
                    c0-7.568,6.145-13.703,13.726-13.703h170.475c7.583,0,13.728,6.135,13.728,13.703v49.329c0,7.568-6.146,13.703-13.728,13.703
                    H168.389c-7.58,0-13.726-6.135-13.726-13.703V95.645z"/>

            </svg>

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
        () => deleteDiary(id, diary.name), 
        'delete'
    );
}

function deleteDiary(id, diaryName) {
    // 1. 데이터 업데이트
    diaries = diaries.filter(d => d.id !== id);
    
    // 2. 화면 업데이트
    renderDiaries();
    
    // 3. 모달 숨기기
    hideModal();
    
    // 4. 토스트 메시지 표시
    showToast(`"${diaryName}"이(가) 삭제되었습니다`);
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
        revertToLastConfirmed();
    }
}

function moveDiaryToMonth(monthIndex) {
    if (!moveMode || movingDiaryId === null) return;
    
    const diary = diaries.find(d => d.id === movingDiaryId);
    if (diary) {
        diary.month = monthIndex;
        
        currentMonthFilter = monthIndex;
        
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

function rotateCarousel(direction, isConfirm = false) {
    if (isRotating) return;
    isRotating = true;

    if (direction === 0) {
        if (isConfirm) {
            updateMonthFilter(false);
        }
        isRotating = false;
        return;
    }

    cards.forEach(card => {
        let position = parseInt(card.dataset.position);
        position -= direction;
        
        // 🚨 12개 항목 순환 로직 적용
        const totalItems = cards.length; 
        if (position > totalItems / 2) position -= totalItems; 
        if (position < -totalItems / 2) position += totalItems; 
        
        card.dataset.position = position;
        updateCardClass(card, position);
        
        if (position === 0) {
            currentCenterIndex = Array.from(cards).indexOf(card);
        }
    });
    updateIndicators();
    
    if (isConfirm) {
        updateMonthFilter(false);
    } else {
        updateMonthFilter(true);
    }

    setTimeout(() => {
        isRotating = false;
    }, 500);
}

function updateMonthFilter(isPreview = false) {
    const monthIndex = currentCenterIndex;
    
    if (isPreview) {
        previewMonthFilter = monthIndex;
    } else {
        currentMonthFilter = monthIndex;
        previewMonthFilter = null;
        lastConfirmedCenterIndex = currentCenterIndex;
    }
    
    renderDiaries();
}

function revertToLastConfirmed() {
    const targetCard = cards[lastConfirmedCenterIndex];
    const targetPosition = parseInt(targetCard.dataset.position);

    if (targetPosition === 0) {
        updateMonthFilter(false);
        return;
    }

    // 🚨 12개 항목 순환 로직에 맞춰 position 값을 조정
    const totalItems = cards.length;
    let diff = targetPosition;
    
    if (diff > totalItems / 2) diff -= totalItems;
    if (diff < -totalItems / 2) diff += totalItems;

    rotateCarousel(diff, true);
}

// --- Event Listeners ---

// 마우스 휠 이벤트로 회전
carousel.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    // deltaY > 0: 아래로 스크롤 (왼쪽으로 회전)
    // deltaY < 0: 위로 스크롤 (오른쪽으로 회전)
    const direction = e.deltaY > 0 ? 1 : -1;
    
    rotateCarousel(direction, false);
}, { passive: false });

carousel.addEventListener('mouseenter', () => {
    isInCarousel = true;
});

carousel.addEventListener('mouseleave', () => {
    isInCarousel = false;
    
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

function goToSlide(targetIndex) {
    const totalItems = cards.length; // 12
    const currentCard = Array.from(cards).find(card => parseInt(card.dataset.position) === 0);
    const currentIndex = Array.from(cards).indexOf(currentCard);
    
    let diff = targetIndex - currentIndex;
    
    // 🚨 12를 기준으로 순환 차이 계산
    if (diff > totalItems / 2) diff -= totalItems;
    if (diff < -totalItems / 2) diff += totalItems;
    
    rotateCarousel(-diff, true);
}

function updateCardClass(card, position) {
    card.className = 'story-card';
    
    // 🚨 CSS는 center, left-1, left-2, right-1, right-2에 대해서만 정의되어 있음.
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

cards.forEach((card, index) => {
    card.addEventListener('click', () => {
        const clickedPosition = parseInt(card.dataset.position);
        
        if (moveMode) {
            rotateCarousel(clickedPosition, true); 
            moveDiaryToMonth(currentMonthFilter);
        } else {
            rotateCarousel(clickedPosition, true);
        }
    });
});

// Initialize
lastConfirmedCenterIndex = 0;
currentCenterIndex = 0;
updateMonthFilter(false);
renderDiaries();