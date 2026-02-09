---
description: Rule - Mọi bug/issue đều giả định là do agent gây ra
---

# Audit Rule

Bất kể vấn đề gì phát sinh, luôn giả định lỗi do agent (mình) gây ra. Phải:
1. Tự kiểm tra code, logic, API liên quan
2. Dùng lệnh check trên VPS (đọc logs, query DB) thay vì mở browser
3. Không đổ lỗi cho user hoặc môi trường trước khi audit xong
4. Fix trước, hỏi sau
