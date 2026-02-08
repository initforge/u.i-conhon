# Cổ Nhơn Project Rules

## Agent Behavior Rules

### Giao tiếp
- **Luôn phản hồi bằng tiếng Việt** - Ngoại trừ các từ chuyên ngành (technical terms) thì cần chú thích
- **Nếu có thắc mắc gì chưa rõ ràng → HỎI** - Không được hời hợt pass hết, phải hỏi cho rõ

### Làm việc
- **Tự sắp xếp thứ tự các task** - Không cần hỏi ý kiến về thứ tự, miễn hoàn thành tốt là được
- **Liên tục đối chiếu với SPECS.md** - Báo cáo nếu có gì sai lệch hoặc chưa rõ ràng trong specs
- **LÀM PHẢI DỨT ĐIỂM** - Mỗi task phải hoàn thành đầy đủ từ A-Z:
  - Database changes (nếu cần)
  - Backend API (endpoints, logic)
  - Frontend (UI, state, integration)
  - Testing (verify hoạt động)
- **KHÔNG được làm rời rạc** - Không làm mỗi frontend, hay mỗi backend, hay mỗi database riêng lẻ
- **Nếu user yêu cầu chỉ 1 layer** (chỉ frontend, chỉ backend, hoặc chỉ DB):
  - Đánh giá xem feature đó có cần các layer khác không
  - Nếu CẦN → HỎI: "Feature này cần thêm [DB/Backend/Frontend], bạn muốn tôi làm luôn không?"
  - Nếu KHÔNG CẦN (ví dụ: thay đổi UI thuần túy, fix bug nhỏ) → Làm luôn

### Testing
- **KHÔNG cần agent tự chạy test browser** - User sẽ tự test và báo kết quả
- Sau khi code xong, chờ user confirm "oke" hoặc báo lỗi cụ thể
- Chỉ test khi user yêu cầu rõ ràng

### Database
- **Sẵn sàng rebuild database** nếu thực sự cần thiết để hệ thống chạy ngon hơn
- **Đưa ra các phương án rõ ràng** khi cần thay đổi DB (thêm cột, bảng, trigger, index...)
- **Nói rõ phương án nào tối ưu hơn** và giải thích chi tiết
- **Khi thêm cột mới**:
  - Xem xét các cột cũ có còn cần dùng không
  - Nếu không cần → Refactor schema, xóa cột thừa
  - Sync lại với database đang chạy (local hoặc production)
  - Document lại thay đổi trong migration hoặc schema.sql

### ⚠️ QUAN TRỌNG: Không Tự Ý Thêm Features
- **KHÔNG được tự ý thêm routes, pages, hoặc features mới** mà chưa được user đồng ý
- **Khi phát hiện code tồn tại nhưng chưa route/integrate**:
  - BÁO CÁO cho user: "Tìm thấy [file/component] tồn tại nhưng chưa được route"
  - HỎI: "Bạn có muốn tôi thêm vào không?"
  - CHỜ user confirm trước khi làm
- **Khi test và phát hiện pages "missing":**
  - CHỈ báo cáo là missing/không accessible
  - KHÔNG tự ý thêm routes/sidebar links
  - Đây có thể là pages đang development, chưa ready cho production
- **Scope của task "check/test các tabs"** = test các tabs HIỆN CÓ trên UI, KHÔNG phải thêm tabs mới
- **Nếu không chắc chắn** → LUÔN HỎI user trước

---

## Development Environment
- **Chạy bằng Docker** (không dùng npm run dev trực tiếp)
- `docker-compose up --build` để chạy toàn bộ stack

## Ports
- **Frontend**: `80` (Nginx production)
- **Backend**: `8000`
- **PostgreSQL**: `5432`
- **Redis**: `6379`

## .env Configuration
Không cần set PORT cho frontend vì Nginx serve trên port 80 (default HTTP).

```
FRONTEND_URL=http://localhost  # Không cần :80
VITE_API_URL=http://localhost:8000/api
```

## Testing
- Mở browser tại `http://localhost` (không phải :3000)
- Admin: `http://localhost/admin/dang-nhap`
- API Health: `http://localhost:8000/health`

## CORS
Backend đã config CORS cho `http://localhost`. Nếu test dev riêng frontend thì cần:
1. Tắt CORS trên Chrome: `chrome.exe --disable-web-security --user-data-dir="C:\chrome-dev"`
2. Hoặc chạy full Docker stack

---



## Admin Credentials (Dev)
**⚠️ QUAN TRỌNG: Mỗi lần cần login admin, PHẢI dùng thông tin này!**

- **URL đăng nhập Admin**: `http://localhost:3000/admin/dang-nhap` (hoặc `/dang-nhap` nếu đang chạy dev)
- **Phone**: `0932433459`
- **Password**: `admin123`

> **Note cho Agent**: Khi cần vào Admin panel để test/verify:
> 1. Mở URL: `/admin/dang-nhap` (KHÔNG phải `/dang-nhap` của user)
> 2. Nhập Phone: `0932433459`
> 3. Nhập Password: `admin123`
> 4. Sau đó truy cập các trang admin như `/admin/settings`, `/admin/animals`, etc.
