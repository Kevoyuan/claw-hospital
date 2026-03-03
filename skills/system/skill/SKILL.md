---
name: claw-hospital-skill
description: OpenClaw Skills Issue排查与Solution工具箱。用于处理 Skills 创建、使用、Config相关Issue，以及 ClawHub 相关操作Issue。
---

# Claw Hospital - OpenClaw Skills Issue处理指南

本Skill用于排查和处理 OpenClaw Skills 相关的各种Issue。

## 什么是 Skills？

Skills 是模块化的、自包含的扩展包，通过提供专业领域知识、工作流程和工具来扩展 OpenClaw 的能力。可以把它们看作是特定领域的"入门指南"——它们将通用 AI 助手转变为具备专业程序化知识的专用助手。

## 常见Issue分类

### 1. Skills 创建Issue

#### 如何创建新 Skill？

```bash
# 方式一：使用 skill-creator
# 参考 skill-creator SKILL.md Medium的步骤

# 方式二：手动创建目录结构
mkdir my-skill/
mkdir my-skill/scripts/      # 可选：可执行脚本
mkdir my-skill/references/   # 可选：参考资料
mkdir my-skill/assets/       # 可选：资源文件
```

#### Skill 目录结构

```
skill-name/
├── SKILL.md (必需)
│   ├── YAML frontmatter 元数据 (必需)
│   │   ├── name: (必需)
│   │   └── description: (必需)
│   └── Markdown 指令 (必需)
└── 资源文件 (可选)
    ├── scripts/          - 可执行代码 (Python/Bash等)
    ├── references/       - 需要时加载到上下文的文档
    └── assets/           - 用于输出的文件
```

#### SKILL.md 必需格式

```yaml
---
name: skill-name
description: SkillDescription，包含触发条件和用途说明
---
```

**重要**：
- `name`: Skill名称（小写字母、数字和连字符）
- `description**: 这是主要的触发机制，包含Skill功能和触发场景

### 2. Skills 使用Issue

#### 如何触发 Skill？

当用户的请求匹配 Skill 的 `description` 时会自动触发。确保 description 清晰Description：
- Skill功能
- 具体触发场景
- 使用情境

#### 查看可用 Skills

```bash
openclaw skills list
openclaw skills check
```

### 3. ClawHub 使用Issue

#### 安装 ClawHub

```bash
npm i -g clawhub
```

#### 登录 ClawHub

```bash
clawhub login
clawhub whoami
```

#### 搜索 Skills

```bash
clawhub search "关键词"
```

#### 安装 Skill

```bash
clawhub install skill-name
clawhub install skill-name --version 1.2.3
```

#### 更新 Skill

```bash
clawhub update skill-name
clawhub update skill-name --version 1.2.3
clawhub update --all
clawhub update --all --no-input --force
```

#### 发布 Skill

```bash
clawhub publish ./my-skill --slug my-skill --name "My Skill" --version 1.2.0 --changelog "更新内容"
```

### 4. Skill ConfigIssue

#### Config文件位置

- 全局 Skills: `~/.nvm/versions/node/v25.5.0/lib/node_modules/openclaw/skills/`
- 工作区 Skills: `~/.openclaw/workspace/skills/`

#### Environment变量

- `CLAWHUB_REGISTRY`: 覆盖默认注册表 (https://clawhub.com)
- `CLAWHUB_WORKDIR`: 覆盖默认工作目录

#### 默认值

- 注册表: https://clawhub.com
- 工作目录: 当前工作目录
- 安装目录: `./skills`

## 故障排查

### Skill 不触发

1. 检查 `description` 是否清晰Description了触发场景
2. 确认 Skill 已正确安装
3. 查看 OpenClaw 日志

### ClawHub 安装失败

1. 检查 Node.js 版本 (需要 v16+)
2. 尝试清除 npm 缓存: `npm cache clean --force`
3. 查看网络连接

### 发布 Skill 失败

1. 确认已登录: `clawhub whoami`
2. 检查 Skill 格式是否正确
3. 验证 YAML frontmatter 是否完整

## 最佳实践

1. **简洁优先**: 只添加 AI 需要的信息，避免冗余
2. **清晰Description**: description 要具体说明触发场景
3. **资源分离**: 大型参考资料放 references/，小技巧放 SKILL.md
4. **渐进式披露**: 核心内容放 SKILL.md，详细信息放引用文件
