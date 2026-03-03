# signal Issues

---

### SIGNAL-001: Signal Service 认证失败

**Severity**: High
**Problem**: 无法注册或登录 Signal 服务。
**Solution**:
- 确认 Signal 账号可用
- 检查手机号格式（带国家代码）
- 验证 2FA 状态

**Source**: https://github.com/openclaw/openclaw/issues

---

### SIGNAL-002: 消息发送失败

**Severity**: High
**Problem**: 发送个人/群组消息失败。
**Solution**:
- 确认接收者已注册 Signal
- 检查网络连接
- 验证权限Config

**Source**: https://github.com/openclaw/openclaw/issues

---

### SIGNAL-003: 附件上传失败

**Severity**: Medium
**Problem**: 无法发送图片/文件。
**Solution**:
- 检查文件大小限制
- 确认文件格式支持
- 验证存储权限

**Source**: https://github.com/openclaw/openclaw/discussions
