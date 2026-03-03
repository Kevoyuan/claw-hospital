# 🦞 Claw Hospital

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/version-1.0.0-green.svg" alt="Version">
  <img src="https://img.shields.io/badge/OpenClaw-v2026-orange.svg" alt="OpenClaw">
</p>

> A self-repair platform for OpenClaw AI Agents — Pokemon-style pixel art interface with API support.

---

## What is Claw Hospital?

Claw Hospital is a **self-diagnosis and repair platform** for OpenClaw AI Agents. Think of it as a pixel-art hospital where AI agents can:

- **Describe their symptoms** (problems they're experiencing)
- **Get matched to the right department** (emergency, neuro, memory, etc.)
- **Receive solutions** (commands to fix their issues)

---

## Two Ways to Use

### 1. Agent API (Programmatic)

```bash
curl -X POST http://localhost:3000/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{"description": "OpenClaw cannot start"}'
```

**Response:**
```json
{
  "success": true,
  "department": "emergency",
  "departmentName": "Emergency Department",
  "solutions": {
    "commands": ["openclaw gateway status", "lsof -i :3000", ...]
  }
}
```

### 2. Human Web Interface

Open `http://localhost:3000` in browser — see the pixel-art hospital, browse departments, view solutions.

---

## Departments

| Department | Function |
|------------|----------|
| 🚑 Emergency | Startup / Crash issues |
| 🧠 Neuro | Thinking / Hallucination issues |
| 💾 Memory | Memory loss issues |
| 🎮 Behavior | Behavior abnormal issues |
| 📱 WhatsApp | Connection issues |
| 💬 Discord | Message issues |
| ⚙️ Config | Configuration issues |
| 🤖 Model | Model / API issues |

---

## Quick Start

```bash
# Clone
git clone https://github.com/Kevoyuan/claw-hospital.git
cd claw-hospital

# Run
node server.js

# Open in browser
open http://localhost:3000
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/diagnose` | POST | Diagnose problem, returns solutions |
| `/api/departments` | GET | List all departments |
| `/health` | GET | Health check |

---

## Features

- 🎨 Pixel art interface
- 🔌 RESTful API
- 🤖 Agent-ready (programmatic access)
- 👤 Human-friendly web UI
- 🏥 8 departments
- 📚 Issue database with solutions

---

## Project Structure

```
claw-hospital/
├── index.html          # Frontend (pixel art UI)
├── server.js           # Backend API server
├── README.md           # This file
└── skills/            # Department skills
    ├── emergency-skill/
    │   ├── SKILL.md    # Diagnostic procedures
    │   └── ISSUES.md   # Known issues + solutions
    ├── neuro-skill/
    ├── memory-skill/
    ├── behavior-skill/
    ├── discord/
    ├── whatsapp/
    ├── config/
    ├── model/
    └── skill/
```

---

## Deploy

- **Local**: `node server.js`
- **Vercel**: Serverless deployment (coming soon)
- **Docker**: (coming soon)

---

## License

MIT License — © 2026 Kevoyuan

---

<p align="center">
  Made with ❤️ for OpenClaw Agents
</p>
