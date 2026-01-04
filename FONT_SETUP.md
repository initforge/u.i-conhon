# Hướng dẫn cài đặt Font Gunplay

## Font hiện tại
Hiện tại web đang sử dụng **Bungee** và **Black Ops One** từ Google Fonts làm font stencil tương tự Gunplay.

## Để sử dụng font Gunplay thật (nếu có file font)

1. **Tải font Gunplay** (file .otf hoặc .ttf)

2. **Convert sang WOFF2** (khuyên dùng):
   - Sử dụng công cụ: https://cloudconvert.com/otf-to-woff2
   - Hoặc: https://everythingfonts.com/otf-to-woff2

3. **Đặt file vào thư mục**:
   ```
   conhon-webapp/public/fonts/gunplay.woff2
   ```

4. **Uncomment trong `src/index.css`**:
   ```css
   @font-face {
     font-family: 'Gunplay';
     src: url('/fonts/gunplay.woff2') format('woff2');
     font-weight: 400;
     font-style: normal;
     font-display: swap;
   }
   ```

5. **Cập nhật font-family trong CSS**:
   Thay đổi từ:
   ```css
   font-family: 'Bungee', 'Black Ops One', ...
   ```
   Thành:
   ```css
   font-family: 'Gunplay', 'Bungee', 'Black Ops One', ...
   ```

## Font đang được áp dụng cho:
- `.section-title` - Tất cả các tiêu đề section
- `.footer-title` - Tiêu đề trong footer
- Tab buttons - Các tab "Tất cả", "Tứ trạng nguyên", etc.

## Các thuộc tính đã được điều chỉnh:
- `letter-spacing: 1px` - Khoảng cách chữ
- `text-transform: uppercase` - Chữ hoa
- `line-height: 0.9` - Chiều cao dòng
- `font-weight: 400` - Độ đậm

