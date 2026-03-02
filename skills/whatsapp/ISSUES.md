# OpenClaw WhatsApp 问题汇总

本文档列出 OpenClaw 连接 WhatsApp 时可能遇到的常见问题及具体症状。

---

## 🔴 严重问题

### 问题 1：QR 码扫描失败

**症状：**
- 终端显示 QR 码但无法扫描
- 扫描后显示 "链接失败" 或 "超时"
- QR 码显示不完整或变形

**可能原因：**
- 终端字体/缩放问题
- 屏幕亮度不足
- WhatsApp 版本过旧

**解决方向：**
- 调整终端窗口大小
- 增加终端字体
- 确保手机屏幕亮度足够

---

### 问题 2：连接已断开

**症状：**
- 日志显示 "WhatsApp disconnected"
- 每次启动都需要重新扫描
- 连接状态显示 "offline"

**可能原因：**
- 凭证文件损坏或过期
- 服务器时间不同步
- WhatsApp 手动注销了设备

**解决方向：**
- 删除 `~/.openclaw/channels/whatsapp/` 目录
- 同步服务器时间
- 在手机端移除已关联设备后重新配对

---

### 问题 3：不回复消息

**症状：**
- WhatsApp 显示 "已连接"
- 发送消息给 Bot 无任何响应
- 日志中没有收到消息的记录

**可能原因：**
- DM 策略设置为 "pairing"（需要配对）
- 发送者不在白名单中
- Gateway 未正确运行

**解决方向：**
- 运行 `openclaw pairing approve whatsapp <手机号>`
- 检查 DM 策略：`openclaw config get dmPolicy`
- 重启 Gateway

---

## 🟡 中等问题

### 问题 4：Webhook 401/403 错误

**症状：**
- 日志显示 webhook 调用失败
- 收到 HTTP 401 或 403 错误码

**可能原因：**
- 认证令牌配置错误
- 权限不足

**解决方向：**
- 检查 `cron.webhookToken` 配置
- 验证接收服务的认证方式

---

### 问题 5：Webhook 413 错误

**症状：**
- 大文件无法通过 webhook 发送
- 收到 "Payload Too Large" 错误

**可能原因：**
- 请求体超过大小限制

**解决方向：**
- 使用外部存储（如 Fast.io）
- 发送文件 URL 而非文件内容

---

### 问题 6：群组消息无响应

**症状：**
- 在群组中 @Bot 没有反应
- 日志显示 "dropped due to requireMention"

**可能原因：**
- 群组不在白名单中
- 启用了 requireMention 策略

**解决方向：**
- 检查 `groups` 白名单配置
- 修改 `groupPolicy` 为更开放的模式

---

### 问题 7：API 速率限制 (429)

**症状：**
- 消息发送失败
- 收到 429 错误码
- LLM API 调用被限制

**可能原因：**
- 请求频率过高
- API 配额用尽

**解决方向：**
- 添加速率限制
- 等待后重试
- 检查 API 账户余额

---

## 🟢 轻微问题

### 问题 8：消息发送延迟

**症状：**
- 消息需要很长时间才发送成功
- 延迟超过 10 秒

**可能原因：**
- LLM 响应慢
- 网络连接不稳定
- 服务器负载高

**解决方向：**
- 检查网络连接
- 优化 LLM 提示词
- 查看服务器资源使用

---

### 问题 9：文件上传失败

**症状：**
- 收到文件但无法下载
- 上传到自己云盘失败

**可能原因：**
- Fast.io 未正确配置
- 文件格式不支持
- 存储空间不足

**解决方向：**
- 运行 `clawhub install fastio` 配置云盘
- 检查存储账户状态

---

### 问题 10：配对码验证失败

**症状：**
- 新用户发送消息被拒绝
- 显示 "pending approval"

**可能原因：**
- DM 策略为 "pairing"
- 用户未手动批准

**解决方向：**
- 管理员运行 `openclaw pairing approve whatsapp <号码>`
- 或将策略改为 "open"（不推荐）

---

## 📋 诊断命令清单

遇到问题时，可以按顺序执行以下命令进行诊断：

```bash
# 1. 检查整体状态
openclaw status

# 2. 查看详细状态
openclaw status --all

# 3. 检查 WhatsApp 通道状态
openclaw channels status --probe

# 4. 查看最近日志
openclaw logs --tail 50

# 5. 检查配对列表
openclaw pairing list whatsapp

# 6. 查看配置
openclaw config list
```

---

*持续更新中... 如果遇到新问题，请在 GitHub Issues 中报告。*
