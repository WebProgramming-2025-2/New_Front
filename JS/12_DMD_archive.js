const diaries = [
    { id: 1, title: "봄날의 추억", date: "2024-03-15", year: 2024, month: 3, preview: "따뜻한 봄바람과 함께 찾아온 벚꽃 이것은 줄 잘림을 확인하기 위한 테스트이것은 줄 잘림을 확인하기 위한 테스트이것은 줄 잘림을 확인하기 위한 테스트이것은 줄 잘림을 확인하기 위한 테스트이것은 줄 잘림을 확인하기 위한 테스트" },
    { id: 2, title: "여름 휴가", date: "2024-07-22", year: 2024, month: 7, preview: "오랜만에 떠난 제주도 여행..." },
    { id: 3, title: "가을 단풍", date: "2024-10-08", year: 2024, month: 10, preview: "설악산의 붉게 물든 단풍을 보며..." },
    { id: 4, title: "겨울 이야기", date: "2024-12-01", year: 2024, month: 12, preview: "첫눈이 내린 날의 감동..." },
    { id: 5, title: "새해의 다짐", date: "2024-01-01", year: 2024, month: 1, preview: "새로운 한 해를 맞이하며..." },
    { id: 6, title: "생일 파티", date: "2024-05-20", year: 2024, month: 5, preview: "친구들과 함께한 즐거운 시간..." },
    { id: 7, title: "첫 출근", date: "2024-02-05", year: 2024, month: 2, preview: "설레는 마음으로 회사에 출근..." },
    { id: 8, title: "주말 나들이", date: "2024-04-14", year: 2024, month: 4, preview: "가족과 함께한 피크닉..." },
    { id: 9, title: "독서 기록", date: "2024-06-10", year: 2024, month: 6, preview: "오랜만에 읽은 좋은 책..." },
    { id: 10, title: "운동 시작", date: "2024-08-01", year: 2024, month: 8, preview: "건강을 위해 시작한 러닝..." },
    { id: 11, title: "친구 만남", date: "2024-09-18", year: 2024, month: 9, preview: "오랜 친구와의 재회..." },
    { id: 12, title: "취미 생활", date: "2024-11-05", year: 2024, month: 11, preview: "새로 시작한 사진 촬영..." },
    { id: 13, title: "카페 투어", date: "2023-12-20", year: 2023, month: 12, preview: "예쁜 카페들을 찾아다니며..." },
    { id: 14, title: "영화 감상", date: "2023-11-15", year: 2023, month: 11, preview: "감동적인 영화를 보고..." },
    { id: 15, title: "요리 도전", date: "2023-10-30", year: 2023, month: 10, preview: "처음 만들어본 파스타..." }
];

let selectedYear = '';
let selectedMonth = '';

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
        
        const options = select.querySelectorAll('.select-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = option.dataset.value;
                const text = option.textContent;
                
                select.querySelector('.select-value').textContent = text;
                
                options.forEach(opt => opt.classList.remove('selected'));
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
    
    years.forEach(year => {
        const option = document.createElement('div');
        option.className = 'select-option';
        option.dataset.value = year;
        option.textContent = year + '년';
        dropdown.appendChild(option);
    });
    
    const options = dropdown.querySelectorAll('.select-option');
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = option.dataset.value;
            const text = option.textContent;
            
            yearSelector.querySelector('.select-value').textContent = text;
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            selectedYear = value;
            filterDiaries();
            yearSelector.classList.remove('active');
        });
    });
}

function renderDiaries(filteredDiaries) {
    const grid = document.getElementById('diaryGrid');
    
    if (filteredDiaries.length === 0) {
        grid.innerHTML = '<div class="no-results">검색 결과가 없습니다.</div>';
        return;
    }
    grid.innerHTML = filteredDiaries.map(diary => {
        const [y, m, d] = diary.date.split('-');
        
        return `
        <div class="diary-card" onclick="openDiary(${diary.id})">
            <div class="diary-date-group">
                <span class="diary-date">${y}.${m}.${d}</span>
            </div>
            
            <div class="diary-title">${diary.title}</div>
            
            <div class="diary-preview">
                ${diary.preview}
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
            d.title.toLowerCase().includes(searchTerm) ||
            d.preview.toLowerCase().includes(searchTerm)
        );
    }
    
    if (selectedYear) {
        filtered = filtered.filter(d => d.year == selectedYear);
    }
    
    if (selectedMonth) {
        filtered = filtered.filter(d => d.month == selectedMonth);
    }
    
    renderDiaries(filtered);
}

function openDiary(id) {
    console.log('Opening diary:', id);
    // TODO: 다이어리 작성/보기 페이지로 이동 필요!!
}

document.addEventListener('DOMContentLoaded', function() {
    initCustomSelects();
    
    document.getElementById('searchInput').addEventListener('input', filterDiaries);

    populateYears();
    renderDiaries(diaries);
});