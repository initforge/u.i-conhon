// Mock data: Users
export interface User {
  id: string;
  phone: string;
  name: string;
  zaloName: string;
  role: 'user' | 'admin';
  bankAccount?: {
    accountNumber: string;
    accountHolder: string;
    bankName: string;
  };
  completedTasks?: string[];
}

export const mockUsers: User[] = [
  {
    id: 'user-1',
    phone: '0901234567',
    name: 'Nguyễn Văn A',
    zaloName: 'Anh Văn',
    role: 'user',
    bankAccount: {
      accountNumber: '1234567890',
      accountHolder: 'NGUYEN VAN A',
      bankName: 'Vietcombank',
    },
  },
  {
    id: 'admin-1',
    phone: '0332697909',
    name: 'Admin',
    zaloName: 'Cổ Nhơn An Nhơn',
    role: 'admin',
    bankAccount: {
      accountNumber: '9876543210',
      accountHolder: 'CO NHON AN NHON',
      bankName: 'Techcombank',
    },
  },
];

// Mock data: Thais
export interface Thai {
  id: string;
  name: string;
  slug: string;
  times: string[];
  tetTimes?: string[];
  description: string;
  isOpen: boolean;
}

export const mockThais: Thai[] = [
  {
    id: 'thai-an-nhon',
    name: 'Thai An Nhơn',
    slug: 'an-nhon',
    times: ['11:00', '17:00'],
    tetTimes: ['11:00', '17:00', '21:00'],
    description: 'Khu vực An Nhơn - Bình Định',
    isOpen: true,
  },
  {
    id: 'thai-nhon-phong',
    name: 'Thai Nhơn Phong',
    slug: 'nhon-phong',
    times: ['11:00', '17:00'],
    tetTimes: ['11:00', '17:00', '21:00'],
    description: 'Khu vực Nhơn Phong',
    isOpen: true,
  },
  {
    id: 'thai-hoai-nhon',
    name: 'Thai Hoài Nhơn',
    slug: 'hoai-nhon',
    times: ['13:00', '19:00'],
    description: 'Khu vực Hoài Nhơn',
    isOpen: true,
  },
];

// Mock data: Animals (40 con vật)
export interface Animal {
  id: string;
  name: string;
  order: number;
  price: number;
  limit: number;
  remainingLimit: number;
  isEnabled: boolean;
  isBanned: boolean;
  banReason?: string;
  thaiId: string;
  imagePlaceholder: string;
}

const animalNames = [
  'Cá Trắng', 'Ốc', 'Ngỗng', 'Công', 'Trùn', 'Cọp', 'Heo', 'Thỏ', 'Trâu', 'Rồng Bay',
  'Chó', 'Ngựa', 'Voi', 'Mèo', 'Chuột', 'Ong', 'Hạc', 'Kỳ Lân', 'Bướm', 'Hòn Núi',
  'Én', 'Bồ Câu', 'Khỉ', 'Ếch', 'Quạ', 'Rồng Nằm', 'Rùa', 'Gà', 'Lươn', 'Cá Đỏ',
  'Tôm', 'Rắn', 'Nhện', 'Nai', 'Dê', 'Bà Vãi', 'Ông Trời', 'Ông Địa', 'Thần Tài', 'Ông Táo'
];

export const mockAnimals: Animal[] = animalNames.map((name, index) => ({
  id: `animal-${index + 1}`,
  name,
  order: index + 1,
  price: Math.floor(Math.random() * 50000) + 10000, // 10k-60k
  limit: Math.floor(Math.random() * 5000000) + 1000000, // 1M-6M
  remainingLimit: Math.floor(Math.random() * 4000000) + 500000, // 500k-4.5M
  isEnabled: index < 38, // 2 con bị disabled
  isBanned: index === 38 || index === 39, // 2 con cuối bị cấm
  banReason: index === 38 || index === 39 ? 'Đã hết hạn mức' : undefined,
  thaiId: ['thai-an-nhon', 'thai-nhon-phong', 'thai-hoai-nhon'][index % 3],
  imagePlaceholder: `/assets/conhon/${index + 1}-placeholder.png`,
}));

// Mock data: Social Tasks
export interface SocialTask {
  id: string;
  name: string;
  type: 'follow' | 'subscribe' | 'like' | 'share';
  url: string;
  isCompleted: boolean;
  required: boolean;
}

export const mockSocialTasks: SocialTask[] = [
  {
    id: 'task-1',
    name: 'Theo dõi Cổ Nhơn An Nhơn',
    type: 'follow',
    url: 'https://facebook.com/conhon',
    isCompleted: false,
    required: true,
  },
  {
    id: 'task-2',
    name: 'Đăng ký YouTube Cậu Ba Họ Nguyễn',
    type: 'subscribe',
    url: 'https://youtube.com/@caubahonguyen',
    isCompleted: false,
    required: true,
  },
  {
    id: 'task-3',
    name: 'Like bài viết gần nhất',
    type: 'like',
    url: 'https://facebook.com/conhon/posts/latest',
    isCompleted: false,
    required: true,
  },
  {
    id: 'task-4',
    name: 'Share bài viết gần nhất',
    type: 'share',
    url: 'https://facebook.com/conhon/posts/latest',
    isCompleted: false,
    required: true,
  },
];

