# line Issues

---

### LINE-001: Channel Access Token 过期

**Severity**: High
**Problem**: API 调用返回无效 token 错误。
**Solution**:
- 在 LINE Developer Console 重新生成 token
- 检查 token 过期时间
- 实现自动刷新机制

**Source**: https://github.com/openclaw/openclaw/issues

---

### LINE-002: Webhook 签名验证失败

**Severity**: High
**Problem**: 无法接收消息事件。
**Solution**:
- 确认 Channel Secret 正确
- 正确实现 HMAC-SHA256 签名验证
- 检查请求头

**Source**: https://github.com/openclaw/openclaw/issues

---

### LINE-003: 消息类型不支持

**Severity**: Medium
**Problem**: 发送的消息类型无法识别。
**Solution**:
- 检查消息对象格式
- 确认消息类型代码正确
- 使用 LINE SDK

**Source**: https://github.com/openclaw/openclaw/discussions

---

### LINE-004: 贴纸消息失败

**Severity**: Low
**Problem**: 无法发送贴纸。
**Solution**:
- 确认 stickerId 和 packageId 有效
- 检查是否在可用范围内

**Source**: https://github.com/openclaw/openclaw/issues
