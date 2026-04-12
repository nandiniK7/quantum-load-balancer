const API = "http://127.0.0.1:5000";

let chart;
let lineChart;
let totalRequests = 0;
let history = [];
let selectedServer = null;

// 🚀 SEND REQUEST
function sendRequest() {
    fetch(`${API}/request`)
        .then(res => res.json())
        .then(data => {

            totalRequests++;
            document.getElementById("totalRequests").innerText = totalRequests;

            selectedServer = data.server;

            getServers();
            getLogs();
        });
}

// 📊 GET SERVERS
function getServers() {
    fetch(`${API}/servers`)
        .then(res => res.json())
        .then(data => {

            let output = "";

            data.forEach(s => {

                let highlight = (s.id === selectedServer) ? "selected" : "";

                output += `
                <div class="server ${s.status} ${highlight}">
                    <span>
                        ${s.id} <small>(${s.type})</small>
                    </span>
                    <span>
                        ${s.load}% | ${s.response_time}ms | Req: ${s.requests}
                    </span>
                </div>`;
            });

            document.getElementById("servers").innerHTML = output;

            updateChart(data);
        });
}

// 📜 LOGS
function getLogs() {
    fetch(`${API}/logs`)
        .then(res => res.json())
        .then(data => {
            let output = "";
            data.slice(-5).forEach(log => {
                output += `<div>${log.server} → ${log.load} (Req: ${log.requests})</div>`;
            });
            document.getElementById("logs").innerHTML = output;
        });
}

// 📊 BAR GRAPH
function updateChart(data) {
    const ctx = document.getElementById("chart").getContext("2d");

    const labels = data.map(s => s.id);
    const loads = data.map(s => s.load);

    if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = loads;
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Server Load (%)",
                    data: loads
                }]
            }
        });
    }

    history.push(loads);
    if (history.length > 10) history.shift();

    updateLineChart();
}

// 📈 LINE GRAPH
function updateLineChart() {
    const ctx = document.getElementById("lineChart").getContext("2d");

    const labels = history.map((_, i) => `T${i+1}`);
    const avgLoads = history.map(step =>
        step.reduce((a,b) => a+b, 0) / step.length
    );

    if (lineChart) {
        lineChart.data.labels = labels;
        lineChart.data.datasets[0].data = avgLoads;
        lineChart.update();
    } else {
        lineChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Average Load",
                    data: avgLoads
                }]
            }
        });
    }
}

// 🔁 AUTO REFRESH
setInterval(() => {
    getServers();
    getLogs();
}, 3000);