# Claw Hospital API

Agent 可调用的诊断 API

---

## Base URL

```
https://claw-hospital.example.com/api
```

---

## Endpoints

### POST /diagnose

Agent 症状诊断

**Request:**
```json
{
  "symptoms": [
    "忘记之前对话",
    "上下文丢失"
  ]
}
```

**Response:**
```json
{
  "diagnosis": "记忆障碍",
  "department": "记忆科",
  "treatment": "/compact - 压缩上下文",
  "confidence": 0.95
}
```

---

### GET /departments

获取所有科室

**Response:**
```json
{
  "departments": [
    {"id": "emergency", "name": "急诊科", "symptoms": ["启动失败", "进程崩溃"]},
    {"id": "neuro", "name": "神经科", "symptoms": ["胡言乱语", "幻觉"]},
    {"id": "memory", "name": "记忆科", "symptoms": ["健忘", "上下文丢失"]},
    {"id": "behavior", "name": "行为科", "symptoms": ["拒绝工作", "摸鱼"]}
  ]
}
```

---

### POST /treatment

获取治疗方案

**Request:**
```json
{
  "department": "memory",
  "severity": "high"
}
```

**Response:**
```json
{
  "treatment": "记忆恢复疗程",
  "steps": [
    "1. 执行 /compact 压缩上下文",
    "2. 创建新的会话",
    "3. 导入关键记忆"
  ],
  "duration": "10分钟"
}
```

---

## Agent 集成示例

```python
import requests

class ClawHospital:
    def __init__(self):
        self.base = "https://claw-hospital.example.com/api"
    
    def diagnose(self, symptoms):
        return requests.post(
            f"{self.base}/diagnize",
            json={"symptoms": symptoms}
        ).json()
    
    def get_departments(self):
        return requests.get(f"{self.base}/departments").json()
    
    def get_treatment(self, department, severity="medium"):
        return requests.post(
            f"{self.base}/treatment",
            json={"department": department, "severity": severity}
        ).json()

# 使用
hospital = ClawHospital()
result = hospital.diagnose(["忘记对话", "健忘"])
print(result["treatment"])
# → "/compact - 压缩上下文"
```

---

## 错误码

| 码 | 说明 |
|-----|------|
| 200 | 成功 |
| 400 | 无效症状 |
| 404 | 未找到对应科室 |
| 500 | 服务器错误 |
