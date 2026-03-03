# OpenClaw 急诊科问题清单

本文档列出 OpenClaw 启动、崩溃、连接等紧急问题的解决方案。

---

## 目录

- [启动问题](#启动问题)
- [崩溃问题](#崩溃问题)
- [插件安装问题](#插件安装问题)
- [端口与进程问题](#端口与进程问题)
- [网络连接问题](#网络连接问题)

---

## 启动问题

### 问题 1: TUI 运行后终端完全没有输出

**严重程度**: 高

**问题描述**:
- TUI 运行后终端没有任何输出（无错误信息，也无正常显示内容）
- 但消息其实能收到（从日志里能看到 chat.history 请求）

**环境**:
- OpenClaw版本: v2026.3.2
- 操作系统: Windows (PowerShell)

**错误日志**:
从 gateway 日志可以看到：
- TUI 进程在运行
- 发送了 chat.history 请求并收到响应
- 但终端没有任何显示

**解决方案**:
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

### 问题 2: Gateway 启动失败 - 端口被占用

**严重程度**: 中

**问题描述**:
- 启动 Gateway 时报错端口被占用
- `Error: listen EADDRINUSE`

**解决方案**:
```
# 查找占用端口的进程
lsof -i :18789

# 杀掉占用进程
kill -9 <PID>

# 或更换端口启动
openclaw gateway --port 18790
```

---

### 问题 3: Gateway 启动失败 - 配置文件格式错误

**严重程度**: 高

**问题描述**:
- JSON 解析失败
- Gateway 启动报错

**解决方案**:
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

## 崩溃问题

### 问题 4: 进程异常退出

**严重程度**: 高

**问题描述**:
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

**解决方案**:
1. 确保分配至少 4GB 内存
2. 使用稳定版本而非 beta 版
3. 检查是否有插件冲突

---

### 问题 5: 进程假死 (无响应)

**严重程度**: 中

**问题描述**:
- 命令执行无响应
- Gateway 看起来在运行但不处理请求

**解决方案**:
```
# 检查进程状态
ps aux | grep openclaw

# 强制重启
pkill -f openclaw
openclaw gateway start
```

---

## 插件安装问题

### 问题 6: 插件安装失败 - Cannot find module

**严重程度**: 中

**问题描述**:
- 插件安装成功但加载失败
- 错误: `Cannot find module 'zca-js'`

**错误日志**:
```
Error: Cannot find module 'zca-js'
Require stack:
- /home/user/.openclaw/extensions/zalouser/src/zca-client.ts
```

**环境**:
- OpenClaw版本: 2026.3.2
- 操作系统: Debian

**解决方案**:
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

### 问题 7: exec 插件安装失败

**严重程度**: 高

**问题描述**:
- v2026.3.2 版本 exec 插件安装失败
- 提示 `package.json missing openclaw.extensions`

**错误日志**:
```
Config warnings:
- plugins.entries.exec: plugin not found: exec (stale config entry ignored; remove it from plugins config)
```

**解决方案**:
1. 回退到之前版本：
   ```
   npm uninstall openclaw -g
   npm install openclaw@2026.2.26 -g
   ```
2. 清理旧配置：
   ```
   rm ~/.openclaw/openclaw.json.bak
   openclaw gateway restart
   ```

**相关 Issue**: [#32833](https://github.com/openclaw/openclaw/issues/32833)

---

### 问题 8: 插件依赖未自动安装

**严重程度**: 中

**问题描述**:
- 插件安装时依赖未自动安装
- 导致插件加载失败

**解决方案**:
```
# 手动安装插件依赖
cd ~/.openclaw/extensions/<plugin-name>
npm install

# 或重新安装插件
openclaw plugins install <plugin-name> --force
```

---

## 端口与进程问题

### 问题 9: 同一机器运行多个 OpenClaw 实例

**严重程度**: 低

**问题描述**:
- 同一机器上运行多个 OpenClaw 实例
- 端口冲突

**解决方案**:
```
# 第一个实例
openclaw gateway start --port 18789

# 第二个实例
openclaw gateway start --port 18790
```

**相关 Issue**: [#32897](https://github.com/openclaw/openclaw/issues/32897)

---

### 问题 10: Session 文件锁未释放

**严重程度**: 中

**问题描述**:
- Session 文件锁未释放
- 导致 Agent 失败
- 进程死亡后锁变成 stale lock

**解决方案**:
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

## 网络连接问题

### 问题 11: WebSocket 连接不稳定

**严重程度**: 中

**问题描述**:
- WebSocket 断开连接
- 消息丢失

**解决方案**:
```
# 重启 Gateway
openclaw gateway restart
```

**相关 Fix**: reset lastSeq on WebSocket reconnect (#32881)

---

### 问题 12: Telegram 消息丢失

**严重程度**: 中

**问题描述**:
- systemd 重启时缓冲区消息丢失
- graceful shutdown 未正确处理

**解决方案**:
等待 v2026.3.3 或更高版本修复

**相关 Fix**: drain buffered messages on graceful shutdown (#32876)

---

## 快速诊断清单

| 检查项 | 命令 |
|--------|------|
| Gateway 状态 | `openclaw gateway status` |
| 进程存活 | `ps aux \| grep openclaw` |
| 端口占用 | `lsof -i :18789` |
| 查看日志 | `openclaw logs --tail 50` |
| 诊断工具 | `openclaw doctor` |
| 配置文件验证 | `cat ~/.openclaw/openclaw.json \| python3 -m json.tool` |

---

## 相关配置路径

- 配置文件：`~/.openclaw/openclaw.json`
- 日志目录：`~/.openclaw/logs/`
- Session 目录：`~/.openclaw/sessions/`
- 插件目录：`~/.openclaw/extensions/`

---

*最后更新：2026-03-03*
