# OpenClaw Discord/Telegram 问题清单

本文档列出 Discord 和 Telegram 连接中遇到的常见具体问题及解决方案。

## 目录

- [Discord 问题](#discord-问题)
- [Telegram 问题](#telegram-问题)
- [通用问题](#通用问题)

---

## Discord 问题

### 1. 机器人上线但不响应消息

**症状**：
- 机器人显示在线
- 发送消息后无任何响应

**可能原因**：
1. Message Content Intent 未启用
2. 权限不足
3. 频道未在白名单中

**排查步骤**：
1. 确认 Discord 开发者门户 Bot 设置中已启用 `Message Content Intent`
2. 确认机器人被邀请到目标服务器
3. 确认机器人拥有 `View Channels`、`Send Messages` 权限
4. 检查配置文件中的 `channelIds` 是否包含目标频道

**解决方案**：
```bash
# 重启 Discord 服务
openclaw service restart discord
```

---

### 2. 只能收到 @机器人的消息，其他消息不响应

**症状**：
- @机器人时能回复
- 普通消息不回复

**可能原因**：未正确配置 mention gating

**解决方案**：在配置中调整：
```json
{
  "channels": {
    "discord": {
      "mentionGating": false
    }
  }
}
```

---

### 3. 无法读取消息内容 (Message Content Intent)

**症状**：
- 日志显示无法读取消息
- 机器人无法理解用户消息

**原因**：Discord 开发者门户未启用 Message Content Intent

**解决**：
1. 打开 [Discord Developer Portal](https://discord.com/developers/applications)
2. 选择您的应用 → Bot
3. 找到 **Message Content Intent** → 启用
4. 点击 **Save Changes**

---

### 4. 私信无法发送/接收

**症状**：
- 无法通过私信配对
- 机器人无法发送 DM

**原因**：OAuth2 权限未包含 `dmc:write`

**解决**：
1. 开发者门户 → OAuth2 → URL Generator
2. 在 Scopes 中选择 `bot`
3. 在 Bot Permissions 中确保有 `Manage Messages` 或重新生成邀请链接

---

### 5. Failed to resolve Discord application id

**症状**：
- 启动时错误
- 无法连接 Discord Gateway

**原因**：中国大陆网络环境无法访问 Discord API

**解决**：
- 使用代理/VPN
- 或改用 Telegram 通道

---

### 6. 机器人加入后显示"机器人离线"

**症状**：
- 邀请成功但显示离线
- 无法通过 @提及

**原因**：Bot Token 错误或已重置

**解决**：
1. 确认 Bot Token 未过期
2. 在开发者门户重新复制 Token
3. 更新配置文件
4. 重启服务

---

## Telegram 问题

### 1. 机器人不响应任何消息

**症状**：
- 发送消息给机器人无反应
- 日志无任何输出

**排查步骤**：
1. 检查是否已完成配对
2. 检查 Bot Token 是否正确
3. 检查守护进程状态

**解决方案**：
```bash
# 检查状态
openclaw status

# 启动守护进程
openclaw daemon start

# 重启 Telegram 服务
openclaw service restart telegram
```

---

### 2. 配对码无效/过期

**症状**：
- 配对失败
- 提示配对码过期

**原因**：配对码有效期 1 小时

**解决方案**：
直接添加用户 ID 到白名单：
```json
{
  "channels": {
    "telegram": {
      "allowFrom": ["您的UserID"]
    }
  }
}
```

获取 User ID：搜索 @userinfobot

---

### 3. 群组中不回复消息

**症状**：
- 私聊正常
- 群组中机器人不回复

**原因**：
1. Group Privacy 未关闭
2. allowGroups 未启用

**解决**：
1. @BotFather → /mybots → 选择机器人 → Bot Settings → Group Privacy → **Disable**
2. 配置文件设置：
```json
{
  "channels": {
    "telegram": {
      "allowGroups": true
    }
  }
}
```

---

### 4. 401 Unauthorized 错误

**症状**：
- 日志显示 401 错误
- 机器人完全无响应

**原因**：Bot Token 错误

**解决**：
1. @BotFather → /token 获取新 Token
2. 更新配置文件
3. 重启服务

---

### 5. Webhook 配置失败

**症状**：
- Webhook 模式无法使用
- 提示端口或 URL 错误

**原因**：
- Webhook URL 不是 HTTPS
- 端口不在允许范围

**解决**：
- Webhook URL 必须 HTTPS
- 允许端口：443, 80, 88, 8443
- Polling 和 Webhook 不能同时启用

---

### 6. 升级后 Telegram 无法连接

**症状**：
- 升级到 2026.2.17+ 后无法连接

**原因**：网络连接默认行为变更

**解决**：
```bash
openclaw gateway restart
```

---

### 7. 回复速度很慢

**症状**：消息发送延迟

**原因**：
- Polling 模式轮询间隔长
- AI 模型响应慢

**解决**：
- 切换到 Webhook 模式
- 检查网络延迟

---

## 通用问题

### 1. 日志显示连接成功但无法收发消息

**排查**：
1. 检查 allowlists 配置
2. 检查是否在白名单中

**解决**：
```bash
# 查看完整日志
openclaw logs --follow
```

---

### 2. Gateway 启动失败

**症状**：
- `Gateway start blocked` 错误
- 服务无法启动

**解决**：
```json
{
  "gateway": {
    "mode": "local"
  }
}
```

---

### 3. 配置更改后不生效

**解决**：
```bash
# 每次修改配置后必须重启
openclaw gateway restart
```

---

### 4. Node.js 版本不兼容

**错误**：`Node.js version X.X is not supported`

**解决**：
```bash
# 检查版本
node --version

# 需要 Node.js 22+
# 使用 nvm 升级
nvm install 22
nvm use 22
```

---

### 5. 内存不足导致崩溃

**症状**：运行时崩溃

**解决**：确保分配至少 4GB 内存

---

## 快速诊断清单

| 检查项 | 命令 |
|--------|------|
| 服务状态 | `openclaw status` |
| 查看日志 | `openclaw logs --follow` |
| 诊断工具 | `openclaw doctor` |
| 重启网关 | `openclaw gateway restart` |
| 重启特定服务 | `openclaw service restart discord/telegram` |

---

## 相关配置路径

- 配置文件：`~/.openclaw/openclaw.json`
- Docker 配置：`/home/node/.openclaw/openclaw.json`

如需帮助，请查阅 [SKILL.md](./SKILL.md) 或运行 `openclaw doctor` 进行诊断。
