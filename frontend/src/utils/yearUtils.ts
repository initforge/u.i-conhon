// Year utilities for dynamic year generation

/**
 * Lấy năm hiện tại
 */
export const getCurrentYear = (): number => new Date().getFullYear();

/**
 * Generate danh sách năm cho dropdown (từ năm hiện tại đến N năm trước)
 * @param count - Số năm cần generate (default: 4)
 * @returns Array các năm theo thứ tự giảm dần
 */
export const getAvailableYears = (count: number = 4): number[] => {
  const currentYear = getCurrentYear();
  return Array.from({ length: count }, (_, i) => currentYear - i);
};

/**
 * Lấy năm Âm lịch (Can Chi) cho title như "Tết Ất Tỵ 2025"
 * @param year - Năm dương lịch
 * @returns String format "Tết [Can] [Chi] [Year]"
 */
export const getLunarYearTitle = (year: number): string => {
  const can = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
  const chi = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];
  const canIndex = year % 10;
  const chiIndex = year % 12;
  return `Tết ${can[canIndex]} ${chi[chiIndex]} ${year}`;
};

/**
 * Lấy tên Can Chi của năm (không có "Tết" prefix)
 * @param year - Năm dương lịch
 * @returns String format "[Can] [Chi]"
 */
export const getCanChi = (year: number): string => {
  const can = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
  const chi = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];
  const canIndex = year % 10;
  const chiIndex = year % 12;
  return `${can[canIndex]} ${chi[chiIndex]}`;
};
