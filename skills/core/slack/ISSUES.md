# slack Issues

---

### SLACK-001: OAuth Token 过期或无效

**Severity**: High
**Problem**: API 调用返回 "invalid_auth" 错误。
**Solution**:
- 重新运行 `openclaw extensions slack onboard`
- 检查 Bot Token 是否具有所需 scopes
- 确认 workspace 已安装你的 app

**Source**: GitHub

---

### SLACK-002: 缺少 required_scope 权限

**Severity**: High
**Problem**: 返回 "missing_scope" 错误。
**Solution**:
- 在 Slack App ConfigMedium添加所需 scopes：
  - `chat:write` - 发送消息
  - `channels:read` - 读取频道
  - `users:read` - 读取用户信息
- 重新安装 app 到 workspace

**Source**: GitHub

---

### SLACK-003: 消息长度限制

**Severity**: Low
**Problem**: 长消息无法发送。
**Solution**:
- Slack 消息限制 30000 字符（但 UI 显示 3000）
- 使用 thread_ts 实现长对话
- 上传到 Slack Files

**Source**: 论坛

---

### SLACK-004: Event Subscriptions 未验证

**Severity**: High
**Problem**: URL 验证失败，events 无法接收。
**Solution**:
- 返回正确的 challenge 参数
- 确认 URL 可公开访问
- 检查 SSL 证书有效性

**Source**: GitHub
