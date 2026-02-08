# VPS Setup — Cổ Nhơn Production

> Hướng dẫn triển khai, vận hành và xử lý sự cố trên VPS.

---

## Thông tin VPS

| Thông số | Giá trị |
|----------|---------|
| **IP** | `36.50.26.70` |
| **OS** | Ubuntu 22.04 LTS |
| **Domain** | `conhonannhonbinhdinh.vn` |
| **SSH** | `ssh root@36.50.26.70` |
| **Repo** | `github.com/initforge/vhdg-conhon` |
| **Branch** | `ready-production` |

---

## Cấu trúc thư mục trên VPS

```
/opt/conhon/                    ← Thư mục gốc dự án
├── docker-compose.yml          ← Orchestration 4 containers
├── .env                        ← Environment variables (secrets)
├── frontend/                   ← React SPA + Nginx config
├── backend/                    ← Express.js API server
├── database/
│   ├── schema.sql              ← Database schema
│   └── exports/data.sql        ← Data backup
└── scripts/                    ← Utility scripts

/etc/nginx/                     ← System Nginx (SSL terminator)
├── nginx.conf                  ← Main config
├── conf.d/
│   └── conhon.conf             ← Site config: 443 → :3000

/etc/letsencrypt/               ← SSL certificates
└── live/conhonannhonbinhdinh.vn/
    ├── fullchain.pem
    └── privkey.pem

/var/lib/docker/volumes/        ← Docker persistent data
├── conhon_postgres_data/       ← PostgreSQL data
├── conhon_redis_data/          ← Redis data
└── conhon_uploads_data/        ← Uploaded images (câu thai)
```

---

## Docker Containers

| Container | Port | Mô tả |
|-----------|------|-------|
| `conhon-frontend` | 3000 → 80 | React build + Nginx reverse proxy |
| `conhon-backend` | 8000 | Express.js REST API + SSE |
| `conhon-db` | 5432 | PostgreSQL 15 |
| `conhon-redis` | 6379 | Redis 7 (cache, rate-limit) |

---

## Triển khai lần đầu

### Yêu cầu
- Docker + Docker Compose
- Git
- System Nginx
- Certbot

### Cài đặt

```bash
# 1. Clone repo
cd /opt
git clone -b ready-production https://github.com/initforge/vhdg-conhon.git conhon
cd conhon

# 2. Tạo .env từ template
cp .env.production .env
nano .env  # Điền các giá trị thật (DB password, PayOS keys, JWT secret...)

# 3. Khởi chạy
docker compose up --build -d

# 4. Tạo database tables
docker exec -i conhon-db psql -U conhon_user -d conhon_db < database/schema.sql
```

---

## Cập nhật code (Deploy)

```bash
cd /opt/conhon
git fetch origin && git reset --hard origin/ready-production
docker compose up --build -d
```

---

## Cấu hình Domain + SSL

### Bước 1: Trỏ DNS

Tại nhà cung cấp domain, tạo bản ghi:

| Type | Name | Value |
|------|------|-------|
| A | @ | 36.50.26.70 |
| A | www | 36.50.26.70 |

Kiểm tra: `ping conhonannhonbinhdinh.vn` → `36.50.26.70`

### Bước 2: Lấy SSL

```bash
# Tạm dừng tất cả service chiếm port 80
docker compose stop frontend
systemctl stop nginx 2>/dev/null

# Lấy certificate
certbot certonly --standalone \
  -d conhonannhonbinhdinh.vn \
  -d www.conhonannhonbinhdinh.vn \
  --email admin@conhonannhonbinhdinh.vn \
  --agree-tos --non-interactive

# Khởi động lại
docker compose start frontend
```

### Bước 3: Cấu hình System Nginx

```bash
cat > /etc/nginx/conf.d/conhon.conf << 'EOF'
server {
    listen 80;
    server_name conhonannhonbinhdinh.vn www.conhonannhonbinhdinh.vn;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl http2;
    server_name conhonannhonbinhdinh.vn www.conhonannhonbinhdinh.vn;

    ssl_certificate /etc/letsencrypt/live/conhonannhonbinhdinh.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/conhonannhonbinhdinh.vn/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

nginx -t && systemctl restart nginx
```

> **Lưu ý**: Dùng `/etc/nginx/conf.d/` (không phải `sites-available/`). VPS này không có thư mục `sites-enabled`.

### Bước 4: Cập nhật .env

```bash
sed -i 's|FRONTEND_URL=.*|FRONTEND_URL=https://conhonannhonbinhdinh.vn|' /opt/conhon/.env
cd /opt/conhon && docker compose restart backend
```

### Bước 5: Auto-renew SSL

```bash
(crontab -l 2>/dev/null; echo '0 3 1,15 * * certbot renew --pre-hook "docker compose -f /opt/conhon/docker-compose.yml stop frontend && systemctl stop nginx" --post-hook "systemctl start nginx && docker compose -f /opt/conhon/docker-compose.yml start frontend"') | crontab -
```

---

## Lệnh thường dùng

```bash
# Xem logs
docker compose logs -f backend      # Backend logs
docker compose logs -f frontend     # Nginx logs
docker compose logs -f db           # PostgreSQL logs

# Truy cập database
docker exec -it conhon-db psql -U conhon_user -d conhon_db

# Restart từng service
docker compose restart backend
docker compose restart frontend

# Rebuild toàn bộ
docker compose up --build -d

# Xem dung lượng
docker system df
df -h /opt/conhon

# Backup database
docker exec conhon-db pg_dump -U conhon_user conhon_db > backup_$(date +%Y%m%d).sql
```

---

## Xử lý sự cố

### Port 80 bị chiếm (Certbot fail)
```bash
# Xem ai đang dùng port 80
lsof -i :80
# Tắt tất cả
docker compose stop frontend
systemctl stop nginx
# Kiểm tra lại
lsof -i :80  # Phải trống
# Chạy lại certbot
certbot certonly --standalone -d conhonannhonbinhdinh.vn -d www.conhonannhonbinhdinh.vn --agree-tos --non-interactive
```

### Container crash/restart liên tục
```bash
docker compose logs --tail 50 backend   # Đọc lỗi
docker compose down && docker compose up --build -d  # Rebuild sạch
```

### Database connection refused
```bash
docker compose ps          # Kiểm tra db container
docker compose restart db  # Restart database
docker compose restart backend  # Restart backend sau khi db lên
```

### Ảnh upload không hiển thị
```bash
# Kiểm tra volume
docker exec conhon-backend ls -la /app/uploads/cau-thai/
# Kiểm tra route
curl -I http://localhost:8000/uploads/cau-thai/
```

---

## Biến môi trường (.env)

| Biến | Mô tả |
|------|-------|
| `DB_HOST` | Hostname database (thường `db`) |
| `DB_NAME` | Tên database |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secret key cho JWT token |
| `PAYOS_CLIENT_ID` | PayOS client ID |
| `PAYOS_API_KEY` | PayOS API key |
| `PAYOS_CHECKSUM_KEY` | PayOS checksum key |
| `FRONTEND_URL` | URL frontend (domain hoặc IP) |
| `NODE_ENV` | `production` |
