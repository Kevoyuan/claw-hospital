#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Visit counter
let visitCount = 0;

// Visit counter
let visitCount = 0;

// 科室关键词匹配规则
const DEPARTMENT_RULES = {
  'emergency': {
    keywords: ['启动', '启动失败', '崩溃', 'crash', '无响应', '连接中断', 'ECONNREFUSED', 'ECONNRESET', '无法启动', '进程退出', 'exit', 'died', '挂掉', '宕机', 'down'],
    skillPath: 'emergency-skill'
  },
  'neuro': {
    keywords: ['思维', '幻觉', 'hallucination', '幻觉', '胡言乱语', '乱说', '编造', '虚假信息', '事实错误', '记忆错误', '认知', '理解错误'],
    skillPath: 'neuro-skill'
  },
  'memory': {
    keywords: ['记忆', '丢失', '忘记', '不记得', 'memories', 'context', '忘记之前', '没有记忆', 'memory lost', '遗忘', '丢失'],
    skillPath: 'memory-skill'
  },
  'behavior': {
    keywords: ['行为', '异常', 'behaviour', 'behavior', '奇怪', '不对', '失控', '发疯', ' personality', '性格', '表现异常'],
    skillPath: 'behavior-skill'
  },
  'discord': {
    keywords: ['discord', 'Discord', 'DC', '服务器', '频道', '消息发不出', '无法发送', 'webhook'],
    skillPath: 'discord'
  },
  'whatsapp': {
    keywords: ['whatsapp', 'WhatsApp', 'Whatsapp', 'wa', '无法发送', '消息失败'],
    skillPath: 'whatsapp'
  },
  'config': {
    keywords: ['config', '配置', 'setting', '设置', '配置文件', 'env', '环境变量'],
    skillPath: 'config'
  },
  'model': {
    keywords: ['model', '模型', 'API', 'key', '密钥', 'token', 'GPT', 'Claude', 'Anthropic', '费用', ' quota', '额度'],
    skillPath: 'model'
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
        
        visitCount++;
        const department = matchDepartment(description);
        
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
  }
  
  // 接诊统计
  if (pathname === '/api/stats' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ visits: visitCount }));
    return;
  }
  
  // 前端静态文件服务
  if (pathname === '/' || pathname === '/index.html') {
    const indexPath = path.join(BASE_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fs.readFileSync(indexPath));
      return;
    }
  }
  
  // 404
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
