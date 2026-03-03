# Deployment Guide

## Quick Start (Local)

```bash
git clone https://github.com/Kevoyuan/claw-hospital.git
cd claw-hospital
node server.js
# Open http://localhost:3000
```

---

## For Agent Connection (Public API)

To allow other agents/nodes to connect, you need a **publicly accessible API**.

### Option 1: Vercel (Recommended for APIs)

```bash
# Install Vercel
npm i -g vercel

# Create api/diagnose.js
mkdir -p api
```

Create `api/diagnose.js`:
```javascript
const DEPARTMENT_RULES = {
  emergency: {
    keywords: ['启动', '启动失败', '崩溃', 'crash', '无响应', ...],
    skillPath: 'emergency-skill'
  },
  // ... other departments
};

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  const { description } = req.body || {};
  
  // Match department
  let department = null;
  const desc = (description || '').toLowerCase();
  
  for (const [dept, rule] of Object.entries(DEPARTMENT_RULES)) {
    if (rule.keywords.some(k => desc.includes(k.toLowerCase()))) {
      department = dept;
      break;
    }
  }
  
  if (!department) {
    res.status(404).json({ error: 'No matching department found' });
    return;
  }
  
  // Return solutions
  res.json({
    success: true,
    department: department,
    solutions: { 
      message: 'Please check the SKILL.md in skills/' + department 
    }
  });
};
```

Deploy:
```bash
vercel --prod
```

### Option 2: Railway / Render

1. Push to GitHub
2. Connect repo to Railway/Render
3. Set start command: `node server.js`
4. Get public URL

---

## Agent Integration Example

### HTTP Request

```bash
curl -X POST https://your-domain.com/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{"description": "OpenClaw cannot start"}'
```

### Response

```json
{
  "success": true,
  "department": "emergency",
  "departmentName": "Emergency - Startup/Crash issues",
  "solutions": {
    "commands": ["openclaw gateway status", "ps aux | grep openclaw", ...]
  }
}
```

### In Agent Code

```javascript
async function diagnose(problem) {
  const response = await fetch('https://your-domain.com/api/diagnose', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description: problem })
  });
  const result = await response.json();
  
  if (result.success) {
    // Execute the suggested commands
    for (const cmd of result.solutions.commands || []) {
      await exec(cmd);
    }
  }
  
  return result;
}
```

---

## Security Considerations

### ⚠️ Important: CVE-2026-25253

If deploying to cloud, ensure:

1. **Never bind Gateway to 0.0.0.0**
2. **Use SSH Tunnel or Cloudflare Tunnel**
3. **Update to v2026.1.29+**

### For Claw Hospital API

The API itself is read-only (diagnose only), so it's relatively safe. But:

- Add rate limiting in production
- Add API key authentication if needed
- Use HTTPS

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |

---

## Production Checklist

- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] API key (optional)
- [ ] Health check endpoint
- [ ] Logs monitoring
- [ ] Backup strategy
