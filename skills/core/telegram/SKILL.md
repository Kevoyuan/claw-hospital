# telegram

## Channel
telegram (Core)

## Overview
OpenClaw telegram integration.

## Configuration
```bash
openclaw config add telegram
```

## 常见问题

| 病历号 | 问题 | 解决方案 |
|--------|------|----------|
| TG-001 | Cron announce 模式消息不发送 | High | Open |
| TG-002 | Auto-compaction 删除已发送消息 | Medium | Open |
| TG-003 | DM 需要配对批准 | `openclaw pairing pending` 批准 |
| TG-004 | Group 只响应提及 | 关闭 BotFather Group Privacy 或配置 requireMention |
| TG-005 | User ID 不在 allowlist | 检查 "drop dm (not in allowlist)" 日志 |
| TG-006 | Bot Token 错误 (401) | 验证 token，只有一个实例使用 |
| TG-007 | (no output) 阻塞 | 在 Telegram 发一条消息解封 |
| TG-008 | 网络延迟/服务器过载 | 检查 CPU/RAM，优化代码 |
| TG-009 | DNS/IPv6 路由问题 | 修复到 api.telegram.org 的网络 |
| TG-010 | Gateway 在睡眠设备上 | 在常开设备上运行 |
| TG-011 | API Key 无效/额度用尽 | 检查 logs 中的 API 错误 |
| TG-012 | Context window 超限 | 减少 workspace 文件，使用大 context 模型 |
| TG-013 | 模型流式输出 bug (Qwen) | 尝试其他模型或设置 stream: false |
| TG-014 | 多个进程冲突 | 确保只有一个 gateway 进程连接 |
| TG-015 | 遗留安装干扰 | 清理旧 Moltbot/Clawdbot 文件 |

## 诊断流程

1. 运行 `openclaw logs --follow` 查看日志
2. 检查 "drop" 关键词
3. 运行 `openclaw pairing pending`

## 一键修复命令

```bash
openclaw logs --follow
openclaw pairing pending
openclaw channels status --probe
openclaw doctor --fix
```

## References
- OpenClaw Docs
