# OpenClaw Security科Problem清单

本文档列出 OpenClaw Security相关Problem的Solution。

---

## 目录

- [认证与授权Problem](#认证与授权Problem)
- [数据SecurityProblem](#数据SecurityProblem)
- [隐私泄露Problem](#隐私泄露Problem)
- [访问控制Problem](#访问控制Problem)

---

## 认证与授权Problem

### Problem 1: Gateway Token 泄露

**Severity**: 严重

**ProblemDescription**:
- Gateway Token 被意外泄露
- 未经授权的访问

**Solution**:
1. 立即重置 Token：
   ```
   openclaw gateway token reset
   ```
2. 检查 Token 存储位置的文件权限
3. 不要在代码或日志Medium暴露 Token

---

### Problem 2: API Key 暴露

**Severity**: 严重

**ProblemDescription**:
- API Key 在Config或日志Medium明文显示

**Solution**:
1. 使用Environment变量存储敏感信息：
   ```
   export OPENAI_API_KEY="sk-xxx"
   ```
2. 确保 .env 文件权限为 600：
   ```
   chmod 600 ~/.openclaw/.env
   ```
3. 在 .gitignore Medium添加敏感文件

---

### Problem 3: 未授权的节点连接

**Severity**: High

**ProblemDescription**:
- 未经批准的节点尝试连接 Gateway

**Solution**:
1. 审查节点列表：
   ```
   openclaw nodes list
   ```
2. 拒绝未知节点：
   ```
   openclaw nodes reject <node-id>
   ```
3. 启用节点白名单

---

## 数据SecurityProblem

### Problem 4: 敏感数据写入日志

**Severity**: Medium

**ProblemDescription**:
- 敏感信息被写入日志文件
- 包括 API Key、密码等

**Solution**:
1. 检查日志内容：
   ```
   cat ~/.openclaw/logs/*.log | grep -i "key\|password\|secret"
   ```
2. 启用日志脱敏：
   ```json
   {
     "security": {
       "logRedaction": true
     }
   }
   ```
3. 清理历史日志

---

### Problem 5: Session 数据未加密

**Severity**: Medium

**ProblemDescription**:
- Session 数据以明文存储

**Solution**:
1. 启用加密存储：
   ```json
   {
     "security": {
       "encryptSessions": true
     }
   }
   ```
2. 定期清理 Session 文件

---

### Problem 6: 备份文件包含敏感信息

**Severity**: Low

**ProblemDescription**:
- 自动备份包含未加密的Config和密钥

**Solution**:
1. 排除敏感文件：
   ```
   openclaw backup --exclude "credentials,.env"
   ```
2. 加密备份文件：
   ```
   openclaw backup --encrypt
   ```

---

## 隐私泄露Problem

### Problem 7: 用户消息意外暴露

**Severity**: Medium

**ProblemDescription**:
- 用户私信被记录或转发到其他渠道

**Solution**:
1. 检查消息路由Config
2. 禁用不必要的消息转发
3. 审查插件权限

---

### Problem 8: 上下文Memory泄露

**Severity**: Low

**ProblemDescription**:
- 之前会话的上下文被新会话获取

**Solution**:
1. 清理会话间的共享状态
2. 定期清理 memory 文件
3. 使用独立的 Session ID

---

## 访问控制Problem

### Problem 9: 文件权限过松

**Severity**: High

**ProblemDescription**:
- Config文件权限过于开放
- 其他用户可以读取敏感信息

**Solution**:
```
# 检查当前权限
ls -la ~/.openclaw/

# 修复权限
chmod 700 ~/.openclaw/
chmod 600 ~/.openclaw/.env
chmod 600 ~/.openclaw/openclaw.json
```

---

### Problem 10: 命令执行权限过大

**Severity**: High

**ProblemDescription**:
- exec 插件权限过于宽松
- 允许执行危险的系统命令

**Solution**:
1. 限制 exec 命令白名单：
   ```json
   {
     "plugins": {
       "exec": {
         "allowedCommands": ["git", "npm", "node"]
       }
     }
   }
   ```
2. 禁用危险命令：
   ```
   rm, mv, dd, mkfs, fdisk
   ```

---

### Problem 11: 外部网络访问无限制

**Severity**: Medium

**ProblemDescription**:
- Agent 可以访问任意外部网络资源

**Solution**:
1. Config网络白名单：
   ```json
   {
     "security": {
       "allowedDomains": ["api.openai.com", "api.anthropic.com"]
     }
     }
   ```
2. 启用代理进行流量监控

---

### Problem 12: CVE-2026-25253 - 未认证远程代码执行

**Severity**: Critical

**ProblemDescription**:
- 未认证远程攻击者窃取认证令牌并实现 RCE
- 影响版本: < 2026.1.29

**Solution**:
1. 立即升级到 2026.1.29+：
   ```
   openclaw self-update
   ```
2. 检查日志中的异常访问
3. 重置所有 API Keys

**Source**: https://www.sonicwall.com/blog/openclaw-auth-token-theft-leading-to-rce-cve-2026-25253

---

### Problem 13: ClawJacked - WebSocket 劫持漏洞

**Severity**: Critical

**ProblemDescription**:
- 恶意网站通过 WebSocket 劫持本地 AI Agent
- Gateway 绑定 localhost 且缺少 rate-limiting

**Solution**:
1. 升级到 2026.2.25+
2. 为 localhost 连接启用 rate-limiting
3. 避免在访问恶意网站时运行 OpenClaw

**Source**: https://thehackernews.com/2026/02/clawjacked-flaw-lets-malicious-sites.html

---

### Problem 14: Log Poisoning - 间接 Prompt Injection

**Severity**: High

**ProblemDescription**:
- Log poisoning 漏洞导致间接 prompt injection

**Solution**:
1. 升级到 2026.2.13+
2. 审查日志内容，过滤用户输入

**Source**: Web Search

---

## 快速Diagnosis清单

| 检查项 | 命令 |
|--------|------|
| 文件权限 | `ls -la ~/.openclaw/` |
| API Key 泄露检查 | `grep -r "sk-\|api_key" ~/.openclaw/` |
| 节点列表 | `openclaw nodes list` |
| Token 状态 | `openclaw gateway token status` |
| 日志审计 | `openclaw logs --audit` |

---

## 调试命令

```bash
# 重置 Gateway Token
openclaw gateway token reset

# 检查文件权限
openclaw security check-permissions

# 扫描敏感信息
openclaw security scan

# 加密敏感文件
openclaw security encrypt
```

---

## 相关Config路径

- Config文件：`~/.openclaw/openclaw.json`
- 凭据存储：`~/.openclaw/.env`
- Token 存储：`~/.openclaw/.env`
- 日志目录：`~/.openclaw/logs/`

---

## Security最佳实践

1. 定期轮换 API Keys 和 Tokens
2. 最小权限原则Config插件权限
3. 启用日志审计功能
4. 定期备份并加密备份文件
5. 监控系统访问日志

---

*最后更新：2026-03-04*
