# 📋 ĐẶC TẢ KỸ THUẬT & TÍNH NĂNG CHI TIẾT
## Dự án: Cổ Nhơn Webapp (conhon-webapp)
### Phiên bản: 1.0.0 | Cập nhật: 29/01/2026

---

## 📊 THÔNG TIN TỔNG QUAN

| Thông số | Giá trị |
|----------|---------|
| **Tên dự án** | Cổ Nhơn Webapp |
| **Mục đích** | Nền tảng quản lý và hiển thị kết quả trò chơi truyền thống Cổ Nhơn/Thai Bình Định |
| **Quy mô người dùng** | 300 - 500 người/ngày (production) |
| **Số lượng trang** | 24 routes (5 Public + 11 User + 8 Admin) |
| **Số lượng entities** | 8 data models chính |
| **Loại ứng dụng** | Single Page Application (SPA) |

---

## 🛠️ TECH STACK CHI TIẾT

### Frontend (Client-side)

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **React** | 18.2.0 | UI Library chính |
| **Vite** | 5.0.8 | Build tool & Dev server |
| **TypeScript** | 5.2.2 | Type-safe JavaScript |
| **Tailwind CSS** | 3.3.6 | Utility-first CSS framework |
| **React Router DOM** | 6.20.0 | Client-side routing |
| **PostCSS** | 8.4.32 | CSS processing |
| **Autoprefixer** | 10.4.16 | Browser compatibility |

### Backend (Đề xuất cho Production)

| Công nghệ | Phiên bản đề xuất | Mục đích |
|-----------|-------------------|----------|
| **Node.js** | 20 LTS | Runtime environment |
| **Express.js / NestJS** | 4.x / 10.x | API Framework |
| **PostgreSQL** | 16.x | Primary Database |
| **Redis** | 7.x | Caching & Session store |
| **Socket.io** | 4.x | Real-time updates |

### Infrastructure (Production)

| Công nghệ | Mục đích |
|-----------|----------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Reverse proxy & Static serving |
| **Certbot / Let's Encrypt** | SSL/TLS certificates |
| **PM2** | Node.js process manager |
| **GitHub Actions** | CI/CD pipeline |

---

## 📑 KIẾN TRÚC HỆ THỐNG

### Sơ đồ kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                               │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐            │
│  │   Desktop     │  │    Mobile     │  │    Tablet     │            │
│  │   Browser     │  │    Browser    │  │   Browser     │            │
│  └───────────────┘  └───────────────┘  └───────────────┘            │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         NGINX REVERSE PROXY                          │
│                    (SSL Termination + Load Balancing)                │
│                         Port 80/443 → Internal                       │
└─────────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│    FRONTEND CONTAINER     │   │    BACKEND CONTAINER      │
│    (Nginx + React SPA)    │   │  (Node.js + Express/Nest) │
│        Port 3000          │   │        Port 4000          │
└───────────────────────────┘   └───────────────────────────┘
                                            │
                        ┌───────────────────┼───────────────────┐
                        ▼                   ▼                   ▼
            ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
            │    PostgreSQL     │ │      Redis        │ │     File Storage  │
            │    (Database)     │ │     (Cache)       │ │   (Static Assets) │
            │    Port 5432      │ │    Port 6379      │ │                   │
            └───────────────────┘ └───────────────────┘ └───────────────────┘
