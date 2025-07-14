const players = Array.from({length: 30}, (_, i) => `선수${i+1}`);
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

function renderAttendees() {
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
    [team1p1, team1p2, team2p1, team2p2].forEach(select => {
        select.innerHTML = '';
        selectedPlayers.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });
    });
}

gameForm.onsubmit = function(e) {
    e.preventDefault();
    const date = document.getElementById('game-date').value;
    const court = document.getElementById('court').value;
    const t1p1 = team1p1.value;
    const t1p2 = team1p2.value;
    const t2p1 = team2p1.value;
    const t2p2 = team2p2.value;
    const score = document.getElementById('score').value;

    if (new Set([t1p1, t1p2, t2p1, t2p2]).size < 4) {
        alert("한 경기 내에 선수 중복 없이 선택해주세요.");
        return;
    }

    records.push({date, court, team1: [t1p1, t1p2], team2: [t2p1, t2p2], score});
    renderRecords();
};

function renderRecords() {
    let html = '<table><tr><th>날짜</th><th>코트</th><th>팀1</th><th>팀2</th><th>스코어</th></tr>';
    records.forEach(r => {
        html += `<tr><td>${r.date}</td><td>${r.court}</td><td>${r.team1.join(' / ')}</td><td>${r.team2.join(' / ')}</td><td>${r.score}</td></tr>`;
    });
    html += '</table>';
    recordsTable.innerHTML = html;
}

function analyzePartners() {
    const counts = {};
    records.forEach(r => {
        const teamCombos = [r.team1, r.team2];
        teamCombos.forEach(team => {
            for (let i = 0; i < team.length; i++) {
                for (let j = i+1; j < team.length; j++) {
                    const a = team[i], b = team[j];
                    if (!counts[a]) counts[a] = {};
                    if (!counts[b]) counts[b] = {};
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

renderAttendees();