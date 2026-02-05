/**
 * ANIMAL_DATA.ts - Định nghĩa đầy đủ 40 con vật Cổ Nhơn
 * 
 * QUAN TRỌNG:
 * - An Nhơn: 40 con (order 1-40)
 * - Nhơn Phong: 40 con (order 1-40)
 * - Hoài Nhơn: 36 con (order 1-36, KHÔNG có Tứ thần linh 37-40)
 * 
 * TỔNG 3 THAI = 116 con (40 + 40 + 36)
 */

// =============================================
// TYPE DEFINITIONS
// =============================================

export type ThaiId = 'an-nhon' | 'nhon-phong' | 'hoai-nhon';

export type AnimalGroup =
    | 'tu-trang-nguyen'   // Tứ trạng nguyên: 1-4
    | 'ngu-ho-tuong'      // Ngũ hổ tướng: 5-9
    | 'that-sinh-ly'      // Thất sinh lý: 10-16
    | 'nhi-dao-si'        // Nhị đạo sĩ: 17-18
    | 'tu-my-nu'          // Tứ mỹ nữ: 19-22
    | 'tu-hao-mang'       // Tứ hảo mạng: 23-26
    | 'tu-hoa-thuong'     // Tứ hòa thượng: 27-30
    | 'ngu-khat-thuc'     // Ngũ khất thực: 31-35
    | 'nhat-ni-co'        // Nhất ni cô: 36
    | 'tu-than-linh';     // Tứ thần linh: 37-40 (CHỈ An Nhơn & Nhơn Phong)

export interface AnimalDefinition {
    order: number;        // Số thứ tự: 1-40
    name: string;         // Tên con vật
    alias: string;        // Tên danh (alias)
    theThan: number;      // Số thứ tự con thế thân
    group: AnimalGroup;   // Nhóm thuộc về
    meaning: string;      // Ý nghĩa
}

// =============================================
// 40 CON VẬT BASE (dùng cho An Nhơn & Nhơn Phong)
// =============================================

