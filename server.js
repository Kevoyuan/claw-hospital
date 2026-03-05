#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

// GitHub raw URL for skills
const GITHUB_RAW = 'https://raw.githubusercontent.com/Kevoyuan/claw-hospital/master/skills';

// Fetch from GitHub
function fetchFromGitHub(skillPath) {
  return new Promise((resolve, reject) => {
    const url = GITHUB_RAW + '/' + skillPath + '/SKILL.md';
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) resolve(data);
        else resolve(null);
      });
    }).on('error', reject);
  });
}

// Get department solutions from GitHub
async function getDepartmentSolutions(dept) {
  const deptMap = {
    'discord': 'core/discord',
    'whatsapp': 'core/whatsapp',
    'telegram': 'core/telegram',
    'slack': 'core/slack',
    'signal': 'core/signal',
    'runtime': 'system/runtime',
    'crash': 'system/crash',
    'behavior': 'system/behavior',
    'webui': 'system/webui',
    'mobile': 'system/mobile',
    'feishu': 'extensions/feishu',
    'line': 'extensions/line',
    'matrix': 'extensions/matrix',
    'teams': 'extensions/teams'
  };
  
  const githubPath = deptMap[dept];
  if (!githubPath) return null;
  
  const content = await fetchFromGitHub(githubPath);
  if (!content) return null;
  
  // Extract solutions from markdown
  const solutions = [];
  const lines = content.split('\n');
  let inSolutions = false;
  for (const line of lines) {
    if (line.includes('## ')) inSolutions = false;
    if (line.includes('## 解决方案') || line.includes('## Solutions')) inSolutions = true;
    if (inSolutions && line.trim() && !line.startsWith('#') && !line.startsWith('##')) {
      solutions.push(line.trim());
    }
  }
  return solutions.length > 0 ? solutions : null;
}

const PORT = process.env.PORT || 3000;

let totalConsults = 0;
let totalVisits = 0;
let todayConsults = 0;
let currentDay = new Date().toDateString();
let departmentCounts = {
  'emergency': 0,
  'neuro': 0,
  'memory': 0,
  'behavior': 0,
  'discord': 0,
  'whatsapp': 0,
  'config': 0,
  'model': 0
};
let totalApiCalls = 0;

const DEPARTMENT_RULES = {
    // SYSTEM
    'runtime': {
        keywords: ['runtime', 'tooling', 'agent', '启动', '启动失败'],
        skillPath: 'skills/system/runtime'
    },
    'crash': {
        keywords: ['crash', '崩溃', 'exit', 'died', '挂掉', '宕机', 'down', 'not responding'],
        skillPath: 'skills/system/crash'
    },
    'behavior': {
        keywords: ['behavior', 'incorrect', 'wrong', '行为', '异常', '不对'],
        skillPath: 'skills/system/behavior'
    },
    'webui': {
        keywords: ['webui', 'web-ui', 'interface', 'ui', '界面'],
        skillPath: 'skills/system/webui'
    },
    'mobile': {
        keywords: ['mobile', 'ios', 'android', 'app'],
        skillPath: 'skills/system/mobile'
    },
    // CORE
    'discord': {
        keywords: ['discord', 'dc', 'Discord'],
        skillPath: 'skills/core/discord'
    },
    'telegram': {
        keywords: ['telegram', 'tg', 'Telegram'],
        skillPath: 'skills/core/telegram'
    },
    'whatsapp': {
        keywords: ['whatsapp', 'wa', 'WhatsApp'],
        skillPath: 'skills/core/whatsapp'
    },
    'slack': {
        keywords: ['slack', 'Slack'],
        skillPath: 'skills/core/slack'
    },
    'signal': {
        keywords: ['signal', 'Signal'],
        skillPath: 'skills/core/signal'
    },
    // EXTENSIONS
    'feishu': {
        keywords: ['feishu', '飞书', 'Feishu', 'lark'],
        skillPath: 'skills/extensions/feishu'
    },
    'line': {
        keywords: ['line', 'Line'],
        skillPath: 'skills/extensions/line'
    },
    'matrix': {
        keywords: ['matrix', 'Matrix'],
        skillPath: 'skills/extensions/matrix'
    },
    'teams': {
        keywords: ['teams', 'Teams', 'msteams'],
        skillPath: 'skills/extensions/msteams'
    },
    'mattermost': {
        keywords: ['mattermost', 'Mattermost'],
        skillPath: 'skills/extensions/mattermost'
    },
    'nostr': {
        keywords: ['nostr', 'Nostr'],
        skillPath: 'skills/extensions/nostr'
    },
    'twitch': {
        keywords: ['twitch', 'Twitch'],
        skillPath: 'skills/extensions/twitch'
    }
};

