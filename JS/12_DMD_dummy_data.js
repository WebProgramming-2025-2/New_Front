const DIARY_KEY = 'diary_permanent_data';

const dummyDiaries = [ // 웹페이지의 모든 기능을 활용한 예시 더미 데이터로 사이트 실행 시, 무조건 들어간 상태로 보이는게 정상
    {
        id: 1704067200000,
        title: "2025년 새해 다짐 ✨",
        date: "2025-01-01",
        year: 2025, month: 0,
        coverColor: "#9D75FF",
        paperType: "line",
        pages: {
            0: {
                static: { 
                    leftEditor: "<h2>2025년 목표 리스트</h2><p>1. 전공 학점 A+ 받기</p><p>2. 매일 아침 러닝 30분</p><p>3. 토익 900점 달성</p>", 
                    rightEditor: "<p>작년에는 너무 놀기만 했다. 올해는 졸업 준비도 슬슬 해야 하고, 자격증도 따야 한다. 할 수 있다!</p>" 
                },
                floating: []
            }
        }
    },
    {
        id: 1706745600000,
        title: "수강신청 대실패 😭",
        date: "2025-02-15",
        year: 2025, month: 1,
        coverColor: "#5a7a9e",
        paperType: "grid",
        pages: {
            0: {
                static: { 
                    leftEditor: "<p>아니 9시 정각에 눌렀는데 대기열 5000명 실화냐?</p>", 
                    rightEditor: "<p>결국 우주이해와불가사의... 이런 거 들어야 함. 이번 학기 시간표 망했다.</p>" 
                },
                floating: []
            }
        }
    },
    {
        id: 1709251200000,
        title: "개강 첫 날 🌱",
        date: "2025-03-02",
        year: 2025, month: 2,
        coverColor: "#A8FFB8",
        paperType: "blank",
        pages: {
            0: {
                static: { 
                    leftEditor: "<p>개강총회 갔다가 술만 진탕 마셨다.</p>", 
                    rightEditor: "<p>올해 신입생들 엄청 풋풋하다. 나도 저럴 때가 있었는데...</p>" 
                },
                floating: []
            }
        }
    },
    {
        id: 1712880000000,
        title: "중간고사 기간 📚",
        date: "2025-04-20",
        year: 2025, month: 3,
        coverColor: "#8b7355",
        paperType: "line",
        pages: {
            0: {
                static: { 
                    leftEditor: "<p>밤샘 공부 3일차. 다크서클이 턱 밑까지 내려옴.</p>", 
                    rightEditor: "<p>교수님 진도가 너무 빠르다. 이거 다 외우는 게 가능한가?</p>" 
                },
                floating: []
            }
        }
    },
    {
        id: 1715817600000,
        title: "대학 축제! 🎆",
        date: "2025-05-25",
        year: 2025, month: 4,
        coverColor: "#FFB7B2",
        paperType: "blank",
        pages: {
            0: {
                static: { 
                    leftEditor: "<p>젊음이 좋다! 소리 질러!</p>", 
                    rightEditor: "<p>동아리 공연도 너무 멋있었고, 밤하늘 불꽃놀이도 완벽했다.</p>" 
                },
                floating: []
            }
        }
    },
    {
        id: 1718841600000,
        title: "종강 & 여름방학 🏖️",
        date: "2025-06-21",
        year: 2025, month: 5,
        coverColor: "#A6E5FA",
        paperType: "line",
        pages: {
            0: {
                static: { 
                    leftEditor: "<p>성적은 나중에 생각하자. 일단 자고 싶다.</p>", 
                    rightEditor: "<p>알바 구해야 하는데 어디가 좋을까?</p>" 
                },
                floating: []
            }
        }
    },
    {
        id: 1721001600000,
        title: "제주도 여행 ✈️",
        date: "2025-07-15",
        year: 2025, month: 6,
        coverColor: "#0288D1",
        paperType: "blank",
        pages: {
            0: {
                static: { 
                    leftEditor: "<p>협재 해수욕장 물 색깔 미쳤다.</p>", 
                    rightEditor: "<p>내일은 우도 가서 땅콩 아이스크림 먹어야지.</p>" 
                },
                floating: []
            }
        }
    },
    {
        id: 1723680000000,
        title: "자격증 공부 🔥",
        date: "2025-08-10",
        year: 2025, month: 7,
        coverColor: "#FFA000",
        paperType: "grid",
        pages: {
            0: {
                static: { 
                    leftEditor: "<p>함수 외우다가 머리 터질 것 같음.</p>", 
                    rightEditor: "<p>이번엔 꼭 합격한다. 접수비 아까워.</p>" 
                },
                floating: []
            }
        }
    },
    {
        id: 1725148800000,
        title: "2학기 개강 🍂",
        date: "2025-09-01",
        year: 2025, month: 8,
        coverColor: "#D32F2F",
        paperType: "line",
        pages: {
            0: {
                static: { 
                    leftEditor: "<p>벌써 9월이라니 시간 진짜 빠르다.</p>", 
                    rightEditor: "<p>이번 학기 시간표는 공강이 많아서 좋다.</p>" 
                },
                floating: []
            }
        }
    },
    {
        id: 1729382400000,
        title: "가을 한강 피크닉 🧺",
        date: "2025-10-10",
        year: 2025, month: 9,
        coverColor: "#8b7355",
        paperType: "blank",
        pages: {
            0: {
                static: { 
                    leftEditor: "<p>한강 라면은 왜 집에서 먹는 것보다 맛있을까?</p>", 
                    rightEditor: "<p>노을 지는 거 보면서 멍 때리기.</p>" 
                },
                floating: []
            }
        }
    },
    {
        id: 1732060800000,
        title: "과제 폭탄 💣",
        date: "2025-11-20",
        year: 2025, month: 10,
        coverColor: "#424242",
        paperType: "line",
        pages: {
            0: {
                static: { 
                    leftEditor: "<p>팀원 한 명이 잠수탔다. 진짜 화난다.</p>", 
                    rightEditor: "<p>발표 준비하느라 목이 다 쉬었다.</p>" 
                },
                floating: []
            }
        }
    },
    {
        id: 1735084800000,
        title: "종강 파티 & 크리스마스 🎄",
        date: "2025-12-25",
        year: 2025, month: 11,
        coverColor: "#5B3EA8",
        paperType: "grid",
        pages: {
            0: {
                static: { 
                    leftEditor: "<p>친구들이랑 파티룸 빌려서 놀았다.</p>", 
                    rightEditor: "<p>선물 교환식 했는데 쓸데없는 선물 받음 ㅋㅋ</p>" 
                },
                floating: []
            }
        }
    },
    
    {
        id: 1705276800000,
        title: "24년 겨울 여행 ❄️",
        date: "2024-01-15",
        year: 2024, month: 0,
        coverColor: "#A6E5FA",
        paperType: "blank",
        pages: { 0: { static: { leftEditor: "<p>눈이 엄청 많이 왔다.</p>", rightEditor: "" }, floating: [] } }
    },
    {
        id: 1710460800000,
        title: "새내기 배움터 🚌",
        date: "2024-03-10",
        year: 2024, month: 2,
        coverColor: "#FFB7B2",
        paperType: "line",
        pages: { 0: { static: { leftEditor: "<p>장기자랑 준비하느라 고생했다.</p>", rightEditor: "" }, floating: [] } }
    },
    {
        id: 1715731200000,
        title: "성년의 날 🌹",
        date: "2024-05-20",
        year: 2024, month: 4,
        coverColor: "#D32F2F",
        paperType: "blank",
        pages: { 0: { static: { leftEditor: "<p>책임감이 느껴진다.</p>", rightEditor: "" }, floating: [] } }
    },
    {
        id: 1721606400000,
        title: "여름 알바 시작 ☕",
        date: "2024-07-22",
        year: 2024, month: 6,
        coverColor: "#8b7355",
        paperType: "grid",
        pages: { 0: { static: { leftEditor: "<p>아이스 아메리카노만 100잔 만든 듯.</p>", rightEditor: "" }, floating: [] } }
    },
    {
        id: 1726790400000,
        title: "가을 독서 📖",
        date: "2024-09-20",
        year: 2024, month: 8,
        coverColor: "#7c5cdb",
        paperType: "line",
        pages: { 0: { static: { leftEditor: "<p>마음이 차분해지는 시간.</p>", rightEditor: "" }, floating: [] } }
    }
];

