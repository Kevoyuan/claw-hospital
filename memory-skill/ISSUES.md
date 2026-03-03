# OpenClaw 记忆科问题列表 (ISSUES.md)

本文档记录 OpenClaw 记忆系统使用过程中遇到的常见问题及解决方案。

---

## 📌 目录

1. [文件丢失问题](#文件丢失问题)
2. [权限问题](#权限问题)
3. [上下文丢失问题](#上下文丢失问题)
4. [配置问题](#配置问题)
5. [备份与恢复问题](#备份与恢复问题)

---

## 文件丢失问题

### 🔴 Issue #M001: memory 文件不存在

**严重程度**: 高

**症状**:
- 新会话无法读取之前的对话
- 提示 `memory/XXXX-XX-XX.md` 文件不存在

**原因**:
- memory 目录未创建
- 文件被删除或移动

**解决方案**:
```bash
# 创建 memory 目录
mkdir -p ~/workspace/memory

# 创建今日 memory 文件
touch ~/workspace/memory/$(date +%Y-%m-%d).md
```

---

### 🔴 Issue #M002: MEMORY.md 内容为空

**严重程度**: 中

**症状**:
- Agent 不记得之前的长期记忆
- `cat ~/workspace/MEMORY.md` 显示为空

**原因**:
- 文件被意外清空
- 首次运行未初始化

**解决方案**:
```bash
# 重建 MEMORY.md
cat > ~/workspace/MEMORY.md << 'EOF'
# MEMORY.md - Your Long-Term Memory

*精选值得长期记住的重要信息、决策和教训。*

## 用户信息
- 姓名: (请补充)
- 偏好: (请补充)

## 重要事项
- (添加重要信息)

## 教训
- (记录学习到的教训)
EOF
```

---

### 🔴 Issue #M003: 昨日 memory 文件找不到

**严重程度**: 中

**症状**:
- 需要参考昨天的事情但找不到文件
- `memory/2026-03-02.md` 不存在

**原因**:
- 昨天没有创建 memory 文件
- 文件名日期格式错误

**解决方案**:
```bash
# 检查实际存在的文件
ls ~/workspace/memory/

# 手动创建缺失的文件
touch ~/workspace/memory/2026-03-02.md
```

---

## 权限问题

### 🟠 Issue #M101: memory 文件无读取权限

**严重程度**: 高

**症状**:
- `cat memory/XXXX-XX-XX.md` 权限被拒绝
- Agent 无法读取 memory

**原因**:
- 文件权限设置不正确
- umask 限制过严

**解决方案**:
```bash
# 检查当前权限
ls -la ~/workspace/memory/

# 修复权限
chmod 755 ~/workspace/memory/
chmod 644 ~/workspace/memory/*.md

# 如果目录也不存在，创建并设置权限
mkdir -p ~/workspace/memory
chmod 755 ~/workspace/memory
```

---

### 🟠 Issue #M102: workspace 目录权限不足

**严重程度**: 高

**症状**:
- 无法创建新文件
- 提示权限被拒绝

**解决方案**:
```bash
# 检查 workspace 权限
ls -la ~/

# 修复 workspace 权限
chmod 755 ~/
chmod 755 ~/workspace
```

---

## 上下文丢失问题

### 🟡 Issue #M201: 跨会话记忆丢失

**严重程度**: 高

**症状**:
- 每个新会话 Agent 都像第一次见面
- 不记得用户的名字、偏好

**原因**:
- AGENTS.md 未正确配置 memory 加载
- 每次会话都是全新启动

**解决方案**:
在 `AGENTS.md` 中确保包含 memory 加载步骤：

```markdown
## Every Session

Before doing anything else:

1. Read `SOUL.md` — this is who you are
2. Read `USER.md` — this is who you're helping
3. Read `memory/YYYY-MM-DD.md` (today + yesterday)
4. Read `MEMORY.md` — your curated memories
```

---

### 🟡 Issue #M202: 只记得当前会话，不记得之前

**严重程度**: 中

**症状**:
- 只记得本次会话中说的内容
- 更早的对话完全忘记

**原因**:
- 只读取了今日 memory，未读取历史
- memory 文件内容被覆盖

**解决方案**:
```bash
# 检查 AGENTS.md 是否读取多个 memory 文件
grep -A5 "memory" ~/workspace/AGENTS.md

# 应包含读取 yesterday 的逻辑
# 如: Read memory/YYYY-MM-DD.md (today + yesterday)
```

---

### 🟡 Issue #M203: 心跳检查后记忆丢失

**严重程度**: 低

**症状**:
- 每次心跳后 Agent 似乎重新初始化
- 上下文被重置

**原因**:
- 会话状态未正确持久化
- 每次 heartbeat 触发新会话

**解决方案**:
```bash
# 检查 heartbeat 配置
cat ~/workspace/HEARTBEAT.md

# 确保没有"新会话"相关配置
```

---

## 配置问题

### 🟢 Issue #M301: AGENTS.md 中未定义 memory 路径

**严重程度**: 中

**症状**:
- Agent 不知道从哪里读取 memory
- 提示找不到 memory 文件

**解决方案**:
在 AGENTS.md 中明确指定路径：

```markdown
## 路径定义

- **Memory 目录**: `~/workspace/memory/`
- **长期记忆**: `~/workspace/MEMORY.md`
- **格式**: `memory/YYYY-MM-DD.md`
```

---

### 🟢 Issue #M302: 日期格式不正确

**严重程度**: 低

**症状**:
- memory 文件名格式混乱
- 无法自动匹配今日文件

**原因**:
- 手动创建时使用了错误格式

**解决方案**:
使用标准格式 `YYYY-MM-DD`:
```bash
# 正确格式
touch memory/2026-03-03.md

# 错误格式 (不要使用)
touch memory/2026.3.3.md
touch memory/today.md
```

---

## 备份与恢复问题

### 🔴 Issue #M401: 需要恢复误删的 memory

**严重程度**: 高

**症状**:
- memory 文件被删除
- 重要信息丢失

**解决方案**:
```bash
# 1. 检查是否有 git 版本控制
cd ~/workspace
git status memory/

# 2. 从 git 恢复
git checkout HEAD -- memory/

# 3. 或从时间机器恢复 (macOS)
tmutil listbackups
tmutil restore /Volumes/TimeMachine/Backups/.../memory/2026-03-03.md
```

---

### 🟠 Issue #M402: 备份脚本不工作

**严重程度**: 中

**症状**:
- crontab 备份未执行
- 没有生成备份文件

**解决方案**:
```bash
# 检查 crontab 配置
crontab -l

# 测试备份脚本
~/scripts/backup-memory.sh

# 确保脚本有执行权限
chmod +x ~/scripts/backup-memory.sh
```

---

### 🟠 Issue #M403: 备份占用太多空间

**严重程度**: 低

**症状**:
- 备份目录越来越大
- 磁盘空间不足

**解决方案**:
```bash
# 清理 30 天前的旧备份
find ~/backups -name "memory-*.tar.gz" -mtime +30 -delete

# 或使用压缩备份
tar -czf memory-backup.tar.gz memory/ --exclude='*.tmp'
```

---

## 调试命令

```bash
# 检查 memory 目录状态
ls -la ~/workspace/memory/

# 查看今日 memory
cat ~/workspace/memory/$(date +%Y-%m-%d).md

# 查看长期记忆
cat ~/workspace/MEMORY.md

# 检查 AGENTS.md 配置
grep -i memory ~/workspace/AGENTS.md

# 测试 memory 加载
openclaw chat "我之前告诉你我的名字是什么？"
```

---

## 预防措施

1. **启用 git 版本控制**: 将 memory 目录加入版本控制
2. **定期备份**: 使用 crontab 每日自动备份
3. **关键信息冗余**: 重要信息同时写入 MEMORY.md
4. **监控权限**: 定期检查文件权限

---

## 相关文件

- `~/workspace/memory/` - 每日记忆目录
- `~/workspace/MEMORY.md` - 长期记忆
- `~/workspace/AGENTS.md` - Agent 配置
- `~/workspace/USER.md` - 用户信息

---

*最后更新：2026-03-03*
