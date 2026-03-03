# mattermost Issues

---

### MATTERMOST-001: 机器人消息无法发送

**Severity**: High
**Problem**: 发送消息返回 403 Forbidden。
**Solution**:
- 确认 Bot 用户已激活
- 检查是否在允许发送的频道Medium
- 验证 Bot 是否有 posting 权限

**Source**: GitHub

---

### MATTERMOST-002: OAuth 认证失败

**Severity**: High
**Problem**: 无法获取访问令牌。
**Solution**:
- 确认 Client ID 和 Client Secret 正确
- 检查 Redirect URI 是否完全匹配
- 确认已创建 OAuth 应用

**Source**: GitHub

---

### MATTERMOST-003: Webhook 连接被拒绝

**Severity**: Medium
**Problem**: 无法接收 webhook 事件。
**Solution**:
- 确认 HTTPS 证书有效
- 验证内网穿透/端口转发Config
- 检查 Mattermost 日志Medium的错误

**Source**: 论坛

---

### MATTERMOST-004: 消息格式不正确

**Severity**: Low
**Problem**: 消息Medium的 Markdown 未正确渲染。
**Solution**:
- 使用正确的 Markdown 语法
- 检查是否启用了 markdown 插件

**Source**: 论坛
