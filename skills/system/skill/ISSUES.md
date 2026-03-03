# OpenClaw Skills Problem列表 (ISSUES.md)

本文档记录 OpenClaw Skills 使用过程Medium遇到的常见Problem和Solution。

## 目录

- [创建Problem](#创建Problem)
- [使用Problem](#使用Problem)
- [ClawHub Problem](#clawhub-Problem)
- [ConfigProblem](#ConfigProblem)
- [加载与触发Problem](#加载与触发Problem)

---

## 创建Problem

### Q1: 如何创建新的 Skill？

**ProblemDescription**: 用户不知道如何开始创建自己的 Skill。

**Solution**:
1. 手动创建目录结构
2. 编写 SKILL.md 文件（必需包含 YAML frontmatter）
3. 添加可选的资源文件（scripts/, references/, assets/）

**参考**: 参见 skill-creator SKILL.md

---

### Q2: Skill 的 name 有什么命名规范？

**ProblemDescription**: 创建 Skill 时名称格式不正确。

**Solution**:
- 使用小写字母、数字和连字符
- 长度不超过 64 个字符
- 示例: `my-skill`, `pdf-editor`, `github-pr`

---

### Q3: description 怎么写才能正确触发？

**ProblemDescription**: Skill 创建后无法被正确触发。

**Solution**:
description 应该包含：
1. Skill功能Description
2. 具体触发场景（用 "when" 或 "use when" Description）
3. 适用情境

示例:
```yaml
description: "Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. Use when: (1) Creating new documents, (2) Modifying or editing content, (3) Working with tracked changes"
```

---

### Q4: 资源文件应该放在哪里？

**ProblemDescription**: 不确定哪些文件应该放在 scripts/, references/, 还是 assets/。

**Solution**:

| 目录 | 用途 | 示例 |
|------|------|------|
| `scripts/` | 可执行代码，需要确定性执行 | `rotate_pdf.py` |
| `references/` | 需要加载到上下文的参考资料 | API文档、模板 |
| `assets/` | 输出Medium使用的文件，不加载到上下文 | 图片、图标、模板 |

---

## 使用Problem

### Q5: Skill 不触发怎么办？

**ProblemDescription**: 创建了 Skill 但 OpenClaw 没有触发它。

**可能原因**:
1. description 不够具体
2. Skill 未正确安装
3. 触发关键词不在当前会话Medium

**Solution**:
1. 优化 description，加入具体触发场景
2. 确认 Skill 位于正确目录
3. 使用 `openclaw skills check` 检查

---

### Q6: 如何查看已安装的 Skills？

**Solution**:
```bash
openclaw skills list
openclaw skills check
```

---

### Q7: 多个 Skills 同时触发怎么办？

**ProblemDescription**: 请求可能匹配多个 Skills。

**Solution**:
- OpenClaw 会根据 description 匹配度选择最合适的
- 保持 description 简洁、专注单一功能
- 避免功能重叠的 Skills

---

### Q8: Skill 执行失败

**ProblemDescription**: Skill 被触发但执行失败。

**Solution**:
1. 检查脚本语法错误
2. 验证依赖是否安装
3. 查看日志：
   ```
   openclaw logs --tail 50
   ```

---

## ClawHub Problem

### Q9: ClawHub 安装失败

**ProblemDescription**: `npm i -g clawhub` 失败。

**Solution**:
1. 检查 Node.js 版本 (需要 v16+): `node --version`
2. 清除 npm 缓存: `npm cache clean --force`
3. 使用 sudo (macOS/Linux): `sudo npm i -g clawhub`
4. 检查网络连接

---

### Q10: 登录 ClawHub 失败

**ProblemDescription**: 无法登录 ClawHub。

**Solution**:
1. 确认账号已在 https://clawhub.com 注册
2. 检查 CLI 版本: `clawhub --version`
3. 尝试重新登录: `clawhub logout && clawhub login`

---

### Q11: 安装 Skill 提示找不到

**ProblemDescription**: `clawhub install xxx` 提示找不到。

**Solution**:
1. 确认 Skill 名称正确
2. 搜索可用 Skills: `clawhub search xxx`
3. 检查网络连接
4. 尝试指定版本: `clawhub install xxx --version x.x.x`

---

### Q12: 更新 Skill 失败

**ProblemDescription**: `clawhub update` 命令执行失败。

**Solution**:
1. 强制更新: `clawhub update xxx --force`
2. 检查本地文件是否被修改
3. 查看详细错误信息

---

### Q13: 发布 Skill 被拒绝

**ProblemDescription**: `clawhub publish` 失败。

**可能原因**:
1. 未登录
2. Skill 格式不符合要求
3. 名称已存在

**Solution**:
1. 确认已登录: `clawhub whoami`
2. 检查 SKILL.md 格式
3. 使用唯一名称

---

## ConfigProblem

### Q14: 自定义 Skill 安装目录

**ProblemDescription**: 想把 Skill 安装到指定目录。

**Solution**:
```bash
# 使用 --dir 参数
clawhub install my-skill --dir ./my-skills

# 或设置Environment变量
export CLAWHUB_WORKDIR=/path/to/workdir
```

---

### Q15: 使用私有 ClawHub 注册表

**ProblemDescription**: 需要连接私有注册表。

**Solution**:
```bash
# 使用 --registry 参数
clawhub install my-skill --registry https://private.clawhub.com

# 或设置Environment变量
export CLAWHUB_REGISTRY=https://private.clawhub.com
```

---

### Q16: Skills 加载路径

**ProblemDescription**: 不确定 OpenClaw 从哪里加载 Skills。

**Solution**:
OpenClaw 从以下位置加载 Skills（按优先级）:
1. 工作区: `~/.openclaw/workspace/skills/`
2. 全局: `~/.nvm/versions/node/v25.5.0/lib/node_modules/openclaw/skills/`

---

### Q17: Skill 依赖外部工具

**ProblemDescription**: Skill 需要外部命令但未安装。

**Solution**:
在 SKILL.md 的 metadata Medium声明依赖:
```yaml
---
name: my-skill
description: ...
metadata:
  {
    "openclaw":
      {
        "requires": { "bins": ["python3", "ffmpeg"] },
        "install":
          [
            { "id": "python3", "kind": "bin", "label": "Python 3" },
          ],
      },
  }
---
```

---

## 加载与触发Problem

### Q18: Skill 加载失败

**ProblemDescription**: Skill 无法被加载。

**Solution**:
1. 验证 SKILL.md 格式正确
2. 检查 YAML frontmatter 是否完整
3. 确认目录结构正确

---

### Q19: SkillDescription触发但执行错误

**ProblemDescription**: 触发了 Skill 但执行时出错。

**Solution**:
1. 检查脚本文件是否存在
2. 验证脚本可执行权限
3. 检查依赖是否安装

---

### Q20: Skill 缓存Problem

**ProblemDescription**: 修改 Skill 后没有生效。

**Solution**:
```bash
# 清除 Skill 缓存
openclaw skills clear-cache

# 重新加载
openclaw gateway restart
```

---

## 常见错误代码

| 错误 | 说明 | Solution |
|------|------|----------|
| E404 | Skill 不存在 | 检查名称或搜索可用 Skills |
| E401 | 未授权 | 运行 `clawhub login` |
| E500 | 服务器错误 | 稍后重试 |
| ENOENT | 文件不存在 | 检查路径是否正确 |

---

## 获取帮助

- 查看官方文档
- 使用 `clawhub --help`
- 查看 skill-creator Skill文档
