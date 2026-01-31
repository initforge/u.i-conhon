# CỔ NHƠN - ĐẶC TẢ HỆ THỐNG

> **Phiên bản**: 2.0 | **Cập nhật**: 31/01/2026  
> **Mục đích**: Đặc tả chi tiết toàn bộ hệ thống cho việc triển khai backend-database

---

## MỤC LỤC

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Quy mô và hiệu năng](#2-quy-mô-và-hiệu-năng)
3. [Phân quyền người dùng](#3-phân-quyền-người-dùng)
4. [Đặc tả màn hình NGƯỜI CHƠI](#4-đặc-tả-màn-hình-người-chơi)
5. [Đặc tả màn hình ADMIN](#5-đặc-tả-màn-hình-admin)
6. [Quy tắc nghiệp vụ](#6-quy-tắc-nghiệp-vụ)
7. [Database Schema](#7-database-schema)
8. [API Endpoints](#8-api-endpoints)

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1 Mô tả
Cổ Nhơn là trò chơi dân gian truyền thống của Bình Định, diễn ra từ **25 tháng Chạp đến mùng 9 tháng Giêng** hàng năm (~15 ngày).

### 1.2 Ba Thai (Khu vực)

| Thai | Số con vật | Phiên xổ | Giờ đóng tịch | Giờ xổ |
|------|-----------|----------|---------------|--------|
| **An Nhơn** | 40 | Sáng, Chiều, Tối (Tết) | 10:30, 16:30, 20:30 | 11:00, 17:00, 21:00 |
| **Nhơn Phong** | 40 | Sáng, Chiều, Tối (Tết) | 10:30, 16:30, 20:30 | 11:00, 17:00, 21:00 |
| **Hoài Nhơn** | 36 | Trưa, Chiều | 12:30, 18:30 | 13:00, 19:00 |

> **Lưu ý**: Phiên Tối (21h) chỉ có trong dịp Tết (~mùng 1 đến mùng 5).

### 1.3 Tỷ lệ thưởng
- **Mặc định**: 1 chung 30 (đặt 10.000đ → trúng 300.000đ)
- **Riêng Hoài Nhơn**: Con Trùn (số 5) chung 70

---

## 2. QUY MÔ VÀ HIỆU NĂNG

### 2.1 Ước tính người dùng

| Thời điểm | Số người đồng thời | Ghi chú |
|-----------|-------------------|---------|
| Bình thường | 50-100 | Ngoài giờ cao điểm |
| Giờ cao điểm | 300-500 | 30 phút trước đóng tịch |
| Đỉnh điểm | 500-800 | Ngày Tết, 5 phút trước đóng |

### 2.2 Giờ cao điểm (QUAN TRỌNG)

```
SÁNG:   10:00 - 10:30 (An Nhơn, Nhơn Phong)
TRƯA:   12:00 - 12:30 (Hoài Nhơn)
CHIỀU:  16:00 - 16:30 (An Nhơn, Nhơn Phong)
        18:00 - 18:30 (Hoài Nhơn)
TỐI:    20:00 - 20:30 (An Nhơn, Nhơn Phong - chỉ Tết)
```

### 2.3 Yêu cầu hiệu năng
- **Response time**: < 500ms cho API chính
- **Database queries**: < 100ms
- **Concurrent orders**: 100-200/phiên
- **Uptime**: 99.9% trong 15 ngày mùa vụ

---

## 3. PHÂN QUYỀN NGƯỜI DÙNG

### 3.1 Khách (Chưa đăng nhập)
- Xem trang chủ, hướng dẫn, kết quả xổ
- Xem danh sách con vật
- KHÔNG thể đặt tịch

### 3.2 Người chơi (Đã đăng nhập)
- Tất cả quyền của Khách
- Đặt tịch (mua con vật)
- Xem lịch sử đơn hàng
- Quản lý thông tin cá nhân

### 3.3 Admin
- Quản lý Thai: bật/tắt, cấu hình giờ, mode Tết
- Quản lý con vật: hạn mức, cấm con
- Nhập kết quả xổ, câu thai
- Quản lý đơn hàng, người dùng
- Xem báo cáo doanh thu

---

## 4. ĐẶC TẢ MÀN HÌNH NGƯỜI CHƠI

### 4.1 Trang chủ (`/`)

#### Phần Hero (Banner)
- Logo, slogan
- Nút "CHƠI NGAY" → scroll đến phần chọn Thai

#### Phần Giới thiệu
- Mô tả ngắn về trò chơi
- Tỷ lệ thưởng: "Mua 1 trúng 30"

#### Phần Câu Thai + Countdown
| Cột trái | Cột phải |
|----------|----------|
| Carousel câu thai (có nút prev/next) | Đồng hồ đếm ngược đến đóng tịch |
| Session hiện tại (Sáng/Chiều/Tối) | Nút "Đặt tịch" |
| Nếu câu thai cũ → hiện kết quả | Tỷ lệ thưởng |

#### Phần 40 Con Vật
- Tab filter theo nhóm: Tứ trạng nguyên, Ngũ hổ tướng, ...
- Grid 4 cột (mobile) / 5 cột (desktop)
- Mỗi card: STT, tên, alias, hình ảnh

#### Phần Ý Nghĩa Danh Vật
- Grid 40 cards ý nghĩa (hiện TRƯỚC)
- Bảng Thế Thân của 40 danh vật
- Sơ đồ Hình Nhơn

---

### 4.2 Trang Hướng dẫn (`/huong-dan`)

#### Giao diện ban đầu
- Tiêu đề "Hướng dẫn"
- Nút "Xem chi tiết"

#### Sau khi bấm "Xem chi tiết"
**Tab 1: Giới thiệu & Hương dẫn**
| Bước | Nội dung |
|------|----------|
| 1 | Đăng nhập bằng SĐT + mật khẩu |
| 2 | Hoàn thành nhiệm vụ MXH (follow Fanpage, join Group, add Zalo, sub YouTube) |
| 3 | Chọn Thai: An Nhơn / Nhơn Phong / Hoài Nhơn |
| 4 | Chọn con vật, thêm vào giỏ, thanh toán |
| 5 | Gửi ảnh chuyển khoản + hóa đơn qua Zalo |

**Tab 2: Luật chơi**
- **Câu thai**: 2 hoặc 4 câu thơ lục bát
- **Quy trình**: Ra đề → Suy luận → Đặt cược → Công bố kết quả
- **Số con vật**: An Nhơn/Nhơn Phong 40 con, Hoài Nhơn 36 con

---

### 4.3 Trang Đăng nhập (`/dang-nhap`)

#### Form đăng nhập
| Field | Validation |
|-------|------------|
| Số điện thoại | Required, format 10 số |
| Mật khẩu | Required, min 6 ký tự |

#### Các nút
- Đăng nhập
- Đăng ký tài khoản mới
- Demo User (dev only)
- Demo Admin (dev only)

---

### 4.4 Trang Chọn Thai (`/chon-thai`)

**Yêu cầu**: Đã đăng nhập

#### Danh sách 3 Thai
Mỗi card Thai hiển thị:
- Tên Thai + icon
- Trạng thái: Đang mở / Đã đóng / Ngày nghỉ
- Số con vật: 40 hoặc 36
- Giờ xổ tiếp theo
- Countdown đến đóng tịch (nếu đang mở)

#### Hành vi
- Click vào Thai đang mở → chuyển đến `/mua-con-vat?thai=<thai-id>`
- Click vào Thai đã đóng → hiện thông báo "Đã hết giờ đặt tịch"

---

### 4.5 Trang Mua Con Vật (`/mua-con-vat?thai=<id>`)

**Yêu cầu**: Đã đăng nhập, Thai đang mở

#### Header
- Tên Thai
- Countdown đến đóng tịch
- Session hiện tại (Sáng/Chiều/Tối)

#### Bộ lọc
- Filter theo nhóm con vật
- Tìm kiếm theo tên/alias

#### Grid con vật
| Thông tin | Chi tiết |
|-----------|----------|
| STT + Tên + Alias | Ví dụ: "1. Cá Trắng - Chiếm Khôi" |
| Hình ảnh | 01.jpg - 40.jpg |
| Giá | 10.000đ/con (mặc định) |
| Trạng thái | Còn hàng / Hết hạn mức / Đã cấm |
| Hành động | Nút "+1", "-1", input số lượng |

#### Giỏ hàng (Footer cố định)
- Số lượng con đã chọn
- Tổng tiền
- Nút "Thanh toán"

---

### 4.6 Trang Thanh toán (`/thanh-toan`)

#### Thông tin đơn hàng
- Danh sách con vật đã chọn (STT, tên, số lượng, thành tiền)
- Tổng tiền

#### Thông tin chuyển khoản
- Ngân hàng: Vietcombank
- STK: 1234567890
- Chủ TK: NGUYEN VAN A
- Nội dung CK: `<SĐT> <Thai> <Session>`
- QR Code chuyển khoản

#### Xác nhận
- Nút "Xác nhận đã chuyển khoản"
- → Tạo đơn hàng status=pending
- → Chuyển đến trang Hóa đơn

---

### 4.7 Trang Hóa đơn (`/hoa-don/<order-id>`)

#### Thông tin hóa đơn
- Mã đơn hàng
- Thời gian đặt
- Thai + Session
- Danh sách con vật
- Tổng tiền
- Trạng thái: Chờ xác nhận / Đã xác nhận / Đã hủy

#### Hướng dẫn
- Gửi ảnh CK + hóa đơn qua Zalo: 0332697909

---

### 4.8 Trang Kết quả (`/ket-qua`)

#### Bộ lọc
- Chọn Thai (tabs)
- Chọn năm (dropdown)

#### Danh sách kết quả
| Cột | Nội dung |
|-----|----------|
| Ngày | 30/01/2026 |
| Session | Sáng / Chiều / Tối |
| Con trúng | "5. Trùn - Chí Cao" |
| Câu thai | 4 câu thơ lục bát |
| Hình ảnh | Ảnh kết quả (nếu có) |

---

### 4.9 Trang Đơn hàng của tôi (`/don-hang`)

**Yêu cầu**: Đã đăng nhập

#### Bộ lọc
- Theo Thai
- Theo trạng thái (Tất cả / Chờ xác nhận / Đã xác nhận)
- Theo ngày

#### Danh sách đơn hàng
- Mã đơn
- Ngày đặt
- Thai + Session
- Tổng tiền
- Trạng thái
- Nút "Xem chi tiết"

---

## 5. ĐẶC TẢ MÀN HÌNH ADMIN

### 5.1 Dashboard (`/admin`)

#### Thống kê tổng quan
| Metric | Mô tả |
|--------|-------|
| Đơn hàng hôm nay | Số đơn + tổng tiền |
| Đơn chờ xác nhận | Số đơn pending |
| Người dùng | Tổng số + mới hôm nay |
| Thai đang mở | 0/3, 1/3, 2/3, 3/3 |

#### Đơn hàng gần đây
- 5 đơn hàng mới nhất
- Link "Xem tất cả"

---

### 5.2 Quản lý Thai (`/admin/cai-dat`)

#### Danh sách 3 Thai
Mỗi Thai có:

| Thuộc tính | Hành động |
|------------|-----------|
| Trạng thái | Toggle Bật/Tắt |
| Mode Tết | Toggle (hiện phiên 21h) |
| Giờ đóng tịch | Chỉnh sửa từng session |
| Giờ xổ | Chỉnh sửa từng session |

#### Nút hành động
- Lưu thay đổi
- Reset về mặc định

---

### 5.3 Quản lý Con Vật (`/admin/con-vat`)

#### Tabs Thai
- An Nhơn (40 con) | Nhơn Phong (40 con) | Hoài Nhơn (36 con)

#### Thống kê nhanh
- Số con đang cấm
- Tổng số con
- Số con còn hoạt động

#### Hạn mức Thai tổng
- Input số tiền hạn mức
- Nút "Áp dụng tất cả"
- Quick buttons: 100k, 200k, 300k, 500k

#### Grid con vật
Mỗi card hiển thị:

| Field | Mô tả |
|-------|-------|
| STT + Tên | 1. Cá Trắng |
| Hạn mức | Input số tiền (step 10.000) |
| Đã mua | X lượt • Y đ |
| Còn lại | Z đ hoặc "HẾT HẠN MỨC!" |
| Progress bar | % đã mua |
| Nút +50k, +100k | Tăng nhanh hạn mức |
| Nút Cấm | Cấm con này (cần nhập lý do) / Bỏ cấm |

#### Banner cấm (nếu đang cấm)
- Hiển thị nổi bật "CON NÀY ĐANG BỊ CẤM"
- Lý do cấm

---

### 5.4 Quản lý Câu Thai (`/admin/cau-thai`)

#### Tabs Thai + Session
- An Nhơn > Sáng | Chiều | Tối
- Nhơn Phong > Sáng | Chiều | Tối
- Hoài Nhơn > Trưa | Chiều

#### Form nhập câu thai
| Field | Mô tả |
|-------|-------|
| Ngày | Date picker |
| Câu thai | Textarea (2 hoặc 4 câu thơ) |
| Hình ảnh | Upload file |

#### Lịch sử
- Danh sách câu thai đã nhập
- Nút sửa/xóa

---

### 5.5 Quản lý Kết Quả (`/admin/ket-qua`)

#### Tabs Thai + Session
(Giống như Câu Thai)

#### Form nhập kết quả
| Field | Mô tả |
|-------|-------|
| Ngày | Date picker |
| Con trúng | Dropdown chọn 1 con (1-40 hoặc 1-36) |
| Hình ảnh | Upload file |
| Ngày nghỉ | Checkbox (nếu tick → không cần chọn con) |

#### Validation
- Chỉ được nhập kết quả SAU giờ xổ
- Không được sửa sau 24h

---

### 5.6 Quản lý Đơn hàng (`/admin/don-hang`)

#### Bộ lọc
- Thai (All / An Nhơn / Nhơn Phong / Hoài Nhơn)
- Session (All / Sáng / Chiều / Tối)
- Ngày (Date picker)
- Trạng thái (All / Pending / Paid / Done / Cancel)

#### Bảng đơn hàng
| Cột | Mô tả |
|-----|-------|
| Mã đơn | UUID rút gọn |
| Khách hàng | Tên + SĐT |
| Thai | An Nhơn |
| Session | Sáng |
| Chi tiết | Số con + tổng tiền |
| Trạng thái | Badge màu |
| Hành động | Xác nhận / Hủy / Chi tiết |

#### Modal chi tiết đơn
- Thông tin khách hàng
- Danh sách con vật (STT, tên, số lượng, đơn giá, thành tiền)
- Tổng tiền
- Ảnh chuyển khoản (nếu có)
- Lịch sử trạng thái

---

### 5.7 Quản lý Người dùng (`/admin/nguoi-dung`)

#### Bảng người dùng
| Cột | Mô tả |
|-----|-------|
| SĐT | Số điện thoại |
| Tên | Họ tên |
| Ngày tạo | Timestamp |
| Số đơn | Tổng số đơn hàng |
| Tổng chi | Tổng tiền đã đặt |
| Hành động | Xem chi tiết / Khóa |

#### Tìm kiếm
- Theo SĐT
- Theo tên

---

### 5.8 Báo cáo (`/admin/bao-cao`)

#### Bộ lọc
- Thai (All hoặc từng Thai)
- Khoảng thời gian (Hôm nay / 7 ngày / 30 ngày / Custom)

#### Thống kê
| Metric | Mô tả |
|--------|-------|
| Tổng doanh thu | Σ tổng tiền đơn hàng (status=paid hoặc done) |
| Số đơn hàng | Tổng số đơn |
| Số người chơi | Unique users |
| TB/đơn | Doanh thu / Số đơn |

#### Biểu đồ
- Doanh thu theo ngày (Line chart)
- Phân bố theo Thai (Pie chart)
- Top 10 con vật được mua nhiều nhất (Bar chart)

---

## 6. QUY TẮC NGHIỆP VỤ

### 6.1 Đặt tịch (Order)

```
1. User chọn Thai đang MỞ
2. User chọn con vật + số lượng
3. Kiểm tra:
   - Thai còn mở? (chưa qua giờ đóng tịch)
   - Con vật không bị cấm?
   - Hạn mức con vật còn đủ?
   - User đã hoàn thành nhiệm vụ MXH?
4. Tạo đơn hàng status=pending
5. User chuyển khoản
6. Admin xác nhận → status=paid
7. Sau khi xổ:
   - Nếu trúng → Admin liên hệ trả thưởng → status=done
   - Nếu không trúng → status=done
```

### 6.2 Logic đóng tịch

```
Giờ hiện tại < Giờ đóng tịch → Thai MỞ (cho phép đặt)
Giờ hiện tại ≥ Giờ đóng tịch → Thai ĐÓNG (không cho đặt)
Giờ hiện tại ≥ Giờ xổ → Chuyển sang session tiếp theo
```

### 6.3 Logic ngày nghỉ

```
Nếu daily_records.is_off = true:
  - Không hiển thị form đặt tịch cho ngày đó
  - Hiển thị thông báo "Hôm nay nghỉ xổ"
  - winner_order = NULL
```

### 6.4 Logic hạn mức

```
Khi user đặt X đồng cho con A:
  1. Lấy purchased hiện tại của con A
  2. Lấy purchaseLimit của con A
  3. Nếu purchased + X > purchaseLimit → Từ chối
  4. Nếu OK → Tạo đơn, cập nhật purchased += X
```

### 6.5 Logic giỏ hàng đa Thai

```
- User có thể chọn con từ NHIỀU Thai trong 1 giỏ hàng
- Khi checkout → Tách thành NHIỀU đơn hàng (1 đơn/Thai/Session)
- Mỗi đơn có order_id riêng
```

---

## 7. DATABASE SCHEMA

### 7.1 ERD

```
THAIS (3 records cố định)
  ├── ORDERS (nhiều đơn hàng)
  └── DAILY_RECORDS (kết quả + câu thai)

USERS
  └── ORDERS (nhiều đơn hàng)
```

### 7.2 Bảng `thais`

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(20) PK | 'an-nhon', 'nhon-phong', 'hoai-nhon' |
| name | VARCHAR(50) | Tên hiển thị |
| animal_count | SMALLINT | 40 hoặc 36 |
| schedule | JSONB | Khung giờ các phiên |
| prices | JSONB | Override giá từng con |
| limits | JSONB | Override hạn mức từng con |
| is_tet | BOOLEAN | Mode Tết (hiện phiên 21h) |
| is_open | BOOLEAN | Bật/tắt Thai |

### 7.3 Bảng `users`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | Auto-generated |
| phone | VARCHAR(15) UK | Số điện thoại (unique) |
| name | VARCHAR(50) | Họ tên |
| bank | JSONB | {code, acc, holder} |
| created_at | TIMESTAMP | Ngày tạo |

### 7.4 Bảng `orders`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | Auto-generated |
| user_id | UUID FK | → users.id |
| thai_id | VARCHAR(20) FK | → thais.id |
| session | VARCHAR(10) | 'sang', 'chieu', 'toi', 'trua' |
| order_date | DATE | Ngày đặt |
| items | JSONB | [{o:1, q:2, p:10000}] (order, quantity, price) |
| total | INTEGER | Tổng tiền |
| status | VARCHAR(10) | pending / paid / done / cancel |
| created_at | TIMESTAMP | |

### 7.5 Bảng `daily_records`

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(50) PK | 'an-nhon_sang_2026-01-30' |
| thai_id | VARCHAR(20) FK | → thais.id |
| session | VARCHAR(10) | 'sang', 'chieu', 'toi', 'trua' |
| record_date | DATE | Ngày xổ |
| is_off | BOOLEAN | Ngày nghỉ không xổ |
| winner_order | SMALLINT | 1-40 (con trúng). NULL nếu is_off |
| cau_thai | TEXT | 2 hoặc 4 câu thơ lục bát |
| img | VARCHAR(255) | URL hình ảnh |
| created_at | TIMESTAMP | |

---

## 8. API ENDPOINTS

### 8.1 Public APIs (Không cần auth)

```
GET  /api/thais                    # Danh sách Thai + trạng thái
GET  /api/thais/:id                # Chi tiết 1 Thai
GET  /api/thais/:id/animals        # Danh sách con vật của Thai
GET  /api/results                  # Kết quả xổ (có filter)
GET  /api/results/:id              # Chi tiết 1 kết quả
```

### 8.2 User APIs (Cần auth)

```
POST /api/auth/login               # Đăng nhập
POST /api/auth/register            # Đăng ký
GET  /api/auth/me                  # Thông tin user hiện tại

POST /api/orders                   # Tạo đơn hàng
GET  /api/orders                   # Danh sách đơn hàng của user
GET  /api/orders/:id               # Chi tiết 1 đơn
```

### 8.3 Admin APIs (Cần auth + role=admin)

```
# Thai
PATCH /api/admin/thais/:id         # Cập nhật Thai (is_open, is_tet, schedule)

# Animals
PATCH /api/admin/animals/:thaiId/:order  # Cập nhật hạn mức, cấm/bỏ cấm

# Results
POST  /api/admin/results           # Nhập kết quả xổ
PATCH /api/admin/results/:id       # Sửa kết quả

# Orders
GET   /api/admin/orders            # Tất cả đơn hàng (có filter)
PATCH /api/admin/orders/:id        # Cập nhật trạng thái

# Users
GET   /api/admin/users             # Tất cả người dùng
PATCH /api/admin/users/:id         # Khóa/mở khóa

# Reports
GET   /api/admin/reports/revenue   # Báo cáo doanh thu
GET   /api/admin/reports/orders    # Báo cáo đơn hàng
```

---

## PHỤ LỤC A: CONSTANTS CODE

```typescript
// src/constants/ANIMAL_DATA.ts

export type ThaiId = 'an-nhon' | 'nhon-phong' | 'hoai-nhon';

export interface AnimalDefinition {
  order: number;        // 1-40
  name: string;         // Cá Trắng
  alias: string;        // Chiếm Khôi
  theThan: number;      // 5
  group: string;        // tu-trang-nguyen
  meaning: string;      // Tượng trưng cho...
}

export const BASE_40_ANIMALS: AnimalDefinition[] = [
  { order: 1, name: 'Cá Trắng', alias: 'Chiếm Khôi', theThan: 5, group: 'tu-trang-nguyen', meaning: '...' },
  // ... 40 con
];

export function getAnimalsForThai(thaiId: ThaiId): AnimalDefinition[] {
  if (thaiId === 'hoai-nhon') return BASE_40_ANIMALS.slice(0, 36);
  return BASE_40_ANIMALS;
}
```

---

*Tài liệu này được tạo để đảm bảo tính nhất quán khi triển khai backend-database.*
