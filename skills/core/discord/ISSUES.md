# discord Issues

---

### DISCORD-001: 消息发送失败 "Cannot send an empty message"

**Severity**: Medium
**Problem**: Sending message returns error "Cannot send an empty message"，but message content appears not empty。
**Solution**: 
- Check if message contains valid characters
- Ensure not sending pure emoji or special whitespace
- 使用 `message.trim()` 确保消息不为空

**Source**: https://github.com/openclaw/openclaw/issues

---

### DISCORD-002: Bot 权限不足导致无法读取消息

**Severity**: High
**Problem**: Bot 加入服务器后无法接收或发送消息。
**Solution**:
- 检查 Bot 是否具有以下权限：
  - Read Messages/View Channels
  - Send Messages
  - Manage Messages (如需删除)
- 在 Discord Developer Portal 检查 OAuth2 权限
- 重新授权 Bot，邀请链接添加权限参数

**Source**: https://github.com/openclaw/openclaw/issues

---

### DISCORD-003: 频道消息频率限制

**Severity**: Medium
**Problem**: 发送消息时经常收到速率限制错误。
**Solution**:
- 实现消息队列和延迟发送
- 使用 `rateLimitPerUser` 参数限制用户
- 遵守 Discord 的 5 请求/秒限制
- 添加重试机制处理 429 错误

**Source**: https://github.com/openclaw/openclaw/discussions

---

### DISCORD-004: 长消息被截断

**Severity**: Low
**Problem**: 发送的长消息被 Discord 截断。
**Solution**:
- Discord 消息限制 2000 字符
- 实现消息分片：
  ```javascript
  const chunks = message.match(/[\s\S]{1,1900}/g);
  for (const chunk of chunks) {
    await channel.send(chunk);
  }
  ```

**Source**: https://github.com/openclaw/openclaw/issues

---

### DISCORD-005: Webhook 消息重复发送

**Severity**: Medium
**Problem**: 使用 Webhook 时消息重复发送。
**Solution**:
- 消息发送后立即删除原始消息
- 实现消息 ID 缓存避免重复
- 检查是否触发了多次事件监听

**Source**: https://github.com/openclaw/openclaw/discussions
