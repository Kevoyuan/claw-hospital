# OpenClaw 神经科Problem清单

本文档列出 OpenClaw Model、API、Provider 相关Problem的Solution。

---

## 目录

- [认证Problem](#认证Problem)
- [ModelConfigProblem](#ModelConfigProblem)
- [API 调用Problem](#api-调用Problem)
- [Provider Problem](#provider-Problem)
- [输出AbnormalProblem](#输出AbnormalProblem)
- [Thinking与推理Problem](#Thinking与推理Problem)

---

## 认证Problem

### Problem 1: models auth login --provider openai-codex 失败

**Severity**: High

**ProblemDescription**:
- 运行 `openclaw models auth login --provider openai-codex` 报错
- 错误信息: `No provider plugins found. Install one via openclaw plugins install`

**Environment**:
- OpenClaw: 2026.3.2
- 操作系统: Ubuntu 24.04

**Solution**:
1. 安装 provider 插件：
   ```
   openclaw plugins install @openclaw/models
   ```
2. 或者回退版本：
   ```
   npm install openclaw@2026.2.26 -g
   ```

**相关 Issue**: [#32892](https://github.com/openclaw/openclaw/issues/32892)

---

### Problem 2: Google Gemini CLI 登录被阻止

**Severity**: High

**ProblemDescription**:
- 使用 google-gemini-cli provider 登录
- 错误: `SsrFBlockedError: Blocked: resolves to private/internal/special-use IP address`

**原因**:
- 网络EnvironmentProblem
- IP 地址被识别为内部/特殊用途地址

**Solution**:
1. 使用 VPN 或代理
2. 更换网络Environment
3. 使用其他 provider

**相关 Issue**: [#32873](https://github.com/openclaw/openclaw/issues/32873)

---

### Problem 3: Moonshot CN 用户认证失败

**Severity**: High

**ProblemDescription**:
- Moonshot CN 用户 onboard 后获得 401 错误
- 原因：models.json 使用 api.moonshot.ai 而非 api.moonshot.cn

**Solution**:
1. 手动修改Config文件：
   ```json
   {
     "models": {
       "providers": {
         "moonshot-cn": {
           "baseUrl": "https://api.moonshot.cn"
         }
       }
     }
   }
   ```
2. 重启 Gateway

**相关 Issue**: [#32607](https://github.com/openclaw/openclaw/issues/32607)

---

### Problem 4: Claude Code 登录失败

**Severity**: Medium

**ProblemDescription**:
- Claude Code provider 登录失败
- 错误: `Authorization failed`

**Solution**:
1. 检查 Claude Code CLI 是否安装：
   ```
   which claude
   ```
2. 重新登录：
   ```
   claude auth logout
   claude auth login
   ```
3. 确认 API 访问权限

---

## ModelConfigProblem

### Problem 5: Model名称格式错误

**Severity**: Medium

**ProblemDescription**:
- Model名称格式不正确
- 错误: `Model 'MiniMax-M2.5' not found`

**Solution**:
使用正确的 `provider/model` 格式：
```
# 错误
/model MiniMax-M2.5

# 正确
/model minimax-cn/MiniMax-M2.5
```

---

### Problem 6: 默认Model不可用

**Severity**: Medium

**ProblemDescription**:
- 默认Model服务Medium断
- API Key 没有该Model权限

**Solution**:
在ConfigMedium添加备用Model：
```json
{
  "defaultModel": "minimax-cn/MiniMax-M2.5",
  "fallbackModels": [
    "anthropic/claude-sonnet-4",
    "google/gemini-2.0-flash"
  ]
}
```

---

### Problem 7: Model不支持流式输出

**Severity**: Low

**ProblemDescription**:
- Model不支持流式输出
- 错误: `Model does not support streaming`

**Solution**:
在ConfigMedium禁用流式输出：
```json
{
  "models": {
    "providers": {
      "minimax-cn": {
        "streaming": false
      }
    }
  }
}
```

---

## API 调用Problem

### Problem 8: routellm/gpt-5 API 格式错误

**Severity**: Medium

**ProblemDescription**:
- routellm/gpt-5 调用失败
- 错误: API format error (input_text vs output_text)

**Solution**:
等待官方修复或使用其他Model

**相关 Issue**: [#32871](https://github.com/openclaw/openclaw/issues/32871)

---

### Problem 9: 请求超时与回退

**Severity**: Medium

**ProblemDescription**:
- API 请求超时
- 需要同 provider 内的Model回退

**Solution**:
Config timeout-cooldown 同 provider 回退：
```json
{
  "models": {
    "timeout": 30000,
    "cooldown": 5000
  }
}
```

**相关 Fix**: allow timeout-cooldown same-provider fallbacks (#32875)

---

### Problem 10: False API rate limit 错误

**Severity**: Medium

**ProblemDescription**:
- 误报 "API rate limit reached"
- 实际上 APIs 完全正常

**Solution**:
1. 检查实际 API 账户状态
2. 重启 Gateway 清除缓存
3. 更新到最新版本

**相关 Issue**: [#32828](https://github.com/openclaw/openclaw/issues/32828)

---

### Problem 11: API 重试导致重复调用

**Severity**: Low

**ProblemDescription**:
- API 超时重试导致重复调用
- 产生重复的副作用

**Solution**:
1. Config幂等性标识
2. 使用 idempotency key
3. 启用请求去重

---

## Provider Problem

### Problem 12: Provider 凭据验证失败

**Severity**: High

**ProblemDescription**:
- Provider 凭据无效
- 导致所有Model调用失败

**Solution**:
1. 运行凭据验证：
   ```
   openclaw models auth verify
   ```
2. 重新登录：
   ```
   openclaw models auth login --provider <provider-name>
   ```

**相关 Feature**: Gateway: add preflight module for provider credential validation (#32832)

---

### Problem 13: Model切换后 baseUrl 未更新

**Severity**: Medium

**ProblemDescription**:
- Moonshot CN 端点被旧的 baseUrl 覆盖

**Solution**:
1. 手动修改 models.json Medium的 baseUrl
2. 使用 configure 命令重新Config

**相关 Fix**: prevent stale baseUrl in models.json from overwriting Moonshot CN endpoint (#32824)

---

### Problem 14: 令牌重复使用导致速率限制

**Severity**: Low

**ProblemDescription**:
- 使用 store-level lastUsed 导致令牌被过度使用

**Solution**:
Config使用 profile-level 的最后使用时间：
```json
{
  "models": {
    "useStoreLevelLastUsed": false
  }
}
```

**相关 Fix**: rotate auth profile on /new using store-level lastUsed (#32822)

---

## 输出AbnormalProblem

### Problem 15: Gemini 3.0 Flash 输出包含 'thought' 标记

**Severity**: Low

**ProblemDescription**:
- Gemini 3.0 Flash 输出包含裸 'thought' 文本标记
- 影响用户体验

**Solution**:
更新到最新版本，已修复此Problem

**相关 Fix**: strip bare 'thought' text markers from Gemini 3.0 Flash output (#32806)

---

### Problem 16: Token 计算错误

**Severity**: Low

**ProblemDescription**:
- 当 messageCounts.total 为 0 时，Avg Tokens/Msg 显示为零

**Solution**:
等待版本更新修复

**相关 Fix**: prevent zero Avg Tokens/Msg when messageCounts.total is 0 (#32840)

---

## Thinking与推理Problem

### Problem 17: Model产生Hallucination

**Severity**: Medium

**ProblemDescription**:
- Model生成虚假或不存在的信息
- 表现为引用不存在的文档、事件或数据

**Solution**:
1. 在提示词Medium明确要求引用真实Source
2. 添加"不知道则说不知道"的指导
3. 启用事实核查工具
4. 减少 temperature 参数

---

### Problem 18: 推理步骤不完整

**Severity**: Low

**ProblemDescription**:
- Model跳过推理步骤直接给出答案
- 无法展示思考过程

**Solution**:
1. 在提示词Medium添加 "think step by step"
2. 使用 Chain-of-Thought 提示技巧
3. 启用结构化输出

---

### Problem 19: 系统提示被忽略

**Severity**: Medium

**ProblemDescription**:
- Model不遵循系统提示Medium的指令
- 忽略格式或Behavior要求

**Solution**:
1. 简化系统提示，突出关键指令
2. 在用户消息Medium重复重要指令
3. 使用更强的分隔符标记指令
4. 尝试不同的Model

---

## 快速Diagnosis清单

| 检查项 | 命令 |
|--------|------|
| 查看Model列表 | `openclaw models list` |
| 检查当前Model | `openclaw config get model` |
| 验证凭据 | `openclaw models auth verify` |
| 测试 API | `openclaw test-model --model <model-name>` |
| 查看日志 | `openclaw logs --tail 50` |

---

## 调试命令

```bash
# 列出所有可用Model
openclaw models list

# 测试特定Model
openclaw test-model --model minimax-cn/MiniMax-M2.5

# 查看ModelConfig
cat ~/.openclaw/models.json

# 重置ModelConfig
openclaw models reset
```

---

## 相关Config路径

- ModelConfig：`~/.openclaw/models.json`
- Provider Config：`~/.openclaw/openclaw.json`
- 凭据存储：`~/.openclaw/credentials/`

---

*最后更新：2026-03-04*
