const main = document.getElementById("main");
const sub = document.getElementById("sub");

let now = false;
let fadeTimer; 
let loopTimer; 
let printCount = 0; 
let originalData = []; // 원본 데이터를 따로 보관할 변수
let shuffledKanji = [];

sub.style.cssText = "transition: 0.5s !important;";

/**
 * 상태 리셋 함수
 */
function refresh() {
    clearTimeout(fadeTimer);
    clearInterval(loopTimer); 
    
    printCount = 0; 
    main.innerHTML = "閉";
    sub.innerHTML = "spaceを押して始めます。";
    sub.classList.remove('fade-out');
    document.body.style.background = "black";
    sub.style.color = "#888888";
    now = false;

    // [중요] 한 세트가 끝났거나 중지했을 때, 다음 실행을 위해 데이터를 다시 채워둠
    resetQueue();
}

/**
 * 데이터를 다시 복사하고 섞는 함수
 */
function resetQueue() {
    if (originalData.length > 0) {
        shuffledKanji = shuffleArray([...originalData]);
        console.log("--- 리스트가 재충전되었습니다. ---");
    }
}

/**
 * JSON 데이터를 불러오는 함수
 */
async function loadKanjiData() {
    try {
        const response = await fetch('kanjilist/n5-n4.json');
        originalData = await response.json(); // 원본 보관
        resetQueue(); // 초기 큐 생성
        console.log("--- 시스템 준비 완료 ---");
    } catch (error) {
        console.error("데이터 로딩 실패:", error);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * 출력 함수
 */
function pickAndDisplay() {
    if (shuffledKanji.length === 0) {
        console.log("✅ 모든 리스트 소진");
        refresh(); // 여기서 refresh가 호출되면서 다시 resetQueue가 실행됨
        return;
    }

    const picked = shuffledKanji.pop();
    printCount++; 
    main.innerHTML = picked; 
    console.log(`${printCount}: ${picked}`);
}

loadKanjiData();

document.body.addEventListener("keyup", (event) => {
    if (event.key === " ") {
        if (now) {
            refresh();
        } else {
            // 폰트 로딩으로 인한 덜덜거림을 방지하기 위해 
            // 시작 전 폰트 로드 상태를 체크하는 것이 좋습니다.
            main.innerHTML = "開";
            document.body.style.background = "#d51211";
            sub.style.color = "white";
            sub.innerHTML = "spaceを押して止めます。";
            
            fadeTimer = setTimeout(() => {
                sub.classList.add('fade-out');
                document.body.style.background = "black";
                loopTimer = setInterval(pickAndDisplay, 300);
            }, 1000);
            
            now = true;
        }
    }
});