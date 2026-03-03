# OpenClaw 急诊科Problem清单

本文档列出 OpenClaw Startup、Crash、连接等紧急Problem的Solution。

---

## 目录

- [StartupProblem](#StartupProblem)
- [CrashProblem](#CrashProblem)
- [插件安装Problem](#插件安装Problem)
- [端口与进程Problem](#端口与进程Problem)
- [网络连接Problem](#网络连接Problem)
- [数据恢复Problem](#数据恢复Problem)

---

## StartupProblem

### Problem 1: TUI 运行后终端完全没有输出

**Severity**: High

**ProblemDescription**:
- TUI 运行后终端没有任何输出（无错误信息，也无正常显示内容）
- 但消息其实能收到（从日志里能看到 chat.history 请求）

**Environment**:
- OpenClaw版本: v2026.3.2
- 操作系统: Windows (PowerShell)

**Error Log**:
从 gateway 日志可以看到：
- TUI 进程在运行
- 发送了 chat.history 请求并收到响应
- 但终端没有任何显示

**Solution**:
1. 使用 webchat 客户端替代 TUI：
   ```
   openclaw gateway --port 18789
   # 然后访问 http://127.0.0.1:18789/
   ```
2. 或者回退到之前版本：
   ```
   npm uninstall openclaw -g
   npm install openclaw@2026.2.26 -g
   ```

**相关 Issue**: [#32900](https://github.com/openclaw/openclaw/issues/32900)

---

### Problem 2: Gateway Startup失败 - 端口被占用

**Severity**: Medium

**ProblemDescription**:
- Startup Gateway 时报错端口被占用
- `Error: listen EADDRINUSE`

**Solution**:
```
# 查找占用端口的进程
lsof -i :18789

# 杀掉占用进程
kill -9 <PID>

# 或更换端口Startup
openclaw gateway --port 18790
```

---

### Problem 3: Gateway Startup失败 - Config文件格式错误

**Severity**: High

**ProblemDescription**:
- JSON 解析失败
- Gateway Startup报错

**Solution**:
1. 验证 JSON 格式：
   ```
   cat ~/.openclaw/openclaw.json | python3 -m json.tool
   ```
2. 常见错误：
   - 缺少逗号
   - 多余逗号
   - 引号不匹配
   - 尾部逗号

---

### Problem 4: npm 全局安装路径Problem

**Severity**: Medium

**ProblemDescription**:
- `openclaw: command not found` 即使安装了
- npm 全局 bin 路径未添加到 PATH

**Solution**:
1. 检查 npm 全局 bin 路径：
   ```
   npm bin -g
   ```
2. 添加到 PATH（添加到 ~/.zshrc 或 ~/.bashrc）：
   ```
   export PATH="$(npm bin -g):$PATH"
   ```
3. 重新加载Config：
   ```
   source ~/.zshrc
   ```

---

## CrashProblem

### Problem 5: 进程Abnormal退出

**Severity**: High

**ProblemDescription**:
- Gateway 进程突然退出
- 日志显示 `Process exited`

**排查步骤**:
1. 检查日志：
   ```
   openclaw logs --tail 100
   ```
2. 检查系统资源：
   ```
   top -o %MEM
   ```
3. 检查 Node.js 进程：
   ```
   ps aux | grep node
   ```

**Solution**:
1. 确保分配至少 4GB 内存
2. 使用稳定版本而非 beta 版
3. 检查是否有插件冲突

---

### Problem 6: 进程假死 (无响应)

**Severity**: Medium

**ProblemDescription**:
- 命令执行无响应
- Gateway 看起来在运行但不处理请求

**Solution**:
```
# 检查进程状态
ps aux | grep openclaw

# 强制重启
pkill -f openclaw
openclaw gateway start
```

---

### Problem 7: OOM (内存溢出) Crash

**Severity**: High

**ProblemDescription**:
- 进程因内存不足被系统杀死
- dmesg 显示 OOM killer

**Solution**:
1. 增加系统内存或关闭其他应用
2. 限制 Gateway 内存使用：
   ```
   NODE_OPTIONS="--max-old-space-size=2048" openclaw gateway
   ```
3. 定期清理 session 文件

---

### Problem 8: Segmentation Fault

**Severity**: 严重

**ProblemDescription**:
- 进程Crash显示 segfault
- 通常由 native 模块引起

**Solution**:
1. 重新安装 native 模块：
   ```
   npm rebuild
   ```
2. 检查 Node.js 版本兼容性
3. 清除缓存重装：
   ```
   rm -rf node_modules
   npm install
   ```

---

## 插件安装Problem

### Problem 9: 插件安装失败 - Cannot find module

**Severity**: Medium

**ProblemDescription**:
- 插件安装成功但加载失败
- 错误: `Cannot find module 'zca-js'`

**Error Log**:
```
Error: Cannot find module 'zca-js'
Require stack:
- /home/user/.openclaw/extensions/zalouser/src/zca-client.ts
```

**Environment**:
- OpenClaw版本: 2026.3.2
- 操作系统: Debian

**Solution**:
1. 手动安装缺失的依赖：
   ```
   cd ~/.npm-global/lib/node_modules/openclaw
   npm install zca-js
   ```
2. 重启 Gateway：
   ```
   openclaw gateway restart
   ```

**相关 Issue**: [#32879](https://github.com/openclaw/openclaw/issues/32879)

---

### Problem 10: exec 插件安装失败

**Severity**: High

**ProblemDescription**:
- v2026.3.2 版本 exec 插件安装失败
- 提示 `package.json missing openclaw.extensions`

**Error Log**:
```
Config warnings:
- plugins.entries.exec: plugin not found: exec (stale config entry ignored; remove it from plugins config)
```

**Solution**:
1. 回退到之前版本：
   ```
   npm uninstall openclaw -g
   npm install openclaw@2026.2.26 -g
   ```
2. 清理旧Config：
   ```
   rm ~/.openclaw/openclaw.json.bak
   openclaw gateway restart
   ```

**相关 Issue**: [#32833](https://github.com/openclaw/openclaw/issues/32833)

---

### Problem 11: 插件依赖未自动安装

**Severity**: Medium

**ProblemDescription**:
- 插件安装时依赖未自动安装
- 导致插件加载失败

**Solution**:
```
# 手动安装插件依赖
cd ~/.openclaw/extensions/<plugin-name>
npm install

# 或重新安装插件
openclaw plugins install <plugin-name> --force
```

---

### Problem 12: 插件版本冲突

**Severity**: Medium

**ProblemDescription**:
- 多个插件依赖同一 npm 包的不同版本
- 导致加载失败

**Solution**:
1. 使用 npm dedupe：
   ```
   cd ~/.openclaw/extensions/<plugin-name>
   npm dedupe
   ```
2. 锁定插件版本

---

## 端口与进程Problem

### Problem 13: 同一机器运行多个 OpenClaw 实例

**Severity**: Low

**ProblemDescription**:
- 同一机器上运行多个 OpenClaw 实例
- 端口冲突

**Solution**:
```
# 第一个实例
openclaw gateway start --port 18789

# 第二个实例
openclaw gateway start --port 18790
```

**相关 Issue**: [#32897](https://github.com/openclaw/openclaw/issues/32897)

---

### Problem 14: Session 文件锁未释放

**Severity**: Medium

**ProblemDescription**:
- Session 文件锁未释放
- 导致 Agent 失败
- 进程死亡后锁变成 stale lock

**Solution**:
```
# 查找 stale locks
ls -la ~/.openclaw/sessions/*.lock

# 删除 stale locks
rm ~/.openclaw/sessions/*.lock

# 重启 Gateway
openclaw gateway restart
```

**相关 Issue**: [#32799](https://github.com/openclaw/openclaw/issues/32799)

---

## 网络连接Problem

### Problem 15: WebSocket 连接不稳定

**Severity**: Medium

**ProblemDescription**:
- WebSocket 断开连接
- 消息Loss

**Solution**:
```
# 重启 Gateway
openclaw gateway restart
```

**相关 Fix**: reset lastSeq on WebSocket reconnect (#32881)

---

### Problem 16: Telegram 消息Loss

**Severity**: Medium

**ProblemDescription**:
- systemd 重启时缓冲区消息Loss
- graceful shutdown 未正确处理

**Solution**:
等待 v2026.3.3 或更High版本修复

**相关 Fix**: drain buffered messages on graceful shutdown (#32876)

---

### Problem 17: 代理/防火墙导致连接失败

**Severity**: Medium

**ProblemDescription**:
- 通过代理或防火墙连接时失败
- 连接被重置或超时

**Solution**:
1. Config代理Environment变量：
   ```
   export HTTP_PROXY=http://proxy:8080
   export HTTPS_PROXY=http://proxy:8080
   ```
2. 检查防火墙规则
3. 使用 --proxy 参数（如果支持）

---

## 数据恢复Problem

### Problem 18: Session 数据恢复

**Severity**: Medium

**ProblemDescription**:
- Gateway Crash后需要恢复 Session 数据

**Solution**:
1. 检查 session 文件完整性：
   ```
   ls -la ~/.openclaw/sessions/
   ```
2. 使用备份恢复：
   ```
   openclaw sessions restore --from-backup
   ```
3. 手动恢复 JSON 文件

---

### Problem 19: Config回滚

**Severity**: Low

**ProblemDescription**:
- Config错误导致无法Startup
- 需要恢复到之前的工作Config

**Solution**:
1. 检查自动备份：
   ```
   ls -la ~/.openclaw/backups/
   ```
2. 恢复Config：
   ```
   cp ~/.openclaw/backups/openclaw.json.bak ~/.openclaw/openclaw.json
   ```
3. 重启 Gateway

---

## 快速Diagnosis清单

| 检查项 | 命令 |
|--------|------|
| Gateway 状态 | `openclaw gateway status` |
| 进程存活 | `ps aux \| grep openclaw` |
| 端口占用 | `lsof -i :18789` |
| 查看日志 | `openclaw logs --tail 50` |
| Diagnosis工具 | `openclaw doctor` |
| Config文件验证 | `cat ~/.openclaw/openclaw.json \| python3 -m json.tool` |

---

## 相关Config路径

- Config文件：`~/.openclaw/openclaw.json`
- 日志目录：`~/.openclaw/logs/`
- Session 目录：`~/.openclaw/sessions/`
- 插件目录：`~/.openclaw/extensions/`

---

*最后更新：2026-03-04*
