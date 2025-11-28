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
    
    // 일기가 없을 때 안내 메시지 표시 (선택 사항)
    if (filteredDiaries.length === 0) {
        grid.innerHTML = '<div style="width:100%; text-align:center; color:rgba(255,255,255,0.3); padding: 40px;">아직 작성된 다이어리가 없습니다.</div>';
        // 새 글 쓰기 버튼 추가
        const addCard = createAddCard();
        grid.appendChild(addCard);
        return;
    }

    filteredDiaries.forEach((diary) => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.dataset.diaryId = diary.id;
        
        
        
        // 호버 이벤트
        card.addEventListener('mouseenter', () => {
            // 호버 시 팝업 표시 딜레이
            hoverTimers[diary.id] = setTimeout(() => {
                card.classList.add('show-popup');
            }, 500); // 0.5초로 반응 속도 개선
        });
        
        card.addEventListener('mouseleave', () => {
            if (hoverTimers[diary.id]) {
                clearTimeout(hoverTimers[diary.id]);
                delete hoverTimers[diary.id];
            }
            card.classList.remove('show-popup');
        });
        
        grid.appendChild(card);
    });

    // 마지막에 '새 글 쓰기' 카드 추가
    const addCard = createAddCard();
    grid.appendChild(addCard);
}

function createAddCard() {
    const addCard = document.createElement('div');
    addCard.className = 'book-card';
    addCard.innerHTML = `
        <div class="book-card-inner" style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px;">
            <div class="new-entry-icon">
                <span style="color: #fff; font-size: 24px; font-weight: 300;">+</span>
            </div>
            <span style="color: rgba(255,255,255,0.9); font-size: 13px; font-weight: 600;">새 글 쓰기</span>
        </div>
    `;
    return addCard;
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
    diaries = diaries.filter(d => d.id !== id);
    renderDiaries();
    hideModal();
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
        showToast(`"${diary.name}"이(가) ${monthIndex + 1}월로 이동되었습니다`);
    }
    
    moveMode = false;
    movingDiaryId = null;
    document.body.classList.remove('move-mode');
}

// ===== Modal & Toast =====
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
    confirmBtn.onclick = onConfirm;
}

function hideModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

document.getElementById('modalCancel').onclick = hideModal;
document.getElementById('modalOverlay').onclick = (e) => {
    if (e.target.id === 'modalOverlay') hideModal();
};

function showToast(message) {
    const toast = document.getElementById('toastMessage');
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// ===== Carousel Logic =====
const carousel = document.getElementById('carousel');
const diarySection = document.getElementById('diarySection');
const cards = document.querySelectorAll('.story-card');
const indicators = document.querySelectorAll('.indicator-dot');
let currentCenterIndex = 0;

function rotateCarousel(direction, isConfirm = false) {
    if (isRotating) return;
    isRotating = true;

    if (direction === 0) {
        if (isConfirm) updateMonthFilter(false);
        isRotating = false;
        return;
    }

    cards.forEach(card => {
        let position = parseInt(card.dataset.position);
        position -= direction;
        
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

    setTimeout(() => { isRotating = false; }, 500);
}

function updateMonthFilter(isPreview = false) {
    // HTML에 정의된 카드 순서(DOM 순서)와 월(0~11)이 일치한다고 가정
    // cards[0] = 1월, cards[1] = 2월 ...
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

    const totalItems = cards.length;
    let diff = targetPosition;
    
    if (diff > totalItems / 2) diff -= totalItems;
    if (diff < -totalItems / 2) diff += totalItems;

    rotateCarousel(diff, true);
}

function updateCardClass(card, position) {
    card.className = 'story-card';
    card.classList.remove('center', 'left-1', 'left-2', 'right-1', 'right-2');
    
    switch(position) {
        case 0: card.classList.add('center'); break;
        case -1: card.classList.add('left-1'); break;
        case -2: card.classList.add('left-2'); break;
        case 1: card.classList.add('right-1'); break;
        case 2: card.classList.add('right-2'); break;
    }
}

function updateIndicators() {
    indicators.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentCenterIndex);
    });
}

function goToSlide(targetIndex) {
    const totalItems = cards.length;
    const currentCard = Array.from(cards).find(card => parseInt(card.dataset.position) === 0);
    const currentIndex = Array.from(cards).indexOf(currentCard);
    
    let diff = targetIndex - currentIndex;
    
    if (diff > totalItems / 2) diff -= totalItems;
    if (diff < -totalItems / 2) diff += totalItems;
    
    rotateCarousel(-diff, true);
}

// Events
carousel.addEventListener('wheel', (e) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 1 : -1;
    rotateCarousel(direction, false);
}, { passive: false });

carousel.addEventListener('mouseenter', () => { isInCarousel = true; });
carousel.addEventListener('mouseleave', () => {
    isInCarousel = false;
    if (moveMode) cancelMoveMode();
    else setTimeout(() => { if (!isInCarousel) revertToLastConfirmed(); }, 100);
});

diarySection.addEventListener('mouseenter', () => { isInDiarySection = true; });
diarySection.addEventListener('mouseleave', () => {
    isInDiarySection = false;
    if (!moveMode) revertToLastConfirmed();
});

cards.forEach((card) => {
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

// Init
lastConfirmedCenterIndex = 0;
currentCenterIndex = 0;
updateMonthFilter(false);
renderDiaries();