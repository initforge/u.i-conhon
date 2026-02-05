---
description: Comprehensive frontend testing - like a real user
---
# Comprehensive Frontend Testing Workflow

## Core Principle
**Test như người dùng thực sự** - không chỉ verify API hoạt động, mà phải tương tác với UI và theo dõi toàn bộ luồng.

## Testing Checklist

### 1. User Flow Testing
Với mỗi feature, phải test đầy đủ:
- [ ] Click các nút và xem có phản hồi UI không
- [ ] Check state changes (loading, success, error)
- [ ] Verify data persist vào database sau action
- [ ] Check console logs cho errors
- [ ] Verify backend logs nhận request đúng

### 2. Admin Panel Testing
- [ ] **Dashboard**: Stats hiển thị đúng từ DB
- [ ] **Đơn hàng**: Click vào đơn → xem detail → actions work
- [ ] **Con vật**: 
  - Hiển thị session/khung hiện tại
  - Các nút toggle, cấm, áp dụng hạn mức hoạt động
  - Data persist vào DB
- [ ] **Kết quả xổ**: Chọn session → set winning animal → verify persist
- [ ] **Câu Thai**: Upload/delete images hoạt động
- [ ] **CMS**: CRUD posts hoạt động

### 3. User Features Testing
- [ ] **Nhiệm vụ MXH**: 
  - Click "Thực hiện" → countdown 10s
  - State đổi thành completed
  - Không thể click lại sau khi hoàn thành
- [ ] **Mua con vật**: Full purchase flow
- [ ] **Xem kết quả**: Data hiển thị đúng từ DB

### 4. Database Verification
Sau mỗi action trên UI:
```bash
docker exec conhon-db psql -U conhon -d conhon -c "SELECT * FROM [table] ORDER BY created_at DESC LIMIT 5;"
```

### 5. Error Handling
- [ ] Test với invalid inputs
- [ ] Check error messages hiển thị đúng
- [ ] Verify graceful degradation

## Anti-patterns to Avoid
❌ Chỉ check API endpoints work mà không click UI
❌ Xem page load được là pass
❌ Không verify data persist vào database
❌ Không test edge cases và error states
