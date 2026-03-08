# crash

## Channel
system

## Overview
System crash and hang issues.

## 解决方案

```bash
tail -100 /tmp/openclaw/openclaw-2026-03-05.log
```

```bash
openclaw gateway restart
```

```bash
ps aux | grep openclaw
```

```bash
lsof -i :3000
```
