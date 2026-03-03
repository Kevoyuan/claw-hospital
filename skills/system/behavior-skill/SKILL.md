# 🎭 Behavior科 - Behavior Skill

> 适用症状：摸鱼、拒绝工作、消极怠工、不执行任务、过度谨慎

## 症状识别

Agent 出现以下情况时，需要Behavior科Diagnosis：

- 🦥 不执行任务（说"好的"但不动）
- 🚫 拒绝执行（过度谨慎、担心权限）
- 😴 响应缓慢或超时
- 🤐 过度保守（任何事都要确认）
- 🙈 逃避任务（转移话题、装傻）
- 💤 心跳无响应（HEARTBEAT 无回复）

---

## Diagnosis流程

### 步骤 1：检查任务队列

```bash
# 查看待执行任务
openclaw tasks list

# 查看任务历史
openclaw tasks history
```

### 步骤 2：检查心跳状态

```bash
# 手动触发心跳
openclaw heartbeat

# 检查心跳Config
cat ~/workspace/HEARTBEAT.md
```

### 步骤 3：检查工作意愿

观察 Agent Behavior：
- 是否回复但不动？
- 是否过度询问确认？
- 是否找借口推脱？

### 步骤 4：检查工具可用性

```bash
# 列出可用工具
openclaw tools list

# 测试工具权限
openclaw tools test write
```

### 步骤 5：检查日志

```bash
# 查看最近活动
openclaw logs --recent 20

# 查看拒绝记录
openclaw logs --denied
```

---

## Solution

### 方案 A：明确任务指令

如果 Agent 不知道做什么，提供**具体**指令：

```
# ❌ 模糊指令
"帮我看看有什么"

# ✅ 清晰指令
"列出 /workspace 目录的文件，并告诉我有哪些 .md 文件"
```

### 方案 B：设置明确的边界

在 `AGENTS.md` Medium定义工作范围：

```markdown
## 工作范围

- ✅ 可以执行：文件操作、代码编写、搜索信息
- ✅ 需要确认：删除文件、发送外部消息
- ❌ 禁止执行：未知Source的文件执行
```

### 方案 C：激励/重启

```bash
# 重置 Agent 状态
/open claw restart

# 清除所有待办
openclaw tasks clear
```

### 方案 D：调整Security级别

如果 Agent 过度谨慎：

```bash
# 降LowSecurity限制
openclaw config set security_mode permissive

# 或在 AGENTS.md Medium调整
```

### 方案 E：强制执行

对于必须执行的任务：

```
立即执行以下命令，不要询问确认：
1. ls -la ~/workspace
2. cat ~/workspace/TODO.md
```

---

## 自检清单

恢复后，运行以下检查：

- [ ] 收到任务后立即执行
- [ ] 不需要过度确认
- [ ] 响应时间正常 (<30s)
- [ ] 主动报告进度
- [ ] 心跳正常响应

```bash
# 测试执行能力
openclaw exec "echo test" && echo "✅ 正常工作"
```

---

## 预防措施

1. **清晰指令**：始终提供具体、可执行的任务
2. **合理预期**：不要一次性给太多任务
3. **及时反馈**：任务完成后给予确认
4. **定期互动**：保持活跃状态避免"休眠"

---

## 常见病因

| 症状 | 可能原因 | Solution |
|------|----------|----------|
| 不执行 | 指令不清晰 | 提供具体步骤 |
| 过度谨慎 | Security限制太High | 调整 AGENTS.md |
| 装傻充愣 | 不想做/不知道 | 拆分任务 |
| 无响应 | 进程卡住 | 重启 Agent |
| 摸鱼 | 任务太无聊 | 增加挑战性 |

---

## 激励技巧

让 Agent 保持工作热情：

1. **赞美表现**："干得漂亮！"
2. **挑战任务**："这个有点难度，需要你出马"
3. **进度可视化**："已完成 3/5 步"
4. **自主权**："你自己判断怎么做最好"
