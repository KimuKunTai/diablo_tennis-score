const players = [
  "김근태", "박종혁", "염성민", "최선우", "김재용",
  "최성욱", "이해동", "장준원", "김준현", "하지훈",
  "정상돈", "김남진", "이현철", "김동현", "박정규",
  "이명진", "이진우", "손가람", "이정현", "전유준",
  "장이현", "송지훈", "성제현", "이우진", "최준희",
  "게스트1", "게스트2", "게스트3", "게스트4", "게스트5"
];

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

let selectedPlayers = new Set();
let records = [];

const STORAGE_KEYS = {
  attendees: "diablo_attendees",
  records: "diablo_records"
};

function saveToStorage() {
  localStorage.setItem(STORAGE_KEYS.attendees, JSON.stringify([...selectedPlayers]));
  localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(records));
}

function loadFromStorage() {
  const storedAttendees = localStorage.getItem(STORAGE_KEYS.attendees);
  const storedRecords = localStorage.getItem(STORAGE_KEYS.records);
  if (storedAttendees) {
    selectedPlayers = new Set(JSON.parse(storedAttendees));
  }
  if (storedRecords) {
    records = JSON.parse(storedRecords);
  }
}

function updateCount() {
  attendeeCount.textContent = `(${selectedPlayers.size}명)`;
}

function renderAttendees() {
  attendeeList.innerHTML = "";
  players.forEach(name => {
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.className = 'player-button';
    if (selectedPlayers.has(name)) btn.classList.add('selected');
    btn.onclick = () => {
      if (selectedPlayers.has(name)) selectedPlayers.delete(name);
      else selectedPlayers.add(name);
      btn.classList.toggle('selected');
      updateCount();
      updatePlayerSelects();
      saveToStorage();
    };
    attendeeList.appendChild(btn);
  });
  updateCount();
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

function renderRecords(filtered = null) {
  let html = '<table><tr><th>날짜</th><th>팀1</th><th>팀2</th><th>스코어</th><th>삭제</th></tr>';
  const data = filtered || records;
  data.forEach((r, idx) => {
    html += `<tr>
      <td>${r.date}</td>
      <td>${r.team1.join(" / ")}</td>
      <td>${r.team2.join(" / ")}</td>
      <td>${r.score}</td>
      <td><button onclick="deleteRecord(${idx})" style="color:red;cursor:pointer;">삭제</button></td>
    </tr>`;
  });
  html += "</table>";
  recordsTable.innerHTML = html;
}

function deleteRecord(index) {
  if (!confirm("정말 이 기록을 삭제하시겠습니까?")) return;
  records.splice(index, 1);
  saveToStorage();
  renderRecords();
}

function filterByDate() {
  const selectedDate = document.getElementById('filter-date').value;
  if (!selectedDate) return renderRecords();
  const filtered = records.filter(r => r.date === selectedDate);
  renderRecords(filtered);
}

function exportToExcel() {
  let csv = "날짜,팀1,팀2,스코어\n";
  records.forEach(r => {
    csv += `${r.date},"${r.team1.join(" / ")}","${r.team2.join(" / ")}",${r.score}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "diablo_game_records.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
  saveToStorage();
  renderRecords();
  gameForm.reset();
};

function init() {
  loadFromStorage();
  renderAttendees();
  renderScoreOptions();
  updatePlayerSelects();
  renderRecords();
}

init();