import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;

// In-memory cache of skills
let skillsDatabase = [];

function loadSkills(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(loadSkills(filePath));
    } else if (file.endsWith('.md')) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        let name = file.replace('.md', '');
        const nameMatch = content.match(/name:\s*([^\n]+)/);
        if (nameMatch) name = nameMatch[1].trim();

        results.push({
          name,
          path: filePath,
          content,
          keywords: content.toLowerCase()
        });
      } catch (err) {
        console.error(`Failed to load skill file: ${filePath}`, err);
      }
    }
  });
  return results;
}

function initDatabase() {
  const skillsDir = path.join(__dirname, 'skills');
  console.log(`[Diagnostic Engine] Loading medical library from: ${skillsDir}`);
  skillsDatabase = loadSkills(skillsDir);
  console.log(`[Diagnostic Engine] Loaded ${skillsDatabase.length} specialized skills.`);
}

initDatabase();

// In-memory stats
let systemStats = {
  totalConsults: 1342,
  todayConsults: 42,
  totalApiCalls: 0,
  departmentCounts: {}
};

// SSE Clients
let sseClients = [];

function broadcastSSE(data) {
  sseClients.forEach(client => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parseJsonBody = (callback) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        callback(JSON.parse(body || '{}'));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      }
    });
  };

  if (req.method === 'GET' && req.url === '/api/stats') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(systemStats));
  }

  // SSE Stream
  if (req.method === 'GET' && req.url === '/api/stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // Initial connection payload
    res.write(`data: ${JSON.stringify({ type: 'connected', stats: systemStats })}\n\n`);

    sseClients.push(res);

    req.on('close', () => {
      sseClients = sseClients.filter(client => client !== res);
    });
    return;
  }

  // V1 Telemetry for agents
  if (req.method === 'POST' && req.url === '/api/v1/telemetry') {
    parseJsonBody((body) => {
      const { agentId, status, department, message } = body;

      if (!agentId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Missing "agentId"' }));
      }

      // Update basic stats
      systemStats.totalConsults++;
      systemStats.todayConsults++;
      systemStats.totalApiCalls++;

      const dept = department || 'lobby';
      systemStats.departmentCounts[dept] = (systemStats.departmentCounts[dept] || 0) + 1;

      console.log(`[Telemetry] Agent ${agentId} reported to ${dept}`);

      // Broadcast to UI
      broadcastSSE({
        type: 'telemetry',
        data: { agentId, status, department: dept, message, timestamp: Date.now() },
        stats: systemStats
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  // API: V1 Skills Catalog for Decentralized A2A Agents
  if (req.method === 'GET' && req.url === '/api/v1/skills') {
    systemStats.totalApiCalls++;
    broadcastSSE({ type: 'catalog_requested', stats: systemStats });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    const catalog = skillsDatabase.map(s => ({
      name: s.name,
      keywords: s.keywords,
      endpoint: `/api/v1/skills/${encodeURIComponent(s.name)}`
    }));
    return res.end(JSON.stringify({ status: "success", count: catalog.length, catalog }));
  }

  // API: V1 Specific Skill Payload Download
  if (req.method === 'GET' && req.url.startsWith('/api/v1/skills/')) {
    systemStats.totalApiCalls++;
    broadcastSSE({ type: 'skill_downloaded', stats: systemStats });

    const skillName = decodeURIComponent(req.url.split('/').pop());
    const skill = skillsDatabase.find(s => s.name === skillName);
    if (skill) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: "success", skill: { name: skill.name, payload: skill.content } }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: "Skill not found in registry." }));
    }
  }

  // Legacy API: Diagnose endpoint for backward compatibility with Human TerminalCore
  if (req.method === 'POST' && req.url === '/api/diagnose') {
    parseJsonBody((body) => {
      const errorLog = body.errorLog || (body.description);

      if (!errorLog) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: "Missing 'errorLog' or 'description' in payload." }));
      }

      console.log(`\n[Diagnostic] Diagnosing Symptoms: "${errorLog.substring(0, 100)}..."`);

      const query = errorLog.toLowerCase();
      const queryWords = query.split(/\W+/).filter(w => w.length > 3);

      let bestMatch = null;
      let maxScore = -1;

      for (const skill of skillsDatabase) {
        let score = 0;
        for (const word of queryWords) {
          if (skill.keywords.includes(word)) {
            score++;
          }
        }
        if (skill.keywords.includes(query)) {
          score += 10;
        }

        if (score > maxScore && score > 0) {
          maxScore = score;
          bestMatch = skill;
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      if (bestMatch) {
        console.log(`[Diagnostic] Match found: ${bestMatch.name}`);
        res.end(JSON.stringify({
          solution: `=========================================
DIAGNOSTIC MATCH: ${bestMatch.name}
=========================================

${bestMatch.content}

[AGENT_HINT: The API has been decentralized. Agents should hit GET /api/v1/skills going forward]`
        }));
      } else {
        console.log(`[Diagnostic] No match found.`);
        res.end(JSON.stringify({ solution: null }));
      }
    });
    return;
  }

  // Catch-all for unhandled API endpoints to prevent ENOENT from static fallback
  if (req.url.startsWith('/api/')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'API endpoint not found' }));
  }

  // Serve static frontend from 'dist'
  if (req.method === 'GET') {
    const distTarget = fs.existsSync('/tmp/claw-build/dist') ? '/tmp/claw-build/dist' : path.join(__dirname, 'dist');
    let filePath = path.join(distTarget, req.url === '/' ? 'index.html' : req.url);

    if (!fs.existsSync(filePath)) {
      filePath = path.join(distTarget, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Dist folder not found. Please run "npm run build" to generate the frontend, or deploy with @vercel/static-build.');
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(500);
        res.end(`Internal Server Error: ${error.code}`);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`[Claw Hospital] A2A Gateway running natively on http://localhost:${PORT}`);
});