const dummyDaily = {
    "2025-11-11": "빼빼로 데이! 동기들 줄 거 챙기기",
    "2025-11-20": "웹 프로그래밍 과제 제출 마감일 🔥",
    "2025-11-25": "팀 프로젝트 회의 (오후 6시, 305호)",
    "2025-12-05": "기말고사 시작 ✍️",
    "2025-12-15": "종강 총회 회식",
    "2025-12-24": "크리스마스 이브 파티 준비",
    "2025-12-31": "제야의 종소리 보러 가기"
};

const dummyMonthly = {
    "2025-11": "이번 달은 과제 마감이 많으니 미리미리 해두자. 건강 관리 필수! 비타민 챙겨 먹기.",
    "2025-12": "한 해를 마무리하는 달. 기말고사 잘 보고, 방학 계획 세우기. (운전면허 따기, 여행 가기)"
};

function initializeDummyData() {
    const userStr = localStorage.getItem('currentUser');
    const user = userStr ? JSON.parse(userStr) : null;
    const email = user ? user.email : 'guest';
    const dailyKey = `dailyCalendarMemos_${email}`;
    const monthlyKey = `monthlyCalendarNotes_${email}`;

    if (!localStorage.getItem(DIARY_KEY)) {
        localStorage.setItem(DIARY_KEY, JSON.stringify(dummyDiaries));
    }
    if (!localStorage.getItem(dailyKey)) {
        localStorage.setItem(dailyKey, JSON.stringify(dummyDaily));
    }
    if (!localStorage.getItem(monthlyKey)) {
        localStorage.setItem(monthlyKey, JSON.stringify(dummyMonthly));
    }
}

initializeDummyData();