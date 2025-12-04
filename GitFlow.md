# 깃 / 브랜치 컨벤션

## 1.1. 브랜치 유형

- **main** : 완성된 버전의 코드를 저장하는 브랜치
- **mogle** : 개발이 진행되는 동안 완성된 코드를 저장하는 브랜치
- **feature** : 작은 단위의 작업이 진행되는 브랜치
- **hotfix** : 긴급한 오류를 해결하는 브랜치

---

## 1.2. 브랜치 명 예시

- 유형/#이슈번호-what
    - `feat/#30-home-ui`
    - `init/#1-add-font`
    
    ---
    

## 1.3. 브랜치 명 유형

- `feat` : 구현
- `mod` : 수정
- `add` : 추가
- `del` : 삭제
- `fix` : 버그 수정
- `refactor` : 리팩토링

---

## 2.1. 커밋 예시

- **[커밋 카테고리/#이슈번호] 커밋 내용**
    - [FEAT] #30 홈 뷰 구현
    - [ADD] #1 폰트 파일 추가

---

## 2.2. 커밋 카테고리

- `feat` : 새로운 기능 구현
- `mod` : 코드 수정
- `add` : feat 이외의 부수적인 코드 추가, 라이브러리 추가
- `del` : 쓸모없는 코드 삭제
- `chore` : 변수 명 및 함수 명 수정과 같은 사소한 수정
- `fix` : 버그 수정
- `docs` : 문서 추가, 수정, 삭제
- `init` : 프로젝트 초기 세팅

---

## 2.3 머지 커밋

- `[MERGE] #이슈번호 -> develop`

---

## 3.1. Git Flow

기본적으로 Git Flow 전략을 이용한다. 작업 시작 시 선행되어야 할 작업은 다음과 같다.

❗ **Git Flow**

1. Issue를 생성한다.
2. Branch를 생성한다.
3. Add - Commit - Push - Pull Request 의 과정을 거친다.
    1. commit은 최대한 잘게!!
    2. commit시 issue를 연결한다.
4. Pull Request가 작성되면 작성자 이외의 다른 팀원이 Code Review를 한다.
5. Code Review가 완료되면 Pull Request 작성자가 dev Branch로 merge 한다.
    
    → **merge 후 카톡방에 무조건 말하기 !!!!!!!!!!!**
    
6. merge된 작업이 있을 경우, ‼️**다른 브랜치에서 작업을 진행 중이던 개발자는 본인의 브랜치로 merge된 작업을 Pull 받아온다.**‼️

---

## 3.2. Etc

❗ **협업 시 준수해야 할 규칙은 다음과 같다.**

1. mogle에서의 작업은 **원칙적으로 금지**한다. 단, 초기 세팅 및 README 작성은 mogle Branch에서 수행한다.
2. 본인의 Pull Request는 본인이 Merge한다.
3. Commit, Push, Merge, Pull Request 등 모든 작업은 **웹이 정상적으로 실행되는 지 확인** 후 수행한다. (빌드 해본 후에!)
4. README 수정 및 ktlint 적용을 위한 Commit 도배는 금지한다. 리드미 미리보기는 Preview를 통해 확인한다.