document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. 요소 선택 (변수명 오타 수정 및 안전한 선택)
    // ==========================================
    const addBtn = document.querySelector('.add-button'); // + 버튼
    const createModal = document.getElementById('createModalOverlay'); // 생성 모달
    const closeBtn1 = document.getElementById('closeCreateBtn'); // 생성 모달 닫기 버튼
    const finalCreateBtn = document.getElementById('finalCreateBtn'); // 최종 생성 버튼
    
    // 미리보기 관련 요소
    const previewCoverGroup = document.getElementById('previewCoverColor'); // SVG G태그
    const paletteBtns = document.querySelectorAll('.color-btn'); // 색상 버튼들
    const paperCards = document.querySelectorAll('.paper-card'); // 속지 카드들
    const nameInput = document.querySelector('.diary-name-input'); // 이름 입력창

    // 유저 프로필 팝업 관련 요소
    const profileBtn = document.querySelector('.profile-btn');
    const userInfoPopup = document.getElementById('userInfoPopup');
    const closeBtn2 = document.querySelector('.popup-close'); // 프로필 팝업 닫기 버튼
    const logoutBtn = document.querySelector('.logout-btn');

    // ==========================================
    // 2. 다이어리 생성 모달 로직
    // ==========================================
    
    // 모달 열기
    function openModal() {
        if (createModal) {
            createModal.classList.add('active');
            // 초기화: 이름 비우기, 첫 번째 색상/속지 선택
            if(nameInput) nameInput.value = ''; 
            
            // 색상 초기화 (첫번째 버튼 클릭 효과)
            if(paletteBtns.length > 0) updateColorSelection(paletteBtns[4]); // 기본값 보라색 계열
            
            // 속지 초기화
            if(paperCards.length > 0) updatePaperSelection(paperCards[0]);
        }
    }

    // 모달 닫기
    function closeModal() {
        if (createModal) createModal.classList.remove('active');
    }

    // 색상 변경 함수
    function updateColorSelection(selectedBtn) {
        if (!selectedBtn) return;

        // 모든 버튼 비활성화
        paletteBtns.forEach(btn => btn.classList.remove('active'));
        // 선택된 버튼 활성화
        selectedBtn.classList.add('active');

        // SVG 색상 변경
        const color = selectedBtn.dataset.color;
        if (previewCoverGroup) {
            previewCoverGroup.setAttribute('fill', color);
        }
    }

    // 속지 선택 함수
    function updatePaperSelection(selectedCard) {
        if (!selectedCard) return;

        // 모든 카드 비활성화
        paperCards.forEach(card => card.classList.remove('active'));
        // 선택된 카드 활성화
        selectedCard.classList.add('active');
    }

    // --- 이벤트 리스너 (생성 모달) ---

    // 1) + 버튼 클릭 시 모달 열기
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal();
        });
    }

    // 2) 닫기(X) 버튼 클릭 (오타 수정됨: closeBtn -> closeBtn1)
    if (closeBtn1) {
        closeBtn1.addEventListener('click', closeModal);
    }

    // 3) 배경 클릭 시 닫기
    if (createModal) {
        createModal.addEventListener('click', (e) => {
            if (e.target === createModal) closeModal();
        });
    }

    // 4) 색상 팔레트 클릭
    paletteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateColorSelection(btn);
        });
    });

    // 5) 속지 카드 클릭
    paperCards.forEach(card => {
        card.addEventListener('click', () => {
            updatePaperSelection(card);
        });
    });

    // 6) 최종 생성 버튼 클릭
    if (finalCreateBtn) {
        finalCreateBtn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            if (!name) {
                alert('다이어리 이름을 입력해주세요!');
                return;
            }

            const selectedColorBtn = document.querySelector('.color-btn.active');
            const selectedPaperCard = document.querySelector('.paper-card.active');

            const diarySettings = {
                title: name,
                coverColor: selectedColorBtn ? selectedColorBtn.dataset.color : '#9D75FF',
                paperType: selectedPaperCard ? selectedPaperCard.dataset.paper : 'blank' 
            };

            localStorage.setItem('currentDiarySettings', JSON.stringify(diarySettings));
            localStorage.removeItem('currentDiaryId');
            closeModal();
            window.location.href = '12_DMD_Write_Diary.html';
        });
    }

    // ==========================================
    // 3. 유저 프로필 팝업 로직
    // ==========================================
    
    if (profileBtn && userInfoPopup) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const avatarContainer = userInfoPopup.querySelector('.popup-avatar');
        const headerAvatar = document.querySelector('.profile-btn .profile-avatar');
        const cameraBadge = document.querySelector('.camera-badge');
        const profileInput = document.getElementById('profileImageInput');
        
        if (currentUser) {
            const emailEl = document.querySelector('.popup-email');
            if (emailEl) emailEl.textContent = currentUser.email;

            const greetingEl = document.querySelector('.popup-greeting');
            if (greetingEl) greetingEl.textContent = `안녕하세요, ${currentUser.username}님`;

            if (currentUser.profileImage) {
                const imgTag = `<img src="${currentUser.profileImage}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
                if (avatarContainer) avatarContainer.innerHTML = imgTag;
                if (headerAvatar) headerAvatar.innerHTML = imgTag;
            }
        }

        if (cameraBadge && profileInput) {
            cameraBadge.addEventListener('click', (e) => {
                e.stopPropagation();
                profileInput.click();
            });
        }

        if (profileInput) {
            profileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const newImageSrc = event.target.result;
                        const newImgTag = `<img src="${newImageSrc}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;

                        if (avatarContainer) avatarContainer.innerHTML = newImgTag;
                        if (headerAvatar) headerAvatar.innerHTML = newImgTag;

                        if (currentUser) {
                            currentUser.profileImage = newImageSrc;
                            localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        }
                    };
                    reader.readAsDataURL(file);
                }
                e.target.value = '';
            });
        }
        
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userInfoPopup.classList.toggle('active');
        });

        userInfoPopup.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        if (closeBtn2) {
            closeBtn2.addEventListener('click', (e) => {
                e.stopPropagation();
                userInfoPopup.classList.remove('active');
            });
        }

        document.addEventListener('click', () => {
            userInfoPopup.classList.remove('active');
        });

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => { 
                localStorage.removeItem('currentUser');
                alert("로그아웃 되었습니다.");
                window.location.href = '../12_DMD_startpage.html';
            });
        }
    }
});