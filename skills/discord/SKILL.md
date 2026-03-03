# OpenClaw Discord/Telegram 连接指南

本技能文档详细介绍 OpenClaw 连接 Discord 和 Telegram 的配置方法、常见问题及解决方案。

## 目录

- [Discord 连接](#discord-连接)
- [Telegram 连接](#telegram-连接)
- [常见问题与解决方案](#常见问题与解决方案)
- [配置参考](#配置参考)

---

## Discord 连接

### 前置要求

- Discord 账号
- Discord 开发者门户访问权限 (discord.com/developers/applications)
- 已安装并运行 OpenClaw

### 配置步骤

#### 1. 创建 Discord 应用和机器人

1. 访问 [Discord Developer Portal](https://discord.com/developers/applications)
2. 点击 **New Application** 创建新应用
3. 左侧点击 **Bot** → **Add Bot**
4. 在 **Token** 部分点击 **Reset Token** 或复制现有令牌
5. **重要**：保存好机器人令牌（Bot Token）

#### 2. 启用必要权限 (Gateway Intents)

在 Bot 设置页面，向下滚动到 **Privileged Gateway Intents**：

- ✅ **Message Content Intent** (必需) - 读取消息内容
- ✅ **Server Members Intent** (推荐) - 成员权限控制
- ✅ **Presence Intent** (可选) - 在线状态

点击 **Save Changes** 保存。

#### 3. 邀请机器人到服务器

1. 在开发者门户左侧点击 **OAuth2** → **URL Generator**
2. **Scopes** 选择 `bot`
3. **Bot Permissions** 选择必要权限：
   - `View Channels` - 查看频道
   - `Send Messages` - 发送消息
   - `Read Message History` - 读取消息历史
   - `Embed Links` - 嵌入链接
   - `Attach Files` - 附加文件
   - `Use Slash Commands` - 斜杠命令
4. 复制生成的 OAuth2 链接，在浏览器中打开并选择服务器

#### 4. 获取必要 ID

1. 在 Discord 设置中启用 **Developer Mode**：用户设置 → 高级 → 开发者模式
2. 右键服务器名 → **Copy Server ID** (服务器 ID)
3. 右键目标频道 → **Copy Channel ID** (频道 ID)

#### 5. 配置 OpenClaw

```bash
# 使用命令行添加 Discord 频道
openclaw channels add
```

按照提示：
- 选择 Discord
- 输入 Bot Token
- 输入 Server ID
- 输入允许的 Channel ID

#### 6. 重启服务

```bash
openclaw gateway restart
```

### 测试

在 Discord 中 @机器人 或发送消息测试是否正常响应。

---

## Telegram 连接

### 前置要求

- Telegram 账号
- 已安装并运行 OpenClaw

### 配置步骤

#### 1. 创建 Telegram 机器人

1. 在 Telegram 搜索 @BotFather
2. 发送 `/newbot` 创建新机器人
3. 设置机器人名称和用户名
4. 获取 **Bot Token** (格式类似：`123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

#### 2. 获取用户 ID

1. 在 Telegram 搜索 @userinfobot
2. 发送 `/start`
3. 获取您的 **User ID**

#### 3. 配置 OpenClaw

```bash
# 使用命令行添加 Telegram 频道
openclaw channels add
```

按照提示：
- 选择 Telegram
- 输入 Bot Token
- 输入您的 User ID

#### 4. 配对

1. 发送消息给您的 Telegram 机器人
2. 机器人会返回配对码
3. 在 OpenClaw 终端输入：
   ```
   openclaw pairing approve telegram <配对码>
   ```

#### 5. 重启服务

```bash
openclaw gateway restart
```

---

## 常见问题与解决方案

### 通用问题

#### ❌ 命令找不到 (command not found)

**原因**：OpenClaw 未正确安装或 PATH 未配置

**解决**：
1. 重启终端
2. 检查 `echo $PATH` 是否包含 OpenClaw 路径
3. 重新安装：`npm install -g openclaw@latest`

#### ❌ Node.js 版本不兼容

**错误**：`Error: Node.js version X.X is not supported`

**解决**：
```bash
node --version  # 确认版本
# 需要 Node.js 22+
# 使用 nvm 切换版本
nvm install 22
nvm use 22
```

#### ❌ Gateway 启动被阻止

**错误**：`Gateway start blocked`

**解决**：在配置文件中设置：
```json
{
  "gateway": {
    "mode": "local"
  }
}
```

---

### Discord 特有

#### ❌ 机器人不回复消息

**检查项**：
1. ✅ Bot Token 是否正确（无多余空格）
2. ✅ **Message Content Intent** 是否已启用
3. ✅ 机器人是否拥有查看/发送消息权限
4. ✅ OpenClaw 是否正在运行

**解决**：
```bash
# 重启 Discord 服务
openclaw service restart discord
```

#### ❌ 无法私信/配对

**原因**：Discord 机器人未开启私信权限

**解决**：
1. 在开发者门户 OAuth2 设置中添加 `dmc:write` 权限
2. 重新邀请机器人

#### ❌ Failed to resolve Discord application id

**原因**：中国大陆网络环境下 Discord API 连接问题

**解决**：
- 考虑使用代理
- 或使用 Telegram 作为主要通道

---

### Telegram 特有

#### ❌ 机器人不回复

**检查项**：
1. ✅ 是否已完成配对
2. ✅ Bot Token 是否正确
3. ✅ 守护进程是否运行：`openclaw status`

**解决**：
```bash
# 启动守护进程
openclaw daemon start

# 重启 Telegram 服务
openclaw service restart telegram
```

#### ❌ 群组消息不回复

**解决**：
1. @BotFather → /mybots → 选择机器人 → Bot Settings → Group Privacy → **Disable**
2. 在配置文件中启用：
```json
{
  "telegram": {
    "allowGroups": true
  }
}
```

#### ❌ 配对码过期

**解决**：直接将用户 ID 添加到配置：
```json
{
  "channels": {
    "telegram": {
      "allowFrom": ["你的UserID"]
    }
  }
}
```

#### ❌ 401 错误

**原因**：API Key 不正确

**解决**：检查 Bot Token 是否正确

---

## 配置参考

### 配置文件位置

- 本地：`~/.openclaw/openclaw.json`
- Docker：`/home/node/.openclaw/openclaw.json`

### Discord 配置示例

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "token": "YOUR_DISCORD_BOT_TOKEN",
      "serverId": "YOUR_SERVER_ID",
      "channelIds": ["YOUR_CHANNEL_ID"],
      "allowFrom": ["YOUR_USER_ID"]
    }
  }
}
```

### Telegram 配置示例

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "YOUR_TELEGRAM_BOT_TOKEN",
      "allowFrom": ["YOUR_USER_ID"],
      "allowGroups": false
    }
  }
}
```

---

## 诊断命令

```bash
# 查看状态
openclaw status

# 查看日志
openclaw logs --follow

# 完整诊断
openclaw doctor

# 重启网关
openclaw gateway restart
```

---

## 相关资源

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [Discord 开发者门户](https://discord.com/developers/applications)
- [Telegram BotFather](https://t.me/BotFather)
