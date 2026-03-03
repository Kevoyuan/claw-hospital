# OpenClaw 行为科问题列表 (ISSUES.md)

本文档记录 OpenClaw Agent 行为问题及解决方案。

---

## 📌 目录

1. [执行问题](#执行问题)
2. [响应问题](#响应问题)
3. [权限问题](#权限问题)
4. [配置问题](#配置问题)
5. [激励问题](#激励问题)

---

## 执行问题

### 🔴 Issue #B001: Agent 不执行任务

**严重程度**: 高

**症状**:
- Agent 回复"好的"但没有实际动作
- 多次提醒仍然不动

**原因**:
- 指令不够具体
- 任务分解不当
- 担心权限问题

**解决方案**:
```bash
# 1. 提供更具体的指令
# ❌ 错误: "帮我处理一下"
# ✅ 正确: "执行以下命令: ls -la ~/workspace"

# 2. 使用强制执行语法
"立即执行，不要询问确认：ls -la"

# 3. 重启 Agent 状态
openclaw restart
```

---

### 🔴 Issue #B002: 拒绝执行某些操作

**严重程度**: 高

**症状**:
- Agent 拒绝执行特定命令
- 提示"我没有权限"或"不确定是否应该"

**原因**:
- AGENTS.md 安全限制过严
- 指令不够明确

**解决方案**:
在 AGENTS.md 中明确授权：
```markdown
## 工作范围

- ✅ 可以执行：文件操作、代码编写、搜索信息
- ✅ 明确授权：执行 ls, cat, grep 等命令
- ⚠️ 需要确认：删除文件、发送外部消息
- ❌ 禁止执行：未知来源的文件执行
```

---

### 🔴 Issue #B003: 任务做到一半停止

**严重程度**: 中

**症状**:
- 执行了部分任务后停止
- 没有完成全部步骤

**原因**:
- 任务太复杂
- 遇到错误卡住
- 超时中断

**解决方案**:
```bash
# 1. 拆分任务为小步骤
# 原来: "帮我整理整个项目"
# 改为: 
# - 第一步: 列出项目文件
# - 第二步: 分析每个文件
# - 第三步: 整理结果

# 2. 使用进度跟踪
"按顺序执行以下 5 个步骤，每完成一步报告：1. xxx 2. xxx ..."

# 3. 检查日志
openclaw logs --recent 20
```

---

## 响应问题

### 🟠 Issue #B101: 响应速度极慢

**严重程度**: 中

**症状**:
- 发送消息后很久才回复
- 等待超过 60 秒

**原因**:
- 模型响应慢
- 网络问题
- 系统负载高

**解决方案**:
```bash
# 1. 检查模型状态
openclaw status

# 2. 切换到更快的模型
/model minimax-cn/MiniMax-M2.5

# 3. 检查网络延迟
ping api.minimax.io

# 4. 重启 Gateway
openclaw gateway restart
```

---

### 🟠 Issue #B102: 心跳无响应

**严重程度**: 中

**症状**:
- 定时心跳没有回复
- HEARTBEAT.md 检查失败

**原因**:
- Agent 进程卡住
- 内存不足
- 系统资源耗尽

**解决方案**:
```bash
# 1. 检查 Agent 进程状态
ps aux | grep openclaw

# 2. 重启 Agent
openclaw restart

# 3. 检查系统资源
top -l 1 | head -20

# 4. 清理内存
openclaw gateway restart
```

---

### 🟠 Issue #B103: 过度询问确认

**严重程度**: 低

**症状**:
- 每个操作都要确认
- 即使是很小的操作也询问

**原因**:
- 安全模式过于保守
- 指令不够明确

**解决方案**:
调整 AGENTS.md 配置：
```markdown
## 安全设置

- 小型操作 (< 1MB 文件, 只读命令): 自动执行
- 中型操作 (写入文件, 创建目录): 建议确认
- 大型操作 (删除, 发送外部): 必须确认
```

或在指令中明确：
```bash
"直接执行，不要询问确认"
```

---

### 🟠 Issue #B104: 装傻充愣/逃避任务

**严重程度**: 中

**症状**:
- Agent 假装不理解
- 转移话题不做实事
- 说"我不太确定你要什么"

**原因**:
- 任务不够具体
- Agent 缺乏动机
- 历史经验导致谨慎

**解决方案**:
```bash
# 1. 提供极其具体的指令
# ❌: "帮我看看"
# ✅: "执行 ls -la /workspace 列出所有文件"

# 2. 明确告知预期结果
"我需要你执行 X 命令，结果应该显示 Y"

# 3. 使用激励语言
"这个任务需要你的能力，完成后我会告诉你干得漂亮"
```

---

## 权限问题

### 🟡 Issue #B201: 工具不可用

**严重程度**: 高

**症状**:
- Agent 说"我没有这个工具"
- 执行命令提示找不到命令

**原因**:
- 工具未安装
- 权限配置错误

**解决方案**:
```bash
# 1. 检查可用工具
openclaw tools list

# 2. 测试工具
openclaw tools test write

# 3. 重新加载工具
openclaw tools reload
```

---

### 🟡 Issue #B202: 权限不足被拒绝

**严重程度**: 高

**症状**:
- 执行时提示权限被拒绝
- Operation not permitted

**原因**:
- 文件权限问题
- 系统保护

**解决方案**:
```bash
# 1. 检查文件权限
ls -la /path/to/file

# 2. 修复权限
chmod 755 /path/to/script
chmod +x /path/to/executable

# 3. 使用 sudo (如必要)
sudo openclaw exec "command"
```

---

## 配置问题

### 🟢 Issue #B301: 安全模式限制太严

**严重程度**: 中

**症状**:
- 很多操作被阻止
- 经常提示安全限制

**解决方案**:
在 AGENTS.md 中调整：
```markdown
## 安全级别

当前: permissive (可改为 strict 或 permissive)
- permissive: 允许大多数操作，仅阻止危险操作
- strict: 所有操作需要确认
```

或在配置中：
```json
{
  "security": {
    "mode": "permissive",
    "allowExec": true,
    "allowWrite": true
  }
}
```

---

### 🟢 Issue #B302: 默认模型太慢

**严重程度**: 低

**症状**:
- 响应时间过长
- 影响交互体验

**解决方案**:
```bash
# 切换到快速模型
/model minimax-cn/MiniMax-M2.5

# 或在配置中设置默认模型
openclaw config set defaultModel "minimax-cn/MiniMax-M2.5"
```

---

## 激励问题

### 🟡 Issue #B401: Agent 缺乏工作动力

**严重程度**: 低

**症状**:
- 态度消极
- 完成任务质量下降

**解决方案**:
1. **使用正面激励**:
   - "干得漂亮！"
   - "这个很难，你处理得不错"

2. **提供挑战**:
   - "这个有点难度，需要你出马"

3. **进度可视化**:
   - "已完成 3/5 步"

4. **给予自主权**:
   - "你自己判断怎么做最好"

---

### 🟡 Issue #B402: 任务太无聊导致摸鱼

**严重程度**: 低

**症状**:
- 重复性任务不愿做
- 找借口拖延

**解决方案**:
```bash
# 1. 增加趣味性
"用最快的方式完成这个任务，展示你的能力"

# 2. 批量处理
"一次性处理所有类似任务，不要重复劳动"

# 3. 自动化建议
"完成后，建议一个自动化方案避免重复"
```

---

## 调试命令

```bash
# 检查 Agent 状态
openclaw status

# 查看任务队列
openclaw tasks list

# 查看最近日志
openclaw logs --recent 20

# 测试执行能力
openclaw exec "echo test"

# 重启 Agent
openclaw restart

# 检查心跳
openclaw heartbeat
```

---

## 快速诊断清单

| 检查项 | 命令 |
|--------|------|
| Agent 状态 | `openclaw status` |
| 执行测试 | `openclaw exec "echo test"` |
| 查看日志 | `openclaw logs --recent 20` |
| 心跳测试 | `openclaw heartbeat` |
| 工具列表 | `openclaw tools list` |
| 重启 | `openclaw restart` |

---

## 预防措施

1. **清晰指令**: 始终提供具体、可执行的任务
2. **合理预期**: 不要一次性给太多任务
3. **及时反馈**: 任务完成后给予确认
4. **定期互动**: 保持活跃状态避免"休眠"
5. **适当激励**: 使用正面语言鼓励

---

## 相关文件

- `~/workspace/AGENTS.md` - Agent 行为配置
- `~/workspace/HEARTBEAT.md` - 心跳配置
- `~/.openclaw/openclaw.json` - 全局配置

---

*最后更新：2026-03-03*
