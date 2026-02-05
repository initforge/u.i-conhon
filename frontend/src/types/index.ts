/**
 * Type definitions for Cổ Nhơn
 * Shared interfaces used across the application
 */

export interface User {
    id: string;
    phone: string;
    name: string | null;
    zalo?: string;
    role: 'user' | 'admin';
    bank_code?: string;
    bank_account?: string;
    bank_holder?: string;
    completed_tasks?: string[];
    // Legacy compatibility
    zaloName?: string;
    bankAccount?: {
        accountNumber?: string;
        accountHolder?: string;
        bankName?: string;
    };
}

export interface Thai {
    id: string;
    name: string;
    slug: string;
    times: string[];
    timeSlots: TimeSlot[];
    tetTimeSlot?: TimeSlot;
    isTetMode: boolean;
    description: string;
    isOpen: boolean;
}

export interface TimeSlot {
    startTime: string;
    endTime: string;
}

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

export interface CartItem {
    animalId: string;
    quantity: number;
    price: number;
}

export interface Cart {
    items: CartItem[];
    total: number;
}

export interface Order {
    id: string;
    userId: string;
    thaiId: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'paid' | 'completed' | 'cancelled' | 'won' | 'lost' | 'expired';
    createdAt: string;
    paidAt?: string;
    completedAt?: string;
    cauThai?: string;
}

export interface Post {
    id: string;
    userId?: string;
    thai_id?: string;
    title: string;
    content: string;
    videoUrl?: string;
    youtube_id?: string;
    likes: number;
    like_count?: number;
    isPinned: boolean;
    is_pinned?: boolean;
    createdAt: string;
    created_at?: string;
    comments: Comment[];
}

export interface Comment {
    id: string;
    postId?: string;
    userId?: string;
    user_name?: string;
    content: string;
    likes?: number;
    isPinned?: boolean;
    createdAt?: string;
    created_at?: string;
}

export interface CauThai {
    id: string;
    thaiId: string;
    content: string;
    imageUrl?: string;
    date: string;
}

export interface CauThaiImage {
    id: string;
    thaiId: string;
    thai_id?: string;
    khungId?: string;
    khung_id?: string;
    year: number;
    name: string; // Ghi chú cho admin
    playerNote?: string; // Ghi chú cho người chơi (hiển thị trên trang chủ)
    player_note?: string;
    imageUrl: string;
    image_url?: string;
    isActive: boolean;
    is_active?: boolean;
    uploadedAt?: string;
}

export interface KetQua {
    id: string;
    thaiId: string;
    winningAnimalIds: string[];
    date: string;
    imageUrl?: string;
    isOff?: boolean;
}

export interface SocialTask {
    id: string;
    name: string;
    type: 'follow' | 'subscribe' | 'like' | 'share';
    url: string;
    isCompleted: boolean;
    required: boolean;
}

// Static data - 40 con vật (đã hardcode theo SPECS)
export const animalNames40 = [
    'Cá Trắng', 'Ốc', 'Ngỗng', 'Công', 'Trùn', 'Cọp', 'Heo', 'Thỏ', 'Trâu', 'Rồng Bay',
    'Chó', 'Ngựa', 'Voi', 'Mèo', 'Chuột', 'Ong', 'Hạc', 'Kỳ Lân', 'Bướm', 'Hòn Núi',
    'Én', 'Bồ Câu', 'Khỉ', 'Ếch', 'Quạ', 'Rồng Nằm', 'Rùa', 'Gà', 'Lươn', 'Cá Đỏ',
    'Tôm', 'Rắn', 'Nhện', 'Nai', 'Dê', 'Bà Vãi', 'Ông Trời', 'Ông Địa', 'Thần Tài', 'Ông Táo'
];

// Hoài Nhơn: 36 con (không có Tứ thần linh 37-40)
export const animalNames36 = animalNames40.slice(0, 36);

// Helper: Lấy tên con vật theo order (1-indexed)
export function getAnimalName(order: number): string {
    return animalNames40[order - 1] || `Con vật ${order}`;
}

// Helper: Tạo danh sách con vật cho Thai
export function createAnimalsForThai(thaiId: string, count: 40 | 36 = 40): Animal[] {
    const names = count === 40 ? animalNames40 : animalNames36;
    return names.map((name, index) => ({
        id: `${thaiId}-animal-${index + 1}`,
        name,
        order: index + 1,
        price: 0,
        limit: 5000000,
        remainingLimit: 5000000,
        isEnabled: true,
        isBanned: false,
        thaiId,
        imagePlaceholder: `/assets/conhon/${index + 1}.png`,
    }));
}