```

---

## 📄 CHI TIẾT CÁC TRANG (24 ROUTES)

### 🌐 Public Pages (5 trang) - Không cần đăng nhập

| # | Trang | Route | Mô tả chi tiết | Độ phức tạp |
|---|-------|-------|----------------|-------------|
| 1 | **HomePage** | `/` | Hero section với hiệu ứng mây, giới thiệu dịch vụ, preview kết quả mới nhất, countdown đến phiên tiếp theo | Cao |
| 2 | **LoginPage** | `/login` | Đăng nhập bằng SĐT, Demo session cho trải nghiệm, xác thực OTP | Trung bình |
| 3 | **HuongDanPage** | `/huong-dan` | Hướng dẫn chơi chi tiết, luật chơi 40 con vật, ý nghĩa Câu Thai | Thấp |
| 4 | **LienHePage** | `/lien-he` | Form liên hệ, thông tin Zalo, Facebook, bản đồ | Thấp |
| 5 | **GioiThieuPage** | `/gioi-thieu` | Lịch sử Cổ Nhơn, truyền thống Bình Định, ý nghĩa văn hóa | Thấp |

### 👤 User Pages (11 trang) - Yêu cầu đăng nhập

| # | Trang | Route | Mô tả chi tiết | Độ phức tạp |
|---|-------|-------|----------------|-------------|
| 1 | **ChonThaiPage** | `/chon-thai` | Lựa chọn 1 trong 3 khu vực: An Nhơn, Nhơn Phong, Hoài Nhơn | Trung bình |
| 2 | **ThaiDetailPage** | `/thai/:slug` | Giao diện chính: countdown timer, grid 40 con vật, cổng nhiệm vụ xã hội | Rất cao |
| 3 | **AnimalDetailPage** | `/thai/:slug/:animalId` | Chi tiết con vật: số thế thân, alias, giá, hạn mức còn lại | Trung bình |
| 4 | **CartPage** | `/gio-hang` | Quản lý giỏ "Tịch" (đặt cược), thêm/xóa/sửa số lượng | Trung bình |
| 5 | **CheckoutPage** | `/thanh-toan` | Thông tin thanh toán, QR banking, số tài khoản nhận tiền | Cao |
| 6 | **InvoicePage** | `/hoa-don/:orderId` | Hóa đơn điện tử với timestamp, mã đơn, tham chiếu Câu Thai | Trung bình |
| 7 | **KetQuaPage** | `/ket-qua` | Portal kết quả với tabs theo khu vực, filter theo ngày/tháng | Cao |
| 8 | **CauThaiPage** | `/cau-thai` | Ảnh Câu Thai hàng ngày, lưu trữ theo năm, carousel hiển thị | Trung bình |
| 9 | **CongDongPage** | `/cong-dong` | Feed bài viết, video YouTube embed, tương tác like/share | Cao |
| 10 | **PostDetailPage** | `/cong-dong/:postId` | Chi tiết bài viết, hệ thống comment đa cấp, ghim comment | Trung bình |
| 11 | **ProfilePage** | `/profile` | Quản lý tài khoản, cập nhật thông tin ngân hàng, lịch sử đơn | Trung bình |

### ⚙️ Admin Pages (8 trang) - Yêu cầu quyền admin

| # | Trang | Route | Mô tả chi tiết | Độ phức tạp |
|---|-------|-------|----------------|-------------|
| 1 | **AdminDashboard** | `/admin` | KPI tổng quan, doanh thu, thẻ tài chính, top con vật bán chạy | Rất cao |
| 2 | **AdminOrders** | `/admin/orders` | Quản lý đơn hàng, filter theo trạng thái (pending/paid/completed/cancelled) | Cao |
| 3 | **AdminAnimals** | `/admin/animals` | Cấu hình giá, hạn mức, trạng thái enabled/banned cho 40 con vật | Cao |
| 4 | **AdminCauThai** | `/admin/cau-thai` | Upload và quản lý ảnh Câu Thai, CRUD theo năm/khu vực | Trung bình |
| 5 | **AdminKetQua** | `/admin/ket-qua` | Nhập kết quả xổ, chọn con trúng, thống kê theo khu vực | Cao |
| 6 | **AdminContent** | `/admin/content` | Quản lý banner, thông báo, tin tức, nội dung động | Trung bình |
| 7 | **AdminTime** | `/admin/time` | Lập lịch khung giờ mở/đóng cược, cấu hình Tet Mode độc lập | Rất cao |
| 8 | **AdminSwitch** | `/admin/switch` | Kill-switch cho từng khu vực Thai, đóng/mở khẩn cấp | Thấp |

---

## 📊 DATA MODELS (8 ENTITIES)

### 1. User (Người dùng)
```typescript
interface User {
  id: string;
  phone: string;                    // Số điện thoại (unique)
  name: string;                     // Họ tên
  zaloName: string;                 // Tên Zalo
  role: 'user' | 'admin';           // Phân quyền
  bankAccount?: {
    accountNumber: string;          // Số tài khoản
    accountHolder: string;          // Chủ tài khoản
    bankName: string;               // Tên ngân hàng
  };
  completedTasks?: string[];        // Nhiệm vụ đã hoàn thành
  createdAt: Date;
  lastLoginAt: Date;
}
```
**Ước tính records**: 500 users/ngày × 30 ngày = **~15,000 records/tháng**

### 2. Thai (Khu vực)
```typescript
interface Thai {
  id: string;
  name: string;                     // VD: "Thai An Nhơn"
  slug: string;                     // VD: "an-nhon"
  times: string[];                  // Legacy: ["10:30", "16:30"]
  timeSlots: TimeSlot[];            // Khung giờ chi tiết
  tetTimeSlot?: TimeSlot;           // Khung giờ Tết (21:00)
  isTetMode: boolean;               // Toggle Tết riêng
  description: string;
  isOpen: boolean;                  // Kill-switch
}

