# feishu Issues

---

### FEISHU-001: App ID 或 App Secret 无效

**Severity**: High
**Problem**: 获取 tenant_access_token 失败。
**Solution**:
- 在飞书开放平台检查 App 状态
- 确认已启用应用能力
- 重新生成 App Secret

**Source**: https://github.com/openclaw/openclaw/issues

---

### FEISHU-002: 权限不足

**Severity**: High
**Problem**: API 返回 "Permission denied" 错误。
**Solution**:
- 在飞书管理后台添加应用到可用范围
- 确认已申请所需权限：
  - im:chat:readonly
  - im:message:readonly
  - im:message:send_as_bot

**Source**: https://github.com/openclaw/openclaw/issues

---

### FEISHU-003: 卡片消息渲染失败

**Severity**: Medium
**Problem**: 发送的卡片消息无法正常显示。
**Solution**:
- 验证 JSON 结构是否符合飞书规范
- 检查 image_key 是否有效
- 确保 card_config 参数正确

**Source**: https://github.com/openclaw/openclaw/discussions

---

### FEISHU-004: 事件订阅验证失败

**Severity**: High
**Problem**: Webhook URL 验证不通过。
**Solution**:
- 返回正确的 challenge 参数
- 确认 Encrypt Key Config正确
- 验证签名算法

**Source**: https://github.com/openclaw/openclaw/issues

---

### FEISHU-005: 机器人不在群聊Medium

**Severity**: Medium
**Problem**: 无法向私聊/群聊发送消息。
**Solution**:
- 用户必须先 @机器人 或发送消息
- 使用 `im/v1/chats` API 获取可用聊天列表

**Source**: https://github.com/openclaw/openclaw/discussions