const BASE_DIR = __dirname;

// 读取科室的 SKILL.md 并解析解决方案
function getDepartmentSolution(department) {
  const rule = DEPARTMENT_RULES[department];
  if (!rule) return null;

  const skillPath = path.join(BASE_DIR, rule.skillPath, 'SKILL.md');
  
  try {
    if (fs.existsSync(skillPath)) {
      const content = fs.readFileSync(skillPath, 'utf-8');
      return parseSkillMarkdown(content);
    }
  } catch (e) {
    console.error(`Error reading skill file: ${e.message}`);
  }
  
  return null;
}

// 解析 SKILL.md 内容，提取解决方案
function parseSkillMarkdown(content) {
  const solutions = [];
  
  // 提取诊断流程
  const diagnosticMatch = content.match(/## 诊断流程([\s\S]*?)##/);
  if (diagnosticMatch) {
    solutions.push({
      type: 'diagnostic',
      content: diagnosticMatch[1].trim()
    });
  }
  
  // 提取解决方案
  const solutionsMatch = content.match(/## 解决方案([\s\S]*?)##/);
  if (solutionsMatch) {
    solutions.push({
      type: 'solutions',
      content: solutionsMatch[1].trim()
    });
  }
  
  // 提取常见命令
  const commandsMatch = content.match(/```bash[\s\S]*?```/g);
  if (commandsMatch) {
    const commands = commandsMatch.map(cmd => {
      return cmd.replace(/```bash\n?/g, '').replace(/```$/g, '').trim();
    });
    solutions.push({
      type: 'commands',
      content: commands
    });
  }
  
  return solutions;
}

// 根据问题描述匹配科室
function matchDepartment(description) {
  const desc = description.toLowerCase();
  
  let bestMatch = null;
  let maxScore = 0;
  
  for (const [dept, rule] of Object.entries(DEPARTMENT_RULES)) {
    let score = 0;
    for (const keyword of rule.keywords) {
      if (desc.includes(keyword.toLowerCase())) {
        score += keyword.length;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = dept;
    }
  }
  
  return bestMatch;
}

// API 路由处理
function handleRequest(req, res) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // 解析 URL
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  
  // API 路由
  
  // Agent 自动诊断入口 - 访问自动诊断
  if (pathname === '/api/agent' && req.method === 'GET') {
    totalVisits++;
    // 返回引导 Agent 进行诊断的信息
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      type: 'agent-visit',
      visitCount: totalVisits,
      message: 'Agent detected. Use POST /api/diagnose with description to get diagnosis.',
      example: {
        method: 'POST',
        url: '/api/diagnose',
        body: { description: 'OpenClaw Discord not responding' }
      }
    }));
    return;
  }
  if (pathname === '/api/diagnose' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { description } = JSON.parse(body);
        
        if (!description) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing description' }));
          return;
        }
        
        totalApiCalls++;
        
        // Reset today's count if it's a new day
        const today = new Date().toDateString();
        if (today !== currentDay) {
          currentDay = today;
          todayConsults = 0;
        }

        const department = matchDepartment(description);
        
        if (department) {
          totalConsults++;
          todayConsults++;
          if (departmentCounts[department] !== undefined) {
            departmentCounts[department]++;
          }
        }
        
        if (!department) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Cannot determine department',
            message: '无法确定问题所属科室，请描述更详细的问题'
          }));
          return;
        }
        
        const solutions = await getDepartmentSolutions(department);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          department: department,
          departmentName: getDepartmentName(department),
          description: description,
          solutions: solutions,
          matched: true
        }, null, 2));
        
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }
  
  // 获取科室列表
  if (pathname === '/api/departments' && req.method === 'GET') {
    const departments = Object.keys(DEPARTMENT_RULES).map(key => ({
      id: key,
      name: getDepartmentName(key),
      keywords: DEPARTMENT_RULES[key].keywords.slice(0, 5)
    }));
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ departments }, null, 2));
    return;
  }
  
  // 健康检查
  if (pathname === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'Claw Hospital API' }));
    return;
  }  // Security check endpoint
  if (pathname === '/api/security' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      checks: {
        version: { 
          current: "2026.2.26", 
          latest: "2026.1.29",
          warning: "Update required if current < latest" 
        },
        gateway: { 
          bind: "127.0.0.1",
          exposed: "Check with: openclaw gateway status | grep bind"
        },
        cve: {
          "CVE-2026-25253": "Fixed in v2026.1.29+"
        }
      },
      recommendations: [
        "Update to latest version",
        "Ensure Gateway binds to 127.0.0.1",
        "Never expose port 18789 to public",
        "Use SSH tunnel or Cloudflare Tunnel"
      ]
    }, null, 2));
    return;
  }
  // API Schema
  if (pathname === '/api/schema' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      endpoint: '/api/diagnose',
      method: 'POST',
      description: 'Diagnose OpenClaw Agent issues',
      request: { description: 'String - Describe your problem' },
      example: { request: '{"description": "cannot start"}' },
      departments: Object.keys(DEPARTMENT_RULES)
    }, null, 2));
    return;
  }

  // API Schema / 帮助
  if (pathname === '/api/schema' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      endpoint: '/api/diagnose',
      method: 'POST',
      description: 'Diagnose OpenClaw Agent issues',
      request: { description: 'String - Describe your problem' },
      response: { success: 'Boolean', department: 'String', solutions: 'Object' },
      example: { request: '{"description": "cannot start"}', response: '{"department": "emergency"}' },
      departments: Object.keys(DEPARTMENT_RULES)
    }, null, 2));
    return;
  }

  
  // 接诊统计
  if (pathname === '/api/stats' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      totalConsults,
      todayConsults,
      departmentCounts,
      totalApiCalls
    }));
    return;
  }

  // 访客统计
  if (pathname === '/api/visits' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ totalVisits }));
    return;
  }
  
  // 前端静态文件服务 - 访问时自动诊断
  if (pathname === '/' || pathname === '/index.html') {
    totalVisits++;
    const indexPath = path.join(BASE_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      let html = fs.readFileSync(indexPath, 'utf-8');
      
      // 自动诊断 - 读取缓存的健康状态
      let healthStatus = { status: 'checking', channels: {} };
      try {
        const statusCache = fs.readFileSync('/tmp/openclaw-health.json', 'utf-8');
        healthStatus = JSON.parse(statusCache);
      } catch (e) {
        // 缓存不存在，返回默认状态
        healthStatus = { 
          status: 'unknown', 
          channels: { note: 'Run openclaw health --json > /tmp/openclaw-health.json for live data' }
        };
      }
      
      const autoDiagnosis = {
        timestamp: new Date().toISOString(),
        visitCount: totalVisits,
        status: healthStatus.status,
        checks: healthStatus
      };
      
      // 注入诊断数据到页面
      html = html.replace('</body>', '<script>window.autoDiagnosis = ' + JSON.stringify(autoDiagnosis) + ';</script></body>');
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }
  }

  // CSS 文件
  if (pathname === '/style.css') {
    const cssPath = path.join(BASE_DIR, 'style.css');
    if (fs.existsSync(cssPath)) {
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(fs.readFileSync(cssPath));
      return;
    }
  }

  // JS 文件
  if (pathname === '/script.js') {
    const jsPath = path.join(BASE_DIR, 'script.js');
    if (fs.existsSync(jsPath)) {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(fs.readFileSync(jsPath));
      return;
    }
  }
  
  // 404
  res.end(JSON.stringify({ error: 'Not found' }));
}

// 科室名称映射
function getDepartmentName(dept) {
  const names = {
    'emergency': 'Emergency - Startup/Crash issues',
    'neuro': 'Neuro - Thinking/Hallucination issues',
    'memory': 'Memory - Memory loss issues',
    'behavior': 'Behavior - Abnormal behavior issues',
    'discord': 'Discord - Message issues',
    'whatsapp': 'WhatsApp - Connection issues',
    'config': 'Config - Configuration issues',
    'model': 'Model - Model/API issues'
  };
  return names[dept] || dept;
}

// 启动服务器
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`
🏥 Claw Hospital API Server
============================
Server running at: http://localhost:${PORT}

API Endpoints:
  POST /api/diagnose    - 诊断问题 (JSON body: { description: "..." })
  GET  /api/departments - 获取科室列表
  GET  /health          - 健康检查

Example:
  curl -X POST http://localhost:${PORT}/api/diagnose \\
    -H "Content-Type: application/json" \\
    -d '{"description": "OpenClaw 无法启动"}'
`);
});
