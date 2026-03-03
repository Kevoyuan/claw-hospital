# Deployment Guide

## Option 1: Local Development

```bash
git clone https://github.com/Kevoyuan/claw-hospital.git
cd claw-hospital
node server.js
# Open http://localhost:3000
```

---

## Option 2: Vercel (Recommended)

### Method A: Serverless Functions

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Create `api/diagnose.js`:
```javascript
const DEPARTMENT_RULES = {
  // ... same as server.js
};

module.exports = (req, res) => {
  const { description } = req.body || {};
  // ... matching logic
  res.json({ success: true, department, solutions });
};
```

3. Deploy:
```bash
vercel
```

### Method B: Static + External API

Deploy frontend as static site, use separate API server.

---

## Option 3: Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t claw-hospital .
docker run -p 3000:3000 claw-hospital
```

---

## Option 4: Railway / Render

1. Push to GitHub
2. Connect repo to Railway/Render
3. Set `node server.js` as start command

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |

---

## Production Considerations

- Use PM2 for process management
- Set up health check endpoint
- Configure CORS properly
- Add rate limiting
- Use HTTPS in production
