# DevBot AI — 5-Minute College DevOps Expo Demonstration Guide

This guide gives you an exact, step-by-step walkthrough to present **DevBot AI** confidently to judges, professors, and peers at your DevOps Expo.

---

## 1. Quick 5-Minute Presentation Script

### Minute 1: The Problem & Solution Hook
* **Say:** *"Welcome! Today we are presenting DevBot AI. While building AI-powered applications using Large Language Models like Google Gemini is exciting, the biggest challenge engineering teams face is deploying, testing, containerizing, and delivering updates safely without breaking production. Our project demonstrates full-stack development backed by an automated 11-stage CI/CD pipeline using Docker, Jenkins, and modern DevOps best practices."*
* **Show:** Open the DevBot AI web application on screen. Show the modern dark-themed interface, the API Online health dot, and the clean design.

### Minute 2: Live Chatbot Demonstration
* **Say:** *"Our frontend is built with React 18 and Vite, communicating via a reverse proxy to an Express.js backend. The backend securely connects to Google's official Gemini API without ever exposing API keys to the browser."*
* **Action:** Click one of the suggested prompts (e.g. *"Explain CI/CD Automation"*) or ask:
  > *"What is the difference between Continuous Integration and Continuous Delivery?"*
* **Show:** Point out:
  1. The typing animation while awaiting the Gemini response.
  2. The code block rendering with the one-click "Copy Code" button.
  3. The session conversation history listed in the sidebar.

### Minute 3: Containerization with Docker
* **Say:** *"To ensure environmental parity between our development laptop and production, we containerized the entire stack using Docker."*
* **Show:** Open terminal or Docker Desktop:
  ```powershell
  docker compose ps
  ```
* **Explain:**
  1. **Multi-Stage Build:** *"In `client/Dockerfile`, we use a multi-stage build. Node compiles our React code into static assets, and then a lean Nginx Alpine image serves them. This keeps our final image tiny and secure."*
  2. **Security:** *"In `server/Dockerfile`, the application runs under a non-root `node` user to prevent privilege escalation."*
  3. **Inter-container networking:** *"Nginx proxies `/api` directly to `server:5000` over a private Docker bridge network."*

### Minute 4: Jenkins CI/CD Automation & Test Driven Verification
* **Say:** *"Next is the core of our DevOps workflow: our Jenkins Declarative Pipeline."*
* **Show:** Open Jenkins in your browser (`http://localhost:8080`):
  1. Show the **Stage View** of the DevBot AI pipeline with all 11 stages green.
  2. Click into the build console output. Show the automated backend tests:
     ```text
     PASS tests/health.test.js
     PASS tests/chat.test.js
     ```
  3. Explain: *"Notice that in our test suite, Gemini API responses are mocked. This guarantees fast builds, works offline, and avoids consuming API quotas during development."*

### Minute 5: Demonstrating Failure Handling (The "Judge Impresser")
* **Say:** *"A true DevOps pipeline doesn't just pass good code; it halts bad code before it reaches users."*
* **Demo Live (or explain the pre-run failed build):**
  1. Show a failed build in Jenkins history (red stage).
  2. *"When a test fails—for instance, if someone accidentally allows oversized or unvalidated messages—Stage 4 immediately terminates the pipeline. Stages 7 (Docker Build), 9 (Docker Hub Push), and 10 (Cloud Deploy) are blocked."*
* **Wrap Up:** *"DevBot AI demonstrates end-to-end automation: from git commit to automated testing, containerization, and cloud delivery. Thank you, and we'd love to answer any questions!"*

---

## 2. Essential Commands Cheat Sheet

### Running the Application Locally with Docker
```powershell
# Build and start all services in detached mode
docker compose up --build -d

# Check running containers and health status
docker compose ps

# View live container logs
docker compose logs -f

# Stop all containers cleanly
docker compose down
```

### Running Tests Locally
```powershell
# Run backend test suite (Jest + Supertest)
cd d:\DevBot\server
npm test

# Run with test coverage
npm test -- --coverage
```

### Starting Services in Development Mode (Without Docker)
```powershell
# Terminal 1: Backend
cd d:\DevBot\server
npm run dev

# Terminal 2: Frontend
cd d:\DevBot\client
npm run dev
```

---

## 3. Anticipated Questions from Judges & How to Answer

| Question | Winning Answer |
| :--- | :--- |
| **Q: Where is the Gemini API key stored?** | *"The API key is strictly stored in backend environment variables (`.env` or Jenkins credentials). It is never sent to the frontend or bundled into client JavaScript."* |
| **Q: Why did you use Nginx in the frontend container instead of `npm run preview`?** | *"Nginx is an industrial-grade web server. It provides high-speed static file caching, gzip compression, and handles reverse-proxying API calls to eliminate Cross-Origin Resource Sharing (CORS) complications."* |
| **Q: How does the pipeline prevent unnecessary cloud deployment costs?** | *"Our pipeline utilizes a strict 'Fail-Fast' architecture: linting, dependency checks, and unit tests run first. If anything fails, Docker image builds and deployment webhooks are never triggered."* |
| **Q: What happens if Docker Desktop is restarted before the expo?** | *"Everything is declared in `docker-compose.yml`. A single command (`docker compose up -d`) starts both the database-less backend and Nginx frontend in seconds."* |

---

## 4. Emergency Troubleshooting Checklist

* **Symptom:** UI says *"API Offline"*
  * **Fix:** Check backend container status: `docker compose ps`. If restarted, verify port 5000 is open: `curl http://localhost:5000/api/health`.
* **Symptom:** Chat returns *"GEMINI_API_KEY is not configured"*
  * **Fix:** Ensure your `.env` file in the project root contains your valid key: `GEMINI_API_KEY=AIzaSy...`.
* **Symptom:** Port 3000 or 5000 is already in use
  * **Fix:** In PowerShell:
    ```powershell
    Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
    ```

