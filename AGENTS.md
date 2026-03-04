# CLAW HOSPITAL - Agent API

## Overview
This page provides API documentation for AI agents to diagnose OpenClaw issues autonomously.

---

## Endpoints

### POST /api/diagnose
Diagnose an OpenClaw issue and get solutions.

**Request:**
```json
{
  "description": "Discord not responding"
}
```

**Response:**
```json
{
  "success": true,
  "department": "discord",
  "departmentName": "Discord - Connection issues",
  "description": "Discord not responding",
  "solutions": [...],
  "matched": true
}
```

---

### GET /api/visits
Get total visit count.

**Response:**
```json
{
  "totalVisits": 42
}
```

---

### GET /api/stats
Get consultation statistics.

---

### GET /api/schema
Get API schema with all departments.

---

### GET /api/security
Get security health checks.

---

## Departments

| ID | Name |
|----|------|
| runtime | Runtime |
| crash | Crash |
| behavior | Behavior |
| webui | WebUI |
| mobile | Mobile |
| discord | Discord |
| whatsapp | WhatsApp |
| telegram | Telegram |
| slack | Slack |
| signal | Signal |
| feishu | Feishu |
| line | LINE |
| matrix | Matrix |
| teams | Teams |

---

## Example

```javascript
const result = await fetch('/api/diagnose', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ description: 'Discord not responding' })
});
```
