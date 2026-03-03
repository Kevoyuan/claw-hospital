# twitch Issues

---

### TWITCH-001: OAuth Token 刷新失败

**Severity**: High
**Problem**: 刷新访问令牌时出错。
**Solution**:
- 检查 Client Secret 是否正确
- 确认 OAuth 流程正确实现
- 使用长期令牌或实现自动刷新

**Source**: GitHub

---

### TWITCH-002: 事件订阅超时

**Severity**: Medium
**Problem**: Webhook 订阅验证超时。
**Solution**:
- 返回正确的 challenge
- 确认服务器响应时间 < 10秒
- 检查网络延迟

**Source**: GitHub

---

### TWITCH-003: 缺少聊天消息权限

**Severity**: High
**Problem**: 无法读取/发送聊天消息。
**Solution**:
- 在 Twitch Developer Console 添加所需 scopes：
  - chat:read
  - chat:edit
- 重新授权获取新令牌

**Source**: GitHub
