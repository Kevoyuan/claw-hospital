# OpenClaw 模型问题列表 (ISSUES.md)

本文档记录 OpenClaw 模型配置和调用过程中遇到的常见问题及解决方案。

---

## 📌 目录

1. [API Key 问题](#api-key-问题)
2. [模型配置问题](#模型配置问题)
3. [网络连接问题](#网络连接问题)
4. [认证与权限问题](#认证与权限问题)
5. [速率限制与配额问题](#速率限制与配额问题)

---

## API Key 问题

### 🔴 Issue #001: API Key 未设置

**严重程度**: 高

**错误信息**:
```
Error: Missing API key for provider 'minimax-cn'
No API key configured
```

**原因**:
- 环境变量未设置
- 配置文件缺少 apiKey 字段

**解决方案**:
```bash
# 设置环境变量 (临时)
export MINIMAX_API_KEY="your-api-key"

# 永久设置 (添加到 ~/.zshrc 或 ~/.bashrc)
echo 'export MINIMAX_API_KEY="your-api-key"' >> ~/.zshrc
source ~/.zshrc
```

**配置文件修复**:
```json
{
  "models": {
    "providers": {
      "minimax-cn": {
        "apiKey": "env:MINIMAX_API_KEY"
      }
    }
  }
}
```

---

### 🔴 Issue #002: API Key 无效

**严重程度**: 高

**错误信息**:
```
Error: Invalid API key
Authentication failed: Invalid API key for provider 'anthropic'
```

**原因**:
- API Key 已过期
- API Key 被撤销
- API Key 格式错误

**解决方案**:
1. 登录对应的 AI 平台控制台
2. 检查 API Key 状态
3. 如有必要，重新生成新的 API Key
4. 更新环境变量或配置文件

---

### 🔴 Issue #003: API Key 已过期

**严重程度**: 中

**错误信息**:
```
Error: API key has expired
Please renew your subscription
```

**原因**:
- 免费试用到期
- 订阅已取消
- 密钥超过使用期限

**解决方案**:
1. 访问平台账户设置
2. 续订或升级订阅计划
3. 生成新的 API Key

---

## 模型配置问题

### 🟡 Issue #101: 模型名称格式错误

**严重程度**: 中

**错误信息**:
```
Error: Model 'MiniMax-M2.5' not found
Did you mean: 'minimax-cn/MiniMax-M2.5'?
```

**原因**:
- 缺少 provider 前缀
- 模型名称拼写错误

**解决方案**:
使用正确的 `provider/model` 格式：
```bash
# 错误
/model MiniMax-M2.5

# 正确
/model minimax-cn/MiniMax-M2.5
```

---

### 🟡 Issue #102: 默认模型不可用

**严重程度**: 中

**错误信息**:
```
Warning: Default model 'google/gemini-pro' is unavailable
Falling back to 'anthropic/claude-sonnet-4'
```

**原因**:
- 默认模型服务中断
- API Key 没有该模型权限

**解决方案**:
1. 检查 `~/.openclaw/openclaw.json` 中的默认模型设置
2. 添加备用模型列表：
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

### 🟡 Issue #103: 模型不支持当前操作

**严重程度**: 低

**错误信息**:
```
Error: Model does not support streaming
```

**原因**:
- 模型不支持流式输出
- 配置中启用了不支持的功能

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

## 网络连接问题

### 🟠 Issue #201: 连接超时

**严重程度**: 高

**错误信息**:
```
Error: Connection timeout after 30000ms
Network error: ETIMEDOUT
```

**原因**:
- 网络不稳定
- 防火墙阻止
- 代理配置错误

**解决方案**:
1. 检查网络连接：
```bash
ping platform.minimax.io
ping api.anthropic.com
```
2. 检查代理设置（如使用 VPN）
3. 尝试更换网络

---

### 🟠 Issue #202: SSL 证书错误

**严重程度**: 中

**错误信息**:
```
Error: SSL certificate problem: unable to get local issuer certificate
```

**原因**:
- 系统根证书过期或缺失
- 代理干扰 SSL 连接

**解决方案**:
```bash
# macOS
brew install curl-ca-bundle

# 更新系统证书
sudo update-ca-certificates
```

---

### 🟠 Issue #203: 域名解析失败

**严重程度**: 中

**错误信息**:
```
Error: getaddrinfo ENOTFOUND api.minimax.io
```

**原因**:
- DNS 配置问题
- 域名被墙

**解决方案**:
1. 检查 DNS 设置
2. 使用备选 DNS（如 Google DNS 8.8.8.8）
3. 配置 hosts 文件

---

## 认证与权限问题

### 🔴 Issue #301: 认证失败 401

**严重程度**: 高

**错误信息**:
```
Error: 401 Unauthorized
Authentication failed
```

**原因**:
- API Key 错误
- 账户未激活
- 权限不足

**解决方案**:
1. 确认 API Key 正确
2. 检查账户状态（是否已激活、是否欠费）
3. 确认 API Key 有调用该模型的权限

---

### 🔴 Issue #302: 权限不足 403

**严重程度**: 高

**错误信息**:
```
Error: 403 Forbidden
Insufficient permissions to access this model
```

**原因**:
- 账户级别不支持该模型
- 未完成实名认证

**解决方案**:
1. 登录平台检查账户权限
2. 完成必要的认证流程
3. 升级账户套餐

---

### 🔴 Issue #303: 账户被封禁

**严重程度**: 严重

**错误信息**:
```
Error: 403 Account suspended
Your account has been suspended
```

**原因**:
- 违反平台使用政策
- 欠费严重

**解决方案**:
1. 联系平台客服
2. 了解封禁原因
3. 提供申诉材料

---

## 速率限制与配额问题

### 🟡 Issue #401: 请求速率超限 429

**严重程度**: 中

**错误信息**:
```
Error: 429 Too Many Requests
Rate limit exceeded: 60 requests per minute
```

**原因**:
- 请求频率过高
- 并发请求过多

**解决方案**:
1. 添加请求延迟：
```python
import time
time.sleep(1)  # 每秒最多1个请求
```
2. 使用流式响应减少请求次数
3. 考虑升级付费套餐提高限制

---

### 🟡 Issue #402: 每日配额用尽

**严重程度**: 中

**错误信息**```
Error: 429 Quota exceeded
Daily quota limit reached
```

**原因**:
- 免费额度用完
- 达到每日消费上限

**解决方案**:
1. 检查配额使用情况
2. 等待次日配额重置
3. 升级付费计划

---

### 🟡 Issue #403: 每月账单超支

**严重程度**: 中

**错误信息**:
```
Error: Billing limit exceeded
Monthly spend limit reached
```

**原因**:
- 设置了每月消费上限
- 用量超出预期

**解决方案**:
1. 登录平台调整或取消限额
2. 监控用量避免超支

---

## 调试工具

### 查看当前状态

```bash
# 检查 OpenClaw 状态
openclaw status

# 诊断问题
openclaw doctor

# 测试 API 连接
openclaw test-model --model minimax-cn/MiniMax-M2.5
```

### 日志位置

```
~/.openclaw/logs/
```

---

## 报告新问题

遇到未列出的问题时，请收集以下信息：

1. **错误信息**：完整的错误输出
2. **配置文件**：`~/.openclaw/openclaw.json`（注意脱敏）
3. **环境变量**：`echo $API_KEY_NAME` 只显示前5位
4. **日志文件**：相关时间段的日志
5. **复现步骤**：如何稳定重现问题

---

*最后更新：2026-03-03*
