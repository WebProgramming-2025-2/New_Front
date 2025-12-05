const STORAGE_KEY = 'diary_permanent_data';

const initialData = [
    {
        id: 1704067200000,
        title: "새해 다짐 ✨",
        date: "2025-01-01",
        year: 2025, month: 0,
        coverColor: "#9D75FF",
        paperType: "line",
        pages: {
            0: {
                static: { 
                    leftEditor: "<h2>2025년 목표</h2><p>1. 코딩 마스터하기</p><p>2. 운동 꾸준히 하기</p>", 
                    rightEditor: "<p>올해는 정말 열심히 살아보자!</p>" 
                },
                floating: []
            },
            1: {
                static: { leftEditor: "<p>두 번째 페이지...</p>", rightEditor: "" },
                floating: []
            }
        }
    },
    {
        id: 1714867200000,
        title: "봄 소풍 🌸",
        date: "2025-05-05",
        year: 2025, month: 4,
        coverColor: "#FFB7B2",
        paperType: "grid",
        pages: {
            0: {
                static: { 
                    leftEditor: "<p>날씨가 너무 좋아서 한강에 다녀왔다.</p>", 
                    rightEditor: "<p>도시락도 먹고 자전거도 탔다.</p>" 
                },
                floating: []
            }
        }
    },
    {
        id: 1735084800000,
        title: "메리 크리스마스 🎄",
        date: "2025-12-25",
        year: 2025, month: 11,
        coverColor: "#5B3EA8",
        paperType: "blank",
        pages: {
            0: {
                static: { 
                    leftEditor: "<p>눈이 오는 화이트 크리스마스!</p>", 
                    rightEditor: "<p>선물 받았다 ㅎㅎ</p>" 
                },
                floating: []
            }
        }
    }
];