# Quick Start Guide

## Bước 1: Copy Assets

Chạy script PowerShell để copy assets tự động:

```powershell
cd "C:\Users\Lenovo\Downloads\Cổ Nhơn văn hoá dân gian"
.\conhon-webapp\copy-assets.ps1
```

Hoặc copy thủ công theo hướng dẫn trong `README.md`.

## Bước 2: Install Dependencies

```bash
cd conhon-webapp
npm install
```

## Bước 3: Chạy Development Server

```bash
npm run dev
```

Mở browser tại: http://localhost:3000

## Bước 4: Test Demo Login

1. Vào trang `/dang-nhap`
2. Click "Đăng nhập demo User" hoặc "Đăng nhập demo Admin"
3. Test các tính năng

## Bước 5: Build & Deploy

```bash
npm run build
```

Sau đó deploy lên Vercel (xem README.md).

## Lưu ý

- Nếu thiếu assets, một số hình ảnh sẽ không hiển thị nhưng app vẫn chạy được
- 40 con vật hiện dùng placeholder (số thứ tự)
- Tất cả data là mock, chưa có backend