// Static Thai data - reference configuration
export const THAIS: Thai[] = [
    {
        id: 'thai-an-nhon',
        name: 'Thai An Nhơn',
        slug: 'an-nhon',
        times: ['11:00', '17:00'],
        timeSlots: [
            { startTime: '07:00', endTime: '10:30' },
            { startTime: '12:00', endTime: '16:30' },
        ],
        tetTimeSlot: { startTime: '18:00', endTime: '20:30' },
        isTetMode: false,
        description: 'Khu vực An Nhơn - Bình Định',
        isOpen: true,
    },
    {
        id: 'thai-nhon-phong',
        name: 'Thai Nhơn Phong',
        slug: 'nhon-phong',
        times: ['11:00', '17:00'],
        timeSlots: [
            { startTime: '07:00', endTime: '10:30' },
            { startTime: '12:00', endTime: '16:30' },
        ],
        tetTimeSlot: { startTime: '18:00', endTime: '20:30' },
        isTetMode: false,
        description: 'Khu vực Nhơn Phong',
        isOpen: true,
    },
    {
        id: 'thai-hoai-nhon',
        name: 'Thai Hoài Nhơn',
        slug: 'hoai-nhon',
        times: ['13:00', '19:00'],
        timeSlots: [
            { startTime: '09:00', endTime: '12:30' },
            { startTime: '14:00', endTime: '18:30' },
        ],
        isTetMode: false,
        description: 'Khu vực Hoài Nhơn',
        isOpen: true,
    },
];

// Pre-created animal lists
export const anNhonAnimals = createAnimalsForThai('thai-an-nhon', 40);
export const nhonPhongAnimals = createAnimalsForThai('thai-nhon-phong', 40);
export const hoaiNhonAnimals = createAnimalsForThai('thai-hoai-nhon', 36);

export const ANIMALS: Animal[] = [...anNhonAnimals, ...nhonPhongAnimals, ...hoaiNhonAnimals];

export function getAnimalsByThai(thaiId: string): Animal[] {
    switch (thaiId) {
        case 'thai-an-nhon':
        case 'an-nhon':
            return anNhonAnimals;
        case 'thai-nhon-phong':
        case 'nhon-phong':
            return nhonPhongAnimals;
        case 'thai-hoai-nhon':
        case 'hoai-nhon':
            return hoaiNhonAnimals;
        default:
            return anNhonAnimals;
    }
}

// Social tasks - configuration (matching HuongDanPage)
export const SOCIAL_TASKS: SocialTask[] = [
    {
        id: 'task-1',
        name: 'Theo dõi Fanpage Cổ Nhơn An Nhơn Bình Định',
        type: 'follow',
        url: 'https://www.facebook.com/profile.php?id=100064448272306',
        isCompleted: false,
        required: true,
    },
    {
        id: 'task-2',
        name: 'Tham gia nhóm Cổ Nhơn An Nhơn Bình Định',
        type: 'follow',
        url: 'https://www.facebook.com/groups/1579571855393409',
        isCompleted: false,
        required: true,
    },
    {
        id: 'task-3',
        name: 'Kết bạn Cậu Ba Họ Nguyễn (Facebook)',
        type: 'follow',
        url: 'https://www.facebook.com/ngoctuan.nguyen.5209',
        isCompleted: false,
        required: true,
    },
    {
        id: 'task-4',
        name: 'Kết bạn Nguyễn Ngọc Tuân (Zalo)',
        type: 'follow',
        url: 'https://zalo.me/0332697909',
        isCompleted: false,
        required: true,
    },
    {
        id: 'task-5',
        name: 'Đăng ký YouTube Cậu Ba Họ Nguyễn Xứ Nẫu',
        type: 'subscribe',
        url: 'https://www.youtube.com/@caubahonguyenxunau3140',
        isCompleted: false,
        required: true,
    },
    {
        id: 'task-6',
        name: 'Like và share bài viết gần nhất',
        type: 'like',
        url: 'https://www.facebook.com/profile.php?id=100064448272306',
        isCompleted: false,
        required: true,
    },
];

