# irc Issues

---

### IRC-001: 连接被拒绝

**Severity**: High
**Problem**: 无法连接到 IRC 服务器。
**Solution**:
- 检查服务器地址和端口
- 确认防火墙允许出站连接
- 检查 SSL/TLS Config

**Source**: GitHub

---

### IRC-002: NickServ 认证失败

**Severity**: Medium
**Problem**: 无法通过 NickServ 认证。
**Solution**:
- 使用正确的 NickServ 密码
- 等待连接建立后再发送认证
- 检查是否需要邮箱验证

**Source**: GitHub

---

### IRC-003: 频道消息频率限制

**Severity**: Medium
**Problem**: 发送过快被服务器禁言。
**Solution**:
- 实现消息延迟
- 遵守服务器 flood 保护
- 添加错误处理

**Source**: 论坛