interface TimeSlot {
  startTime: string;                // "07:00" - Mở cược
  endTime: string;                  // "10:30" - Đóng cược/xổ
}
```
**Records**: Cố định **3 khu vực** (An Nhơn, Nhơn Phong, Hoài Nhơn)

### 3. Animal (Con vật - 40 con)
```typescript
interface Animal {
  id: string;
  name: string;                     // VD: "Cá Trắng"
  order: number;                    // 1-40
  price: number;                    // Giá mỗi con
  limit: number;                    // Hạn mức tối đa
  remainingLimit: number;           // Hạn mức còn lại
  isEnabled: boolean;               // Cho phép mua
  isBanned: boolean;                // Cấm vĩnh viễn
  banReason?: string;
  thaiId: string;                   // Liên kết khu vực
  imagePlaceholder: string;         // Đường dẫn ảnh
}
```
**Records**: Cố định **40 con vật** × 3 Thai = **120 records**

### 4. Order (Đơn hàng)
```typescript
interface Order {
  id: string;
  userId: string;
  thaiId: string;
  items: CartItem[];                // Danh sách con vật đã mua
  total: number;                    // Tổng tiền
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  createdAt: Date;
  paidAt?: Date;
  completedAt?: Date;
  cauThai?: string;                 // Câu Thai tham chiếu
}

interface CartItem {
  animalId: string;
  quantity: number;
  price: number;
}
```
**Ước tính**: 500 users × 2 đơn/ngày = **~1,000 orders/ngày** = **~30,000 orders/tháng**

### 5. SocialTask (Nhiệm vụ xã hội)
```typescript
interface SocialTask {
  id: string;
  name: string;                     // "Theo dõi Facebook Cổ Nhơn"
  type: 'follow' | 'subscribe' | 'like' | 'share';
  url: string;
  isCompleted: boolean;
  required: boolean;
}
```
**Records**: Cố định **~10 nhiệm vụ**

### 6. Post (Bài viết cộng đồng)
```typescript
interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  videoUrl?: string;                // YouTube embed
  likes: number;
  isPinned: boolean;
  createdAt: Date;
  comments: Comment[];
}

interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  likes: number;
  isPinned: boolean;
  createdAt: Date;
}
```
**Ước tính**: 10 posts/ngày = **~300 posts/tháng**, mỗi post ~20 comments = **~6,000 comments/tháng**

### 7. CauThai (Câu Thai hàng ngày)
```typescript
interface CauThai {
  id: string;
  thaiId: string;
  content: string;                  // Nội dung câu thai
  imageUrl?: string;
  date: string;                     // YYYY-MM-DD
}
```
**Ước tính**: 3 thai × 365 ngày = **~1,095 records/năm**

### 8. KetQua (Kết quả xổ)
```typescript
interface KetQua {
  id: string;
  thaiId: string;
  winningAnimalIds: string[];       // Array 3 con trúng
  date: string;
  imageUrl?: string;
}
```
**Ước tính**: 3 thai × 2 phiên × 365 = **~2,190 records/năm**

---

## 🔥 TÍNH NĂNG CHI TIẾT

### 1. Hệ thống Countdown & Game Cycles
- **3 phiên/ngày** cho mỗi Thai (sáng, chiều, Tết)
- Countdown real-time với WebSocket
- Auto-refresh kết quả khi hết giờ
- Khung giờ cấu hình động qua Admin

### 2. Social Task Gate (Cổng nhiệm vụ)
- Bắt buộc hoàn thành nhiệm vụ để mua "Tịch"
- Tracking theo user session
- Hỗ trợ: Follow Facebook, Subscribe YouTube, Like, Share

### 3. "Tịch" Management (Quản lý cược)
- 40 con vật với alias và số thế thân
- Hạn mức động theo phiên
- Giỏ hàng với localStorage persistence
- Thanh toán Banking QR

### 4. Dynamic Year Generation
- Tự động chuyển năm Âm lịch
- Tên năm theo Con Giáp (VD: "Ất Tỵ 2025")
- Solar-year based utilities

### 5. Tet Mode (Chế độ Tết)
- Toggle độc lập cho từng Thai
- Khung giờ đặc biệt (21:00)
- Theme trang trí Tết

### 6. Mobile Responsiveness
- Breakpoints: 320px, 375px, 768px, 1024px, 1440px
- Touch-friendly interactions
- Horizontal scroll cho bảng admin lớn

### 7. 🔌 System Kill Switch (Tắt toàn bộ hệ thống)

> **Mục đích**: Cho phép Admin tắt toàn bộ hệ thống trong mùa off-season (~345 ngày/năm), chỉ cho phép Admin truy cập.

#### Trạng thái hệ thống

| Trạng thái | User thường | Admin | Mô tả |
|------------|-------------|-------|-------|
| **🟢 ACTIVE** | ✅ Login, Xem, Mua | ✅ Full access | Mùa Tết - hệ thống hoạt động bình thường |
| **🔴 MAINTENANCE** | ❌ Chỉ xem Landing | ✅ Full access | Off-season - chỉ Admin vào được |

#### Vị trí điều khiển: `/admin/switch`

```
┌─────────────────────────────────────────────────────────────────┐
│  🔌 CÔNG TẮC VẬN HÀNH                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  MASTER SWITCH                                    [🟢 ON]  │ │
│  │  Tắt/Mở toàn bộ hệ thống (tất cả Thai)                     │ │
│  │  ✓ Hệ thống đang hoạt động                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─────────────────────┐  ┌─────────────────────┐               │
│  │ Thai An Nhơn  [ON]  │  │ Thai Nhơn Phong [ON]│               │
│  │ ✓ Đang mở           │  │ ✓ Đang mở           │               │
│  └─────────────────────┘  └─────────────────────┘               │
│                                                                  │
│  ┌─────────────────────┐                                        │
│  │ Thai Hoài Nhơn [ON] │                                        │
│  │ ✓ Đang mở           │                                        │
│  └─────────────────────┘                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Flow khi Master Switch = OFF

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     KHI MASTER SWITCH = OFF                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User thường truy cập                    Admin truy cập                      │
│         │                                      │                             │
│         ▼                                      ▼                             │
│  ┌─────────────┐                        ┌─────────────┐                     │
│  │  Bất kỳ    │                        │   /login    │                     │
│  │   route    │                        │  (admin)    │                     │
│  └─────────────┘                        └─────────────┘                     │
│         │                                      │                             │
│         ▼                                      ▼                             │
│  ┌─────────────────────────┐           ┌─────────────────────────┐          │
│  │  🔒 MAINTENANCE PAGE    │           │  ✅ ADMIN DASHBOARD     │          │
│  │                         │           │                         │          │
│  │  "Hệ thống đang bảo trì │           │  Full access to:        │          │
│  │   Hẹn gặp lại Tết sau!" │           │  - /admin/*             │          │
│  │                         │           │  - Reports              │          │
│  │  [Liên hệ Admin]        │           │  - Settings             │          │
│  └─────────────────────────┘           └─────────────────────────┘          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Data Model cho System Config

```typescript
// Cần thêm vào mockData.ts hoặc database
interface SystemConfig {
  id: string;
  masterSwitch: boolean;        // Công tắc chính
  maintenanceMessage: string;   // "Hệ thống đang bảo trì..."
  maintenanceStartDate?: Date;  // Bắt đầu bảo trì
  maintenanceEndDate?: Date;    // Dự kiến mở lại
  allowedAdminIds: string[];    // Admin được phép truy cập
  lastUpdatedBy: string;        // Ai cập nhật cuối
  lastUpdatedAt: Date;
}

// Mặc định
export const systemConfig: SystemConfig = {
  id: 'system-config-1',
  masterSwitch: true,           // OFF khi off-season
  maintenanceMessage: 'Hệ thống Cổ Nhơn đang trong mùa nghỉ. Hẹn gặp lại vào Tết năm sau!',
  maintenanceStartDate: new Date('2026-02-15'),
  maintenanceEndDate: new Date('2027-01-20'),
  allowedAdminIds: ['admin-1'],
  lastUpdatedBy: 'admin-1',
  lastUpdatedAt: new Date()
};
```

#### Implementation Steps (Frontend - Phase 1)

**Bước 1**: Tạo `SystemConfigContext`
```typescript
// src/context/SystemConfigContext.tsx
interface SystemConfigContextType {
  isSystemActive: boolean;
  maintenanceMessage: string;
  toggleSystem: () => void;       // Admin only
}
```

**Bước 2**: Wrap App với Provider
```tsx
// src/App.tsx
<SystemConfigProvider>
  <AuthProvider>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </AuthProvider>
</SystemConfigProvider>
```

