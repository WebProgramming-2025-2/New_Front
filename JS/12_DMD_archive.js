const STORAGE_KEY = 'diary_permanent_data';
let diaries = [];
let selectedYear = '';
let selectedMonth = '';

function loadDiaries() {
    // 1. 일단 로컬스토리지 확인
    const savedData = localStorage.getItem(STORAGE_KEY);
    
    if (savedData && JSON.parse(savedData).length > 0) {
        // 저장된 게 있으면 그거 씀
        diaries = JSON.parse(savedData);
    } else {
        try {
            diaries = dummyDiaries; 
            // 굳이 다시 저장 안 해도 됨 (읽기 전용으로 쓸 거면)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(diaries)); 
        } catch (e) {
            console.error("더미 데이터를 못 찾겠어요! dummy_data.js가 연결됐나요?", e);
            diaries = [];
        }
    }
    
    // 날짜 정렬
    diaries.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function initCustomSelects() {
    const selects = document.querySelectorAll('.custom-select');
    
    selects.forEach(select => {
        const trigger = select.querySelector('.select-trigger');
        const dropdown = select.querySelector('.select-dropdown');
        
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-select').forEach(s => {
                if (s !== select) s.classList.remove('active');
            });
            select.classList.toggle('active');
        });
        
        // 2. [수정됨] 옵션 클릭 (이벤트 위임 방식)
        // dropdown 자체에 이벤트를 걸어서 동적으로 생긴 옵션도 인식하게 함
        dropdown.addEventListener('click', (e) => {
            const option = e.target.closest('.select-option');
            if (!option) return; // 옵션이 아니면 무시

            e.stopPropagation();
            const value = option.dataset.value;
            const text = option.textContent;
            
            select.querySelector('.select-value').textContent = text;
            dropdown.querySelectorAll('.select-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            if (select.id === 'yearSelector') {
                selectedYear = value;
            } else if (select.id === 'monthSelector') {
                selectedMonth = value;
            }
            filterDiaries();
            select.classList.remove('active');
        });
    });
    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-select').forEach(s => {
            s.classList.remove('active');
        });
    });
}

function populateYears() {
    const yearSelector = document.getElementById('yearSelector');
    const dropdown = yearSelector.querySelector('.select-dropdown');
    
    const years = [...new Set(diaries.map(d => d.year))].sort((a, b) => b - a);
    
    dropdown.innerHTML = '<div class="select-option" data-value="">전체 년도</div>';

    years.forEach(year => {
        const option = document.createElement('div');
        option.className = 'select-option';
        option.dataset.value = year;
        option.textContent = year + '년';
        dropdown.appendChild(option);
    });
}

function renderDiaries(filteredDiaries) {
    const grid = document.getElementById('diaryGrid');
    
    if (!filteredDiaries || filteredDiaries.length === 0) {
        grid.innerHTML = '<div class="no-results">검색 결과가 없습니다.</div>';
        return;
    }

    grid.innerHTML = filteredDiaries.map(diary => {
        // [안전장치] 날짜가 없거나 이상할 경우를 대비한 코드
        let y = '0000', m = '00', d = '00';
        if (diary.date && typeof diary.date === 'string') {
            const parts = diary.date.split('-');
            if (parts.length === 3) {
                y = parts[0];
                m = parts[1];
                d = parts[2];
            }
        }
        
        let previewText = "";
        // 1. 첫 번째 페이지의 에디터 내용(HTML) 가져오기
        if (diary.pages && diary.pages[0] && diary.pages[0].static) {
            const leftContent = diary.pages[0].static.leftEditor || "";
            const rightContent = diary.pages[0].static.rightEditor || "";
            const fullHtml = leftContent + " " + rightContent;
            // 2. HTML 태그 제거하고 순수 텍스트만 남기기 (임시 엘리먼트 사용)
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = fullHtml;
            let textOnly = tempDiv.textContent || tempDiv.innerText || "";
            // 3. 공백 정리
            previewText = textOnly.trim();
        }
        // 4. 내용이 너무 길면 자르기 (예: 50자)
        if (previewText.length > 40) {
            previewText = previewText.substring(0, 50) + "...";
        }
        // 5. 만약 추출한 내용이 없으면 기존 더미의 preview나 기본 문구 사용
        if (!previewText) {
            previewText = diary.preview || "내용이 없습니다.";
        }

        return `
        <div class="diary-card" onclick="openDiary(${diary.id})">
            <div class="diary-date-group">
                <span class="diary-date">${y}.${m}.${d}</span>
            </div>
            
            <div class="diary-title">${diary.title || '제목 없음'}</div>
            
            <div class="diary-preview">
                ${previewText}
            </div>

            <div class="diary-footer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </div>
        </div>
    `}).join('');
}

function filterDiaries() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = diaries;
    
    if (searchTerm) {
        filtered = filtered.filter(d => 
            (d.title && d.title.toLowerCase().includes(searchTerm)) ||
            (d.preview && d.preview.toLowerCase().includes(searchTerm))
        );
    }
    
    if (selectedYear) {
        filtered = filtered.filter(d => d.year == selectedYear);
    }
    
    if (selectedMonth) {
        filtered = filtered.filter(d => d.month == (selectedMonth - 1));
    }
    
    renderDiaries(filtered);
}

function openDiary(id) {
    localStorage.setItem('currentDiaryId', id);
    window.location.href = '12_DMD_Write_Diary.html';
}

document.addEventListener('DOMContentLoaded', () => {
    loadDiaries();       // 1. 데이터 로드 (더미 데이터 또는 로컬스토리지)
    initCustomSelects(); // 2. 드롭다운 메뉴 기능 활성화
    populateYears();     // 3. 데이터에 있는 연도들을 필터에 추가
    filterDiaries();     // 4. 데이터를 화면에 그리기 (최초 렌더링)
    document.getElementById('searchInput').addEventListener('input', filterDiaries);
});