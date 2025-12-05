let diaries = [...dummyDiaries];

const savedData = localStorage.getItem('diary_permanent_data');
if (savedData) {
    const savedList = JSON.parse(savedData);
    const newDiaries = savedList.filter(saved => 
        !diaries.some(dummy => dummy.id === saved.id)
    );
    diaries = [...diaries, ...newDiaries];
}

diaries.sort((a, b) => new Date(b.date) - new Date(a.date));

// ===== State Variables =====
let moveMode = false;
let movingDiaryId = null;
let currentMonthFilter = 0;
let hoverTimers = {};
let previewMonthFilter = null;
let isInCarousel = false;
let isInDiarySection = false;
let lastConfirmedCenterIndex = 0;
let isRotating = false;

let isLatestFirst = true; 


function renderDiaries() {
    const grid = document.getElementById('diaryGrid');
    const isListView = grid.classList.contains('view-mode-list'); 
    grid.innerHTML = '';
    
    const displayMonth = previewMonthFilter !== null ? previewMonthFilter : currentMonthFilter;
    if (!diaries) diaries = [];
    let filteredDiaries = diaries.filter(d => d.month === displayMonth);
    
    filteredDiaries.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return isLatestFirst ? dateB - dateA : dateA - dateB;
    });
    
    filteredDiaries.forEach((diary) => {
        const card = document.createElement('div');
        const coverFill = diary.coverColor || '#9d75ff';
        const pageCount = diary.pages ? Object.keys(diary.pages).length : 1;
        card.dataset.diaryId = diary.id;
        if (isListView) {
            card.className = 'list-card'; 
            card.innerHTML = `
                <svg class="book-svg" viewBox="0 0 490 490" xmlns="http://www.w3.org/2000/svg">
                    <g fill="${coverFill}"> 
                        <rect x="369.587" y="412.128" width="19.993" height="38"/>
                        <rect x="409.574" y="0" width="19.426" height="401.309"/>
                        <path d="M103.666,430.25c0-15.983,12.98-28.941,28.991-28.941H389.58V0H119.255C87.082,0,61,26.037,61,58.154v373.692 C61,463.963,87.081,490,119.255,490H429v-30.809H132.657C116.646,459.191,103.666,446.233,103.666,430.25z"/>
                    </g>
                    <path fill="url(#commonBookPaper)" d="M154.663,95.645 c0-7.568,6.145-13.703,13.726-13.703h170.475c7.583,0,13.728,6.135,13.728,13.703v49.329c0,7.568-6.146,13.703-13.728,13.703 H168.389c-7.58,0-13.726-6.135-13.726-13.703V95.645z"/>
                </svg>
                
                <div class="list-title">${diary.title}</div>
                <div class="list-info-content">
                    <div class="list-info-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span>생성일: ${diary.date}</span>
                    </div>
                    <div class="list-info-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                        <span>총 페이지: ${pageCount}p</span>
                    </div>
                </div>
                <div class="diary-actions">
                    <button class="diary-action-btn move" onclick="startMoveDiary(${diary.id}); event.stopPropagation();">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                        이동
                    </button>
                    <button class="diary-action-btn delete" onclick="confirmDeleteDiary(${diary.id}); event.stopPropagation();">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        삭제
                    </button>
                </div>
            `;
        } else {
            card.className = 'grid-card'; 
            card.innerHTML = `
                <svg class="book-svg" viewBox="0 0 490 490" xmlns="http://www.w3.org/2000/svg">
                    <g fill="${coverFill}"> 
                        <rect x="369.587" y="412.128" width="19.993" height="38"/>
                        <rect x="409.574" y="0" width="19.426" height="401.309"/>
                        <path d="M103.666,430.25c0-15.983,12.98-28.941,28.991-28.941H389.58V0H119.255C87.082,0,61,26.037,61,58.154v373.692 C61,463.963,87.081,490,119.255,490H429v-30.809H132.657C116.646,459.191,103.666,446.233,103.666,430.25z"/>
                    </g>
                    <path fill="url(#commonBookPaper)" d="M154.663,95.645 c0-7.568,6.145-13.703,13.726-13.703h170.475c7.583,0,13.728,6.135,13.728,13.703v49.329c0,7.568-6.146,13.703-13.728,13.703 H168.389c-7.58,0-13.726-6.135-13.726-13.703V95.645z"/>
                </svg>
                
                <p class="book-title">${diary.title}</p>
                
                <div class="diary-info-popup">
                    <div class="diary-info-title">${diary.title}</div>
                    <div class="diary-info-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        생성일: ${diary.date}
                    </div>
                    <div class="diary-info-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                        총 페이지: ${pageCount}p
                    </div>
                    <button class="diary-action-btn move" onclick="startMoveDiary(${diary.id}); event.stopPropagation();">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                        다이어리 이동
                    </button>
                    <button class="diary-action-btn delete" onclick="confirmDeleteDiary(${diary.id}); event.stopPropagation();">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        다이어리 삭제
                    </button>
                </div>
            `;
            
            card.addEventListener('mouseenter', () => {
                hoverTimers[diary.id] = setTimeout(() => {
                    card.classList.add('show-popup');
                }, 800);
            });
            
            card.addEventListener('mouseleave', () => {
                if (hoverTimers[diary.id]) {
                    clearTimeout(hoverTimers[diary.id]);
                    delete hoverTimers[diary.id];
                }
                card.classList.remove('show-popup');
            });
        }
        
        card.addEventListener('click', (e) => {
            if (moveMode) {
                e.stopPropagation();
            } else {
                localStorage.setItem('currentDiaryId', diary.id); // ID 저장
                window.location.href = '12_DMD_Write_Diary.html';
            }
        });
        
        grid.appendChild(card);
    });
}

