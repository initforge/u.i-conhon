# 🚀 Deployment Guide — Cổ Nhơn Production

## Yêu cầu VPS
- Ubuntu 22.04+ (hoặc Debian 12+)
- RAM: tối thiểu 1GB (khuyến nghị 2GB)
- Docker + Docker Compose v2

---

## Bước 1: Cài Docker trên VPS

SSH vào VPS:
```bash
ssh root@36.50.26.70
```

Cài Docker:
```bash
curl -fsSL https://get.docker.com | sh
```

Kiểm tra:
```bash
docker --version
docker compose version
```

---

## Bước 2: Clone repo và cấu hình

```bash
# Clone repo
cd /opt
git clone https://github.com/initforge/vhdg-conhon.git conhon
cd /opt/conhon
git checkout ready-production

# Tạo .env production
cp .env.production .env
```

### ⚠️ CẦN SỬA .env TRƯỚC KHI CHẠY:

```bash
nano .env
```

Đổi các giá trị sau:
- `DB_PASSWORD` → mật khẩu mạnh (VD: `openssl rand -hex 16`)
- `JWT_SECRET` → random 64 ký tự (VD: `openssl rand -hex 32`)
- `FRONTEND_URL` → IP hoặc domain (VD: `http://36.50.26.70` hoặc `https://conhon.vn`)

---

## Bước 3: Build và chạy

```bash
docker compose up --build -d
```

Kiểm tra containers:
```bash
docker compose ps
docker compose logs -f --tail=50
```

Health check:
```bash
curl http://localhost/health
```

---

## Bước 4: Kiểm tra

- Truy cập: `http://36.50.26.70`
- API health: `http://36.50.26.70/health`
- Admin: đăng nhập và test chức năng

---

## Các lệnh hữu ích

```bash
# Xem logs
docker compose logs backend -f --tail=100
docker compose logs frontend -f --tail=100

# Restart toàn bộ
docker compose restart

# Restart 1 service
docker compose restart backend

# Rebuild sau khi sửa code
docker compose up --build -d

# Vào database
docker exec -it conhon-db psql -U conhon -d conhon

# Xem disk usage
docker system df
```

---

## Backup database

```bash
# Export
docker exec conhon-db pg_dump -U conhon conhon > /opt/backup/conhon_$(date +%Y%m%d).sql

# Import
docker exec -i conhon-db psql -U conhon conhon < backup.sql
```

---

## CI/CD Setup → Xem file `.github/workflows/deploy.yml`

Sau khi deploy thủ công thành công, setup CI/CD theo hướng dẫn bên dưới để auto deploy mỗi khi push.

### Tạo SSH Key cho GitHub Actions

Trên VPS:
```bash
ssh-keygen -t ed25519 -f /root/.ssh/github_deploy -N ""
cat /root/.ssh/github_deploy.pub >> /root/.ssh/authorized_keys
cat /root/.ssh/github_deploy  # Copy private key này
```

### Thêm GitHub Secrets

Vào repo GitHub → Settings → Secrets and variables → Actions → New repository secret:

| Secret Name | Value |
|---|---|
| `VPS_HOST` | `36.50.26.70` |
| `VPS_USER` | `root` |
| `VPS_SSH_KEY` | Nội dung file `/root/.ssh/github_deploy` (private key) |

### Test

Push 1 commit lên branch `ready-production` → kiểm tra tab Actions trên GitHub.
