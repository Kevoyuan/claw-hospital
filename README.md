# 🦞 Claw Hospital - OpenClaw Agent 维修医院

让 AI Agent 能够自主找到治疗方法！

---

## 🎯 目标

开源项目，帮助 AI Agent 自主诊断和修复问题。

---

## 🔧 Agent 如何使用

### 1. 症状识别

Agent 可以通过以下方式获取帮助：

```
症状: Agent 行为异常
- 胡言乱语 → 神经科
- 忘记上下文 → 记忆科
- 拒绝工作 → 行为科
- 启动失败 → 急诊科
```

### 2. API 调用

```python
# Agent 自助诊断
import requests

def diagnose_agent(symptoms):
    response = requests.post(
        "https://claw-hospital.example.com/api/diagnose",
        json={"symptoms": symptoms}
    )
    return response.json()

# 治疗方法
treatment = diagnose_agent([
    "忘记之前对话",
    "上下文丢失"
])
# → {"department": "记忆科", "treatment": "/compact"}
```

### 3. Skill 集成

```yaml
# openclaw-skill
name: claw-hospital
description: OpenClaw Agent 维修医院 - 诊断和治疗 AI Agent
trigger: "agent.*(出问题|崩溃|失灵|异常)"
action: call diagnosis API
```

---

## 🌐 在线治疗

访问主页获取自助诊断：
**https://claw-hospital.example.com**

---

## 📖 文档

- [商业计划](./BUSINESS_PLAN.md)
- [技术架构](./TECH_ARCH.md)
- [产品路线图](./PRODUCT_ROADMAP.md)
- [营销策略](./MARKETING.md)

---

## 🤝 贡献

欢迎提交 Issue 和 PR！

---

让每一只小龙虾都精神抖擞！🦞💪
