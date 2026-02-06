# Database Exports

Thư mục này chứa các bản export từ database production.

## Cấu trúc

```
exports/
├── schema.sql              ← Cấu trúc tables (CREATE TABLE, INDEX...)
└── data_YYYY-MM-DD.sql     ← Data thực tế theo ngày
```

## Restore trên máy mới

### Cách 1: Dùng schema từ migrations (khuyến nghị)
```bash
# Chạy docker containers
docker-compose up -d

# Chờ database sẵn sàng, rồi import data
docker exec -i conhon-db psql -U conhon conhon < database/exports/data_2026-02-06.sql
```

### Cách 2: Dùng schema từ export
```bash
# Import schema trước
docker exec -i conhon-db psql -U conhon conhon < database/exports/schema.sql

# Import data
docker exec -i conhon-db psql -U conhon conhon < database/exports/data_2026-02-06.sql
```

## Tạo backup mới

```bash
# Export schema only
docker exec conhon-db pg_dump -U conhon --schema-only conhon > database/exports/schema.sql

# Export data only (với ngày hiện tại)
docker exec conhon-db pg_dump -U conhon --data-only --inserts conhon > database/exports/data_$(date +%Y-%m-%d).sql
```

## Lưu ý
- Schema thường không đổi, chỉ cần update khi thêm bảng/cột mới
- Data nên export định kỳ trước khi push lên production
- File data có thể chứa thông tin nhạy cảm (passwords hashed, user info), cân nhắc khi public repo
