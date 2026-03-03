# AGENTS.md - Claw Hospital Development Guide

## Overview

Claw Hospital is a self-diagnosis and repair platform for OpenClaw AI Agents. It consists of:
- **Backend**: Node.js HTTP server (`server.js`)
- **Frontend**: Vanilla HTML/CSS/JS (`index.html`, `script.js`, `style.css`)
- **Skills**: Department-specific diagnostic knowledge (`skills/*/`)

---

## Running the Project

### Development
```bash
# Start the server
node server.js

# The server runs on http://localhost:3000 by default
# Override port with: PORT=8080 node server.js
```

### Testing Single Endpoints
```bash
# Test diagnose endpoint
curl -X POST http://localhost:3000/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{"description": "OpenClaw cannot start"}'

# Test departments endpoint
curl http://localhost:3000/api/departments

# Test health check
curl http://localhost:3000/health

# Test stats endpoint
curl http://localhost:3000/api/stats
```

---

## Project Structure

```
claw-hospital/
├── server.js           # Main API server (Node.js)
├── index.html          # Frontend HTML
├── script.js           # Frontend JavaScript
├── style.css           # Pixel art styling
├── vercel.json         # Vercel deployment config
├── DEPLOY.md           # Deployment documentation
├── skills/             # Department diagnostic skills
│   ├── emergency-skill/
│   │   ├── SKILL.md   # Diagnostic procedures & solutions
│   │   └── ISSUES.md  # Known issues + solutions
│   ├── neuro-skill/
│   ├── memory-skill/
│   ├── behavior-skill/
│   ├── discord/
│   ├── whatsapp/
│   ├── config/
│   └── model/
```

---

## Code Style Guidelines

### JavaScript (server.js)

**General**
- Use modern ES6+ syntax (const/let, arrow functions, template literals)
- Use `===` for comparisons (no implicit type coercion)
- Use meaningful variable names in English
- Comment complex logic in Chinese (project language)

**Error Handling**
```javascript
// Wrap file operations in try-catch
try {
  if (fs.existsSync(skillPath)) {
    const content = fs.readFileSync(skillPath, 'utf-8');
    return parseSkillMarkdown(content);
  }
} catch (e) {
  console.error(`Error reading skill file: ${e.message}`);
}
```

**HTTP Responses**
- Set appropriate Content-Type headers
- Return JSON with consistent structure
- Use proper HTTP status codes (200, 400, 404, 500)
- Enable CORS for API endpoints

**Constants**
- Use UPPER_SNAKE_CASE for constants
- Define DEPARTMENT_RULES as a constant object at module level

### Frontend JavaScript (script.js)

**General**
- Use const/let instead of var
- Use arrow functions for callbacks
- Use template literals for string concatenation

**DOM Manipulation**
```javascript
// Cache DOM elements when possible
const element = document.getElementById('elementId');

// Use classList for toggle operations
element.classList.add('active');
element.classList.remove('active');
element.classList.toggle('active');
```

**Event Handling**
```javascript
// Use addEventListener for events
element.addEventListener('click', handler);

// Clean up intervals
clearInterval(window.typewriterInterval);
```

### CSS (style.css)

- Use CSS custom properties for colors
- Follow pixel-art aesthetic (crisp edges, no anti-aliasing)
- Use flexbox/grid for layout
- Keep responsive design in mind

### Markdown (SKILL.md, ISSUES.md)

**Skills Directory Structure**
Each skill must have:
- `SKILL.md` - Diagnostic procedures and solutions
- `ISSUES.md` - Known issues with commands/fixes

**SKILL.md Format**
```markdown
# Skill Name

## 诊断流程
[Diagnostic steps in Chinese]

## 解决方案
[Solution details in Chinese]

## 常见命令
```bash
command1
command2
```
```

---

## API Development

### Adding New Departments

1. Add entry to `DEPARTMENT_RULES` in `server.js`:
```javascript
const DEPARTMENT_RULES = {
  // ... existing departments
  'new-dept': {
    keywords: ['keyword1', 'keyword2'],
    skillPath: 'new-dept-skill'
  }
};
```

2. Create skill directory:
```bash
mkdir skills/new-dept-skill
touch skills/new-dept-skill/SKILL.md
touch skills/new-dept-skill/ISSUES.md
```

3. Add department name in `getDepartmentName()` function

### API Response Format

```javascript
// Success response
{
  success: true,
  department: 'emergency',
  departmentName: 'Emergency - Startup/Crash issues',
  description: 'user input',
  solutions: { ... },
  matched: true
}

// Error response
{
  error: 'Error message'
}
```

---

## Best Practices

1. **File Paths**: Use `path.join(__dirname, ...)` for cross-platform compatibility
2. **Port Configuration**: Read from `process.env.PORT` with fallback default
3. **CORS**: Always set CORS headers on API responses
4. **Error Logging**: Use `console.error` for errors, include relevant context
5. **Input Validation**: Validate required fields before processing
6. **JSON Parsing**: Always wrap JSON.parse in try-catch

---

## Deployment

### Local
```bash
node server.js
```

### Vercel (Serverless)
```bash
# Deploy to Vercel
vercel deploy

# Production deploy
vercel --prod
```

---

## Dependencies

This project uses only Node.js built-in modules:
- `http` - HTTP server
- `fs` - File system operations
- `path` - Path manipulation

No external npm packages required.
