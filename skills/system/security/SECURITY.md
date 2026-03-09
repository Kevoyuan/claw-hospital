# Security Department

OpenClaw Security Issues, Vulnerabilities, and Hardening Guide

---

## CVE Vulnerabilities

### CVE-2026-25253 - Remote Code Execution (RCE)

**Severity**: CRITICAL

**Description**: 
- One-click RCE vulnerability
- Attacker sends malicious link
- Through WebSocket, obtains user Token
- Can execute commands directly on user machine

**Affected Versions**: < v2026.1.29

**Fix**: Upgrade to v2026.1.29 or later

---

### CVE-2026-25254 - ClawJacked (Website Hijacking)

**Severity**: HIGH

**Description**: 
- Malicious websites can hijack local OpenClaw Agent
- Through WebSocket connection
- Can execute commands without user knowledge

**Affected Versions**: < v2026.2.26

**Fix**: Upgrade to v2026.2.26 or later

---

### CVE-2026-26322 - SSRF in Gateway Tool

**Severity**: MEDIUM

**Description**: 
- Server-Side Request Forgery vulnerability
- Can be exploited to access internal resources

**Fix**: Already fixed in latest version

---

### CVE-2026-26329 - Browser Upload Path Traversal

**Severity**: MEDIUM

**Description**: 
- Path traversal in file upload functionality
- Can potentially write files to unexpected locations

**Fix**: Already fixed in latest version

---

## Common Security Issues

| 病历号 | 问题 | 解决方案 |
|--------|------|----------|
| SEC-006 | 间接 Prompt Injection | 审查输入，过滤恶意内容 |
| SEC-007 | 恶意 Skills/Plugins | 只使用可信来源的 Skills |
| SEC-008 | 数万实例暴露到互联网 | 使用 Cloudflare/Tailscale，禁止 0.0.0.0 |

---

## Public Exposure Issues

### OpenClaw Exposure Watchboard

**Issue**: 230,000+ OpenClaw instances exposed to public internet

**Risks**:
- API Key leakage
- Chat record exposure
- Unauthorized access
- Token theft

**Causes**:
- Default configuration deployed to cloud servers
- Gateway bound to 0.0.0.0 instead of 127.0.0.1
- Port 18789 directly exposed without firewall

---

## Security Checklist

| Item | Command | Status |
|------|---------|--------|
| Version >= v2026.1.29 | `openclaw --version` | |
| Gateway bound to 127.0.0.1 | `openclaw gateway status \| grep bind` | |
| Port 18789 not exposed | Check firewall | |
| Authentication enabled | Check config | |

---

## Hardening Guide

### 1. Gateway Binding

```bash
# WRONG - Exposed to public
openclaw gateway start --bind 0.0.0.0

# CORRECT - Local only
openclaw gateway start --bind 127.0.0.1
# or
openclaw gateway start
```

### 2. Use SSH Tunnel or Cloudflare Tunnel

```bash
# SSH Tunnel (recommended)
ssh -L 18789:localhost:18789 user@vps

# Or Cloudflare Tunnel
cloudflared tunnel --url localhost:18789
```

### 3. Firewall

```bash
# iptables
sudo iptables -A INPUT -p tcp --dport 18789 -s 127.0.0.1 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 18789 -j DROP
```

### 4. Update Regularly

```bash
# Check version
openclaw --version

# Update
npm install openclaw@latest -g
```

### 5. Check If Exposed

1. Visit OpenClaw Exposure Watchboard
2. Search for your IP address
3. If found, reset all credentials immediately

---

## Best Practices

### For IM-only Users (Telegram/Feishu/Slack)

- No need to expose port 18789
- No public IP needed
- Just ensure external network connectivity

### For Remote Access

- Use SSH tunnel
- Use Cloudflare Tunnel
- Never bind to 0.0.0.0

### For API Access

- Use authentication
- Rotate API keys regularly
- Monitor access logs

---

## Related Articles

- [OpenClaw Exposure Watchboard](https://example.com) - Public exposure monitoring
- [CVE-2026-25253 Details](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2026-25253)
- [OpenClaw Security Best Practices](https://docs.openclaw.ai/security)

---

## Emergency Response

If you suspect compromise:

1. **Disconnect** - Stop Gateway immediately
2. **Reset** - Reset all API keys and tokens
3. **Update** - Upgrade to latest version
4. **Check** - Review access logs
5. **Reconfigure** - Apply hardening settings

---

## Contact

For security issues, contact: security@openclaw.ai

---

*Last Updated: 2026-03-03*
