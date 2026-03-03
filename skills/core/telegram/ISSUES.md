# telegram Issues

---

### TELEGRAM-001: Bot API Token 无效

**Severity**: High
**Problem**: 发送消息时返回 "Unauthorized" 错误。
**Solution**:
- 在 @BotFather 检查 Bot Token
- 重新生成 Token：发送 /revoke 给 @BotFather
- 确认 .env 文件Medium TELEGRAM_BOT_TOKEN 正确

**Source**: https://github.com/openclaw/openclaw/issues

---

### TELEGRAM-002: 消息长度超过 4096 字符限制

**Severity**: Low
**Problem**: 长消息发送失败。
**Solution**:
- Telegram API 限制 4096 字符
- 实现消息分片发送
- 使用 Telegram 的 markdown/HTML 解析

**Source**: https://github.com/openclaw/openclaw/issues

---

### TELEGRAM-003: Webhook 设置失败

**Severity**: High
**Problem**: 设置 Webhook 时连接被拒绝。
**Solution**:
- 确认 HTTPS 证书有效（Let's Encrypt 可用）
- 验证 URL 可公开访问
- 检查防火墙/端口是否开放
- 使用 `openclaw extensions telegram setup` 命令

**Source**: https://github.com/openclaw/openclaw/discussions

---

### TELEGRAM-004: 回调查询无响应

**Severity**: Medium
**Problem**: 点击 inline keyboard 后没有响应。
**Solution**:
- 确保正确处理 callback_query 事件
- 正确设置 callback_data
- 在 30 秒内回复（ Telegram 限制）

**Source**: https://github.com/openclaw/openclaw/issues

---

### TELEGRAM-005: 文件上传失败

**Severity**: Medium
**Problem**: 上传文件/图片时出错。
**Solution**:
- 检查文件大小限制（最大 50MB）
- 确认文件格式支持
- 使用正确的 input_file 格式

**Source**: https://github.com/openclaw/openclaw/discussions
