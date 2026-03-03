# whatsapp Issues

---

### WHATSAPP-001: WhatsApp Business API 验证码失败

**Severity**: High
**Problem**: 无法验证企业 API 账号。
**Solution**:
- 确认 Phone Number ID 和 Access Token 正确
- 检查 Meta Developer Console Medium的应用状态
- 确认 webhook 验证通过

**Source**: https://github.com/openclaw/openclaw/issues

---

### WHATSAPP-002: 消息模板审核被拒

**Severity**: Medium
**Problem**: 发送模板消息失败。
**Solution**:
- 在 Meta Business 重新提交模板
- 确保模板符合 WhatsApp 政策
- 检查模板状态：必须为 "APPROVED"

**Source**: https://github.com/openclaw/openclaw/discussions

---

### WHATSAPP-003: Webhook 消息重复

**Severity**: Medium
**Problem**: 同一条消息收到多次。
**Solution**:
- 实现消息去重逻辑（使用消息 ID）
- 检查是否在代码Medium多次注册了 webhook

**Source**: https://github.com/openclaw/openclaw/issues

---

### WHATSAPP-004: 媒体文件下载失败

**Severity**: Medium
**Problem**: 无法下载图片/音频/视频。
**Solution**:
- 检查 media URL 是否过期（通常 5 分钟有效）
- 使用 fresh URL 重新下载
- 确认服务器可访问 WhatsApp CDN

**Source**: https://github.com/openclaw/openclaw/discussions
