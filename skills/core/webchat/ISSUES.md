# webchat Issues

---

### WEBCHAT-001: WebSocket 连接失败

**Severity**: High
**Problem**: 无法建立 WebSocket 连接。
**Solution**:
- 检查服务器地址
- 确认 WebSocket 支持
- 验证 SSL 证书

**Source**: GitHub

---

### WEBCHAT-002: 会话状态Loss

**Severity**: Medium
**Problem**: 刷新页面后会话重置。
**Solution**:
- 实现 session 持久化
- 使用 localStorage/sessionStorage
- 添加 token 刷新机制

**Source**: GitHub

---

### WEBCHAT-003: 消息顺序错乱

**Severity**: Low
**Problem**: 消息显示顺序不正确。
**Solution**:
- 添加时间戳排序
- 实现消息队列
- 检查网络延迟

**Source**: 论坛
