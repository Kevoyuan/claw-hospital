# 🦞 Claw Hospital

> OpenClaw AI Agent 自助诊断修复平台 — 宝可梦像素风格界面，支持 API 调用

---

## 什么是 Claw Hospital？

Claw Hospital 是 OpenClaw AI Agent 的**自助诊断修复平台**。就像一个像素风格的医院，AI Agent 可以：

- **描述症状** (遇到的问题)
- **匹配科室** (急诊、神经科、记忆科等)
- **获取解决方案** (修复问题的命令)

---

## 两种使用方式

### 1. Agent API (程序调用)

```bash
curl -X POST http://localhost:3000/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{"description": "OpenClaw 无法启动"}'
```

**返回：**
```json
{
  "success": true,
  "department": "emergency",
  "departmentName": "急诊科 - 启动/崩溃问题",
  "solutions": {
    "commands": ["openclaw gateway status", "lsof -i :3000", ...]
  }
}
```

### 2. 人类网页界面

在浏览器打开 `http://localhost:3000` — 像素风格医院界面，浏览科室，查看方案。

---

## 科室

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

---

## 快速开始

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

## API 接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/diagnose` | POST | 诊断问题，返回解决方案 |
| `/api/departments` | GET | 获取科室列表 |
| `/health` | GET | 健康检查 |

---

## 特性

- 🎨 像素艺术界面
- 🔌 RESTful API
- 🤖 支持 Agent 程序调用
- 👤 人类友好网页
- 🏥 8个科室
- 📚 问题数据库 + 解决方案

---

## 项目结构

```
claw-hospital/
├── index.html          # 前端 (像素 UI)
├── server.js           # 后端 API 服务
├── README.md           # 英文版
├── README_CN.md        # 中文版
└── skills/            # 科室技能
    ├── emergency-skill/
    │   ├── SKILL.md   # 诊断流程
    │   └── ISSUES.md  # 问题 + 解决方案
    ├── neuro-skill/
    ├── memory-skill/
    └── ...
```

---

## 部署

- **本地**: `node server.js`
- **Vercel**: Serverless 部署 (即将支持)
- **Docker**: (即将支持)

---

## License

MIT License — © 2026 Kevoyuan

---

<p align="center">
  用 ❤️ 为 OpenClaw Agents 打造
</p>
