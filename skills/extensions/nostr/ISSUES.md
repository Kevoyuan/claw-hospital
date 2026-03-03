# nostr Issues

---

### NOSTR-001: Medium继器连接失败

**Severity**: High
**Problem**: 无法连接到 Nostr Medium继器。
**Solution**:
- 检查Medium继器 URL 可用性
- 确认 WebSocket 连接
- 尝试其他Medium继器

**Source**: https://github.com/openclaw/openclaw/issues

---

### NOSTR-002: 私钥格式错误

**Severity**: High
**Problem**: 无法生成有效签名。
**Solution**:
- 确认私钥是有效的 hex/bech32 格式
- 正确转换为 nsec
- 检查密钥前缀

**Source**: https://github.com/openclaw/openclaw/issues

---

### NOSTR-003: 事件验证失败

**Severity**: Medium
**Problem**: 发布的事件被拒绝。
**Solution**:
- 检查事件签名
- 验证 created_at 时间戳
- 确认 kind 值有效

**Source**: https://github.com/openclaw/openclaw/issues
