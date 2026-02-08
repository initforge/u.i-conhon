# Cổ Nhơn — Nền tảng Đặt Tịch Trực Tuyến

[![Deploy](https://img.shields.io/badge/deploy-production-green)]()
[![Docker](https://img.shields.io/badge/docker-compose-blue)]()
[![License](https://img.shields.io/badge/license-proprietary-red)]()

> Ứng dụng đặt tịch (mua con vật) trực tuyến cho 3 thai: **An Nhơn**, **Nhơn Phong**, **Hoài Nhơn** — Bình Định.

---

## Kiến trúc hệ thống

```
                    ┌──────────────┐
                    │   Cloudflare │  DNS + CDN (optional)
                    │   DNS / ISP  │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ System Nginx │  :80 → 301 HTTPS
                    │  (SSL Term)  │  :443 → proxy :3000
                    └──────┬───────┘
                           │
              ┌────────────▼────────────┐
              │    Docker Compose       │
              │                         │
              │  ┌─────────────────┐    │
              │  │  Frontend       │    │
              │  │  React + Nginx  │:3000
              │  │  (SPA + Proxy)  │    │
              │  └────────┬────────┘    │
              │           │ /api →      │
              │  ┌────────▼────────┐    │
              │  │  Backend        │    │
              │  │  Express.js     │:8000
              │  │  REST + SSE     │    │
              │  └───┬────────┬────┘    │
              │      │        │         │
              │  ┌───▼──┐ ┌──▼────┐    │
              │  │ PgSQL │ │ Redis │    │
              │  │  :5432│ │ :6379 │    │
              │  └───────┘ └───────┘    │
              └─────────────────────────┘
```

## Tech Stack

| Layer | Công nghệ | Mô tả |
|-------|-----------|-------|
| **Frontend** | React 18 + TypeScript + Vite | SPA với TailwindCSS, Context API |
| **Backend** | Node.js + Express.js | REST API, SSE real-time, Multer upload |
| **Database** | PostgreSQL 15 | Relational DB, UUID PK, JSONB |
| **Cache** | Redis 7 | Session cache, rate-limit counter |
| **Payment** | PayOS | Webhook-based, QR payment |
| **Infra** | Docker Compose | 4 containers: frontend, backend, db, redis |
| **SSL** | Let's Encrypt (Certbot) | Auto-renew via cron |
| **VPS** | Ubuntu 22.04 | 36.50.26.70 |

## Cấu trúc dự án

```
conhon-production/
├── frontend/               # React SPA
│   ├── src/
│   │   ├── pages/          # Route pages (HomePage, User/*, Admin/*)
│   │   ├── components/     # Reusable UI components
│   │   ├── services/       # API client (api.ts)
│   │   ├── contexts/       # React Context (Auth, ThaiConfig)
│   │   └── constants/      # Game config, animal data
│   ├── nginx.conf          # Frontend reverse proxy config
│   └── Dockerfile          # Multi-stage: build → nginx
│
├── backend/                # Express.js API
│   ├── src/
│   │   ├── routes/         # REST endpoints (admin, order, session, ...)
│   │   ├── services/       # DB, Redis, PayOS, SSE
│   │   └── middleware/     # Auth (JWT), rate-limit
│   └── Dockerfile
│
├── database/
│   ├── schema.sql          # DDL — tables, indexes, constraints
│   └── exports/data.sql    # Production data snapshot
│
├── docker-compose.yml      # Orchestration: 4 services
├── .env.production         # Environment template
├── SPECS.md                # Đặc tả hệ thống chi tiết
└── VPS_SETUP.md            # Hướng dẫn triển khai VPS
```

## Tính năng chính

### Người dùng
- **Đặt tịch** — Chọn Thai → chọn con vật → thanh toán QR (PayOS)
- **Xem kết quả** — Bảng kết quả theo ngày/thai, hiển thị sau giờ xổ
- **Cộng đồng** — Xem/bình luận video YouTube theo thai
- **Câu thai** — Ảnh câu thai mới nhất theo khung giờ

### Admin
- **Quản lý con vật** — Cấm/mở, điều chỉnh hạn mức từng con theo phiên
- **Nhập kết quả** — Chọn con trúng, lưu lunar date
- **Quản lý đơn hàng** — Filter theo thai/ngày/trạng thái, xem chi tiết
- **CMS Cộng đồng** — Quản lý video, kiểm duyệt bình luận, ban user
- **Câu thai** — Upload/xoá ảnh theo thai + khung giờ, toggle hiển thị
- **Báo cáo** — Thống kê doanh thu, tổng kết năm tài chính
- **Cấu hình** — Master switch, thông báo bảo trì, cấu hình thai

### Hệ thống
- **Real-time** — SSE push kết quả, cập nhật hạn mức live
- **Session-centric** — Dữ liệu xoay quanh phiên (thai + ngày + khung giờ)
- **Atomic limits** — `SELECT ... FOR UPDATE` đảm bảo hạn mức chính xác
- **Idempotent webhook** — PayOS callback xử lý 1 lần duy nhất

## Deployment

Xem chi tiết: **[VPS_SETUP.md](./VPS_SETUP.md)**

```bash
# Quick deploy
cd /opt/conhon
git fetch origin && git reset --hard origin/ready-production
docker compose up --build -d
```

## Domain

- **Production**: https://conhonannhonbinhdinh.vn
- **IP trực tiếp**: http://36.50.26.70:3000

---

**© 2026 Cổ Nhơn — An Nhơn, Bình Định**
