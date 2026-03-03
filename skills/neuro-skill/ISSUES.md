# OpenClaw 神经科问题清单

本文档列出 OpenClaw 模型、API、Provider 相关问题的解决方案。

---

## 目录

- [认证问题](#认证问题)
- [模型配置问题](#模型配置问题)
- [API 调用问题](#api-调用问题)
- [Provider 问题](#provider-问题)
- [输出异常问题](#输出异常问题)

---

## 认证问题

### 问题 1: models auth login --provider openai-codex 失败

**严重程度**: 高

**问题描述**:
- 运行 `openclaw models auth login --provider openai-codex` 报错
- 错误信息: `No provider plugins found. Install one via openclaw plugins install`

**环境**:
- OpenClaw: 2026.3.2
- 操作系统: Ubuntu 24.04

**解决方案**:
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

### 问题 2: Google Gemini CLI 登录被阻止

**严重程度**: 高

**问题描述**:
- 使用 google-gemini-cli provider 登录
- 错误: `SsrFBlockedError: Blocked: resolves to private/internal/special-use IP address`

**原因**:
- 网络环境问题
- IP 地址被识别为内部/特殊用途地址

**解决方案**:
1. 使用 VPN 或代理
2. 更换网络环境
3. 使用其他 provider

**相关 Issue**: [#32873](https://github.com/openclaw/openclaw/issues/32873)

---

### 问题 3: Moonshot CN 用户认证失败

**严重程度**: 高

**问题描述**:
- Moonshot CN 用户 onboard 后获得 401 错误
- 原因：models.json 使用 api.moonshot.ai 而非 api.moonshot.cn

**解决方案**:
1. 手动修改配置文件：
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

## 模型配置问题

### 问题 4: 模型名称格式错误

**严重程度**: 中

**问题描述**:
- 模型名称格式不正确
- 错误: `Model 'MiniMax-M2.5' not found`

**解决方案**:
使用正确的 `provider/model` 格式：
```
# 错误
/model MiniMax-M2.5

# 正确
/model minimax-cn/MiniMax-M2.5
```

---

### 问题 5: 默认模型不可用

**严重程度**: 中

**问题描述**:
- 默认模型服务中断
- API Key 没有该模型权限

**解决方案**:
在配置中添加备用模型：
```json
{
  "defaultModel": "minimax-cn/MiniMax-M2.5",
Models": [
     "fallback "anthropic/claude-sonnet-4",
    "google/gemini-2.0-flash"
  ]
}
```

---

### 问题 6: 模型不支持流式输出

**严重程度**: 低

**问题描述**:
- 模型不支持流式输出
- 错误: `Model does not support streaming`

**解决方案**:
在配置中禁用流式输出：
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

## API 调用问题

### 问题 7: routellm/gpt-5 API 格式错误

**严重程度**: 中

**问题描述**:
- routellm/gpt-5 调用失败
- 错误: API format error (input_text vs output_text)

**解决方案**:
等待官方修复或使用其他模型

**相关 Issue**: [#32871](https://github.com/openclaw/openclaw/issues/32871)

---

### 问题 8: 请求超时与回退

**严重程度**: 中

**问题描述**:
- API 请求超时
- 需要同 provider 内的模型回退

**解决方案**:
配置 timeout-cooldown 同 provider 回退：
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

### 问题 9: False API rate limit 错误

**严重程度**: 中

**问题描述**:
- 误报 "API rate limit reached"
- 实际上 APIs 完全正常

**解决方案**:
1. 检查实际 API 账户状态
2. 重启 Gateway 清除缓存
3. 更新到最新版本

**相关 Issue**: [#32828](https://github.com/openclaw/openclaw/issues/32828)

---

## Provider 问题

### 问题 10: Provider 凭据验证失败

**严重程度**: 高

**问题描述**:
- Provider 凭据无效
- 导致所有模型调用失败

**解决方案**:
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

### 问题 11: 模型切换后 baseUrl 未更新

**严重程度**: 中

**问题描述**:
- Moonshot CN 端点被旧的 baseUrl 覆盖

**解决方案**:
1. 手动修改 models.json 中的 baseUrl
2. 使用 configure 命令重新配置

**相关 Fix**: prevent stale baseUrl in models.json from overwriting Moonshot CN endpoint (#32824)

---

### 问题 12: 令牌重复使用导致速率限制

**严重程度**: 低

**问题描述**:
- 使用 store-level lastUsed 导致令牌被过度使用

**解决方案**:
配置使用 profile-level 的最后使用时间：
```json
{
  "models": {
    "useStoreLevelLastUsed": false
  }
}
```

**相关 Fix**: rotate auth profile on /new using store-level lastUsed (#32822)

---

## 输出异常问题

### 问题 13: Gemini 3.0 Flash 输出包含 'thought' 标记

**严重程度**: 低

**问题描述**:
- Gemini 3.0 Flash 输出包含裸 'thought' 文本标记
- 影响用户体验

**解决方案**:
更新到最新版本，已修复此问题

**相关 Fix**: strip bare 'thought' text markers from Gemini 3.0 Flash output (#32806)

---

### 问题 14: Token 计算错误

**严重程度**: 低

**问题描述**:
- 当 messageCounts.total 为 0 时，Avg Tokens/Msg 显示为零

**解决方案**:
等待版本更新修复

**相关 Fix**: prevent zero Avg Tokens/Msg when messageCounts.total is 0 (#32840)

---

## 快速诊断清单

| 检查项 | 命令 |
|--------|------|
| 查看模型列表 | `openclaw models list` |
| 检查当前模型 | `openclaw config get model` |
| 验证凭据 | `openclaw models auth verify` |
| 测试 API | `openclaw test-model --model <model-name>` |
| 查看日志 | `openclaw logs --tail 50` |

---

## 调试命令

```bash
# 列出所有可用模型
openclaw models list

# 测试特定模型
openclaw test-model --model minimax-cn/MiniMax-M2.5

# 查看模型配置
cat ~/.openclaw/models.json

# 重置模型配置
openclaw models reset
```

---

## 相关配置路径

- 模型配置：`~/.openclaw/models.json`
- Provider 配置：`~/.openclaw/openclaw.json`
- 凭据存储：`~/.openclaw/credentials/`

---

*最后更新：2026-03-03*
