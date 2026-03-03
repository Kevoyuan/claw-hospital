# OpenClaw 配置指南

本技能用于管理和排查 OpenClaw 配置问题，包括环境变量、Gateway 状态和节点管理。

## 核心配置概念

### 1. 环境变量优先级

OpenClaw 使用以下优先级（从高到低）：
- 进程环境变量
- 当前目录的 `.env` 文件
- 全局 `.env` 文件 (`~/.openclaw/.env`)
- `openclaw.json` 中的 `env` 配置块

**重要**：已存在的环境变量不会被覆盖。

### 2. 主要环境变量

| 变量名 | 说明 |
|--------|------|
| `OPENCLAW_HOME` | 覆盖主目录（默认 `~/.openclaw/`） |
| `OPENCLAW_STATE_DIR` | 覆盖状态目录 |
| `OPENCLAW_CONFIG_PATH` | 覆盖配置文件路径 |
| `OPENCLAW_GATEWAY_TOKEN` | Gateway 认证令牌 |
| `OPENCLAW_LOAD_SHELL_ENV` | 设为 `1` 从 shell 导入环境变量 |

### 3. API 密钥管理

推荐使用环境变量存储敏感信息：
- `OPENROUTER_API_KEY`
- `DISCORD_BOT_TOKEN`
- `TELEGRAM_BOT_TOKEN`

或在 `openclaw.json` 中使用 `SecretRef` 对象：
```json
{
  "source": "env",
  "provider": "default",
  "id": "VAR_NAME"
}
```

## Gateway 管理命令

### 状态检查
```bash
openclaw gateway status
openclaw status  # 包含通道和模型信息
```

### 启动/停止/重启
```bash
openclaw gateway start
openclaw gateway stop
openclaw gateway restart

# macOS launchctl
launchctl stop openclaw
launchctl start openclaw

# Linux systemd
systemctl --user stop openclaw-gateway
systemctl --user restart openclaw-gateway
```

### 开发模式
```bash
openclaw gateway run
openclaw gateway --port 18789
```

### 访问控制台
- 本地访问：`http://127.0.0.1:18789/`
- 远程访问：使用 SSH 隧道
  ```bash
  ssh -N -L 18789:127.0.0.1:18789 user@gateway-host
  ```

## 节点（Node）配置

### 设置远程节点
```bash
openclaw node run --host <gateway-host> --port 18789 --display-name "节点名称"
```

### 批准节点
```bash
openclaw devices list          # 查看待批准设备
openclaw devices approve <requestId>
openclaw nodes status         # 查看节点状态
```

### 节点配置文件
位置：`~/.openclaw/node.json`

## 初始化配置

推荐使用向导：
```bash
openclaw onboard --install-daemon
```

这将自动：
- 配置认证信息
- 设置 Gateway
- 配置可选通道
- 将 API 密钥安全存储到系统钥匙串

## 常见配置问题解决

1. **Gateway 无法启动**
   - 检查端口是否被占用：`lsof -i :18789`
   - 查看日志：`openclaw gateway run`（前台运行查看错误）
   - 确认 `.env` 文件存在且格式正确

2. **环境变量不生效**
   - 确认变量名拼写正确
   - 检查优先级：进程环境 > .env > openclaw.json
   - 重启 Gateway：`openclaw gateway restart`

3. **节点无法连接**
   - 检查 Gateway 是否在运行
   - 确认网络连通性（ping/telnet）
   - 验证节点配置：`cat ~/.openclaw/node.json`
   - 重新生成节点：`openclaw node run --host ...`

4. **API 密钥问题**
   - 使用 `openclaw onboard` 重新配置
   - 手动设置环境变量后重启 Gateway
   - 检查密钥是否还有额度

## 配置文件位置

- 主配置：`~/.openclaw/openclaw.json`
- 环境变量：`.env` 或 `~/.openclaw/.env`
- 节点配置：`~/.openclaw/node.json`
- 日志位置：取决于系统配置

## 相关命令速查

```bash
# Gateway
openclaw gateway status/start/stop/restart
openclaw dashboard          # 打开 Web 控制台

# 节点
openclaw nodes status
openclaw devices list/approve

# 配置
openclaw onboard           # 初始化向导
openclaw status            # 全面状态检查

# 日志
# 查看系统日志或 OpenClaw 日志目录
```
