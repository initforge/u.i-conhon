# Conhon Webapp - Phase 1 UI Demo

Giao diện đầy đủ cho website Cổ Nhơn với mock data, sẵn sàng deploy lên Vercel.

## 🚀 Setup

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Copy Assets

**QUAN TRỌNG**: Bạn cần copy tất cả assets từ 3 thư mục nguồn vào `public/assets/`.

#### Cách 1: Dùng script tự động (Khuyến nghị)

Từ thư mục workspace root, chạy:

```powershell
.\conhon-webapp\copy-assets.ps1
```

Script sẽ tự động copy tất cả assets vào đúng vị trí.

#### Cách 2: Copy thủ công

Copy theo cấu trúc sau:

#### Cấu trúc thư mục cần tạo:

```
conhon-webapp/
├── public/
│   ├── assets/
│   │   ├── decorations/
│   │   │   ├── bg-cau-thai-co-nhon.png (từ Cổ Nhơn_files/)
│   │   │   ├── cau-thai.png (từ Cổ Nhơn_files/)
│   │   │   ├── cloud.png (từ Cổ Nhơn_files/)
│   │   │   ├── cloud-3.png (từ Cổ Nhơn_files/)
│   │   │   ├── cloud-4.png (từ Cổ Nhơn_files/)
│   │   │   ├── cloud-5.png (từ Cổ Nhơn_files/)
│   │   │   ├── huong-dan-icon.png (từ Cổ Nhơn_files/)
│   │   │   ├── ho-tro.png (từ Cổ Nhơn_files/)
│   │   │   ├── ket-qua.png (từ Cổ Nhơn_files/)
│   │   │   ├── form_img.png (từ Mona Tết_files/)
│   │   │   ├── img-before-head.png (từ Tết Việt_files/)
│   │   │   ├── img-after-head.png (từ Tết Việt_files/)
│   │   │   └── img-after-footer.png (từ Tết Việt_files/)
│   │   ├── icons/
│   │   │   ├── service1.svg (từ Mona Tết_files/)
│   │   │   ├── service2n.svg (từ Mona Tết_files/)
│   │   │   ├── service3.svg (từ Mona Tết_files/)
│   │   │   ├── service4.svg (từ Mona Tết_files/)
│   │   │   ├── ico_address.svg (từ Mona Tết_files/)
│   │   │   ├── ico_arrow_active.svg (từ Mona Tết_files/)
│   │   │   ├── ico_arrow_black.svg (từ Mona Tết_files/)
│   │   │   ├── ico_arrow_down.svg (từ Mona Tết_files/)
│   │   │   ├── ico_arrow_right.svg (từ Mona Tết_files/)
│   │   │   ├── ico_cart.svg (từ Mona Tết_files/)
│   │   │   ├── ico_dot.svg (từ Mona Tết_files/)
│   │   │   ├── ico_email_footer.svg (từ Mona Tết_files/)
│   │   │   ├── ico_facebook.svg (từ Mona Tết_files/)
│   │   │   ├── ico_instagram.svg (từ Mona Tết_files/)
│   │   │   ├── ico_linkedIn.svg (từ Mona Tết_files/)
│   │   │   ├── ico_menu_1.svg (từ Mona Tết_files/)
│   │   │   ├── ico_menu_2.svg (từ Mona Tết_files/)
│   │   │   ├── ico_menu_3.svg (từ Mona Tết_files/)
│   │   │   ├── ico_menu_4.svg (từ Mona Tết_files/)
│   │   │   ├── ico_menu.svg (từ Mona Tết_files/)
│   │   │   ├── ico_phone_footer.svg (từ Mona Tết_files/)
│   │   │   ├── ico_quality.svg (từ Mona Tết_files/)
│   │   │   ├── ico_search.svg (từ Mona Tết_files/)
│   │   │   ├── ico_service.svg (từ Mona Tết_files/)
│   │   │   ├── ico_shipping.svg (từ Mona Tết_files/)
│   │   │   ├── ico_star.svg (từ Mona Tết_files/)
│   │   │   ├── ico_twitter.svg (từ Mona Tết_files/)
│   │   │   ├── ico_user.svg (từ Mona Tết_files/)
│   │   │   ├── heart.svg (từ Mona Tết_files/)
│   │   │   ├── arrow-detail.svg (từ Mona Tết_files/)
│   │   │   └── bag.svg (từ Mona Tết_files/)
│   │   └── logo-co-nhon.svg (từ Cổ Nhơn_files/)
│   └── vite.svg
```

#### Hướng dẫn copy:

1. Tạo thư mục `public/assets/decorations/` và `public/assets/icons/`
2. Copy các file từ:
   - `Cổ Nhơn - Trò chơi dân gian Hoài Nhơn_files/` → `public/assets/decorations/` và `public/assets/`
   - `Mona - Tết_files/` → `public/assets/decorations/` và `public/assets/icons/`
   - `Giao diện website Tết Việt dành cho website trong dịp Tết nguyên đán_files/` → `public/assets/decorations/`

### 3. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem.

### 4. Build cho production

```bash
npm run build
```

Output sẽ ở thư mục `dist/`.

### 5. Preview production build

```bash
npm run preview
```

## 📦 Deploy lên Vercel

1. Push code lên GitHub/GitLab
2. Import project vào Vercel
3. Vercel sẽ tự động detect Vite và config:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy!

## 🎯 Demo Login

- **Demo User**: Click "Đăng nhập demo User" trên trang login
- **Demo Admin**: Click "Đăng nhập demo Admin" trên trang login

## 📝 Ghi chú

- **40 con vật**: Hiện tại dùng placeholder (số thứ tự), chưa có ảnh thật
- **Mock data**: Tất cả data đều là mock, chưa có backend
- **Phase 2**: Sẽ build backend + database
- **Phase 3**: Sẽ deploy lên VPS DigitalOcean

## 🗂️ Cấu trúc dự án

```
conhon-webapp/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable components
│   ├── contexts/    # React contexts (Auth, Cart, SocialTasks)
│   ├── layouts/     # Layout components
│   ├── pages/       # Page components
│   │   ├── admin/   # Admin pages
│   │   └── ...      # User & Public pages
│   ├── mock-data/   # Mock data
│   ├── App.tsx      # Main app component
│   ├── main.tsx     # Entry point
│   └── index.css    # Global styles
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎨 Design System

- **Colors**: Xanh Tết (tet-green-*) từ Tailwind config
- **Typography**: Font serif cho headings, sans-serif cho body
- **Components**: Cards, buttons, forms với styling nhất quán

## ✅ Checklist trước khi deploy

- [ ] Đã copy tất cả assets vào `public/assets/`
- [ ] Tất cả routes hoạt động
- [ ] Mock data đầy đủ
- [ ] Tất cả buttons có hành vi (không dead-end)
- [ ] Responsive mobile/desktop
- [ ] Demo login User/Admin hoạt động

