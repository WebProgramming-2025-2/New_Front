const diaryPagesContainer = document.getElementById('diaryPagesContainer');
let savedRange = null;

// --- 에디터 커서 위치 저장 (리스트 생성 위치 지정 위함) ---
const editors = document.querySelectorAll('.editor-placeholder');
editors.forEach(editor => {
    editor.addEventListener('blur', saveSelection);
    editor.addEventListener('keyup', saveSelection);
    editor.addEventListener('mouseup', saveSelection);
    
    // 드래그 앤 드롭 방지 (텍스트 드래그 시 스티커처럼 생기는 것 방지)
    editor.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });
});

// 텍스트 박스 내부 텍스트 드래그 방지
document.addEventListener('dragstart', (e) => {
    if (e.target.closest('.text-box-content')) {
        e.preventDefault();
    }
});

// 텍스트 박스에서도 커서 위치 저장
document.addEventListener('mouseup', (e) => {
    if (e.target.classList.contains('text-box-content') || e.target.closest('.text-box-content')) {
        saveSelection();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.target.classList.contains('text-box-content') || e.target.closest('.text-box-content')) {
        saveSelection();
    }
});

function saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        savedRange = selection.getRangeAt(0);
    }
}

// --- 다이어리 스타일 ---
const urlParams = new URLSearchParams(window.location.search);
const coverStyle = urlParams.get('cover') || 'default';
const pageStyle = urlParams.get('page') || 'default';

// 커버 스타일 변환
function applyCoverStyle(style) {
    const cover = document.getElementById('diaryCover');
    const coverStyles = {
        'default': 'linear-gradient(135deg, #8b7ab8 0%, #6b5a9e 100%)',
        'brown': 'linear-gradient(135deg, #8b7355 0%, #6b5a42 100%)',
        'blue': 'linear-gradient(135deg, #5a7a9e 0%, #425a6b 100%)',
        'pink': 'linear-gradient(135deg, #d47a9e 0%, #b85a7a 100%)'
    };
    cover.style.background = coverStyles[style] || coverStyles['default'];
}

