# 🏥 急诊科 - Emergency Skill

> 适用症状：Startup失败、Crash、无响应、连接Medium断

## 症状识别

Agent 出现以下情况时，需要急诊科Diagnosis：

- ❌ 无法Startup或连接 Gateway
- 💥 进程Crash或Abnormal退出
- ⏱️ 命令执行无响应
- 🔌 WebSocket/消息通道断开
- 🚨 报错 `ECONNREFUSED`、`ECONNRESET`、`Process exited`

---

## Diagnosis流程

### 步骤 1：检查 Gateway 状态

```bash
openclaw gateway status
```

**正常状态**：显示 `running` 或 `active`  
**Abnormal状态**：`stopped`、`failed`、或无响应

### 步骤 2：检查进程健康

```bash
# 检查进程是否存活
ps aux | grep openclaw

# 检查端口占用
lsof -i :3000  # 默认端口
lsof -i :8080  # 备用端口
```

### 步骤 3：查看Error Log

```bash
# 查看 Gateway 日志
openclaw gateway logs --tail 50

# 查看系统日志
log show --predicate 'process == "openclaw"' --last 5m
```

### 步骤 4：测试基础连接

```bash
# 测试 Gateway API
curl http://localhost:3000/health

# 测试消息发送
openclaw status
```

---

## Solution

### 方案 A：Gateway 未Startup

```bash
# Startup Gateway
openclaw gateway start

# 如果Startup失败，尝试重启
openclaw gateway restart
```

### 方案 B：端口被占用

```bash
# 查找占用进程
lsof -i :3000

# 杀掉占用进程
kill -9 <PID>

# 或者换端口Startup
openclaw gateway start --port 3001
```

### 方案 C：Config文件损坏

```bash
# 检查Config文件
cat ~/.openclaw/config.yaml

# 重置为默认Config
openclaw config reset

# 重新初始化
openclaw init
```

### 方案 D：权限Issue

```bash
# 检查权限
ls -la ~/.openclaw/

# 修复权限
chmod -R 755 ~/.openclaw/
```

### 方案 E：完全Crash恢复

```bash
# 停止所有进程
pkill -f openclaw

# 清理临时文件
rm -rf ~/.openclaw/tmp/*

# 重新Startup
openclaw gateway start

# 验证状态
openclaw gateway status
```

---

## 自检清单

Startup后，运行以下检查确认恢复：

- [ ] `openclaw gateway status` 显示 `running`
- [ ] `curl http://localhost:3000/health` 返回正常响应
- [ ] 能正常发送消息
- [ ] 无报错日志
- [ ] 进程 CPU/内存使用正常

```bash
# 一键自检
openclaw gateway status && curl -s http://localhost:3000/health && echo "✅ 急诊康复"
```

---

## 预防措施

1. **定期检查**：使用 cron 定期检查 Gateway 状态
2. **日志轮转**：Config日志文件大小限制
3. **资源监控**：监控 CPU/内存使用率
4. **自动重启**：Config故障自动重启

```bash
# Config自动重启 (crontab)
*/5 * * * * openclaw gateway status | grep -q running || openclaw gateway restart
```
