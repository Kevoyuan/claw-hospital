# crash

## Channel
system

## Overview
System crash and hang issues.

## 常见问题

| Case ID | Issue | Solution |
|---------|-------|----------|
| CRASH-001 | Gateway crashes due to port conflicts | Check and free port 7331, delete stale PID lock file |
| CRASH-002 | Crashes due to corrupted config files | Run `openclaw doctor` to diagnose and fix |
| CRASH-003 | "unsupported schema node" error | Check config file syntax and invalid keys |
| CRASH-004 | Agent hangs/crashes/stops responding | Check plugins, enable debug mode |
| CRASH-005 | Too many models or mixing providers causes unpredictable behavior | Simplify fallback list, unify provider |

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

## 一键修复命令

```bash
openclaw doctor
openclaw gateway restart
openclaw status
ps aux | grep openclaw
lsof -i :18789
```