// ===== Control Buttons Logic =====
document.addEventListener('DOMContentLoaded', () => {
    const controlBtns = document.querySelectorAll('.control-btn');
    if (controlBtns.length >= 2) {
        const sortBtn = controlBtns[0]; 
        const viewBtn = controlBtns[1]; 
        
        const updateTooltipText = (btn, text) => {
            const tooltip = btn.querySelector('.sidebar-tooltip');
            if (tooltip) tooltip.innerText = text;
        }

        sortBtn.addEventListener('click', () => {
            isLatestFirst = !isLatestFirst; 
            const svg = sortBtn.querySelector('svg');
            if(svg) {
                svg.style.transition = 'transform 0.4s ease';
                svg.style.transform = isLatestFirst ? 'rotate(0deg)' : 'rotate(180deg)';
            }
            renderDiaries();
            updateTooltipText(sortBtn, isLatestFirst ? '과거순 정렬' : '최신순 정렬');
        });

        viewBtn.addEventListener('click', () => {
            const grid = document.getElementById('diaryGrid');
            grid.classList.toggle('view-mode-list'); 
            const isListView = grid.classList.contains('view-mode-list');
            renderDiaries(); 
            
            updateTooltipText(viewBtn, isListView ? '책장으로 보기' : '리스트로 보기');
        });
    }
});

function confirmDeleteDiary(id) {
    const diary = diaries.find(d => d.id === id);
    showModal(
        '다이어리를 삭제하시겠습니까?',
        `"${diary.title}"을(를) 삭제하면 복구할 수 없습니다.`,
        () => deleteDiary(id, diary.title), 
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
        showToast(`"${diary.title}"이(가) 이동되었습니다`);
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
    const modal = document.getElementById('modalOverlay');
    if (modal) modal.classList.remove('active');
}

const modalCancel = document.getElementById('modalCancel');
if(modalCancel) modalCancel.onclick = hideModal;

const modalOverlay = document.getElementById('modalOverlay');
if(modalOverlay) {
    modalOverlay.onclick = (e) => {
        if (e.target.id === 'modalOverlay') hideModal();
    };
}

// ===== Toast Functions =====
function showToast(message) {
    const toast = document.getElementById('toastMessage');
    toast.textContent = message;
    toast.classList.add('active');
    if(toast.timer) clearTimeout(toast.timer);
    
    toast.timer = setTimeout(() => {
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

    const totalItems = cards.length;
    let diff = targetPosition;
    
    if (diff > totalItems / 2) diff -= totalItems;
    if (diff < -totalItems / 2) diff += totalItems;

    rotateCarousel(diff, true);
}

// --- Event Listeners ---

if (carousel) {
    carousel.addEventListener('wheel', (e) => {
        e.preventDefault();
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
}

if (diarySection) {
    diarySection.addEventListener('mouseenter', () => {
        isInDiarySection = true;
    });

    diarySection.addEventListener('mouseleave', () => {
        isInDiarySection = false;
        
        if (moveMode) {
        } else {
            revertToLastConfirmed();
        }
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

function updateCardClass(card, position) {
    card.className = 'story-card';
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