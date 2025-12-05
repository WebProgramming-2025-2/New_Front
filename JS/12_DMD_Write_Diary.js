const diaryPagesContainer = document.getElementById('diaryPagesContainer');
let activeQuill = null;
const DIARY_STORAGE_KEY = 'diary_permanent_data';
const MAX_PAGES = 10;
const DIARY_TITLE_KEY = 'diary_title';

//  에디터 초기화 (외부라이브러리 (작성화면))
function initQuill(element, placeholderText = null) {
    const text = placeholderText || element.getAttribute('data-placeholder');
    const quill = new Quill(element, {
        theme: 'snow',
        placeholder: text,
        modules: {
            toolbar: false,
            history: {
                delay: 0,
                maxStack: 500,
                userOnly: true
            }
        }
    });

    // 텍스트 드래그로 객체 생성되는 것 방지
    element.style.userSelect = 'text';
    element.style.webkitUserDrag = 'none';

    // 엔터 치다가 다이어리 넘어가지 않게 막아줌
    if (element.id === 'leftEditor' || element.id === 'rightEditor') {
        quill.on('text-change', (delta, oldDelta, source) => {
            if (source === 'user') {
                const contentHeight = quill.root.scrollHeight;
                const containerHeight = quill.root.clientHeight;
                if (contentHeight > containerHeight) {
                    quill.history.undo();
                }
            }
        });
    }
    quill.on('selection-change', (range) => {
        if (range) activeQuill = quill;
    });
    element.querySelector('.ql-editor').addEventListener('focus', () => {
        activeQuill = quill;
    });
    return quill;
}

document.querySelectorAll('.editor-placeholder').forEach(editorEl => {
    initQuill(editorEl);
});


// 텍스트 입력 칸 누를 시 생성되는 칸
function createTextBox() {
    const div = document.createElement('div');
    div.className = 'text-box-content';

    makeDraggableResizable(div, 300, 200, 250, 'auto');
    
    const quill = initQuill(div, '내용을 입력하세요.');
    
    const insertDropdown = document.getElementById('insertDropdown');
    if(insertDropdown) insertDropdown.classList.remove('show');
    
    setTimeout(() => quill.focus(), 50);
}


// 3. 꾸미기 스타일
function applyTextStyle(command, value = null) {
    if (!activeQuill) return;

    if (command === 'strikethrough') {
        command = 'strike';
    }

    if (command === 'highlight') {
        const currentFormat = activeQuill.getFormat();
        if (currentFormat.background === 'var(--color-primary-light)') {
            activeQuill.format('background', false);
        } else {
            activeQuill.format('background', 'var(--color-primary-light)');
        }
    } 
    else if (command.startsWith('justify')) {
        const alignValue = command.replace('justify', '').toLowerCase();
        activeQuill.format('align', alignValue === 'left' ? false : alignValue);
    }
    else if (command === 'fontSize') {
        activeQuill.format('size', value);
    }
    else if (command === 'formatBlock') {
        if (value === 'H1') activeQuill.format('header', 1);
        else if (value === 'H2') activeQuill.format('header', 2);
        else activeQuill.format('header', false);
    }
    else {
        let formatName = command;
        let formatValue = value;

        if (command === 'color') {
            formatName = 'color';
            formatValue = value;
        }

        if (['bold', 'italic', 'underline', 'strike'].includes(command)) {
            const current = activeQuill.getFormat();
            formatValue = !current[command]; 
        }
        
        activeQuill.format(formatName, formatValue);
    }
}

// 리스트 삽입
function insertListAtCursor(type) {
    if (!activeQuill) return;
    
    const listDropdown = document.getElementById('listDropdown');
    const listType = type === 'ordered' ? 'ordered' : 'bullet';
    const currentFormat = activeQuill.getFormat();
    
    if (currentFormat.list === listType) {
        activeQuill.format('list', false);
    } else {
        activeQuill.format('list', listType);
    }
    
    if(listDropdown) listDropdown.classList.remove('show');
}


// 다이어리 스타일
const urlParams = new URLSearchParams(window.location.search);
const coverStyle = urlParams.get('cover') || 'default';
const pageStyle = urlParams.get('page') || 'default';
const diaryTitle = urlParams.get('title') || '다이어리 제목';

