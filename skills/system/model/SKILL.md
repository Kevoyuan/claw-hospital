# OpenClaw ModelConfig指南

本Skill用于Config和管理 OpenClaw 的 AI Model（MiniMax/Claude/Gemini），解决 API Key 和Model调用Issue。

## 📋 目录

1. [ModelConfig](#ModelConfig)
2. [API Key 设置](#api-key-设置)
3. [常见Issue与Solution](#常见Issue与Solution)
4. [Config文件位置](#Config文件位置)

---

## ModelConfig

### Config方式

OpenClaw 支持多种ModelConfig方式：

| 方式 | 命令/方法 | 说明 |
|------|----------|------|
| **交互式设置** | `openclaw onboard` | 引导式Config流程 |
| **Config向导** | `openclaw configure` | Model和认证Config向导 |
| **直接编辑** | 手动编辑 `~/.openclaw/openclaw.json` | 自定义 provider 和设置 |
| **CLI 命令** | `/model <别名>` 或 `claude --model <别名>` | 快速切换Model |

### Model格式

Model引用遵循 `provider/model` 格式：

```
anthropic/claude-opus-4-6
minimax-cn/MiniMax-M2.5
google/gemini-pro
```

### 支持的Model

- **MiniMax**: `minimax-cn/MiniMax-M2.5`, `minimax-cn/MiniMax-M2.1`
- **Claude**: `anthropic/claude-opus-4-6`, `anthropic/claude-sonnet-4`
- **Gemini**: `google/gemini-pro`, `google/gemini-2.0-flash`

---

## API Key 设置

### MiniMax API Key

1. 访问 [MiniMax 开发者平台](https://platform.minimax.io)
2. 注册/登录账户
3. 进入「API Keys」部分（通常在「Developer」或「Profile > API Keys」）
4. 点击「Create New Key」，设置Description标签
5. **立即复制**密钥（MiniMax 只显示一次）
6. 设置Environment变量：
   ```bash
   export MINIMAX_API_KEY="your-api-key"
   ```

### Claude API Key

1. 访问 [Anthropic Console](https://console.anthropic.com)
2. 登录/注册账户
3. 进入「API Keys」部分
4. 点击「Generate New Key」或「+Create Key」
5. 命名并创建密钥，**立即复制**
6. 设置Environment变量：
   ```bash
   export ANTHROPIC_API_KEY="your-api-key"
   ```

### Gemini API Key

1. 访问 [Google AI Studio](https://aistudio.google.com)
2. 使用 Google 账户登录
3. 进入「API Keys」部分
4. 点击「Create a new API Key」
5. 选择或创建 Google Cloud 项目
6. 复制密钥，设置Environment变量：
   ```bash
   export GEMINI_API_KEY="your-api-key"
   # 或
   export GOOGLE_API_KEY="your-api-key"
   ```

> ⚠️ **Security建议**：强烈建议将 API Key 存储为Environment变量，避免直接硬编码到Config文件Medium。

---

## 常见Issue与Solution

### ❌ Issue：API Key 无效或缺失

**症状**：
- 错误信息：`Missing API key` 或 `Invalid API key`
- Model无法调用

**Solution**：
1. 检查Environment变量是否设置正确：
   ```bash
   echo $MINIMAX_API_KEY
   echo $ANTHROPIC_API_KEY
   echo $GEMINI_API_KEY
   ```
2. 在 `~/.openclaw/openclaw.json` Medium添加或更新 API Key：
   ```json
   {
     "providers": {
       "minimax-cn": {
         "apiKey": "your-key-here"
       }
     }
   }
   ```

### ❌ Issue：Model不支持

**症状**：
- 错误信息：`Model not found` 或 `Unsupported model`

**Solution**：
1. 确认Model名称格式正确（`provider/model`）
2. 检查该Model是否在支持列表Medium
3. 使用 `openclaw configure` 重新选择Model

### ❌ Issue：速率限制 (Rate Limit)

**症状**：
- 错误信息：`Rate limit exceeded` 或 `429 Too Many Requests`

**Solution**：
1. 等待一段时间后重试
2. 减少请求频率
3. 考虑升级 API 订阅计划
4. Config备用Model

### ❌ Issue：认证失败

**症状**：
- 错误信息：`Authentication failed` 或 `401 Unauthorized`

**Solution**：
1. 验证 API Key 是否正确且未过期
2. 检查账户是否有足够配额
3. 重新生成 API Key

### ❌ Issue：网络连接Issue

**症状**：
- 错误信息：`Connection timeout` 或 `Network error`

**Solution**：
1. 检查网络连接
2. 确认防火墙/代理设置
3. 尝试使用备用网络

### ❌ Issue：配额不足

**症状**：
- 错误信息：`Quota exceeded` 或 `Insufficient quota`

**Solution**：
1. 登录对应平台检查配额使用情况
2. 等待配额重置（通常每月重置）
3. 升级付费计划

---

## Config文件位置

主Config文件：`~/.openclaw/openclaw.json`

### 示例Config

```json
{
  "defaultModel": "minimax-cn/MiniMax-M2.5",
  "fallbackModels": [
    "anthropic/claude-sonnet-4",
    "google/gemini-2.0-flash"
  ],
  "models": {
    "providers": {
      "minimax-cn": {
        "apiKey": "env:MINIMAX_API_KEY"
      },
      "anthropic": {
        "apiKey": "env:ANTHROPIC_API_KEY"
      },
      "google": {
        "apiKey": "env:GEMINI_API_KEY"
      }
    }
  }
}
```

> 💡 **提示**：使用 `env:VARIABLE_NAME` 格式可以引用Environment变量，避免在Config文件Medium明文存储密钥。

---

## 调试命令

```bash
# 检查当前ModelConfig
openclaw status

# 测试Model连接
openclaw doctor

# 查看Config
cat ~/.openclaw/openclaw.json
```

---

*最后更新：2026-03-03*
