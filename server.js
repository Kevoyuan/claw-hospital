#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

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
        skillPath: 'system/runtime'
    },
    'crash': {
        keywords: ['crash', '崩溃', 'exit', 'died', '挂掉', '宕机', 'down', 'not responding'],
        skillPath: 'system/crash'
    },
    'behavior': {
        keywords: ['behavior', 'incorrect', 'wrong', '行为', '异常', '不对'],
        skillPath: 'system/behavior'
    },
    'webui': {
        keywords: ['webui', 'web-ui', 'interface', 'ui', '界面'],
        skillPath: 'system/webui'
    },
    'mobile': {
        keywords: ['mobile', 'ios', 'android', 'app'],
        skillPath: 'system/mobile'
    },
    // CORE
    'discord': {
        keywords: ['discord', 'dc', 'Discord'],
        skillPath: 'core/discord'
    },
    'telegram': {
        keywords: ['telegram', 'tg', 'Telegram'],
        skillPath: 'core/telegram'
    },
    'whatsapp': {
        keywords: ['whatsapp', 'wa', 'WhatsApp'],
        skillPath: 'core/whatsapp'
    },
    'slack': {
        keywords: ['slack', 'Slack'],
        skillPath: 'core/slack'
    },
    'signal': {
        keywords: ['signal', 'Signal'],
        skillPath: 'core/signal'
    },
    // EXTENSIONS
    'feishu': {
        keywords: ['feishu', '飞书', 'Feishu', 'lark'],
        skillPath: 'extensions/feishu'
    },
    'line': {
        keywords: ['line', 'Line'],
        skillPath: 'extensions/line'
    },
    'matrix': {
        keywords: ['matrix', 'Matrix'],
        skillPath: 'extensions/matrix'
    },
    'teams': {
        keywords: ['teams', 'Teams', 'msteams'],
        skillPath: 'extensions/msteams'
    },
    'mattermost': {
        keywords: ['mattermost', 'Mattermost'],
        skillPath: 'extensions/mattermost'
    },
    'nostr': {
        keywords: ['nostr', 'Nostr'],
        skillPath: 'extensions/nostr'
    },
    'twitch': {
        keywords: ['twitch', 'Twitch'],
        skillPath: 'extensions/twitch'
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
  if (pathname === '/api/diagnose' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
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
        
        const solutions = getDepartmentSolution(department);
        
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
  
  // 前端静态文件服务
  if (pathname === '/' || pathname === '/index.html') {
    totalVisits++;
    const indexPath = path.join(BASE_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fs.readFileSync(indexPath));
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
  
    }
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
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
