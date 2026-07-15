# ⚡ Quantum Load Balancer

An intelligent Python Flask-based load balancer that distributes incoming requests across multiple servers using a weighted scoring algorithm. The system continuously monitors server health, detects overloaded servers, and automatically redirects traffic to maintain high availability.

---

## 🚀 Features

- Intelligent request distribution
- Weighted server selection algorithm
- Automatic failover mechanism
- Real-time server health monitoring
- REST API endpoints
- Dynamic load balancing
- Lightweight Flask backend

---

## 🛠 Tech Stack

- Python
- Flask
- REST APIs
- JSON
- HTML
- CSS
- JavaScript

---

## 🏗 System Architecture

```
                Client Requests
                       │
                       ▼
             Quantum Load Balancer
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
     Server 1       Server 2       Server 3
        │              │              │
        ▼              ▼              ▼
    Health Check   Load Monitor   Failover Engine
```

---

## ⚙️ How It Works

1. Incoming requests are received by the Flask server.
2. Every server is assigned a weighted score.
3. The algorithm evaluates:
   - Current server load
   - Server health
   - Availability
4. The request is forwarded to the most suitable server.
5. If a server crosses the load threshold, traffic is automatically redirected.

---

## 📌 Project Highlights

- Built using Python & Flask
- REST API-based architecture
- Intelligent weighted routing
- Auto failover support
- Backend system design project
- Beginner-friendly implementation of load balancing concepts

---

## 📂 Project Structure

```
quantum-load-balancer/
│
├── app.py
├── requirements.txt
├── templates/
├── static/
└── README.md
```

---

## 🎯 Future Improvements

- Docker deployment
- Kubernetes integration
- AWS Load Balancer simulation
- Machine Learning based traffic prediction
- Monitoring dashboard with analytics

---

## 👩‍💻 Author

**Nandini Kasiraju**

GitHub:
https://github.com/nandiniK7

LinkedIn:
https://www.linkedin.com/in/nandini-kasiraju-2650473a5

---

⭐ If you found this project interesting, consider giving it a star!
