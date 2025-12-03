const calendarDays = document.getElementById('calendarDays');
const prevButton = document.getElementById('prevMonth');
const nextButton = document.getElementById('nextMonth');
const miniCalendarDays = document.getElementById('miniCalendarDays');
const miniMonthLabel = document.getElementById('miniMonthLabel');
const miniYearLabel = document.getElementById('miniYearLabel');
const miniPrevButton = document.getElementById('miniPrevMonth');
const miniNextButton = document.getElementById('miniNextMonth');
const YearLabel = document.getElementById('YearLabel');
const MonthLabel = document.getElementById('MonthLabel');
let currentDate = new Date(); 
let miniCurrentDate = new Date(currentDate);
let monthlyNotes = JSON.parse(localStorage.getItem('monthlyCalendarNotes')) || {}; 
let dailyMemos = JSON.parse(localStorage.getItem('dailyCalendarMemos')) || {};
const memoTextArea = document.getElementById('monthly-note');
const memoModal = document.getElementById('memoModal');
const memoModalTitle = document.getElementById('memoModalTitle');
const dailyMemoTextarea = document.getElementById('dailyMemoTextarea');
const saveMemoBtn = document.getElementById('saveMemoBtn');
const deleteMemoBtn = document.getElementById('deleteMemoBtn');
const memoModalClose = document.getElementById('memoModalClose');
let currentMemoDate = null;
function getNoteKey(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}-${month}`;
}
function getDailyMemoKey(year, month, day) {
    return `${year}-${month}-${day}`;
}
function saveNote() {
    const key = getNoteKey(currentDate);
    monthlyNotes[key] = memoTextArea.value;
    localStorage.setItem('monthlyCalendarNotes', JSON.stringify(monthlyNotes));
}
function loadNote(date) {
    const key = getNoteKey(date);
    const note = monthlyNotes[key] || '';
    memoTextArea.value = note;
}
function openMemoModal(year, month, day) {
    currentMemoDate = { year, month, day };
    const key = getDailyMemoKey(year, month, day);
    const memo = dailyMemos[key] || '';
    memoModalTitle.textContent = `${year}년 ${month}월 ${day}일 메모`;
    dailyMemoTextarea.value = memo;
    memoModal.classList.add('active');
}
function closeMemoModal() {
    memoModal.classList.remove('active');
    currentMemoDate = null;
}
function saveDailyMemo() {
    if (!currentMemoDate) return;
    const { year, month, day } = currentMemoDate;
    const key = getDailyMemoKey(year, month, day);
    const memo = dailyMemoTextarea.value.trim();
    if (memo) {
        dailyMemos[key] = memo;
    } else {
        delete dailyMemos[key];
    }
    localStorage.setItem('dailyCalendarMemos', JSON.stringify(dailyMemos));
    closeMemoModal();
    renderCalendar(currentDate);
    renderMiniCalendar(miniCurrentDate);
}
function deleteDailyMemo() {
    if (!currentMemoDate) return;
    const { year, month, day } = currentMemoDate;
    const key = getDailyMemoKey(year, month, day);
    delete dailyMemos[key];
    localStorage.setItem('dailyCalendarMemos', JSON.stringify(dailyMemos));
    closeMemoModal();
    renderCalendar(currentDate);
    renderMiniCalendar(miniCurrentDate);
}
function renderCalendar(date) {
    calendarDays.innerHTML = ''; 
    const year = date.getFullYear();
    const month = date.getMonth(); 
    YearLabel.textContent = `${year}년`;
    MonthLabel.textContent = `${month + 1}월`;
    const firstDayOfMonth = new Date(year, month, 1).getDay(); 
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate(); 
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();
    // 이전 달 날짜
    for (let i = 0; i < firstDayOfMonth; i++) {
        const prevMonthLastDate = new Date(year, month, 0).getDate();
        const day = prevMonthLastDate - (firstDayOfMonth - 1 - i);
        const prevDayDiv = document.createElement('div');
        prevDayDiv.classList.add('day', 'prev-month');
        prevDayDiv.textContent = day;
        calendarDays.appendChild(prevDayDiv);
    }
    // 현재 달 날짜
    for (let dateNum = 1; dateNum <= lastDateOfMonth; dateNum++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        const dateSpan = document.createElement('span');
        dateSpan.textContent = dateNum;
        dayDiv.appendChild(dateSpan);
        if (isCurrentMonth && dateNum === todayDate) {
            dayDiv.classList.add('today');
        }
        // 메모가 있는지 확인
        const memoKey = getDailyMemoKey(year, month + 1, dateNum);
        if (dailyMemos[memoKey]) {
            dayDiv.classList.add('has-memo');
            const previewDiv = document.createElement('div');
            previewDiv.classList.add('day-memo-preview');
            previewDiv.textContent = dailyMemos[memoKey];
            dayDiv.appendChild(previewDiv);
        }
        // 클릭 이벤트
        dayDiv.addEventListener('click', () => {
            openMemoModal(year, month + 1, dateNum);
        });
        calendarDays.appendChild(dayDiv);
    }
    // 다음 달 날짜
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; 
    for (let i = 1; i <= remainingCells; i++) {
        const nextDayDiv = document.createElement('div');
        nextDayDiv.classList.add('day', 'next-month');
        nextDayDiv.textContent = i;
        calendarDays.appendChild(nextDayDiv);
    }
    loadNote(date); 
}
function renderMiniCalendar(date) {
    miniCalendarDays.innerHTML = '';
    const year = date.getFullYear();
    const month = date.getMonth(); 
    miniMonthLabel.textContent = month + 1;
    miniYearLabel.textContent = year;
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();
    // 이전 달 날짜
    for (let i = 0; i < firstDayOfMonth; i++) {
        const prevMonthLastDate = new Date(year, month, 0).getDate();
        const day = prevMonthLastDate - (firstDayOfMonth - 1 - i);
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('mini-day', 'mini-prev-month');
        dayDiv.textContent = day;
        miniCalendarDays.appendChild(dayDiv);
    }
    // 현재 달 날짜
    for (let dateNum = 1; dateNum <= lastDateOfMonth; dateNum++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('mini-day');
        dayDiv.textContent = dateNum;
    
        if (isCurrentMonth && dateNum === todayDate) {
            dayDiv.classList.add('mini-today');
        }
        // 메모가 있는지 확인하여 표시
        const memoKey = getDailyMemoKey(year, month + 1, dateNum);
        if (dailyMemos[memoKey]) {
            dayDiv.classList.add('has-memo');
        }
        dayDiv.addEventListener('click', () => {
            currentDate.setFullYear(year, month, dateNum);
            renderCalendar(currentDate);
            miniCurrentDate = new Date(currentDate); 
            renderMiniCalendar(miniCurrentDate); 
        });
    
        miniCalendarDays.appendChild(dayDiv);
    }
    // 다음 달 날짜
    const totalCells = miniCalendarDays.children.length;
    const remainingCells = 42 - totalCells; 
    for (let i = 1; i <= remainingCells; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('mini-day', 'mini-next-month');
        dayDiv.textContent = i;
        miniCalendarDays.appendChild(dayDiv);
    }
}
// 이벤트 리스너
miniPrevButton.addEventListener('click', () => {
    miniCurrentDate.setMonth(miniCurrentDate.getMonth() - 1);
    renderMiniCalendar(miniCurrentDate);
    currentDate = new Date(miniCurrentDate);
    renderCalendar(currentDate);
});
miniNextButton.addEventListener('click', () => {
    miniCurrentDate.setMonth(miniCurrentDate.getMonth() + 1);
    renderMiniCalendar(miniCurrentDate);
    currentDate = new Date(miniCurrentDate);
    renderCalendar(currentDate);
});
prevButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
    miniCurrentDate = new Date(currentDate);
    renderMiniCalendar(miniCurrentDate);
});
nextButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
    miniCurrentDate = new Date(currentDate);
    renderMiniCalendar(miniCurrentDate);
});
// 모달 이벤트
saveMemoBtn.addEventListener('click', saveDailyMemo);
deleteMemoBtn.addEventListener('click', deleteDailyMemo);
memoModalClose.addEventListener('click', closeMemoModal);
// 모달 배경 클릭시 닫기
memoModal.addEventListener('click', (e) => {
    if (e.target === memoModal) {
        closeMemoModal();
    }
});
// 월별 메모 자동 저장
memoTextArea.addEventListener('keyup', saveNote);
// 초기 렌더링
renderCalendar(currentDate);
renderMiniCalendar(miniCurrentDate);