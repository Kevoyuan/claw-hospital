# behavior-skill Issues

---

### BEHAVIOR-001: Behavior规则未触发

**Severity**: Medium
**Problem**: Config的Behavior条件未执行。
**Solution**:
- 检查规则格式
- 确认规则文件位置
- 使用 debug 模式查看匹配逻辑

**Source**: GitHub

---

### BEHAVIOR-002: 规则冲突

**Severity**: Medium
**Problem**: 多条规则同时匹配。
**Solution**:
- 设置规则优先级
- 使用 first-match 策略
- 合并冲突规则

**Source**: 论坛

---

### BEHAVIOR-003: 自定义Behavior无法加载

**Severity**: Medium
**Problem**: 新增Behavior模块导入失败。
**Solution**:
- 检查模块导出格式
- 确认路径Config正确
- 查看详细Error Log

**Source**: GitHub
