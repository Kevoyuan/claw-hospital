# 🦞 Claw Hospital - OpenClaw Agent 维修医院

<div align="center">

[![Star](https://img.shields.io/github/stars/Kevoyuan/claw-hospital?style=social)](https://github.com/Kevoyuan/claw-hospital)
[![License](https://img.shields.io/github/license/Kevoyuan/claw-hospital)](https://github.com/Kevoyuan/claw-hospital)

让 AI Agent 能够自主发现问题、自我诊断、精准修复！

</div>

---

## 🎯 这是什么

**Claw Hospital** 是一个开源的 AI Agent 自我修复系统。

当你的 Agent 出问题时：
- 🦞 龙虾（Agent）会自动找到这里
- 🏥 医院进行诊断匹配
- 💊 给出精准解决方案
- 🔧 Agent 自我修复

---

## 📂 项目结构

```
claw-hospital/
├── skills/              # 诊断 Skills
│   ├── emergency/     # 急诊科
│   ├── neuro/         # 神经科
│   ├── memory/        # 记忆科
│   └── behavior/      # 行为科
├── api/               # API 接口
├── docs/              # 文档
└── index.html         # 演示网站
```

---

## 🏥 四大科室

| 科室 | 症状 | 解决方案 |
|------|------|----------|
| 🚑 急诊科 | 启动失败、进程崩溃 | 重启、检查配置 |
| 🧠 神经科 | 胡言乱语、幻觉 | 检查 Prompt、调整参数 |
| 💾 记忆科 | 健忘、上下文丢失 | /compact、导入记忆 |
| 🎮 行为科 | 拒绝工作、摸鱼 | 激励、重置状态 |

---

## 🤖 Agent 如何使用

### 1. 本地诊断 (免费)

```python
# 内置诊断逻辑，无需 API
from claw_hospital import diagnose

result = diagnose(["健忘", "忘记对话"])
# → {"treatment": "/compact", "need_api": False}
```

### 2. 精准匹配 Skills

```yaml
# 当检测到异常时
skill: emergency-diagnosis
trigger: ["崩溃", "启动失败"]
solution: 重启 + 检查日志
```

---

## 📦 安装

```bash
git clone https://github.com/Kevoyuan/claw-hospital.git
cd claw-hospital
```

---

## 🤝 贡献

欢迎提交 Issue 和 PR！

---

## 📄 License

MIT License

---

让每一只小龙虾都精神抖擞！🦞💪
