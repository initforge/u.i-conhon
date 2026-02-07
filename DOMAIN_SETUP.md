# 🌐 Domain Setup — conhonannhonbinhdinh.vn

Hướng dẫn trỏ domain về VPS `36.50.26.70` + cấu hình SSL.

---

## Bước 1: Trỏ DNS

Vào trang quản lý domain (nơi mua `conhonannhonbinhdinh.vn`), tạo bản ghi DNS:

| Type | Name | Value |
|---|---|---|
| A | @ | 36.50.26.70 |
| A | www | 36.50.26.70 |

Chờ 5-30 phút.

Kiểm tra: `ping conhonannhonbinhdinh.vn` → phải trả IP `36.50.26.70`

---

## Bước 2: Cài Certbot trên VPS

```bash
apt update && apt install -y certbot
```

---

## Bước 3: Lấy SSL Certificate

**Tạm tắt system nginx** để Certbot chiếm port 80:

```bash
systemctl stop nginx

certbot certonly --standalone \
  -d conhonannhonbinhdinh.vn \
  -d www.conhonannhonbinhdinh.vn \
  --email admin@conhonannhonbinhdinh.vn \
  --agree-tos

systemctl start nginx
```

---

## Bước 4: Cấu hình System Nginx

Tạo file cấu hình cho domain:

```bash
nano /etc/nginx/sites-available/conhon
```

Paste nội dung sau:

```nginx
# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name conhonannhonbinhdinh.vn www.conhonannhonbinhdinh.vn;
    return 301 https://$host$request_uri;
}

# HTTPS → Docker frontend (port 3000)
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
```

Kích hoạt + restart:

```bash
ln -sf /etc/nginx/sites-available/conhon /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## Bước 5: Cập nhật .env trên VPS

```bash
nano /opt/conhon/.env
```

Đổi:
```diff
-FRONTEND_URL=http://36.50.26.70
+FRONTEND_URL=https://conhonannhonbinhdinh.vn
```

Restart backend:
```bash
cd /opt/conhon && docker compose restart backend
```

---

## Bước 6: Cập nhật PayOS Webhook

Vào https://my.payos.vn → đổi webhook URL:
```
https://conhonannhonbinhdinh.vn/api/webhook/payos
```

---

## Bước 7: Auto-renew SSL

```bash
crontab -e
```

Thêm:
```
0 3 1,15 * * certbot renew --pre-hook "systemctl stop nginx" --post-hook "systemctl start nginx" >> /var/log/certbot-renew.log 2>&1
```

---

## Checklist ✅

- [ ] DNS A record `@` và `www` trỏ về `36.50.26.70`
- [ ] `ping conhonannhonbinhdinh.vn` trả đúng IP
- [ ] Certbot lấy SSL thành công
- [ ] System nginx config tạo xong
- [ ] `.env` đổi `FRONTEND_URL`
- [ ] PayOS webhook URL cập nhật
- [ ] Truy cập `https://conhonannhonbinhdinh.vn` → hoạt động
- [ ] Auto-renew cron đã thêm
