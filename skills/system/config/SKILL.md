# OpenClaw Config指南

本Skill用于管理和排查 OpenClaw ConfigIssue，包括Environment变量、Gateway 状态和节点管理。

## 核心Config概念

### 1. Environment变量优先级

OpenClaw 使用以下优先级（从High到Low）：
- 进程Environment变量
- 当前目录的 `.env` 文件
- 全局 `.env` 文件 (`~/.openclaw/.env`)
- `openclaw.json` Medium的 `env` Config块

**重要**：已存在的Environment变量不会被覆盖。

### 2. 主要Environment变量

| 变量名 | 说明 |
|--------|------|
| `OPENCLAW_HOME` | 覆盖主目录（默认 `~/.openclaw/`） |
| `OPENCLAW_STATE_DIR` | 覆盖状态目录 |
| `OPENCLAW_CONFIG_PATH` | 覆盖Config文件路径 |
| `OPENCLAW_GATEWAY_TOKEN` | Gateway 认证令牌 |
| `OPENCLAW_LOAD_SHELL_ENV` | 设为 `1` 从 shell 导入Environment变量 |

### 3. API 密钥管理

推荐使用Environment变量存储敏感信息：
- `OPENROUTER_API_KEY`
- `DISCORD_BOT_TOKEN`
- `TELEGRAM_BOT_TOKEN`

或在 `openclaw.json` Medium使用 `SecretRef` 对象：
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
openclaw status  # 包含通道和Model信息
```

### Startup/停止/重启
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

## 节点（Node）Config

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

### 节点Config文件
位置：`~/.openclaw/node.json`

## 初始化Config

推荐使用向导：
```bash
openclaw onboard --install-daemon
```

这将自动：
- Config认证信息
- 设置 Gateway
- Config可选通道
- 将 API 密钥Security存储到系统钥匙串

## 常见ConfigIssue解决

1. **Gateway 无法Startup**
   - 检查端口是否被占用：`lsof -i :18789`
   - 查看日志：`openclaw gateway run`（前台运行查看错误）
   - 确认 `.env` 文件存在且格式正确

2. **Environment变量不生效**
   - 确认变量名拼写正确
   - 检查优先级：进程Environment > .env > openclaw.json
   - 重启 Gateway：`openclaw gateway restart`

3. **节点无法连接**
   - 检查 Gateway 是否在运行
   - 确认网络连通性（ping/telnet）
   - 验证节点Config：`cat ~/.openclaw/node.json`
   - 重新生成节点：`openclaw node run --host ...`

4. **API 密钥Issue**
   - 使用 `openclaw onboard` 重新Config
   - 手动设置Environment变量后重启 Gateway
   - 检查密钥是否还有额度

## Config文件位置

- 主Config：`~/.openclaw/openclaw.json`
- Environment变量：`.env` 或 `~/.openclaw/.env`
- 节点Config：`~/.openclaw/node.json`
- 日志位置：取决于系统Config

## 相关命令速查

```bash
# Gateway
openclaw gateway status/start/stop/restart
openclaw dashboard          # 打开 Web 控制台

# 节点
openclaw nodes status
openclaw devices list/approve

# Config
openclaw onboard           # 初始化向导
openclaw status            # 全面状态检查

# 日志
# 查看系统日志或 OpenClaw 日志目录
```
