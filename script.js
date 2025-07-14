const players = ['김근태', '김남진', '김동현', '김재용', '김준현', '박정규', '박종혁', '성제현', '손가람', '송지훈', '염성민', '이명진', '이우진', '이정현', '이진우', '이해동', '이현철', '장이현', '장준원', '전유준', '정상돈', '최선우', '최성욱', '최준희', '하지훈'];
const selectedPlayers = new Set();
const records = [];

const attendeeList = document.getElementById('attendee-list');
const team1p1 = document.getElementById('team1-player1');
const team1p2 = document.getElementById('team1-player2');
const team2p1 = document.getElementById('team2-player1');
const team2p2 = document.getElementById('team2-player2');
const gameForm = document.getElementById('game-form');
const recordsTable = document.getElementById('records-table');
const partnerAnalysis = document.getElementById('partner-analysis');
const scoreSelect = document.getElementById('score');

function renderAttendees() {
    attendeeList.innerHTML = "";
    players.forEach(name => {
        const btn = document.createElement('button');
        btn.textContent = name;
        btn.className = 'player-button';
        btn.onclick = () => togglePlayer(name, btn);
        attendeeList.appendChild(btn);
    });
}

function togglePlayer(name, btn) {
    if (selectedPlayers.has(name)) {
        selectedPlayers.delete(name);
        btn.classList.remove('selected');
    } else {
        selectedPlayers.add(name);
        btn.classList.add('selected');
    }
    updatePlayerSelects();
}

function updatePlayerSelects() {
    const teamSelects = [team1p1, team1p2, team2p1, team2p2];
    teamSelects.forEach(select => select.innerHTML = '');
    selectedPlayers.forEach(name => {
        teamSelects.forEach(select => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option.cloneNode(true));
        });
    });
}

gameForm.onsubmit = function(e) {
    e.preventDefault();
    const date = document.getElementById('game-date').value;
    const t1 = [team1p1.value, team1p2.value];
    const t2 = [team2p1.value, team2p2.value];
    const score = scoreSelect.value;

    const allPlayers = new Set([...t1, ...t2]);
    if (allPlayers.size < 4) {
        alert("모든 선수는 서로 겹치지 않아야 합니다.");
        return;
    }

    records.push({date, team1: t1, team2: t2, score});
    renderRecords();
};

function renderRecords() {
    let html = '<table><tr><th>날짜</th><th>팀1</th><th>팀2</th><th>스코어</th></tr>';
    records.forEach(r => {
        html += `<tr><td>${r.date}</td><td>${r.team1.join(' / ')}</td><td>${r.team2.join(' / ')}</td><td>${r.score}</td></tr>`;
    });
    html += '</table>';
    recordsTable.innerHTML = html;
}

function analyzePartners() {
    const counts = {}
    records.forEach(r => {
        [r.team1, r.team2].forEach(team => {
            for (let i = 0; i < team.length; i++) {
                for (let j = i+1; j < team.length; j++) {
                    const a = team[i], b = team[j];
                    if (!counts[a]) counts[a] = {}
                    if (!counts[b]) counts[b] = {}
                    counts[a][b] = (counts[a][b] || 0) + 1;
                    counts[b][a] = (counts[b][a] || 0) + 1;
                }
            }
        });
    });

    let result = '';
    for (const player in counts) {
        const partners = Object.entries(counts[player])
            .sort((a,b) => b[1]-a[1])
            .map(([p,c]) => `${p} (${c}회)`)
            .join(', ');
        result += `<p><strong>${player}</strong>: ${partners}</p>`;
    }
    partnerAnalysis.innerHTML = result || '<p>기록된 경기가 없습니다.</p>';
}

function renderScoreOptions() {
    const scores = ["6-0", "6-1", "6-2", "6-3", "6-4", "7-5", "7-6"];
    scores.forEach(score => {
        const option = document.createElement('option');
        option.value = score;
        option.textContent = score;
        scoreSelect.appendChild(option);
    });
}

renderAttendees();
renderScoreOptions();