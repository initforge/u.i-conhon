/**
 * CENTRAL ANIMAL DATA - Single Source of Truth
 * =============================================
 * File này chứa toàn bộ dữ liệu con vật để đảm bảo tính nhất quán
 * Tất cả các pages và components phải import từ đây
 * 
 * Chuẩn bị cho backend integration:
 * - Dữ liệu này sẽ được fetch từ API sau
 * - Giữ interface ổn định để dễ migrate
 */

// ============================================================
// INTERFACES
// ============================================================

export interface Animal {
    order: number;        // Số thứ tự (1-40)
    name: string;         // Tên con vật
    alias: string;        // Biệt danh (Chiếm-Khôi, Bản-Quế, ...)
    theThan?: string;     // Thế thân (con vật đôi)
}

export interface AnimalWithStats extends Animal {
    id: string;
    isEnabled: boolean;
    isBanned: boolean;
    purchaseLimit: number;
    purchased: number;
    purchaseCount: number;
}

// ============================================================
// AN NHƠN / NHƠN PHONG - 40 CON VẬT
// ============================================================

export const ANIMALS_AN_NHON: Animal[] = [
    { order: 1, name: 'Cá Trắng', alias: 'Chiếm-Khôi', theThan: '05' },
    { order: 2, name: 'Ốc', alias: 'Bản-Quế', theThan: '06' },
    { order: 3, name: 'Ngỗng', alias: 'Vinh-Sanh', theThan: '04' },
    { order: 4, name: 'Công', alias: 'Phùng-Xuân', theThan: '03' },
    { order: 5, name: 'Trùn', alias: 'Chí-Cao', theThan: '01' },
    { order: 6, name: 'Cọp', alias: 'Khôn-Sơn', theThan: '02' },
    { order: 7, name: 'Heo', alias: 'Chánh-Thuận', theThan: '08' },
    { order: 8, name: 'Thỏ', alias: 'Nguyệt-Bửu', theThan: '07' },
    { order: 9, name: 'Trâu', alias: 'Hớn-Vân', theThan: '10' },
    { order: 10, name: 'Rồng Bay', alias: 'Giang-Từ', theThan: '09' },
    { order: 11, name: 'Chó', alias: 'Phước-Tôn', theThan: '12' },
    { order: 12, name: 'Ngựa', alias: 'Quang-Minh', theThan: '11' },
    { order: 13, name: 'Voi', alias: 'Hữu-Tài', theThan: '14' },
    { order: 14, name: 'Mèo', alias: 'Chỉ-Đắc', theThan: '13' },
    { order: 15, name: 'Chuột', alias: 'Tất-Khắc', theThan: '16' },
    { order: 16, name: 'Ong', alias: 'Mậu-Lâm', theThan: '15' },
    { order: 17, name: 'Hạc', alias: 'Trọng-Tiên', theThan: '18' },
    { order: 18, name: 'Kỳ Lân', alias: 'Thiên-Thân', theThan: '17' },
    { order: 19, name: 'Bướm', alias: 'Cấn-Ngọc', theThan: '24' },
    { order: 20, name: 'Hòn Núi', alias: 'Trân-Châu', theThan: '23' },
    { order: 21, name: 'Én', alias: 'Thượng-Chiêu', theThan: '22' },
    { order: 22, name: 'Bồ Câu', alias: 'Song-Đồng', theThan: '21' },
    { order: 23, name: 'Khỉ', alias: 'Tam-Hoè', theThan: '20' },
    { order: 24, name: 'Ếch', alias: 'Hiệp-Hải', theThan: '19' },
    { order: 25, name: 'Quạ', alias: 'Cửu-Quan', theThan: '35' },
    { order: 26, name: 'Rồng Nằm', alias: 'Thái-Bình', theThan: '36' },
    { order: 27, name: 'Rùa', alias: 'Hỏa-Diệm', theThan: '28' },
    { order: 28, name: 'Gà', alias: 'Nhựt-Thăng', theThan: '27' },
    { order: 29, name: 'Lươn', alias: 'Địa-Lươn', theThan: '30' },
    { order: 30, name: 'Cá Đỏ', alias: 'Tỉnh-Lợi', theThan: '29' },
    { order: 31, name: 'Tôm', alias: 'Trường-Thọ', theThan: '34' },
    { order: 32, name: 'Rắn', alias: 'Vạn-Kim', theThan: '33' },
    { order: 33, name: 'Nhện', alias: 'Thanh-Tuyền', theThan: '32' },
    { order: 34, name: 'Nai', alias: 'Nguyên-Cát', theThan: '31' },
    { order: 35, name: 'Dê', alias: 'Nhứt-Phẩm', theThan: '25' },
    { order: 36, name: 'Bà Vãi', alias: 'An-Sĩ', theThan: '26' },
    { order: 37, name: 'Ông Trời', alias: 'Thiên-Quan', theThan: '40' },
    { order: 38, name: 'Ông Địa', alias: 'Địa-Chủ', theThan: '39' },
    { order: 39, name: 'Thần Tài', alias: 'Tài-Thần', theThan: '38' },
    { order: 40, name: 'Ông Táo', alias: 'Táo-Quân', theThan: '37' },
];

