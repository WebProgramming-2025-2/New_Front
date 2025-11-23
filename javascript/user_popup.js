document.addEventListener('DOMContentLoaded', () => {
    // 요소 선택
    const profileBtn = document.querySelector('.profile-btn');
    const userInfoPopup = document.getElementById('userInfoPopup');
    const closeBtn = document.querySelector('.popup-close'); // 닫기 버튼 선택

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
        if (closeBtn) {
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