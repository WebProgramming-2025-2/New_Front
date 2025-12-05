document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.querySelector('.add-button');
    const createModal = document.getElementById('createModalOverlay');
    const closeBtn1 = document.getElementById('closeCreateBtn');
    const finalCreateBtn = document.getElementById('finalCreateBtn');
    const previewCoverGroup = document.getElementById('previewCoverColor'); // SVG G태그
    const paletteBtns = document.querySelectorAll('.color-btn');
    const paperCards = document.querySelectorAll('.paper-card');
    const nameInput = document.querySelector('.diary-name-input');

    const profileBtn = document.querySelector('.profile-btn');
    const userInfoPopup = document.getElementById('userInfoPopup');
    const closeBtn2 = document.querySelector('.popup-close');
    const logoutBtn = document.querySelector('.logout-btn');

    function openModal() {
        if (createModal) {
            createModal.classList.add('active');
            // 초기화
            if(nameInput) nameInput.value = ''; 
            if(paletteBtns.length > 0) updateColorSelection(paletteBtns[4]);
            if(paperCards.length > 0) updatePaperSelection(paperCards[0]);
        }
    }

    function closeModal() {
        if (createModal) createModal.classList.remove('active');
    }

    function updateColorSelection(selectedBtn) {
        if (!selectedBtn) return;
        paletteBtns.forEach(btn => btn.classList.remove('active'));
        selectedBtn.classList.add('active');

        // SVG 색상 변경
        const color = selectedBtn.dataset.color;
        if (previewCoverGroup) {
            previewCoverGroup.setAttribute('fill', color);
        }
    }

    function updatePaperSelection(selectedCard) {
        if (!selectedCard) return;
        paperCards.forEach(card => card.classList.remove('active'));
        selectedCard.classList.add('active');
    }

    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal();
        });
    }

    if (closeBtn1) {
        closeBtn1.addEventListener('click', closeModal);
    }

    if (createModal) {
        createModal.addEventListener('click', (e) => {
            if (e.target === createModal) closeModal();
        });
    }

    paletteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateColorSelection(btn);
        });
    });

    paperCards.forEach(card => {
        card.addEventListener('click', () => {
            updatePaperSelection(card);
        });
    });

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