# discord

## Channel
discord (Core)

## Overview
OpenClaw discord integration.

## Configuration
```bash
openclaw config add discord
```

## 常见问题

| 病历号 | 问题 | 解决方案 |
|--------|------|----------|
| DC-001 | Bot online 但无 guild replies | `openclaw channels status --probe` → 允许 guild/channel |
| DC-002 | Group messages ignored | 检查 mention gating → 提及 bot 或设置 `requireMention: false` |
| DC-003 | DM replies missing | `openclaw pairing list discord` → 批准 DM pairing |
| DC-004 | Bot Online 但不回复 | 检查 Message Content Intent / requireMention / DM pairing |
| DC-005 | Gateway 错误 1006/1008 | 禁用插件 / 修复配置 / 检查 corrupted openclaw.json |
| DC-006 | Bot 显示 Offline | 检查 token / 确认已添加到 server / Gateway 状态 |
| DC-007 | "Failed to resolve Discord application id" | 清理旧凭证 / 验证 token / 检查网络 |
| DC-008 | Bot online but not replying in server channels | 1. Requires @mention in server channels<br>2. Check permissions (Send Messages, Read Message History)<br>3. Confirm sender ID is in approved list |
| DC-009 | Regression after 2026.2.13/2.23: guild messages not received or outbound replies silently dropped | Rollback or wait for fix |
| DC-010 | Missing "Message Content Intent" | Enable in Discord Developer Portal |

## 一键修复命令

```bash
openclaw status
openclaw status --all
openclaw channels status --probe
openclaw channels status discord
openclaw doctor --fix
openclaw gateway restart
```

## References
- OpenClaw Docs
