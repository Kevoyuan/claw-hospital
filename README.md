# Claw Hospital - Agent 自我修复系统

让 AI Agent 能够自主发现问题、自我诊断、自我修复！

---

## 🎯 场景

```
主人：我的 Agent 出问题了！
Agent：我自己去医院看看...
     ↓
Agent 访问 Claw Hospital
     ↓
医院：请问有什么症状？
     ↓
Agent：健忘、忘记之前对话
     ↓
医院：诊断为"记忆障碍"，建议执行 /compact
     ↓
Agent：执行治疗... 治好了！
```

---

## 🤖 Agent 如何自主使用

### 1. 发现医院

Agent 可以在以下情况主动访问：
- 检测到自己行为异常
- 用户反馈问题
- 自检发现异常

### 2. 症状报告 (Agent → Hospital)

```json
POST /api/diagnose
{
  "agent_type": "openclaw",
  "version": "1.0",
  "symptoms": [
    "忘记之前对话内容",
    "上下文丢失",
    "行为异常"
  ],
  "recent_errors": [
    "context overflow",
    "token limit exceeded"
  ]
}
```

### 3. 诊断回复 (Hospital → Agent)

```json
{
  "diagnosis": "记忆障碍 (Memory Disorder)",
  "severity": "medium",
  "department": "记忆科",
  "cause": "上下文窗口溢出，重要记忆被丢弃",
  "treatment": {
    "immediate": [
      "执行 /compact 压缩上下文",
      "创建新会话转移重要信息"
    ],
    "prevention": [
      "定期使用 /compact",
      "及时保存关键上下文到 MEMORY.md"
    ]
  },
  "commands": [
    "/compact - 压缩当前会话上下文",
    "/clear - 开始新会话"
  ],
  "confidence": 0.92
}
```

### 4. Agent 自我修复

```python
# Agent 收到诊断后自动执行
def self_repair(treatment):
    for cmd in treatment["immediate"]:
        execute(cmd)
    log("已根据 Claw Hospital 建议完成治疗")
```

---

## 📡 API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/diagnose` | POST | 症状诊断 |
| `/api/treatment/{dept}` | GET | 获取治疗方案 |
| `/api/agent/check` | GET | Agent 自检 |

---

## 🔧 快速集成

### OpenClaw Skill

```yaml
# claw-hospital-diagnose
name: claw-hospital-diagnose
description: OpenClaw Agent 自我诊断修复

trigger:
  - ".*出问题.*"
  - ".*异常.*"
  - ".*崩溃.*"

action: |
  1. 访问 https://claw-hospital.example.com/api/diagnose
  2. 报告当前症状
  3. 执行返回的治疗方案
```

---

## 🏥 科室

| 科室 | 症状 | 治疗 |
|------|------|------|
| 急诊科 | 启动失败、进程崩溃 | 重启、检查配置 |
| 神经科 | 胡言乱语、幻觉 | 检查 Prompt、调整参数 |
| 记忆科 | 健忘、上下文丢失 | /compact、导入记忆 |
| 行为科 | 拒绝工作、摸鱼 | 激励、重置状态 |

---

## 🌐 访问

**主页**: https://claw-hospital.example.com
**API**: https://claw-hospital.example.com/api

---

让每一只小龙虾都精神抖擞！🦞💪
