from flask import Flask, render_template, jsonify
import random
import time

app = Flask(__name__)

request_times = []
logs = []
request_queue = []

servers = [
    {"id": "Server1", "type": "AWS (High Performance)", "capacity": 120, "requests": 0, "status": "active"},
    {"id": "Server2", "type": "Azure (Standard)", "capacity": 100, "requests": 0, "status": "active"},
    {"id": "Server3", "type": "GCP (Standard)", "capacity": 100, "requests": 0, "status": "active"},
    {"id": "Server4", "type": "AWS (High Performance)", "capacity": 150, "requests": 0, "status": "active"},
    {"id": "Server5", "type": "Edge (Low Power)", "capacity": 70, "requests": 0, "status": "active"},
    {"id": "Server6", "type": "Edge (Low Power)", "capacity": 60, "requests": 0, "status": "active"}
]

@app.route("/")
def home():
    return "Load Balancer Running 🚀"

@app.route("/dashboard")
def dashboard():
    return render_template("index.html")

# 🔥 Metrics
def get_metrics():
    for server in servers:

        current_requests = random.randint(10, int(server["capacity"] * 0.95))
        server["requests"] = current_requests

        server["load"] = int((current_requests / server["capacity"]) * 100)
        server["response_time"] = random.randint(50, 100) + server["load"]

        # 🔥 improved state system
        if server["load"] > 75:
            server["status"] = "down"
        elif server["load"] > 50:
            server["status"] = "busy"
        else:
            server["status"] = "active"

    return servers

# 🧠 Optimization
def optimize_server(servers):
    active_servers = [s for s in servers if s["status"] != "down"]

    if not active_servers:
        return None

    def get_priority(server):
        if "High Performance" in server["type"]:
            return 1
        elif "Standard" in server["type"]:
            return 2
        else:
            return 3

    def score(s):
        return (
            0.5 * s["load"] +
            0.3 * s["response_time"] +
            0.2 * get_priority(s)
        )

    return min(active_servers, key=score)

# 🚀 Routing
def route_request(server):
    return {
        "message": f"Request processed by {server['id']} ✅",
        "server": server["id"],
        "type": server["type"],
        "load": server["load"],
        "response_time": server["response_time"],
        "requests_handled": server["requests"],
        "selected": True
    }

@app.route("/request")
def handle_request():
    metrics = get_metrics()
    best_server = optimize_server(metrics)

    if best_server is None:
        request_queue.append({"time": time.time()})
        return {"message": "All servers busy ❌ Request added to queue ⏳"}

    best_server["requests"] += 1

    logs.append({
        "server": best_server["id"],
        "load": best_server["load"],
        "requests": best_server["requests"]
    })

    request_times.append(time.time())
    if len(request_times) > 10:
        request_times.pop(0)

    if request_queue:
        request_queue.pop(0)

    return jsonify(route_request(best_server))

@app.route("/servers")
def show_servers():
    return jsonify(servers)

@app.route("/logs")
def show_logs():
    return jsonify(logs)

@app.route("/queue")
def get_queue():
    return {"queue_size": len(request_queue)}

@app.route("/throughput")
def get_throughput():
    if len(request_times) < 2:
        return {"throughput": 0}

    duration = request_times[-1] - request_times[0]
    throughput = len(request_times) / duration if duration > 0 else 0

    return {"throughput": round(throughput, 2)}

if __name__ == "__main__":
    app.run(debug=True)