// ============================================================
// HOÀI NHƠN - 36 CON VẬT
// ============================================================

export const ANIMALS_HOAI_NHON: Animal[] = [
    { order: 1, name: 'Cá Trắng', alias: 'Chiếm-Khôi' },
    { order: 2, name: 'Ốc', alias: 'Bản-Quế' },
    { order: 3, name: 'Ngỗng', alias: 'Vinh-Sanh' },
    { order: 4, name: 'Công', alias: 'Phùng-Xuân' },
    { order: 5, name: 'Trùn', alias: 'Chí-Cao' },
    { order: 6, name: 'Cọp', alias: 'Khôn-Sơn' },
    { order: 7, name: 'Heo', alias: 'Chánh-Thuận' },
    { order: 8, name: 'Thỏ', alias: 'Nguyệt-Bửu' },
    { order: 9, name: 'Trâu', alias: 'Hớn-Vân' },
    { order: 10, name: 'Rồng Bay', alias: 'Giang-Từ' },
    { order: 11, name: 'Chó', alias: 'Phước-Tôn' },
    { order: 12, name: 'Ngựa', alias: 'Quang-Minh' },
    { order: 13, name: 'Voi', alias: 'Hữu-Tài' },
    { order: 14, name: 'Mèo', alias: 'Chỉ-Đắc' },
    { order: 15, name: 'Chuột', alias: 'Tất-Khắc' },
    { order: 16, name: 'Ong', alias: 'Mậu-Lâm' },
    { order: 17, name: 'Hạc', alias: 'Trọng-Tiên' },
    { order: 18, name: 'Kỳ Lân', alias: 'Thiên-Thân' },
    { order: 19, name: 'Bướm', alias: 'Cấn-Ngọc' },
    { order: 20, name: 'Hòn Núi', alias: 'Trân-Châu' },
    { order: 21, name: 'Én', alias: 'Thượng-Chiêu' },
    { order: 22, name: 'Bồ Câu', alias: 'Song-Đồng' },
    { order: 23, name: 'Khỉ', alias: 'Tam-Hoè' },
    { order: 24, name: 'Ếch', alias: 'Hiệp-Hải' },
    { order: 25, name: 'Quạ', alias: 'Cửu-Quan' },
    { order: 26, name: 'Rồng Nằm', alias: 'Thái-Bình' },
    { order: 27, name: 'Rùa', alias: 'Hỏa-Diệm' },
    { order: 28, name: 'Gà', alias: 'Nhựt-Thăng' },
    { order: 29, name: 'Lươn', alias: 'Địa-Lươn' },
    { order: 30, name: 'Cá Đỏ', alias: 'Tỉnh-Lợi' },
    { order: 31, name: 'Tôm', alias: 'Trường-Thọ' },
    { order: 32, name: 'Rắn', alias: 'Vạn-Kim' },
    { order: 33, name: 'Nhện', alias: 'Thanh-Tuyền' },
    { order: 34, name: 'Nai', alias: 'Nguyên-Cát' },
    { order: 35, name: 'Dê', alias: 'Nhứt-Phẩm' },
    { order: 36, name: 'Bà Vãi', alias: 'An-Sĩ' },
];

// ============================================================
// ANIMAL GROUPS (9 Nhóm)
// ============================================================

