# OpenClaw ModelProblem列表 (ISSUES.md)

本文档记录 OpenClaw ModelConfig和调用过程Medium遇到的常见Problem及Solution。

---

## 📌 目录

1. [API Key Problem](#api-key-Problem)
2. [ModelConfigProblem](#ModelConfigProblem)
3. [网络连接Problem](#网络连接Problem)
4. [认证与权限Problem](#认证与权限Problem)
5. [速率限制与配额Problem](#速率限制与配额Problem)
6. [输出质量Problem](#输出质量Problem)

---

## API Key Problem

### 🔴 Issue #001: API Key 未设置

**Severity**: High

**错误信息**:
```
Error: Missing API key for provider 'minimax-cn'
No API key configured
```

**原因**:
- Environment变量未设置
- Config文件缺少 apiKey 字段

**Solution**:
```bash
# 设置Environment变量 (临时)
export MINIMAX_API_KEY="your-api-key"

# 永久设置 (添加到 ~/.zshrc 或 ~/.bashrc)
echo 'export MINIMAX_API_KEY="your-api-key"' >> ~/.zshrc
source ~/.zshrc
```

**Config文件修复**:
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

**Severity**: High

**错误信息**:
```
Error: Invalid API key
Authentication failed: Invalid API key for provider 'anthropic'
```

**原因**:
- API Key 已过期
- API Key 被撤销
- API Key 格式错误

**Solution**:
1. 登录对应的 AI 平台控制台
2. 检查 API Key 状态
3. 如有必要，重新生成新的 API Key
4. 更新Environment变量或Config文件

---

### 🔴 Issue #003: API Key 已过期

**Severity**: Medium

**错误信息**:
```
Error: API key has expired
Please renew your subscription
```

**原因**:
- 免费试用到期
- 订阅已取消
- 密钥超过使用期限

**Solution**:
1. 访问平台账户设置
2. 续订或升级订阅计划
3. 生成新的 API Key

---

## ModelConfigProblem

### 🟡 Issue #101: Model名称格式错误

**Severity**: Medium

**错误信息**:
```
Error: Model 'MiniMax-M2.5' not found
Did you mean: 'minimax-cn/MiniMax-M2.5'?
```

**原因**:
- 缺少 provider 前缀
- Model名称拼写错误

**Solution**:
使用正确的 `provider/model` 格式：
```bash
# 错误
/model MiniMax-M2.5

# 正确
/model minimax-cn/MiniMax-M2.5
```

---

### 🟡 Issue #102: 默认Model不可用

**Severity**: Medium

**错误信息**:
```
Warning: Default model 'google/gemini-pro' is unavailable
Falling back to 'anthropic/claude-sonnet-4'
```

**原因**:
- 默认Model服务Medium断
- API Key 没有该Model权限

**Solution**:
1. 检查 `~/.openclaw/openclaw.json` Medium的默认Model设置
2. 添加备用Model列表：
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

### 🟡 Issue #103: Model不支持当前操作

**Severity**: Low

**错误信息**:
```
Error: Model does not support streaming
```

**原因**:
- Model不支持流式输出
- ConfigMedium启用了不支持的功能

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

### 🟡 Issue #104: Model列表为空

**Severity**: Medium

**ProblemDescription**:
- `openclaw models list` 返回空
- 没有可用的Model

**Solution**:
1. 检查是否安装了 models 插件
2. 验证 models.json Config
3. 重新运行 onboard

---

## 网络连接Problem

### 🟠 Issue #201: 连接超时

**Severity**: High

**错误信息**:
```
Error: Connection timeout after 30000ms
Network error: ETIMEDOUT
```

**原因**:
- 网络不稳定
- 防火墙阻止
- 代理Config错误

**Solution**:
1. 检查网络连接：
```bash
ping platform.minimax.io
ping api.anthropic.com
```
2. 检查代理设置（如使用 VPN）
3. 尝试更换网络

---

### 🟠 Issue #202: SSL 证书错误

**Severity**: Medium

**错误信息**:
```
Error: SSL certificate problem: unable to get local issuer certificate
```

**原因**:
- 系统根证书过期或缺失
- 代理干扰 SSL 连接

**Solution**:
```bash
# macOS
brew install curl-ca-bundle

# 更新系统证书
sudo update-ca-certificates
```

---

### 🟠 Issue #203: 域名解析失败

**Severity**: Medium

**错误信息**:
```
Error: getaddrinfo ENOTFOUND api.minimax.io
```

**原因**:
- DNS ConfigProblem
- 域名被墙

**Solution**:
1. 检查 DNS 设置
2. 使用备选 DNS（如 Google DNS 8.8.8.8）
3. Config hosts 文件

---

### 🟠 Issue #204: 代理认证失败

**Severity**: Medium

**错误信息**:
```
Error: Proxy authentication failed
407 Proxy Authentication Required
```

**Solution**:
1. Config代理用户名和密码
2. 或使用不需要认证的代理

---

## 认证与权限Problem

### 🔴 Issue #301: 认证失败 401

**Severity**: High

**错误信息**:
```
Error: 401 Unauthorized
Authentication failed
```

**原因**:
- API Key 错误
- 账户未激活
- 权限不足

**Solution**:
1. 确认 API Key 正确
2. 检查账户状态（是否已激活、是否欠费）
3. 确认 API Key 有调用该Model的权限

---

### 🔴 Issue #302: 权限不足 403

**Severity**: High

**错误信息**:
```
Error: 403 Forbidden
Insufficient permissions to access this model
```

**原因**:
- 账户级别不支持该Model
- 未完成实名认证

**Solution**:
1. 登录平台检查账户权限
2. 完成必要的认证流程
3. 升级账户套餐

---

### 🔴 Issue #303: 账户被封禁

**Severity**: 严重

**错误信息**:
```
Error: 403 Account suspended
Your account has been suspended
```

**原因**:
- 违反平台使用政策
- 欠费严重

**Solution**:
1. 联系平台客服
2. 了解封禁原因
3. 提供申诉材料

---

## 速率限制与配额Problem

### 🟡 Issue #401: 请求速率超限 429

**Severity**: Medium

**错误信息**:
```
Error: 429 Too Many Requests
Rate limit exceeded: 60 requests per minute
```

**原因**:
- 请求频率过High
- 并发请求过多

**Solution**:
1. 添加请求延迟：
```python
import time
time.sleep(1)  # 每秒最多1个请求
```
2. 使用流式响应减少请求次数
3. 考虑升级付费套餐提High限制

---

### 🟡 Issue #402: 每日配额用尽

**Severity**: Medium

**错误信息**```
Error: 429 Quota exceeded
Daily quota limit reached
```

**原因**:
- 免费额度用完
- 达到每日消费上限

**Solution**:
1. 检查配额使用情况
2. 等待次日配额重置
3. 升级付费计划

---

### 🟡 Issue #403: 每月账单超支

**Severity**: Medium

**错误信息**:
```
Error: Billing limit exceeded
Monthly spend limit reached
```

**原因**:
- 设置了每月消费上限
- 用量超出预期

**Solution**:
1. 登录平台调整或取消限额
2. 监控用量避免超支

---

## 输出质量Problem

### 🟠 Issue #501: Model输出包含乱码

**Severity**: Medium

**ProblemDescription**:
- 输出包含随机字符或乱码
- UTF-8 编码Problem

**Solution**:
1. 检查终端编码设置
2. 设置Environment变量：
   ```
   export LANG=en_US.UTF-8
   export LC_ALL=en_US.UTF-8
   ```
3. 重启 Gateway

---

### 🟠 Issue #502: 输出被截断

**Severity**: Medium

**ProblemDescription**:
- 长输出被意外截断
- 不完整响应

**Solution**:
1. 增加 maxTokens 限制
2. 检查是否达到Model上下文限制
3. 启用流式输出获取完整响应

---

### 🟠 Issue #503: 响应格式不一致

**Severity**: Low

**ProblemDescription**:
- 相同请求返回不同格式
- JSON 解析失败

**Solution**:
1. 在提示词Medium明确输出格式
2. 使用结构化输出Config
3. 添加输出格式验证

---

## 调试工具

### 查看当前状态

```bash
# 检查 OpenClaw 状态
openclaw status

# DiagnosisProblem
openclaw doctor

# 测试 API 连接
openclaw test-model --model minimax-cn/MiniMax-M2.5
```

### 日志位置

```
~/.openclaw/logs/
```

---

## 报告新Problem

遇到未列出的Problem时，请收集以下信息：

1. **错误信息**：完整的错误输出
2. **Config文件**：`~/.openclaw/openclaw.json`（注意脱敏）
3. **Environment变量**：`echo $API_KEY_NAME` 只显示前5位
4. **日志文件**：相关时间段的日志
5. **复现步骤**：如何稳定重现Problem

---

*最后更新：2026-03-04*
