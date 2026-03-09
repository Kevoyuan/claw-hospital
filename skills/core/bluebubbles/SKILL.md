# bluebubbles

## Channel
bluebubbles (Core) - iMessage on macOS

## Overview
OpenClaw bluebubbles/iMessage integration.

## Configuration
```bash
openclaw config add bluebubbles
```

## 常见问题

| 病历号 | 问题 | 解决方案 |
|--------|------|----------|
| IM-001 | No inbound events | 验证 webhook/server 可达性和 app permissions |
| IM-002 | Can send but no receive on macOS | 检查 macOS privacy permissions → 重新授予 TCC permissions |
| IM-003 | openclaw: command not found | 添加 npm 到 PATH |
| IM-004 | Node.js 版本不对 | 需要 Node.js 22+ |
| IM-005 | "no gateway connected" | 检查 gateway 状态，清理僵尸进程 |
| IM-006 | macOS 兼容性 | 需要 macOS 15+ |
| IM-007 | Apple Silicon 问题 | 确保安装 ARM64 Node.js |
| IM-008 | iMessage bridge 不工作 | 授予 Full Disk Access / Accessibility 权限 |
| IM-009 | 设备未批准 | `openclaw devices approve <requestId>` |
| IM-010 | iMessage 未登录 | Messages app 需要登录 Apple ID |
| IM-011 | Gatekeeper 阻止 | 右键选择 "Open" 或在设置中允许 |
| IM-012 | 附件路径权限问题 | 手动复制附件到允许的目录 |
| IM-013 | 实时消息不推送 | 检查 gateway 处理实时推送 |
| IM-014 | Group chat 不路由 | 检查 groupPolicy 和 groups allowlist |

## 诊断流程

1. 检查 Node.js 版本 `node --version`
2. 安装 imsg `brew install steipete/tap/imsg`
3. 测试 `imsg chats --limit 3`
4. 检查设备 `openclaw devices list`

## 一键修复命令

```bash
node --version
brew install steipete/tap/imsg
imsg chats --limit 3
openclaw devices list
openclaw devices approve <requestId>
openclaw doctor --fix
```

## References
- OpenClaw Docs