export const ANIMAL_GROUPS = [
    { id: 'tat-ca', name: 'Tất cả', orders: Array.from({ length: 40 }, (_, i) => i + 1) },
    { id: 'tu-trang-nguyen', name: 'Tứ trạng nguyên', orders: [1, 2, 3, 4] },
    { id: 'ngu-ho-tuong', name: 'Ngũ hổ tướng', orders: [5, 6, 7, 8, 9] },
    { id: 'that-sinh-ly', name: 'Thất sinh lý', orders: [10, 11, 12, 13, 14, 15, 16] },
    { id: 'nhi-dao-si', name: 'Nhị đạo sĩ', orders: [17, 18] },
    { id: 'tu-my-nu', name: 'Tứ mỹ nữ', orders: [19, 20, 21, 22] },
    { id: 'tu-hao-mang', name: 'Tứ hảo mạng', orders: [23, 24, 25, 26] },
    { id: 'tu-hoa-thuong', name: 'Tứ Hòa Thượng', orders: [27, 28, 29, 30] },
    { id: 'ngu-khat-thuc', name: 'Ngũ khất thực', orders: [31, 32, 33, 34, 35] },
    { id: 'nhat-ni-co', name: 'Nhất ni cô', orders: [36] },
    { id: 'tu-than-linh', name: 'Tứ thần linh', orders: [37, 38, 39, 40] },
];

// ============================================================
// THE THAN PAIRS (Đồ hình nhơn)
// ============================================================

export const THE_THAN_PAIRS = [
    { left: [1, 5], right: [9, 10] },   // Thân - Đùi
    { left: [2, 6], right: [8, 7] },    // Thân - Bụng
    { left: [3, 4], right: [11, 12] },  // Vai - Đầu
    { left: [13, 14], right: [15, 16] }, // Cẳng tay - Bàn tay
    { left: [17, 18], right: [19, 24] }, // Đầu gối - Ống chân
    { left: [21, 22], right: [20, 23] }, // Bàn chân
    { left: [25, 35], right: [26, 36] }, // Mắt cá
    { left: [27, 28], right: [29, 30] }, // Đùi dưới
    { left: [31, 34], right: [32, 33] }, // Ống chân dưới
    { left: [37, 40], right: [38, 39] }, // Tứ thần linh
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Lấy danh sách con vật theo Thai
 * @param thaiType 'an-nhon' | 'nhon-phong' | 'hoai-nhon'
 */
export function getAnimalsByThai(thaiType: string): Animal[] {
    if (thaiType === 'hoai-nhon') {
        return ANIMALS_HOAI_NHON;
    }
    return ANIMALS_AN_NHON; // An Nhơn và Nhơn Phong dùng chung 40 con
}

/**
 * Tìm con vật theo order
 */
export function getAnimalByOrder(order: number, thaiType: string = 'an-nhon'): Animal | undefined {
    const animals = getAnimalsByThai(thaiType);
    return animals.find(a => a.order === order);
}

/**
 * Tìm con vật theo tên
 */
export function getAnimalByName(name: string, thaiType: string = 'an-nhon'): Animal | undefined {
    const animals = getAnimalsByThai(thaiType);
    const normalizedName = name.toLowerCase().trim();
    return animals.find(a => a.name.toLowerCase() === normalizedName);
}

/**
 * Lấy thế thân của một con vật
 */
export function getTheThan(order: number): Animal | undefined {
    const animal = ANIMALS_AN_NHON.find(a => a.order === order);
    if (animal?.theThan) {
        return ANIMALS_AN_NHON.find(a => a.order === parseInt(animal.theThan!));
    }
    return undefined;
}

/**
 * Format tên con vật với số thứ tự
 * @example "01. Cá Trắng"
 */
export function formatAnimalName(order: number, thaiType: string = 'an-nhon'): string {
    const animal = getAnimalByOrder(order, thaiType);
    if (!animal) return `${String(order).padStart(2, '0')}. Unknown`;
    return `${String(order).padStart(2, '0')}. ${animal.name}`;
}

/**
 * Lấy danh sách tên con vật (chỉ tên)
 */
export function getAnimalNames(thaiType: string = 'an-nhon'): string[] {
    return getAnimalsByThai(thaiType).map(a => a.name);
}