**Bước 3**: Tạo `MaintenancePage.tsx`
```tsx
// src/pages/MaintenancePage.tsx
const MaintenancePage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-orange-100">
    <div className="text-center p-8">
      <div className="text-6xl mb-4">🔧</div>
      <h1 className="text-2xl font-bold text-amber-800 mb-2">
        Hệ thống đang bảo trì
      </h1>
      <p className="text-amber-600 mb-4">
        Hẹn gặp lại vào Tết năm sau!
      </p>
      <a href="https://zalo.me/..." className="text-blue-600 underline">
        Liên hệ Admin
      </a>
    </div>
  </div>
);
```

**Bước 4**: Protected Route wrapper
```tsx
// src/components/SystemGuard.tsx
const SystemGuard = ({ children }) => {
  const { isSystemActive } = useSystemConfig();
  const { user } = useAuth();
  
  // Nếu hệ thống tắt VÀ không phải admin → redirect
  if (!isSystemActive && user?.role !== 'admin') {
    return <MaintenancePage />;
  }
  
  return children;
};
```

#### Hiện trạng code hiện tại

| File | Trạng thái | Ghi chú |
|------|-----------|---------|
| `AdminSwitch.tsx` | ✅ Có UI | Có `masterSwitch` nhưng chỉ là **local state** |
| `SystemConfigContext` | ❌ Chưa có | Cần tạo để share state toàn app |
| `MaintenancePage` | ❌ Chưa có | Cần tạo trang hiển thị khi tắt |
| `SystemGuard` | ❌ Chưa có | Cần tạo để chặn user khi tắt |
| Backend API | ❌ Chưa có | Cần để persist trạng thái |

#### Ưu tiên triển khai

1. **Phase 1 (Frontend only)**: Dùng `localStorage` để lưu trạng thái tạm
2. **Phase 2 (Full stack)**: Persist vào database, sync real-time

## � LỊCH HOẠT ĐỘNG HỆ THỐNG (SEASONAL OPERATION)

> ⚠️ **QUAN TRỌNG**: Cổ Nhơn là trò chơi truyền thống chỉ diễn ra vào dịp **Tết Nguyên Đán** (~10-15 ngày/năm). Đây là yếu tố quan trọng để tối ưu chi phí VPS.

### Lịch mùa chơi (Annual Schedule)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LỊCH HOẠT ĐỘNG CẢ NĂM                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ════════════════════════════════════════════════════════════════════════   │
│  │ T1 │ T2 │ T3 │ T4 │ T5 │ T6 │ T7 │ T8 │ T9 │ T10│ T11│ T12│             │
│  ════════════════════════════════════════════════════════════════════════   │
│  │    │████│    │    │    │    │    │    │    │    │    │    │             │
│  │    │TẾT │    │    │    │    │    │    │    │    │    │    │             │
│  ════════════════════════════════════════════════════════════════════════   │
│                                                                              │
│  ████ = Mùa hoạt động PEAK (10-15 ngày)                                     │
│  ░░░░ = Maintenance mode / Hibernation (350+ ngày)                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Chi tiết thời gian hoạt động

| Giai đoạn | Thời điểm | Số ngày | Trạng thái hệ thống |
|-----------|-----------|---------|---------------------|
| **Pre-Season** | 25 tháng Chạp → 29 tháng Chạp | 5 ngày | Warm-up, test hệ thống |
| **Peak Season** | Mùng 1 → Mùng 9/10 Tết | 10 ngày | **FULL OPERATION** |
| **Post-Season** | Mùng 10 → Rằm tháng Giêng | 5 ngày | Wind-down, báo cáo |
| **Off-Season** | Còn lại | ~345 ngày | **HIBERNATION** |

### Trạng thái hệ thống theo mùa

#### 🔴 PEAK SEASON (Mùa Tết - ~15-20 ngày)
```
┌─────────────────────────────────────────┐
│ FULL OPERATION MODE                     │
├─────────────────────────────────────────┤
│ ✅ VPS: 4 vCPU / 8 GB RAM              │
│ ✅ Database: PostgreSQL Active         │
│ ✅ Cache: Redis Active                 │
│ ✅ Real-time: WebSocket Active         │
│ ✅ 24/7 Monitoring                     │
│ ✅ Daily Backups                       │
│ ✅ SSL Active                          │
└─────────────────────────────────────────┘
```

