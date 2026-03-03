# msteams Issues

---

### MSTEAMS-001: Azure App Registration Config错误

**Severity**: High
**Problem**: 无法获取访问令牌。
**Solution**:
- 在 Azure Portal 检查 App Registration
- 确认 Client ID, Tenant ID, Client Secret 正确
- 添加所需的 API 权限

**Source**: GitHub

---

### MSTEAMS-002: Bot Framework 验证失败

**Severity**: High
**Problem**: 机器人无法验证身份。
**Solution**:
- 检查 MicrosoftAppId 和 MicrosoftAppPassword
- 确认 Bot 已发布到 Azure
- 验证消息端点 URL

**Source**: GitHub

---

### MSTEAMS-003: 卡片消息不显示

**Severity**: Medium
**Problem**: 发送的 Adaptive Card 未渲染。
**Solution**:
- 验证 JSON 结构符合 Adaptive Cards 规范
- 检查版本兼容性
- 测试不同客户端渲染效果

**Source**: 论坛
