document.addEventListener('DOMContentLoaded', () => {
    // 1. 요소 선택
    const addBtn = document.querySelector('.add-button'); // + 새로운 버튼
    const createModal = document.getElementById('createModalOverlay');
    const closeBtn1 = document.getElementById('closeCreateBtn');
    const finalCreateBtn = document.getElementById('finalCreateBtn');
    
    // 미리보기 관련 요소
    const previewCoverGroup = document.getElementById('previewCoverColor'); // SVG의 G 태그
    const paletteBtns = document.querySelectorAll('.color-btn');
    const paperCards = document.querySelectorAll('.paper-card');
    const nameInput = document.querySelector('.diary-name-input');

        // 요소 선택
    const profileBtn = document.querySelector('.profile-btn');
    const userInfoPopup = document.getElementById('userInfoPopup');
    const closeBtn2 = document.querySelector('.popup-close'); // 닫기 버튼 선택

    // 2. 모달 열기/닫기 함수
    function openModal() {
        createModal.classList.add('active');
        // 초기화 로직 (필요시)
        nameInput.value = ''; 
        updateColorSelection(document.querySelector('.color-btn[data-color="#CDBEFF"]'));
        updatePaperSelection(document.querySelector('.paper-card[data-paper="blank"]'));
    }

    function closeModal() {
        createModal.classList.remove('active');
    }

    // 3. 색상 변경 로직
    function updateColorSelection(selectedBtn) {
        if (!selectedBtn) return;

        // 모든 버튼 비활성화
        paletteBtns.forEach(btn => btn.classList.remove('active'));
        
        // 선택된 버튼 활성화
        selectedBtn.classList.add('active');

        // SVG 색상 변경 (fill 속성 업데이트)
        const color = selectedBtn.dataset.color;
        if (previewCoverGroup) {
            previewCoverGroup.setAttribute('fill', color);
        }
    }

    // 4. 속지 선택 로직
    function updatePaperSelection(selectedCard) {
        if (!selectedCard) return;

        // 모든 카드 비활성화
        paperCards.forEach(card => card.classList.remove('active'));
        
        // 선택된 카드 활성화
        selectedCard.classList.add('active');
    }

    // --- 이벤트 리스너 등록 ---

    // 1) 모달 트리거
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal();
        });
    }

    // 2) 닫기 버튼 & 배경 클릭
    if (closeBtn1) closeBtn.addEventListener('click', closeModal);
    if (createModal) {
        createModal.addEventListener('click', (e) => {
            if (e.target === createModal) closeModal();
        });
    }

    // 3) 색상 팔레트 클릭 이벤트
    paletteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateColorSelection(btn);
        });
    });

    // 4) 속지 카드 클릭 이벤트
    paperCards.forEach(card => {
        card.addEventListener('click', () => {
            updatePaperSelection(card);
        });
    });

    // 5) 최종 생성 버튼 클릭
    if (finalCreateBtn) {
        finalCreateBtn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            if (!name) {
                // 간단한 유효성 검사 (토스트 메시지 재사용)
                showToast('다이어리 이름을 입력해주세요!');
                return;
            }

            // 여기서 실제 생성 로직(서버 통신 등)이 들어가겠지만, 
            // 지금은 UI 액션만 처리합니다.
            closeModal();
            
            // 기존 home_carousel.js에 있는 showToast 함수 활용
            if (typeof showToast === 'function') {
                showToast(`"${name}" 다이어리가 생성되었습니다!`);
            } else {
                alert(`"${name}" 다이어리가 생성되었습니다!`);
            }
        });
    }

    // 안전 장치: 요소가 존재할 때만 실행
    if (profileBtn && userInfoPopup) {
        
        // 1. 프로필 버튼 클릭 시 팝업 토글
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 이벤트 전파 방지
            userInfoPopup.classList.toggle('active');
        });

        // 2. 팝업 내부 클릭 시 닫힘 방지
        userInfoPopup.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 3. 닫기(X) 버튼 클릭 시 닫기
        if (closeBtn2) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userInfoPopup.classList.remove('active');
            });
        }

        // 4. 외부 영역 클릭 시 닫기
        document.addEventListener('click', () => {
            if (userInfoPopup.classList.contains('active')) {
                userInfoPopup.classList.remove('active');
            }
        });
    }
});