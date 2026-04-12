let chart;
let lineChart;
let totalRequests = 0;
let history = [];
let selectedServer = null;

// 🚀 SEND REQUEST
function sendRequest() {
    fetch(`/request`)
        .then(res => res.json())
        .then(data => {

            totalRequests++;
            document.getElementById("totalRequests").innerText = totalRequests;

            selectedServer = data.server;

            getServers();
            getLogs();
        })
        .catch(err => console.error("Request error:", err));
}

// 📊 GET SERVERS
function getServers() {
    fetch(`/servers`)
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
        })
        .catch(err => console.error("Server fetch error:", err));
}

// 📜 LOGS
function getLogs() {
    fetch(`/logs`)
        .then(res => res.json())
        .then(data => {
            let output = "";
            data.slice(-5).forEach(log => {
                output += `<div>${log.server} → ${log.load} (Req: ${log.requests})</div>`;
            });
            document.getElementById("logs").innerHTML = output;
        })
        .catch(err => console.error("Logs fetch error:", err));
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
        step.reduce((a, b) => a + b, 0) / step.length
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