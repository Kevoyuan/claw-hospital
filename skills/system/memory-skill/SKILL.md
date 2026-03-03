# 🧬 记忆科 - Memory Skill

> 适用症状：健忘、上下文丢失、忘记之前对话、不记得用户信息

## 症状识别

Agent 出现以下情况时，需要记忆科诊断：

- 😕 不记得之前的对话
- 📝 用户信息丢失（名字、偏好等）
- 📋 忘记之前完成的任务
- 🔄 需要重复告诉它已知的信息
- ❌ 上下文无法跨会话保留
- 🗄️ memory 文件内容丢失

---

## 诊断流程

### 步骤 1：检查 memory 文件

```bash
# 检查今日 memory
ls -la ~/workspace/memory/

# 查看 memory 文件内容
cat ~/workspace/memory/$(date +%Y-%m-%d).md

# 查看长期记忆
cat ~/workspace/MEMORY.md
```

### 步骤 2：检查文件完整性

```bash
# 检查 workspace 文件
ls -la ~/workspace/*.md

# 检查最近修改时间
stat ~/workspace/MEMORY.md
```

### 步骤 3：检查 Agent 启动状态

```bash
# 查看启动日志
openclaw logs --startup

# 检查是否加载了 memory
grep -i memory ~/workspace/AGENTS.md
```

### 步骤 4：测试记忆功能

```bash
# 询问已存储的信息
openclaw chat "我之前告诉你我的名字是什么？"
```

---

## 解决方案

### 方案 A：恢复 memory 文件

```bash
# 检查是否有备份
ls -la ~/workspace/.backup/

# 从备份恢复
cp ~/workspace/.backup/memory/$(date +%Y-%m-%d).md ~/workspace/memory/
```

### 方案 B：手动重建记忆

根据 `USER.md` 和最近对话重建：

```bash
# 重新创建今日 memory
cat > ~/workspace/memory/$(date +%Y-%m-%d).md << 'EOF'
# Daily Notes - 2026-03-03

## Events
- [重建] Agent 记忆系统恢复

## Notes
- 用户: Kevo
- 主要任务: ...
EOF
```

### 方案 C：修复权限问题

```bash
# 检查 memory 目录权限
ls -la ~/workspace/memory/

# 修复权限
chmod 755 ~/workspace/memory/
chmod 644 ~/workspace/memory/*.md
```

### 方案 D：配置自动加载

在 `AGENTS.md` 中确保正确的 memory 加载：

```markdown
## Every Session

1. Read `SOUL.md`
2. Read `USER.md`
3. Read `RECENT_EVENTS.md`
4. Read `memory/YYYY-MM-DD.md`
5. Read `MEMORY.md`
```

### 方案 E：导出/导入记忆

```bash
# 导出所有记忆
tar -czf memory-backup.tar.gz ~/workspace/memory/ ~/workspace/MEMORY.md

# 导入记忆
tar -xzf memory-backup.tar.gz -C ~/
```

---

## 自检清单

恢复后，运行以下检查：

- [ ] memory 文件存在且可读
- [ ] 之前的对话记录可查询
- [ ] 用户信息已恢复
- [ ] 新会话能读取历史
- [ ] MEMORY.md 内容完整

```bash
# 一键自检
ls ~/workspace/memory/ && cat ~/workspace/MEMORY.md | head -20 && echo "✅ 记忆恢复"
```

---

## 预防措施

1. **定期备份**：每日自动备份 memory 文件
2. **版本控制**：使用 git 管理 memory 目录
3. **关键信息冗余**：重要信息同时写入多个文件
4. **监控权限**：定期检查文件权限

```bash
# 自动备份 (crontab)
0 0 * * * tar -czf ~/backups/memory-$(date +\%Y\%m\%d).tar.gz ~/workspace/memory/ ~/workspace/MEMORY.md

# 每周清理旧备份
0 1 * * 0 find ~/backups -name "memory-*.tar.gz" -mtime +30 -delete
```

---

## 常见病因

| 症状 | 可能原因 | 解决方案 |
|------|----------|----------|
| 忘记对话 | memory 文件损坏 | 恢复备份 |
| 用户信息丢失 | USER.md 被覆盖 | 重建 USER.md |
| 上下文丢失 | 会话未持久化 | 检查存储 |
| 新会话健忘 | 未加载 memory | 修复 AGENTS.md |
