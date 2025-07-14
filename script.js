
const form = document.getElementById('gameForm');
const recordList = document.getElementById('recordList');
const chartCanvas = document.getElementById('winRateChart');
let records = JSON.parse(localStorage.getItem('records') || '[]');

form.addEventListener('submit', e => {
  e.preventDefault();
  const date = document.getElementById('date').value;
  const players = document.getElementById('players').value;
  const score = document.getElementById('score').value;
  const entry = { date, players, score };
  records.push(entry);
  localStorage.setItem('records', JSON.stringify(records));
  renderRecords();
  updateChart();
});

function renderRecords() {
  recordList.innerHTML = records.map(r => 
    `<div>${r.date} | ${r.players} | ${r.score}</div>`
  ).join('');
}

function updateChart() {
  const playerWins = {};
  records.forEach(r => {
    const names = r.players.split(',').map(s => s.trim());
    names.forEach(name => {
      playerWins[name] = (playerWins[name] || 0) + 1;
    });
  });
  const labels = Object.keys(playerWins);
  const data = Object.values(playerWins);
  new Chart(chartCanvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{ label: '참가 횟수', data, backgroundColor: '#4fe3c1' }]
    },
    options: { responsive: true }
  });
}

function exportCSV() {
  let csv = "날짜,선수들,스코어\n";
  records.forEach(r => {
    csv += `${r.date},${r.players},${r.score}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "diablo_records.csv";
  a.click();
  URL.revokeObjectURL(url);
}

renderRecords();
updateChart();