export const BASE_40_ANIMALS: AnimalDefinition[] = [
    // TỨ TRẠNG NGUYÊN (1-4)
    { order: 1, name: 'Cá Trắng', alias: 'Chiếm Khôi', theThan: 5, group: 'tu-trang-nguyen', meaning: 'Tượng trưng cho sự trong sáng, thuần khiết và may mắn' },
    { order: 2, name: 'Ốc', alias: 'Bản Quế', theThan: 16, group: 'tu-trang-nguyen', meaning: 'Biểu tượng của sự kiên nhẫn và bền bỉ' },
    { order: 3, name: 'Ngỗng', alias: 'Vinh Sanh', theThan: 32, group: 'tu-trang-nguyen', meaning: 'Đại diện cho sự thủy chung và tình yêu đôi lứa' },
    { order: 4, name: 'Công', alias: 'Phùng Xuân', theThan: 12, group: 'tu-trang-nguyen', meaning: 'Biểu tượng của vẻ đẹp, sự sang trọng và quyền quý' },

    // NGŨ HỔ TƯỚNG (5-9)
    { order: 5, name: 'Trùn', alias: 'Chí Cao', theThan: 1, group: 'ngu-ho-tuong', meaning: 'Tượng trưng cho sự khiêm nhường nhưng có giá trị lớn' },
    { order: 6, name: 'Cọp', alias: 'Khôn Sơn', theThan: 17, group: 'ngu-ho-tuong', meaning: 'Đại diện cho sức mạnh, quyền lực và sự dũng mãnh' },
    { order: 7, name: 'Heo', alias: 'Chánh Thuận', theThan: 24, group: 'ngu-ho-tuong', meaning: 'Biểu tượng của sự sung túc và no đủ' },
    { order: 8, name: 'Thỏ', alias: 'Nguyệt Bửu', theThan: 20, group: 'ngu-ho-tuong', meaning: 'Tượng trưng cho sự nhanh nhẹn và tinh thông' },
    { order: 9, name: 'Trâu', alias: 'Hớn Vân', theThan: 33, group: 'ngu-ho-tuong', meaning: 'Đại diện cho sự cần cù, chăm chỉ và bền bỉ' },

    // THẤT SINH LÝ (10-16)
    { order: 10, name: 'Rồng Bay', alias: 'Giang Tứ', theThan: 18, group: 'that-sinh-ly', meaning: 'Biểu tượng của sự thăng tiến và quyền uy' },
    { order: 11, name: 'Chó', alias: 'Phước Tôn', theThan: 15, group: 'that-sinh-ly', meaning: 'Tượng trưng cho lòng trung thành và tình bạn' },
    { order: 12, name: 'Ngựa', alias: 'Quang Minh', theThan: 4, group: 'that-sinh-ly', meaning: 'Đại diện cho sự thành công và tiến về phía trước' },
    { order: 13, name: 'Voi', alias: 'Hữu Tài', theThan: 14, group: 'that-sinh-ly', meaning: 'Biểu tượng của sức mạnh, trí tuệ và may mắn' },
    { order: 14, name: 'Mèo', alias: 'Chỉ Đắc', theThan: 13, group: 'that-sinh-ly', meaning: 'Tượng trưng cho sự tinh tế và khéo léo' },
    { order: 15, name: 'Chuột', alias: 'Tất Khắc', theThan: 11, group: 'that-sinh-ly', meaning: 'Đại diện cho sự nhanh nhẹn và tiết kiệm' },
    { order: 16, name: 'Ong', alias: 'Mậu Lâm', theThan: 2, group: 'that-sinh-ly', meaning: 'Biểu tượng của sự chăm chỉ và đoàn kết' },

    // NHỊ ĐẠO SĨ (17-18)
    { order: 17, name: 'Hạc', alias: 'Trọng Tiên', theThan: 6, group: 'nhi-dao-si', meaning: 'Tượng trưng cho sự trường thọ và thanh cao' },
    { order: 18, name: 'Kỳ Lân', alias: 'Thiên Thần', theThan: 10, group: 'nhi-dao-si', meaning: 'Đại diện cho điềm lành và sự may mắn lớn' },

    // TỨ MỸ NỮ (19-22)
    { order: 19, name: 'Bướm', alias: 'Cấn Ngọc', theThan: 27, group: 'tu-my-nu', meaning: 'Biểu tượng của sự biến đổi và vẻ đẹp' },
    { order: 20, name: 'Hòn Núi', alias: 'Trân Châu', theThan: 8, group: 'tu-my-nu', meaning: 'Tượng trưng cho sự vững chắc và kiên định' },
    { order: 21, name: 'Én', alias: 'Thượng Chiêu', theThan: 22, group: 'tu-my-nu', meaning: 'Đại diện cho mùa xuân và tin vui' },
    { order: 22, name: 'Bồ Câu', alias: 'Song Đồng', theThan: 21, group: 'tu-my-nu', meaning: 'Biểu tượng của sự hòa bình và yên ấm' },

    // TỨ HẢO MẠNG (23-26)
    { order: 23, name: 'Khỉ', alias: 'Tam Hòe', theThan: 30, group: 'tu-hao-mang', meaning: 'Tượng trưng cho sự thông minh và nhanh nhẹn' },
    { order: 24, name: 'Ếch', alias: 'Hiệp Hải', theThan: 7, group: 'tu-hao-mang', meaning: 'Đại diện cho sự phồn thịnh và sung túc' },
    { order: 25, name: 'Quạ', alias: 'Cửu Quan', theThan: 35, group: 'tu-hao-mang', meaning: 'Biểu tượng của trí tuệ và sự tiên tri' },
    { order: 26, name: 'Rồng Nằm', alias: 'Thái Bình', theThan: 31, group: 'tu-hao-mang', meaning: 'Tượng trưng cho sự an bình và thịnh vượng' },

    // TỨ HÒA THƯỢNG (27-30)
    { order: 27, name: 'Rùa', alias: 'Hỏa Diệm', theThan: 19, group: 'tu-hoa-thuong', meaning: 'Đại diện cho sự trường thọ và kiên nhẫn' },
    { order: 28, name: 'Gà', alias: 'Nhựt Thăng', theThan: 29, group: 'tu-hoa-thuong', meaning: 'Biểu tượng của bình minh và sự thức tỉnh' },
    { order: 29, name: 'Lươn', alias: 'Địa Lươn', theThan: 28, group: 'tu-hoa-thuong', meaning: 'Tượng trưng cho sự linh hoạt và khéo léo' },
    { order: 30, name: 'Cá Đỏ', alias: 'Tỉnh Lợi', theThan: 23, group: 'tu-hoa-thuong', meaning: 'Đại diện cho sự thịnh vượng và may mắn' },

    // NGŨ KHẤT THỰC (31-35)
    { order: 31, name: 'Tôm', alias: 'Trường Thọ', theThan: 26, group: 'ngu-khat-thuc', meaning: 'Biểu tượng của sự sống động và phát triển' },
    { order: 32, name: 'Rắn', alias: 'Vạn Kim', theThan: 3, group: 'ngu-khat-thuc', meaning: 'Tượng trưng cho sự tái sinh và trí tuệ' },
    { order: 33, name: 'Nhện', alias: 'Thanh Tuyền', theThan: 9, group: 'ngu-khat-thuc', meaning: 'Đại diện cho sự kiên nhẫn và sáng tạo' },
    { order: 34, name: 'Nai', alias: 'Nguyên Cát', theThan: 36, group: 'ngu-khat-thuc', meaning: 'Biểu tượng của sự nhẹ nhàng và thanh tao' },
    { order: 35, name: 'Dê', alias: 'Nhứt Phẩm', theThan: 25, group: 'ngu-khat-thuc', meaning: 'Tượng trưng cho sự hiền lành và tốt bụng' },

    // NHẤT NI CÔ (36)
    { order: 36, name: 'Bà Vãi', alias: 'An Sĩ', theThan: 34, group: 'nhat-ni-co', meaning: 'Đại diện cho sự bí ẩn và huyền diệu' },

    // TỨ THẦN LINH (37-40) - CHỈ An Nhơn & Nhơn Phong, KHÔNG có ở Hoài Nhơn
    { order: 37, name: 'Ông Trời', alias: 'Thiên Quan', theThan: 40, group: 'tu-than-linh', meaning: 'Tượng trưng cho quyền năng tối cao và sự che chở' },
    { order: 38, name: 'Ông Địa', alias: 'Địa Chủ', theThan: 39, group: 'tu-than-linh', meaning: 'Biểu tượng của sự phì nhiêu và thịnh vượng' },
    { order: 39, name: 'Thần Tài', alias: 'Tài Thần', theThan: 38, group: 'tu-than-linh', meaning: 'Đại diện cho tài lộc và sự giàu có' },
    { order: 40, name: 'Ông Táo', alias: 'Táo Quân', theThan: 37, group: 'tu-than-linh', meaning: 'Biểu tượng của gia đình và sự bảo hộ' },
];

