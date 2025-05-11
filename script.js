const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("transactionForm");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const category = document.getElementById("category");
const toggleDark = document.getElementById("toggleDark");
const search = document.getElementById("search");
const monthFilter = document.getElementById("monthFilter");
const clearAll = document.getElementById("clearAll");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function formatMonth(dateStr) {
    return new Date(dateStr).getMonth() + 1;
}

function updateDOM(filtered = transactions) {
    list.innerHTML = "";
    let total = 0, incomeAmt = 0, expenseAmt = 0;

    filtered.forEach((tran, index) => {
        const sign = tran.type === "income" ? "+" : "-";
        const item = document.createElement("li");
        item.classList.add(tran.type);
        item.innerHTML = \`\${tran.text} [\${tran.category}] 
        <span>\${sign}₹\${Math.abs(tran.amount)}</span> 
        <button onclick="removeTransaction(\${index})">x</button>\`;
        list.appendChild(item);

        if (tran.type === "income") incomeAmt += tran.amount;
        else expenseAmt += tran.amount;

        total += tran.type === "income" ? tran.amount : -tran.amount;
    });

    balance.innerText = \`₹\${total.toFixed(2)}\`;
    income.innerText = \`+₹\${incomeAmt.toFixed(2)}\`;
    expense.innerText = \`-₹\${expenseAmt.toFixed(2)}\`;

    updateChart(incomeAmt, expenseAmt);
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function removeTransaction(index) {
    transactions.splice(index, 1);
    filterAndSearch();
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const tran = {
        text: text.value,
        amount: +amount.value,
        type: type.value,
        category: category.value,
        date: new Date().toISOString()
    };
    transactions.push(tran);
    text.value = "";
    amount.value = "";
    filterAndSearch();
});

toggleDark.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

clearAll.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all transactions?")) {
        transactions = [];
        filterAndSearch();
    }
});

search.addEventListener("input", filterAndSearch);
monthFilter.addEventListener("change", filterAndSearch);

function filterAndSearch() {
    let filtered = transactions.filter(t =>
        t.text.toLowerCase().includes(search.value.toLowerCase()) ||
        t.category.toLowerCase().includes(search.value.toLowerCase())
    );

    if (monthFilter.value !== "all") {
        filtered = filtered.filter(t => formatMonth(t.date) == monthFilter.value);
    }

    updateDOM(filtered);
}

// CHART SETUP
let chart;
function updateChart(incomeVal, expenseVal) {
    const ctx = document.getElementById("chart").getContext("2d");
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                data: [incomeVal, expenseVal],
                backgroundColor: ["#2ecc71", "#e74c3c"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });
}

filterAndSearch();
