# OpenClaw 问题排查指南

本文档列出 OpenClaw 常见问题及其解决方案。

## Gateway 问题

### 1. Gateway 无法启动

**症状**：
- `openclaw gateway start` 失败
- 端口 18789 被占用

**排查步骤**：
1. 检查端口占用：
   ```bash
   lsof -i :18789
   netstat -an | grep 18789
   ```
2. 杀掉占用进程或更换端口：
   ```bash
   openclaw gateway --port 18790
   ```
3. 查看详细错误：
   ```bash
   openclaw gateway run
   ```

**常见原因**：
- 配置文件格式错误（JSON 语法错误）
- 缺少必要的环境变量
- 权限问题

---

### 2. Gateway 状态显示 offline

**症状**：
- `openclaw gateway status` 显示 offline
- 但进程似乎在运行

**解决方案**：
1. 重启 Gateway：
   ```bash
   openclaw gateway restart
   ```
2. 检查 Token 是否正确：
   ```bash
   cat ~/.openclaw/.env | grep OPENCLAW_GATEWAY_TOKEN
   ```
3. 检查日志输出

---

### 3. 无法访问控制台 UI

**症状**：
- 浏览器无法打开 `http://127.0.0.1:18789/`

**解决方案**：
1. 确认 Gateway 正在运行：
   ```bash
   openclaw gateway status
   ```
2. 检查防火墙设置
3. 如需远程访问，使用 SSH 隧道（安全）
   ```bash
   ssh -N -L 18789:127.0.0.1:18789 user@gateway-host
   ```

---

## 环境变量问题

### 4. 环境变量不生效

**症状**：
- 配置的 API 密钥未生效
- 提示缺少环境变量

**排查步骤**：
1. 列出当前环境变量：
   ```bash
   env | grep OPENCLAW
   ```
2. 检查优先级：
   - 进程环境 > `.env` > `~/.openclaw/.env` > `openclaw.json`
3. 手动设置并验证：
   ```bash
   export OPENROUTER_API_KEY="your-key"
   openclaw gateway restart
   ```

---

### 5. API 密钥无效

**症状**：
- 调用 API 时返回认证错误

**解决方案**：
1. 登录对应平台检查密钥是否有效
2. 重新生成 API Key
3. 使用 `openclaw onboard` 重新配置
4. 或直接更新 `.env` 文件

---

## 节点问题

### 6. 节点无法连接 Gateway

**症状**：
- 节点一直显示 connecting
- `openclaw nodes status` 无响应

**排查步骤**：
1. 检查 Gateway 是否运行：
   ```bash
   openclaw gateway status
   ```
2. 验证网络连通性：
   ```bash
   ping <gateway-host>
   telnet <gateway-host> 18789
   ```
3. 检查节点配置：
   ```bash
   cat ~/.openclaw/node.json
   ```
4. 重新连接节点：
   ```bash
   openclaw node run --host <gateway-host> --port 18789 --display-name "新节点"
   ```

---

### 7. 节点未批准

**症状**：
- 节点已连接但无法使用

**解决方案**：
```bash
# 在 Gateway 主机上执行
openclaw devices list
openclaw devices approve <requestId>
```

---

## 配置问题

### 8. 配置文件格式错误

**症状**：
- JSON 解析失败
- Gateway 启动报错

**解决方案**：
1. 验证 JSON 格式：
   ```bash
   cat ~/.openclaw/openclaw.json | python3 -m json.tool
   ```
2. 常见错误：
   - 缺少逗号
   - 多余逗号
   - 引号不匹配
   - 尾部逗号

---

### 9. 权限问题

**症状**：
- 无法读取配置文件
- 无法创建日志

**解决方案**：
```bash
# 检查文件权限
ls -la ~/.openclaw/

# 修复权限
chmod 700 ~/.openclaw/
chmod 600 ~/.openclaw/.env
```

---

## 其他问题

### 10. 命令未找到

**症状**：
- `openclaw: command not found`

**解决方案**：
1. 确认安装成功：
   ```bash
   which openclaw
   ```
2. 重新安装：
   ```bash
   curl -fsSL https://openclaw.ai/install.sh | bash
   ```
3. 检查 PATH：
   ```bash
   echo $PATH
   ```

---

### 11. Docker 环境问题

**症状**：
- 在 Docker 中运行异常

**解决方案**：
```bash
# 重启 Gateway 容器
docker compose restart openclaw-gateway

# 完全重建
docker compose down
docker compose up -d
```

---

### 12. macOS 启动问题

**症状**：
- 使用 launchctl 管理时出现问题

**解决方案**：
```bash
# 停止
launchctl stop openclaw

# 启动
launchctl start openclaw

# 查看状态
launchctl list | grep openclaw
```

---

## 获取更多帮助

1. 查看官方文档：https://docs.openclaw.ai
2. 查看 Gateway 日志
3. 使用 `--verbose` 或 `--debug` 参数获取详细输出
4. 搜索 GitHub Issues
