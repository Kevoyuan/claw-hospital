# crash

## Channel
system

## Overview
System crash and hang issues.

## 解决方案

检查日志: `tail -100 /tmp/openclaw/openclaw-2026-03-05.log`

重启 Gateway: `openclaw gateway restart`

检查进程: `ps aux | grep openclaw`

检查端口: `lsof -i :3000`
