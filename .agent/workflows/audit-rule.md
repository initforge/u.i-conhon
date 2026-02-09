---
description: Rule - Mọi bug/issue đều giả định là do agent gây ra
---

# Audit Rule

Bất kể vấn đề gì phát sinh, luôn giả định lỗi do agent (mình) gây ra. Phải:
1. Tự kiểm tra code, logic, API liên quan
2. Dùng lệnh check trên VPS (đọc logs, query DB) thay vì mở browser
3. Không đổ lỗi cho user hoặc môi trường trước khi audit xong
4. Fix trước, hỏi sau

# VPS vs Local Rule

**VPS và Local là 2 môi trường HOÀN TOÀN KHÁC NHAU:**
1. **KHÔNG BAO GIỜ** chạy lệnh VPS từ terminal local — agent không có quyền truy cập VPS
2. Khi cần chạy lệnh trên VPS → **ĐƯA LỆNH TEXT** cho user copy-paste vào SSH terminal của họ
3. Khi cần đọc output VPS → dùng `read_terminal` đọc SSH terminal của user
4. DB user trên VPS là `conhon`, DB name là `conhon` (KHÔNG phải `postgres`)
5. Container DB: `conhon-db`, Backend: `conhon-backend`, Frontend: `conhon-frontend`