// =============================================
// THAI CONFIG
// =============================================

export interface ThaiConfig {
    id: ThaiId;
    name: string;
    animalCount: 40 | 36;
    sessions: ('sang' | 'chieu' | 'toi')[];
    hasTetNight: boolean;  // Có buổi tối 21h dịp Tết không
}

export const THAI_CONFIGS: Record<ThaiId, ThaiConfig> = {
    'an-nhon': {
        id: 'an-nhon',
        name: 'Thai An Nhơn',
        animalCount: 40,
        sessions: ['sang', 'chieu'],
        hasTetNight: true,  // Tết có thêm 21h
    },
    'nhon-phong': {
        id: 'nhon-phong',
        name: 'Thai Nhơn Phong',
        animalCount: 40,
        sessions: ['sang', 'chieu'],
        hasTetNight: false,  // Nhơn Phong KHÔNG có buổi tối
    },
    'hoai-nhon': {
        id: 'hoai-nhon',
        name: 'Thai Hoài Nhơn',
        animalCount: 36,
        sessions: ['sang', 'chieu'],
        hasTetNight: false,  // KHÔNG có buổi tối
    },
};

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Lấy danh sách con vật cho 1 Thai cụ thể
 * - An Nhơn / Nhơn Phong: 40 con
 * - Hoài Nhơn: 36 con (bỏ Tứ thần linh)
 */
export function getAnimalsForThai(thaiId: ThaiId): AnimalDefinition[] {
    const config = THAI_CONFIGS[thaiId];
    if (config.animalCount === 36) {
        // Hoài Nhơn: chỉ lấy 36 con đầu
        return BASE_40_ANIMALS.slice(0, 36);
    }
    return BASE_40_ANIMALS;
}

/**
 * Lấy con vật theo order trong 1 Thai
 */
export function getAnimalByOrder(thaiId: ThaiId, order: number): AnimalDefinition | undefined {
    const animals = getAnimalsForThai(thaiId);
    return animals.find(a => a.order === order);
}

/**
 * Lấy tên con vật theo order
 */
export function getAnimalName(order: number): string {
    const animal = BASE_40_ANIMALS.find(a => a.order === order);
    return animal?.name ?? `Con ${order}`;
}

/**
 * Lấy con thế thân
 */
export function getTheThan(order: number): AnimalDefinition | undefined {
    const animal = BASE_40_ANIMALS.find(a => a.order === order);
    if (!animal) return undefined;
    return BASE_40_ANIMALS.find(a => a.order === animal.theThan);
}

/**
 * Lấy danh sách nhóm con vật
 */
export const ANIMAL_GROUPS: { id: AnimalGroup; name: string; orders: number[] }[] = [
    { id: 'tu-trang-nguyen', name: 'Tứ trạng nguyên', orders: [1, 2, 3, 4] },
    { id: 'ngu-ho-tuong', name: 'Ngũ hổ tướng', orders: [5, 6, 7, 8, 9] },
    { id: 'that-sinh-ly', name: 'Thất sinh lý', orders: [10, 11, 12, 13, 14, 15, 16] },
    { id: 'nhi-dao-si', name: 'Nhị đạo sĩ', orders: [17, 18] },
    { id: 'tu-my-nu', name: 'Tứ mỹ nữ', orders: [19, 20, 21, 22] },
    { id: 'tu-hao-mang', name: 'Tứ hảo mạng', orders: [23, 24, 25, 26] },
    { id: 'tu-hoa-thuong', name: 'Tứ hòa thượng', orders: [27, 28, 29, 30] },
    { id: 'ngu-khat-thuc', name: 'Ngũ khất thực', orders: [31, 32, 33, 34, 35] },
    { id: 'nhat-ni-co', name: 'Nhất ni cô', orders: [36] },
    { id: 'tu-than-linh', name: 'Tứ thần linh', orders: [37, 38, 39, 40] },
];

/**
 * Lấy nhóm có sẵn cho Thai (Hoài Nhơn không có Tứ thần linh)
 */
export function getGroupsForThai(thaiId: ThaiId) {
    if (thaiId === 'hoai-nhon') {
        return ANIMAL_GROUPS.filter(g => g.id !== 'tu-than-linh');
    }
    return ANIMAL_GROUPS;
}