function applyCoverStyle(style) {
    const cover = document.getElementById('diaryCover');
    const coverStyles = {
        'default': 'linear-gradient(135deg, #8b7ab8 0%, #6b5a9e 100%)',
        'brown': 'linear-gradient(135deg, #8b7355 0%, #6b5a42 100%)',
        'blue': 'linear-gradient(135deg, #5a7a9e 0%, #425a6b 100%)',
        'pink': 'linear-gradient(135deg, #d47a9e 0%, #b85a7a 100%)'
    };
    if(cover) cover.style.background = coverStyles[style] || style;
}

function applyPageStyle(style) {
    const leftPage = document.getElementById('leftPage');
    const rightPage = document.getElementById('rightPage');
    if(!leftPage || !rightPage) return;

    leftPage.style.background = '';
    rightPage.style.background = '';
    
    const pageStyles = {
        'default': { backgroundColor: 'rgba(255, 255, 255, 0.98)' },
        'lined': {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backgroundImage: `repeating-linear-gradient(transparent 0, transparent 24px, rgba(157, 117, 255, 0.2) 20px, transparent 26px)`,
            backgroundAttachment: 'local',
            backgroundPosition: '0 7.5px'
        },
        'grid': {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backgroundImage: `linear-gradient(rgba(157, 117, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(157, 117, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
        }
    };
    const selectedStyle = pageStyles[style] || pageStyles['default'];
    Object.assign(leftPage.style, selectedStyle);
    Object.assign(rightPage.style, selectedStyle);
}
applyCoverStyle(coverStyle);
applyPageStyle(pageStyle);


// 칸 조절 (스티커, 사진, 글자입력칸)
function makeDraggableResizable(contentElement, x, y, initialWidth = 'auto', initialHeight = 'auto', isSelected = true) {  // ← 매개변수 추가
    const container = document.createElement('div');
    container.className = isSelected ? 'floating-object-container selected' : 'floating-object-container';  // ← 조건부로 selected 적용
    container.style.left = x + 'px';
    container.style.top = y + 'px';
    if(initialWidth !== 'auto') container.style.width = initialWidth + 'px';
    if(initialHeight !== 'auto') container.style.height = initialHeight + 'px';
    contentElement.style.width = '100%';
    contentElement.style.height = '100%';
    contentElement.style.display = 'block';
    if (contentElement.tagName === 'IMG') {
        contentElement.draggable = false;
    }
    container.addEventListener('mousedown', (e) => {
        if (e.target.closest('.ql-editor')) {
            e.stopPropagation();
        }
    });
    container.appendChild(contentElement);

    // 크기 조절 핸들
    const handles = ['nw', 'ne', 'sw', 'se'];
    handles.forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `resize-handle handle-${pos}`;
        handle.setAttribute('data-handle', pos);
        container.appendChild(handle);
    });

    // 회전 핸들
    const rotateHandle = document.createElement('div');
    rotateHandle.className = 'rotate-handle';
    container.appendChild(rotateHandle);
    diaryPagesContainer.appendChild(container);
    setupInteraction(container, rotateHandle);
    
    return container; 
}

function setupInteraction(container, rotateHandle) {
    let isDragging = false;
    let isResizing = false;
    let isRotating = false;
    let startX, startY, startLeft, startTop, startWidth, startHeight;
    let currentRotation = 0;
    let initialAngle = 0;

    container.addEventListener('mousedown', (e) => {
        // Quill 에디터 내부 클릭 시 이동 모드 진입 금지 (텍스트 편집 우선)
        if (e.target.closest('.ql-editor')) {
            document.querySelectorAll('.floating-object-container').forEach(el => el.classList.remove('selected'));
            container.classList.add('selected');
            return;
        }

        e.stopPropagation();
        e.preventDefault(); 
        
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
            
            if (dir.includes('e')) container.style.width = `${startWidth + dx}px`;
            if (dir.includes('s')) container.style.height = `${startHeight + dy}px`;
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

// Backspace,Delete 키로 객체 삭제
document.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
        const selected = document.querySelector('.floating-object-container.selected');
        if (selected) {
            const editor = selected.querySelector('.ql-editor');
            if (editor && (document.activeElement === editor || editor.contains(document.activeElement))) {
                return; 
            }
            // 텍스트 편집 안 할 때만 객체 삭제
            e.preventDefault();
            selected.remove();
        }
    }
});


// 스티커 및 팝업 동작
const insertBtn = document.getElementById('insertBtn');
const insertDropdown = document.getElementById('insertDropdown');
const stickerMenuBtn = document.getElementById('stickerMenuBtn');
const stickerPopup = document.getElementById('stickerPopup');

if(insertBtn) {
    insertBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if(stickerPopup) stickerPopup.classList.remove('show');
        const isShown = insertDropdown.classList.contains('show');
        closeAllPopups();
        if (!isShown) insertDropdown.classList.add('show');
    });
}

if(stickerMenuBtn) {
    stickerMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if(insertDropdown) insertDropdown.classList.remove('show');
        if(stickerPopup) {
            stickerPopup.classList.add('show');
            loadStickers();
        }
    });
}

function loadStickers() {
    if(!stickerPopup) return;
    stickerPopup.innerHTML = '';
    // 스티커 파일 목록
    const stickerFiles = ['12_DMD_여행도장.png','12_DMD_나비.png','12_DMD_엽서.png','12_DMD_카세트테이프.png','12_DMD_크로와상.png',
                            '12_DMD_카메라.png','12_DMD_팬케이크.png','12_DMD_체리.png','12_DMD_폴라로이드.png','12_DMD_티켓.png',
                            '12_DMD_사탕.png','12_DMD_미피.png','12_DMD_마카롱.png','12_DMD_구름.png','12_DMD_CD.png'];
    stickerFiles.forEach((file) => {
        const img = document.createElement('img');
        img.src = `../content/${file}`; 
        img.className = 'sticker-option';
        img.draggable = true;
        
        img.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', img.src);
            e.dataTransfer.effectAllowed = 'copy';
        });
        
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = diaryPagesContainer.getBoundingClientRect();
            makeDraggableResizable(createImageElement(img.src), rect.width / 2 - 40, rect.height / 2 - 40, 80, 80);
            stickerPopup.classList.remove('show');
        });
        
        stickerPopup.appendChild(img);
    });
}

// 이미지 태그 생성
function createImageElement(src) {
    const img = document.createElement('img');
    img.src = src;
    img.draggable = false;
    return img;
}

// 스티커 드래그 앤 드롭
diaryPagesContainer.addEventListener('dragover', (e) => {
    const types = e.dataTransfer.types;
    if (types.includes('text/plain')) {
        e.preventDefault();
    }
});
diaryPagesContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    const imgSrc = e.dataTransfer.getData('text/plain');
    if (imgSrc && (imgSrc.startsWith('http') || imgSrc.startsWith('data:image') || imgSrc.includes('content/'))) {
        const rect = diaryPagesContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        makeDraggableResizable(createImageElement(imgSrc), x, y, 80, 80); 
        if(stickerPopup) stickerPopup.classList.remove('show');
    }
});


// 사진 파일 삽입
function insertPhoto() {
    const photoInput = document.getElementById('photoInput');
    if(photoInput) photoInput.click();
    if(insertDropdown) insertDropdown.classList.remove('show');
}

const photoInput = document.getElementById('photoInput');
if(photoInput) {
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                makeDraggableResizable(createImageElement(event.target.result), 200, 200, 200, 'auto'); 
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    });
}


// 커스텀 색상 팔레트 로직
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
    if(!colorPaletteGrid) return;
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

if(colorBtn) {
    colorBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isShown = colorPopup.style.display === 'flex';
        closeAllPopups();
        if (!isShown) {
            initPalette();
            colorPopup.style.display = 'flex';
        }
    });
}

function applySelectedColor() {
    const colorDisplay = document.getElementById('currentColorDisplay');
    if(colorDisplay) colorDisplay.style.background = tempSelectedColor;
    applyTextStyle('color', tempSelectedColor);
    if(colorPopup) colorPopup.style.display = 'none';
}


// 팝업 및 UI 관리
const listBtn = document.getElementById('listBtn');
const listDropdown = document.getElementById('listDropdown');

if(listBtn) {
    listBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isShown = listDropdown.classList.contains('show');
        closeAllPopups();
        if (!isShown) listDropdown.classList.add('show');
    });
}

function closeAllPopups() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('show'));
    if(stickerPopup) stickerPopup.classList.remove('show');
    if(colorPopup) colorPopup.style.display = 'none';
}


// 페이지 넘김
let diaryPagesData = {}; 
let currentPageIndex = 0;

// 다이어리 페이지 저장
function saveCurrentPageData() {
    // 떠있는 것 저장
    const containers = document.querySelectorAll('.floating-object-container');
    const floatingData = [];

    containers.forEach(container => {
        const data = {
            left: parseFloat(container.style.left),
            top: parseFloat(container.style.top),
            width: container.style.width,
            height: container.style.height,
            transform: container.style.transform,
            type: 'unknown',
            content: ''
        };

        const editor = container.querySelector('.ql-editor');
        const img = container.querySelector('img');

        if (editor) {
            data.type = 'text';
            data.content = editor.innerHTML; 
        } else if (img) {
            data.type = 'image';
            data.content = img.src; 
        }
        floatingData.push(data);
    });

    // 글 저장
    const staticData = {};
    document.querySelectorAll('.editor-placeholder').forEach(el => {
        if (el.id) {
            const editorContent = el.querySelector('.ql-editor').innerHTML;
            staticData[el.id] = editorContent;
        }
    });

    // 데이터 통합 저장
    diaryPagesData[currentPageIndex] = {
        floating: floatingData,
        static: staticData
    };
}

// 다이어리 페이지 로드
function loadPageData(index) {
    updatePageNum();
    document.querySelectorAll('.floating-object-container').forEach(el => el.remove());
    document.querySelectorAll('.editor-placeholder').forEach(el => {
        const qlEditor = el.querySelector('.ql-editor');
        if (qlEditor) qlEditor.innerHTML = '<p><br></p>';
    });
    activeQuill = null;
    const data = diaryPagesData[index];
    if (!data) return;

    // 떠있는 것 로드
    if (data.floating) {
        data.floating.forEach(objData => {
            let contentElement;

            if (objData.type === 'text') {
                contentElement = document.createElement('div');
                contentElement.className = 'text-box-content';
                const container = makeDraggableResizable(
                    contentElement, 
                    objData.left, 
                    objData.top, 
                    parseFloat(objData.width), 
                    parseFloat(objData.height),
                    false
                );
                const quill = initQuill(contentElement);
                quill.root.innerHTML = objData.content;
                if (objData.transform) container.style.transform = objData.transform;

            } else if (objData.type === 'image') {
                contentElement = document.createElement('img');
                contentElement.src = objData.content;
                contentElement.draggable = false;
                const container = makeDraggableResizable(
                    contentElement,
                    objData.left,
                    objData.top,
                    parseFloat(objData.width),
                    parseFloat(objData.height),
                    false
                );
                if (objData.transform) container.style.transform = objData.transform;
            }
        });
    }
    // 글 로드
    if (data.static) {
        for (const [id, content] of Object.entries(data.static)) {
            const el = document.getElementById(id);
            if (el) {
                const qlEditor = el.querySelector('.ql-editor');
                if (qlEditor) qlEditor.innerHTML = content;
            }
        }
    }
}

// 페이지 번호 안내
function updatePageNum() {
    const Num = document.getElementById('pageNum');
    if (Num) {
        Num.textContent = `${currentPageIndex + 1}/${MAX_PAGES}`;
    }
}

// 페이지 넘김
document.addEventListener('keydown', (e) => {
    // 글 쓸 때 페이지 넘김 방지
    if (e.target.closest('.ql-editor') || 
        e.target.tagName === 'INPUT' || 
        e.target.isContentEditable ||
        document.activeElement.isContentEditable) {
        return;
    }
    if (e.key === 'ArrowLeft') {
        if (currentPageIndex > 0) {
            saveCurrentPageData();
            currentPageIndex--;
            loadPageData(currentPageIndex);
        }
    } else if (e.key === 'ArrowRight') {
        if (currentPageIndex < MAX_PAGES - 1) {
            saveCurrentPageData();
            currentPageIndex++;
            loadPageData(currentPageIndex);
        }
    }
});

// 텍스트 드래그 차단
document.addEventListener('dragstart', (e) => {
    let target = e.target;
    if (target.nodeType === 3) {
        target = target.parentNode;
    }
    if (target.closest('.ql-editor')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}, true);

// 팝업 닫기
document.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.floating-object-container') && 
        !e.target.closest('.custom-toolbar') && 
        !e.target.closest('.dropdown-menu') &&
        !e.target.closest('.resize-handle') &&
        !e.target.closest('.rotate-handle')) {
        document.querySelectorAll('.floating-object-container').forEach(el => {
            el.classList.remove('selected');
        });
        
        closeAllPopups();
    }
});

document.addEventListener('selectstart', (e) => {
    let target = e.target;
    if (target.nodeType === 3) target = target.parentNode;
    if (target.closest('.ql-editor')) {
        e.stopPropagation(); 
    }
});

function saveDiaryPermanently() {
    saveCurrentPageData();

    Object.keys(diaryPagesData).forEach(key => {
        const page = diaryPagesData[key];
        const hasFloating = page.floating && page.floating.length > 0;
        let hasContent = false;

        if (page.static) {
            const left = page.static.leftEditor;
            const right = page.static.rightEditor;
            const emptyPattern = /^<p><br><\/p>$/;

            const isLeftEmpty = !left || left.trim() === '' || emptyPattern.test(left);
            const isRightEmpty = !right || right.trim() === '' || emptyPattern.test(right);

            if (!isLeftEmpty || !isRightEmpty) {
                hasContent = true;
            }
        }

        if (!hasFloating && !hasContent) {
            delete diaryPagesData[key];
        }
    });

    const titleInput = document.getElementById('diaryTitle');
    const diaryCover = document.getElementById('diaryCover');
    const savedData = localStorage.getItem(DIARY_STORAGE_KEY);
    const savedDiaries = savedData ? JSON.parse(savedData) : [];

    let currentId = localStorage.getItem('currentDiaryId');
    let existingDiary = null;

    if (currentId) {
        existingDiary = savedDiaries.find(d => d.id == currentId);
    } else {
        currentId = Date.now(); // 새 다이어리라면 ID 생성
    }

    let finalDate, finalYear, finalMonth, finalPaper;

    if (existingDiary) {
        finalDate = existingDiary.date;
        finalYear = existingDiary.year;
        finalMonth = existingDiary.month;
        finalPaper = existingDiary.paperType; // 기존 속지 타입 유지
    } else {
        const today = new Date();
        finalDate = today.toISOString().split('T')[0];
        finalYear = today.getFullYear();
        finalMonth = today.getMonth();
        finalPaper = 'line'; // 새 글일 경우 기본값 (필요시 로직 추가 가능)
    }

    const diaryData = {
        id: Number(currentId),
        title: titleInput.value || "제목 없음",
        date: finalDate,   // 결정된 날짜 사용
        year: finalYear,   // 결정된 연도 사용
        month: finalMonth, // 결정된 월 사용
        coverColor: diaryCover.style.background || '#9D75FF',
        paperType: finalPaper, 
        pages: diaryPagesData
    };

    const existingIndex = savedDiaries.findIndex(d => d.id == currentId);

    if (existingIndex > -1) {
        savedDiaries[existingIndex] = diaryData;
    } else {
        savedDiaries.push(diaryData);
    }

    localStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(savedDiaries));
    localStorage.removeItem('currentDiaryId');
    localStorage.removeItem('currentDiarySettings');
    window.location.href = '12_DMD_home.html';
}

// 페이지 넘김 버튼 함수
function previousPage() {
    if (currentPageIndex > 0) {
        saveCurrentPageData();
        currentPageIndex--;
        loadPageData(currentPageIndex);
    }
}

function nextPage() {
    if (currentPageIndex < MAX_PAGES - 1) {
        saveCurrentPageData();
        currentPageIndex++;
        loadPageData(currentPageIndex);
        console.log(`Page: ${currentPageIndex + 1}/${MAX_PAGES}`);
    }
}

function showToast(message) {
    const toast = document.getElementById('toastMessage');
    toast.textContent = message;
    toast.classList.add('active');
    if(toast.timer) clearTimeout(toast.timer);
    
    toast.timer = setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}



//페이지 로드 시 데이터 연결 로직
window.addEventListener('load', () => {
    // 1. 방금 생성해서 들어온 경우
    const newSettings = localStorage.getItem('currentDiarySettings');
    // 2. 홈에서 클릭해서 들어온 경우
    const targetId = localStorage.getItem('currentDiaryId');
    // 3. 전체 데이터 가져오기
    const allDiaries = JSON.parse(localStorage.getItem('diary_permanent_data')) || [];

    if (targetId) {
        const diary = allDiaries.find(d => d.id == targetId);
        if (diary) {
            document.getElementById('diaryTitle').value = diary.title;
            applyCoverStyle(diary.coverColor);
            
            let pStyle = 'default';
            if (diary.paperType === 'line') pStyle = 'lined';
            if (diary.paperType === 'grid') pStyle = 'grid';
            applyPageStyle(pStyle);
            if (diary.pages) {
                diaryPagesData = diary.pages;
                loadPageData(0);
            }
        }
    } else if (newSettings) {
        diaryPagesData = {};
        const settings = JSON.parse(newSettings);
        
        document.getElementById('diaryTitle').value = settings.title;
        applyCoverStyle(settings.coverColor);
        
        let pStyle = 'default';
        if (settings.paperType === 'line') pStyle = 'lined';
        if (settings.paperType === 'grid') pStyle = 'grid';
        applyPageStyle(pStyle);
        localStorage.removeItem('currentDiarySettings');
    }
    updatePageNum();
});