#### 🟡 MAINTENANCE MODE (Trước/Sau Tết - ~10 ngày)
```
┌─────────────────────────────────────────┐
│ MAINTENANCE MODE                        │
├─────────────────────────────────────────┤
│ ✅ VPS: 2 vCPU / 4 GB RAM (Downgrade)  │
│ ✅ Database: Active (Setup/Cleanup)    │
│ ⚪ Cache: Minimal                       │
│ ⚪ WebSocket: Disabled                  │
│ ✅ Admin Access Only                   │
│ ✅ System Testing                      │
└─────────────────────────────────────────┘
```

#### 🟢 HIBERNATION MODE (Off-Season - ~335 ngày)
```
┌─────────────────────────────────────────┐
│ HIBERNATION MODE                        │
├─────────────────────────────────────────┤
│ 💤 VPS: POWERED OFF hoặc Minimal       │
│ 💤 Database: Backup Only (Cold Storage)│
│ ❌ Cache: Disabled                      │
│ ❌ WebSocket: Disabled                  │
│ ⚪ Static Landing Page Only            │
│ ✅ Monthly Health Check                │
└─────────────────────────────────────────┘
```

### Chiến lược Scale Up/Down

#### Timeline hàng năm

```
Timeline: ──────────────────────────────────────────────────────────────────►

           T12                T1                 T2                T3
    ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
    │              │   │   ████████   │   │ ████         │   │              │
    │  HIBERNATE   │→→→│   PEAK       │→→→│ WIND-DOWN    │→→→│  HIBERNATE   │
    │  (OFF)       │   │   (FULL)     │   │ (CLEANUP)    │   │  (OFF)       │
    └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
           ↓                  ↓                  ↓                  ↓
       No VPS Cost       $40-60/tháng      $20/tháng           No VPS Cost
                         (2-3 tuần)         (1-2 tuần)
```

#### Checklist Scale Up (Trước Tết 1 tuần)

- [ ] Tạo VPS mới với specs đề xuất (4 vCPU / 8 GB)
- [ ] Restore database backup từ cold storage
- [ ] Deploy containers (Frontend, Backend, DB, Redis)
- [ ] Configure SSL certificates
- [ ] Test toàn bộ flows
- [ ] Enable monitoring (UptimeRobot, Sentry)
- [ ] Notify users về thời gian mở cửa

#### Checklist Scale Down (Sau Tết 1 tuần)

- [ ] Export final reports và statistics
- [ ] Full database backup
- [ ] Upload backup lên cloud storage (Google Drive, S3)
- [ ] Snapshot VPS (nếu provider hỗ trợ)
- [ ] **DESTROY VPS** để không mất phí
- [ ] Deploy static "Hẹn gặp lại Tết sau" landing page (Cloudflare Pages - FREE)
- [ ] Cancel monitoring subscriptions (nếu có trả phí)

---

## �📈 ƯỚC TÍNH TẢI HỆ THỐNG

### Lưu lượng truy cập (300-500 users/ngày)

| Metric | Giá trị | Ghi chú |
|--------|---------|---------|
| **Daily Active Users** | 300 - 500 | Peak vào khung giờ xổ |
| **Page Views/User** | ~15 pages | Session trung bình |
| **Total Page Views/Day** | ~6,000 - 7,500 | |
| **Concurrent Users (Peak)** | 100 - 150 | 30% online cùng lúc |
| **API Requests/User** | ~50 requests | AJAX + REST |
| **Total API Requests/Day** | ~20,000 - 25,000 | |

### Database Load

| Metric | Giá trị/Ngày | Giá trị/Tháng |
|--------|--------------|---------------|
| **New Users** | 50 - 100 | 1,500 - 3,000 |
| **New Orders** | 800 - 1,200 | 24,000 - 36,000 |
| **Database Reads** | ~100,000 | ~3,000,000 |
| **Database Writes** | ~5,000 | ~150,000 |
| **Database Size Growth** | ~10 MB | ~300 MB |

### Bandwidth

| Loại | Giá trị |
|------|---------|
| **Static Assets (JS/CSS)** | ~2 MB/user (cached) |
| **Images** | ~5 MB/session |
| **API Responses** | ~500 KB/session |
| **Daily Bandwidth** | ~3 - 4 GB |
| **Monthly Bandwidth** | ~100 - 120 GB |

---

## 🖥️ YÊU CẦU VPS PRODUCTION

### Cấu hình đề xuất (300-500 users/ngày)

#### Option 1: Single VPS (Recommended cho khởi đầu)

