# CỔ NHƠN — ĐẶC TẢ HỆ THỐNG

> **Phiên bản**: 4.0 | **Cập nhật**: 08/02/2026
> **Mục đích**: Đặc tả chi tiết — khớp 100% code thực tế (schema, routes, pages)

---

## MỤC LỤC

1. [Tổng quan](#1-tổng-quan)
2. [Kiến trúc & Hiệu năng](#2-kiến-trúc--hiệu-năng)
3. [Database Schema](#3-database-schema)
4. [Xác thực & Phân quyền](#4-xác-thực--phân-quyền)
5. [User Pages](#5-user-pages)
6. [Admin Pages](#6-admin-pages)
7. [API Reference](#7-api-reference)
8. [Business Logic](#8-business-logic)
9. [Session Lifecycle](#9-session-lifecycle)
10. [Deployment](#10-deployment)
11. [Phụ lục](#11-phụ-lục)

---

## 1. TỔNG QUAN

### 1.1 Mô tả

Cổ Nhơn là trò chơi dân gian truyền thống Bình Định. Mùa chơi: **~25 tháng Chạp đến mùng 9 tháng Giêng** (~15 ngày quanh Tết).

### 1.2 Ba Thai (Khu vực)

| Thai | Số con | Phiên/ngày | Giờ đóng tịch | Giờ xổ (cố định) |
|------|--------|------------|---------------|-------------------|
| **An Nhơn** | 40 | Sáng, Chiều, Tối (Tết) | 10:30, 16:30, 20:30 | 11:00, 17:00, 21:00 |
| **Nhơn Phong** | 40 | Sáng, Chiều | 10:30, 16:30 | 11:00, 17:00 |
| **Hoài Nhơn** | 36 | Trưa, Chiều | 12:30, 18:30 | 13:00, 19:00 |

> **Giờ xổ** cố định, hardcode trong `frontend/src/constants/drawTimes.ts`. Admin chỉ đổi được giờ đóng tịch.
> **Phiên Tối** (21h) chỉ có ở Thai An Nhơn, bật khi `tet_mode = true` trong settings.

### 1.3 Tỷ lệ thưởng

- **Mặc định**: 1 chung 30 (10.000đ → 300.000đ)
- Hardcode trong `frontend/src/constants/gameConfig.ts`: `PRIZE_RATIO: 30`

### 1.4 Quy ước lịch

- **Backend**: Lịch **dương** (`YYYY-MM-DD`) — cột `sessions.session_date`
- **Frontend**: Admin nhập `lunar_label` dạng text tự do ("Mùng 3", "25 tháng Chạp")
- **Năm hiển thị**: Tính từ game period, xem `frontend/src/utils/yearUtils.ts`

---

## 2. KIẾN TRÚC & HIỆU NĂNG

### 2.1 Sơ đồ hệ thống

```
Client (Browser)
    │
    ▼ HTTPS
System Nginx (:80 → 301, :443 → SSL)
    │
    ▼ proxy_pass :3000
┌─────────────────────────────────┐
│ Docker Compose                  │
│                                 │
│  Frontend (React + Nginx :3000) │
│       │  /api/* proxy → :8000   │
│       ▼                         │
│  Backend (Express.js :8000)     │
│       │         │               │
│    PgSQL :5432  Redis :6379     │
│                                 │
│  External: PayOS (webhook)      │
└─────────────────────────────────┘
```

### 2.2 Containers

| Container | Image | Port (host → container) |
|-----------|-------|-------------------------|
| `conhon-frontend` | React build + Nginx | 3000 → 80 |
| `conhon-backend` | Node.js Express | 8000 → 8000 |
| `conhon-db` | postgres:15-alpine | (internal) 5432 |
| `conhon-redis` | redis:7-alpine | (internal) 6379 |

### 2.3 Ước tính tải

| Thời điểm | Concurrent |
|-----------|-----------|
| Tổng mỗi Thai / mùa | 300–500 |
| Giờ cao điểm (trước đóng tịch) | ~150 |

### 2.4 Cache strategy

| Data | Cách xử lý |
|------|-----------|
| 40 con vật / 3 Thai | Hardcode client (`ANIMAL_DATA.ts`, `gameConfig.ts`) |
| Giờ xổ | Hardcode client (`drawTimes.ts`) |
| Giờ đóng tịch | Fetch từ settings API, cache ThaiConfigContext |
| Hạn mức live | SSE push real-time |
| Countdown | Client tự đếm |
| Kết quả xổ | Fetch 1 lần, cache vĩnh viễn nếu đã xổ |

### 2.5 Real-time

- **SSE** (Server-Sent Events) — `backend/src/routes/sse.js`
- Push: kết quả xổ, cập nhật hạn mức, payment status
- Client auto-reconnect

### 2.6 Custom SVG Icons

**Không dùng emoji** — thay bằng custom SVG từ `components/icons/ThaiIcons.tsx`:

| Component | Dùng trong |
|-----------|-----------|
| `ThaiIcon` | Selector Thai |
| `CoNhonBrandIcon` | Post header thương hiệu |
| `CommentIcon` | Bình luận |
| `HeartIcon` | Like (prop `filled`) |
| `EmptyIcon` | Empty states |
| `WarningIcon` | Thông báo lỗi |
| `TetModeIcon` | Toggle Tết |
| `LoadingIcon` | Loading (animated) |
| `BanIcon` | Bình luận bị cấm |
| `UserIcon` | Thông tin user |

---

## 3. DATABASE SCHEMA

> Source of truth: `database/exports/schema.sql`
> Extensions: `pgcrypto`, `uuid-ossp`
> 9 bảng, 12 indexes, FK constraints với ON DELETE CASCADE

### 3.1 Bảng `users`

```sql
CREATE TABLE users (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    phone           VARCHAR(15) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(100),
    zalo            VARCHAR(100),
    bank_code       VARCHAR(20),
    bank_account    VARCHAR(30),
    bank_holder     VARCHAR(100),
    role            VARCHAR(10) DEFAULT 'user',      -- CHECK: 'user' | 'admin'
    completed_tasks TEXT[] DEFAULT '{}',              -- Mảng MXH task IDs
    is_comment_banned BOOLEAN DEFAULT false,          -- Admin ban user khỏi comment
    created_at      TIMESTAMP DEFAULT NOW()
);
-- INDEX: idx_users_phone ON (phone)
```

### 3.2 Bảng `sessions` ⭐ Core

```sql
CREATE TABLE sessions (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    thai_id         VARCHAR(20) NOT NULL,             -- 'thai-an-nhon', etc.
    session_type    VARCHAR(20) NOT NULL,             -- CHECK: 'morning' | 'afternoon' | 'evening'
    session_date    DATE NOT NULL,
    lunar_label     VARCHAR(50),                      -- "Mùng 3 Tết"
    status          VARCHAR(20) DEFAULT 'scheduled',  -- CHECK: 'scheduled' | 'open' | 'closed' | 'resulted'
    winning_animal  INT,                              -- 1–40, set khi xổ
    cau_thai        TEXT,                             -- Text câu thai
    draw_time       TIMESTAMP,                        -- Giờ xổ (computed from DRAW_TIMES)
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(thai_id, session_date, session_type)
);
-- INDEX: idx_sessions_live ON (thai_id, status) WHERE status IN ('open', 'scheduled')
-- INDEX: idx_sessions_date ON (session_date)
```

> **Lưu ý**: Không có cột `opens_at`, `closes_at`, `result_at`. Giờ mở/đóng tịch lấy từ bảng `settings`. Cột `draw_time` là timestamp tính sẵn.

### 3.3 Bảng `session_animals`

```sql
CREATE TABLE session_animals (
    session_id      UUID REFERENCES sessions(id) ON DELETE CASCADE,
    animal_order    INT NOT NULL,                     -- CHECK: 1–40
    limit_amount    BIGINT DEFAULT 5000000,           -- Hạn mức VNĐ
    sold_amount     BIGINT DEFAULT 0,                 -- Đã bán
    is_banned       BOOLEAN DEFAULT false,
    ban_reason      VARCHAR(200),
    PRIMARY KEY (session_id, animal_order)
);
```

### 3.4 Bảng `orders`

```sql
CREATE TABLE orders (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id      UUID REFERENCES sessions(id),
    user_id         UUID REFERENCES users(id),
    total           BIGINT NOT NULL,
    status          VARCHAR(20) DEFAULT 'pending',    -- CHECK: pending|paid|won|lost|cancelled|expired
    payment_code    VARCHAR(50),                      -- PayOS orderCode
    payment_url     VARCHAR(500),
    payment_expires TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW(),
    paid_at         TIMESTAMP
);
-- INDEX: idx_orders_session, idx_orders_user, idx_orders_status
```

### 3.5 Bảng `order_items`

```sql
CREATE TABLE order_items (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id        UUID REFERENCES orders(id) ON DELETE CASCADE,
    animal_order    INT NOT NULL,
    animal_name     VARCHAR(50),                      -- Lưu tên con vật lúc tạo order
    quantity        INT NOT NULL,
    unit_price      INT NOT NULL,
    subtotal        BIGINT NOT NULL
);
-- INDEX: idx_order_items_order ON (order_id)
```

### 3.6 Bảng `community_posts`

```sql
CREATE TABLE community_posts (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    thai_id         VARCHAR(20),
    youtube_id      VARCHAR(20),
    title           VARCHAR(200),
    content         TEXT,
    like_count      INT DEFAULT 0,
    is_pinned       BOOLEAN DEFAULT false,
    is_approved     BOOLEAN DEFAULT true,             -- Admin duyệt
    created_at      TIMESTAMP DEFAULT NOW()
);
-- INDEX: idx_community_posts_thai ON (thai_id)
```

### 3.7 Bảng `community_comments`

```sql
CREATE TABLE community_comments (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id         UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id),
    user_name       VARCHAR(100),
    user_phone      VARCHAR(20),
    content         TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);
-- INDEX: idx_community_comments_post ON (post_id)
-- Limit: 3 comments/user/post (check COUNT trước INSERT)
```

### 3.8 Bảng `post_likes`

```sql
CREATE TABLE post_likes (
    post_id         UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);
```

> **Thay thế LocalStorage like**: Dùng bảng `post_likes` đảm bảo 1 user 1 like/post phía server.

### 3.9 Bảng `settings`

```sql
CREATE TABLE settings (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key             VARCHAR(100) NOT NULL UNIQUE,
    value           JSONB,
    updated_at      TIMESTAMP DEFAULT NOW()
);
```

**Seed data:**

| key | value | Mô tả |
|-----|-------|-------|
| `master_switch` | `true` | Bật/tắt toàn hệ thống |
| `maintenance_message` | `"Hệ thống đang bảo trì..."` | Thông báo khi OFF |
| `thai_an_nhon_enabled` | `true` | Toggle Thai An Nhơn |
| `thai_nhon_phong_enabled` | `true` | Toggle Thai Nhơn Phong |
| `thai_hoai_nhon_enabled` | `true` | Toggle Thai Hoài Nhơn |
| `tet_mode` | `false` | Bật khung 3 (tối) cho An Nhơn |
| `schedule_an_nhon` | `{slot1: {start_time, close_time}, ...}` | Giờ đóng tịch |
| `schedule_nhon_phong` | tương tự | |
| `schedule_hoai_nhon` | tương tự | |

### 3.10 Bảng `cau_thai_images`

```sql
CREATE TABLE cau_thai_images (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    thai_id         VARCHAR(20) NOT NULL,
    year            INT NOT NULL,
    image_url       VARCHAR(500),
    title           VARCHAR(200),
    lunar_label     VARCHAR(100),
    is_featured     BOOLEAN DEFAULT false,
    khung_id        VARCHAR(20) DEFAULT 'khung-1',    -- 'khung-1', 'khung-2', 'khung-3'
    is_active       BOOLEAN DEFAULT false,            -- Hiển thị trên homepage
    description     VARCHAR(500),
    created_at      TIMESTAMP DEFAULT NOW()
);
-- INDEX: idx_cau_thai_thai_year ON (thai_id, year)
```

> **Homepage hiển thị**: Lọc theo `thai_id + khung_id + is_active = true`.

### 3.11 ERD

```
┌──────────┐       ┌─────────────┐       ┌──────────────────┐
│  users   │       │  sessions   │       │ session_animals  │
├──────────┤       ├─────────────┤       ├──────────────────┤
│ id (PK)  │       │ id (PK)     │◄──────│ session_id (FK)  │
│ phone    │       │ thai_id     │       │ animal_order     │
│ name     │       │ session_type│       │ limit/sold/ban   │
│ role     │       │ session_date│       └──────────────────┘
│ is_comm… │       │ status      │
│ completed│       │ winning_…   │
│ _tasks[] │       │ draw_time   │
└────┬─────┘       └──────┬──────┘
     │                    │
     │    ┌───────────────┘
     ▼    ▼
┌─────────────┐       ┌──────────────┐
│   orders    │       │ order_items  │
├─────────────┤       ├──────────────┤
│ id (PK)     │◄──────│ order_id(FK) │
│ session_id  │       │ animal_order │
│ user_id(FK) │       │ animal_name  │
│ total/status│       │ qty/subtotal │
│ payment_*   │       └──────────────┘
└─────────────┘

┌───────────────┐     ┌──────────────────┐     ┌────────────┐
│community_posts│◄────│community_comments│     │ post_likes │
├───────────────┤     ├──────────────────┤     ├────────────┤
│ id, thai_id   │     │ post_id (FK)     │     │ post_id(PK)│
│ youtube_id    │     │ user_id (FK)     │     │ user_id(PK)│
│ like_count    │     │ content          │     └────────────┘
│ is_approved   │     └──────────────────┘
└───────────────┘

┌──────────┐     ┌──────────────────┐
│ settings │     │ cau_thai_images  │
├──────────┤     ├──────────────────┤
│ key (UQ) │     │ thai_id, year    │
│ value    │     │ khung_id         │
│ (JSONB)  │     │ is_active        │
└──────────┘     └──────────────────┘
```

---

## 4. XÁC THỰC & PHÂN QUYỀN

### 4.1 Phân quyền

| Role | Truy cập |
|------|---------|
| **Guest** | Homepage, Hướng dẫn, Đăng nhập/ký, Xem kết quả (readonly) |
| **User** | + Mua hàng, Thanh toán, Lịch sử, Cộng đồng, Thông tin, Hỗ trợ |
| **Admin** | Dashboard, Con vật, Đơn hàng, Kết quả, Câu thai, Báo cáo, CMS, Cài đặt, Users |

### 4.2 Đăng nhập

- **User**: `/dang-nhap` → `POST /api/auth/login`
- **Admin**: `/admin/dang-nhap` → cùng endpoint, check `role = 'admin'`
- **JWT**: Stateless, middleware `auth.js` verify + gắn `req.user`
- **Tài khoản admin mặc định**: phone `admin`, password `admin123`

### 4.3 Đăng ký

`/dang-ky` → `POST /api/auth/register`

| Field | Validation |
|-------|-----------|
| Họ tên | Required |
| SĐT | Required, unique, 10–11 số |
| Zalo | Required |
| Mật khẩu | Required, min 6 |
| Xác nhận MK | Phải khớp |

### 4.4 Nhiệm vụ MXH

User mới phải hoàn thành 4 task **1 lần** trước khi mua:

| Task ID | Mô tả |
|---------|-------|
| `follow-fb` | Follow Fanpage |
| `sub-youtube` | Subscribe YouTube |
| `like-post` | Like bài viết |
| `share-post` | Share bài viết |

Data: `users.completed_tasks[]` (text array)

---

## 5. USER PAGES

> 27 pages trong `frontend/src/pages/`

### 5.1 Homepage (`/`) — `HomePage.tsx`

| Section | Nội dung |
|---------|---------|
| Hero banner | Logo + tagline + game title |
| Thai selector | 3 tabs: An Nhơn, Nhơn Phong, Hoài Nhơn |
| Câu Thai | Ảnh câu thai theo thai + khung giờ (filter `is_active`) |
| Countdown | Đếm ngược tới giờ xổ tiếp theo |
| CTA | Nút "CHƠI NGAY" → `/dang-nhap` hoặc `/user/mua-con-vat` |

### 5.2 Chọn Thai (`/chon-thai`) — `ChonThaiPage.tsx`

3 cards Thai → chọn → redirect tới trang mua

### 5.3 Tab Mua hàng (`/user/mua-con-vat`) — `MuaConVatPage.tsx` ⭐ CORE

| Phần | Nội dung |
|------|---------|
| Thai tabs | 3 Thai |
| Trạng thái | Đang mở / Đã đóng / Countdown (từ `drawTimes.ts`) |
| Grid | 40/36 cards: STT, tên, hạn mức còn, giá |
| Giỏ hàng | Danh sách chọn, tổng tiền |
| Nút Thanh toán | Check hạn mức → tạo order → redirect PayOS |

**Logic**:
1. Check session status (`getSessionStatus()` trong `drawTimes.ts`)
2. Check MXH tasks completed
3. Check hạn mức trước khi cho thanh toán
4. `POST /api/orders` → atomic lock → PayOS link

### 5.4 Tab Thanh toán (`/user/thanh-toan`) — `ThanhToanPage.tsx`

QR PayOS, countdown hết hạn, trạng thái payment

### 5.5 Payment Success/Cancel

- `/thanh-toan-thanh-cong` — `PaymentSuccessPage.tsx`
- `/thanh-toan-that-bai` — `PaymentCancelPage.tsx`

### 5.6 Tab Kết quả (`/user/ket-qua`) — `KetQuaPage.tsx`

| Phần | Nội dung |
|------|---------|
| Filter | Thai + Ngày |
| Kết quả | Con trúng + câu thai |
| Logic | Chỉ hiển thị sau `draw_time` |

### 5.7 Tab Lịch sử (`/user/lich-su`) — `LichSuPage.tsx`

Danh sách orders của user, filter Thai/trạng thái.
Chi tiết → `/user/hoa-don/:orderId` — `HoaDonPage.tsx`

### 5.8 Tab Cộng đồng (`/user/cong-dong`) — `CongDongPage.tsx`

| Phần | Nội dung |
|------|---------|
| Thai selector | 3 cards |
| Video list | YouTube embed + likes + comments |
| Like | Toggle, lưu bảng `post_likes` |
| Comment | Max 3/user/post, hiển thị tên + SĐT |

### 5.9 Tab Thông tin (`/user/thong-tin-ca-nhan`) — `ThongTinCaNhanPage.tsx`

| Field | Editable |
|-------|---------|
| Họ tên | ✅ |
| SĐT | ❌ Readonly |
| Zalo | ✅ |
| Ngân hàng | ✅ Searchable dropdown |
| STK | ✅ |
| Chủ TK | ✅ |

### 5.10 Tab Hỗ trợ (`/user/ho-tro`) — `HoTroPage.tsx`

FAQ, Hotline, Zalo, Fanpage (static content)

### 5.11 Hướng dẫn (`/huong-dan`) — `HuongDanPage.tsx`

Hướng dẫn cách chơi (static)

### 5.12 Câu Thai (`/cau-thai`) — `CauThaiPage.tsx`

Trang xem câu thai full-size

---

## 6. ADMIN PAGES

> 11 pages trong `frontend/src/pages/admin/`
> Login riêng: `AdminLoginPage.tsx`

### 6.1 Dashboard (`/admin`) — `AdminDashboard.tsx`

**Filters**: Thai, Buổi, Ngày

**Stat cards**:
| Card | Query |
|------|-------|
| Doanh thu hôm nay | `SUM(total) WHERE paid_at::date = TODAY, status IN ('paid','won','lost')` |
| Tổng đơn hàng | `COUNT(*) WHERE status IN ('paid','won','lost')` |
| Đơn hôm nay | `COUNT(*) WHERE created_at::date = TODAY` |

**Top 5 / Bottom 5**: Mua nhiều nhất / ít nhất (filtered)

### 6.2 Quản lý con vật (`/admin/con-vat`) — `AdminAnimals.tsx` ⭐ LIVE

| Phần | Nội dung |
|------|---------|
| Chọn Thai | Dropdown |
| Session hiện tại | Type + status |
| Grid 40 con | STT, tên, limit, sold, remaining, toggle ban |

**Data live**: `session_animals` — admin edit trực tiếp

### 6.3 Đơn hàng (`/admin/don-hang`) — `AdminOrders.tsx`

Filter: Ngày, Thai, Buổi. Modal chi tiết: khách hàng + items + bank info

### 6.4 Kết quả (`/admin/ket-qua`) — `AdminKetQua.tsx`

| Phần | Nội dung |
|------|---------|
| Thai tabs | An Nhơn, Nhơn Phong, Hoài Nhơn |
| Khung giờ | Dropdown |
| Ngày + Ngày âm lịch | Date picker + Input |
| Chọn con trúng | Grid 40 con (single select) |
| Lịch sử | Danh sách đã nhập |

**Tổng kết cuối mùa** (trong trang Kết quả):
- Cards 3 Thai: tổng lần xổ, unique animals, chưa xổ
- Top 5 con xổ nhiều, con chưa xổ
- Top/bottom nhóm
- Báo cáo Thắng/Thua theo buổi (dual-table)

**10 nhóm con vật** (hardcode `constants/animalGroups.ts`):

| # | Nhóm | Con vật |
|---|------|---------|
| 1 | Tứ trạng nguyên | 1, 2, 3, 4 |
| 2 | Ngũ hổ tướng | 5, 6, 7, 8, 9 |
| 3 | Thất sinh lý | 10–16 |
| 4 | Nhị đạo sĩ | 17, 18 |
| 5 | Tứ mỹ nữ | 19–22 |
| 6 | Tứ hào mạng | 23–26 |
| 7 | Tứ hòa thượng | 27–30 |
| 8 | Ngũ khất thực | 31–35 |
| 9 | Nhất ni cô | 36 |
| 10 | Tứ thần linh | 37–40 |

### 6.5 Câu Thai (`/admin/cau-thai`) — `AdminCauThai.tsx`

| Phần | Nội dung |
|------|---------|
| Năm | Dropdown |
| Thai | Tabs |
| Khung giờ | khung-1, khung-2, khung-3 |
| Upload | Drag & drop (PNG, JPG, WebP, max 5MB) |
| Gallery | Ảnh đã upload, toggle `is_active` |

Mỗi Thai + Năm + Khung có **1 ảnh active** hiển thị trên homepage.

### 6.6 Báo cáo (`/admin/bao-cao`) — `AdminBaoCao.tsx` 📊

| Phần | Nội dung |
|------|---------|
| Filter | Thai (tabs), Ngày, Buổi |
| Stat cards | Tổng lượt mua, Doanh thu, Số con đã mua |
| Grid 40 con | STT, tên, lượt mua, doanh thu |
| Top 5 / Bottom 5 | Mua nhiều / ít |
| Modal chi tiết | Click con → danh sách khách hàng + bank info (để trả thưởng) |

### 6.7 Quản lý Users (`/admin/nguoi-dung`) — `AdminUsers.tsx`

Bảng users + orders. Lock/unlock, xem chi tiết đơn.

### 6.8 CMS Cộng đồng (`/admin/cong-dong`) — `AdminCMS.tsx`

| Phần | Nội dung |
|------|---------|
| Thai cards | 3 cards (số video mỗi Thai) |
| Stat cards | Video, Bình luận, Likes |
| Video list | CRUD + embed YouTube |
| Comments | Xoá, ban user, bulk actions |
| Banned users | Danh sách + unban |

### 6.9 Cài đặt — `AdminSettings.tsx` + `AdminSwitch.tsx`

**Tab Thời gian** (`AdminSettings.tsx`):
- Khung giờ mỗi Thai: start_time, close_time (time picker)
- Chế độ Tết toggle → bật khung 3

**Tab Công tắc** (`AdminSwitch.tsx`):
- Master Switch ON/OFF
- Thông báo bảo trì (textarea)
- Toggle từng Thai

---

## 7. API REFERENCE

> Mount: `/api/` prefix. Auth required trừ khi ghi rõ Public.

### 7.1 Auth — `routes/auth.js`

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/auth/login` | Public | Đăng nhập |
| POST | `/auth/register` | Public | Đăng ký |

### 7.2 Sessions — `routes/session.js`

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/sessions/current` | User | Session đang mở |
| GET | `/sessions/:id/animals` | User | Hạn mức 40 con |
| GET | `/sessions/results` | Public | Kết quả xổ |

### 7.3 Orders — `routes/order.js`

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/orders` | User | Tạo đơn + payment link |
| GET | `/orders/me` | User | Đơn hàng của user |
| GET | `/orders/:id` | User | Chi tiết đơn |

### 7.4 Community — `routes/community.js`

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/community/posts` | User | Danh sách video |
| POST | `/community/posts/:id/like` | User | Toggle like |
| POST | `/community/posts/:id/comments` | User | Gửi comment |

### 7.5 Câu Thai — `routes/cau-thai.js`

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/cau-thai` | Public | Ảnh câu thai (filter thai_id, year, khung_id) |

### 7.6 User — `routes/user.js`

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/users/me` | User | Thông tin user |
| PATCH | `/users/me` | User | Cập nhật thông tin |

### 7.7 Upload — `routes/upload.js`

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/upload/cau-thai` | Admin | Upload ảnh câu thai (Multer, max 5MB) |

### 7.8 Webhook — `routes/webhook.js`

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/webhook/payos` | PayOS | Payment callback |
| GET | `/webhook/payos` | PayOS | Webhook URL verification |

### 7.9 SSE — `routes/sse.js`

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/sse/stream` | User | Event stream (kết quả, hạn mức) |

### 7.10 Thais — `routes/thais.js`

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/thais/config` | Public | Cấu hình Thai (schedules, switches) |

### 7.11 Admin — `routes/admin.js` (43 endpoints)

> Tất cả require `authenticate + requireAdmin`

**Dashboard:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/admin/stats` | Dashboard stats (filtered) |
| GET | `/admin/stats/animals-all` | Grid 40 con cho báo cáo |
| GET | `/admin/stats/animal-orders` | Chi tiết orders từng con |

**Sessions:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/admin/sessions` | List sessions (filtered) |
| GET | `/admin/sessions/current/:thai_id` | Session live |
| GET | `/admin/sessions/results` | Kết quả đã nhập |
| POST | `/admin/sessions/:id/result` | Nhập kết quả xổ |
| DELETE | `/admin/sessions/:id/result` | Xoá kết quả |
| POST | `/admin/results` | Tạo kết quả mới |
| PATCH | `/admin/session-animals` | Update hạn mức/ban |

**Orders:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/admin/orders` | Danh sách đơn (filtered) |
| GET | `/admin/orders/:id` | Chi tiết đơn + items |
| PATCH | `/admin/orders/:id` | Update status |

**Users:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/admin/users` | Danh sách users |
| PATCH | `/admin/users/:id` | Edit info, lock/unlock |
| DELETE | `/admin/users/:id` | Xoá user |

**Community CMS:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/admin/community/posts` | List videos |
| POST | `/admin/community/posts` | Thêm video |
| DELETE | `/admin/community/posts/:id` | Xoá video |
| GET | `/admin/community/stats` | Stats (video, comment, likes) |
| DELETE | `/admin/community/comments/:id` | Xoá comment |
| DELETE | `/admin/community/comments/bulk` | Xoá bulk |
| PATCH | `/admin/community/comments/:id/ban` | Ban user comment |
| PATCH | `/admin/community/comments/bulk-ban` | Ban bulk |
| GET | `/admin/community/banned-users` | Danh sách banned |
| PATCH | `/admin/community/users/:phone/unban` | Unban user |

**Settings:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/admin/settings` | Lấy settings |
| PATCH | `/admin/settings/:key` | Update setting |

**Thai Config:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/admin/thai-limits` | Hạn mức default mỗi Thai |
| PUT | `/admin/thai-limits` | Update hạn mức |
| GET | `/admin/thai-switches` | Công tắc Thai |
| PUT | `/admin/thai-switches` | Update switches |

**Báo cáo:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/admin/profit-loss` | Báo cáo lãi/lỗ |
| GET | `/admin/profit-loss/yearly` | Tổng kết năm |

**Câu Thai:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/admin/cau-thai` | List ảnh |
| POST | `/admin/cau-thai` | Thêm ảnh |
| PATCH | `/admin/cau-thai/:id` | Toggle active/edit |
| DELETE | `/admin/cau-thai/:id` | Xoá ảnh |

---

## 8. BUSINESS LOGIC

### 8.1 Hạn mức (CRITICAL ⚠️)

> **Không được oversell** dưới concurrent checkout.

```sql
BEGIN TRANSACTION;
  -- Lock row
  SELECT sold_amount FROM session_animals
  WHERE session_id = $1 AND animal_order = $2
  FOR UPDATE;

  -- Check
  IF sold_amount + order_amount > limit_amount THEN
    ROLLBACK; -- "Con X đã hết hạn mức"
  END IF;

  -- Update
  UPDATE session_animals SET sold_amount = sold_amount + $amt ...;
  INSERT INTO orders (...);
COMMIT;
```

- **All-or-nothing**: 1 con hết → FAIL toàn đơn, ROLLBACK
- Row-level lock: `SELECT ... FOR UPDATE`

### 8.2 Đóng tịch

Xác định bằng `drawTimes.ts`:
```
now < slot.endTime → MỞ (cho mua)
now >= slot.endTime → ĐÓNG
now >= drawTime → Hiển thị kết quả
```

### 8.3 PayOS Webhook

1. User checkout → `POST /orders` → Server tạo order (pending) + PayOS link
2. User quét QR trên PayOS
3. PayOS → `POST /webhook/payos` → Server verify checksum + update

**Idempotent**:
```javascript
if (order.status !== 'pending') return; // Already processed
order.status = 'paid';
```

**Expiry**: Payment link 15 phút → expired → rollback hạn mức

### 8.4 Kết quả xổ

1. Admin chọn Thai + Khung + Ngày + Ngày âm lịch
2. Chọn con trúng (single select) hoặc "Ngày nghỉ"
3. `POST /admin/sessions/:id/result`
4. Update session: `status → 'resulted'`, `winning_animal = X`
5. Update orders: `status → 'won'` hoặc `'lost'`
6. SSE broadcast kết quả

---

## 9. SESSION LIFECYCLE

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  SCHEDULED  │ ──► │    OPEN     │ ──► │   CLOSED    │ ──► │  RESULTED   │
│ Chưa đến giờ│     │ Đang bán    │     │ Đóng tịch   │     │ Có kết quả  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

**Session = `{thai_id, session_date, session_type}`** — primary business unit.
Mọi order, hạn mức, kết quả đều thuộc 1 session.

---

## 10. DEPLOYMENT

### 10.1 File Upload

```
POST /api/upload/cau-thai
→ Multer → /app/uploads/cau-thai/{timestamp}-{uuid}.png
→ Response: { imageUrl: "/uploads/cau-thai/..." }
```

Docker volume `uploads_data` → persistent.

### 10.2 VPS Structure

```
/opt/conhon/                          ← Clone từ GitHub
├── docker-compose.yml
├── .env                              ← Secrets
├── Makefile                          ← make up, make deploy, make backup-db
├── backend/ + frontend/ + database/
│
/etc/nginx/conf.d/conhon.conf         ← SSL terminator
/etc/letsencrypt/live/..../           ← SSL certs
/var/lib/docker/volumes/              ← Persistent data
```

### 10.3 Deploy workflow

```bash
cd /opt/conhon
git fetch origin && git reset --hard origin/ready-production
docker compose up --build -d
```

Hoặc: `make deploy`

### 10.4 Checklist

- [x] Docker Compose 4 services
- [x] SSL Let's Encrypt + auto-renew
- [x] PayOS webhook verified
- [x] uploads volume persistent
- [ ] Database backup schedule
- [ ] Monitoring + alerting
- [ ] CI/CD pipeline (GitHub Actions)

---

## 11. PHỤ LỤC

### A. Danh sách 40 con vật

| STT | Tên | Alias | Nhóm |
|-----|-----|-------|------|
| 1 | Cá Trắng | Chiếm Khôi | Tứ trạng nguyên |
| 2 | Ốc | Bảng Nhãn | Tứ trạng nguyên |
| 3 | Ngỗng | Thám Hoa | Tứ trạng nguyên |
| 4 | Công | Hoàng Giáp | Tứ trạng nguyên |
| 5 | Trùn | Ngũ Đại Quân | Ngũ hổ tướng |
| ... | ... | ... | ... |
| 37 | Ông Trời | — | Tứ thần linh |
| 38 | Ông Địa | — | Tứ thần linh |
| 39 | Thần Tài | — | Tứ thần linh |
| 40 | Ông Táo | — | Tứ thần linh |

> **Hoài Nhơn** chỉ có 36 con (không có Tứ thần linh 37–40).
> Full list: `frontend/src/constants/ANIMAL_DATA.ts`

### B. Constants files

| File | Nội dung |
|------|---------|
| `constants/ANIMAL_DATA.ts` | 40 con: name, alias, group, image |
| `constants/animalData.ts` | Animal helper functions |
| `constants/gameConfig.ts` | PRIZE_RATIO, GAME_PERIOD, Thai times |
| `constants/drawTimes.ts` | DRAW_TIMES, KHUNG_LABELS, getSessionStatus() |

---

*Phiên bản 4.0 — Audit toàn bộ code, khớp 100% schema.sql + routes + pages — 08/02/2026*
