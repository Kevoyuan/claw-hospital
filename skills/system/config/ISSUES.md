# OpenClaw Problem排查指南

本文档列出 OpenClaw 常见Problem及其Solution。

## 目录

- [Gateway Problem](#gateway-Problem)
- [Environment变量Problem](#Environment变量Problem)
- [节点Problem](#节点Problem)
- [ConfigProblem](#ConfigProblem)
- [插件ConfigProblem](#插件ConfigProblem)
- [其他Problem](#其他Problem)

---

## Gateway Problem

### 1. Gateway 无法Startup

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
- Config文件格式错误（JSON 语法错误）
- 缺少必要的Environment变量
- 权限Problem

---

### 2. Gateway 状态显示 offline

**症状**：
- `openclaw gateway status` 显示 offline
- 但进程似乎在运行

**Solution**：
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

**Solution**：
1. 确认 Gateway 正在运行：
   ```bash
   openclaw gateway status
   ```
2. 检查防火墙设置
3. 如需远程访问，使用 SSH 隧道（Security）
   ```bash
   ssh -N -L 18789:127.0.0.1:18789 user@gateway-host
   ```

---

### 4. Gateway Startup后立即退出

**症状**：
- Gateway Startup后几秒内退出
- 日志显示端口被占用或Config错误

**Solution**：
1. 检查完整Error Log：
   ```
   openclaw logs --tail 100
   ```
2. 验证Config文件格式
3. 清理 stale 进程

---

## Environment变量Problem

### 5. Environment变量不生效

**症状**：
- Config的 API 密钥未生效
- 提示缺少Environment变量

**排查步骤**：
1. 列出当前Environment变量：
   ```bash
   env | grep OPENCLAW
   ```
2. 检查优先级：
   - 进程Environment > `.env` > `~/.openclaw/.env` > `openclaw.json`
3. 手动设置并验证：
   ```bash
   export OPENROUTER_API_KEY="your-key"
   openclaw gateway restart
   ```

---

### 6. API 密钥无效

**症状**：
- 调用 API 时返回认证错误

**Solution**：
1. 登录对应平台检查密钥是否有效
2. 重新生成 API Key
3. 使用 `openclaw onboard` 重新Config
4. 或直接更新 `.env` 文件

---

### 7. 多 Provider Environment变量冲突

**症状**：
- 多个 Provider 的 API Key 混淆
- 使用了错误的密钥

**Solution**：
1. 明确每个 Provider 的Environment变量前缀
2. 使用 models.json 分别Config
3. 验证当前使用的密钥

---

## 节点Problem

### 8. 节点无法连接 Gateway

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
3. 检查节点Config：
   ```bash
   cat ~/.openclaw/node.json
   ```
4. 重新连接节点：
   ```bash
   openclaw node run --host <gateway-host> --port 18789 --display-name "新节点"
   ```

---

### 9. 节点未批准

**症状**：
- 节点已连接但无法使用

**Solution**：
```bash
# 在 Gateway 主机上执行
openclaw devices list
openclaw devices approve <requestId>
```

---

### 10. 节点屏幕截图失败

**症状**：
- 节点在线但无法截屏
- 权限被拒绝

**Solution**：
1. 授予屏幕录制权限
2. 检查 macOS 隐私设置
3. 重新配对节点

---

## ConfigProblem

### 11. Config文件格式错误

**症状**：
- JSON 解析失败
- Gateway Startup报错

**Solution**：
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

### 12. 权限Problem

**症状**：
- 无法读取Config文件
- 无法创建日志

**Solution**：
```bash
# 检查文件权限
ls -la ~/.openclaw/

# 修复权限
chmod 700 ~/.openclaw/
chmod 600 ~/.openclaw/.env
```

---

### 13. 插件Config不生效

**症状**：
- 修改了插件Config但没有效果

**Solution**：
1. 重启 Gateway 加载新Config：
   ```
   openclaw gateway restart
   ```
2. 检查Config路径是否正确
3. 验证 JSON 格式

---

### 14. 默认Config被覆盖

**症状**：
- 某些Config项被意外重置

**Solution**：
1. 使用版本控制备份Config
2. 使用 `openclaw config export` 备份
3. 手动合并Config

---

## 插件ConfigProblem

### 15. 插件加载失败

**症状**：
- 插件未正确加载
- 工具列表Medium看不到插件

**Solution**：
1. 检查插件是否安装：
   ```
   openclaw plugins list
   ```
2. 重新安装插件：
   ```
   openclaw plugins install <plugin-name> --force
   ```
3. 查看插件日志

---

### 16. 插件依赖缺失

**症状**：
- 插件运行时提示缺少依赖

**Solution**：
1. 手动安装依赖：
   ```
   cd ~/.openclaw/extensions/<plugin-name>
   npm install
   ```
2. 重启 Gateway

---

### 17. 插件版本不兼容

**症状**：
- 插件与当前 OpenClaw 版本不兼容

**Solution**：
1. 检查版本兼容性：
   ```
   openclaw version
   openclaw plugins info <plugin-name>
   ```
2. 升级或降级插件
3. 等待官方更新

---

## 其他Problem

### 18. 命令未找到

**症状**：
- `openclaw: command not found`

**Solution**：
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

### 19. Docker EnvironmentProblem

**症状**：
- 在 Docker Medium运行Abnormal

**Solution**：
```bash
# 重启 Gateway 容器
docker compose restart openclaw-gateway

# 完全重建
docker compose down
docker compose up -d
```

---

### 20. macOS StartupProblem

**症状**：
- 使用 launchctl 管理时出现Problem

**Solution**：
```bash
# 停止
launchctl stop openclaw

# Startup
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