| Thông số | Yêu cầu tối thiểu | Đề xuất |
|----------|-------------------|---------|
| **CPU** | 2 vCPU | 4 vCPU |
| **RAM** | 4 GB | 8 GB |
| **Storage** | 40 GB SSD | 80 GB NVMe SSD |
| **Bandwidth** | 2 TB/tháng | 4 TB/tháng |
| **OS** | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

**Giá ước tính**: **$20 - $40/tháng** (DigitalOcean, Linode, Vultr)

#### Option 2: Split Architecture (Scale-ready)

| Server | Specs | Chi phí |
|--------|-------|---------|
| **Web Server** | 2 vCPU / 4 GB RAM / 40 GB SSD | $20/tháng |
| **Database Server** | 2 vCPU / 4 GB RAM / 80 GB SSD | $24/tháng |
| **Redis Cache** | 1 vCPU / 2 GB RAM | $10/tháng |
| **Total** | | **~$54/tháng** |

### RAM Allocation cho Single VPS (8GB)

```
┌─────────────────────────────────────────┐
│ Total RAM: 8 GB                         │
├─────────────────────────────────────────┤
│ OS & System        │  1.0 GB            │
│ Nginx              │  0.5 GB            │
│ Node.js (Backend)  │  2.0 GB            │
│ PostgreSQL         │  2.0 GB            │
│ Redis              │  1.0 GB            │
│ Docker Overhead    │  0.5 GB            │
│ Free Buffer        │  1.0 GB            │
└─────────────────────────────────────────┘
```

### Storage Breakdown (80GB)

```
┌─────────────────────────────────────────┐
│ Total Storage: 80 GB NVMe SSD           │
├─────────────────────────────────────────┤
│ OS & System        │  10 GB             │
│ Docker Images      │  10 GB             │
│ PostgreSQL Data    │  20 GB             │
│ Static Assets      │  15 GB             │
│ User Uploads       │  10 GB             │
│ Logs & Backups     │  10 GB             │
│ Free Space         │   5 GB             │
└─────────────────────────────────────────┘
```

---

## 🐳 DOCKER DEPLOYMENT ARCHITECTURE

### docker-compose.yml Structure

```yaml
version: '3.8'

services:
  # Frontend (React SPA)
  frontend:
    build: ./frontend
    container_name: conhon-frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - conhon-network

  # Backend (Node.js API)
  backend:
    build: ./backend
    container_name: conhon-backend
    restart: unless-stopped
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@postgres:5432/conhon
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - conhon-network

  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: conhon-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_USER=conhon_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=conhon_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - conhon-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: conhon-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - conhon-network

volumes:
  postgres_data:
  redis_data:

networks:
  conhon-network:
    driver: bridge
```

---

## 🔒 BẢO MẬT & PERFORMANCE

### Security Checklist

- [ ] SSL/TLS với Let's Encrypt (auto-renew)
- [ ] CORS configuration
- [ ] Rate limiting (100 requests/phút/IP)
- [ ] SQL Injection prevention (parameterized queries)
- [ ] XSS protection (Content Security Policy)
- [ ] CSRF tokens cho forms
- [ ] JWT với expiration (15 phút access, 7 ngày refresh)
- [ ] Input validation (Zod/Yup)
- [ ] Database backup tự động (daily)

### Performance Optimization

- [ ] Nginx Gzip compression
- [ ] Static asset caching (1 năm)
- [ ] Database connection pooling
- [ ] Redis caching cho hot data
- [ ] CDN cho static assets (optional)
- [ ] Lazy loading images
- [ ] Code splitting (Vite automatic)
- [ ] Database indexes cho queries phổ biến

---

## 📊 MONITORING & LOGGING

### Công cụ đề xuất

| Công cụ | Mục đích | Chi phí |
|---------|----------|---------|
| **PM2** | Process management, metrics | Free |
| **Nginx Logs** | Access & Error logs | Free |
| **UptimeRobot** | Uptime monitoring | Free (50 monitors) |
| **Sentry** | Error tracking | Free (5K errors/month) |
| **Grafana + Prometheus** | Metrics dashboard | Free (self-hosted) |

---

## 🚀 DEPLOYMENT WORKFLOW

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CI/CD PIPELINE                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Developer Push    GitHub Actions      Docker Build      VPS Deploy │
│       │                 │                   │                │      │
│       ▼                 ▼                   ▼                ▼      │
│  ┌────────┐      ┌────────────┐      ┌────────────┐    ┌─────────┐ │
│  │  Push  │ ──▶  │  Lint &    │ ──▶  │   Build    │──▶ │  Pull   │ │
│  │  Code  │      │   Test     │      │   Image    │    │ & Run   │ │
│  └────────┘      └────────────┘      └────────────┘    └─────────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 💰 TỔNG CHI PHÍ ƯỚC TÍNH

