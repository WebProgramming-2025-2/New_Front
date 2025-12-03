const STORAGE_KEY = 'diary_permanent_data';

const initialData = [
    {
        id: 1704067200000,
        title: "새해 다짐 ✨",  // title로 통일
        date: "2025-01-01",
        year: 2025, month: 0, // 0이 1월입니다
        coverColor: "#9D75FF",
        paperType: "line",
        pages: {              // Write_Diary 구조에 맞춤
            0: {
                static: { 
                    leftEditor: "<h2>2025년 목표</h2><p>1. 코딩 마스터</p>", 
                    rightEditor: "<p>화이팅!</p>" 
                },
                floating: []
            }
        }
    },
    {
        id: 1714867200000,
        title: "중간고사 끝! 🌸",
        date: "2025-05-05",
        year: 2025, month: 4, // 4가 5월입니다
        coverColor: "#FFB7B2",
        paperType: "grid",
        pages: {
            0: {
                static: { leftEditor: "<p>놀러가자!</p>", rightEditor: "" },
                floating: []
            }
        }
    },
    {
        id: 1735084800000,
        title: "메리 크리스마스 🎄",
        date: "2025-12-25",
        year: 2025, month: 11, // 11이 12월입니다
        coverColor: "#5B3EA8",
        paperType: "blank",
        pages: {
            0: {
                static: { leftEditor: "<p>눈이 온다!</p>", rightEditor: "" },
                floating: []
            }
        }
    }
];