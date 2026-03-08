# discord

## Channel
discord (Core)

## Overview
OpenClaw discord integration.

## Configuration
```bash
openclaw config add discord
```

## Common Issues
See ISSUES.md

## 一键修复命令

### 诊断
```bash
openclaw doctor
openclaw channels status discord
```

### 修复 Bot 权限
```bash
# 重新配置 Discord
openclaw config set channels.discord.enabled true
# 重启 Gateway
openclaw gateway restart
```

### 检查 Bot 状态
```bash
openclaw channels status
```

## References
- OpenClaw Docs