// 속지 스타일 변환
function applyPageStyle(style) {
    const leftPage = document.getElementById('leftPage');
    const rightPage = document.getElementById('rightPage');
    
    leftPage.style.background = '';
    rightPage.style.background = '';
    
    const pageStyles = {
        'default': { 
            backgroundColor: 'rgba(255, 255, 255, 0.98)' 
        },
        'lined': {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backgroundImage: `repeating-linear-gradient(
                transparent 0,
                transparent 27px,
                rgba(0,0,0,0.12) 28px,
                transparent 29px
            )`,
            backgroundAttachment: 'local',
            backgroundPosition: '0 6px'
        },
        'grid': {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backgroundImage: `
                linear-gradient(rgba(157, 117, 255, 0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(157, 117, 255, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
        }
    };

    const selectedStyle = pageStyles[style] || pageStyles['default'];
    Object.assign(leftPage.style, selectedStyle);
    Object.assign(rightPage.style, selectedStyle);
}

applyCoverStyle(coverStyle);
applyPageStyle(pageStyle);

// --- 2. 객체 조절 로직 (PPT 스타일) ---
function makeDraggableResizable(contentElement, x, y, initialWidth = 'auto', initialHeight = 'auto') {
    const container = document.createElement('div');
    container.className = 'floating-object-container selected';
    container.style.left = x + 'px';
    container.style.top = y + 'px';
    if(initialWidth !== 'auto') container.style.width = initialWidth + 'px';
    if(initialHeight !== 'auto') container.style.height = initialHeight + 'px';

    contentElement.style.width = '100%';
    contentElement.style.height = '100%';
    contentElement.style.display = 'block';
    
    // 4. 이미지 드래그 방지
    if (contentElement.tagName === 'IMG') {
        contentElement.draggable = false;
    }
    
    // 텍스트 박스 내부 드래그 방지
    if (contentElement.classList.contains('text-box-content')) {
        contentElement.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
    }
    
    container.appendChild(contentElement);

    const handles = ['nw', 'ne', 'sw', 'se'];
    handles.forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `resize-handle handle-${pos}`;
        handle.setAttribute('data-handle', pos);
        container.appendChild(handle);
    });

    const rotateHandle = document.createElement('div');
    rotateHandle.className = 'rotate-handle';
    container.appendChild(rotateHandle);

    diaryPagesContainer.appendChild(container);
    setupInteraction(container, rotateHandle);
}

function setupInteraction(container, rotateHandle) {
    let isDragging = false;
    let isResizing = false;
    let isRotating = false;
    let startX, startY, startLeft, startTop, startWidth, startHeight;
    let currentRotation = 0;
    let initialAngle = 0;

    container.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('text-box-content')) {
            document.querySelectorAll('.floating-object-container').forEach(el => el.classList.remove('selected'));
            container.classList.add('selected');
            return;
        }

        e.stopPropagation();
        e.preventDefault(); // 드래그 선택 방지
        
        document.querySelectorAll('.floating-object-container').forEach(el => el.classList.remove('selected'));
        container.classList.add('selected');

        if (e.target.classList.contains('resize-handle')) {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = container.offsetLeft;
            startTop = container.offsetTop;
            startWidth = container.offsetWidth;
            startHeight = container.offsetHeight;
            container.dataset.resizeDir = e.target.dataset.handle;
        } else if (e.target === rotateHandle) {
            isRotating = true;
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            initialAngle = Math.atan2(dy, dx) * (180 / Math.PI) - currentRotation;
        } else {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = container.offsetLeft;
            startTop = container.offsetTop;
            container.style.cursor = 'grabbing';
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            container.style.left = `${startLeft + dx}px`;
            container.style.top = `${startTop + dy}px`;
        } else if (isResizing) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const dir = container.dataset.resizeDir;
            
            if (dir.includes('e')) {
                container.style.width = `${startWidth + dx}px`;
            }
            if (dir.includes('s')) {
                container.style.height = `${startHeight + dy}px`;
            }
            if (dir.includes('w')) {
                const newWidth = startWidth - dx;
                if (newWidth > 30) {
                    container.style.width = `${newWidth}px`;
                    container.style.left = `${startLeft + dx}px`;
                }
            }
            if (dir.includes('n')) {
                const newHeight = startHeight - dy;
                if (newHeight > 30) {
                    container.style.height = `${newHeight}px`;
                    container.style.top = `${startTop + dy}px`;
                }
            }
        } else if (isRotating) {
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            currentRotation = Math.atan2(dy, dx) * (180 / Math.PI) - initialAngle;
            container.style.transform = `rotate(${currentRotation}deg)`;
        }
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        isResizing = false;
        isRotating = false;
        container.style.cursor = 'move';
    });
}

// 1. Backspace/Delete 키로 floating object 삭제
document.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
        const selected = document.querySelector('.floating-object-container.selected');
        if (selected) {
            // 텍스트 박스인 경우, 포커스가 있고 내용이 있으면 삭제하지 않음
            const textBox = selected.querySelector('.text-box-content');
            if (textBox && document.activeElement === textBox && textBox.textContent.trim() !== '') {
                return;
            }
            // 그 외의 경우 객체 삭제
            e.preventDefault();
            selected.remove();
        }
    }
});

// 3. 스티커 팝업 동작
const insertBtn = document.getElementById('insertBtn');
const insertDropdown = document.getElementById('insertDropdown');
const stickerMenuBtn = document.getElementById('stickerMenuBtn');
const stickerPopup = document.getElementById('stickerPopup');

insertBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    stickerPopup.classList.remove('show');
    const isShown = insertDropdown.classList.contains('show');
    closeAllPopups();
    if (!isShown) insertDropdown.classList.add('show');
});

stickerMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    insertDropdown.classList.remove('show');
    stickerPopup.classList.add('show');
    loadStickers();
});

function loadStickers() {
    stickerPopup.innerHTML = '';
    const stickerFiles = ['bear.png', 'TIMETOTRAVEL.png', '나비.png', '엽서.png', '카세트테이프.png', '크로와상.png', 'camera.png', '팬케이크.png'];
    stickerFiles.forEach((file, index) => {
        const img = document.createElement('img');
        img.src = `../content/${file}`; 
        img.className = 'sticker-option';
        img.draggable = true;
        
        // 드래그 시작
        img.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', img.src);
            e.dataTransfer.effectAllowed = 'copy';
        });
        
        // 클릭 시 중앙에 추가
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = diaryPagesContainer.getBoundingClientRect();
            const centerX = rect.width / 2 - 40; // 스티커 크기(80)의 절반
            const centerY = rect.height / 2 - 40;
            const newImg = document.createElement('img');
            newImg.src = img.src;
            makeDraggableResizable(newImg, centerX, centerY, 80, 80);
            stickerPopup.classList.remove('show');
        });
        
        stickerPopup.appendChild(img);
    });
}

diaryPagesContainer.addEventListener('dragover', (e) => e.preventDefault());
diaryPagesContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    const imgSrc = e.dataTransfer.getData('text/plain');
    if (imgSrc) {
        const rect = diaryPagesContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const img = document.createElement('img');
        img.src = imgSrc;
        makeDraggableResizable(img, x, y, 80, 80); 
        stickerPopup.classList.remove('show');
    }
});

// --- 커스텀 색상 팔레트 로직 ---
const colorBtn = document.getElementById('colorBtn');
const colorPopup = document.getElementById('colorPopup');
const colorPaletteGrid = document.getElementById('colorPaletteGrid');

const paletteColors = [
    '#000000', '#424242', '#757575', '#BDBDBD', '#FFFFFF',
    '#D32F2F', '#C2185B', '#7B1FA2', '#512DA8', '#303F9F',
    '#1976D2', '#0288D1', '#0097A7', '#00796B', '#388E3C',
    '#689F38', '#AFB42B', '#FBC02D', '#FFA000', '#F57C00'
];

let tempSelectedColor = '#000000';

function initPalette() {
    colorPaletteGrid.innerHTML = '';
    paletteColors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'palette-swatch';
        swatch.style.backgroundColor = color;
        swatch.onclick = () => selectColorInPalette(swatch, color);
        colorPaletteGrid.appendChild(swatch);
    });
}

function selectColorInPalette(swatchElement, color) {
    document.querySelectorAll('.palette-swatch').forEach(el => el.classList.remove('selected'));
    swatchElement.classList.add('selected');
    tempSelectedColor = color;
}

colorBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isShown = colorPopup.style.display === 'flex';
    closeAllPopups();
    if (!isShown) {
        initPalette();
        colorPopup.style.display = 'flex';
    }
});

function applySelectedColor() {
    document.getElementById('currentColorDisplay').style.background = tempSelectedColor;
    applyTextStyle('color', tempSelectedColor);
    colorPopup.style.display = 'none';
}

// 5. 리스트 삽입
const listBtn = document.getElementById('listBtn');
const listDropdown = document.getElementById('listDropdown');

listBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isShown = listDropdown.classList.contains('show');
    closeAllPopups();
    if (!isShown) listDropdown.classList.add('show');
});

function insertListAtCursor(type) {
    if (savedRange) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(savedRange);
    }
    document.execCommand(type === 'ordered' ? 'insertOrderedList' : 'insertUnorderedList', false, null);
    listDropdown.classList.remove('show');
}

// 6. 텍스트 박스 & 사진
function createTextBox() {
    const div = document.createElement('div');
    div.className = 'text-box-content';
    div.contentEditable = true;
    
    div.textContent = ""; 
    div.setAttribute('data-placeholder', '텍스트를 입력하세요');
    
    // 텍스트 박스에서 커서 위치 저장
    div.addEventListener('mouseup', saveSelection);
    div.addEventListener('keyup', saveSelection);
    div.addEventListener('blur', saveSelection);
    
    makeDraggableResizable(div, 300, 200, 200, 'auto');
    insertDropdown.classList.remove('show');
    
    div.focus();
}

function insertPhoto() {
    document.getElementById('photoInput').click();
    document.getElementById('insertDropdown').classList.remove('show');
}

document.getElementById('photoInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.draggable = false; // 4. 이미지 드래그 방지
            makeDraggableResizable(img, 200, 200, 200, 'auto'); 
        };
        reader.readAsDataURL(file);
    }
    e.target.value = '';
});

// 2. 하이라이트 토글 기능 개선
function applyTextStyle(command, value = null) {
    if (savedRange) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(savedRange);
    }
    
    if (command === 'color') {
        document.execCommand('foreColor', false, value);
    } else if (command === 'highlight') {
        // 하이라이트 토글: 이미 하이라이트가 있으면 제거, 없으면 추가
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const container = range.commonAncestorContainer;
            const parent = container.nodeType === 3 ? container.parentNode : container;
            
            // 현재 선택 영역에 하이라이트가 있는지 확인
            if (parent.style && parent.style.backgroundColor === 'rgb(255, 235, 59)') {
                // 하이라이트 제거 (배경색을 투명으로)
                document.execCommand('hiliteColor', false, 'transparent');
            } else {
                // 하이라이트 추가
                document.execCommand('hiliteColor', false, '#ffeb3b');
            }
        }
    } else {
        document.execCommand(command, false, null);
    }
}

function closeAllPopups() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('show'));
    document.getElementById('stickerPopup').classList.remove('show');
    document.getElementById('colorPopup').style.display = 'none';
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.btn-group') && !e.target.closest('.custom-toolbar')) {
        closeAllPopups();
    }
    if (!e.target.closest('.floating-object-container')) {
        document.querySelectorAll('.floating-object-container').forEach(el => el.classList.remove('selected'));
    }
});

// 전역 텍스트 선택 방지 (resize 중)
document.addEventListener('selectstart', (e) => {
    const selected = document.querySelector('.floating-object-container.selected');
    if (selected && !e.target.classList.contains('text-box-content') && 
        !e.target.classList.contains('editor-placeholder')) {
        e.preventDefault();
    }
});