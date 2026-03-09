# whatsapp

## Channel
whatsapp (Core)

## Overview
OpenClaw whatsapp integration.

## Configuration
```bash
openclaw config add whatsapp
```

## 常见问题

| 病历号 | 问题 | 解决方案 |
|--------|------|----------|
| WA-001 | Connected but no DM replies | `openclaw pairing list whatsapp` → 批准发件人或调整 DM policy |
| WA-002 | Group messages ignored | 检查 `requireMention` + 提及模式配置 |
| WA-003 | Random disconnect/relogin loops | 重新登录验证凭证目录健康 |
| WA-004 | QR Code 过期 | 重新运行 `openclaw whatsapp pair` |
| WA-005 | 连接但不回复 | 检查 gateway / logs / dmPolicy / model 配置 |
| WA-006 | 一直要求登录 | 检查凭证权限 / 确保同一用户运行 |
| WA-007 | Credential Store 膨胀 (1000+ 文件) | 清理 ~/.openclaw/credentials/whatsapp/ 或重新链接 |
| WA-008 | 多设备冲突 | WhatsApp 只能一个 Web/Desktop 连接 |
| WA-009 | 30 分钟 Watchdog bug | 定期发送 keepalive 消息 |
| WA-010 | 重连时丢消息 | 3-5 秒重连窗口期间可能丢失 |

## 诊断流程

1. 运行 `openclaw status` 检查连接状态
2. 运行 `openclaw channels status --probe` 检查通道
3. 运行 `openclaw pairing list whatsapp` 检查配对

## 一键修复命令

```bash
openclaw status
openclaw channels status --probe
openclaw pairing list whatsapp
openclaw whatsapp pair
openclaw gateway restart
```

## References
