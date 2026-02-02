# CỔ NHƠN - ĐẶC TẢ HỆ THỐNG

> **Phiên bản**: 3.0 | **Cập nhật**: 03/02/2026
> **Mục đích**: Đặc tả chi tiết theo từng Tab, bao gồm UI, Data, API và Logic

---

## MỤC LỤC

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Quy mô và hiệu năng](#2-quy-mô-và-hiệu-năng)
3. [Kiến trúc dữ liệu](#3-kiến-trúc-dữ-liệu)
4. [Xác thực & Phân quyền](#4-xác-thực--phân-quyền)
5. [User Tabs](#5-user-tabs)
6. [Admin Tabs](#6-admin-tabs)
7. [Quy tắc nghiệp vụ](#7-quy-tắc-nghiệp-vụ)
8. [Session Lifecycle](#8-session-lifecycle)
9. [Testing](#9-testing)
10. [CI/CD & Deployment](#10-cicd--deployment)
11. [Phụ lục](#11-phụ-lục)

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1 Mô tả
Cổ Nhơn là trò chơi dân gian truyền thống của Bình Định, diễn ra **khoảng 10 ngày trước Tết đến hết mùng 10 Tết** (~20 ngày).

### 1.2 Ba Thai (Khu vực)

| Thai | Số con | Phiên xổ | Giờ đóng tịch | Giờ xổ |
|------|--------|----------|---------------|--------|
| **An Nhơn** | 40 | Sáng, Chiều, Tối (Tết) | 10:30, 16:30, 20:30 | 11:00, 17:00, 21:00 |
| **Nhơn Phong** | 40 | Sáng, Chiều | 10:30, 16:30 | 11:00, 17:00 |
| **Hoài Nhơn** | 36 | Trưa, Chiều | 12:30, 18:30 | 13:00, 19:00 |

> **Lưu ý**: Phiên Tối (21h) chỉ có ở Thai An Nhơn, từ mùng 1-10 Tết.

### 1.3 Tỷ lệ thưởng
- **Mặc định**: Mua 1 trúng 30 (10.000đ → 300.000đ)
- **Riêng Hoài Nhơn**: Con Trùn (số 5) chung 70

### 1.4 Quy ước lịch
- **Backend**: Dùng lịch DƯƠNG (`YYYY-MM-DD`)
- **Frontend**: Admin nhập `lunar_label` ("Mùng 3", "25 tháng Chạp")

---

## 2. QUY MÔ VÀ HIỆU NĂNG

### 2.1 Ước tính người dùng

| Thời điểm | Số người đồng thời |
|-----------|-------------------|
| Tổng mỗi Thai | 300-500 cả mùa |
| Giờ cao điểm | ~150 (10 phút trước đóng tịch) |

### 2.2 Giờ cao điểm
```
SÁNG:   10:00 - 10:30 (An Nhơn, Nhơn Phong)
TRƯA:   12:00 - 12:30 (Hoài Nhơn)
CHIỀU:  16:00 - 16:30 (An Nhơn, Nhơn Phong)
        18:00 - 18:30 (Hoài Nhơn)
TỐI:    20:00 - 20:30 (An Nhơn - chỉ Tết)
```

### 2.3 Yêu cầu hiệu năng
- **Response time**: < 500ms
- **Database queries**: < 100ms
- **Concurrent orders**: 100-200/phiên

### 2.4 Chiến lược cache

| Data | Cache strategy |
|------|----------------|
| 40 con vật | Hardcode client, không query |
| 3 Thai | Hardcode client, không query |
| Hạn mức live | Poll mỗi 10-15s |
| Countdown | Client tự đếm, không poll |
| Kết quả xổ | Cache 5 phút |

---

## 3. KIẾN TRÚC DỮ LIỆU

### 3.1 Constants (Hardcode client-side)

**KHÔNG LƯU DATABASE** - Tải 1 lần khi app start:

```typescript
// THAIS - 3 records cố định
export const THAIS = {
  'an-nhon': { name: 'An Nhơn', animalCount: 40 },
  'nhon-phong': { name: 'Nhơn Phong', animalCount: 40 },
  'hoai-nhon': { name: 'Hoài Nhơn', animalCount: 36 }
};

// ANIMALS - 40 con cố định (xem Phụ lục A)
export const ANIMALS: AnimalDefinition[] = [...];
```

### 3.2 Database Schema (5 bảng chính)

#### Bảng `users`
```sql
users (
  id              UUID PRIMARY KEY,
  phone           VARCHAR(15) UNIQUE NOT NULL,
  password_hash   VARCHAR(255),
  name            VARCHAR(100),
  zalo            VARCHAR(100),
  bank_code       VARCHAR(20),
  bank_account    VARCHAR(30),
  bank_holder     VARCHAR(100),
  role            ENUM('user', 'admin') DEFAULT 'user',
  completed_tasks VARCHAR[] DEFAULT '{}',  -- MXH tasks
  created_at      TIMESTAMP DEFAULT NOW()
)
```

#### Bảng `sessions` ⭐ Core
```sql
sessions (
  id              UUID PRIMARY KEY,
  thai_id         VARCHAR(20) NOT NULL,        -- 'an-nhon', etc.
  session_type    ENUM('morning','afternoon','evening'),
  session_date    DATE NOT NULL,
  lunar_label     VARCHAR(50),                 -- "Mùng 3 Tết"
  
  -- Lifecycle
  status          ENUM('scheduled','open','closed','resulted') DEFAULT 'scheduled',
  opens_at        TIMESTAMP,
  closes_at       TIMESTAMP,
  result_at       TIMESTAMP,
  
  -- Kết quả (sau xổ)
  winning_animal  INT,                         -- 1-40
  cau_thai        TEXT,
  cau_thai_image  VARCHAR(255),
  result_image    VARCHAR(255),
  
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(thai_id, session_date, session_type)
)
-- INDEX
CREATE INDEX idx_sessions_live ON sessions(thai_id, status) 
  WHERE status IN ('open', 'scheduled');
```

#### Bảng `session_animals` (Hạn mức live)
```sql
session_animals (
  session_id      UUID REFERENCES sessions(id),
  animal_order    INT NOT NULL,                -- 1-40
  limit_amount    BIGINT DEFAULT 5000000,      -- Hạn mức VNĐ
  sold_amount     BIGINT DEFAULT 0,            -- Đã bán
  is_banned       BOOLEAN DEFAULT false,
  ban_reason      VARCHAR(200),
  PRIMARY KEY (session_id, animal_order)
)
```

#### Bảng `orders`
```sql
orders (
  id              UUID PRIMARY KEY,
  session_id      UUID REFERENCES sessions(id),
  user_id         UUID REFERENCES users(id),
  total           BIGINT NOT NULL,
  status          ENUM('pending','paid','won','lost','cancelled','expired'),
  payment_code    VARCHAR(50),                 -- PayOS orderCode
  payment_url     VARCHAR(500),
  payment_expires TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  paid_at         TIMESTAMP
)
-- INDEX
CREATE INDEX idx_orders_session ON orders(session_id);
CREATE INDEX idx_orders_user ON orders(user_id, created_at DESC);
```

#### Bảng `order_items`
```sql
order_items (
  id              UUID PRIMARY KEY,
  order_id        UUID REFERENCES orders(id),
  animal_order    INT NOT NULL,
  quantity        INT NOT NULL,
  unit_price      INT NOT NULL,
  subtotal        BIGINT NOT NULL
)
```

#### Bảng `community_posts` (Cộng đồng)
```sql
community_posts (
  id              UUID PRIMARY KEY,
  thai_id         VARCHAR(20),       -- 'an-nhon', 'nhon-phong', 'hoai-nhon'
  youtube_id      VARCHAR(20),       -- YouTube video ID
  title           VARCHAR(200),
  content         TEXT,
  like_count      INT DEFAULT 0,     -- User like qua API
  is_pinned       BOOLEAN DEFAULT false,
  created_at      TIMESTAMP DEFAULT NOW()
)
```

#### Bảng `community_comments` (Bình luận)
```sql
community_comments (
  id              UUID PRIMARY KEY,
  post_id         UUID REFERENCES community_posts(id),
  user_id         UUID REFERENCES users(id),
  user_name       VARCHAR(100),
  user_phone      VARCHAR(20),
  content         TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
)
-- Limit 3 comments/user/post: Check COUNT(*) before INSERT
```

### 3.3 ERD Diagram

```
┌──────────┐       ┌─────────────┐       ┌──────────────────┐
│  users   │       │  sessions   │       │ session_animals  │
├──────────┤       ├─────────────┤       ├──────────────────┤
│ id (PK)  │       │ id (PK)     │◄──────│ session_id (FK)  │
│ phone    │       │ thai_id     │       │ animal_order     │
│ name     │       │ session_type│       │ limit_amount     │
│ ...      │       │ session_date│       │ sold_amount      │
│ completed│       │ status      │       │ is_banned        │
│ _tasks[] │       │ winning_    │       └──────────────────┘
└────┬─────┘       │ animal      │
     │             └──────┬──────┘
     │                    │
     │    ┌───────────────┘
     │    │
     ▼    ▼
┌─────────────┐       ┌──────────────┐
│   orders    │       │ order_items  │
├─────────────┤       ├──────────────┤
│ id (PK)     │◄──────│ order_id(FK) │
│ session_id  │       │ animal_order │
│ user_id(FK) │       │ quantity     │
│ total       │       │ unit_price   │
│ status      │       └──────────────┘
└─────────────┘
```

---

## 4. XÁC THỰC & PHÂN QUYỀN

### 4.1 Phân quyền

| Role | Truy cập |
|------|----------|
| **Guest** | Trang chủ, Hướng dẫn, Đăng nhập/ký, Xem kết quả (readonly) |
| **User** | + Mua hàng, Thanh toán, Lịch sử, Thông tin, Cộng đồng |
| **Admin** | Dashboard, Quản lý con vật/đơn hàng/người dùng, Báo cáo |

### 4.2 Trang Đăng nhập (`/dang-nhap`)

**UI**:
| Field | Validation |
|-------|------------|
| SĐT | Required, 10-11 số |
| Mật khẩu | Required, min 6 |

**API**: `POST /auth/login`
```json
{ "phone": "0901234567", "password": "******" }
→ { "token": "jwt...", "user": {...} }
```

**Data**: `users` table

---

### 4.3 Trang Đăng ký (`/dang-ky`)

**UI**:
| Field | Validation | Ghi chú |
|-------|------------|---------|
| Họ tên | Required | |
| SĐT | Required, unique | ⚠️ Không đổi được |
| Zalo | Required | Tên hoặc SĐT |
| Mật khẩu | Required, min 6 | |
| Xác nhận MK | Phải khớp | |

**API**: `POST /auth/register`

**Data**: `INSERT INTO users`

---

### 4.4 Nhiệm vụ MXH (Social Tasks)

> User mới phải hoàn thành 4 nhiệm vụ **1 lần duy nhất** để mở khóa mua hàng.

| Task ID | Mô tả |
|---------|-------|
| `follow-fb` | Theo dõi Fanpage Facebook |
| `sub-youtube` | Đăng ký kênh YouTube |
| `like-post` | Like bài viết mới nhất |
| `share-post` | Chia sẻ bài viết |

**Data**: `users.completed_tasks[]`

**Logic**:
```typescript
const canBuy = ['follow-fb','sub-youtube','like-post','share-post']
  .every(t => user.completed_tasks.includes(t));
```

---

## 5. USER TABS

> Header navigation: 🛒 Mua hàng | 🎁 Kết quả | 📋 Lịch sử | 👥 Cộng đồng | 👤 Thông tin | 📞 Hỗ trợ

---

### 5.1 Tab Mua hàng (`/user/mua-con-vat`) ⭐ CORE

**UI**:
| Phần | Nội dung |
|------|----------|
| Chọn Thai | 3 tabs: An Nhơn / Nhơn Phong / Hoài Nhơn |
| Trạng thái | Đang mở / Đã đóng / Countdown |
| Grid con vật | 40/36 cards: STT, tên, hạn mức, giá |
| Giỏ hàng | Danh sách đã chọn, tổng tiền |
| Nút Thanh toán | → Tạo order + redirect PayOS |

**Data liên kết**:
| Bảng | Mục đích |
|------|----------|
| `sessions` | Lấy session đang `open` của Thai |
| `session_animals` | Hạn mức live của 40 con |
| `ANIMALS` (const) | Tên, ảnh, nhóm con vật |

**API**:
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/sessions/current?thai_id=` | Session đang mở |
| GET | `/sessions/:id/animals` | Hạn mức 40 con |
| POST | `/orders` | Tạo đơn + payment link |

**Logic**:
1. Xác định session: `thai_id + current time → session.status = 'open'`
2. **⚠️ QUAN TRỌNG**: Kiểm tra hạn mức **TRƯỚC** khi chuyển sang trang thanh toán (tránh tạo order rác)
   - Gọi API `/check-limits` với danh sách con trong giỏ
   - Nếu hết slot → Báo lỗi ngay, không cho qua trang thanh toán
   - Nếu còn slot → Cho redirect sang `/user/thanh-toan`
3. Kiểm tra MXH completed
4. Tạo order + Gọi PayOS tạo payment link
5. Atomic: Lock hạn mức khi tạo order - xem [Section 7.1](#71-logic-hạn-mức-critical)

---

### 5.2 Tab Thanh toán (`/user/thanh-toan`)

**UI**:
| Phần | Nội dung |
|------|----------|
| Chi tiết đơn | Danh sách con, số lượng, thành tiền |
| QR PayOS | Iframe hoặc QR code |
| Countdown | Thời gian hết hạn thanh toán |
| Trạng thái | Chờ TT / Đã TT / Hết hạn |

**Data**: `orders WHERE status = 'pending'`

**API**: WebSocket hoặc polling `GET /orders/:id/status`

**Logic**: PayOS webhook → update status - xem [Section 7.3](#73-logic-payos)

---

### 5.3 Tab Kết quả (`/user/ket-qua`)

**UI**:
| Phần | Nội dung |
|------|----------|
| Filter | Chọn Thai, chọn ngày |
| Kết quả | Con trúng, ảnh xổ, câu thai |

**Data**: `sessions WHERE status = 'resulted'`

**API**: `GET /results?thai_id=&date=`

**Data Fetching**:
- **Mặc định**: Fetch 1 lần khi vào trang hoặc đổi filter (không cần polling)
- **Kết quả ngày cũ**: Cache vĩnh viễn (kết quả đã xổ không đổi)
- **Kết quả ngày hôm nay**:
  - Nếu chưa xổ → Hiển thị "Chưa có kết quả - Xổ lúc XX:00"
  - Nếu đúng giờ xổ (±15 phút) → Polling mỗi 30s chờ kết quả
  - Nếu đã xổ → Hiển thị kết quả, không cần polling

---

### 5.4 Tab Lịch sử (`/user/lich-su`)

**UI**:
| Phần | Nội dung |
|------|----------|
| Filter | Thai, Trạng thái |
| Danh sách | Mã đơn, ngày, tổng tiền, trạng thái |
| Chi tiết | → `/user/hoa-don/:orderId` |

**Data**: `orders WHERE user_id = current JOIN sessions`

**API**: `GET /orders/me?thai_id=&status=`

---

### 5.5 Tab Cộng đồng (`/user/cong-dong`)

**UI**:
| Phần | Nội dung |
|------|----------|
| Thai Selector | 3 Cards: An Nhơn, Nhơn Phong, Hoài Nhơn |
| Video List | Cards: Thumbnail + Title + ❤️ likes + 💬 comments |
| Video Detail | YouTube player + Like button + Comment list + Comment form |

**User Interactions**:
| Action | Logic |
|--------|-------|
| **Like** | Toggle ❤️/🤍. API update `like_count`. LocalStorage prevent double-like |
| **Comment** | Hiển thị ngay. Max 3 comments/user/video. Admin xóa nếu vi phạm |

**Data**: 2 bảng - `community_posts`, `community_comments`

**API**: 
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/community/posts?thai_id=` | Danh sách videos |
| POST | `/community/posts/:id/like` | Toggle like (+1/-1) |
| POST | `/community/posts/:id/comments` | Gửi comment |

**⚡ Tối ưu**:
- Cache posts: 5 phút
- LocalStorage: Lưu `liked_posts: ["post-id-1", "post-id-2"]`
- Check comment limit: `SELECT COUNT(*) FROM comments WHERE post_id=? AND user_id=?`

**Embed YouTube**:

Admin chỉ cần **copy link share** từ YouTube (bấm Chia sẻ → Sao chép):
```
https://youtu.be/zmUcoIwzVo?si=xxx
https://www.youtube.com/watch?v=zmUcoIwzVo
```

Backend tự extract `youtube_id`:
```javascript
function extractYoutubeId(input) {
  if (input.includes('youtu.be/')) 
    return input.split('youtu.be/')[1].split('?')[0];
  if (input.includes('v=')) 
    return input.split('v=')[1].split('&')[0];
  return input; // Nếu chỉ paste ID thuần
}
```

Frontend render iframe:
```html
<iframe src="https://www.youtube.com/embed/{youtube_id}" 
  allowfullscreen></iframe>
```

---

### 5.6 Tab Thông tin (`/user/thong-tin-ca-nhan`)

**UI**:
| Field | Editable | Component |
|-------|----------|-----------|
| Họ tên | ✅ | Input |
| SĐT | ❌ Readonly | Display |
| Zalo | ✅ | Input |
| Ngân hàng | ✅ | **Searchable Dropdown** (gõ tìm kiếm) |
| STK | ✅ | Input |
| Chủ TK | ✅ | Input |

> **Searchable Dropdown**: User gõ "Viet" → hiện Vietcombank, VietinBank, VietCapital...

**Data**: `users`

**API**: `PATCH /users/me`

---

### 5.7 Tab Hỗ trợ (`/user/ho-tro`)

**UI**: FAQ accordion, Hotline, Zalo, Fanpage

**Data**: Static content (hardcode hoặc CMS)

---

## 6. ADMIN TABS

> Admin login riêng: `/admin/dang-nhap`

**Tài khoản mặc định**:
- Username: `admin`
- Password: `admin123`

> ⚠️ **Thêm admin mới**: Không có UI tạo admin. Phải truy cập database trực tiếp qua VPS:
> ```sql
> INSERT INTO users (phone, password_hash, name, role) 
> VALUES ('admin2', 'hashed_password', 'Admin 2', 'admin');
> ```

---

> 💡 **Lưu ý tối ưu**: Admin chỉ có 1-2 người dùng → Không cần tối ưu request/cache như phía user. Query trực tiếp được.

### 6.1 Dashboard (`/admin`)

**Filter Tabs**:
| Nhóm | Options |
|------|---------|
| Thai | Tất cả, Thai An Nhơn, Thai Nhơn Phong, Thai Hoài Nhơn |
| Buổi | Tất cả buổi, Sáng, Chiều |
| Ngày | Date picker (Theo ngày) |

**Stat Cards** (3 cards) - Query khác nhau:
| Card | Query |
|------|-------|
| Doanh thu hôm nay | `SUM(orders.total) WHERE paid_at::date = TODAY AND status IN ('paid','won','lost')` |
| Tổng đơn hàng | `COUNT(orders) WHERE status IN ('paid','won','lost')` (tất cả thời gian) |
| Đơn hôm nay | `COUNT(orders) WHERE created_at::date = TODAY` |

**Top 5 mua nhiều nhất** (cột trái):
```sql
SELECT animal_order, SUM(quantity) as total_qty, SUM(subtotal) as total_amount
FROM order_items JOIN orders ON ...
WHERE orders.status IN ('paid','won','lost')
  AND (filter theo thai/buổi/ngày nếu có)
GROUP BY animal_order
ORDER BY total_qty DESC
LIMIT 5
```

**Top 5 mua ít nhất** (cột phải):
```sql
-- Tương tự nhưng ORDER BY total_qty ASC
-- Chỉ lấy con có ít nhất 1 lượt mua (loại con 0 lượt)
```

**Data**: `orders`, `order_items`, `sessions`

**API**: `GET /admin/stats?thai_id=&session_type=&date=`

---

### 6.2 Quản lý con vật (`/admin/con-vat`) ⭐ LIVE

**UI**:
| Phần | Nội dung |
|------|----------|
| Chọn Thai | Dropdown |
| Session hiện tại | Sáng/Chiều/Tối + trạng thái |
| Grid 40 con | STT, tên, limit, sold, remaining, toggle ban |

**Data liên kết**:
| Bảng | Mục đích |
|------|----------|
| `sessions` | Session đang open/scheduled |
| `session_animals` | **LIVE data** - Admin có thể edit |

**API**:
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/admin/sessions/current/:thai_id` | Session live |
| PATCH | `/admin/session-animals` | Update limit/ban |

**Logic**:
- Đây là data **SỐNG**, real-time
- Sau khi xổ → session archived → tạo session mới

---

### 6.3 Quản lý đơn hàng (`/admin/don-hang`)

**Filter**:
| Nhóm | Options |
|------|---------|
| Ngày | Date picker |
| Thai | Tất cả, An Nhơn, Nhơn Phong, Hoài Nhơn |
| Buổi | Tất cả, Sáng, Chiều |

**Bảng orders**: ID, Người mua, Thai, Con vật (badges), Tổng tiền, Trạng thái, Thao tác

**Modal chi tiết đơn hàng** (khi bấm "Chi tiết"):
| Field | Query từ |
|-------|----------|
| Khách hàng + SĐT | `users` (JOIN user_id) |
| Thai + Thời gian | `sessions` (JOIN session_id) |
| Trạng thái | `orders.status` |
| Ngân hàng | `users.bank_code, bank_account, bank_holder` |
| Danh sách con vật | `order_items` + **animal name từ master list** |
| Tổng cộng | `orders.total` |

**Data**: `orders JOIN sessions JOIN users JOIN order_items`

**API**: 
- `GET /admin/orders?date=&thai_id=&session_type=`
- `GET /admin/orders/:id` (chi tiết + items)
- `PATCH /admin/orders/:id` (update status)

> ⚠️ **Lưu ý khi lên real data**: `order_items.animal_order` cần map với danh sách con vật để lấy tên. Lưu `animal_name` vào `order_items` lúc tạo order để tránh JOIN phức tạp.

---

### 6.4 Quản lý kết quả (`/admin/ket-qua`)

**UI**:
| Phần | Nội dung |
|------|----------|
| Chọn Thai | Tabs: An Nhơn, Nhơn Phong, Hoài Nhơn |
| Thai (Khung giờ) | Dropdown: "Thai An Nhơn - Sáng (11:00)" |
| Ngày | Date picker |
| Ngày âm lịch | Input text (VD: "Mùng 3", "25 tháng Chạp", "30 Tết") |
| Ngày nghỉ | Checkbox "Ngày nghỉ - Không xổ" |
| Chọn con vật trúng | Grid 40 con (single select) |
| Lịch sử kết quả | Danh sách đã nhập bên phải |

**Data**: `sessions` (update `winning_animal`, `lunar_label`, `status`)

**API**: `POST /admin/sessions/:id/result`

**Logic**:
1. Admin chọn Thai + ngày + nhập ngày âm lịch
2. Chọn con vật trúng (hoặc tick "Ngày nghỉ" nếu không xổ)
3. Update session: status → resulted, winning_animal, lunar_label
4. Calculate win/lose cho orders liên quan
5. Ready for next session

#### 6.4.1 Thống kê Nhóm (trong trang Kết quả)

**UI**:
| Phần | Nội dung |
|------|----------|
| Năm | Dropdown chọn năm (2026, 2027...) |
| Nhóm xổ nhiều nhất | Card highlight |
| Nhóm xổ ít nhất | Card highlight |
| Danh sách 10 nhóm | Tên nhóm + badges con vật + số lần xổ |

**10 nhóm con vật** (⚠️ HARDCODE trong code, không lưu database):

```typescript
// constants/animalGroups.ts
export const ANIMAL_GROUPS = [
  { id: 1, name: 'Tứ trạng nguyên', animals: [1, 2, 3, 4] },
  { id: 2, name: 'Ngũ hổ tướng', animals: [5, 6, 7, 8, 9] },
  { id: 3, name: 'Thất sinh lý', animals: [10, 11, 12, 13, 14, 15, 16] },
  { id: 4, name: 'Nhị đạo sĩ', animals: [17, 18] },
  { id: 5, name: 'Tứ mỹ nữ', animals: [19, 20, 21, 22] },
  { id: 6, name: 'Tứ hào mạng', animals: [23, 24, 25, 26] },
  { id: 7, name: 'Tứ hòa thượng', animals: [27, 28, 29, 30] },
  { id: 8, name: 'Ngũ khất thực', animals: [31, 32, 33, 34, 35] },
  { id: 9, name: 'Nhất ni cô', animals: [36] },
  { id: 10, name: 'Tứ thần linh', animals: [37, 38, 39, 40] },
];
```

**Query số lần xổ mỗi nhóm** (dùng IN với hardcode arrays):
```sql
-- Backend loop qua ANIMAL_GROUPS, mỗi nhóm query:
SELECT COUNT(*) as win_count
FROM sessions
WHERE winning_animal IN (1, 2, 3, 4)  -- animals từ group
  AND EXTRACT(YEAR FROM session_date) = :year
  AND status = 'resulted'
```

---

#### 6.4.2 Tổng kết cuối mùa (trong trang Kết quả)

**UI**:
| Phần | Nội dung |
|------|----------|
| Năm | Dropdown chọn năm |
| Cards 3 Thai | Tổng lần xổ, số con đã xổ, con chưa xổ |
| Tabs | An Nhơn / Nhơn Phong / Hoài Nhơn |
| Top 5 con vật xổ nhiều nhất | Badges |
| Con vật chưa xổ | Grid 40 badges |
| Top 2 nhóm xổ nhiều nhất | Badges |
| Nhóm chưa xổ | Text list |
| Top 5 vị trí xổ nhiều nhất | Badges |
| Quy luật xổ đặc biệt | Con nào xổ/chưa xổ |
| Báo cáo Thắng/Thua theo buổi | Table: Buổi, Doanh thu, Trả thưởng, Lãi/Lỗ |

**Query tổng quan mỗi Thai:**
```sql
SELECT thai_id,
  COUNT(*) as total_sessions,
  COUNT(DISTINCT winning_animal) as unique_animals,
  40 - COUNT(DISTINCT winning_animal) as animals_not_won
FROM sessions
WHERE EXTRACT(YEAR FROM session_date) = :year
  AND status = 'resulted'
GROUP BY thai_id
```

**Query báo cáo Thắng/Thua:**
```sql
SELECT s.session_type,
  SUM(o.total) as doanh_thu,
  SUM(CASE WHEN o.status='won' THEN o.total*7.5 ELSE 0 END) as tra_thuong,
  SUM(o.total) - SUM(CASE WHEN o.status='won' THEN o.total*7.5 ELSE 0 END) as lai_lo
FROM orders o
JOIN sessions s ON o.session_id = s.id
WHERE s.thai_id = :thai_id
  AND EXTRACT(YEAR FROM s.session_date) = :year
GROUP BY s.session_type
```

---

### 6.5 Quản lý câu thai (`/admin/cau-thai`)

**UI chính**:
| Phần | Nội dung |
|------|----------|
| Năm | Dropdown chọn năm (2026, 2027...) |
| Thai | Tabs: An Nhơn, Nhơn Phong, Hoài Nhơn |
| Ảnh đang hiển thị | ✅ Checkbox chọn ảnh hiện trên trang chủ + tên ảnh |
| Upload ảnh mới | Button mở modal upload |
| Danh sách ảnh | Gallery ảnh đã upload cho Thai + Năm |

**Modal Upload ảnh câu thai**:
| Field | Mô tả |
|-------|-------|
| Thai | Auto-fill từ tab đang chọn (readonly) |
| Năm | Auto-fill từ dropdown (readonly) |
| Upload ảnh | Drag & drop hoặc click (PNG, JPG, WEBP max 5MB) |
| Tên ảnh câu thai | Input (VD: "Câu Thai Mùng 9 Tết Ất Tỵ") |
| Ngày âm lịch | Input (VD: "Mùng 9, 30 Tết, 25 tháng Chạp") |

**Chỉ định ảnh hiển thị trên trang chủ**:
- Mỗi Thai + Năm có **1 ảnh featured** (hiển thị ở section "Câu Thai Mới Nhất")
- Admin tick checkbox để chọn ảnh nào hiển thị
- Khi tick ảnh mới → tự động untick ảnh cũ

**Vị trí hiển thị ảnh featured** (User pages):
| Page | Vị trí | Component |
|------|--------|-----------|
| Trang chủ (`/`) | Section "Câu Thai Mới Nhất" - cột trái | `HomePage.tsx` hoặc `CauThaiSection.tsx` |
| Kết quả xổ (`/user/ket-qua`) | Có thể có nếu muốn | `KetQuaPage.tsx` |

**Query lấy ảnh featured cho user:**
```sql
SELECT * FROM cau_thai_images 
WHERE thai_id = :thai_id 
  AND year = :current_year 
  AND is_featured = true
LIMIT 1
```

**Database**: Cần thêm bảng `cau_thai_images`:
```sql
cau_thai_images (
  id              UUID PRIMARY KEY,
  thai_id         VARCHAR(20) NOT NULL,
  year            INT NOT NULL,
  image_url       VARCHAR(500),
  title           VARCHAR(200),      -- "Câu Thai Mùng 9..."
  lunar_label     VARCHAR(100),      -- "Mùng 9"
  is_featured     BOOLEAN DEFAULT false,  -- Hiển thị trên trang chủ
  created_at      TIMESTAMP DEFAULT NOW()
)
-- Constraint: Mỗi thai + year chỉ có 1 is_featured = true
```

**API**: 
- `GET /admin/cau-thai?thai_id=&year=` (lấy danh sách)
- `POST /admin/cau-thai` (upload mới)
- `PATCH /admin/cau-thai/:id/featured` (set featured)
- `DELETE /admin/cau-thai/:id`

---

### 6.6 Báo cáo (`/admin/bao-cao`) 📊

**Filter Tabs**:
| Nhóm | Options |
|------|---------|
| Thai | Tabs: An Nhơn, Nhơn Phong, Hoài Nhơn |
| Thời gian | Theo ngày (date picker), Tất cả |
| Buổi | Tất cả buổi, Sáng, Chiều, Tối |

> ⚠️ **Không có "Dịp Tết"** - Dùng lịch dương làm chuẩn, không filter theo lịch âm

**Thống kê Cards**:
| Card | Nội dung |
|------|----------|
| Tổng lượt mua | Số lượt theo filter |
| Tổng doanh thu | VNĐ |
| Số con đã mua | X/40 |
| Thai đang xem | Tên Thai |

**Grid 40 con**: STT, tên, alias, số lượt, số tiền + Tổng cộng mỗi hàng

**Top 5 con mua nhiều nhất / ít nhất**: 2 cột

**Data**: `sessions (resulted) JOIN orders JOIN order_items`

**API**: `GET /admin/reports?thai_id=&date=&session_type=`

**Query example**:
```sql
SELECT oi.animal_order,
       COUNT(*) as purchase_count,
       SUM(oi.subtotal) as total_amount
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
JOIN sessions s ON o.session_id = s.id
WHERE s.thai_id = :thai_id
  AND o.status IN ('paid','won','lost')
  AND (:date IS NULL OR s.session_date = :date)
GROUP BY oi.animal_order
ORDER BY oi.animal_order
```

#### 6.6.1 Modal Chi tiết con vật (bấm vào từng con)

**Header**: Tên con + Alias + STT (VD: "Cọp - Khôn Sơn - #06")

**Thống kê**:
| Card | Nội dung |
|------|----------|
| Tổng lượt mua | Số lượt |
| Tổng doanh thu | VNĐ |
| Số khách hàng | Unique users |

**Danh sách khách hàng mua** (để trả thưởng):
| Cột | Dữ liệu |
|-----|---------|
| Mã đơn | order_id (VD: HD009) |
| Ngày giờ | created_at |
| Tên khách | users.name |
| SĐT | users.phone |
| Số tài khoản (Bank) | users.bank_account + bank_code |
| Số tiền | order_items.subtotal |

> ⚠️ **Quan trọng**: Bảng này dùng để admin **trả thưởng** cho người thắng

**Query chi tiết con vật:**
```sql
SELECT 
  o.id as order_id,
  o.created_at,
  u.name, u.phone,
  u.bank_code, u.bank_account, u.bank_holder,
  oi.subtotal
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
JOIN users u ON o.user_id = u.id
JOIN sessions s ON o.session_id = s.id
WHERE oi.animal_order = :animal_order
  AND s.thai_id = :thai_id
  AND o.status IN ('paid','won','lost')
ORDER BY o.created_at DESC
```

---

### 6.7 Quản lý người dùng (`/admin/nguoi-dung`)

**UI**: Bảng users, modal chi tiết + orders của user

**Data**: `users`, `orders WHERE user_id = ?`

**API**: 
- `GET /admin/users`
- `PATCH /admin/users/:id` (edit info, lock/unlock)

---

### 6.8 Quản lý cộng đồng (`/admin/cong-dong`)

**UI chính**:
| Phần | Nội dung |
|------|----------|
| Thai Cards | 3 cards: An Nhơn, Nhơn Phong, Hoài Nhơn (số video mỗi Thai) |
| Stat Cards | 📺 Video, 💬 Bình luận, ❤️ Tổng likes |
| Video List | Danh sách video theo Thai đang chọn |
| Upload Button | "+ THÊM VIDEO" |

**Video Detail** (click vào video):
| Phần | Nội dung |
|------|----------|
| Video Player | YouTube embed |
| Stats | ❤️ X likes, 💬 X comments |
| Edit | Sửa title, xóa video |
| Comment List | Tên + SĐT + Nội dung + Thời gian + Nút XÓA |

**Database** (2 bảng duy nhất):
```sql
community_posts (
  id              UUID PRIMARY KEY,
  thai_id         VARCHAR(20),       -- 'an-nhon', 'nhon-phong', 'hoai-nhon'
  youtube_id      VARCHAR(20),
  title           VARCHAR(200),
  content         TEXT,
  like_count      INT DEFAULT 0,     -- User like qua API, LocalStorage prevent double
  is_pinned       BOOLEAN DEFAULT false,
  created_at      TIMESTAMP DEFAULT NOW()
)

community_comments (
  id              UUID PRIMARY KEY,
  post_id         UUID REFERENCES community_posts(id),
  user_id         UUID REFERENCES users(id),
  user_name       VARCHAR(100),
  user_phone      VARCHAR(20),
  content         TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
)
-- Limit 3 comments/user/post before INSERT
```

**Stats Query**:
```sql
SELECT 
  (SELECT COUNT(*) FROM community_posts WHERE thai_id = :thai_id) as video_count,
  (SELECT COUNT(*) FROM community_comments cc 
   JOIN community_posts cp ON cc.post_id = cp.id 
   WHERE cp.thai_id = :thai_id) as comment_count,
  (SELECT SUM(like_count) FROM community_posts WHERE thai_id = :thai_id) as total_likes
```

**Admin API**:
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/admin/community/stats?thai_id=` | Stats cards |
| GET | `/admin/community/posts?thai_id=` | List videos |
| POST | `/admin/community/posts` | Upload video |
| PATCH | `/admin/community/posts/:id` | Edit video |
| DELETE | `/admin/community/posts/:id` | Xóa video |
| DELETE | `/admin/community/comments/:id` | Xóa comment vi phạm |

---

### 6.9 Cài đặt (`/admin/cai-dat`)

**2 Tabs chính:**
| Tab | Nội dung |
|-----|----------|
| ⏰ **Thời gian** | Khung giờ từng Thai + Chế độ Tết |
| 🔌 **Công tắc** | Master Switch + Thông báo bảo trì + Thai toggles |

---

#### Tab 1: Thời gian

**UI mỗi Thai**:
- Khung 1: Time picker (Giờ bắt đầu → Giờ đóng tịch)
- Khung 2: Time picker
- (An Nhơn only) Chế độ Tết toggle + Khung 3

**Giờ MẶC ĐỊNH** (sync với Section 1.2):
| Thai | Khung | Bắt đầu | Đóng tịch | Xổ |
|------|-------|---------|-----------|-----|
| **An Nhơn** | Khung 1 | 07:00 | 10:30 | 11:00 |
|  | Khung 2 | 12:00 | 16:30 | 17:00 |
|  | Khung 3 (Tết) | 18:00 | 20:30 | 21:00 |
| **Nhơn Phong** | Khung 1 | 07:00 | 10:30 | 11:00 |
|  | Khung 2 | 12:00 | 16:30 | 17:00 |
| **Hoài Nhơn** | Khung 1 | 09:00 | 12:30 | 13:00 |
|  | Khung 2 | 14:00 | 18:30 | 19:00 |

> 💡 **Giờ xổ** = Giờ đóng tịch + 30 phút (tự tính)

**Liên kết với trang Mua hàng:**
```javascript
// Trang Mua hàng check trước khi cho mua
const schedule = getScheduleForThai(thaiId); // Từ bảng settings
const currentSlot = findCurrentSlot(schedule, now);

if (!currentSlot) {
  return showMessage("Chưa đến giờ được mua hàng");
}
if (now > currentSlot.close_time) {
  return showMessage("Đã hết giờ mua hàng. Vui lòng chờ khung giờ tiếp theo.");
}
// Cho phép mua
```

---

#### Tab 2: Công tắc

**CÔNG TẮC TỔNG (Master Switch)**:
| Trạng thái | Hành vi |
|------------|---------|
| ✅ ON | Hệ thống hoạt động bình thường |
| ❌ OFF | User vào trang login → Hiện "Thông báo bảo trì" |

**THÔNG BÁO BẢO TRÌ**:
- Textarea (max 200 chars)
- Hiển thị khi Master Switch = OFF
- Ví dụ: "Hệ thống Cổ Nhơn đang trong mùa nghỉ. Hẹn gặp lại vào Tết năm sau!"

**CÔNG TẮC TỪNG KHU VỰC**:
- 3 toggles: Thai An Nhơn, Thai Nhơn Phong, Thai Hoài Nhơn
- Chỉ hoạt động khi Master Switch = ON
- OFF = Thai đó không hiển thị trong danh sách user

---

#### Database Schema

```sql
settings (
  id              UUID PRIMARY KEY,
  key             VARCHAR(100) UNIQUE NOT NULL,
  value           JSONB,
  updated_at      TIMESTAMP DEFAULT NOW()
)
```

**Seed data (defaults)**:
```sql
INSERT INTO settings (key, value) VALUES
-- Master Switch
('master_switch', 'true'),
('maintenance_message', '"Hệ thống đang bảo trì..."'),

-- Thai toggles
('thai_an_nhon_enabled', 'true'),
('thai_nhon_phong_enabled', 'true'),
('thai_hoai_nhon_enabled', 'true'),

-- Chế độ Tết
('tet_mode', 'false'),

-- Schedules (start_time, close_time)
('schedule_an_nhon', '{
  "slot1": {"start_time": "07:00", "close_time": "10:30"},
  "slot2": {"start_time": "12:00", "close_time": "16:30"},
  "slot3": {"start_time": "18:00", "close_time": "20:30"}
}'),
('schedule_nhon_phong', '{
  "slot1": {"start_time": "07:00", "close_time": "10:30"},
  "slot2": {"start_time": "12:00", "close_time": "16:30"}
}'),
('schedule_hoai_nhon', '{
  "slot1": {"start_time": "09:00", "close_time": "12:30"},
  "slot2": {"start_time": "14:00", "close_time": "18:30"}
}');
```

---

#### Logic: Defaults vs Override

```javascript
// Backend logic
function getSchedule(thaiId) {
  const dbSchedule = await db.settings.findOne({ key: `schedule_${thaiId}` });
  
  if (dbSchedule) {
    return dbSchedule.value; // Admin đã override
  }
  
  // Fallback to hardcoded defaults
  return HARDCODED_DEFAULTS[thaiId];
}

// HARDCODED_DEFAULTS (backup) - dùng khi DB chưa có data
const HARDCODED_DEFAULTS = {
  'an_nhon': { 
    slot1: { start_time: '07:00', close_time: '10:30' }, 
    slot2: { start_time: '12:00', close_time: '16:30' }, 
    slot3: { start_time: '18:00', close_time: '20:30' } 
  },
  'nhon_phong': { 
    slot1: { start_time: '07:00', close_time: '10:30' }, 
    slot2: { start_time: '12:00', close_time: '16:30' } 
  },
  'hoai_nhon': { 
    slot1: { start_time: '09:00', close_time: '12:30' }, 
    slot2: { start_time: '14:00', close_time: '18:30' } 
  }
};

// Check schedule cho trang Mua hàng
function canBuy(thaiId) {
  const schedule = getSchedule(thaiId);
  const now = getCurrentTime(); // HH:mm format
  
  for (const slot of Object.values(schedule)) {
    if (now >= slot.start_time && now <= slot.close_time) {
      return { canBuy: true, slot };
    }
  }
  
  return { 
    canBuy: false, 
    message: "Chưa đến giờ được mua hàng" 
  };
}
```

---

#### API

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/admin/settings` | Lấy tất cả settings |
| PATCH | `/admin/settings/:key` | Update 1 setting |
| GET | `/api/system-status` | Public: Check master switch |

**User Login Check** (Pseudocode):
```javascript
// User vào trang login
const status = await fetch('/api/system-status');
if (!status.master_switch) {
  showMaintenanceModal(status.maintenance_message);
  return; // Không cho login
}
// Tiếp tục flow login bình thường
```

---

## 7. QUY TẮC NGHIỆP VỤ

### 7.1 Logic hạn mức (CRITICAL ⚠️)

> **RACE CONDITION WARNING**: Không được oversell dưới concurrent checkout.

**Yêu cầu**:
- Atomic transaction với row-level lock
- All-or-nothing: 1 con hết hạn mức → FAIL toàn đơn

**Pseudocode**:
```sql
BEGIN TRANSACTION
  FOR EACH item IN order.items:
    current = SELECT sold_amount FROM session_animals 
              WHERE session_id=? AND animal_order=?
              FOR UPDATE
    IF current + item.amount > limit_amount:
      ROLLBACK
      RETURN "Con X đã hết hạn mức"
  
  UPDATE session_animals SET sold_amount += ... WHERE ...
  INSERT INTO orders (...)
COMMIT
```

---

### 7.2 Logic đóng tịch

```
Giờ hiện tại < closes_at → MỞ (cho phép đặt)
Giờ hiện tại >= closes_at → ĐÓNG (không cho đặt)
Giờ hiện tại >= result_at → Chuyển sang session tiếp
```

---

### 7.3 Logic PayOS

**Luồng**:
1. User checkout → Server tạo order (pending) + PayOS link
2. User thanh toán trên PayOS
3. PayOS webhook → Server verify + update `status = paid`

**Webhook idempotent**:
```typescript
if (order.status !== 'pending') return; // Already processed
order.status = 'paid';
await order.save();
```

**Expiration**:
- Payment link expires sau 15 phút
- CRON job cleanup expired orders + rollback hạn mức

---

### 7.4 Giỏ hàng đa Thai

```
User chọn con từ NHIỀU Thai trong 1 giỏ
→ Checkout tách thành NHIỀU orders (1 order/Thai/Session)
→ Mỗi order có payment link riêng
```

---

## 8. SESSION LIFECYCLE

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  SCHEDULED  │ ──► │    OPEN     │ ──► │   CLOSED    │ ──► │  RESULTED   │
│             │     │             │     │             │     │             │
│ Chưa đến giờ│     │ Đang bán    │     │ Đóng tịch   │     │ Có kết quả  │
│  mở tịch    │     │ (User mua)  │     │ Chờ xổ      │     │ Win/Lose    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       ↑                                                           │
       │                    CRON / ADMIN                           │
       └───────────────────────────────────────────────────────────┘
                         Tạo session mới
```

**CRON job**:
- 00:01 hàng ngày: Tạo sessions cho ngày mới
- Mỗi 5 phút: Cleanup expired orders

**Admin override**:
- Tạo session manual (ngày nghỉ, ngày đặc biệt)
- Skip session (nghỉ xổ)

---

## 9. TESTING

### 9.1 Unit Tests
- Validation logic (phone, password, limits)
- Auth guards
- Business rules (hạn mức calculation)

### 9.2 Integration Tests (CRITICAL)
| Test | Mô tả |
|------|-------|
| Concurrency hạn mức | 10+ concurrent checkouts → no oversell |
| Webhook idempotent | Same webhook 3x → 1 status update |
| Order expiration | Quá 15 phút → expired + rollback hạn mức |

### 9.3 E2E Tests
- Full checkout flow (browser)
- Admin nhập kết quả

---

## 10. CI/CD & DEPLOYMENT

### 10.1 CI Pipeline (On PR)
```
1. Lint (ESLint/Prettier)
2. Type check (tsc --noEmit)
3. Unit tests
4. Integration tests (test DB)
5. Build
```

### 10.2 CD Pipeline (On merge)
```
1. Build Docker image
2. Push to registry
3. Deploy to VPS:
   - Pull new image
   - Run migrations
   - Rolling restart
   - Health check
   - Rollback if failed
4. Notify team
```

### 10.3 Production Checklist
- [ ] Database backups (daily)
- [ ] Log aggregation
- [ ] Health check endpoint `/api/health`
- [ ] Rate limiting
- [ ] PayOS webhook whitelisted
- [ ] SSL/TLS
- [ ] Environment variables secured
- [ ] Monitoring alerts (response > 1s)

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
| 37 | Ông Trời | - | Tứ thần linh |
| 38 | Ông Địa | - | Tứ thần linh |
| 39 | Thần Tài | - | Tứ thần linh |
| 40 | Ông Táo | - | Tứ thần linh |

> **Lưu ý**: Hoài Nhơn chỉ có 36 con (không có Tứ thần linh 37-40)

### B. Danh sách ngân hàng phổ biến

```typescript
export const BANKS = [
  { code: 'VCB', name: 'Vietcombank' },
  { code: 'TCB', name: 'Techcombank' },
  { code: 'MB', name: 'MB Bank' },
  { code: 'ACB', name: 'ACB' },
  { code: 'VPB', name: 'VPBank' },
  // ...
];
```

---

*Phiên bản 3.0 - Tab-centric Structure - 03/02/2026*