### ⚡ Chiến lược tối ưu: SEASONAL VPS (Chỉ chạy khi cần)

> 💡 **Key Insight**: Vì Cổ Nhơn chỉ chơi ~10-15 ngày/năm, VPS chỉ cần hoạt động ~1 tháng (bao gồm setup + peak + cleanup). Phần còn lại sử dụng FREE hosting cho landing page.

### Chi phí HÀNG NĂM (Seasonal Strategy)

| Hạng mục | Thời gian | Chi phí (USD) | Chi phí (VNĐ) |
|----------|-----------|---------------|---------------|
| **VPS Peak Season** | 3-4 tuần (4 vCPU/8GB) | $40-60 | ~1,000,000 - 1,500,000 |
| **Domain (.com)** | 1 năm | $12 | ~300,000 |
| **Cloud Backup Storage** | 1 năm (10GB) | $0 (Google Drive) | Free |
| **Landing Page** | 11 tháng | $0 (Cloudflare Pages) | Free |
| **SSL** | Auto-renew | Free | Free |
| **Monitoring** | Free tier | Free | Free |
| **Total HÀNG NĂM** | | **~$55-75/năm** | **~1,400,000 - 1,900,000 VND/năm** |

### So sánh chi phí

| Chiến lược | Chi phí/năm | Tiết kiệm |
|------------|-------------|-----------|
| ❌ VPS chạy 24/7 cả năm | $480-600 | 0% |
| ✅ **Seasonal VPS** | **$55-75** | **~90%** |

### Chi tiết phân bổ theo thời gian

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CHI PHÍ THEO THỜI GIAN (1 NĂM)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  [████] = VPS Active ($40-60)                                               │
│  [░░░░] = Free Hosting (Cloudflare Pages - $0)                              │
│                                                                              │
│  T1   T2   T3   T4   T5   T6   T7   T8   T9   T10  T11  T12                 │
│  ████ ██                                                                     │
│  $60  $0   $0   $0   $0   $0   $0   $0   $0   $0   $0   $0                  │
│                                                                              │
│  + Domain: $12/năm (chia đều ~$1/tháng)                                     │
│                                                                              │
│  TỔNG: ~$72/năm ≈ 1,800,000 VND/năm ≈ 150,000 VND/tháng (trung bình)        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Chi phí thay thế (Nếu chạy 24/7)

| Hạng mục | Chi phí/tháng | Chi phí/năm |
|----------|---------------|-------------|
| **VPS (8GB RAM)** | $40 | $480 |
| **Domain (.com)** | $1 | $12 |
| **Backup Storage** | $5 | $60 |
| **Total** | **$46/tháng** | **$552/năm** |

> ⚠️ **KHÔNG KHUYẾN NGHỊ**: Chạy VPS 24/7 là lãng phí khi hệ thống chỉ active 15 ngày/năm!

---

## 📋 CHECKLIST TRIỂN KHAI

### Phase 1: Chuẩn bị (1-2 ngày)
- [ ] Mua VPS với specs đề xuất
- [ ] Cấu hình SSH key authentication
- [ ] Setup firewall (UFW)
- [ ] Cài đặt Docker & Docker Compose

### Phase 2: Backend Development (2-3 tuần)
- [ ] Setup project NestJS/Express
- [ ] Implement authentication (JWT)
- [ ] CRUD APIs cho 8 entities
- [ ] WebSocket cho real-time updates
- [ ] Unit tests

### Phase 3: Database (1 tuần)
- [ ] Design schema PostgreSQL
- [ ] Setup migrations
- [ ] Seed data
- [ ] Setup Redis caching

### Phase 4: Integration (1 tuần)  
- [ ] Connect Frontend với Backend APIs
- [ ] Thay thế mock data
- [ ] Test integration

### Phase 5: Deployment (2-3 ngày)
- [ ] Docker build images
- [ ] Setup docker-compose
- [ ] Configure Nginx
- [ ] SSL với Certbot
- [ ] Setup monitoring

### Phase 6: Go-live (1 ngày)
- [ ] Final testing
- [ ] DNS configuration
- [ ] Backup strategy
- [ ] Launch 🚀

---

## 📞 LIÊN HỆ & HỖ TRỢ

**Tài liệu này được tạo tự động bởi Antigravity AI**

*Cập nhật lần cuối: 29/01/2026*
