# matrix Issues

---

### MATRIX-001: 登录失败

**Severity**: High
**Problem**: 无法登录 Matrix 服务器。
**Solution**:
- 检查 homeserver URL
- 确认用户名和密码正确
- 验证设备 ID

**Source**: GitHub

---

### MATRIX-002: 房间邀请失败

**Severity**: Medium
**Problem**: 无法邀请 Bot 到房间。
**Solution**:
- 确认 Bot 已加入房间
- 检查权限设置
- 使用房间 ID 而非别名

**Source**: GitHub

---

### MATRIX-003: 加密消息处理

**Severity**: High
**Problem**: 无法解密加密消息。
**Solution**:
- 实现 olm/megolm 加密
- 正确存储设备密钥
- 检查加密房间状态

**Source**: GitHub
