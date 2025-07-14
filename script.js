const players = [
  "김근태", "박종혁", "염성민", "최선우", "김재용",
  "최성욱", "이해동", "장준원", "김준현", "하지훈",
  "정상돈", "김남진", "이현철", "김동현", "박정규",
  "이명진", "이진우", "손가람", "이정현", "전유준",
  "장이현", "송지훈", "성제현", "이우진", "최준희",
  "게스트1", "게스트2", "게스트3", "게스트4", "게스트5"
];

const selectedPlayers = new Set();
const records = [];

const attendeeList = document.getElementById('attendee-list');
const attendeeCount = document.getElementById('attendee-count');
const selects = [
  document.getElementById('team1-player1'),
  document.getElementById('team1-player2'),
  document.getElementById('team2-player1'),
  document.getElementById('team2-player2')
];
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');
const gameDate = document.getElementById('game-date');
const gameForm = document.getElementById('game-form');
const recordsTable = document.getElementById('records-table');

function updateCount() {
  const selected = document.querySelectorAll('.player-button.selected').length;
  attendeeCount.textContent = `(${selected}명)`;
}

function renderAttendees() {
  attendeeList.innerHTML = "";
  players.forEach(name => {
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.className = 'player-button';
    btn.onclick = () => {
      btn.classList.toggle('selected');
      if (btn.classList.contains('selected')) selectedPlayers.add(name);
      else selectedPlayers.delete(name);
      updateCount();
      updatePlayerSelects();
    };
    attendeeList.appendChild(btn);
  });
}

function updatePlayerSelects() {
  selects.forEach((select, index) => {
    const prevValue = select.value;
    const usedNames = new Set(selects.map(s => s.value).filter((v, i) => i !== index));
    select.innerHTML = "";
    selectedPlayers.forEach(name => {
      if (!usedNames.has(name) || name === prevValue) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        if (name === prevValue) option.selected = true;
        select.appendChild(option);
      }
    });
  });
}

gameForm.onsubmit = function(e) {
  e.preventDefault();
  const date = gameDate.value;
  const t1 = [selects[0].value, selects[1].value];
  const t2 = [selects[2].value, selects[3].value];
  const score = `${score1.value}-${score2.value}`;
  const allPlayers = new Set([...t1, ...t2]);
  if (allPlayers.size < 4) {
    alert("같은 선수가 중복되지 않도록 선택하세요.");
    return;
  }
  records.push({ date, team1: t1, team2: t2, score });
  renderRecords();
};

function renderRecords() {
  let html = '<table><tr><th>날짜</th><th>팀1</th><th>팀2</th><th>스코어</th></tr>';
  records.forEach(r => {
    html += `<tr><td>${r.date}</td><td>${r.team1.join(" / ")}</td><td>${r.team2.join(" / ")}</td><td>${r.score}</td></tr>`;
  });
  html += "</table>";
  recordsTable.innerHTML = html;
}

function renderScoreOptions() {
  for (let i = 0; i <= 6; i++) {
    const opt1 = document.createElement("option");
    opt1.value = i;
    opt1.textContent = i;
    const opt2 = opt1.cloneNode(true);
    score1.appendChild(opt1);
    score2.appendChild(opt2);
  }
}

renderAttendees();
renderScoreOptions();