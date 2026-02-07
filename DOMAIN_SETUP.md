# 🌐 Domain Setup Guide — Cổ Nhơn

Khi có domain name, làm theo hướng dẫn này để cấu hình SSL + domain.

---

## Bước 1: Trỏ DNS

Ở nhà cung cấp domain (Tenten, Namecheap, Cloudflare...), tạo bản ghi:

| Type | Name | Value |
|---|---|---|
| A | @ | 36.50.26.70 |
| A | www | 36.50.26.70 |

Chờ 5-30 phút cho DNS propagation.

Kiểm tra: `ping conhon.vn` → phải trả IP 36.50.26.70

---

## Bước 2: Cài Certbot (Let's Encrypt SSL)

SSH vào VPS:
```bash
apt update && apt install -y certbot
```

---

## Bước 3: Sửa nginx.conf

File: `frontend/nginx.conf`

```diff
 server {
     listen 80;
-    server_name _;
+    server_name conhon.vn www.conhon.vn;
+
+    # Redirect HTTP to HTTPS
+    location /.well-known/acme-challenge/ {
+        root /usr/share/nginx/html;
+    }
+    location / {
+        return 301 https://$host$request_uri;
+    }
+}
+
+server {
+    listen 443 ssl http2;
+    server_name conhon.vn www.conhon.vn;
+
+    ssl_certificate /etc/letsencrypt/live/conhon.vn/fullchain.pem;
+    ssl_certificate_key /etc/letsencrypt/live/conhon.vn/privkey.pem;
+    ssl_protocols TLSv1.2 TLSv1.3;
+    ssl_ciphers HIGH:!aNULL:!MD5;
+
     root /usr/share/nginx/html;
     index index.html;
     # ... giữ nguyên phần còn lại ...
 }
```

---

## Bước 4: Sửa docker-compose.yml

Mount SSL certificates vào frontend container:

```diff
   frontend:
     build:
       context: ./frontend
       dockerfile: Dockerfile
     container_name: conhon-frontend
     restart: always
     ports:
       - "80:80"
       - "443:443"
+    volumes:
+      - /etc/letsencrypt:/etc/letsencrypt:ro
     depends_on:
       - backend
```

---

## Bước 5: Lấy SSL Certificate

Tạm dừng frontend để Certbot verify:
```bash
docker compose stop frontend

certbot certonly --standalone -d conhon.vn -d www.conhon.vn --email your@email.com --agree-tos

docker compose up -d
```

---

## Bước 6: Cập nhật .env

```bash
nano /opt/conhon/.env
```

```diff
-FRONTEND_URL=http://36.50.26.70
+FRONTEND_URL=https://conhon.vn
```

Restart:
```bash
docker compose up --build -d
```

---

## Bước 7: Auto-renew SSL

```bash
# Thêm cron job
crontab -e
```

Thêm dòng:
```
0 3 * * * certbot renew --pre-hook "docker compose -f /opt/conhon/docker-compose.yml stop frontend" --post-hook "docker compose -f /opt/conhon/docker-compose.yml up -d frontend" >> /var/log/certbot-renew.log 2>&1
```

---

## Bước 8: Cập nhật PayOS Webhook

Vào https://my.payos.vn → Cập nhật webhook URL:
```
https://conhon.vn/api/webhook/payos
```

---

## Checklist domain ✅

- [ ] DNS A record trỏ đúng IP
- [ ] SSL certificate đã lấy
- [ ] nginx.conf đã sửa server_name + SSL
- [ ] docker-compose mount /etc/letsencrypt
- [ ] .env FRONTEND_URL đổi sang domain
- [ ] PayOS webhook URL cập nhật
- [ ] Certbot auto-renew cron đã thêm
- [ ] Test: truy cập https://conhon.vn → hoạt động
