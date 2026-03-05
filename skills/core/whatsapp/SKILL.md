# whatsapp

## Channel
whatsapp (Core)

## Overview
OpenClaw whatsapp integration.

## Configuration
```bash
openclaw config add whatsapp
```

## 诊断流程

1. 运行 `wacli doctor` 检查连接状态
2. 检查 AUTHENTICATED 状态
3. 验证 webhook 配置

## 解决方案

运行 `wacli auth` 扫码登录

检查 ~/.wacli 目录权限

检查 API Key 配置

确认 WhatsApp Business API 状态

验证 webhook URL 可访问

## References