// Mock data: Cart
export interface CartItem {
  animalId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Mock data: Orders
export interface Order {
  id: string;
  userId: string;
  thaiId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  createdAt: string;
  paidAt?: string;
  completedAt?: string;
  cauThai?: string;
}

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    userId: 'user-1',
    thaiId: 'thai-an-nhon',
    items: [
      { animalId: 'animal-1', quantity: 1, price: 50000 },
      { animalId: 'animal-5', quantity: 2, price: 30000 },
    ],
    total: 110000,
    status: 'completed',
    createdAt: '2026-01-01T10:25:30',
    paidAt: '2026-01-01T11:00:00',
    completedAt: '2026-01-01T16:35:00',
    cauThai: 'Con cá trắng bơi trong ao, chờ ngày gặp được quý nhân giúp đỡ',
  },
];

// Mock data: Posts (Community)
export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  videoUrl?: string;
  likes: number;
  isPinned: boolean;
  createdAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  likes: number;
  isPinned: boolean;
  createdAt: string;
}

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    userId: 'admin-1',
    title: 'Kết quả Thai An Nhơn ngày 01/01/2026',
    content: 'Chúc mừng các bạn đã trúng thưởng!',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    likes: 125,
    isPinned: true,
    createdAt: '2026-01-01T17:00:00',
    comments: [
      {
        id: 'comment-1',
        postId: 'post-1',
        userId: 'user-1',
        content: 'Cảm ơn admin!',
        likes: 5,
        isPinned: false,
        createdAt: '2026-01-01T17:05:00',
      },
    ],
  },
];

// Mock data: Cau Thai (daily)
export interface CauThai {
  id: string;
  thaiId: string;
  content: string;
  imageUrl?: string;
  date: string;
}

export const mockCauThais: CauThai[] = [
  {
    id: 'cau-thai-1',
    thaiId: 'thai-an-nhon',
    content: 'Con trâu cày ruộng công lao to, gặp được quý nhân giúp đỡ nhiều',
    date: '2026-01-02',
  },
  {
    id: 'cau-thai-2',
    thaiId: 'thai-nhon-phong',
    content: 'Con rồng bay lên trời cao, vận may đến như mây về',
    date: '2026-01-02',
  },
  {
    id: 'cau-thai-3',
    thaiId: 'thai-hoai-nhon',
    content: 'Con gà gáy sáng báo hiệu ngày mới, tài lộc tràn đầy',
    date: '2026-01-02',
  },
];

// Mock data: Ket qua (results)
export interface KetQua {
  id: string;
  thaiId: string;
  winningAnimalIds: string[];
  date: string;
  imageUrl?: string;
}

export const mockKetQuas: KetQua[] = [
  {
    id: 'kq-1',
    thaiId: 'thai-an-nhon',
    winningAnimalIds: ['animal-1', 'animal-15', 'animal-28'],
    date: '2026-01-01',
  },
  {
    id: 'kq-2',
    thaiId: 'thai-nhon-phong',
    winningAnimalIds: ['animal-5', 'animal-12', 'animal-30'],
    date: '2026-01-01',
  },
  {
    id: 'kq-3',
    thaiId: 'thai-hoai-nhon',
    winningAnimalIds: ['animal-8', 'animal-20', 'animal-35'],
    date: '2026-01-01',
  },
];

// Mock data: Cau Thai Images (Ảnh câu thai)
export interface CauThaiImage {
  id: string;
  thaiId: string;
  year: number;
  name: string;
  imageUrl: string;
  isActive: boolean; // Hiển thị trên trang chủ
  uploadedAt: string;
}

export const mockCauThaiImages: CauThaiImage[] = [
  {
    id: 'cti-1',
    thaiId: 'thai-an-nhon',
    year: 2025,
    name: 'Câu Thai Mùng 9 - An Nhơn',
    imageUrl: '/assets/cauthai/an-nhon-mung9.png',
    isActive: true,
    uploadedAt: '2025-02-06T08:00:00',
  },
  {
    id: 'cti-2',
    thaiId: 'thai-nhon-phong',
    year: 2025,
    name: 'Câu Thai Mùng 9 - Nhơn Phong',
    imageUrl: '/assets/cauthai/nhon-phong-mung9.png',
    isActive: true,
    uploadedAt: '2025-02-06T08:00:00',
  },
  {
    id: 'cti-3',
    thaiId: 'thai-hoai-nhon',
    year: 2025,
    name: 'Câu Thai Mùng 9 - Hoài Nhơn',
    imageUrl: '/assets/cauthai/hoai-nhon-mung9.png',
    isActive: false,
    uploadedAt: '2025-02-06T08:00:00',
  },
  {
    id: 'cti-4',
    thaiId: 'thai-an-nhon',
    year: 2024,
    name: 'Câu Thai Tết 2024 - An Nhơn',
    imageUrl: '/assets/cauthai/an-nhon-2024.png',
    isActive: false,
    uploadedAt: '2024-02-10T08:00:00',
  },
];
