
let balance = 0;
const history = [];
const chartCtx = document.getElementById("chart").getContext("2d");
let chart;

function addTransaction() {
  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);
  if (!desc || isNaN(amount)) return;
  history.push({ desc, amount });
  balance += amount;
  updateUI();
}

function updateUI() {
  document.querySelector("h2").textContent = "Balance: ₹" + balance;
  const historyEl = document.getElementById("history");
  historyEl.innerHTML = history.map(item => `<p>${item.desc}: ₹${item.amount}</p>`).join("");
  updateChart();
}

function updateChart() {
  const income = history.filter(x => x.amount > 0).reduce((acc, x) => acc + x.amount, 0);
  const expense = history.filter(x => x.amount < 0).reduce((acc, x) => acc + Math.abs(x.amount), 0);
  if (chart) chart.destroy();
  chart = new Chart(chartCtx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        label: 'Money Flow',
        data: [income, expense],
        backgroundColor: ['#2ecc71', '#e74c3c']
      }]
    }
  });
}
