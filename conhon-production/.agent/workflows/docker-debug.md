---
description: Docker debugging and database operations workflow
---

# Docker Debugging Workflow

// turbo-all

## 1. Check All Container Status
```bash
docker-compose ps
```

## 2. Check Backend Logs (always check this first when debugging)
```bash
docker logs conhon-backend --tail 50
```

## 3. Check Database Content
```bash
docker exec conhon-db psql -U conhon -d conhon -c "SELECT phone, name, role FROM users;"
```

## 4. Check Redis
```bash
docker exec conhon-redis redis-cli ping
```

---

# Password Hashing Rules (IMPORTANT)

## PowerShell Escape Issue
When inserting bcrypt hashes via PowerShell command line, `$` characters get interpreted as variables.

**BAD - hash gets corrupted:**
```powershell
docker exec conhon-db psql -c "INSERT ... '$2a$10$xyz...' ..."
```

**SOLUTION: Use Node.js script instead:**
Create a temporary script, run it, then DELETE:
```javascript
const bcrypt = require('bcryptjs');
const passwordHash = await bcrypt.hash('password', 10);
await db.query('INSERT INTO users ... VALUES ($1, $2, ...)', [phone, passwordHash, ...]);
```

## After Using Temporary Scripts
- ALWAYS delete temporary scripts after use
- Verify data was inserted correctly: `docker exec conhon-db psql -U conhon -d conhon -c "SELECT ... FROM users;"`

---

# Rebuild Containers Workflow

## 1. Full Rebuild (with volume reset for fresh DB)
```bash
docker-compose down -v
docker-compose up --build -d
```

## 2. Quick Rebuild (keep data)
```bash
docker-compose up --build -d
```

## 3. After rebuild, ALWAYS:
- Check container status: `docker-compose ps`
- Check backend logs: `docker logs conhon-backend --tail 20`
- Verify database: `docker exec conhon-db psql -U conhon -d conhon -c "SELECT COUNT(*) FROM users;"`

---

# Port Conventions
- Frontend (production nginx): 80/443
- Frontend (dev server): 3000 or 5173
- Backend API: 8000 (standard) or 3001
- PostgreSQL: 5432
- Redis: 6379
