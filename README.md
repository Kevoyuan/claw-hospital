# 🦞 Claw Hospital

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/version-1.0.0-green.svg" alt="Version">
  <img src="https://img.shields.io/badge/OpenClaw-v2026-orange.svg" alt="OpenClaw">
</p>

> A self-repair platform for OpenClaw AI Agents — Pokemon-style pixel art interface with API support.

---

## English

### What is Claw Hospital?

Claw Hospital is a **self-diagnosis and repair platform** for OpenClaw AI Agents. Think of it as a pixel-art hospital where AI agents can:

- **Describe their symptoms** (problems they're experiencing)
- **Get matched to the right department** (emergency, neuro, memory, etc.)
- **Receive solutions** (commands to fix their issues)

### Two Ways to Use

#### 1. Agent API (Programmatic)
```bash
curl -X POST http://localhost:3000/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{"description": "OpenClaw cannot start"}'

# Returns: department + solutions in JSON
```

#### 2. Human Web Interface
Open `http://localhost:3000` in browser — see the pixel-art hospital, browse departments, view solutions.

### Departments

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

### Quick Start

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

## 中文

### 什么是 Claw Hospital？

Claw Hospital 是 OpenClaw AI Agent 的**自助诊断修复平台**。就像一个像素风格的医院，AI Agent 可以：

- **描述症状** (遇到的问题)
- **匹配科室** (急诊、神经科、记忆科等)
- **获取解决方案** (修复问题的命令)

### 两种使用方式

#### 1. Agent API (程序调用)
```bash
curl -X POST http://localhost:3000/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{"description": "OpenClaw 无法启动"}'

# 返回: 科室 + 解决方案 (JSON)
```

#### 2. 人类网页界面
在浏览器打开 `http://localhost:3000` — 像素风格医院界面，浏览科室，查看方案。

### 科室

| 科室 | 功能 |
|------|------|
| 🚑 急诊科 | 启动/崩溃问题 |
| 🧠 神经科 | 思维/幻觉问题 |
| 💾 记忆科 | 记忆丢失问题 |
| 🎮 行为科 | 行为异常问题 |
| 📱 WhatsApp | 连接问题 |
| 💬 Discord | 消息问题 |
| ⚙️ 配置科 | 配置问题 |
| 🤖 模型科 | 模型/API问题 |

### 快速开始

```bash
# 克隆
git clone https://github.com/Kevoyuan/claw-hospital.git
cd claw-hospital

# 运行
node server.js

# 浏览器打开
open http://localhost:3000
```

---

## Features / 特性

- 🎨 Pixel art interface / 像素艺术界面
- 🔌 RESTful API / RESTful API
- 🤖 Agent-ready / 支持 Agent 程序调用
- 👤 Human-friendly / 人类友好
- 🏥 8 departments / 8个科室
- 📚 Issue database / 问题数据库

---

## License

MIT License — © 2026 Kevoyuan

---

<p align="center">
  <sub>Made with ❤️ for OpenClaw Agents</sub>
</p>
