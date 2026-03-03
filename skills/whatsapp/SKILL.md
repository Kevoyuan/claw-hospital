# OpenClaw WhatsApp 集成技能

本技能文档介绍 OpenClaw 连接 WhatsApp 的方法、常见问题及解决方案。

## 连接方法

### 方式一：个人账户（QR 码配对）

适用于测试和个人使用，使用 WhatsApp Web 协议（Baileys 库）。

**步骤：**

1. **安装 OpenClaw**
   ```bash
   npm install -g openclaw@latest
   openclaw onboard --install-daemon
   ```

2. **启动 WhatsApp 配对**
   ```bash
   openclaw channels login whatsapp
   ```

3. **扫描 QR 码**
   - 打开手机 WhatsApp → 设置 → 已关联的设备
   - 扫描终端显示的 QR 码

4. **安装 WhatsApp MCP 技能（可选但推荐）**
   ```bash
   clawhub install whatsapp-mcp
   # 重启 OpenClaw 使技能生效
   ```

### 方式二：WhatsApp Business API

适用于企业级生产环境，支持更大规模和更多功能。

**步骤：**

1. **获取 Meta Business 凭证**
   - 在 Meta Business Manager 注册应用
   - 获取永久访问令牌（Access Token）
   - 配置 webhook URL

2. **配置 Webhook**
   ```bash
   # 在 OpenClaw 配置中设置 webhook 端点
   openclaw config set whatsapp.webhook.enabled true
   ```

3. **订阅消息事件**
   - 在 Meta 后台订阅 `messages` 相关事件
   - 验证 webhook 回调

## 前置要求

- Node.js 18+（推荐 22+）
- WhatsApp 账号（建议使用专用号码）
- LLM API Key（Claude、OpenAI、Gemini 等）
- Fast.io 账号（用于文件存储，可选）

## 常见问题与解决方案

### 问题 1：频繁断连/重复登录

**症状：** OpenClaw 不断断开 WhatsApp 连接，要求重新扫描 QR 码。

**解决方案：**

```bash
# 1. 检查连接状态
openclaw channels status --probe

# 2. 清除旧凭证并重新配对
rm -rf ~/.openclaw/channels/whatsapp/
openclaw channels login whatsapp

# 3. 确保手机已关联设备中移除旧会话
# WhatsApp → 设置 → 已关联的设备 → 选择旧设备 → 注销
```

### 问题 2：无法回复消息

**症状：** WhatsApp 显示已连接，但 Bot 不回复消息。

**解决方案：**

```bash
# 1. 检查配对状态
openclaw pairing list whatsapp

# 2. 批准发送者
openclaw pairing approve whatsapp <手机号>

# 3. 检查 DM 策略配置
openclaw config get dmPolicy
# 设为 "open" 可允许所有人，或 "pairing" 需要配对

# 4. 确保 Gateway 正在运行
openclaw gateway start
```

### 问题 3：Webhook 错误

**症状：** 收到 400、401、403 或 413 错误。

**解决方案：**

- **400 错误**：检查请求载荷格式是否匹配预期 schema
- **401/403 错误**：验证认证令牌是否正确配置
- **413 错误**：载荷过大，尝试外部存储或减小文件

```bash
# 检查 webhook 日志
openclaw logs --tail 100 | grep webhook
```

### 问题 4：API 密钥错误

**症状：** 收到 401、403 或 429 错误码。

**解决方案：**

- **401 错误**：API 密钥错误或过期，检查并重新配置
- **403 错误**：账户无权限访问特定模型，验证账户状态
- **429 错误**：请求速率限制，等待后重试

```bash
# 重新配置 API 密钥
openclaw auth list
openclaw auth add <provider> <api-key>
```

### 问题 5：消息被忽略

**症状：** 消息发送后无响应，日志显示 "dropped due to requireMention"。

**解决方案：**

- 检查群组策略配置
- 确保 Bot 被正确 @提及
- 调整 `requireMention` 设置

```bash
# 查看当前群组策略
openclaw config get groupPolicy

# 修改为允许所有消息
openclaw config set groupPolicy open
```

## 安全建议

1. **使用专用号码** - 建议使用单独的 WhatsApp 号码运行 OpenClaw，避免影响个人聊天
2. **严格限制访问** - 使用配对（pairing）和白名单保护
3. **不要暴露 Gateway** - 避免将 Gateway 直接暴露到公网
4. **遵守 WhatsApp 条款** - 避免自动化群发消息

## 快速命令参考

| 命令 | 说明 |
|------|------|
| `openclaw channels login whatsapp` | 登录 WhatsApp |
| `openclaw channels status` | 查看连接状态 |
| `openclaw channels status --probe` | 诊断连接问题 |
| `openclaw pairing list whatsapp` | 列出已配对用户 |
| `openclaw pairing approve whatsapp <号码>` | 批准用户 |
| `clawhub install whatsapp-mcp` | 安装 WhatsApp 技能 |
| `openclaw gateway start` | 启动 Gateway |

## 参考资源

- 官方文档：https://docs.openclaw.ai/channels/whatsapp
- OpenClaw GitHub：https://github.com/Clawdbot/openclaw
