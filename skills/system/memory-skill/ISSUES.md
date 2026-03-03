# OpenClaw Memory科Problem清单

本文档列出 OpenClaw Agent Memory和上下文LossProblem的Solution。

---

## 目录

- [上下文LossProblem](#上下文LossProblem)
- [会话重置Problem](#会话重置Problem)
- [Memory存储Problem](#Memory存储Problem)
- [上下文溢出Problem](#上下文溢出Problem)

---

## 上下文LossProblem

### Problem 1: Agent 忘记对话历史

**Severity**: High

**ProblemDescription**:
- Agent 无法回忆之前的对话内容
- 用户提到之前讨论的内容时 Agent 表示不知道

**Environment**:
- OpenClaw版本: v2026.3.2

**排查步骤**:
1. 检查会话历史文件是否存在：
   ```
   ls -la ~/.openclaw/sessions/
   ```
2. 检查上下文是否被压缩
3. 查看日志Medium的上下文传递记录

**Solution**:
1. 使用 /compact 命令释放上下文空间（谨慎使用）
2. 检查内存分配是否足够
3. 重新加载历史上下文

---

### Problem 2: 重要信息被遗忘

**Severity**: High

**ProblemDescription**:
- 用户告知的重要信息在后续对话MediumLoss
- 需要反复提醒 Agent 相同的信息

**Solution**:
1. 将重要信息写入 MEMORY.md 文件
2. 在对话开始时提供完整上下文
3. 使用结构化提示词强调关键信息

---

### Problem 3: 跨会话Memory失效

**Severity**: Medium

**ProblemDescription**:
- 在新会话Medium无法获取之前会话的信息
- 每个会话都是独立的新开始

**Solution**:
1. 检查 AGENTS.md 和 MEMORY.md 是否存在
2. 使用长程Memory系统：
   ```
   openclaw memory enable
   ```
3. 手动传递关键上下文

---

## 会话重置Problem

### Problem 4: Session 意外重置

**Severity**: Medium

**ProblemDescription**:
- 会话突然被重置
- 对话历史全部Loss

**排查步骤**:
1. 检查 Gateway 是否Crash
2. 查看系统资源是否耗尽
3. 检查是否有内存泄漏

**Solution**:
1. 定期保存会话状态：
   ```
   openclaw sessions backup
   ```
2. 增加内存分配
3. 使用持久化存储

---

### Problem 5: Session ID 冲突

**Severity**: Low

**ProblemDescription**:
- 新会话使用了旧的 Session ID
- 导致上下文混淆

**Solution**:
1. 手动指定新的 Session ID
2. 清理旧会话文件：
   ```
   rm ~/.openclaw/sessions/*.json
   ```

---

## Memory存储Problem

### Problem 6: Memory文件损坏

**Severity**: Medium

**ProblemDescription**:
- MEMORY.md 或其他Memory文件无法读取
- 文件格式损坏

**Solution**:
1. 备份并重建Memory文件
2. 使用版本控制系统保护重要Memory
3. 定期备份到云端

---

### Problem 7: Memory不同步

**Severity**: Low

**ProblemDescription**:
- 多个Memory文件之间信息不一致
- AGENTS.md 和 MEMORY.md 内容冲突

**Solution**:
1. 统一Memory存储位置
2. 定期同步和整理Memory文件
3. 建立Memory更新规范

---

## 上下文溢出Problem

### Problem 8: 上下文超出限制

**Severity**: High

**ProblemDescription**:
- 对话太长导致上下文溢出
- Agent 开始产生乱码或重复内容

**Error Log**:
```
Error: Context length exceeded
Max tokens: 128000
```

**Solution**:
1. 使用 /compact 压缩上下文
2. 将长对话拆分为多个短对话
3. 启用自动摘要功能：
   ```json
   {
     "memory": {
       "autoCompact": true,
       "compactThreshold": 80000
     }
   }
   ```

---

### Problem 9: Token 计算错误

**Severity**: Low

**ProblemDescription**:
- 上下文大小显示不准确
- 实际 token 数与显示不符

**Solution**:
1. 更新到最新版本
2. 使用外部工具验证 token 数量
3. 等待官方修复

---

## 快速Diagnosis清单

| 检查项 | 命令 |
|--------|------|
| 会话列表 | `openclaw sessions list` |
| 上下文大小 | `openclaw context size` |
| 内存使用 | `top -o %MEM` |
| 查看日志 | `openclaw logs --tail 50` |
| Diagnosis工具 | `openclaw doctor` |

---

## 调试命令

```bash
# 查看当前上下文
openclaw context show

# 压缩上下文
openclaw compact

# 导出Memory
openclaw memory export

# 导入Memory
openclaw memory import
```

---

## 相关Config路径

- Config文件：`~/.openclaw/openclaw.json`
- Session 目录：`~/.openclaw/sessions/`
- Memory文件：`~/.openclaw/workspace/MEMORY.md`
- Memory文件：`~/.openclaw/workspace/memory/`

---

*最后更新：2026-03-04*
