# googlechat Issues

---

### GOOGLECHAT-001: Google API 授权失败

**Severity**: High
**Problem**: 无法获取访问令牌。
**Solution**:
- 在 Google Cloud Console Config OAuth
- 检查 scopes 权限
- 确认 API 已启用

**Source**: GitHub

---

### GOOGLECHAT-002: Bot 无法加入群聊

**Severity**: High
**Problem**: 机器人无法加入群组。
**Solution**:
- 确认启用了"群聊Medium的 Bot"
- 检查管理员设置
- 使用直接消息先激活 Bot

**Source**: GitHub

---

### GOOGLECHAT-003: 卡片消息不渲染

**Severity**: Medium
**Problem**: 发送的卡片格式不正确。
**Solution**:
- 验证 JSON 格式符合 Google Chat 规范
- 检查 widgets 结构
- 测试不同客户端

**Source**: 论坛
