# automation

## Channel
system

## Overview
OpenClaw automation issues (cron, heartbeat, scheduling).

## 常见问题

### Cron

| 病历号 | 问题 | 解决方案 |
|--------|------|----------|
| CRON-001 | Cron not firing | `openclaw cron status` → 检查 enabled 和 schedule |
| CRON-002 | Cron fired but no delivery | 检查 delivery mode 和 channel auth errors |
| CRON-003 | 定时错误 | 检查 timezone 配置 |
| CRON-004 | scheduler disabled | config/env 中禁用了 cron |
| CRON-005 | timer tick failed | scheduler tick 崩溃 → 检查日志 |
| CRON-006 | reason: not-due | 手动运行没加 `--force` |

### Heartbeat

| 病历号 | 问题 | 解决方案 |
|--------|------|----------|
| HB-001 | Heartbeat suppressed - quiet-hours | 检查 `activeHours` 配置 |
| HB-002 | requests-in-flight | 主线程忙，heartbeat 延迟 |
| HB-003 | empty-heartbeat-file | `HEARTBEAT.md` 无可执行内容 |
| HB-004 | 定时错误 | 检查 timezone 配置 |

## 诊断流程

1. 运行命令阶梯
```bash
openclaw status
openclaw gateway status
openclaw logs --follow
openclaw doctor
openclaw channels status --probe
```

2. Automation 检查
```bash
openclaw cron status
openclaw cron list
openclaw system heartbeat last
```

## 一键修复命令

```bash
openclaw status
openclaw gateway status
openclaw cron status
openclaw cron list
openclaw cron runs --id <jobId> --limit 20
openclaw system heartbeat last
openclaw logs --follow
```
